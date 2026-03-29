import type { SupabaseClient } from "@supabase/supabase-js";
import { fetchTeaserGridCandidates, type GridCandidate } from "@/lib/employer-teaser-candidates";

export type EmployerDashboardMatch = {
  id: string;
  status: string;
  photoUrl: string | null;
  candidates: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    date_of_birth: string | null;
    german_level: string | null;
    desired_position: string | null;
    desired_field: string | null;
    position_type: string | null;
  } | null;
};

export type EmployerDashboardPosition = {
  id: string;
  title: string;
  position_type: string | null;
  slots_total: number;
  start_date: string;
  matches: EmployerDashboardMatch[];
};

export type EmployerDashboardViewModel = {
  employer: {
    company_name: string;
    contact_person: string | null;
    phone: string | null;
  };
  positions: EmployerDashboardPosition[];
  totalMatches: number;
  teaserCandidates: GridCandidate[];
};

/** Lädt Stellen, Matches und Teaser-Daten für das Arbeitgeber-Dashboard (nach employer.id). */
export async function getEmployerDashboardViewModel(
  admin: SupabaseClient,
  employerId: string
): Promise<EmployerDashboardViewModel | null> {
  const { data: employer } = await admin
    .from("employers")
    .select("id, company_name, contact_person, phone")
    .eq("id", employerId)
    .maybeSingle();

  if (!employer) return null;

  const { data: jobPositions } = await admin
    .from("job_positions")
    .select("id, title, position_type, slots_total, start_date")
    .eq("employer_id", employerId)
    .order("created_at", { ascending: true });

  const jpIds = (jobPositions ?? []).map((jp) => jp.id);
  let matchRows: any[] = [];

  if (jpIds.length > 0) {
    const { data } = await admin
      .from("matches")
      .select(
        "id, status, candidate_id, job_position_id, candidates(id, first_name, last_name, date_of_birth, german_level, desired_position, desired_field, position_type, profile_photo_url)"
      )
      .in("job_position_id", jpIds)
      .order("created_at", { ascending: false });

    matchRows = data ?? [];
  }

  const matchesWithPhotos = await Promise.all(
    matchRows.map(async (m: any) => {
      const c = m.candidates;
      let photoUrl: string | null = null;
      if (c?.profile_photo_url) {
        const { data: signed } = await admin.storage
          .from("candidate-docs")
          .createSignedUrl(c.profile_photo_url, 3600);
        photoUrl = signed?.signedUrl ?? null;
      }
      return { ...m, photoUrl };
    })
  );

  const matchesByJpId = new Map<string, typeof matchesWithPhotos>();
  for (const m of matchesWithPhotos) {
    const list = matchesByJpId.get(m.job_position_id) ?? [];
    list.push(m);
    matchesByJpId.set(m.job_position_id, list);
  }

  const positions = (jobPositions ?? []).map((jp) => ({
    ...jp,
    slots_total: jp.slots_total ?? 0,
    matches: matchesByJpId.get(jp.id) ?? [],
  }));

  const totalMatches = matchesWithPhotos.length;
  const teaserCandidates =
    totalMatches === 0 ? await fetchTeaserGridCandidates(admin) : [];

  return {
    employer: {
      company_name: employer.company_name,
      contact_person: employer.contact_person,
      phone: employer.phone,
    },
    positions,
    totalMatches,
    teaserCandidates,
  };
}
