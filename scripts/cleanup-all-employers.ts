/**
 * Löscht alle Arbeitgeber inkl. Auth-User, Stellen, Matches zu diesen Stellen.
 * Kandidaten, Schulen und Kandidaten-Dokumente bleiben erhalten.
 *
 * Ausführung: npx tsx scripts/cleanup-all-employers.ts --confirm
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
  if (!process.argv.includes("--confirm")) {
    console.error(
      "Abgebrochen. Ausführung: npx tsx scripts/cleanup-all-employers.ts --confirm"
    );
    process.exit(1);
  }

  const { data: rows, error: fetchErr } = await supabase
    .from("users")
    .select("id, email")
    .eq("role", "employer");

  if (fetchErr) throw fetchErr;

  const users = rows ?? [];
  console.log(`${users.length} Arbeitgeber-User gefunden.`);

  for (const u of users) {
    const userId = u.id as string;
    const email = (u as { email?: string }).email ?? userId;
    process.stdout.write(`  Lösche ${email} … `);

    await supabase.from("audit_log").delete().eq("user_id", userId);
    await supabase
      .from("candidate_extractions")
      .update({ verified_by: null })
      .eq("verified_by", userId);
    await supabase
      .from("match_documents")
      .update({ uploaded_by: null })
      .eq("uploaded_by", userId);

    const { error: authErr } = await supabase.auth.admin.deleteUser(userId);
    if (authErr) {
      console.log("FEHLER:", authErr.message);
    } else {
      console.log("OK");
    }
  }

  console.log("Fertig. Kandidaten & Schulen unverändert.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
