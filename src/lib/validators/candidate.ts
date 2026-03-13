import { z } from "zod";

export const candidateSchema = z.object({
  first_name: z.string().min(1, "Vorname ist erforderlich"),
  last_name: z.string().min(1, "Nachname ist erforderlich"),
  date_of_birth: z.string().min(1, "Geburtsdatum ist erforderlich"),
  nationality: z.string().min(1).optional().default("VN"),
  passport_number: z.string().optional().default(""),
  passport_expiry: z.string().optional().default(""),
  gender: z.string().optional().default(""),
  specialization: z.enum(["hospitality", "hairdressing", "nursing", "other"]),
  german_level: z.enum(["A1", "A2", "B1", "B2", "C1"]),
  b1_certificate_date: z.string().optional().default(""),
  education_level: z.string().optional().default(""),
  work_experience_years: z.number().min(0).optional().default(0),
  availability_date: z.string().min(1, "Verfügbarkeitsdatum ist erforderlich"),
  urgency: z.enum(["immediate", "3_months", "6_months", "flexible"]),
});

export type CandidateFormData = z.input<typeof candidateSchema>;
