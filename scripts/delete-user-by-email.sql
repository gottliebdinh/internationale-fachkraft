-- Einmalig im Supabase SQL Editor ausführen (Projekt mit Postgres-Rechten).
-- Löscht den Auth-User und die zugehörige public.users-Zeile inkl. CASCADE
-- (Schule/Arbeitgeber/Kandidaten …), nachdem blockierende Fremdschlüssel bereinigt sind.

DO $$
DECLARE
  target_email text := 'gottliebdinh99@gmail.com';
  uid uuid;
BEGIN
  SELECT id INTO uid FROM auth.users WHERE email = target_email;
  IF uid IS NULL THEN
    RAISE NOTICE 'Kein auth.users-Eintrag für %', target_email;
    RETURN;
  END IF;

  RAISE NOTICE 'Lösche Daten für user_id %', uid;

  DELETE FROM public.audit_log WHERE user_id = uid;
  UPDATE public.match_documents SET uploaded_by = NULL WHERE uploaded_by = uid;
  UPDATE public.candidate_extractions SET verified_by = NULL WHERE verified_by = uid;

  DELETE FROM auth.users WHERE id = uid;

  RAISE NOTICE 'Fertig: % entfernt.', target_email;
END $$;
