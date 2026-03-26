import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  FileText,
  GraduationCap,
  Briefcase,
  Globe,
  User,
  Languages,
  Heart,
  BookOpen,
  Camera,
  FileArchive,
  Film,
  FileQuestion,
  CheckCircle2,
  XCircle,
  Clock,
  SkipForward,
  Pencil,
  Save,
} from "lucide-react";

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

const DOC_TYPE_META: Record<
  string,
  { label: string; icon: typeof FileText }
> = {
  passport: { label: "Reisepass", icon: Globe },
  b1_certificate: { label: "B1-Zertifikat", icon: Languages },
  cv: { label: "Lebenslauf", icon: Briefcase },
  diploma: { label: "Zeugnis / Abitur", icon: GraduationCap },
  cover_letter: { label: "Anschreiben", icon: FileText },
  school_records: { label: "Schulzeugnis", icon: BookOpen },
  photo: { label: "Foto", icon: Camera },
  health_certificate: { label: "Gesundheitszeugnis", icon: Heart },
  application_bundle: { label: "Bewerbungsunterlagen", icon: FileArchive },
  video: { label: "Video", icon: Film },
  other: { label: "Sonstige", icon: FileQuestion },
};

const STATUS_META: Record<
  string,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  completed: {
    label: "Extrahiert",
    icon: CheckCircle2,
    className: "text-emerald-600 dark:text-emerald-400",
  },
  failed: {
    label: "Fehlgeschlagen",
    icon: XCircle,
    className: "text-red-500",
  },
  pending: {
    label: "Ausstehend",
    icon: Clock,
    className: "text-amber-500",
  },
  skipped: {
    label: "Übersprungen",
    icon: SkipForward,
    className: "text-muted-foreground",
  },
  processing: {
    label: "In Bearbeitung",
    icon: Clock,
    className: "text-blue-500",
  },
};

export default async function CandidateDetailPage({
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

  const [candidateRes, docsRes] = await Promise.all([
    supabase.from("candidates").select("*").eq("id", id).single(),
    supabase
      .from("candidate_documents")
      .select("*")
      .eq("candidate_id", id)
      .order("document_type"),
  ]);

  if (candidateRes.error || !candidateRes.data) notFound();

  const c = candidateRes.data;
  const docs = docsRes.data ?? [];
  const age = getAge(c.date_of_birth);

  // Generate signed URLs for photo and all documents
  let photoUrl: string | null = null;
  if (c.profile_photo_url) {
    const { data } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(c.profile_photo_url, 3600);
    if (data?.signedUrl) photoUrl = data.signedUrl;
  }

  const docsWithUrls = await Promise.all(
    docs.map(async (doc) => {
      let downloadUrl: string | null = null;
      if (doc.storage_path) {
        const { data } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(doc.storage_path, 3600);
        if (data?.signedUrl) downloadUrl = data.signedUrl;
      }
      return { ...doc, downloadUrl };
    })
  );

  const initials = (c.first_name?.[0] ?? "") + (c.last_name?.[0] ?? "");

  // Group extracted data by source
  const passportData = docs.find(
    (d) => d.document_type === "passport" && d.extracted_data
  )?.extracted_data as Record<string, unknown> | undefined;

  const coverLetterData = docs.find(
    (d) => d.document_type === "cover_letter" && d.extracted_data
  )?.extracted_data as Record<string, unknown> | undefined;

  const b1Data = docs.find(
    (d) => d.document_type === "b1_certificate" && d.extracted_data
  )?.extracted_data as Record<string, unknown> | undefined;

  const diplomaData = docs.find(
    (d) => d.document_type === "diploma" && d.extracted_data
  )?.extracted_data as Record<string, unknown> | undefined;

  const cvData = docs.find(
    (d) => d.document_type === "cv" && d.extracted_data
  )?.extracted_data as Record<string, unknown> | undefined;

  async function updateCandidateAction(formData: FormData) {
    "use server";

    const admin = createAdminClient();

    const toNullable = (value: FormDataEntryValue | null) => {
      if (typeof value !== "string") return null;
      const trimmed = value.trim();
      return trimmed === "" ? null : trimmed;
    };

    const workYearsRaw = toNullable(formData.get("work_experience_years"));
    const workYears =
      workYearsRaw && !Number.isNaN(Number(workYearsRaw))
        ? Number(workYearsRaw)
        : 0;

    await admin
      .from("candidates")
      .update({
        first_name: toNullable(formData.get("first_name")) ?? c.first_name,
        last_name: toNullable(formData.get("last_name")) ?? c.last_name,
        date_of_birth: toNullable(formData.get("date_of_birth")) ?? c.date_of_birth,
        nationality: toNullable(formData.get("nationality")) ?? c.nationality,
        gender: toNullable(formData.get("gender")),
        passport_number: toNullable(formData.get("passport_number")),
        passport_expiry: toNullable(formData.get("passport_expiry")),
        position_type: toNullable(formData.get("position_type")),
        desired_position: toNullable(formData.get("desired_position")),
        desired_field: toNullable(formData.get("desired_field")),
        german_level: toNullable(formData.get("german_level")) ?? c.german_level,
        b1_certificate_date: toNullable(formData.get("b1_certificate_date")),
        education_level: toNullable(formData.get("education_level")),
        work_experience_years: workYears,
        status: toNullable(formData.get("status")) ?? c.status,
      })
      .eq("id", id);

    revalidatePath(`/admin/candidates/${id}`);
    redirect(`/admin/candidates/${id}`);
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin" className="gap-2 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </Link>
        </Button>

        <Button variant={isEditMode ? "secondary" : "outline"} size="sm" asChild>
          <Link
            href={
              isEditMode
                ? `/admin/candidates/${id}`
                : `/admin/candidates/${id}?edit=1`
            }
            className="gap-2"
          >
            <Pencil className="h-4 w-4" />
            {isEditMode ? "Bearbeiten beenden" : "Bearbeiten"}
          </Link>
        </Button>
      </div>

      {isEditMode && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Pencil className="h-4 w-4 text-muted-foreground" />
              Kandidat bearbeiten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateCandidateAction} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Vorname" name="first_name" defaultValue={c.first_name} />
                <Field label="Nachname" name="last_name" defaultValue={c.last_name} />
                <Field
                  label="Geburtsdatum"
                  name="date_of_birth"
                  type="date"
                  defaultValue={str(c.date_of_birth) ?? ""}
                />
                <Field label="Nationalität" name="nationality" defaultValue={c.nationality} />
                <Field label="Geschlecht" name="gender" defaultValue={str(c.gender) ?? ""} />
                <Field label="Passnummer" name="passport_number" defaultValue={str(c.passport_number) ?? ""} />
                <Field
                  label="Pass gültig bis"
                  name="passport_expiry"
                  type="date"
                  defaultValue={str(c.passport_expiry) ?? ""}
                />
                <Field label="Positionsart" name="position_type" defaultValue={str(c.position_type) ?? ""} />
                <Field label="Gewünschter Beruf" name="desired_position" defaultValue={str(c.desired_position) ?? ""} />
                <Field label="Bereich" name="desired_field" defaultValue={str(c.desired_field) ?? ""} />
                <Field label="Deutschlevel" name="german_level" defaultValue={str(c.german_level) ?? ""} />
                <Field
                  label="B1-Datum"
                  name="b1_certificate_date"
                  type="date"
                  defaultValue={str(c.b1_certificate_date) ?? ""}
                />
                <Field label="Bildung" name="education_level" defaultValue={str(c.education_level) ?? ""} />
                <Field
                  label="Erfahrung (Jahre)"
                  name="work_experience_years"
                  type="number"
                  defaultValue={String(c.work_experience_years ?? 0)}
                />
                <Field label="Status" name="status" defaultValue={str(c.status) ?? ""} />
              </div>

              <div className="flex justify-end">
                <Button type="submit" size="sm" className="gap-2">
                  <Save className="h-4 w-4" />
                  Änderungen speichern
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-muted sm:h-40 sm:w-40">
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
              {initials || "?"}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {c.first_name} {c.last_name}
          </h1>
          <p className="text-muted-foreground">
            {age !== null ? `${age} Jahre` : ""}
            {c.nationality ? ` · ${c.nationality}` : ""}
            {c.gender ? ` · ${c.gender === "male" ? "Männlich" : c.gender === "female" ? "Weiblich" : c.gender}` : ""}
          </p>

          {c.desired_position && (
            <p className="text-lg font-medium text-foreground/90">
              {c.desired_position}
            </p>
          )}

          <div className="flex flex-wrap gap-1.5 pt-1">
            {c.desired_field && (
              <Badge variant="secondary">{c.desired_field}</Badge>
            )}
            {c.german_level && (
              <Badge variant="outline">Deutsch {c.german_level}</Badge>
            )}
            {c.position_type && (
              <Badge variant="outline">{c.position_type}</Badge>
            )}
            <Badge
              variant={c.status === "active" ? "default" : "secondary"}
            >
              {c.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Personal data (from passport) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              Persönliche Daten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <InfoRow label="Geburtsdatum" value={formatDate(c.date_of_birth)} />
              <InfoRow label="Geburtsort" value={str(passportData?.place_of_birth)} />
              <InfoRow label="Nationalität" value={c.nationality} />
              <InfoRow label="Passnummer" value={c.passport_number} />
              <InfoRow label="Pass gültig bis" value={formatDate(c.passport_expiry)} />
            </dl>
          </CardContent>
        </Card>

        {/* Career wish (from cover letter) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              Berufswunsch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <InfoRow label="Positionsart" value={c.position_type} />
              <InfoRow label="Beruf" value={c.desired_position} />
              <InfoRow label="Bereich" value={c.desired_field} />
              <InfoRow label="Zielbetrieb" value={str(coverLetterData?.target_company)} />
              <InfoRow label="Zielort" value={str(coverLetterData?.target_city)} />
              {str(coverLetterData?.motivation_summary) && (
                <div className="pt-1">
                  <dt className="text-muted-foreground">Motivation</dt>
                  <dd className="mt-0.5 leading-relaxed text-foreground/90">
                    {str(coverLetterData?.motivation_summary)}
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        {/* Language (from B1 cert) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Languages className="h-4 w-4 text-muted-foreground" />
              Sprachkenntnisse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <InfoRow label="Deutschniveau" value={c.german_level} />
              <InfoRow label="Prüfungsdatum" value={formatDate(c.b1_certificate_date)} />
              <InfoRow label="Institution" value={str(b1Data?.institution)} />
              <InfoRow
                label="Bestanden"
                value={
                  b1Data?.passed === true
                    ? "Ja"
                    : b1Data?.passed === false
                      ? "Nein"
                      : null
                }
              />
              <InfoRow label="Punktzahl" value={str(b1Data?.score)} />
            </dl>
          </CardContent>
        </Card>

        {/* Education (from diploma) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              Bildung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <InfoRow label="Abschluss" value={c.education_level} />
              <InfoRow label="Schule" value={str(diplomaData?.school_name)} />
              <InfoRow label="Datum" value={formatDate(str(diplomaData?.graduation_date))} />
              <InfoRow label="Note" value={str(diplomaData?.gpa_or_grade)} />
              <InfoRow label="Land" value={str(diplomaData?.country)} />
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Work experience from CV */}
      {cvData &&
        Array.isArray(cvData.work_experience) &&
        cvData.work_experience.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                Berufserfahrung
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(cvData.work_experience as Array<Record<string, unknown>>).map(
                  (exp, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5 text-sm"
                    >
                      <p className="font-medium">{str(exp.role) || "Position"}</p>
                      <p className="text-muted-foreground">
                        {str(exp.company)}
                        {exp.start_date || exp.end_date
                          ? ` · ${str(exp.start_date) || "?"} – ${str(exp.end_date) || "aktuell"}`
                          : ""}
                      </p>
                      {str(exp.description) && (
                        <p className="mt-1 text-foreground/80">
                          {str(exp.description)}
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Documents */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4 text-muted-foreground" />
            Dokumente ({docsWithUrls.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border/60">
            {docsWithUrls.map((doc) => {
              const meta = DOC_TYPE_META[doc.document_type] ?? DOC_TYPE_META.other;
              const Icon = meta.icon;
              const statusMeta =
                STATUS_META[doc.extraction_status] ?? STATUS_META.pending;
              const StatusIcon = statusMeta.icon;

              return (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="min-w-0 flex-1">
                    {doc.downloadUrl ? (
                      <a
                        href={doc.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-sm font-medium text-foreground underline-offset-2 hover:underline"
                      >
                        {doc.original_file_name || doc.file_name}
                      </a>
                    ) : (
                      <p className="truncate text-sm font-medium">
                        {doc.original_file_name || doc.file_name}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{meta.label}</span>
                      <span className="text-border">·</span>
                      <span className={`flex items-center gap-1 ${statusMeta.className}`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusMeta.label}
                      </span>
                      {doc.file_size_bytes && (
                        <>
                          <span className="text-border">·</span>
                          <span>{formatBytes(doc.file_size_bytes)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {doc.downloadUrl && (
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={doc.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-1.5"
                      >
                        Öffnen
                      </a>
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          {docsWithUrls.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Keine Dokumente vorhanden
            </p>
          )}
        </CardContent>
      </Card>
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
  if (!value || value === "–") {
    return (
      <div className="flex justify-between gap-4">
        <dt className="text-muted-foreground">{label}</dt>
        <dd className="text-right text-muted-foreground/50">–</dd>
      </div>
    );
  }
  return (
    <div className="flex justify-between gap-4">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}

function str(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v);
  if (s === "null" || s === "undefined" || s === "") return null;
  return s;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: "text" | "date" | "number";
}) {
  return (
    <label className="space-y-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      />
    </label>
  );
}
