-- Lotus&Eagle Seed Data (for development/testing only)
-- Run this after migrations are applied

-- Note: In production, users are created via Supabase Auth.
-- These inserts assume corresponding auth.users entries exist.

-- Example: Insert test data for development
-- You would need to create auth users first via the Supabase Dashboard or API,
-- then the trigger will auto-create the public.users entries.

-- Sample school data (after user creation)
-- INSERT INTO schools (user_id, name, license_number, region, contact_person, phone, verified)
-- VALUES
--   ('school-user-uuid-1', 'Hanoi Tourism College', 'HTC-2024-001', 'Hanoi', 'Nguyen Van B', '+84 24 1234 5678', true),
--   ('school-user-uuid-2', 'HCMC Vocational Training Center', 'HCMC-2024-002', 'Ho Chi Minh City', 'Tran Thi C', '+84 28 9876 5432', true);

-- Sample employer data (after user creation)
-- INSERT INTO employers (user_id, company_name, industry, address, city, plz, contact_person, phone, verified, accommodation_type)
-- VALUES
--   ('employer-user-uuid-1', 'Hotel Adlon Kempinski', 'hospitality', 'IHK Berlin', 'Unter den Linden 77', 'Berlin', '10117', 'Hans Mueller', '+49 30 1234 5678', true, 'company_housing'),
--   ('employer-user-uuid-2', 'Salon Schnitt & Style', 'hairdressing', 'IHK München', 'Maximilianstr. 12', 'München', '80539', 'Maria Schmidt', '+49 89 9876 5432', true, 'rental_support'),
--   ('employer-user-uuid-3', 'Pflegeheim Sonnenschein', 'nursing', 'IHK Köln', 'Rheinuferstr. 45', 'Köln', '50668', 'Klaus Weber', '+49 221 5555 1234', true, 'company_housing');

SELECT 'Seed file loaded. Create auth users first, then uncomment and run INSERT statements.' AS info;
