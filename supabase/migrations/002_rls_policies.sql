-- Row Level Security Policies

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper: get current user role
CREATE OR REPLACE FUNCTION auth_role()
RETURNS user_role AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Users: can read own profile, admin can read all
CREATE POLICY users_select ON users FOR SELECT USING (
  id = auth.uid() OR auth_role() = 'admin'
);
CREATE POLICY users_update ON users FOR UPDATE USING (id = auth.uid());

-- Schools: own school or admin
CREATE POLICY schools_select ON schools FOR SELECT USING (
  user_id = auth.uid() OR auth_role() = 'admin' OR auth_role() = 'employer'
);
CREATE POLICY schools_insert ON schools FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY schools_update ON schools FOR UPDATE USING (
  user_id = auth.uid() OR auth_role() = 'admin'
);

-- Employers: own profile, admin, or schools (for matching context)
CREATE POLICY employers_select ON employers FOR SELECT USING (
  user_id = auth.uid() OR auth_role() = 'admin' OR auth_role() = 'school'
);
CREATE POLICY employers_insert ON employers FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY employers_update ON employers FOR UPDATE USING (
  user_id = auth.uid() OR auth_role() = 'admin'
);

-- Candidates: school that owns them, admin, or employers (active only)
CREATE POLICY candidates_select ON candidates FOR SELECT USING (
  school_id IN (SELECT id FROM schools WHERE user_id = auth.uid())
  OR auth_role() = 'admin'
  OR (auth_role() = 'employer' AND status = 'active')
);
CREATE POLICY candidates_insert ON candidates FOR INSERT WITH CHECK (
  school_id IN (SELECT id FROM schools WHERE user_id = auth.uid())
);
CREATE POLICY candidates_update ON candidates FOR UPDATE USING (
  school_id IN (SELECT id FROM schools WHERE user_id = auth.uid())
  OR auth_role() = 'admin'
);

-- Candidate Documents: school owner, admin, or employer in match contract_phase+
CREATE POLICY candidate_docs_select ON candidate_documents FOR SELECT USING (
  candidate_id IN (
    SELECT c.id FROM candidates c
    JOIN schools s ON s.id = c.school_id
    WHERE s.user_id = auth.uid()
  )
  OR auth_role() = 'admin'
  OR (auth_role() = 'employer' AND candidate_id IN (
    SELECT m.candidate_id FROM matches m
    JOIN job_positions jp ON jp.id = m.job_position_id
    JOIN employers e ON e.id = jp.employer_id
    WHERE e.user_id = auth.uid()
      AND m.status NOT IN ('proposed', 'rejected', 'withdrawn')
  ))
);
CREATE POLICY candidate_docs_insert ON candidate_documents FOR INSERT WITH CHECK (
  candidate_id IN (
    SELECT c.id FROM candidates c
    JOIN schools s ON s.id = c.school_id
    WHERE s.user_id = auth.uid()
  )
);

-- Job Positions: employer owner, admin, schools (active only)
CREATE POLICY job_positions_select ON job_positions FOR SELECT USING (
  employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid())
  OR auth_role() = 'admin'
  OR (auth_role() = 'school' AND status = 'active')
);
CREATE POLICY job_positions_insert ON job_positions FOR INSERT WITH CHECK (
  employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid())
);
CREATE POLICY job_positions_update ON job_positions FOR UPDATE USING (
  employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid())
  OR auth_role() = 'admin'
);

-- Matches: participants or admin
CREATE POLICY matches_select ON matches FOR SELECT USING (
  auth_role() = 'admin'
  OR candidate_id IN (
    SELECT c.id FROM candidates c JOIN schools s ON s.id = c.school_id WHERE s.user_id = auth.uid()
  )
  OR job_position_id IN (
    SELECT jp.id FROM job_positions jp JOIN employers e ON e.id = jp.employer_id WHERE e.user_id = auth.uid()
  )
);
CREATE POLICY matches_insert ON matches FOR INSERT WITH CHECK (
  auth_role() = 'admin'
  OR auth.uid() IN (
    SELECT e.user_id FROM employers e
    JOIN job_positions jp ON jp.employer_id = e.id
    WHERE jp.id = job_position_id
  )
  OR auth.uid() IN (
    SELECT s.user_id FROM schools s
    JOIN candidates c ON c.school_id = s.id
    WHERE c.id = candidate_id
  )
);
CREATE POLICY matches_update ON matches FOR UPDATE USING (
  auth_role() = 'admin'
  OR candidate_id IN (
    SELECT c.id FROM candidates c JOIN schools s ON s.id = c.school_id WHERE s.user_id = auth.uid()
  )
  OR job_position_id IN (
    SELECT jp.id FROM job_positions jp JOIN employers e ON e.id = jp.employer_id WHERE e.user_id = auth.uid()
  )
);

-- Match Documents: match participants or admin
CREATE POLICY match_docs_select ON match_documents FOR SELECT USING (
  auth_role() = 'admin'
  OR match_id IN (
    SELECT m.id FROM matches m
    WHERE m.candidate_id IN (
      SELECT c.id FROM candidates c JOIN schools s ON s.id = c.school_id WHERE s.user_id = auth.uid()
    )
    OR m.job_position_id IN (
      SELECT jp.id FROM job_positions jp JOIN employers e ON e.id = jp.employer_id WHERE e.user_id = auth.uid()
    )
  )
);
CREATE POLICY match_docs_insert ON match_documents FOR INSERT WITH CHECK (
  auth_role() = 'admin'
  OR match_id IN (
    SELECT m.id FROM matches m
    WHERE m.candidate_id IN (
      SELECT c.id FROM candidates c JOIN schools s ON s.id = c.school_id WHERE s.user_id = auth.uid()
    )
    OR m.job_position_id IN (
      SELECT jp.id FROM job_positions jp JOIN employers e ON e.id = jp.employer_id WHERE e.user_id = auth.uid()
    )
  )
);

-- Audit Log: admin only
CREATE POLICY audit_log_select ON audit_log FOR SELECT USING (auth_role() = 'admin');
CREATE POLICY audit_log_insert ON audit_log FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Notifications: own only
CREATE POLICY notifications_select ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY notifications_update ON notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY notifications_insert ON notifications FOR INSERT WITH CHECK (
  auth_role() = 'admin' OR user_id = auth.uid()
);
