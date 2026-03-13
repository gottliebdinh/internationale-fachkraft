"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { jobPositionSchema, type JobPositionFormData } from "@/lib/validators/employer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

export default function NewPositionPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<JobPositionFormData>({
    resolver: zodResolver(jobPositionSchema),
    defaultValues: {
      title: "",
      position_type: "apprenticeship",
      specialization: "hospitality",
      description: "",
      start_date: "",
      urgency: "flexible",
      slots_total: 1,
      salary_range: { min: 0, max: 0 },
      accommodation_provided: false,
      training_plan_url: "",
    },
  });

  async function onSubmit(data: JobPositionFormData) {
    console.log("New position data:", data);
    toast.success("Stelle erfolgreich erstellt", {
      description: `„${data.title}" wurde gespeichert.`,
    });
    router.push("/dashboard/employer/positions");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/employer/positions">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Neue Stelle erstellen</h2>
          <p className="text-muted-foreground">
            Erstellen Sie ein neues Stellenangebot für internationale Fachkräfte.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Grunddaten</CardTitle>
            <CardDescription>Allgemeine Informationen zur Stelle</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title">Stellentitel *</Label>
              <Input
                id="title"
                placeholder="z.B. Koch/Köchin Ausbildung"
                {...register("title")}
                aria-invalid={!!errors.title}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Stellenart *</Label>
              <Controller
                name="position_type"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Stellenart wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apprenticeship">Ausbildung</SelectItem>
                      <SelectItem value="skilled_worker">Fachkraft</SelectItem>
                      <SelectItem value="seasonal">Saisonarbeit</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.position_type && (
                <p className="text-sm text-destructive">{errors.position_type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Fachrichtung *</Label>
              <Controller
                name="specialization"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Fachrichtung wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hospitality">Gastronomie</SelectItem>
                      <SelectItem value="hairdressing">Friseurhandwerk</SelectItem>
                      <SelectItem value="nursing">Pflege</SelectItem>
                      <SelectItem value="other">Andere</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.specialization && (
                <p className="text-sm text-destructive">{errors.specialization.message}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Beschreibung *</Label>
              <Textarea
                id="description"
                placeholder="Beschreiben Sie die Stelle, Anforderungen und Vorteile..."
                rows={4}
                {...register("description")}
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
            <CardDescription>Zeitrahmen, Plätze und Vergütung</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start_date">Startdatum *</Label>
              <Input
                id="start_date"
                type="date"
                {...register("start_date")}
                aria-invalid={!!errors.start_date}
              />
              {errors.start_date && (
                <p className="text-sm text-destructive">{errors.start_date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Dringlichkeit *</Label>
              <Controller
                name="urgency"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Dringlichkeit wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Sofort</SelectItem>
                      <SelectItem value="3_months">In 3 Monaten</SelectItem>
                      <SelectItem value="6_months">In 6 Monaten</SelectItem>
                      <SelectItem value="flexible">Flexibel</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.urgency && (
                <p className="text-sm text-destructive">{errors.urgency.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slots_total">Anzahl Plätze *</Label>
              <Input
                id="slots_total"
                type="number"
                min={1}
                {...register("slots_total", { valueAsNumber: true })}
                aria-invalid={!!errors.slots_total}
              />
              {errors.slots_total && (
                <p className="text-sm text-destructive">{errors.slots_total.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="training_plan_url">Ausbildungsplan URL</Label>
              <Input
                id="training_plan_url"
                type="url"
                placeholder="https://..."
                {...register("training_plan_url")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary_min">Gehalt Min (€/Monat)</Label>
              <Input
                id="salary_min"
                type="number"
                min={0}
                {...register("salary_range.min", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary_max">Gehalt Max (€/Monat)</Label>
              <Input
                id="salary_max"
                type="number"
                min={0}
                {...register("salary_range.max", { valueAsNumber: true })}
              />
            </div>

            <div className="flex items-center gap-3 sm:col-span-2">
              <input
                id="accommodation_provided"
                type="checkbox"
                className="size-4 rounded border-input accent-primary"
                {...register("accommodation_provided")}
              />
              <Label htmlFor="accommodation_provided">
                Unterkunft wird bereitgestellt
              </Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/employer/positions">
              Abbrechen
            </Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Wird gespeichert…" : "Stelle erstellen"}
          </Button>
        </div>
      </form>
    </div>
  );
}
