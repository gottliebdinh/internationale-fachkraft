export type UserRole = "admin" | "school" | "employer";
export type Locale = "de" | "vi" | "en";
export type Industry = "hospitality" | "hairdressing" | "nursing" | "other";
export type AccommodationType = "company_housing" | "rental_support" | "none";
export type GermanLevel = "A1" | "A2" | "B1" | "B2" | "C1";
export type Urgency = "immediate" | "3_months" | "6_months" | "flexible";
export type PositionType = "apprenticeship" | "skilled_worker" | "seasonal";
export type CandidateStatus =
  | "draft"
  | "active"
  | "matched"
  | "in_process"
  | "placed"
  | "withdrawn";
export type JobStatus = "draft" | "active" | "filled" | "closed";
export type MatchStatus =
  | "proposed"
  | "school_accepted"
  | "employer_accepted"
  | "both_accepted"
  | "interview_scheduled"
  | "contract_phase"
  | "ihk_submitted"
  | "approved"
  | "visa_applied"
  | "visa_granted"
  | "arrived"
  | "rejected"
  | "withdrawn";
export type DocumentType =
  | "passport"
  | "b1_certificate"
  | "cv"
  | "diploma"
  | "health_certificate"
  | "video"
  | "cover_letter"
  | "school_records"
  | "photo"
  | "application_bundle"
  | "other";

export type ExtractionStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "skipped";
export type MatchDocumentType =
  | "berufsausbildungsvertrag"
  | "erklaerung_beschaeftigung"
  | "ausbildungsplan"
  | "mietvertrag"
  | "arbeitsvertrag"
  | "visa_application"
  | "anerkennungsbescheid"
  | "other";
export type NotificationType =
  | "match_proposed"
  | "document_required"
  | "status_changed"
  | "message"
  | "system";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  locale: Locale;
  created_at: string;
  updated_at: string;
}

export interface School {
  id: string;
  user_id: string;
  name: string;
  license_number: string;
  region: string;
  contact_person: string;
  phone: string;
  website: string | null;
  government_affiliation: string | null;
  verified: boolean;
  documents: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface Employer {
  id: string;
  user_id: string;
  company_name: string;
  industry: Industry;
  address: string;
  city: string;
  plz: string;
  contact_person: string;
  phone: string;
  trade_license_number: string;
  union_compliant: boolean;
  accommodation_type: AccommodationType;
  accommodation_details: {
    address?: string;
    rental_ref?: string;
    sqm?: number;
    monthly_cost?: number;
  } | null;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Candidate {
  id: string;
  school_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  nationality: string;
  passport_number: string;
  passport_expiry: string;
  gender: string;
  specialization: Industry;
  german_level: GermanLevel;
  b1_certificate_date: string | null;
  education_level: string;
  work_experience_years: number;
  availability_date: string;
  urgency: Urgency;
  video_intro_url: string | null;
  profile_photo_url: string | null;
  status: CandidateStatus;
  position_type: string | null;
  desired_position: string | null;
  desired_field: string | null;
  created_at: string;
  updated_at: string;
}

export interface CandidateDocument {
  id: string;
  candidate_id: string;
  document_type: DocumentType;
  file_url: string;
  file_name: string;
  verified_by_admin: boolean;
  uploaded_at: string;
  extracted_data: Record<string, unknown> | null;
  extraction_status: ExtractionStatus;
  extraction_model: string | null;
  extraction_error: string | null;
  original_file_name: string | null;
  file_size_bytes: number | null;
  mime_type: string | null;
  storage_path: string | null;
}

export interface CandidateExtraction {
  id: string;
  candidate_id: string;
  source_document_id: string | null;
  field_name: string;
  extracted_value: string | null;
  confidence: number | null;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
}

export interface JobPosition {
  id: string;
  employer_id: string;
  title: string;
  position_type: PositionType;
  specialization: Industry;
  description: string;
  start_date: string;
  urgency: Urgency;
  slots_total: number;
  slots_filled: number;
  salary_range: { min: number; max: number } | null;
  accommodation_provided: boolean;
  training_plan_url: string | null;
  status: JobStatus;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  candidate_id: string;
  job_position_id: string;
  initiated_by: "employer" | "school" | "system";
  status: MatchStatus;
  rejection_reason: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface MatchDocument {
  id: string;
  match_id: string;
  document_type: MatchDocumentType;
  file_url: string;
  file_name: string;
  generated: boolean;
  signed: boolean;
  signed_at: string | null;
  uploaded_by: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  ip_address: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  link: string | null;
  created_at: string;
}

export interface MatchWithRelations extends Match {
  candidate?: Candidate & { school?: School };
  job_position?: JobPosition & { employer?: Employer };
  documents?: MatchDocument[];
}

export interface CandidateWithDocuments extends Candidate {
  documents?: CandidateDocument[];
  school?: School;
}

export interface JobPositionWithEmployer extends JobPosition {
  employer?: Employer;
}
