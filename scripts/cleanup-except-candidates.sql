-- =============================================================================
-- 0) ZUERST DIAGNOSE (einzeln ausführen, nicht mit DELETE mischen)
-- =============================================================================
-- Zeigt alle Auth-User (hier steckt „E-Mail bereits registriert“, auch ohne public.users):
--   SELECT id, email, created_at, email_confirmed_at
--   FROM auth.users
--   ORDER BY created_at DESC;
--
-- Waisen: Zeile in auth.users, aber KEINE Zeile in public.users (409 trotz „leerer“ users-Tabelle):
--   SELECT a.id, a.email
--   FROM auth.users a
--   LEFT JOIN public.users p ON p.id = a.id
--   WHERE p.id IS NULL;
--
-- Wenn die blockierte E-Mail nur hier auftaucht: der frühere DELETE mit
--   WHERE id IN (SELECT id FROM public.users WHERE role = 'employer')
-- löscht NICHTS (leeres IN (...)), weil public.users für diese ID fehlt.

-- =============================================================================
-- 1) Normal: Arbeitgeber komplett (public.users + auth.users verkettet)
-- =============================================================================
-- Supabase → SQL Editor. Vorher Backup.

BEGIN;

UPDATE match_documents SET uploaded_by = NULL WHERE uploaded_by IS NOT NULL;
UPDATE candidate_extractions SET verified_by = NULL WHERE verified_by IS NOT NULL;

DELETE FROM audit_log;
DELETE FROM notifications;

DELETE FROM auth.users
WHERE id IN (SELECT id FROM public.users WHERE role = 'employer');

COMMIT;

-- =============================================================================
-- 2) NUR wenn 409 bleibt: Auth-Waisen entfernen (kein Eintrag in public.users)
-- =============================================================================
-- Gefahr: löscht auch „frische“ Registrierungen, bei denen der Trigger für
-- public.users noch nicht lief. In Produktion nur gezielt per E-Mail löschen.
--
-- Gezielt eine Adresse:
-- DELETE FROM auth.users WHERE lower(email) = lower('deine@mail.com');
--
-- Alle Waisen (ohne public.users-Zeile):
-- BEGIN;
-- DELETE FROM auth.users a
-- WHERE NOT EXISTS (SELECT 1 FROM public.users p WHERE p.id = a.id);
-- COMMIT;
