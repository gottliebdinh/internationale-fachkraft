import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "candidate-docs";

export type GridCandidate = {
  id: string;
  first_name: string;
  last_name: string;
  age: number;
  nationality: string | null;
  desired_position: string | null;
  desired_field: string | null;
  german_level: string | null;
  position_type: string | null;
  image: string;
};

function getAge(dob: string | null): number | null {
  if (!dob) return null;
  const b = new Date(dob);
  if (isNaN(b.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  if (
    now.getMonth() < b.getMonth() ||
    (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())
  )
    age--;
  return age;
}

/** Drei Beispiel-Kandidaten mit Foto für den Teaser (gleiches Layout wie Admin-Karten). */
export async function fetchTeaserGridCandidates(
  supabase: SupabaseClient
): Promise<GridCandidate[]> {
  const { data: candidates } = await supabase
    .from("candidates")
    .select(
      "id, first_name, last_name, date_of_birth, nationality, desired_position, desired_field, german_level, position_type, profile_photo_url"
    )
    .not("profile_photo_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(3);

  return Promise.all(
    (candidates ?? []).map(async (c) => {
      let photoUrl: string | null = null;
      if (c.profile_photo_url) {
        const { data } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(c.profile_photo_url, 3600);
        photoUrl = data?.signedUrl ?? null;
      }
      const age = getAge(c.date_of_birth);
      return {
        id: c.id,
        first_name: c.first_name,
        last_name: c.last_name,
        age: age ?? 0,
        nationality: c.nationality,
        desired_position: c.desired_position,
        desired_field: c.desired_field,
        german_level: c.german_level,
        position_type: c.position_type,
        image: photoUrl ?? "",
      };
    })
  );
}
