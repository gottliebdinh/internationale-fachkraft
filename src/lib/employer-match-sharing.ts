/** DB row fragment for employer-visible content per match */
export type EmployerMatchSharing = {
  employer_shared_document_ids: string[] | null;
  employer_share_profile_photo: boolean | null;
  employer_share_motivation: boolean | null;
};

/** Legacy matches (vor Freigabe-Feature): alle drei Spalten NULL */
export function isLegacyEmployerSharing(s: EmployerMatchSharing | null): boolean {
  if (!s) return true;
  return (
    s.employer_shared_document_ids === null &&
    s.employer_share_profile_photo === null &&
    s.employer_share_motivation === null
  );
}

const DOC_LABELS: Record<string, string> = {
  passport: "Reisepass",
  b1_certificate: "Sprachzertifikat",
  cv: "Lebenslauf",
  diploma: "Zeugnis / Abschluss",
  cover_letter: "Anschreiben",
  school_records: "Schulzeugnis",
  photo: "Foto",
  health_certificate: "Gesundheitszeugnis",
  application_bundle: "Bewerbungsunterlagen",
  video: "Video",
  other: "Sonstiges",
};

export function documentTypeLabel(documentType: string): string {
  return DOC_LABELS[documentType] ?? documentType;
}
