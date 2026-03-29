/**
 * Öffentliche Basis-URL (Auth-Links, E-Mails, redirect_to).
 *
 * Produktion: `SITE_URL` oder `NEXT_PUBLIC_SITE_URL` =
 * `https://www.internationale-fachkraft.de` (ohne Slash am Ende).
 * `SITE_URL` ist nur serverseitig – ideal für Invite-Links ohne falsches
 * Client-Bundle. In Supabase: dieselbe Domain unter Authentication → URL.
 */
export function getPublicSiteUrl(): string {
  const site =
    process.env.SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const app = process.env.NEXT_PUBLIC_APP_URL?.trim();
  let candidate = (site || app || "").replace(/\/$/, "");

  const vercelHost = process.env.VERCEL_URL?.trim();
  const onVercel = Boolean(process.env.VERCEL);

  const isLocalhost = (u: string) =>
    u.includes("localhost") || u.includes("127.0.0.1");

  // Auf Vercel: versehentlich gesetztes localhost in APP_URL nicht für öffentliche Links nutzen
  if (onVercel && vercelHost && (!candidate || isLocalhost(candidate))) {
    return `https://${vercelHost.replace(/^https?:\/\//, "")}`;
  }

  if (candidate) return candidate;

  if (vercelHost) {
    return `https://${vercelHost.replace(/^https?:\/\//, "")}`;
  }

  const port = process.env.PORT?.trim();
  if (port) return `http://localhost:${port}`;
  return "http://localhost:3000";
}
