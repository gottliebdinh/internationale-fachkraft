/** Heutiges Datum als YYYY-MM-DD (UTC), konsistent mit API-Default bei leerem Start). */
export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isJobStartAsap(iso: string): boolean {
  return iso.slice(0, 10) === todayIsoDate();
}

/** Anzeige: „Ab sofort“ wenn Datum = heute (UTC), sonst „Ab TT.MM.JJJJ“. */
export function formatJobStartLine(iso: string): string {
  if (isJobStartAsap(iso)) return "Ab sofort";
  const d = new Date(iso.slice(0, 10) + "T12:00:00");
  if (isNaN(d.getTime())) return `Ab ${iso}`;
  const fmt = d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return `Ab ${fmt}`;
}
