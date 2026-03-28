/**
 * Legt den Admin-Benutzer in Supabase Auth + public.users an bzw. aktualisiert Passwort und Rolle.
 * Benötigt: .env.local mit NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD
 *
 * Ausführen: npx tsx scripts/ensure-admin-user.ts
 */
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!url || !key) {
    console.error("Fehlt: NEXT_PUBLIC_SUPABASE_URL oder SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }
  if (!email || !password) {
    console.error("Fehlt: ADMIN_EMAIL oder ADMIN_PASSWORD in .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let existing:
    | Awaited<
        ReturnType<typeof supabase.auth.admin.listUsers>
      >["data"]["users"][number]
    | undefined;
  for (let page = 1; page <= 20 && !existing; page++) {
    const { data: list, error: listErr } = await supabase.auth.admin.listUsers({
      page,
      perPage: 100,
    });
    if (listErr) {
      console.error(listErr.message);
      process.exit(1);
    }
    existing = list.users.find((u) => u.email?.toLowerCase() === email);
    if (list.users.length < 100) break;
  }

  let userId: string;

  if (existing) {
    userId = existing.id;
    const { error: updErr } = await supabase.auth.admin.updateUserById(
      userId,
      {
        password,
        user_metadata: { ...existing.user_metadata, role: "admin" },
      }
    );
    if (updErr) {
      console.error(updErr.message);
      process.exit(1);
    }
    console.log("Admin-Benutzer aktualisiert:", email);
  } else {
    const { data: created, error: createErr } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role: "admin" },
      });
    if (createErr || !created.user) {
      console.error(createErr?.message ?? "createUser fehlgeschlagen");
      process.exit(1);
    }
    userId = created.user.id;
    console.log("Admin-Benutzer angelegt:", email);
  }

  const { error: profileErr } = await supabase.from("users").upsert(
    {
      id: userId,
      email,
      role: "admin",
    },
    { onConflict: "id" }
  );
  if (profileErr) {
    console.error("public.users:", profileErr.message);
    process.exit(1);
  }

  console.log("Profil users.role = admin gesichert.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
