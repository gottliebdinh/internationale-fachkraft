-- Welche Unterlagen ein Arbeitgeber im Dashboard sieht, pro Match steuerbar.

ALTER TABLE matches
  ADD COLUMN IF NOT EXISTS employer_shared_document_ids uuid[] NULL,
  ADD COLUMN IF NOT EXISTS employer_share_profile_photo boolean NULL,
  ADD COLUMN IF NOT EXISTS employer_share_motivation boolean NULL;

COMMENT ON COLUMN matches.employer_shared_document_ids IS 'candidate_documents.id, die für den AG sichtbar sind; NULL = Legacy (wie bisher: CV + Motivation + Foto).';
COMMENT ON COLUMN matches.employer_share_profile_photo IS 'Profilbild im AG-Dashboard; NULL = Legacy.';
COMMENT ON COLUMN matches.employer_share_motivation IS 'Motivationstext aus Anschreiben; NULL = Legacy.';
