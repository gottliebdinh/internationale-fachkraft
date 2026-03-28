import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const TEST_EMPLOYERS = [
  {
    company_name: "Seniorenresidenz Am Stadtpark",
    industry: "nursing",
    industry_other: null,
    contact_person: "Maria Schneider",
    phone: "+49 30 1234567",
    address: "Parkstr. 12",
    city: "Berlin",
    plz: "10115",
    trade_license_number: "HRB 12345",
    accommodation_type: "company_housing",
  },
  {
    company_name: "Burger Palace GmbH",
    industry: "hospitality",
    industry_other: null,
    contact_person: "Thomas Mueller",
    phone: "+49 89 9876543",
    address: "Leopoldstr. 44",
    city: "Muenchen",
    plz: "80802",
    trade_license_number: null,
    accommodation_type: "rental_support",
  },
  {
    company_name: "Baeckerei Goldkruste",
    industry: "other",
    industry_other: "Baeckerei",
    contact_person: "Hans Weber",
    phone: "+49 221 5551234",
    address: "Domstr. 8",
    city: "Koeln",
    plz: "50667",
    trade_license_number: "HRB 67890",
    accommodation_type: "none",
  },
  {
    company_name: "Kaufhaus Zentral",
    industry: "other",
    industry_other: "Einzelhandel",
    contact_person: "Petra Fischer",
    phone: "+49 40 3334455",
    address: "Moenckebergstr. 22",
    city: "Hamburg",
    plz: "20095",
    trade_license_number: null,
    accommodation_type: "none",
  },
];

async function main() {
  // Get a user_id to associate with
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (!user) {
    console.error("Kein User in der DB gefunden. Bitte zuerst einen User anlegen.");
    process.exit(1);
  }

  console.log(`Verwende user_id: ${user.id}`);

  for (const emp of TEST_EMPLOYERS) {
    const { data, error } = await supabase
      .from("employers")
      .insert({ ...emp, user_id: user.id })
      .select("id, company_name")
      .single();

    if (error) {
      console.error(`Fehler bei "${emp.company_name}": ${error.message}`);
    } else {
      console.log(`Angelegt: ${data.company_name} (${data.id})`);
    }
  }

  console.log("Fertig.");
}

main().catch((e) => { console.error(e); process.exit(1); });
