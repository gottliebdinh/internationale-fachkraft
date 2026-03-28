-- Contact email for employers (optional for legacy rows; required on new admin creates)
ALTER TABLE employers ADD COLUMN IF NOT EXISTS email TEXT;
