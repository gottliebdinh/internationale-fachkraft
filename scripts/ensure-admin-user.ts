/**
 * Legt den Admin-Benutzer in Supabase Auth + public.users an bzw. aktualisiert Passwort und Rolle.
 * Benötigt: .env.local mit NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD
 *
 * Ausführen: npx tsx scripts/ensure-admin-user.ts
 */
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { ensureAdminUser } from "@/lib/ensure-admin-user";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("Fehlt: NEXT_PUBLIC_SUPABASE_URL oder SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }
  if (!process.env.ADMIN_EMAIL?.trim() || !process.env.ADMIN_PASSWORD) {
    console.error("Fehlt: ADMIN_EMAIL oder ADMIN_PASSWORD in .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { email, wasCreated } = await ensureAdminUser(supabase);
  console.log(
    wasCreated ? "Admin-Benutzer angelegt:" : "Admin-Benutzer aktualisiert:",
    email
  );
  console.log("Profil users.role = admin gesichert.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
