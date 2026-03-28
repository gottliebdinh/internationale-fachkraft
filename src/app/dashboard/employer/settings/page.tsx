"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  employerProfileSchema,
  type EmployerProfileFormData,
} from "@/lib/validators/employer";
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

export default function EmployerSettingsPage() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EmployerProfileFormData>({
    resolver: zodResolver(employerProfileSchema),
    defaultValues: {
      company_name: "Muster Hotel GmbH",
      industry: "hospitality",
      address: "Musterstraße 42",
      city: "München",
      plz: "80331",
      contact_person: "Max Mustermann",
      phone: "+49 89 1234567",
      trade_license_number: "HRB 12345",
      accommodation_type: "company_housing",
      accommodation_details: {
        address: "Wohnheim Str. 10, 80333 München",
        sqm: 25,
        monthly_cost: 350,
      },
    },
  });

  const accommodationType = watch("accommodation_type");
  const industry = watch("industry");

  async function onSubmit(data: EmployerProfileFormData) {
    console.log("Employer profile update:", data);
    toast.success("Profil gespeichert", {
      description: "Ihre Unternehmensdaten wurden aktualisiert.",
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Einstellungen</h2>
        <p className="text-muted-foreground">
          Verwalten Sie Ihr Unternehmensprofil und Ihre Einstellungen.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Unternehmensdaten</CardTitle>
            <CardDescription>
              Grundlegende Informationen zu Ihrem Unternehmen
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="company_name">Firmenname *</Label>
              <Input
                id="company_name"
                {...register("company_name")}
                aria-invalid={!!errors.company_name}
              />
              {errors.company_name && (
                <p className="text-sm text-destructive">
                  {errors.company_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Branche *</Label>
              <Controller
                name="industry"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Branche wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hospitality">Gastronomie</SelectItem>
                      <SelectItem value="hairdressing">
                        Friseurhandwerk
                      </SelectItem>
                      <SelectItem value="nursing">Pflege</SelectItem>
                      <SelectItem value="other">Andere</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.industry && (
                <p className="text-sm text-destructive">
                  {errors.industry.message}
                </p>
              )}
            </div>

            {industry === "other" && (
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="industry_other">Branche angeben</Label>
                <Input
                  id="industry_other"
                  placeholder="z.B. Bäckerei, Elektrotechnik, Logistik …"
                  {...register("industry_other")}
                />
              </div>
            )}

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Adresse *</Label>
              <Input
                id="address"
                {...register("address")}
                aria-invalid={!!errors.address}
              />
              {errors.address && (
                <p className="text-sm text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Stadt *</Label>
              <Input
                id="city"
                {...register("city")}
                aria-invalid={!!errors.city}
              />
              {errors.city && (
                <p className="text-sm text-destructive">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="plz">PLZ *</Label>
              <Input
                id="plz"
                {...register("plz")}
                aria-invalid={!!errors.plz}
              />
              {errors.plz && (
                <p className="text-sm text-destructive">
                  {errors.plz.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kontakt & Lizenzen</CardTitle>
            <CardDescription>
              Ansprechpartner und gewerbliche Informationen
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact_person">Ansprechpartner *</Label>
              <Input
                id="contact_person"
                {...register("contact_person")}
                aria-invalid={!!errors.contact_person}
              />
              {errors.contact_person && (
                <p className="text-sm text-destructive">
                  {errors.contact_person.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefon *</Label>
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                aria-invalid={!!errors.phone}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="trade_license_number">Gewerbescheinnummer</Label>
              <Input
                id="trade_license_number"
                {...register("trade_license_number")}
              />
            </div>

          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unterkunft</CardTitle>
            <CardDescription>
              Angaben zur Unterkunft für internationale Fachkräfte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Unterkunftsart *</Label>
              <Controller
                name="accommodation_type"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full sm:w-[300px]">
                      <SelectValue placeholder="Unterkunftsart wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="company_housing">
                        Firmenwohnung
                      </SelectItem>
                      <SelectItem value="rental_support">
                        Mietunterstützung
                      </SelectItem>
                      <SelectItem value="none">Keine Unterkunft</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {accommodationType !== "none" && (
              <>
                <Separator />
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="accom_address">
                      Adresse der Unterkunft
                    </Label>
                    <Input
                      id="accom_address"
                      {...register("accommodation_details.address")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accom_sqm">Fläche (m²)</Label>
                    <Input
                      id="accom_sqm"
                      type="number"
                      min={0}
                      {...register("accommodation_details.sqm", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accom_cost">
                      Monatliche Kosten (€)
                    </Label>
                    <Input
                      id="accom_cost"
                      type="number"
                      min={0}
                      {...register("accommodation_details.monthly_cost", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>

                  {accommodationType === "rental_support" && (
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="accom_rental_ref">
                        Mietvertrags-Referenz
                      </Label>
                      <Input
                        id="accom_rental_ref"
                        {...register("accommodation_details.rental_ref")}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Wird gespeichert…" : "Profil speichern"}
          </Button>
        </div>
      </form>
    </div>
  );
}

