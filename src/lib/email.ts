"use server";

import { Resend } from "resend";
import { getPublicSiteUrl } from "@/lib/site-url";
import { CONTACT_EMAIL, getLeadsNotifyEmail } from "@/lib/contact-info";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Lotus&Eagle <noreply@gdinh.de>";

function baseLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:32px 16px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
        <tr><td style="padding:28px 32px 20px;background:#1a1a2e;text-align:center">
          <span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.5px">Lotus&Eagle</span>
        </td></tr>
        <tr><td style="padding:32px">${content}</td></tr>
        <tr><td style="padding:20px 32px;background:#fafafa;border-top:1px solid #eee;text-align:center;font-size:12px;color:#999">
          &copy; ${new Date().getFullYear()} Lotus&Eagle &mdash; Die Brücke zwischen deutschen Unternehmen und vietnamesischen Fachkräften.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

interface MatchProposalParams {
  to: string;
  recipientName: string;
  candidateName: string;
  employerName: string;
  positionTitle: string;
  matchId: string;
}

export async function sendMatchProposalEmail({
  to,
  recipientName,
  candidateName,
  employerName,
  positionTitle,
  matchId,
}: MatchProposalParams) {
  const html = baseLayout(`
    <h2 style="margin:0 0 16px;font-size:18px;color:#1a1a2e">Neuer Match-Vorschlag</h2>
    <p style="margin:0 0 12px;font-size:14px;color:#333;line-height:1.6">
      Hallo ${recipientName},
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:#333;line-height:1.6">
      Es gibt einen neuen Match-Vorschlag auf der Lotus&Eagle-Plattform:
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8fc;border-radius:8px;padding:16px;margin:0 0 20px">
      <tr><td style="padding:8px 16px;font-size:14px;color:#666">Kandidat/in:</td><td style="padding:8px 16px;font-size:14px;font-weight:600;color:#1a1a2e">${candidateName}</td></tr>
      <tr><td style="padding:8px 16px;font-size:14px;color:#666">Unternehmen:</td><td style="padding:8px 16px;font-size:14px;font-weight:600;color:#1a1a2e">${employerName}</td></tr>
      <tr><td style="padding:8px 16px;font-size:14px;color:#666">Position:</td><td style="padding:8px 16px;font-size:14px;font-weight:600;color:#1a1a2e">${positionTitle}</td></tr>
    </table>
    <p style="margin:0 0 20px;font-size:14px;color:#333;line-height:1.6">
      Bitte melden Sie sich an, um den Vorschlag zu prüfen und zu bestätigen.
    </p>
    <a href="${getPublicSiteUrl()}/dashboard/matches/${matchId}" style="display:inline-block;padding:10px 24px;background:#1a1a2e;color:#fff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:500">Match ansehen</a>
  `);

  return resend.emails.send({ from: FROM, to, subject: `Neuer Match-Vorschlag: ${candidateName} — ${positionTitle}`, html });
}

interface StatusUpdateParams {
  to: string;
  recipientName: string;
  candidateName: string;
  oldStatus: string;
  newStatus: string;
  matchId: string;
}

export async function sendStatusUpdateEmail({
  to,
  recipientName,
  candidateName,
  oldStatus,
  newStatus,
  matchId,
}: StatusUpdateParams) {
  const html = baseLayout(`
    <h2 style="margin:0 0 16px;font-size:18px;color:#1a1a2e">Status-Aktualisierung</h2>
    <p style="margin:0 0 12px;font-size:14px;color:#333;line-height:1.6">
      Hallo ${recipientName},
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:#333;line-height:1.6">
      Der Match-Status für <strong>${candidateName}</strong> wurde aktualisiert:
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8fc;border-radius:8px;padding:16px;margin:0 0 20px">
      <tr><td style="padding:8px 16px;font-size:14px;color:#666">Vorheriger Status:</td><td style="padding:8px 16px;font-size:14px;color:#1a1a2e">${oldStatus}</td></tr>
      <tr><td style="padding:8px 16px;font-size:14px;color:#666">Neuer Status:</td><td style="padding:8px 16px;font-size:14px;font-weight:600;color:#1a1a2e">${newStatus}</td></tr>
    </table>
    <a href="${getPublicSiteUrl()}/dashboard/matches/${matchId}" style="display:inline-block;padding:10px 24px;background:#1a1a2e;color:#fff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:500">Details ansehen</a>
  `);

  return resend.emails.send({ from: FROM, to, subject: `Status-Update: ${candidateName} — ${newStatus}`, html });
}

interface WelcomeEmailParams {
  to: string;
  name: string;
  role: "employer" | "school";
}

export async function sendWelcomeEmail({ to, name, role }: WelcomeEmailParams) {
  const roleLabel = role === "employer" ? "Arbeitgeber" : "Schule";
  const dashboardUrl = `${getPublicSiteUrl()}/dashboard`;

  const html = baseLayout(`
    <h2 style="margin:0 0 16px;font-size:18px;color:#1a1a2e">Willkommen bei Lotus&Eagle!</h2>
    <p style="margin:0 0 12px;font-size:14px;color:#333;line-height:1.6">
      Hallo ${name},
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:#333;line-height:1.6">
      Vielen Dank für Ihre Registrierung als <strong>${roleLabel}</strong> auf der Lotus&Eagle-Plattform.
      Wir freuen uns, Sie bei der Vermittlung vietnamesischer Fachkräfte nach Deutschland zu unterstützen.
    </p>
    <p style="margin:0 0 20px;font-size:14px;color:#333;line-height:1.6">
      Ihr Konto wird in Kürze von unserem Team verifiziert. Sie erhalten eine Benachrichtigung, sobald Ihr Konto freigeschaltet ist.
    </p>
    <a href="${dashboardUrl}" style="display:inline-block;padding:10px 24px;background:#1a1a2e;color:#fff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:500">Zum Dashboard</a>
  `);

  return resend.emails.send({ from: FROM, to, subject: "Willkommen bei Lotus&Eagle", html });
}

interface VerificationEmailParams {
  to: string;
  name: string;
  verificationUrl: string;
}

export async function sendVerificationEmail({
  to,
  name,
  verificationUrl,
}: VerificationEmailParams) {
  const html = baseLayout(`
    <h2 style="margin:0 0 16px;font-size:18px;color:#1a1a2e">E-Mail bestätigen</h2>
    <p style="margin:0 0 12px;font-size:14px;color:#333;line-height:1.6">
      Hallo ${name},
    </p>
    <p style="margin:0 0 20px;font-size:14px;color:#333;line-height:1.6">
      Bitte bestätigen Sie Ihre E-Mail-Adresse, um Ihr Lotus&Eagle-Konto zu aktivieren.
    </p>
    <a href="${verificationUrl}" style="display:inline-block;padding:10px 24px;background:#1a1a2e;color:#fff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:500">E-Mail bestätigen</a>
    <p style="margin:20px 0 0;font-size:12px;color:#999;line-height:1.6">
      Falls Sie sich nicht bei Lotus&Eagle registriert haben, können Sie diese E-Mail ignorieren. Der Link ist 24&nbsp;Stunden gültig.
    </p>
  `);

  return resend.emails.send({ from: FROM, to, subject: "Lotus&Eagle — E-Mail-Adresse bestätigen", html });
}

interface LeadConfirmationParams {
  to: string;
  name: string;
}

export async function sendLeadConfirmationEmail({
  to,
  name,
}: LeadConfirmationParams) {
  const html = baseLayout(`
    <h2 style="margin:0 0 16px;font-size:18px;color:#1a1a2e">Ihre Anfrage ist bei uns eingegangen</h2>
    <p style="margin:0 0 12px;font-size:14px;color:#333;line-height:1.6">
      Guten Tag ${name},
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:#333;line-height:1.6">
      vielen Dank f&uuml;r Ihr Interesse an qualifizierten Fachkr&auml;ften &uuml;ber Lotus&Eagle.
      Wir haben Ihre Angaben erhalten und unser Team wird sich in K&uuml;rze bei Ihnen melden.
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:#333;line-height:1.6">
      Sollten Sie in der Zwischenzeit Fragen haben, antworten Sie einfach auf diese E-Mail
      oder kontaktieren Sie uns &uuml;ber unsere <a href="${getPublicSiteUrl()}/contact" style="color:#1a1a2e;font-weight:500">Kontaktseite</a>.
    </p>
    <p style="margin:0;font-size:14px;color:#333;line-height:1.6">
      Mit freundlichen Gr&uuml;&szlig;en,<br>
      <strong>Ihr Lotus&Eagle-Team</strong>
    </p>
  `);

  return resend.emails.send({
    from: FROM,
    to,
    subject: "Lotus&Eagle — Ihre Anfrage ist eingegangen",
    html,
  });
}

export interface NewLeadTeamEmailParams {
  name: string;
  email: string;
  phone: string;
  industryDisplay: string;
  seekingDisplay: string;
  startDateDisplay: string | null;
  slots: number;
}

/** Benachrichtigung ans Team bei neuem Website-Lead (formatiert wie übrige Mails). */
export async function sendNewLeadTeamEmail(params: NewLeadTeamEmailParams) {
  const to = getLeadsNotifyEmail();
  const site = getPublicSiteUrl();
  const adminLeadsUrl = `${site}/admin/leads`;
  const slotsLabel =
    params.slots === 1 ? "1 Stelle / Platz" : `${params.slots} Stellen / Plätze`;

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:10px 14px;font-size:13px;color:#666;vertical-align:top;width:38%;border-bottom:1px solid #eee">${escapeHtml(label)}</td>
      <td style="padding:10px 14px;font-size:14px;color:#1a1a2e;font-weight:500;vertical-align:top;border-bottom:1px solid #eee">${value}</td>
    </tr>`;

  const html = baseLayout(`
    <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#64748b">Neue Lead-Anfrage</p>
    <h2 style="margin:0 0 20px;font-size:20px;color:#1a1a2e;line-height:1.3">Interessent über die Website</h2>
    <p style="margin:0 0 20px;font-size:14px;color:#333;line-height:1.6">
      Es ist soeben eine neue Anfrage eingegangen. Details:
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:10px;overflow:hidden;border:1px solid #e2e8f0;margin:0 0 24px">
      ${row("Name", escapeHtml(params.name))}
      ${row("E-Mail", `<a href="mailto:${escapeHtml(params.email)}" style="color:#1a1a2e">${escapeHtml(params.email)}</a>`)}
      ${row("Telefon", `<a href="tel:${escapeHtml(params.phone.replace(/\s/g, ""))}" style="color:#1a1a2e">${escapeHtml(params.phone)}</a>`)}
      ${row("Branche", escapeHtml(params.industryDisplay))}
      ${row("Suche", escapeHtml(params.seekingDisplay))}
      ${row("Ab / Start", escapeHtml(params.startDateDisplay ?? "— (nicht angegeben)"))}
      ${row("Anzahl", escapeHtml(slotsLabel))}
    </table>
    <a href="${adminLeadsUrl}" style="display:inline-block;padding:12px 24px;background:#1a1a2e;color:#fff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600">Leads im Admin öffnen</a>
    <p style="margin:24px 0 0;font-size:12px;color:#888;line-height:1.5">
      Diese Nachricht wurde automatisch versendet. Antworten an den Interessenten am besten direkt an
      <a href="mailto:${escapeHtml(params.email)}" style="color:#1a1a2e">${escapeHtml(params.email)}</a>.
    </p>
  `);

  return resend.emails.send({
    from: FROM,
    to,
    replyTo: params.email,
    subject: `Neuer Lead: ${params.name}`,
    html,
  });
}

export interface ContactFormEmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/** Eingehende Nachricht vom Kontaktformular an die zentrale Kontaktadresse. */
export async function sendContactFormEmail(params: ContactFormEmailParams) {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:10px 14px;font-size:13px;color:#666;vertical-align:top;width:32%;border-bottom:1px solid #eee">${escapeHtml(label)}</td>
      <td style="padding:10px 14px;font-size:14px;color:#1a1a2e;font-weight:500;vertical-align:top;border-bottom:1px solid #eee">${value}</td>
    </tr>`;

  const html = baseLayout(`
    <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#64748b">Kontaktformular</p>
    <h2 style="margin:0 0 20px;font-size:20px;color:#1a1a2e;line-height:1.3">Neue Nachricht von der Website</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:10px;overflow:hidden;border:1px solid #e2e8f0;margin:0 0 20px">
      ${row("Name", escapeHtml(params.name))}
      ${row("E-Mail", `<a href="mailto:${escapeHtml(params.email)}" style="color:#1a1a2e">${escapeHtml(params.email)}</a>`)}
      ${row("Betreff", escapeHtml(params.subject))}
    </table>
    <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#64748b">Nachricht</p>
    <div style="padding:16px 18px;background:#fff;border:1px solid #e2e8f0;border-radius:10px;font-size:14px;color:#1a1a2e;line-height:1.65;white-space:pre-wrap">${escapeHtml(params.message)}</div>
    <p style="margin:20px 0 0;font-size:12px;color:#888;line-height:1.5">
      Zum Antworten in Ihrem Mailprogramm auf diese E-Mail antworten &mdash; <strong>Reply-To</strong> ist die Absenderadresse des Kontaktformulars.
    </p>
  `);

  const subjectSafe =
    params.subject.length > 120
      ? `${params.subject.slice(0, 117)}…`
      : params.subject;

  return resend.emails.send({
    from: FROM,
    to: CONTACT_EMAIL,
    replyTo: params.email,
    subject: `Kontakt: ${subjectSafe}`,
    html,
  });
}
