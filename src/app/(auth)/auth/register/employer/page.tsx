"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ArrowRight,
  ArrowLeft,
  Building2,
  MapPin,
  UserCircle,
  Lock,
  Check,
} from "lucide-react";
import { toast } from "sonner";

import {
  registerEmployerSchema,
  type RegisterEmployerFormData,
} from "@/lib/validators/auth";
import { signUp } from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "company", icon: Building2, label: "Unternehmen" },
  { id: "location", icon: MapPin, label: "Standort" },
  { id: "contact", icon: UserCircle, label: "Kontakt" },
  { id: "account", icon: Lock, label: "Konto" },
] as const;

const STEP_FIELDS: Record<string, (keyof RegisterEmployerFormData)[]> = {
  company: ["companyName", "industry"],
  location: ["address", "city", "plz"],
  contact: ["contactPerson", "phone"],
  account: ["email", "password", "confirmPassword"],
};

export default function RegisterEmployerPage() {
  const t = useTranslations("auth");
  const tEmployer = useTranslations("employer");
  const tIndustry = useTranslations("industry");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    watch,
    formState: { errors },
  } = useForm<RegisterEmployerFormData>({
    resolver: zodResolver(registerEmployerSchema),
    mode: "onTouched",
  });

  const selectedIndustry = watch("industry");

  async function goNext() {
    const fieldsToValidate = STEP_FIELDS[STEPS[step].id];
    const valid = await trigger(fieldsToValidate);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  const onSubmit = async (data: RegisterEmployerFormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.set("email", data.email);
      formData.set("password", data.password);

      const result = await signUp(formData, "employer", {
        companyName: data.companyName,
        industry: data.industry,
        industryOther: data.industryOther,
        address: data.address,
        city: data.city,
        plz: data.plz,
        contactPerson: data.contactPerson,
        phone: data.phone,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(
          "Registrierung erfolgreich! Bitte überprüfen Sie Ihre E-Mail."
        );
        router.push("/auth/login");
      }
    } catch {
      toast.error("Ein unerwarteter Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercent = ((step + 1) / STEPS.length) * 100;
  const stepSublines = [
    "Nur noch wenige Angaben – dann sehen Sie passende Kandidaten.",
    "Standort hilft uns, passende Matches vorzuschlagen.",
    "Ansprechpartner für Rückfragen und Vermittlung.",
    "Letzter Schritt – danach können Sie sofort starten.",
  ];

  return (
    <div className="auth-card-enter w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="text-center">
        <h2 className="font-[var(--font-display)] text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {step === 0 ? "Kandidaten entdecken – kostenlos registrieren" : t("registerAsEmployer")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Schritt {step + 1} von {STEPS.length} — {STEPS[step].label}
          {step === 0 && " · Ca. 2 Minuten"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {stepSublines[step]}
        </p>
      </div>

      {/* Trust & Social Proof direkt vor dem Formular (CRO: Trust Signals near CTA) */}
      {step === 0 && (
        <div className="mt-4 rounded-xl border border-border/80 bg-muted/40 px-4 py-3 text-center">
          <p className="text-xs font-medium text-foreground">
            Über 85 Unternehmen nutzen bereits GeVin
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            IHK-konform · DSGVO-sicher · von der Anerkennung bis zur Platzierung
          </p>
        </div>
      )}

      {/* Fortschrittsbalken: Goal-Gradient – „fast geschafft“ sichtbar */}
      <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-[oklch(0.50_0.11_195)] transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Stepper */}
      <div className="mt-5 pb-6">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-1 items-center last:flex-none">
              <button
                type="button"
                onClick={() => {
                  if (i <= step) setStep(i);
                }}
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                  i < step &&
                    "border-[oklch(0.50_0.11_195)] bg-[oklch(0.50_0.11_195)] text-white cursor-pointer",
                  i === step &&
                    "border-[oklch(0.50_0.11_195)] bg-[oklch(0.50_0.11_195/0.12)] text-[oklch(0.50_0.11_195)]",
                  i > step && "border-border bg-muted/50 text-muted-foreground cursor-default"
                )}
              >
                {i < step ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <s.icon className="h-4 w-4" />
                )}
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-1 h-0.5 flex-1 rounded-full transition-colors",
                    i < step ? "bg-[oklch(0.50_0.11_195)]" : "bg-border"
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between">
          {STEPS.map((s) => (
            <span
              key={s.id}
              className="w-9 text-center text-[10px] text-muted-foreground"
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Unternehmen */}
        <div className={cn("space-y-5", step !== 0 && "hidden")}>
          <div className={cn(step === 0 && "auth-step-enter")}>
            <p className="text-sm text-muted-foreground">
              Erzählen Sie uns von Ihrem Unternehmen.
            </p>

          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-foreground">
              {tEmployer("companyName")}
            </Label>
            <Input
              id="companyName"
              className="h-11"
              placeholder="z.B. Hotel Adlon Kempinski"
              {...register("companyName")}
              aria-invalid={!!errors.companyName}
              autoFocus
            />
            {errors.companyName && (
              <p className="text-xs text-destructive">
                {errors.companyName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">{tEmployer("industry")}</Label>
            <Controller
              control={control}
              name="industry"
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={(val) => field.onChange(val)}
                >
                  <SelectTrigger
                    className="h-11 w-full"
                    aria-invalid={!!errors.industry}
                  >
                    <SelectValue placeholder="Branche wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hospitality">
                      {tIndustry("hospitality")}
                    </SelectItem>
                    <SelectItem value="hairdressing">
                      {tIndustry("hairdressing")}
                    </SelectItem>
                    <SelectItem value="nursing">
                      {tIndustry("nursing")}
                    </SelectItem>
                    <SelectItem value="other">{tIndustry("other")}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.industry && (
              <p className="text-xs text-destructive">
                {errors.industry.message}
              </p>
            )}
          </div>

          {selectedIndustry === "other" && (
            <div className="space-y-2">
              <Label htmlFor="industryOther" className="text-foreground">
                Branche angeben
              </Label>
              <Input
                id="industryOther"
                className="h-11"
                placeholder="z.B. Bäckerei, Elektrotechnik, Logistik …"
                {...register("industryOther")}
              />
            </div>
          )}
          </div>
        </div>

        {/* Step 2: Standort */}
        <div className={cn("space-y-5", step !== 1 && "hidden")}>
          <div className={cn(step === 1 && "auth-step-enter")}>
          <p className="text-sm text-muted-foreground">
            Wo befindet sich Ihr Unternehmen?
          </p>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-foreground">
              {tEmployer("address")}
            </Label>
            <Input
              id="address"
              className="h-11"
              placeholder="Straße und Hausnummer"
              {...register("address")}
              aria-invalid={!!errors.address}
            />
            {errors.address && (
              <p className="text-xs text-destructive">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-[1fr_8rem] gap-3">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-foreground">
                {tEmployer("city")}
              </Label>
              <Input
                id="city"
                className="h-11"
                placeholder="z.B. Berlin"
                {...register("city")}
                aria-invalid={!!errors.city}
              />
              {errors.city && (
                <p className="text-xs text-destructive">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="plz" className="text-foreground">
                {tEmployer("plz")}
              </Label>
              <Input
                id="plz"
                className="h-11"
                placeholder="12345"
                {...register("plz")}
                aria-invalid={!!errors.plz}
              />
              {errors.plz && (
                <p className="text-xs text-destructive">
                  {errors.plz.message}
                </p>
              )}
            </div>
          </div>
          </div>
        </div>

        {/* Step 3: Ansprechpartner */}
        <div className={cn("space-y-5", step !== 2 && "hidden")}>
          <div className={cn(step === 2 && "auth-step-enter")}>
          <p className="text-sm text-muted-foreground">
            Wer ist die Kontaktperson für die Fachkräftevermittlung?
          </p>

          <div className="space-y-2">
            <Label htmlFor="contactPerson" className="text-foreground">
              {tEmployer("contactPerson")}
            </Label>
            <Input
              id="contactPerson"
              className="h-11"
              placeholder="Vor- und Nachname"
              {...register("contactPerson")}
              aria-invalid={!!errors.contactPerson}
            />
            {errors.contactPerson && (
              <p className="text-xs text-destructive">
                {errors.contactPerson.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground">
              {tEmployer("phone")}
            </Label>
            <Input
              id="phone"
              type="tel"
              className="h-11"
              placeholder="+49 30 1234 5678"
              {...register("phone")}
              aria-invalid={!!errors.phone}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">
                {errors.phone.message}
              </p>
            )}
          </div>
          </div>
        </div>

        {/* Step 4: Konto erstellen */}
        <div className={cn("space-y-5", step !== 3 && "hidden")}>
          <div className={cn(step === 3 && "auth-step-enter")}>
          <p className="text-sm text-muted-foreground">
            Fast geschafft! Erstellen Sie Ihr Zugangskonto – danach sehen Sie sofort passende Kandidaten.
          </p>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              {t("email")}
            </Label>
            <Input
              id="email"
              type="email"
              className="h-11"
              placeholder="name@firma.de"
              {...register("email")}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              {t("password")}
            </Label>
            <Input
              id="password"
              type="password"
              className="h-11"
              placeholder="Mindestens 8 Zeichen"
              {...register("password")}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground">
              {t("confirmPassword")}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              className="h-11"
              placeholder="Passwort wiederholen"
              {...register("confirmPassword")}
              aria-invalid={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          </div>
        </div>

        {/* Eine Hauptaktion, Zurück nur sekundär */}
        <div className="mt-8 flex items-center gap-3">
          {step > 0 ? (
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              className="gap-1.5 border-border text-foreground hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
              Zurück
            </Button>
          ) : (
            <span />
          )}

          <div className="flex-1" />

          {step < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={goNext}
              className="h-12 gap-1.5 px-6 font-semibold bg-[oklch(0.50_0.11_195)] text-white hover:bg-[oklch(0.44_0.11_195)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Weiter zum nächsten Schritt
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <div className="flex flex-col items-end gap-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 gap-1.5 px-6 font-semibold bg-[oklch(0.50_0.11_195)] text-white hover:bg-[oklch(0.44_0.11_195)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Konto erstellen & Kandidaten entdecken"
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                Ihre Daten werden DSGVO-konform und vertraulich verarbeitet.
              </p>
            </div>
          )}
        </div>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Kostenlos und unverbindlich. Jederzeit kündbar.
      </p>

      <div className="mt-6 border-t border-border pt-6 text-center text-sm">
        <p className="text-muted-foreground">
          {t("hasAccount")}{" "}
          <Link
            href="/auth/login"
            className="font-medium text-[oklch(0.50_0.11_195)] transition-colors hover:text-[oklch(0.44_0.11_195)]"
          >
            {t("loginTitle")}
          </Link>
        </p>
      </div>
    </div>
  );
}
