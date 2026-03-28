/**
 * Stellt Kandidaten + candidate_documents aus dem Storage-Bucket wieder her
 * (Pfade bleiben: candidateId/docType/… wie beim Original-Import).
 *
 * Legt bei Bedarf einen Schul-User + Schule an (wie früher „Demo Import“).
 *
 *   npx tsx scripts/reimport-from-storage.ts
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "candidate-docs";
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const VALID_DOC_TYPES = new Set([
  "passport",
  "b1_certificate",
  "cv",
  "diploma",
  "health_certificate",
  "video",
  "other",
  "cover_letter",
  "school_records",
  "photo",
  "application_bundle",
]);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

function normalizeDocType(folder: string): string {
  const f = folder.toLowerCase();
  if (VALID_DOC_TYPES.has(f)) return f;
  return "other";
}

async function ensureSchool(): Promise<string> {
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
  if (schoolUser) userId = schoolUser.id;

  if (!userId) {
    const email =
      process.env.REIMPORT_SCHOOL_EMAIL?.trim() ||
      `school-reimport-${Date.now()}@gevin.local`;
    const password = crypto.randomBytes(24).toString("base64url");
    const { data: authData, error: authErr } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role: "school" },
      });
    if (authErr) throw new Error(`Auth Schul-User: ${authErr.message}`);
    userId = authData.user?.id ?? null;
    if (!userId) throw new Error("Keine User-ID nach createUser");
    console.log(`✓ Schul-User angelegt: ${email}`);
  }

  const { data: school, error: schErr } = await supabase
    .from("schools")
    .insert({
      user_id: userId,
      name: "Demo Import (Reimport)",
      region: "Vietnam",
      contact_person: "Reimport",
      phone: "+84000000000",
    })
    .select("id")
    .single();
  if (schErr) throw new Error(`Schule: ${schErr.message}`);
  console.log(`✓ Schule angelegt: ${school.id}`);
  return school.id;
}

async function listRootCandidateIds(): Promise<string[]> {
  const { data: entries, error } = await supabase.storage
    .from(BUCKET)
    .list("", { limit: 1000 });
  if (error) throw error;
  const ids = (entries ?? [])
    .map((e) => e.name)
    .filter((n) => UUID_RE.test(n));
  return ids.sort();
}

async function restoreCandidate(schoolId: string, candidateId: string) {
  const { data: existing } = await supabase
    .from("candidates")
    .select("id")
    .eq("id", candidateId)
    .maybeSingle();
  if (existing) {
    console.log(`  überspringe (existiert): ${candidateId}`);
    return;
  }

  const { data: cand, error: candErr } = await supabase
    .from("candidates")
    .insert({
      id: candidateId,
      school_id: schoolId,
      first_name: "Wiederhergestellt",
      last_name: candidateId.slice(0, 8),
      date_of_birth: "2000-01-01",
      nationality: "VN",
      specialization: "other",
      german_level: "A1",
      availability_date: "2026-06-01",
      status: "active",
    })
    .select("id")
    .single();

  if (candErr) {
    console.error(`  ✗ Kandidat ${candidateId}: ${candErr.message}`);
    return;
  }

  const { data: sub } = await supabase.storage
    .from(BUCKET)
    .list(candidateId, { limit: 100 });

  let photoPath: string | null = null;

  for (const entry of sub ?? []) {
    const docFolder = entry.name;
    if (!docFolder) continue;
    const subPath = `${candidateId}/${docFolder}`;
    const docType = normalizeDocType(docFolder);

    const { data: files } = await supabase.storage
      .from(BUCKET)
      .list(subPath, { limit: 200 });

    for (const f of files ?? []) {
      if (!f.name) continue;
      const storagePath = `${subPath}/${f.name}`;
      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

      const { error: docErr } = await supabase.from("candidate_documents").insert({
        candidate_id: cand.id,
        document_type: docType,
        file_url: publicUrl,
        file_name: f.name,
        original_file_name: f.name,
        storage_path: storagePath,
        extraction_status: "skipped",
      });
      if (docErr) {
        console.error(`    ✗ Doc ${storagePath}: ${docErr.message}`);
        continue;
      }
      if (docType === "photo" && !photoPath) photoPath = storagePath;
    }
  }

  if (photoPath) {
    await supabase
      .from("candidates")
      .update({ profile_photo_url: photoPath })
      .eq("id", candidateId);
  }

  console.log(`  ✓ ${candidateId} (${photoPath ? "mit Foto" : "ohne Foto"})`);
}

async function main() {
  console.log("=== Reimport aus Storage ===\n");
  const schoolId = await ensureSchool();
  console.log(`✓ school_id: ${schoolId}\n`);

  const ids = await listRootCandidateIds();
  console.log(`${ids.length} Kandidaten-Ordner im Bucket\n`);

  for (const id of ids) {
    await restoreCandidate(schoolId, id);
  }

  console.log("\nFertig.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
