import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse"),
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen lang sein"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const leadSchema = z
  .object({
    industry: z.enum([
      "hospitality",
      "healthcare",
      "trade",
      "retail",
      "other",
    ]),
    industryOther: z.string().optional(),
    seekingType: z.enum(["fachkraft", "auszubildender", "other"]),
    seekingOther: z.string().optional(),
    startDate: z.string().optional(),
    slots: z.number().int().min(1),
    name: z.string().min(2, "Bitte geben Sie Ihren Namen ein."),
    email: z.string().email("Ungültige E-Mail-Adresse"),
    phone: z
      .string()
      .min(6, "Bitte geben Sie eine gültige Telefonnummer ein.")
      .max(40),
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type LeadFormData = z.infer<typeof leadSchema>;
