/** Zentrale Kontaktdaten (Kontaktseite, Impressum, Lead-Benachrichtigung). */

/** Gesellschaftsname (Impressum, AGB, Datenschutz) */
export const LEGAL_ENTITY_NAME = "Lotus & Eagle Alliance UG";

export const LEGAL_STREET_LINE = "Katharinengasse 14";
export const LEGAL_CITY_LINE = "90403 Nürnberg";
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
export const CONTACT_PHONE_DISPLAY = "0151 1696 9999";

/** E.164 für `tel:`-Links (015116969999 → +49 151 16969999) */
export const CONTACT_PHONE_TEL = "+4915116969999";

/** Interne E-Mail bei neuem Lead; optional `LEADS_NOTIFY_EMAIL` in `.env` setzen. */
export function getLeadsNotifyEmail(): string {
  const fromEnv = process.env.LEADS_NOTIFY_EMAIL?.trim();
  if (fromEnv) return fromEnv;
  return CONTACT_EMAIL;
}
