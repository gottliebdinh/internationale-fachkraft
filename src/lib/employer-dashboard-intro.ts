/** Nach Intro abgeschlossen – gleiche Sitzung nicht erneut zeigen (außer nach Registrierung). */
export const EMPLOYER_MATCH_INTRO_SEEN_KEY = "lotus_eagle_employer_match_intro_v1";

/** Einmal nach erfolgreicher Arbeitgeber-Registrierung setzen → Intro erzwingen. */
export const EMPLOYER_MATCH_INTRO_AFTER_REGISTER_KEY = "lotus_eagle_employer_force_match_intro_v1";

export function scheduleEmployerMatchIntroAfterRegister(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(EMPLOYER_MATCH_INTRO_SEEN_KEY);
    sessionStorage.setItem(EMPLOYER_MATCH_INTRO_AFTER_REGISTER_KEY, "1");
  } catch {
    // ignore
  }
}
