/** Zentrale Kontaktdaten (Kontaktseite, Impressum, Lead-Benachrichtigung). */

/** Gesellschaftsname (Impressum, AGB, Datenschutz) */
export const LEGAL_ENTITY_NAME = "LOTUS & EAGLE Alliance UG";

export const LEGAL_STREET_LINE = "Bartholomäusstraße 26d";
export const LEGAL_CITY_LINE = "90489 Nürnberg";
export const LEGAL_COUNTRY_LINE = "Deutschland";

/** Adresszeilen unter dem Firmennamen (ohne Name) */
export const LEGAL_ADDRESS_LINES = [
  LEGAL_STREET_LINE,
  LEGAL_CITY_LINE,
  LEGAL_COUNTRY_LINE,
] as const;

/** Eine Zeile für Vertragstexte: Name, Straße, PLZ Ort */
export const LEGAL_ADDRESS_INLINE = `${LEGAL_ENTITY_NAME}, ${LEGAL_STREET_LINE}, ${LEGAL_CITY_LINE}`;

export const CONTACT_EMAIL = "contact@le-alliance.de";

/** Anzeigeformat der Rufnummer */
export const CONTACT_PHONE_DISPLAY = "+49 1511 6037860";

/** E.164 für `tel:`-Links und WhatsApp (`wa.me`) */
export const CONTACT_PHONE_TEL = "+4915116037860";

/** WhatsApp-Chat (`wa.me`, Nummer ohne „+“). */
export const CONTACT_WHATSAPP_URL = `https://wa.me/${CONTACT_PHONE_TEL.replace("+", "")}`;

/** CTAs „Kostenlose Erstberatung“: öffnet WhatsApp mit Kurznachricht. */
export const CONTACT_WHATSAPP_ERSTBERATUNG_URL = `${CONTACT_WHATSAPP_URL}?text=${encodeURIComponent(
  "Hallo, ich möchte eine kostenlose Erstberatung.",
)}`;

/** CTAs „Fachkräfte anfragen“ / Arbeitgeber-Register in der Navigation. */
export const CONTACT_WHATSAPP_FACHKRAEFTE_ANFRAGE_URL = `${CONTACT_WHATSAPP_URL}?text=${encodeURIComponent(
  "Hallo, ich möchte Fachkräfte anfragen.",
)}`;

/** Interne E-Mail bei neuem Lead; optional `LEADS_NOTIFY_EMAIL` in `.env` setzen. */
export function getLeadsNotifyEmail(): string {
  const fromEnv = process.env.LEADS_NOTIFY_EMAIL?.trim();
  if (fromEnv) return fromEnv;
  return CONTACT_EMAIL;
}
