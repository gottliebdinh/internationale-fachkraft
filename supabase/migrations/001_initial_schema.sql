-- GeVin Platform Database Schema
-- Initial migration: all core tables

-- Enums
CREATE TYPE user_role AS ENUM ('admin', 'school', 'employer');
CREATE TYPE locale AS ENUM ('de', 'vi', 'en');
CREATE TYPE industry AS ENUM ('hospitality', 'hairdressing', 'nursing', 'other');
CREATE TYPE accommodation_type AS ENUM ('company_housing', 'rental_support', 'none');
CREATE TYPE german_level AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1');
CREATE TYPE urgency AS ENUM ('immediate', '3_months', '6_months', 'flexible');
CREATE TYPE position_type AS ENUM ('apprenticeship', 'skilled_worker', 'seasonal');
CREATE TYPE candidate_status AS ENUM ('draft', 'active', 'matched', 'in_process', 'placed', 'withdrawn');
CREATE TYPE job_status AS ENUM ('draft', 'active', 'filled', 'closed');
CREATE TYPE match_status AS ENUM (
  'proposed', 'school_accepted', 'employer_accepted', 'both_accepted',
  'interview_scheduled', 'contract_phase', 'ihk_submitted', 'approved',
  'visa_applied', 'visa_granted', 'arrived', 'rejected', 'withdrawn'
);
CREATE TYPE document_type AS ENUM ('passport', 'b1_certificate', 'cv', 'diploma', 'health_certificate', 'video', 'other');
CREATE TYPE match_document_type AS ENUM (
  'berufsausbildungsvertrag', 'erklaerung_beschaeftigung', 'ausbildungsplan',
  'mietvertrag', 'arbeitsvertrag', 'visa_application', 'anerkennungsbescheid', 'other'
);
CREATE TYPE notification_type AS ENUM ('match_proposed', 'document_required', 'status_changed', 'message', 'system');

-- Users (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'employer',
  locale locale NOT NULL DEFAULT 'de',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Schools
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  license_number TEXT,
  region TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone TEXT NOT NULL,
  website TEXT,
  government_affiliation TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  documents JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Employers
CREATE TABLE employers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  industry industry NOT NULL,
  industry_other TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  plz TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone TEXT NOT NULL,
  trade_license_number TEXT,
  union_compliant BOOLEAN NOT NULL DEFAULT false,
  accommodation_type accommodation_type NOT NULL DEFAULT 'none',
  accommodation_details JSONB,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Candidates
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  nationality TEXT NOT NULL DEFAULT 'VN',
  passport_number TEXT,
  passport_expiry DATE,
  gender TEXT,
  specialization industry NOT NULL,
  german_level german_level NOT NULL DEFAULT 'A1',
  b1_certificate_date DATE,
  education_level TEXT,
  work_experience_years INTEGER NOT NULL DEFAULT 0,
  availability_date DATE NOT NULL,
  urgency urgency NOT NULL DEFAULT 'flexible',
  video_intro_url TEXT,
  profile_photo_url TEXT,
  status candidate_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Candidate Documents
CREATE TABLE candidate_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL DEFAULT '',
  verified_by_admin BOOLEAN NOT NULL DEFAULT false,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Job Positions
CREATE TABLE job_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  position_type position_type NOT NULL,
  specialization industry NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  start_date DATE NOT NULL,
  urgency urgency NOT NULL DEFAULT 'flexible',
  slots_total INTEGER NOT NULL DEFAULT 1,
  slots_filled INTEGER NOT NULL DEFAULT 0,
  salary_range JSONB,
  accommodation_provided BOOLEAN NOT NULL DEFAULT false,
  training_plan_url TEXT,
  status job_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Matches
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  job_position_id UUID NOT NULL REFERENCES job_positions(id) ON DELETE CASCADE,
  initiated_by TEXT NOT NULL DEFAULT 'employer',
  status match_status NOT NULL DEFAULT 'proposed',
  rejection_reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(candidate_id, job_position_id)
);

-- Match Documents
CREATE TABLE match_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  document_type match_document_type NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL DEFAULT '',
  generated BOOLEAN NOT NULL DEFAULT false,
  signed BOOLEAN NOT NULL DEFAULT false,
  signed_at TIMESTAMPTZ,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Audit Log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  ip_address INET,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  read BOOLEAN NOT NULL DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_schools_user ON schools(user_id);
CREATE INDEX idx_employers_user ON employers(user_id);
CREATE INDEX idx_candidates_school ON candidates(school_id);
CREATE INDEX idx_candidates_status ON candidates(status);
CREATE INDEX idx_candidates_specialization ON candidates(specialization);
CREATE INDEX idx_job_positions_employer ON job_positions(employer_id);
CREATE INDEX idx_job_positions_status ON job_positions(status);
CREATE INDEX idx_job_positions_specialization ON job_positions(specialization);
CREATE INDEX idx_matches_candidate ON matches(candidate_id);
CREATE INDEX idx_matches_job ON matches(job_position_id);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_match_documents_match ON match_documents(match_id);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE read = false;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER schools_updated_at BEFORE UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER employers_updated_at BEFORE UPDATE ON employers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER candidates_updated_at BEFORE UPDATE ON candidates FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER job_positions_updated_at BEFORE UPDATE ON job_positions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, locale)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'employer'),
    COALESCE((NEW.raw_user_meta_data->>'locale')::locale, 'de')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Matching function
CREATE OR REPLACE FUNCTION match_candidates(p_job_position_id UUID)
RETURNS TABLE(candidate_id UUID, score INTEGER) AS $$
  SELECT c.id,
    (CASE WHEN c.urgency::text = jp.urgency::text THEN 30 ELSE 0 END +
     CASE WHEN c.availability_date <= jp.start_date THEN 20 ELSE 0 END +
     c.work_experience_years * 5 +
     CASE WHEN jp.accommodation_provided THEN 10 ELSE 0 END)::INTEGER AS score
  FROM candidates c
  JOIN job_positions jp ON jp.id = p_job_position_id
  WHERE c.specialization = jp.specialization
    AND c.german_level >= 'B1'
    AND c.status = 'active'
    AND jp.status = 'active'
  ORDER BY score DESC;
$$ LANGUAGE sql STABLE;
