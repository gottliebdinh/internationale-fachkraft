/**
 * Deletes ALL candidates + their documents + extractions, then empties the storage bucket.
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const BUCKET = "candidate-docs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

/** Struktur: uuid/docType/datei — alle Dateipfade sammeln, in Batches löschen */
async function emptyCandidateDocsBucket(): Promise<void> {
  const { data: roots, error: e0 } = await supabase.storage
    .from(BUCKET)
    .list("", { limit: 1000 });
  if (e0) {
    console.error("Storage list root:", e0.message);
    return;
  }

  const paths: string[] = [];
  for (const r of roots ?? []) {
    const uuidPath = r.name;
    const { data: docTypes } = await supabase.storage
      .from(BUCKET)
      .list(uuidPath, { limit: 200 });
    for (const dt of docTypes ?? []) {
      const mid = `${uuidPath}/${dt.name}`;
      const { data: files } = await supabase.storage
        .from(BUCKET)
        .list(mid, { limit: 500 });
      for (const f of files ?? []) {
        paths.push(`${mid}/${f.name}`);
      }
    }
  }

  const chunk = 100;
  for (let i = 0; i < paths.length; i += chunk) {
    const batch = paths.slice(i, i + chunk);
    const { error } = await supabase.storage.from(BUCKET).remove(batch);
    if (error) console.error("remove batch:", error.message);
  }
  console.log(`Storage: ${paths.length} Dateien entfernt.`);
}

async function main() {
  console.log("Deleting all candidate_extractions...");
  await supabase
    .from("candidate_extractions")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  console.log("Deleting all candidate_documents...");
  await supabase
    .from("candidate_documents")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  console.log("Deleting all candidates...");
  const { data: deleted, error } = await supabase
    .from("candidates")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000")
    .select("id");
  if (error) console.error(error.message);
  else console.log(`${deleted?.length ?? 0} candidates deleted.`);

  console.log("Cleaning storage bucket...");
  await emptyCandidateDocsBucket();

  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
