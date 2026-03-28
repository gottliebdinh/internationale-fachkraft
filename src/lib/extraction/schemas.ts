import { z } from "zod/v4";

// ---------------------------------------------------------------------------
// Passport
// ---------------------------------------------------------------------------
export const passportSchema = z.object({
  full_name: z.string().nullable(),
  date_of_birth: z.string().nullable(),
  nationality: z.string().nullable(),
  passport_number: z.string().nullable(),
  passport_expiry: z.string().nullable(),
  gender: z.string().nullable(),
  place_of_birth: z.string().nullable(),
});
export type PassportExtraction = z.infer<typeof passportSchema>;

// ---------------------------------------------------------------------------
// B1 Certificate
// ---------------------------------------------------------------------------
export const b1CertificateSchema = z.object({
  german_level: z.string().nullable(),
  exam_date: z.string().nullable(),
});
export type B1CertificateExtraction = z.infer<typeof b1CertificateSchema>;

// ---------------------------------------------------------------------------
// CV / Lebenslauf
// ---------------------------------------------------------------------------
export const cvSchema = z.object({
  education: z
    .array(
      z.object({
        institution: z.string().nullable(),
        degree: z.string().nullable(),
        field: z.string().nullable(),
        start_date: z.string().nullable(),
        end_date: z.string().nullable(),
      })
    )
    .nullable(),
  skills: z.array(z.string()).nullable(),
  languages: z
    .array(
      z.object({
        language: z.string(),
        level: z.string().nullable(),
      })
    )
    .nullable(),
});
export type CvExtraction = z.infer<typeof cvSchema>;

// ---------------------------------------------------------------------------
// Diploma / Abitur / Zeugnis
// ---------------------------------------------------------------------------
export const diplomaSchema = z.object({
  school_name: z.string().nullable(),
  graduation_date: z.string().nullable(),
  degree: z.string().nullable(),
});
export type DiplomaExtraction = z.infer<typeof diplomaSchema>;

// ---------------------------------------------------------------------------
// Cover Letter / Anschreiben  (zentral für Positionsart + Beruf + Branche)
// ---------------------------------------------------------------------------
export const coverLetterSchema = z.object({
  position_type: z.string().nullable(),
  desired_position: z.string().nullable(),
  desired_field: z.string().nullable(),
  target_company: z.string().nullable(),
  target_city: z.string().nullable(),
  motivation_summary: z.string().nullable(),
});
export type CoverLetterExtraction = z.infer<typeof coverLetterSchema>;

// ---------------------------------------------------------------------------
// Health Certificate
// ---------------------------------------------------------------------------
export const healthCertificateSchema = z.object({
  issue_date: z.string().nullable(),
  issuing_authority: z.string().nullable(),
  valid_until: z.string().nullable(),
  result: z.string().nullable(),
});
export type HealthCertificateExtraction = z.infer<
  typeof healthCertificateSchema
>;

// ---------------------------------------------------------------------------
// School Records / Học bạ
// ---------------------------------------------------------------------------
export const schoolRecordsSchema = z.object({
  school_name: z.string().nullable(),
  student_name: z.string().nullable(),
  years_covered: z.string().nullable(),
});
export type SchoolRecordsExtraction = z.infer<typeof schoolRecordsSchema>;

// ---------------------------------------------------------------------------
// Registry: schema lookup by document type
// ---------------------------------------------------------------------------
export const extractionSchemas = {
  passport: passportSchema,
  b1_certificate: b1CertificateSchema,
  cv: cvSchema,
  diploma: diplomaSchema,
  cover_letter: coverLetterSchema,
  health_certificate: healthCertificateSchema,
  school_records: schoolRecordsSchema,
} as const;

export type ExtractableDocumentType = keyof typeof extractionSchemas;

export function isExtractable(type: string): type is ExtractableDocumentType {
  return type in extractionSchemas;
}
