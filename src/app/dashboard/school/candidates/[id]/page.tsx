"use client";

import { useState, use as reactUse } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { candidateSchema, type CandidateFormData } from "@/lib/validators/candidate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Upload, X, FileText } from "lucide-react";
import Link from "next/link";
import type { CandidateStatus, CandidateDocument, DocumentType } from "@/types/database";

const statusConfig: Record<CandidateStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  draft: { label: "Entwurf", variant: "outline" },
  active: { label: "Aktiv", variant: "default" },
  matched: { label: "Zugeordnet", variant: "secondary" },
  in_process: { label: "In Bearbeitung", variant: "secondary" },
  placed: { label: "Vermittelt", variant: "default" },
  withdrawn: { label: "Zurückgezogen", variant: "destructive" },
};

const docTypeLabels: Record<DocumentType, string> = {
  passport: "Reisepass",
  b1_certificate: "B1-Zertifikat",
  cv: "Lebenslauf",
  diploma: "Diplom / Zeugnis",
  health_certificate: "Gesundheitszeugnis",
  video: "Video-Vorstellung",
  cover_letter: "Anschreiben",
  school_records: "Schulzeugnis",
  photo: "Foto",
  application_bundle: "Bewerbungsunterlagen",
  other: "Sonstiges",
};

const DOC_DEFAULTS = {
  extracted_data: null,
  extraction_status: "pending" as const,
  extraction_model: null,
  extraction_error: null,
  original_file_name: null,
  file_size_bytes: null,
  mime_type: null,
  storage_path: null,
};

const existingDocuments: CandidateDocument[] = [
  {
    id: "d1",
    candidate_id: "c1",
    document_type: "passport",
    file_url: "/files/passport.pdf",
    file_name: "reisepass_nguyen.pdf",
    verified_by_admin: true,
    uploaded_at: "2026-01-20T10:00:00Z",
    ...DOC_DEFAULTS,
  },
  {
    id: "d2",
    candidate_id: "c1",
    document_type: "b1_certificate",
    file_url: "/files/b1.pdf",
    file_name: "b1_zertifikat_nguyen.pdf",
    verified_by_admin: false,
    uploaded_at: "2026-02-01T14:00:00Z",
    ...DOC_DEFAULTS,
  },
  {
    id: "d3",
    candidate_id: "c1",
    document_type: "cv",
    file_url: "/files/cv.pdf",
    file_name: "lebenslauf_nguyen.pdf",
    verified_by_admin: false,
    uploaded_at: "2026-02-10T09:00:00Z",
    ...DOC_DEFAULTS,
  },
];

export default function EditCandidatePage() {
  const params = reactUse(
    Promise.resolve(useParams())
  ) as { id?: string | string[] | undefined };
  const router = useRouter();
  const candidateId = params.id as string;
  const [currentStatus, setCurrentStatus] = useState<CandidateStatus>("active");
  const [documents, setDocuments] = useState(existingDocuments);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      first_name: "Nguyen",
      last_name: "Van A",
      date_of_birth: "1998-05-12",
      nationality: "VN",
      passport_number: "B12345678",
      passport_expiry: "2028-05-12",
      gender: "male",
      specialization: "hospitality",
      german_level: "B1",
      b1_certificate_date: "2025-11-20",
      education_level: "Bachelor",
      work_experience_years: 2,
      availability_date: "2026-06-01",
      urgency: "3_months",
    },
  });

  async function onSubmit(data: CandidateFormData) {
    console.log("Update candidate:", candidateId, data);
    router.push("/dashboard/school/candidates");
  }

  function handleDeleteDocument(docId: string) {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  }

  function toggleStatus() {
    setCurrentStatus((prev) => (prev === "active" ? "draft" : "active"));
  }

  const status = statusConfig[currentStatus];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/school/candidates">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight">
                Kandidat bearbeiten
              </h2>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
            <p className="text-muted-foreground">ID: {candidateId}</p>
          </div>
        </div>
        <Button
          variant={currentStatus === "active" ? "destructive" : "default"}
          onClick={toggleStatus}
        >
          {currentStatus === "active" ? "Deaktivieren" : "Aktivieren"}
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Persönliche Informationen</CardTitle>
            <CardDescription>Grundlegende Angaben zum Kandidaten</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first_name">Vorname *</Label>
                <Input
                  id="first_name"
                  {...register("first_name")}
                  aria-invalid={!!errors.first_name}
                />
                {errors.first_name && (
                  <p className="text-sm text-destructive">{errors.first_name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Nachname *</Label>
                <Input
                  id="last_name"
                  {...register("last_name")}
                  aria-invalid={!!errors.last_name}
                />
                {errors.last_name && (
                  <p className="text-sm text-destructive">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Geburtsdatum *</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  {...register("date_of_birth")}
                  aria-invalid={!!errors.date_of_birth}
                />
                {errors.date_of_birth && (
                  <p className="text-sm text-destructive">{errors.date_of_birth.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationalität</Label>
                <Input id="nationality" {...register("nationality")} />
              </div>
              <div className="space-y-2">
                <Label>Geschlecht</Label>
                <Controller
                  control={control}
                  name="gender"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Männlich</SelectItem>
                        <SelectItem value="female">Weiblich</SelectItem>
                        <SelectItem value="diverse">Divers</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="passport_number">Reisepassnummer</Label>
                <Input id="passport_number" {...register("passport_number")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passport_expiry">Reisepass gültig bis</Label>
                <Input id="passport_expiry" type="date" {...register("passport_expiry")} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Qualifikationen</CardTitle>
            <CardDescription>Fachliche Angaben und Sprachkenntnisse</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Fachrichtung *</Label>
                <Controller
                  control={control}
                  name="specialization"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Fachrichtung wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hospitality">Gastgewerbe</SelectItem>
                        <SelectItem value="hairdressing">Friseurhandwerk</SelectItem>
                        <SelectItem value="nursing">Pflege</SelectItem>
                        <SelectItem value="other">Andere</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>Deutschniveau *</Label>
                <Controller
                  control={control}
                  name="german_level"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Niveau wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A1">A1</SelectItem>
                        <SelectItem value="A2">A2</SelectItem>
                        <SelectItem value="B1">B1</SelectItem>
                        <SelectItem value="B2">B2</SelectItem>
                        <SelectItem value="C1">C1</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="b1_certificate_date">B1-Zertifikatsdatum</Label>
                <Input
                  id="b1_certificate_date"
                  type="date"
                  {...register("b1_certificate_date")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="education_level">Bildungsniveau</Label>
                <Input
                  id="education_level"
                  placeholder="z.B. Bachelor, Berufsausbildung"
                  {...register("education_level")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="work_experience_years">Berufserfahrung (Jahre)</Label>
                <Input
                  id="work_experience_years"
                  type="number"
                  min={0}
                  {...register("work_experience_years", { valueAsNumber: true })}
                />
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="availability_date">Verfügbarkeitsdatum *</Label>
                <Input
                  id="availability_date"
                  type="date"
                  {...register("availability_date")}
                  aria-invalid={!!errors.availability_date}
                />
                {errors.availability_date && (
                  <p className="text-sm text-destructive">{errors.availability_date.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Dringlichkeit *</Label>
                <Controller
                  control={control}
                  name="urgency"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Dringlichkeit wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Sofort</SelectItem>
                        <SelectItem value="3_months">Innerhalb 3 Monaten</SelectItem>
                        <SelectItem value="6_months">Innerhalb 6 Monaten</SelectItem>
                        <SelectItem value="flexible">Flexibel</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dokumente</CardTitle>
            <CardDescription>Vorhandene und neue Dokumente verwalten</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {documents.length > 0 && (
              <>
                <div className="space-y-2">
                  <Label>Vorhandene Dokumente</Label>
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{doc.file_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {docTypeLabels[doc.document_type]} &middot;{" "}
                              {doc.verified_by_admin ? "Verifiziert" : "Ausstehend"}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteDocument(doc.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
              </>
            )}

            <div className="space-y-2">
              <Label>Profilfoto</Label>
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/25 bg-muted/50">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <Input type="file" accept="image/*" className="max-w-xs" />
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Reisepass</Label>
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
              </div>
              <div className="space-y-2">
                <Label>B1-Zertifikat</Label>
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
              </div>
              <div className="space-y-2">
                <Label>Lebenslauf (CV)</Label>
                <Input type="file" accept=".pdf,.doc,.docx" />
              </div>
              <div className="space-y-2">
                <Label>Diplom / Zeugnis</Label>
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Video-Vorstellung</Label>
              <Input type="file" accept="video/*" />
              <p className="text-xs text-muted-foreground">
                Kurzes Vorstellungsvideo (max. 2 Minuten, MP4 empfohlen)
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Wird gespeichert..." : "Änderungen speichern"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/school/candidates">Abbrechen</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
