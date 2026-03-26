-- Document Pipeline: erweitert candidate_documents um AI-Extraktion,
-- fuegt neue Dokumenttypen hinzu und ergaenzt candidates um Freitext-Felder
-- aus dem Anschreiben (position_type, desired_position, desired_field).

-- 1) Neue Dokumenttypen
ALTER TYPE document_type ADD VALUE IF NOT EXISTS 'cover_letter';
ALTER TYPE document_type ADD VALUE IF NOT EXISTS 'school_records';
ALTER TYPE document_type ADD VALUE IF NOT EXISTS 'photo';
ALTER TYPE document_type ADD VALUE IF NOT EXISTS 'application_bundle';

-- 2) candidate_documents: Spalten fuer AI-Extraktion + Storage-Metadaten
ALTER TABLE candidate_documents
  ADD COLUMN IF NOT EXISTS extracted_data      JSONB         DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS extraction_status   TEXT          DEFAULT 'pending'
    CHECK (extraction_status IN ('pending','processing','completed','failed','skipped')),
  ADD COLUMN IF NOT EXISTS extraction_model    TEXT,
  ADD COLUMN IF NOT EXISTS extraction_error    TEXT,
  ADD COLUMN IF NOT EXISTS original_file_name  TEXT,
  ADD COLUMN IF NOT EXISTS file_size_bytes     BIGINT,
  ADD COLUMN IF NOT EXISTS mime_type           TEXT,
  ADD COLUMN IF NOT EXISTS storage_path        TEXT;

-- 3) candidates: Freitext-Felder aus Anschreiben (skalierbar, kein Enum)
ALTER TABLE candidates
  ADD COLUMN IF NOT EXISTS position_type     TEXT,
  ADD COLUMN IF NOT EXISTS desired_position  TEXT,
  ADD COLUMN IF NOT EXISTS desired_field     TEXT;

-- 4) Optionale Audit-Tabelle: welcher Wert kam aus welchem Dokument
CREATE TABLE IF NOT EXISTS candidate_extractions (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id      UUID        NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  source_document_id UUID       REFERENCES candidate_documents(id) ON DELETE SET NULL,
  field_name        TEXT        NOT NULL,
  extracted_value   TEXT,
  confidence        REAL,
  verified_by       UUID        REFERENCES users(id),
  verified_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- 5) Indexes fuer haeufige Abfragen
CREATE INDEX IF NOT EXISTS idx_candidate_docs_extraction_status
  ON candidate_documents(extraction_status);
CREATE INDEX IF NOT EXISTS idx_candidate_docs_storage_path
  ON candidate_documents(storage_path);
CREATE INDEX IF NOT EXISTS idx_candidate_extractions_candidate
  ON candidate_extractions(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_extractions_field
  ON candidate_extractions(field_name);
CREATE INDEX IF NOT EXISTS idx_candidates_desired_field
  ON candidates(desired_field);
CREATE INDEX IF NOT EXISTS idx_candidates_position_type
  ON candidates(position_type);
