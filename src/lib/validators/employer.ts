import { z } from "zod";

export const employerProfileSchema = z.object({
  company_name: z.string().min(2, "Firmenname ist erforderlich"),
  industry: z.enum(["hospitality", "hairdressing", "nursing", "other"]),
  industry_other: z.string().optional(),
  address: z.string().min(2, "Adresse ist erforderlich"),
  city: z.string().min(2, "Stadt ist erforderlich"),
  plz: z.string().regex(/^\d{5}$/, "PLZ muss 5 Ziffern haben"),
  contact_person: z.string().min(2, "Ansprechpartner ist erforderlich"),
  phone: z.string().min(6, "Telefonnummer ist erforderlich"),
  trade_license_number: z.string().optional(),
  accommodation_type: z.enum(["company_housing", "rental_support", "none"]),
  accommodation_details: z
    .object({
      address: z.string().optional(),
      rental_ref: z.string().optional(),
      sqm: z.number().optional(),
      monthly_cost: z.number().optional(),
    })
    .nullable()
    .optional(),
});

export const jobPositionSchema = z.object({
  title: z.string().min(2, "Stellentitel ist erforderlich"),
  position_type: z.enum(["apprenticeship", "skilled_worker", "seasonal"]),
  specialization: z.enum(["hospitality", "hairdressing", "nursing", "other"]),
  description: z.string().min(10, "Beschreibung ist erforderlich"),
  start_date: z.string().min(1, "Startdatum ist erforderlich"),
  urgency: z.enum(["immediate", "3_months", "6_months", "flexible"]),
  slots_total: z.number().min(1, "Mindestens 1 Platz"),
  salary_range: z
    .object({
      min: z.number().min(0),
      max: z.number().min(0),
    })
    .nullable()
    .optional(),
  accommodation_provided: z.boolean(),
  training_plan_url: z.string().optional(),
});

export type EmployerProfileFormData = z.infer<typeof employerProfileSchema>;
export type JobPositionFormData = z.infer<typeof jobPositionSchema>;

