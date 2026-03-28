import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Briefcase,
  Languages,
  FileText,
  ExternalLink,
  Check,
} from "lucide-react";

const PIPELINE_STEPS = [
  { key: "employer_accepted", label: "AG akzeptiert" },
  { key: "both_accepted", label: "Beide akzeptiert" },
  { key: "ihk_submitted", label: "IHK eingereicht" },
  { key: "visa_applied", label: "Visum beantragt" },
  { key: "visa_granted", label: "Visum erteilt" },
  { key: "arrived", label: "Angekommen" },
];

function formatDate(d: string | null): string {
  if (!d) return "–";
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

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

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const admin = createAdminClient();

  const { data: employer } = await admin
    .from("employers")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!employer) redirect("/auth/login");

  const { data: c, error } = await admin
    .from("candidates")
    .select(
      "id, first_name, last_name, date_of_birth, nationality, german_level, desired_position, desired_field, position_type, profile_photo_url, gender"
    )
    .eq("id", id)
    .single();

  if (error || !c) notFound();

  let currentStatus = "employer_accepted";
  {
    const { data: matchRow } = await admin
      .from("matches")
      .select("status, job_position_id, job_positions!inner(employer_id)")
      .eq("candidate_id", id)
      .eq("job_positions.employer_id", employer.id)
      .limit(1)
      .maybeSingle();

    if (matchRow?.status) {
      currentStatus = matchRow.status;
    }
  }

  const { data: coverLetterDocs } = await admin
    .from("candidate_documents")
    .select("extracted_data")
    .eq("candidate_id", id)
    .eq("document_type", "cover_letter")
    .limit(1);

  const motivation =
    (coverLetterDocs?.[0]?.extracted_data as any)?.motivation_summary ??
    (coverLetterDocs?.[0]?.extracted_data as any)?.motivation ??
    null;

  const { data: cvDocs } = await admin
    .from("candidate_documents")
    .select("storage_path")
    .eq("candidate_id", id)
    .eq("document_type", "cv")
    .limit(1);

  let cvUrl: string | null = null;
  if (cvDocs?.[0]?.storage_path) {
    const { data: signed } = await admin.storage
      .from("candidate-docs")
      .createSignedUrl(cvDocs[0].storage_path, 3600);
    cvUrl = signed?.signedUrl ?? null;
  }

  let photoUrl: string | null = null;
  if (c.profile_photo_url) {
    const { data: signed } = await admin.storage
      .from("candidate-docs")
      .createSignedUrl(c.profile_photo_url, 3600);
    photoUrl = signed?.signedUrl ?? null;
  }

  const currentIndex = PIPELINE_STEPS.findIndex(
    (s) => s.key === currentStatus
  );
  const age = getAge(c.date_of_birth);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 pb-8">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/employer" className="gap-2 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          Alle Kandidaten
        </Link>
      </Button>

      <Card>
        <CardContent className="py-5">
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Prozess-Status
          </p>
          <div className="flex items-center gap-0">
            {PIPELINE_STEPS.map((step, i) => {
              const done = i <= currentIndex;
              const isCurrent = i === currentIndex;
              return (
                <div
                  key={step.key}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div className="flex w-full items-center">
                    {i > 0 ? (
                      <div
                        className={`h-0.5 flex-1 ${
                          i <= currentIndex
                            ? "bg-[oklch(0.50_0.11_195)]"
                            : "bg-border"
                        }`}
                      />
                    ) : (
                      <div className="flex-1" />
                    )}

                    <div
                      className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors ${
                        done
                          ? "border-[oklch(0.50_0.11_195)] bg-[oklch(0.50_0.11_195)] text-white"
                          : "border-border bg-background text-muted-foreground"
                      } ${isCurrent ? "ring-2 ring-[oklch(0.50_0.11_195)]/30 ring-offset-2 ring-offset-background" : ""}`}
                    >
                      {done ? <Check className="h-4 w-4" /> : i + 1}
                    </div>

                    {i < PIPELINE_STEPS.length - 1 ? (
                      <div
                        className={`h-0.5 flex-1 ${
                          i < currentIndex
                            ? "bg-[oklch(0.50_0.11_195)]"
                            : "bg-border"
                        }`}
                      />
                    ) : (
                      <div className="flex-1" />
                    )}
                  </div>

                  <span
                    className={`text-center text-[10px] leading-tight sm:text-xs ${
                      isCurrent
                        ? "font-semibold text-foreground"
                        : done
                          ? "font-medium text-[oklch(0.50_0.11_195)]"
                          : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-2xl bg-muted">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={`${c.first_name} ${c.last_name}`}
              fill
              className="object-cover"
              sizes="160px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-muted-foreground/40">
              {c.first_name?.[0]}
              {c.last_name?.[0]}
            </div>
          )}
        </div>

        <div className="flex-1 space-y-1">
          <h1 className="font-[var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">
            {c.first_name} {c.last_name}
          </h1>
          <p className="text-base text-muted-foreground">
            {c.desired_position ?? "–"}
          </p>
          {c.desired_field && (
            <Badge variant="secondary" className="mt-1">
              {c.desired_field}
            </Badge>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoRow
              icon={Calendar}
              label="Geburtsdatum"
              value={`${formatDate(c.date_of_birth)}${age ? ` (${age} Jahre)` : ""}`}
            />
            <InfoRow
              icon={Briefcase}
              label="Positionsart"
              value={c.position_type ?? "–"}
            />
            <InfoRow
              icon={Languages}
              label="Deutschkenntnisse"
              value={c.german_level ? `${c.german_level}` : "–"}
            />
            <InfoRow
              icon={Briefcase}
              label="Beruf"
              value={c.desired_position ?? "–"}
            />
          </div>
        </CardContent>
      </Card>

      {motivation && (
        <Card>
          <CardContent className="py-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Motivation
            </p>
            <p className="text-sm leading-relaxed text-foreground">
              {motivation}
            </p>
          </CardContent>
        </Card>
      )}

      {cvUrl && (
        <Card>
          <CardContent className="py-5">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Dokumente
            </p>
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                <FileText className="h-4 w-4" />
                Lebenslauf ansehen
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
