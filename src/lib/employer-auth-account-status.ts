import type { SupabaseClient, User } from "@supabase/supabase-js";

export type EmployerAccountAuthStatus = {
  emailConfirmed: boolean;
  /** Erstes Passwort über /auth/employer/set-password noch nicht gesetzt */
  needsPassword: boolean;
  /** Einzeiler fürs Grid */
  shortLabel: string;
  /** Zeilen für Detailansicht */
  lines: { label: string; value: string; ok: boolean }[];
};

/**
 * Status des Supabase-Auth-Kontos (E-Mail-Bestätigung + erstes Passwort).
 */
export function getEmployerAccountAuthStatus(
  user: User | null | undefined
): EmployerAccountAuthStatus {
  if (!user) {
    return {
      emailConfirmed: false,
      needsPassword: true,
      shortLabel: "Kein Login",
      lines: [
        { label: "E-Mail bestätigt", value: "–", ok: false },
        { label: "Passwort gesetzt", value: "–", ok: false },
      ],
    };
  }

  const emailConfirmed = Boolean(user.email_confirmed_at);
  const needsPassword = user.user_metadata?.must_set_password === true;

  const lines: EmployerAccountAuthStatus["lines"] = [
    {
      label: "E-Mail bestätigt",
      value: emailConfirmed ? "Ja" : "Nein (Link in der E-Mail)",
      ok: emailConfirmed,
    },
    {
      label: "Passwort gesetzt",
      value: needsPassword ? "Nein (noch festzulegen)" : "Ja",
      ok: !needsPassword,
    },
  ];

  let shortLabel: string;
  if (!emailConfirmed) {
    shortLabel = "E-Mail offen";
  } else if (needsPassword) {
    shortLabel = "Passwort offen";
  } else {
    shortLabel = "Konto bereit";
  }

  return {
    emailConfirmed,
    needsPassword,
    shortLabel,
    lines,
  };
}

export async function fetchAuthUserForEmployer(
  admin: SupabaseClient,
  userId: string | null | undefined
): Promise<User | null> {
  if (!userId) return null;
  const { data, error } = await admin.auth.admin.getUserById(userId);
  if (error || !data.user) return null;
  return data.user;
}
