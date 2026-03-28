import type { MatchWithRelations } from "@/types/database";

interface PDFField {
  label: string;
  value: string;
  x: number;
  y: number;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function generateBerufsausbildungsvertragData(
  match: MatchWithRelations
): PDFField[] {
  const candidate = match.candidate!;
  const employer = match.job_position!.employer!;
  const position = match.job_position!;

  return [
    { label: "Ausbildender (Unternehmen)", value: employer.company_name, x: 50, y: 120 },
    { label: "Straße, Hausnummer", value: employer.address, x: 50, y: 150 },
    { label: "PLZ, Ort", value: `${employer.plz} ${employer.city}`, x: 50, y: 180 },
    { label: "Telefon", value: employer.phone, x: 50, y: 210 },
    // IHK-Bezirk / zuständige Stelle können bei Bedarf später ergänzt werden
    { label: "Auszubildende/r – Vorname", value: candidate.first_name, x: 50, y: 330 },
    { label: "Auszubildende/r – Nachname", value: candidate.last_name, x: 50, y: 360 },
    { label: "Geburtsdatum", value: formatDate(candidate.date_of_birth), x: 50, y: 390 },
    { label: "Staatsangehörigkeit", value: candidate.nationality, x: 50, y: 420 },
    { label: "Ausbildungsberuf", value: position.title, x: 50, y: 480 },
    { label: "Fachrichtung", value: position.specialization, x: 50, y: 510 },
    { label: "Ausbildungsdauer", value: "3 Jahre", x: 50, y: 540 },
    { label: "Ausbildungsbeginn", value: formatDate(position.start_date), x: 50, y: 570 },
    {
      label: "Vergütung (1. Jahr)",
      value: position.salary_range ? `${position.salary_range.min} EUR` : "Nach Tarif",
      x: 50,
      y: 630,
    },
  ];
}

export function generateErklaerungBeschaeftigungData(
  match: MatchWithRelations
): PDFField[] {
  const candidate = match.candidate!;
  const employer = match.job_position!.employer!;
  const position = match.job_position!;

  return [
    { label: "Arbeitgeber", value: employer.company_name, x: 50, y: 120 },
    { label: "Anschrift", value: `${employer.address}, ${employer.plz} ${employer.city}`, x: 50, y: 150 },
    { label: "Branche", value: position.specialization, x: 50, y: 180 },
    { label: "Gewerbeanmeldung/HRB", value: employer.trade_license_number || "", x: 50, y: 210 },
    { label: "Arbeitnehmer/in – Name", value: `${candidate.first_name} ${candidate.last_name}`, x: 50, y: 270 },
    { label: "Geburtsdatum", value: formatDate(candidate.date_of_birth), x: 50, y: 300 },
    { label: "Staatsangehörigkeit", value: candidate.nationality, x: 50, y: 330 },
    { label: "Tätigkeit", value: position.title, x: 50, y: 390 },
    { label: "Beginn des Arbeitsverhältnisses", value: formatDate(position.start_date), x: 50, y: 420 },
    {
      label: "Bruttomonatsentgelt",
      value: position.salary_range ? `${position.salary_range.min} - ${position.salary_range.max} EUR` : "Nach Tarif",
      x: 50,
      y: 450,
    },
    { label: "Arbeitszeit (Stunden/Woche)", value: "40", x: 50, y: 480 },
    {
      label: "Unterkunft",
      value:
        employer.accommodation_type === "company_housing"
          ? "Vom Arbeitgeber gestellt"
          : employer.accommodation_type === "rental_support"
          ? "Mietunterstützung"
          : "Eigenverantwortlich",
      x: 50,
      y: 510,
    },
  ];
}

export interface IHKDocumentData {
  type: "berufsausbildungsvertrag" | "erklaerung_beschaeftigung";
  title: string;
  fields: PDFField[];
  generatedAt: string;
}

export function generateIHKDocument(
  match: MatchWithRelations,
  type: "berufsausbildungsvertrag" | "erklaerung_beschaeftigung"
): IHKDocumentData {
  const titles = {
    berufsausbildungsvertrag: "Eintragung Berufsausbildungsvertrag",
    erklaerung_beschaeftigung: "Erklärung zum Beschäftigungsverhältnis",
  };

  const generators = {
    berufsausbildungsvertrag: generateBerufsausbildungsvertragData,
    erklaerung_beschaeftigung: generateErklaerungBeschaeftigungData,
  };

  return {
    type,
    title: titles[type],
    fields: generators[type](match),
    generatedAt: new Date().toISOString(),
  };
}
