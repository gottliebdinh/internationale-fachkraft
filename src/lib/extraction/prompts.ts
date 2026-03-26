import type { ExtractableDocumentType } from "./schemas";

export const EXTRACTION_PROMPTS: Record<ExtractableDocumentType, string> = {
  passport: `Analysiere dieses Passdokument.
Extrahiere folgende Felder als JSON:
{
  "full_name": "Vollständiger Name",
  "date_of_birth": "YYYY-MM-DD",
  "nationality": "Staatsangehörigkeit",
  "passport_number": "Passnummer",
  "passport_expiry": "YYYY-MM-DD",
  "gender": "male | female",
  "place_of_birth": "Geburtsort"
}
Wenn ein Feld nicht lesbar ist, setze null. Antworte NUR mit validem JSON.`,

  b1_certificate: `Analysiere dieses Sprachzertifikat (Deutsch).
Extrahiere folgende Felder als JSON:
{
  "german_level": "A1 | A2 | B1 | B2 | C1",
  "exam_date": "YYYY-MM-DD",
  "institution": "Ausstellende Institution",
  "passed": true/false,
  "score": "Punktzahl oder Note falls vorhanden"
}
Wenn ein Feld nicht lesbar ist, setze null. Antworte NUR mit validem JSON.`,

  cv: `Analysiere diesen Lebenslauf.
Extrahiere folgende Felder als JSON:
{
  "education": [{"institution": "", "degree": "", "field": "", "start_date": "YYYY-MM", "end_date": "YYYY-MM"}],
  "work_experience": [{"company": "", "role": "", "start_date": "YYYY-MM", "end_date": "YYYY-MM", "description": ""}],
  "skills": ["Skill1", "Skill2"],
  "languages": [{"language": "Deutsch", "level": "B1"}]
}
Wenn ein Feld nicht lesbar ist, setze null. Leere Arrays bei fehlenden Abschnitten. Antworte NUR mit validem JSON.`,

  diploma: `Analysiere dieses Zeugnis / Diplom / Abitur.
Extrahiere folgende Felder als JSON:
{
  "school_name": "Name der Schule/Universität",
  "graduation_date": "YYYY-MM-DD",
  "degree": "Art des Abschlusses (z.B. Abitur, Bachelor)",
  "gpa_or_grade": "Durchschnittsnote falls vorhanden",
  "country": "Ausstellungsland"
}
Wenn ein Feld nicht lesbar ist, setze null. Antworte NUR mit validem JSON.`,

  cover_letter: `Analysiere dieses Bewerbungsschreiben / Anschreiben.
Extrahiere folgende Felder als JSON:
{
  "position_type": "Art der Stelle wie im Text formuliert, z.B. Auszubildende, Fachkraft, Saisonkraft",
  "desired_position": "Der konkrete Beruf wörtlich wie formuliert, z.B. Fachkraft für Gastronomie, Fachverkäuferin im Supermarkt, Koch",
  "desired_field": "Der Bereich/die Branche, z.B. Gastronomie, Einzelhandel, Pflege, Friseur",
  "target_company": "Name des Betriebs falls genannt",
  "target_city": "Ort/Stadt falls genannt",
  "motivation_summary": "1-2 Sätze Zusammenfassung der Motivation"
}
Schreibe die Werte genau so, wie sie im Text stehen -- keine eigene Kategorisierung.
Wenn ein Feld nicht im Text vorkommt, setze null. Antworte NUR mit validem JSON.`,

  health_certificate: `Analysiere dieses Gesundheitszeugnis.
Extrahiere folgende Felder als JSON:
{
  "issue_date": "YYYY-MM-DD",
  "issuing_authority": "Ausstellende Behörde",
  "valid_until": "YYYY-MM-DD falls angegeben",
  "result": "Ergebnis / Befund"
}
Wenn ein Feld nicht lesbar ist, setze null. Antworte NUR mit validem JSON.`,

  school_records: `Analysiere dieses Schulzeugnis / Học bạ.
Extrahiere folgende Felder als JSON:
{
  "school_name": "Name der Schule",
  "student_name": "Name des Schülers",
  "years_covered": "Zeitraum z.B. 2019-2022",
  "average_grade": "Durchschnittsnote falls vorhanden",
  "country": "Land"
}
Wenn ein Feld nicht lesbar ist, setze null. Antworte NUR mit validem JSON.`,
};
