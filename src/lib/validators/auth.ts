import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse"),
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen lang sein"),
});

export const registerEmployerSchema = z
  .object({
    email: z.string().email("Ungültige E-Mail-Adresse"),
    password: z
      .string()
      .min(8, "Passwort muss mindestens 8 Zeichen lang sein"),
    confirmPassword: z.string(),
    companyName: z.string().min(2, "Firmenname ist erforderlich"),
    industry: z.enum(["hospitality", "hairdressing", "nursing", "other"]),
    industryOther: z.string().optional(),
    lookingFor: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    plz: z.string().optional(),
    contactPerson: z.string().optional(),
    phone: z.string().optional(),
    verificationCode: z
      .string()
      .regex(/^\d{6}$/, "Bitte geben Sie den 6-stelligen Code ein."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwörter stimmen nicht überein",
    path: ["confirmPassword"],
  })
  .refine(
    (data) =>
      data.industry !== "other" ||
      (typeof data.industryOther === "string" && data.industryOther.trim().length > 0),
    { message: "Bitte geben Sie Ihre Branche ein.", path: ["industryOther"] }
  );

export const registerSchoolSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    inviteCode: z.string().min(1, "Invite code is required"),
    schoolName: z.string().min(2, "School name is required"),
    region: z.string().min(2, "Region is required"),
    contactPerson: z.string().min(2, "Contact person is required"),
    phone: z.string().min(6, "Phone number is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterEmployerFormData = z.infer<typeof registerEmployerSchema>;
export type RegisterSchoolFormData = z.infer<typeof registerSchoolSchema>;
