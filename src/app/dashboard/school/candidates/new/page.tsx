"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { candidateSchema, type CandidateFormData } from "@/lib/validators/candidate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";

export default function NewCandidatePage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      nationality: "VN",
      work_experience_years: 0,
      urgency: "flexible",
      specialization: "hospitality",
      german_level: "A1",
    },
  });

  async function onSubmit(data: CandidateFormData) {
    // TODO: Submit to Supabase
    console.log("Candidate data:", data);
    router.push("/dashboard/school/candidates");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/school/candidates">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Neuer Kandidat</h2>
          <p className="text-muted-foreground">
            Erstellen Sie ein neues Kandidatenprofil
          </p>
        </div>
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
                <Input
                  id="nationality"
                  {...register("nationality")}
                />
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
                <Input
                  id="passport_number"
                  {...register("passport_number")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passport_expiry">Reisepass gültig bis</Label>
                <Input
                  id="passport_expiry"
                  type="date"
                  {...register("passport_expiry")}
                />
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
            <CardDescription>
              Laden Sie die erforderlichen Dokumente hoch
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
            {isSubmitting ? "Wird gespeichert..." : "Kandidat erstellen"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/school/candidates">Abbrechen</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
