"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  Building2,
  Lock,
  Briefcase,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import {
  registerEmployerSchema,
  type RegisterEmployerFormData,
} from "@/lib/validators/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "industry", icon: Briefcase, label: "Branche" },
  { id: "company", icon: Building2, label: "Firmenname" },
  { id: "account", icon: Lock, label: "Benutzer erstellen" },
  { id: "verification", icon: ShieldCheck, label: "Verifizierung" },
] as const;

const STEP_FIELDS: Record<string, (keyof RegisterEmployerFormData)[]> = {
  industry: ["industry", "industryOther"],
  company: ["companyName"],
  account: ["email", "password", "confirmPassword"],
  verification: ["verificationCode"],
};

const INDUSTRY_OPTIONS = [
  { value: "hospitality" as const, labelKey: "hospitality" },
  { value: "hairdressing" as const, labelKey: "hairdressing" },
  { value: "nursing" as const, labelKey: "nursing" },
];

const STEP_QUESTIONS: Record<number, string> = {
  0: "Aus welcher Branche kommen Sie?",
  1: "Wie heißt Ihr Unternehmen?",
  2: "Benutzerkonto erstellen",
  3: "E-Mail-Verifizierung",
};

export default function RegisterEmployerPage() {
  const t = useTranslations("auth");
  const tEmployer = useTranslations("employer");
  const tIndustry = useTranslations("industry");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [pendingAdvance, setPendingAdvance] = useState(false);

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
    defaultValues: { lookingFor: "", verificationCode: "" },
  });

  const selectedIndustry = watch("industry");
  const previousIndustryRef = useRef<string | undefined>(undefined);

  // Schritt 0 (Branche): Bei aktiver Auswahl (nicht „other“) nach kurzer Pause auto-weiter
  useEffect(() => {
    if (step !== 0 || !selectedIndustry || selectedIndustry === "other") {
      setPendingAdvance(false);
      previousIndustryRef.current = selectedIndustry;
      return;
    }
    const prev = previousIndustryRef.current;
    previousIndustryRef.current = selectedIndustry;
    if (prev === selectedIndustry) return;

    setPendingAdvance(true);
    let cancelled = false;
    let t: ReturnType<typeof setTimeout> | undefined;
    trigger("industry").then((ok) => {
      if (cancelled || !ok) {
        setPendingAdvance(false);
        return;
      }
      t = setTimeout(() => {
        setStep(1);
        setPendingAdvance(false);
      }, 800);
    });
    return () => {
      cancelled = true;
      if (t != null) clearTimeout(t);
    };
  }, [selectedIndustry, step, trigger]);

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
      // Nur Frontend: Daten z.B. lokal speichern oder nur anzeigen
      const payload = {
        companyName: data.companyName,
        industry: data.industry,
        industryOther: data.industryOther,
        lookingFor: data.lookingFor,
        email: data.email,
        verificationCode: data.verificationCode,
      };
      if (typeof window !== "undefined") {
        window.localStorage.setItem("register_employer_draft", JSON.stringify(payload));
      }
      toast.success("Registrierung abgeschlossen.");
      router.replace("/dashboard/employer");
    } finally {
      setIsLoading(false);
    }
  };

  // Strahl reagiert sofort bei Auswahl; nur der Wechsel zur nächsten Seite ist verzögert
  const progressPercent = pendingAdvance
    ? ((step + 2) / STEPS.length) * 100
    : ((step + 1) / STEPS.length) * 100;

  return (
    <div className="auth-card-enter w-full flex flex-col items-stretch min-h-screen">
      {/* Strahl ganz oben, komplette Breite, rund (unten abgerundet) */}
      <div className="w-full rounded-b-2xl overflow-hidden shrink-0">
        <div className="h-2 w-full overflow-hidden bg-muted/80">
          <div
            className="h-full rounded-full bg-[oklch(0.50_0.11_195)] transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Fragen-Bereich: vertikal zentriert, links bei 1/4 der Seite */}
      <div className="flex-1 min-h-0 w-full flex flex-col justify-center py-8">
        <div className="w-full max-w-5xl pl-[28vw] pr-12">
      <Link
        href="/"
        className="mb-6 block text-left focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.11_195)] focus:ring-offset-2 rounded-md"
      >
        <h1 className="font-[var(--font-display)] text-3xl font-semibold tracking-tight text-foreground">
          Ge<span className="text-[oklch(0.50_0.11_195)]">Vin</span>
        </h1>
      </Link>

      {/* Zahl in Grün/Teal vor der Frage, Frage nicht fett – mit Schritt-Animation */}
      <div
        key={step}
        className="mb-6 flex items-start gap-3 text-left animate-in slide-in-from-top-4 fade-in-0 duration-300"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[oklch(0.50_0.11_195)] text-sm font-semibold text-white">
          {step + 1}
        </span>
        <h2 className="font-[var(--font-display)] text-xl font-normal tracking-tight text-foreground sm:text-2xl">
          {STEP_QUESTIONS[step]}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="relative">
        {/* Step 1: Branche */}
        <div
          className={cn(
            "space-y-6 transition-opacity duration-200",
            step !== 0 && "pointer-events-none absolute inset-0 opacity-0"
          )}
          aria-hidden={step !== 0}
        >
          <div className={cn(step === 0 && "animate-in slide-in-from-top-4 fade-in-0 duration-300")}>
            <div className="space-y-2">
              <Controller
                control={control}
                name="industry"
                render={({ field }) => (
                  <div
                    className="flex flex-col gap-2"
                    role="radiogroup"
                    aria-label={tEmployer("industry")}
                    aria-invalid={!!errors.industry}
                  >
                    {INDUSTRY_OPTIONS.map((opt, i) => {
                      const letter = String.fromCharCode(65 + i);
                      const selected = field.value === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => field.onChange(opt.value)}
                          className={cn(
                            "flex w-full items-center gap-4 rounded-lg border px-5 py-2.5 text-left text-foreground transition-colors",
                            selected
                              ? "border-2 border-[oklch(0.50_0.11_195)] bg-white"
                              : "border-border bg-muted/40 hover:border-muted-foreground/40"
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded border text-sm font-semibold",
                              selected
                                ? "border-[oklch(0.50_0.11_195)] bg-[oklch(0.55_0.10_195)] text-white"
                                : "border-muted-foreground/30 bg-muted/10 text-foreground"
                            )}
                          >
                            {letter}
                          </span>
                          <span className="text-base font-medium">
                            {tIndustry(opt.labelKey)}
                          </span>
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => field.onChange("other")}
                      className={cn(
                        "mt-3 flex w-full items-center gap-4 rounded-lg border px-5 py-2.5 text-left text-foreground transition-colors",
                        field.value === "other"
                          ? "border-2 border-[oklch(0.50_0.11_195)] bg-white"
                          : "border-border bg-muted/40 hover:border-muted-foreground/40"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded border text-sm font-semibold",
                          field.value === "other"
                            ? "border-[oklch(0.50_0.11_195)] bg-[oklch(0.55_0.10_195)] text-white"
                            : "border-muted-foreground/30 bg-muted/10 text-foreground"
                        )}
                      >
                        D
                      </span>
                      <span className="text-base font-medium">
                        {tIndustry("other")}
                      </span>
                    </button>
                  </div>
                )}
              />
              {errors.industry && (
                <p className="text-xs text-destructive">
                  {errors.industry.message}
                </p>
              )}
            </div>

            {selectedIndustry === "other" && (
              <div className="mt-2 rounded-lg border border-border bg-muted/30 px-4 py-4">
                <p className="mb-3 text-sm font-medium text-foreground">
                  Geben Sie ein
                </p>
                <Input
                  id="industryOther"
                  className="h-12 text-base"
                  placeholder="z.B. Bäckerei, Elektrotechnik, Logistik …"
                  {...register("industryOther")}
                  aria-invalid={!!errors.industryOther}
                />
                {errors.industryOther && (
                  <p className="mt-2 text-xs text-destructive">
                    {errors.industryOther.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Step 1: Firmenname */}
        <div
          className={cn(
            "space-y-6 transition-opacity duration-200",
            step !== 1 && "pointer-events-none absolute inset-0 opacity-0"
          )}
          aria-hidden={step !== 1}
        >
          <div className={cn(step === 1 && "animate-in slide-in-from-top-4 fade-in-0 duration-300")}>
          <div className="space-y-3">
            <Label htmlFor="companyName" className="text-base text-foreground">
              {tEmployer("companyName")}
            </Label>
            <Input
              id="companyName"
              className="h-12 text-base"
              placeholder="z.B. Hotel Adlon Kempinski"
              {...register("companyName")}
              aria-invalid={!!errors.companyName}
              autoFocus={step === 1}
            />
            {errors.companyName && (
              <p className="text-xs text-destructive">
                {errors.companyName.message}
              </p>
            )}
          </div>
          </div>
        </div>

        {/* Step 2: Benutzer erstellen */}
        <div
          className={cn(
            "space-y-6 transition-opacity duration-200",
            step !== 2 && "pointer-events-none absolute inset-0 opacity-0"
          )}
          aria-hidden={step !== 2}
        >
          <div className={cn(step === 2 && "animate-in slide-in-from-top-4 fade-in-0 duration-300")}>
          <div className="space-y-3">
            <Label htmlFor="email" className="text-base text-foreground">
              {t("email")}
            </Label>
            <Input
              id="email"
              type="email"
              className="h-12 text-base"
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

          <div className="space-y-3">
            <Label htmlFor="password" className="text-base text-foreground">
              {t("password")}
            </Label>
            <Input
              id="password"
              type="password"
              className="h-12 text-base"
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

          <div className="space-y-3">
            <Label htmlFor="confirmPassword" className="text-base text-foreground">
              {t("confirmPassword")}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              className="h-12 text-base"
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

        {/* Step 3: 6-stellige Verifizierung (wie an E-Mail gesendet) */}
        <div
          className={cn(
            "space-y-6 transition-opacity duration-200",
            step !== 3 && "pointer-events-none absolute inset-0 opacity-0"
          )}
          aria-hidden={step !== 3}
        >
          <div className={cn(step === 3 && "animate-in slide-in-from-top-4 fade-in-0 duration-300")}>
          <p className="mb-4 text-sm text-muted-foreground">
            Wir haben einen 6-stelligen Code an Ihre E-Mail-Adresse gesendet. Bitte geben Sie ihn hier ein.
          </p>
          <div className="space-y-3">
            <Label htmlFor="verificationCode" className="text-base text-foreground">
              Verifizierungscode
            </Label>
            <Controller
              control={control}
              name="verificationCode"
              render={({ field }) => (
                <Input
                  id="verificationCode"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className="h-12 text-base font-mono tracking-[0.4em] text-center"
                  placeholder="000000"
                  maxLength={6}
                  value={field.value}
                  onChange={(e) => {
                    const digits = (e.target.value || "").replace(/\D/g, "").slice(0, 6);
                    field.onChange(digits);
                  }}
                  aria-invalid={!!errors.verificationCode}
                  autoFocus={step === 3}
                />
              )}
            />
            {errors.verificationCode && (
              <p className="text-xs text-destructive">
                {errors.verificationCode.message}
              </p>
            )}
          </div>
          </div>
        </div>

        {/* Ok unten links, Zurück rechts wenn step > 0 */}
        <div className="mt-8 flex items-center gap-3">
          {step < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={goNext}
              className="h-10 gap-1.5 px-4 text-lg font-semibold bg-[oklch(0.50_0.11_195)] text-white hover:bg-[oklch(0.44_0.11_195)]"
            >
              Ok
            </Button>
          ) : (
            <div className="flex flex-col items-start gap-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="h-10 gap-1.5 px-4 text-lg font-semibold bg-[oklch(0.50_0.11_195)] text-white hover:bg-[oklch(0.44_0.11_195)]"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Registrierung abschließen"
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                Ihre Daten werden DSGVO-konform und vertraulich verarbeitet.
              </p>
            </div>
          )}

          <div className="flex-1" />

          {step > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={goBack}
              className="h-10 gap-1.5 px-4 border-border text-foreground hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
              Zurück
            </Button>
          )}
        </div>
      </form>

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
      </div>
    </div>
  );
}
