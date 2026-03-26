/**
 * Deletes ALL candidates + their documents, then empties the storage bucket.
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function main() {
  console.log("Deleting all candidate_extractions...");
  await supabase.from("candidate_extractions").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  console.log("Deleting all candidate_documents...");
  await supabase.from("candidate_documents").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  console.log("Deleting all candidates...");
  const { data: deleted, error } = await supabase.from("candidates").delete().neq("id", "00000000-0000-0000-0000-000000000000").select("id");
  if (error) console.error(error.message);
  else console.log(`${deleted?.length ?? 0} candidates deleted.`);

  console.log("Cleaning storage bucket...");
  const BUCKET = "candidate-docs";
  const { data: folders } = await supabase.storage.from(BUCKET).list("", { limit: 1000 });
  if (folders) {
    for (const f of folders) {
      const { data: subFiles } = await supabase.storage.from(BUCKET).list(f.name, { limit: 1000 });
      if (subFiles) {
        for (const sub of subFiles) {
          const subPath = `${f.name}/${sub.name}`;
          const { data: innerFiles } = await supabase.storage.from(BUCKET).list(subPath, { limit: 1000 });
          if (innerFiles && innerFiles.length > 0) {
            const paths = innerFiles.map((file) => `${subPath}/${file.name}`);
            await supabase.storage.from(BUCKET).remove(paths);
          } else {
            await supabase.storage.from(BUCKET).remove([subPath]);
          }
        }
      }
      await supabase.storage.from(BUCKET).remove([f.name]);
    }
  }

  console.log("Done.");
}

main().catch((e) => { console.error(e); process.exit(1); });
