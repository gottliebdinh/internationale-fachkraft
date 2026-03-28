-- Fix: handle_new_user trigger fails because public.users has RLS enabled
-- but no INSERT policy. The trigger runs via SECURITY DEFINER but the function
-- owner may not bypass RLS in all Supabase configurations.

-- 1. Add INSERT policy so the trigger (and service role) can create user profiles
DROP POLICY IF EXISTS users_insert ON users;
CREATE POLICY users_insert ON users
  FOR INSERT WITH CHECK (true);

-- 2. Harden the trigger function: add search_path, handle duplicate gracefully
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, role, locale)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'employer'),
    COALESCE((NEW.raw_user_meta_data->>'locale')::locale, 'de')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
