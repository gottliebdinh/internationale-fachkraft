import { createAdminClient } from "@/lib/supabase/admin";
import { Users } from "lucide-react";
import { CandidateGrid } from "@/components/admin/candidate-grid";
import { CandidateImportDialog } from "@/components/admin/candidate-import-dialog";

const BUCKET = "candidate-docs";

function getAge(dob: string | null): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

export default async function AdminCandidatesPage() {
  const supabase = createAdminClient();

  const { data: candidates, error } = await supabase
    .from("candidates")
    .select(
      "id, first_name, last_name, date_of_birth, gender, desired_position, desired_field, position_type, german_level, nationality, status, profile_photo_url"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-20 text-muted-foreground">
        <p>Fehler beim Laden: {error.message}</p>
      </div>
    );
  }

  // Fetch match statuses for all candidates
  const candidateIds = (candidates ?? []).map((c) => c.id);
  let matchStatusMap = new Map<string, string>();
  if (candidateIds.length > 0) {
    const { data: matchData } = await supabase
      .from("matches")
      .select("candidate_id, status")
      .in("candidate_id", candidateIds);
    for (const m of matchData ?? []) {
      matchStatusMap.set(m.candidate_id, m.status);
    }
  }

  const candidatesWithPhotos = await Promise.all(
    (candidates ?? []).map(async (c) => {
      let photoUrl: string | null = null;
      if (c.profile_photo_url) {
        const { data } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(c.profile_photo_url, 3600);
        if (data?.signedUrl) photoUrl = data.signedUrl;
      }
      const matchStatus = matchStatusMap.get(c.id) ?? null;
      return { ...c, photoUrl, matchStatus };
    })
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Kandidaten</h1>
            <p className="text-sm text-muted-foreground">
              {candidatesWithPhotos.length} Kandidaten im System
            </p>
          </div>
        </div>
        <CandidateImportDialog />
      </div>

      <CandidateGrid candidates={candidatesWithPhotos} />
    </div>
  );
}
