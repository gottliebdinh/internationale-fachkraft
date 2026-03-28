import OpenAI from "openai";
import sharp from "sharp";
import type { SupabaseClient } from "@supabase/supabase-js";

const MODEL = "gpt-4o";
const BUCKET = "candidate-docs";
const IMAGE_MAX_DIMENSION = 1600;
const IMAGE_WEBP_QUALITY = 72;

const SUPPORTED_EXTENSIONS = new Set([
  ".pdf", ".jpg", ".jpeg", ".png", ".webp",
]);

const SKIP_EXTENSIONS = new Set([".docx", ".ds_store"]);

export interface FileInput {
  name: string;
  buffer: Buffer;
  mime: string;
}

export interface AnalysisResult {
  document_class: string;
  has_face: boolean;
  face_quality: number;
  raw_data: Record<string, unknown>;
}

export interface Phase1Result {
  file: string;
  fileSize: number;
  mime: string;
  analysis: AnalysisResult | null;
  error: string | null;
}

export type ImportEvent =
  | { type: "start"; total: number }
  | { type: "analyzing"; file: string; index: number }
  | { type: "analyzed"; file: string; index: number; docClass: string | null; hasFace: boolean; error: string | null }
  | { type: "merging" }
  | { type: "merged"; name: string; germanLevel: string; position: string | null }
  | { type: "uploading"; file: string; index: number }
  | { type: "uploaded"; file: string; index: number }
  | { type: "done"; candidateId: string }
  | { type: "error"; message: string };

export function isSupported(filename: string): boolean {
  const ext = extOf(filename);
  return !SKIP_EXTENSIONS.has(ext) && SUPPORTED_EXTENSIONS.has(ext);
}

function extOf(filename: string): string {
  const i = filename.lastIndexOf(".");
  return i >= 0 ? filename.slice(i).toLowerCase() : "";
}

const IMAGE_EXT_FOR_AVATAR = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function fileBasenameKey(name: string): string {
  const n = name.normalize("NFC").replace(/\\/g, "/").trim().toLowerCase();
  const seg = n.split("/").filter(Boolean);
  return seg[seg.length - 1] ?? n;
}

/** Same intent as CLI: exact match, but tolerate LLM/OS filename drift (case, NFC, optional path segment). */
export function matchesBestPhotoFile(rFile: string, best: unknown): boolean {
  if (best == null || typeof best !== "string") return false;
  const b = best.trim();
  if (!b) return false;
  if (rFile === b) return true;
  if (fileBasenameKey(rFile) === fileBasenameKey(b)) return true;
  const rf = rFile.normalize("NFC").replace(/\\/g, "/");
  const bf = b.normalize("NFC").replace(/\\/g, "/");
  if (rf.endsWith(bf) || bf.endsWith(rf)) return true;
  return false;
}

/**
 * If merge JSON did not match any uploaded file name, pick the same rule as the prompt:
 * image with has_face and highest face_quality among successful uploads.
 */
export function pickBestPhotoStoragePathFallback(
  phase1: Phase1Result[],
  uploadedPaths: (string | null)[]
): string | null {
  let bestIdx = -1;
  let bestScore = -1;
  for (let i = 0; i < phase1.length; i++) {
    const path = uploadedPaths[i];
    if (!path) continue;
    const r = phase1[i];
    const a = r.analysis;
    if (!a?.has_face) continue;
    if (!IMAGE_EXT_FOR_AVATAR.has(extOf(r.file))) continue;
    const q = a.face_quality;
    if (q > bestScore) {
      bestScore = q;
      bestIdx = i;
    }
  }
  return bestIdx >= 0 ? uploadedPaths[bestIdx]! : null;
}

function mimeFromExt(filename: string): string {
  const m: Record<string, string> = {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
  };
  return m[extOf(filename)] ?? "application/octet-stream";
}

const CLASS_TO_DOCTYPE: Record<string, string> = {
  reisepass: "passport",
  sprachzertifikat: "b1_certificate",
  lebenslauf: "cv",
  zeugnis_abitur: "diploma",
  anschreiben: "cover_letter",
  schulzeugnis: "school_records",
  bewerbungsfoto: "photo",
  gesundheitszeugnis: "health_certificate",
  bewerbungsmappe: "application_bundle",
  unterschrift: "other",
  sonstiges: "other",
};

const PHASE1_PROMPT = `Du bist ein Dokumenten-Analyst. Analysiere dieses Dokument/Bild vollständig.

Antworte NUR als JSON mit genau diesem Schema:
{
  "document_class": "<einer von: reisepass, sprachzertifikat, lebenslauf, zeugnis_abitur, anschreiben, schulzeugnis, bewerbungsfoto, gesundheitszeugnis, bewerbungsmappe, unterschrift, sonstiges>",
  "has_face": <true wenn ein klar erkennbares menschliches Gesicht/Porträtfoto sichtbar ist, sonst false>,
  "face_quality": <0-100, nur wenn has_face=true, sonst 0. Höher = besseres Porträtfoto (frontal, scharf, einzelne Person)>,
  "raw_data": {
    <Extrahiere ALLE lesbaren Informationen als key-value Paare.
     Verwende sinnvolle Feldnamen auf Deutsch oder Englisch, z.B.:
     - Bei Reisepass: full_name, date_of_birth, nationality, passport_number, passport_expiry, gender, place_of_birth
     - Bei Sprachzertifikat: name, german_level (A1-C2), exam_date
     - Bei Lebenslauf: education (Array), skills, languages
     - Bei Anschreiben: position_type, desired_position, desired_field, target_company, target_city, motivation_summary (MAX 2-3 kurze Sätze! Nur der Kern: warum dieser Beruf, welche Erfahrung, was ist das Ziel. KEIN Nacherzählen des ganzen Briefs!)
     - Bei Zeugnis: school_name, graduation_date, degree
     - Bei Schulzeugnis: school_name, student_name, years_covered
     - Bei Foto: nur has_face und face_quality relevant
     - Bei allem anderen: alle lesbaren Texte und Daten>
  }
}

Wichtig:
- Datum-Formate immer YYYY-MM-DD
- Nicht lesbare Felder = null
- Bei Anschreiben: Werte GENAU so schreiben wie im Text (keine eigene Kategorisierung)
- NUR valides JSON ausgeben, kein anderer Text`;

function buildMergePrompt(
  folderName: string,
  results: Phase1Result[]
): string {
  const docs = results
    .filter((r) => r.analysis)
    .map((r, i) => ({
      index: i + 1,
      file: r.file,
      class: r.analysis!.document_class,
      has_face: r.analysis!.has_face,
      face_quality: r.analysis!.face_quality,
      data: r.analysis!.raw_data,
    }));

  return `Du bist ein Profil-Manager. Hier sind alle analysierten Dokumente eines Bewerbers.
Ordnername: "${folderName}"

Dokumente:
${JSON.stringify(docs, null, 2)}

Erstelle daraus EIN sauberes, strukturiertes Kandidatenprofil als JSON:
{
  "first_name": "Vorname(n)",
  "last_name": "Nachname",
  "date_of_birth": "YYYY-MM-DD",
  "nationality": "z.B. Vietnamesisch",
  "gender": "male | female",
  "passport_number": "...",
  "passport_expiry": "YYYY-MM-DD",
  "place_of_birth": "...",
  "german_level": "A1-C2",
  "b1_exam_date": "YYYY-MM-DD",
  "education_level": "z.B. Abitur, Bachelor",
  "school_name": "...",
  "graduation_date": "YYYY-MM-DD",
  "position_type": "genau wie im Anschreiben, z.B. Ausbildungsplatz, Fachkraft, Saisonkraft",
  "desired_position": "genau wie im Anschreiben, z.B. Koch, Restaurantfachfrau, Fachverkäuferin im Supermarkt",
  "desired_field": "genau wie im Anschreiben, z.B. Gastronomie, Einzelhandel, Pflege",
  "target_company": "falls im Anschreiben genannt",
  "target_city": "falls im Anschreiben genannt",
  "work_experience_years": <Anzahl>,
  "motivation_summary": "MAX 2-3 kurze Sätze: Kern-Motivation, relevante Erfahrung, berufliches Ziel. NICHT den ganzen Brief nacherzählen!",
  "best_photo_file": "<Dateiname des besten Porträtfotos mit Gesicht, oder null wenn keins>"
}

Regeln:
- Reisepass hat Vorrang für Name, Geburtsdatum, Nationalität, Geschlecht
- Bei Konflikten: das zuverlässigere Dokument bevorzugen (Pass > CV > Anschreiben)
- Nationalität IMMER als lesbares Wort schreiben (z.B. "Vietnamesisch" statt "VNM")
- KEINE Großbuchstaben-Wörter! Immer normale Schreibweise
- best_photo_file: wähle das Bild mit has_face=true UND dem höchsten face_quality Score. NUR Bilddateien (.jpg, .png, .webp), KEINE PDFs!
- motivation_summary: Fasse die Motivation des Bewerbers in 2-3 kurzen Sätzen zusammen
- Felder ohne Daten = null
- NUR valides JSON, kein anderer Text`;
}

async function analyzeBuffer(
  openai: OpenAI,
  filename: string,
  buffer: Buffer,
  mime: string
): Promise<{ analysis: AnalysisResult | null; error: string | null }> {
  const base64 = buffer.toString("base64");
  const isImage = mime.startsWith("image/");
  const isPdf = mime === "application/pdf";
  if (!isImage && !isPdf) {
    return { analysis: null, error: `Unsupported: ${mime}` };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contentParts: any[] = [{ type: "text", text: PHASE1_PROMPT }];
  if (isPdf) {
    contentParts.push({
      type: "file",
      file: { filename, file_data: `data:application/pdf;base64,${base64}` },
    });
  } else {
    contentParts.push({
      type: "image_url",
      image_url: { url: `data:${mime};base64,${base64}`, detail: "high" },
    });
  }

  const res = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: contentParts }],
    max_tokens: 3000,
    temperature: 0,
  });

  const raw = res.choices[0]?.message?.content ?? "";
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) {
    return { analysis: null, error: `No JSON: ${raw.slice(0, 150)}` };
  }
  const parsed = JSON.parse(match[0]);
  return {
    analysis: {
      document_class: parsed.document_class ?? "sonstiges",
      has_face: Boolean(parsed.has_face),
      face_quality: typeof parsed.face_quality === "number" ? parsed.face_quality : 0,
      raw_data: parsed.raw_data ?? {},
    },
    error: null,
  };
}

async function mergeProfile(
  openai: OpenAI,
  folderName: string,
  results: Phase1Result[]
): Promise<{ profile: Record<string, unknown> | null; error: string | null }> {
  const prompt = buildMergePrompt(folderName, results);
  const res = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 2000,
    temperature: 0,
  });
  const raw = res.choices[0]?.message?.content ?? "";
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) {
    return { profile: null, error: `No JSON: ${raw.slice(0, 150)}` };
  }
  return { profile: JSON.parse(match[0]), error: null };
}

async function ensureSchool(supabase: SupabaseClient): Promise<string> {
  const { data: existing } = await supabase
    .from("schools")
    .select("id")
    .limit(1)
    .maybeSingle();
  if (existing?.id) return existing.id;

  let userId: string | null = null;
  const { data: schoolUser } = await supabase
    .from("users")
    .select("id")
    .eq("role", "school")
    .limit(1)
    .maybeSingle();
  if (schoolUser) {
    userId = schoolUser.id;
  } else {
    const { data: anyUser } = await supabase
      .from("users")
      .select("id")
      .limit(1)
      .maybeSingle();
    if (anyUser) userId = anyUser.id;
  }
  if (!userId) throw new Error("No user available for school");

  const { data: school, error } = await supabase
    .from("schools")
    .insert({
      user_id: userId,
      name: "Demo Import",
      region: "Vietnam",
      contact_person: "Import",
      phone: "+84000000000",
    })
    .select("id")
    .single();
  if (error) throw new Error(`School: ${error.message}`);
  return school.id;
}

/**
 * Runs the full import pipeline for one candidate folder.
 * Calls `emit` for each progress event (designed for SSE streaming).
 */
export async function runImportPipeline(opts: {
  supabase: SupabaseClient;
  openaiKey: string;
  folderName: string;
  files: FileInput[];
  emit: (event: ImportEvent) => void;
}): Promise<void> {
  const { supabase, folderName, files, emit } = opts;
  const openai = new OpenAI({ apiKey: opts.openaiKey });

  const supported = files.filter((f) => isSupported(f.name));
  if (supported.length === 0) {
    emit({ type: "error", message: "Keine unterstützten Dateien gefunden (.pdf, .jpg, .png, .webp)." });
    return;
  }

  emit({ type: "start", total: supported.length });

  const phase1: Phase1Result[] = [];
  for (let i = 0; i < supported.length; i++) {
    const f = supported[i];
    emit({ type: "analyzing", file: f.name, index: i });
    try {
      const { analysis, error } = await analyzeBuffer(openai, f.name, f.buffer, f.mime);
      const r: Phase1Result = {
        file: f.name,
        fileSize: f.buffer.byteLength,
        mime: f.mime,
        analysis,
        error,
      };
      phase1.push(r);
      emit({
        type: "analyzed",
        file: f.name,
        index: i,
        docClass: analysis?.document_class ?? null,
        hasFace: analysis?.has_face ?? false,
        error,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      phase1.push({ file: f.name, fileSize: f.buffer.byteLength, mime: f.mime, analysis: null, error: msg });
      emit({ type: "analyzed", file: f.name, index: i, docClass: null, hasFace: false, error: msg });
    }
  }

  emit({ type: "merging" });
  const { profile, error: mergeError } = await mergeProfile(openai, folderName, phase1);
  if (!profile) {
    emit({ type: "error", message: mergeError ?? "Profil konnte nicht erstellt werden." });
    return;
  }

  const firstName = String(profile.first_name ?? folderName.split(" - ")[0]);
  const lastName = String(profile.last_name ?? "");
  emit({
    type: "merged",
    name: `${firstName} ${lastName}`.trim(),
    germanLevel: String(profile.german_level ?? "A1"),
    position: profile.desired_position ? String(profile.desired_position) : null,
  });

  const schoolId = await ensureSchool(supabase);

  const { data: candidate, error: candErr } = await supabase
    .from("candidates")
    .insert({
      school_id: schoolId,
      first_name: firstName,
      last_name: lastName,
      date_of_birth: profile.date_of_birth ?? "2000-01-01",
      nationality: String(profile.nationality ?? "VN"),
      gender: profile.gender ?? null,
      passport_number: profile.passport_number ?? null,
      passport_expiry: profile.passport_expiry ?? null,
      german_level: profile.german_level ?? "A1",
      b1_certificate_date: profile.b1_exam_date ?? null,
      education_level: profile.education_level ?? null,
      work_experience_years:
        typeof profile.work_experience_years === "number" ? profile.work_experience_years : 0,
      position_type: profile.position_type ?? null,
      desired_position: profile.desired_position ?? null,
      desired_field: profile.desired_field ?? null,
      specialization: "other",
      availability_date: "2026-06-01",
      status: "active",
    })
    .select("id")
    .single();

  if (candErr) {
    emit({ type: "error", message: candErr.message });
    return;
  }

  const candidateId = candidate.id;
  let bestPhotoPath: string | null = null;
  const uploadedStoragePaths: (string | null)[] = new Array(phase1.length).fill(null);

  for (let i = 0; i < phase1.length; i++) {
    const r = phase1[i];
    const docType = r.analysis ? (CLASS_TO_DOCTYPE[r.analysis.document_class] ?? "other") : "other";
    const fileInput = supported[i];

    emit({ type: "uploading", file: r.file, index: i });

    let storagePath: string;
    let finalSize = fileInput.buffer.byteLength;
    let finalMime = fileInput.mime;

    const ext = extOf(r.file);
    let uploadBuffer: Uint8Array = fileInput.buffer;
    let uploadExt = ext;

    if (fileInput.mime.startsWith("image/")) {
      try {
        uploadBuffer = await sharp(fileInput.buffer)
          .rotate()
          .resize({ width: IMAGE_MAX_DIMENSION, height: IMAGE_MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
          .webp({ quality: IMAGE_WEBP_QUALITY })
          .toBuffer();
        uploadExt = ".webp";
        finalMime = "image/webp";
        finalSize = uploadBuffer.byteLength;
      } catch {
        uploadBuffer = fileInput.buffer;
      }
    }

    storagePath = `${candidateId}/${docType}/${i}${uploadExt}`;
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, uploadBuffer, { contentType: finalMime, upsert: true });

    if (upErr) {
      emit({ type: "analyzed", file: r.file, index: i, docClass: null, hasFace: false, error: upErr.message });
      continue;
    }

    uploadedStoragePaths[i] = storagePath;

    const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(storagePath).data.publicUrl;

    await supabase.from("candidate_documents").insert({
      candidate_id: candidateId,
      document_type: docType,
      file_url: publicUrl,
      file_name: r.file,
      original_file_name: r.file,
      file_size_bytes: finalSize,
      mime_type: finalMime,
      storage_path: storagePath,
      extracted_data: r.analysis?.raw_data ?? null,
      extraction_status: r.analysis ? "completed" : r.error ? "failed" : "skipped",
      extraction_model: r.analysis ? MODEL : null,
      extraction_error: r.error,
    });

    if (matchesBestPhotoFile(r.file, profile.best_photo_file)) {
      bestPhotoPath = storagePath;
    }

    emit({ type: "uploaded", file: r.file, index: i });
  }

  if (!bestPhotoPath) {
    bestPhotoPath = pickBestPhotoStoragePathFallback(phase1, uploadedStoragePaths);
  }

  if (bestPhotoPath) {
    await supabase
      .from("candidates")
      .update({ profile_photo_url: bestPhotoPath })
      .eq("id", candidateId);
  }

  emit({ type: "done", candidateId });
}
