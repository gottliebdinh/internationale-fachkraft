-- Lead-Capture: separate table for registration leads (decoupled from auth)
CREATE TABLE IF NOT EXISTS public.leads (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  industry       text NOT NULL,
  industry_other text,
  seeking_type   text NOT NULL,        -- 'fachkraft', 'auszubildender', 'other'
  seeking_other  text,
  start_date     text,
  slots          int NOT NULL DEFAULT 1,
  name           text NOT NULL,
  email          text NOT NULL,
  phone          text NOT NULL,
  status         text NOT NULL DEFAULT 'new',  -- new | contacted | converted | archived
  notes          text,
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Only admins can read/write leads
CREATE POLICY leads_admin_all ON public.leads
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

-- Allow unauthenticated inserts from the API route (service-role key bypasses RLS,
-- but we also add an INSERT policy so anon can insert if needed in the future)
CREATE POLICY leads_anon_insert ON public.leads
  FOR INSERT WITH CHECK (true);
