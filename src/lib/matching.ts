import type { Candidate, JobPosition, Employer } from "@/types/database";

interface MatchScore {
  candidateId: string;
  score: number;
  breakdown: {
    urgency: number;
    availability: number;
    experience: number;
    accommodation: number;
    germanLevel: number;
  };
}

const GERMAN_LEVEL_MAP: Record<string, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
};

export function calculateMatchScore(
  candidate: Candidate,
  position: JobPosition,
  employer: Employer
): MatchScore {
  const breakdown = {
    urgency: candidate.urgency === position.urgency ? 30 : 0,
    availability:
      new Date(candidate.availability_date) <= new Date(position.start_date)
        ? 20
        : 0,
    experience: Math.min(candidate.work_experience_years * 5, 25),
    accommodation:
      employer.accommodation_type !== "none" ? 10 : 0,
    germanLevel: Math.max(
      0,
      ((GERMAN_LEVEL_MAP[candidate.german_level] || 0) - 3) * 5
    ),
  };

  return {
    candidateId: candidate.id,
    score: Object.values(breakdown).reduce((sum, v) => sum + v, 0),
    breakdown,
  };
}

export function filterCandidates(
  candidates: Candidate[],
  filters: {
    specialization?: string;
    germanLevel?: string;
    urgency?: string;
    search?: string;
    minExperience?: number;
  }
): Candidate[] {
  return candidates.filter((c) => {
    if (filters.specialization && c.specialization !== filters.specialization)
      return false;
    if (
      filters.germanLevel &&
      (GERMAN_LEVEL_MAP[c.german_level] || 0) <
        (GERMAN_LEVEL_MAP[filters.germanLevel] || 0)
    )
      return false;
    if (filters.urgency && c.urgency !== filters.urgency) return false;
    if (
      filters.minExperience &&
      c.work_experience_years < filters.minExperience
    )
      return false;
    if (filters.search) {
      const term = filters.search.toLowerCase();
      const fullName = `${c.first_name} ${c.last_name}`.toLowerCase();
      if (!fullName.includes(term)) return false;
    }
    return true;
  });
}

export function rankCandidatesForPosition(
  candidates: Candidate[],
  position: JobPosition,
  employer: Employer
): MatchScore[] {
  return candidates
    .filter(
      (c) =>
        c.specialization === position.specialization &&
        (GERMAN_LEVEL_MAP[c.german_level] || 0) >= 3 &&
        c.status === "active"
    )
    .map((c) => calculateMatchScore(c, position, employer))
    .sort((a, b) => b.score - a.score);
}

export const MATCH_STATUS_ORDER = [
  "proposed",
  "school_accepted",
  "employer_accepted",
  "both_accepted",
  "interview_scheduled",
  "contract_phase",
  "ihk_submitted",
  "approved",
  "visa_applied",
  "visa_granted",
  "arrived",
] as const;

export const MATCH_STATUS_LABELS: Record<string, string> = {
  proposed: "Vorgeschlagen",
  school_accepted: "Schule bestätigt",
  employer_accepted: "Arbeitgeber bestätigt",
  both_accepted: "Beidseitig bestätigt",
  interview_scheduled: "Interview geplant",
  contract_phase: "Vertragsphase",
  ihk_submitted: "IHK eingereicht",
  approved: "Genehmigt",
  visa_applied: "Visum beantragt",
  visa_granted: "Visum erteilt",
  arrived: "Angekommen",
  rejected: "Abgelehnt",
  withdrawn: "Zurückgezogen",
};

export const REQUIRED_DOCUMENTS_PER_PHASE: Record<string, string[]> = {
  contract_phase: ["arbeitsvertrag", "mietvertrag"],
  ihk_submitted: [
    "berufsausbildungsvertrag",
    "erklaerung_beschaeftigung",
    "ausbildungsplan",
  ],
  visa_applied: ["visa_application"],
  approved: ["anerkennungsbescheid"],
};
