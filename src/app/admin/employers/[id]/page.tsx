import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  fetchAuthUserForEmployer,
  getEmployerAccountAuthStatus,
} from "@/lib/employer-auth-account-status";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmployerAccountAuthCard } from "@/components/admin/employer-account-auth-card";
import { EmployerEditForm } from "@/components/admin/employer-edit-form";
import { EmployerPositionsView, type PositionWithMatches } from "@/components/admin/employer-positions-view";
import { EmployerDeleteSection } from "@/components/admin/employer-delete-section";
import type { Employer } from "@/types/database";

const INDUSTRY_LABELS: Record<string, string> = {
  hospitality: "Gastronomie",
  hairdressing: "Friseur",
  nursing: "Pflege",
  other: "Andere",
};

const ACCOMMODATION_LABELS: Record<string, string> = {
  company_housing: "Firmenwohnung",
  rental_support: "Mietunterstützung",
  none: "Keine",
};

export default async function EmployerDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  const { id } = await params;
  const { edit } = await searchParams;
  const isEditMode = edit === "1";

  const supabase = createAdminClient();

  const { data: employer, error } = await supabase
    .from("employers")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !employer) notFound();

  const { data: jobPositions } = await supabase
    .from("job_positions")
    .select("id, title, specialization, position_type, slots_total, start_date")
    .eq("employer_id", id)
    .order("created_at", { ascending: true });

  const jpIds = (jobPositions ?? []).map((jp) => jp.id);
  let matchRows: any[] = [];

  if (jpIds.length > 0) {
    const { data } = await supabase
      .from("matches")
      .select("id, status, candidate_id, job_position_id, created_at, candidates(id, first_name, last_name, profile_photo_url, german_level, desired_position, desired_field)")
      .in("job_position_id", jpIds)
      .order("created_at", { ascending: false });

    matchRows = data ?? [];
  }

  const matchesWithPhotos = await Promise.all(
    matchRows.map(async (m: any) => {
      const c = m.candidates;
      let photoUrl: string | null = null;
      if (c?.profile_photo_url) {
        const { data: signed } = await supabase.storage
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

  const positionsWithMatches: PositionWithMatches[] = (jobPositions ?? []).map((jp) => ({
    id: jp.id,
    title: jp.title,
    position_type: jp.position_type,
    slots_total: jp.slots_total ?? 0,
    start_date: jp.start_date,
    matches: matchesByJpId.get(jp.id) ?? [],
  }));

  const { data: allCandidates } = await supabase
    .from("candidates")
    .select("id, first_name, last_name, profile_photo_url, german_level, desired_position, desired_field")
    .order("first_name");

  const existingCandidateIds = new Set(matchRows.map((m: any) => m.candidate_id));
  const availableCandidates = (allCandidates ?? []).filter(
    (c) => !existingCandidateIds.has(c.id)
  );

  const industryLabel =
    employer.industry === "other" && employer.industry_other
      ? employer.industry_other
      : INDUSTRY_LABELS[employer.industry] ?? employer.industry;

  const e = employer as Employer;

  const authUser = await fetchAuthUserForEmployer(supabase, e.user_id);
  const accountAuth = getEmployerAccountAuthStatus(authUser);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link
            href="/admin/employers"
            className="gap-2 text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Alle Unternehmen
          </Link>
        </Button>

        {!isEditMode && (
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/employers/${id}/preview`} className="gap-2">
                <Eye className="h-3.5 w-3.5" />
                Dashboard-Vorschau
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/employers/${id}?edit=1`} className="gap-2">
                <Pencil className="h-3.5 w-3.5" />
                Bearbeiten
              </Link>
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl">{e.company_name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {industryLabel}
                {e.city ? ` · ${e.city}` : ""}
              </p>
            </div>
            {e.verified && (
              <Badge
                variant="outline"
                className="ml-auto border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
              >
                Verifiziert
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditMode ? (
            <EmployerEditForm employer={e} />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow label="Kontaktperson" value={e.contact_person} />
              <InfoRow label="E-Mail" value={e.email} />
              <InfoRow label="Telefon" value={e.phone} />
              <InfoRow label="Adresse" value={e.address} />
              <InfoRow label="Stadt" value={e.city} />
              <InfoRow label="PLZ" value={e.plz} />
              <InfoRow label="Branche" value={industryLabel} />
              <InfoRow label="Gewerbescheinnr." value={e.trade_license_number} />
              <InfoRow
                label="Unterkunft"
                value={ACCOMMODATION_LABELS[e.accommodation_type] ?? e.accommodation_type}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <EmployerAccountAuthCard employerId={id} initial={accountAuth} />

      <Card>
        <CardHeader>
          <CardTitle>Stellen &amp; Kandidaten</CardTitle>
          <p className="text-sm font-normal text-muted-foreground">
            Jede Stelle als eigene Box mit zugeordneten Kandidaten und Pipeline-Status.
          </p>
        </CardHeader>
        <CardContent>
          <EmployerPositionsView
            employerId={id}
            positions={positionsWithMatches}
            availableCandidates={availableCandidates}
          />
        </CardContent>
      </Card>

      {!isEditMode && (
        <EmployerDeleteSection
          employerId={id}
          companyName={e.company_name}
        />
      )}
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm">{value || "–"}</p>
    </div>
  );
}
