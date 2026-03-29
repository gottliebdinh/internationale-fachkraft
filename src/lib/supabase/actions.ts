"use server";

import { timingSafeEqual } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPublicSiteUrl } from "@/lib/site-url";
import { ensureAdminUser } from "@/lib/ensure-admin-user";
import { createAdminClient } from "./admin";
import { createClient } from "./server";

function safeEqualPassword(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  const redirectParam = formData.get("redirect");
  const isAdminLogin =
    typeof redirectParam === "string" &&
    redirectParam.startsWith("/admin") &&
    !redirectParam.startsWith("//");

  const envAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const envAdminPassword = process.env.ADMIN_PASSWORD;

  const useEnvAdmin =
    isAdminLogin &&
    Boolean(envAdminEmail) &&
    Boolean(envAdminPassword && envAdminPassword.length > 0);

  // Admin-Konto aus ENV gilt nur über /admin/login (ensureAdminUser + Session dort).
  // Normale Anmeldung: keine Anmeldung mit derselben Admin-E-Mail, wenn ENV gesetzt ist.
  if (
    !isAdminLogin &&
    Boolean(envAdminEmail) &&
    Boolean(envAdminPassword && envAdminPassword.length > 0) &&
    email === envAdminEmail
  ) {
    return { error: "Ungültige Anmeldedaten." };
  }

  if (useEnvAdmin) {
    if (email !== envAdminEmail || !safeEqualPassword(password, envAdminPassword!)) {
      return { error: "Ungültige Anmeldedaten." };
    }
    try {
      await ensureAdminUser(createAdminClient());
    } catch (e) {
      console.error(
        "[signIn] ensureAdminUser:",
        e instanceof Error ? e.message : e
      );
      return {
        error:
          "Admin-Anmeldung ist nicht konfiguriert (SUPABASE_SERVICE_ROLE_KEY prüfen).",
      };
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: envAdminEmail!,
      password: envAdminPassword!,
    });
    if (error) {
      return { error: error.message };
    }
  } else {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const mustSet =
    user?.user_metadata &&
    typeof user.user_metadata === "object" &&
    (user.user_metadata as { must_set_password?: boolean }).must_set_password ===
      true;
  if (mustSet) {
    redirect("/auth/employer/set-password");
  }

  const rawRedirect =
    typeof redirectParam === "string" &&
    redirectParam.startsWith("/") &&
    !redirectParam.startsWith("//")
      ? redirectParam
      : null;
  const postAuthRedirect =
    rawRedirect &&
    rawRedirect !== "/dashboard" &&
    rawRedirect !== "/login" &&
    !rawRedirect.startsWith("/login/")
      ? rawRedirect
      : null;

  if (postAuthRedirect) {
    if (postAuthRedirect.startsWith("/admin")) {
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user!.id)
        .single();
      if (profile?.role === "admin") {
        redirect(postAuthRedirect);
      }
      await supabase.auth.signOut();
      return {
        error:
          "Kein Zugriff auf den Admin-Bereich. Bitte mit einem Admin-Konto anmelden.",
      };
    }
    redirect(postAuthRedirect);
  }

  let role: "employer" | "school" | "admin" = "employer";
  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role) {
      role = profile.role;
    }
  }

  if (role === "admin") {
    redirect("/admin");
  }
  redirect(`/dashboard/${role}`);
}

/** Kein `redirect()` hier – Form-Submit + Redirect in Server Actions löst in Next oft „Failed to fetch“ aus; Navigation macht der Client. */
export async function signOutFromAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/admin", "layout");
  return { success: true as const };
}

/** Supabase sendet einen Link; Ziel nach Klick: /auth/callback → /auth/reset-password */
export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) {
    return { error: "E-Mail fehlt." };
  }

  const supabase = await createClient();
  const base = getPublicSiteUrl();
  const nextPath = "/auth/reset-password";
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${base}/auth/callback?next=${encodeURIComponent(nextPath)}`,
  });

  if (error) {
    return { error: error.message };
  }
  return { success: true as const };
}

export async function signUp(
  formData: FormData,
  role: "employer" | "school",
  metadata: Record<string, unknown> = {}
) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role, ...metadata },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function logAuditEvent(
  action: string,
  entityType: string,
  entityId?: string,
  metadata?: Record<string, unknown>
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("audit_log").insert({
    user_id: user.id,
    action,
    entity_type: entityType,
    entity_id: entityId,
    metadata,
  });
}
