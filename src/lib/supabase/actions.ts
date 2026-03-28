"use server";

import { createClient } from "./server";
import { redirect } from "next/navigation";

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
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
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

  const redirectParam = formData.get("redirect");
  if (
    typeof redirectParam === "string" &&
    redirectParam.startsWith("/") &&
    !redirectParam.startsWith("//") &&
    redirectParam !== "/dashboard"
  ) {
    if (redirectParam.startsWith("/admin")) {
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user!.id)
        .single();
      if (profile?.role === "admin") {
        redirect(redirectParam);
      }
      await supabase.auth.signOut();
      return {
        error:
          "Kein Zugriff auf den Admin-Bereich. Bitte mit einem Admin-Konto anmelden.",
      };
    }
    redirect(redirectParam);
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

export async function signOutFromAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/** Supabase sendet einen Link; Ziel nach Klick: /auth/callback → /auth/reset-password */
export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) {
    return { error: "E-Mail fehlt." };
  }

  const supabase = await createClient();
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";
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
