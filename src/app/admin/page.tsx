import Link from "next/link";
import Image from "next/image";
import { createAdminClient } from "@/lib/supabase/admin";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

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

const DOC_TYPE_LABELS: Record<string, string> = {
  passport: "Pass",
  b1_certificate: "B1",
  cv: "Lebenslauf",
  diploma: "Abitur",
  cover_letter: "Anschreiben",
  school_records: "Schulzeugnis",
  photo: "Foto",
  health_certificate: "Gesundheitszeugnis",
  application_bundle: "Bewerbungsunterlagen",
  video: "Video",
  other: "Sonstige",
};

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

  const candidatesWithPhotos = await Promise.all(
    (candidates ?? []).map(async (c) => {
      let photoUrl: string | null = null;
      if (c.profile_photo_url) {
        const { data } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(c.profile_photo_url, 3600);
        if (data?.signedUrl) photoUrl = data.signedUrl;
      }
      return { ...c, photoUrl };
    })
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-6 w-6 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kandidaten</h1>
          <p className="text-sm text-muted-foreground">
            {candidatesWithPhotos.length} Kandidaten im System
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {candidatesWithPhotos.map((c) => {
          const age = getAge(c.date_of_birth);
          const initials =
            (c.first_name?.[0] ?? "") + (c.last_name?.[0] ?? "");

          return (
            <Link
              key={c.id}
              href={`/admin/candidates/${c.id}`}
              className="group overflow-hidden rounded-xl border border-border bg-card ring-1 ring-transparent transition-all hover:border-border/80 hover:shadow-md hover:ring-foreground/5"
            >
              <div className="relative h-48 w-full bg-muted sm:h-52">
                {c.photoUrl ? (
                  <Image
                    src={c.photoUrl}
                    alt={`${c.first_name} ${c.last_name}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-3xl font-semibold text-muted-foreground/40">
                    {initials || "?"}
                  </div>
                )}
              </div>

              <div className="space-y-2.5 px-4 py-3.5">
                <div>
                  <p className="text-base font-semibold leading-snug text-foreground">
                    {c.first_name} {c.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {age !== null ? `${age} Jahre` : "Alter unbekannt"}
                    {c.nationality ? ` · ${c.nationality}` : ""}
                  </p>
                </div>

                {c.desired_position && (
                  <p className="text-sm leading-snug text-foreground/80">
                    {c.desired_position}
                  </p>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {c.desired_field && (
                    <Badge variant="secondary">{c.desired_field}</Badge>
                  )}
                  {c.german_level && (
                    <Badge variant="outline">Deutsch {c.german_level}</Badge>
                  )}
                  {c.position_type && (
                    <Badge variant="outline">{c.position_type}</Badge>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {candidatesWithPhotos.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-16 text-muted-foreground">
          <Users className="h-10 w-10" />
          <p>Keine Kandidaten vorhanden</p>
        </div>
      )}
    </div>
  );
}
