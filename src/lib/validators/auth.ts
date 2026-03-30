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
    industry: z.enum(["hospitality", "hairdressing", "nursing", "other"]),
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
  })
  .refine(
    (data) =>
      data.industry !== "other" ||
      (typeof data.industryOther === "string" && data.industryOther.trim().length > 0),
    { message: "Bitte geben Sie Ihre Branche ein.", path: ["industryOther"] }
  )
  .refine(
    (data) =>
      data.seekingType !== "other" ||
      (typeof data.seekingOther === "string" && data.seekingOther.trim().length > 0),
    { message: "Bitte beschreiben Sie, wonach Sie suchen.", path: ["seekingOther"] }
  );

export type LoginFormData = z.infer<typeof loginSchema>;
export type LeadFormData = z.infer<typeof leadSchema>;
