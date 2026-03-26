/**
 * Import v2: 2-Phasen-Pipeline (parallelisiert)
 *
 * Phase 1 — Dateien werden parallel analysiert (5 gleichzeitig).
 * Phase 2 — Alle Rohdaten eines Kandidaten → ein sauberes Profil.
 * Profile werden 2 gleichzeitig verarbeitet.
 *
 * Usage:
 *   npx tsx scripts/import-profiles-v2.ts              # alle Profile
 *   npx tsx scripts/import-profiles-v2.ts "le thanh"   # gefiltert
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import path from "node:path";
import fs from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const BUCKET = "candidate-docs";
const PROFILES_DIR = path.resolve(
  __dirname,
  "../Beispielprofile für die Demo - Vertriebsleitung"
);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const MODEL = "gpt-4o";
const PHASE1_CONCURRENCY = 5;
const PROFILE_CONCURRENCY = 2;
const UPLOAD_CONCURRENCY = 5;
const SKIP_EXTENSIONS = new Set([".docx", ".ds_store"]);
const SUPPORTED_EXTENSIONS = new Set([
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
]);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Phase1Result {
  file: string;
  filePath: string;
  fileSize: number;
  mime: string;
  storagePath: string | null;
  analysis: {
    document_class: string;
    has_face: boolean;
    face_quality: number;
    raw_data: Record<string, unknown>;
  } | null;
  error: string | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function pMap<T, R>(
  items: T[],
  fn: (item: T, index: number) => Promise<R>,
  concurrency: number
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const idx = next++;
      results[idx] = await fn(items[idx], idx);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker())
  );
  return results;
}

function mimeType(filepath: string): string {
  const ext = path.extname(filepath).toLowerCase();
  return (
    {
      ".pdf": "application/pdf",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
    }[ext] ?? "application/octet-stream"
  );
}

// ---------------------------------------------------------------------------
// Phase 1: Universal analysis prompt
// ---------------------------------------------------------------------------

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
     - Bei Sprachzertifikat: name, german_level (A1-C2), exam_date, institution, passed, score
     - Bei Lebenslauf: education (Array), work_experience (Array), skills, languages
     - Bei Anschreiben: position_type, desired_position, desired_field, target_company, target_city, motivation_summary (MAX 2-3 kurze Sätze! Nur der Kern: warum dieser Beruf, welche Erfahrung, was ist das Ziel. KEIN Nacherzählen des ganzen Briefs!)
     - Bei Zeugnis: school_name, graduation_date, degree, grade, country
     - Bei Schulzeugnis: school_name, student_name, years_covered, average_grade, country
     - Bei Foto: nur has_face und face_quality relevant
     - Bei allem anderen: alle lesbaren Texte und Daten>
  }
}

Wichtig:
- Datum-Formate immer YYYY-MM-DD
- Nicht lesbare Felder = null
- Bei Anschreiben: Werte GENAU so schreiben wie im Text (keine eigene Kategorisierung)
- NUR valides JSON ausgeben, kein anderer Text`;

async function analyzeFile(filePath: string): Promise<{
  analysis: Phase1Result["analysis"];
  error: string | null;
}> {
  const mime = mimeType(filePath);
  const buf = await fs.readFile(filePath);
  const base64 = buf.toString("base64");

  const isImage = mime.startsWith("image/");
  const isPdf = mime === "application/pdf";
  if (!isImage && !isPdf) {
    return { analysis: null, error: `Unsupported: ${mime}` };
  }

  const contentParts: any[] = [{ type: "text", text: PHASE1_PROMPT }];

  if (isPdf) {
    contentParts.push({
      type: "file",
      file: {
        filename: path.basename(filePath),
        file_data: `data:application/pdf;base64,${base64}`,
      },
    });
  } else {
    contentParts.push({
      type: "image_url",
      image_url: { url: `data:${mime};base64,${base64}`, detail: "high" },
    });
  }

  try {
    const res = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: contentParts }],
      max_tokens: 3000,
      temperature: 0,
    });

    const raw = res.choices[0]?.message?.content ?? "";
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) {
      return { analysis: null, error: `No JSON in response: ${raw.slice(0, 150)}` };
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
  } catch (err) {
    return {
      analysis: null,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

// ---------------------------------------------------------------------------
// Phase 2: Structured merge prompt
// ---------------------------------------------------------------------------

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
  "b1_institution": "...",
  "b1_score": "...",
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
- Namen NICHT in Großbuchstaben, sondern normal: "Nguyen Thi Ngoc Anh" statt "NGUYEN THI NGOC ANH"
- best_photo_file: wähle das Bild mit has_face=true UND dem höchsten face_quality Score. NUR Bilddateien (.jpg, .png, .webp), KEINE PDFs!
- motivation_summary: Fasse die Motivation des Bewerbers in 2-3 kurzen Sätzen zusammen. Nur das Wesentliche: Warum dieser Beruf? Welche Erfahrung bringt die Person mit? Was ist das Ziel?
- Felder ohne Daten = null
- NUR valides JSON, kein anderer Text`;
}

async function mergeProfile(
  folderName: string,
  results: Phase1Result[]
): Promise<{ profile: Record<string, unknown> | null; error: string | null }> {
  const prompt = buildMergePrompt(folderName, results);

  try {
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
  } catch (err) {
    return {
      profile: null,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

// ---------------------------------------------------------------------------
// Map document_class -> DB document_type
// ---------------------------------------------------------------------------

function classToDocType(cls: string): string {
  const map: Record<string, string> = {
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
  return map[cls] ?? "other";
}

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.some((b) => b.name === BUCKET)) {
    await supabase.storage.createBucket(BUCKET, { public: false });
    console.log(`✓ Bucket '${BUCKET}' created`);
  } else {
    console.log(`✓ Bucket '${BUCKET}' exists`);
  }
}

async function uploadFile(
  candidateId: string,
  docType: string,
  filePath: string,
  filename: string,
  index: number
): Promise<string> {
  const ext = path.extname(filename).toLowerCase();
  const storagePath = `${candidateId}/${docType}/${index}${ext}`;
  const buf = await fs.readFile(filePath);
  const mime = mimeType(filePath);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buf, { contentType: mime, upsert: true });

  if (error) throw new Error(`Upload failed: ${error.message}`);
  return storagePath;
}

// ---------------------------------------------------------------------------
// School helper
// ---------------------------------------------------------------------------

async function ensureDemoSchool(): Promise<string> {
  const { data: existing } = await supabase
    .from("schools")
    .select("id")
    .limit(1)
    .maybeSingle();
  if (existing) return existing.id;

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

  if (!userId) throw new Error("No user available");

  const { data: school, error } = await supabase
    .from("schools")
    .insert({
      user_id: userId,
      name: "Demo Import",
      region: "Vietnam",
      contact_person: "Import Script",
      phone: "+84000000000",
    })
    .select("id")
    .single();

  if (error) throw new Error(`School creation failed: ${error.message}`);
  return school.id;
}

// ---------------------------------------------------------------------------
// Process one profile (Phase 1 + 2 + DB + Upload)
// ---------------------------------------------------------------------------

async function processProfile(folder: string, schoolId: string) {
  const t0 = Date.now();
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  ${folder}`);
  console.log(`${"═".repeat(60)}`);

  const folderPath = path.join(PROFILES_DIR, folder);
  const allFiles = await fs.readdir(folderPath);

  // Filter to supported files
  const fileEntries: { file: string; filePath: string; stat: any }[] = [];
  for (const file of allFiles) {
    const ext = path.extname(file).toLowerCase();
    if (SKIP_EXTENSIONS.has(ext) || file === ".DS_Store") continue;
    if (!SUPPORTED_EXTENSIONS.has(ext)) continue;
    const filePath = path.join(folderPath, file);
    const stat = await fs.stat(filePath);
    if (stat.isFile()) fileEntries.push({ file, filePath, stat });
  }

  // ─── Phase 1: Parallel analysis ───
  console.log(`  Phase 1: ${fileEntries.length} Dateien parallel (×${PHASE1_CONCURRENCY})...`);

  const phase1Results = await pMap(
    fileEntries,
    async (entry) => {
      const { analysis, error } = await analyzeFile(entry.filePath);
      const label = analysis
        ? `${analysis.document_class}${analysis.has_face ? ` 👤${analysis.face_quality}` : ""} ${Object.keys(analysis.raw_data).length}F`
        : `✗ ${error?.slice(0, 60)}`;
      console.log(`    ✓ ${entry.file} → ${label}`);
      return {
        file: entry.file,
        filePath: entry.filePath,
        fileSize: entry.stat.size,
        mime: mimeType(entry.filePath),
        storagePath: null as string | null,
        analysis,
        error,
      } satisfies Phase1Result;
    },
    PHASE1_CONCURRENCY
  );

  const successCount = phase1Results.filter((r) => r.analysis).length;
  console.log(`  Phase 1 fertig: ${successCount}/${phase1Results.length} (${((Date.now() - t0) / 1000).toFixed(1)}s)`);

  // ─── Phase 2: Merge ───
  const { profile, error: mergeError } = await mergeProfile(folder, phase1Results);

  if (!profile) {
    console.error(`  ✗ Merge fehlgeschlagen: ${mergeError}`);
    return;
  }

  console.log(`  ✓ ${profile.first_name} ${profile.last_name} | ${profile.german_level} | ${profile.desired_position} | ${profile.desired_field}`);
  console.log(`    Motivation: ${String(profile.motivation_summary ?? "—").slice(0, 120)}`);

  // ─── DB: Create candidate ───
  const { data: candidate, error: candErr } = await supabase
    .from("candidates")
    .insert({
      school_id: schoolId,
      first_name: profile.first_name ?? folder.split(" - ")[0],
      last_name: profile.last_name ?? "",
      date_of_birth: profile.date_of_birth ?? "2000-01-01",
      nationality: String(profile.nationality ?? "VN"),
      gender: profile.gender ?? null,
      passport_number: profile.passport_number ?? null,
      passport_expiry: profile.passport_expiry ?? null,
      german_level: profile.german_level ?? "A1",
      b1_certificate_date: profile.b1_exam_date ?? null,
      education_level: profile.education_level ?? null,
      work_experience_years:
        typeof profile.work_experience_years === "number"
          ? profile.work_experience_years
          : 0,
      position_type: profile.position_type ?? null,
      desired_position: profile.desired_position ?? null,
      desired_field: profile.desired_field ?? null,
      specialization: "other",
      availability_date: "2026-06-01",
      status: "draft",
    })
    .select("id")
    .single();

  if (candErr) {
    console.error(`  ✗ Kandidat: ${candErr.message}`);
    return;
  }

  const candidateId = candidate.id;

  // ─── Parallel upload + DB insert ───
  let bestPhotoPath: string | null = null;

  await pMap(
    phase1Results,
    async (r, i) => {
      const docType = r.analysis ? classToDocType(r.analysis.document_class) : "other";

      let storagePath: string;
      try {
        storagePath = await uploadFile(candidateId, docType, r.filePath, r.file, i);
      } catch (err) {
        console.error(`  ✗ Upload ${r.file}: ${err instanceof Error ? err.message : err}`);
        return;
      }

      r.storagePath = storagePath;

      const publicUrl = supabase.storage
        .from(BUCKET)
        .getPublicUrl(storagePath).data.publicUrl;

      await supabase.from("candidate_documents").insert({
        candidate_id: candidateId,
        document_type: docType,
        file_url: publicUrl,
        file_name: r.file,
        original_file_name: r.file,
        file_size_bytes: r.fileSize,
        mime_type: r.mime,
        storage_path: storagePath,
        extracted_data: r.analysis?.raw_data ?? null,
        extraction_status: r.analysis ? "completed" : r.error ? "failed" : "skipped",
        extraction_model: r.analysis ? MODEL : null,
        extraction_error: r.error,
      });

      if (profile.best_photo_file && r.file === profile.best_photo_file) {
        bestPhotoPath = storagePath;
      }
    },
    UPLOAD_CONCURRENCY
  );

  if (bestPhotoPath) {
    await supabase
      .from("candidates")
      .update({ profile_photo_url: bestPhotoPath })
      .eq("id", candidateId);
  }

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`  ✓ Fertig in ${elapsed}s — ${phase1Results.length} Dateien, Foto: ${bestPhotoPath ? "ja" : "nein"}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const t0 = Date.now();
  console.log("=== GeVin Import v2 (parallel) ===\n");

  await ensureBucket();
  const schoolId = await ensureDemoSchool();
  console.log(`✓ School: ${schoolId}\n`);

  const folderFilter = process.argv[2]?.trim().toLowerCase();
  const allFolders = await fs.readdir(PROFILES_DIR, { withFileTypes: true });
  let profileDirs = allFolders
    .filter((f) => f.isDirectory())
    .map((f) => f.name);
  if (folderFilter) {
    profileDirs = profileDirs.filter((n) =>
      n.toLowerCase().includes(folderFilter)
    );
  }

  console.log(`${profileDirs.length} Profile gefunden → ${PROFILE_CONCURRENCY} parallel\n`);

  await pMap(
    profileDirs,
    async (folder) => processProfile(folder, schoolId),
    PROFILE_CONCURRENCY
  );

  const totalSec = ((Date.now() - t0) / 1000).toFixed(0);
  console.log(`\n${"═".repeat(60)}`);
  console.log(`=== Import abgeschlossen in ${totalSec}s ===`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
