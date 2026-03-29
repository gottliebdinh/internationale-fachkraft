import { Resend } from "resend";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getPublicSiteUrl } from "@/lib/site-url";

/** After invite link, user lands here via /auth/callback (PKCE). */
export const EMPLOYER_SET_PASSWORD_PATH = "/auth/employer/set-password";

/** @deprecated Nutze getPublicSiteUrl aus @/lib/site-url */
export function getSiteUrl(): string {
  return getPublicSiteUrl();
}

export function buildInviteCallbackRedirectUrl(): string {
  const site = getPublicSiteUrl();
  const next = encodeURIComponent(EMPLOYER_SET_PASSWORD_PATH);
  return `${site}/auth/callback?next=${next}`;
}

/**
 * Supabase setzt `redirect_to` oft auf die Dashboard-„Site URL“ (z. B. noch localhost).
 * Wir setzen den Parameter nach der Erzeugung explizit auf unsere Callback-URL.
 */
function applyRedirectToActionLink(
  actionLink: string,
  redirectTo: string
): string {
  try {
    const u = new URL(actionLink);
    u.searchParams.set("redirect_to", redirectTo);
    return u.toString();
  } catch {
    return actionLink;
  }
}

/**
 * Supabase invite link (existing user, no password yet). Falls back to recovery.
 */
export async function generateEmployerInviteActionLink(
  supabase: SupabaseClient,
  email: string
): Promise<{ actionLink: string } | { error: string }> {
  const redirectTo = buildInviteCallbackRedirectUrl();

  const invite = await supabase.auth.admin.generateLink({
    type: "invite",
    email,
    options: { redirectTo },
  });

  if (!invite.error && invite.data?.properties?.action_link) {
    return {
      actionLink: applyRedirectToActionLink(
        invite.data.properties.action_link,
        redirectTo
      ),
    };
  }

  const recovery = await supabase.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo },
  });

  if (recovery.error) {
    return {
      error:
        recovery.error.message ||
        invite.error?.message ||
        "Einladungslink konnte nicht erzeugt werden.",
    };
  }
  const raw = recovery.data?.properties?.action_link;
  if (!raw) {
    return { error: "Kein Link von Supabase erhalten." };
  }
  return { actionLink: applyRedirectToActionLink(raw, redirectTo) };
}

export async function sendEmployerInviteEmail(opts: {
  to: string;
  actionLink: string;
  companyName?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    console.error("[employer-invite] RESEND_API_KEY fehlt");
    return { ok: false, error: "E-Mail-Versand ist nicht konfiguriert (RESEND_API_KEY)." };
  }

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() || "noreply@gdinh.de";
  const resend = new Resend(key);
  const company = opts.companyName?.trim() || "";
  const year = new Date().getFullYear();
  const siteUrl = getPublicSiteUrl();

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>GeVin – Passwort festlegen</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f5f5f7;padding:40px 16px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08)">

        <!-- Header -->
        <tr><td style="padding:28px 32px 24px;background-color:#1a1a2e;text-align:center">
          <a href="${siteUrl}" style="text-decoration:none">
            <span style="font-size:24px;font-weight:700;color:#ffffff;letter-spacing:0.5px">GeVin</span>
          </a>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:36px 32px 32px">
          <h1 style="margin:0 0 8px;font-size:20px;font-weight:600;color:#1a1a2e;line-height:1.3">Willkommen bei GeVin</h1>
          <p style="margin:0 0 24px;font-size:13px;color:#888;line-height:1.4">Ihr Zugang wurde erfolgreich eingerichtet.</p>

          <p style="margin:0 0 12px;font-size:15px;color:#333;line-height:1.7">Guten Tag,</p>
          <p style="margin:0 0 16px;font-size:15px;color:#333;line-height:1.7">${company ? `Ihr Unternehmenskonto für <strong style="color:#1a1a2e">${escapeHtml(company)}</strong> auf der GeVin-Plattform wurde angelegt.` : "Ihr Konto auf der GeVin-Plattform wurde erfolgreich angelegt."} Um Ihren Zugang zu aktivieren, legen Sie bitte ein persönliches Passwort fest.</p>

          <!-- CTA Button -->
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:28px 0">
            <tr><td align="center">
              <a href="${opts.actionLink}" style="display:inline-block;padding:14px 36px;background-color:#1a1a2e;color:#ffffff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:600;letter-spacing:0.2px;mso-padding-alt:0;text-align:center">Passwort festlegen</a>
            </td></tr>
          </table>

          <!-- Info box -->
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 24px;background-color:#f8f9fa;border-radius:8px;border-left:3px solid #1a1a2e">
            <tr><td style="padding:14px 18px">
              <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#1a1a2e">Was passiert als Nächstes?</p>
              <p style="margin:0;font-size:13px;color:#555;line-height:1.6">Nach der Passwortvergabe können Sie sich direkt anmelden und erhalten Zugang zu ausgewählten Fachkräfteprofilen auf der GeVin-Plattform.</p>
            </td></tr>
          </table>

          <p style="margin:0 0 4px;font-size:12px;color:#999;line-height:1.6">Falls die Schaltfläche nicht funktioniert, kopieren Sie diesen Link in Ihren Browser:</p>
          <p style="margin:0 0 20px;font-size:12px;color:#888;line-height:1.6;word-break:break-all">${opts.actionLink}</p>

          <!-- Divider -->
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0">

          <p style="margin:0;font-size:12px;color:#999;line-height:1.6">Falls Sie kein Konto bei GeVin erstellt haben oder diese E-Mail nicht erwartet haben, können Sie sie ignorieren. Der Link ist aus Sicherheitsgründen nur begrenzt gültig.</p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 32px;background-color:#fafafa;border-top:1px solid #eee;text-align:center">
          <p style="margin:0 0 4px;font-size:12px;color:#999;line-height:1.5">&copy; ${year} GeVin &mdash; Internationale Fachkr&auml;fte f&uuml;r Deutschland</p>
          <p style="margin:0;font-size:11px;color:#bbb;line-height:1.5">Strukturiert. IHK-konform. DSGVO-sicher.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const { error } = await resend.emails.send({
    from,
    to: opts.to,
    subject: "GeVin – Passwort festlegen",
    html,
  });

  if (error) {
    console.error("[employer-invite] Resend:", error);
    return { ok: false, error: error.message || "E-Mail konnte nicht gesendet werden." };
  }
  return { ok: true };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
