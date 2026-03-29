import type { SupabaseClient } from "@supabase/supabase-js";

export type EnsureAdminUserResult = {
  email: string;
  password: string;
  wasCreated: boolean;
};

/**
 * Legt den Admin in Supabase Auth + public.users an bzw. aktualisiert Passwort und Rolle.
 * Liest ADMIN_EMAIL / ADMIN_PASSWORD aus process.env.
 */
export async function ensureAdminUser(
  supabase: SupabaseClient
): Promise<EnsureAdminUserResult> {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL und ADMIN_PASSWORD müssen gesetzt sein.");
  }

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
    if (listErr) throw new Error(listErr.message);
    existing = list.users.find((u) => u.email?.toLowerCase() === email);
    if (list.users.length < 100) break;
  }

  let userId: string;
  let wasCreated = false;

  if (existing) {
    userId = existing.id;
    const { error: updErr } = await supabase.auth.admin.updateUserById(
      userId,
      {
        password,
        user_metadata: { ...existing.user_metadata, role: "admin" },
      }
    );
    if (updErr) throw new Error(updErr.message);
  } else {
    const { data: created, error: createErr } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role: "admin" },
      });
    if (createErr || !created.user) {
      throw new Error(createErr?.message ?? "createUser fehlgeschlagen");
    }
    userId = created.user.id;
    wasCreated = true;
  }

  const { error: profileErr } = await supabase.from("users").upsert(
    {
      id: userId,
      email,
      role: "admin",
    },
    { onConflict: "id" }
  );
  if (profileErr) throw new Error(`public.users: ${profileErr.message}`);

  return { email, password, wasCreated };
}
