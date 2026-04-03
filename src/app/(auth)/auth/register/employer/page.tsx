"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ChevronLeft,
  Briefcase,
  Search,
  Calendar,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { toast } from "sonner";

import { leadSchema, type LeadFormData } from "@/lib/validators/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { BrandWordmarkLink } from "@/components/shared/brand-wordmark-link";

const STEPS = [
  { id: "industry", icon: Briefcase, label: "Branche" },
  { id: "seeking", icon: Search, label: "Suche" },
  { id: "timing", icon: Calendar, label: "Zeitraum" },
  { id: "name", icon: User, label: "Name" },
  { id: "email", icon: Mail, label: "E-Mail" },
  { id: "phone", icon: Phone, label: "Telefon" },
] as const;

const STEP_FIELDS: Record<string, (keyof LeadFormData)[]> = {
  industry: ["industry"],
  seeking: ["seekingType"],
  timing: [],
  name: ["name"],
  email: ["email"],
  phone: ["phone"],
};

const INDUSTRY_OPTIONS = [
  { value: "hospitality" as const, labelKey: "hospitality" },
  { value: "healthcare" as const, labelKey: "healthcare" },
  { value: "trade" as const, labelKey: "trade" },
  { value: "retail" as const, labelKey: "retail" },
  { value: "other" as const, labelKey: "other" },
];

const SEEKING_OPTIONS = [
  { value: "fachkraft" as const, label: "Fachkraft" },
  { value: "auszubildender" as const, label: "Auszubildende/r" },
  { value: "other" as const, label: "Andere" },
];

const STEP_QUESTIONS: Record<number, string> = {
  0: "Aus welcher Branche kommen Sie?",
  1: "Wonach suchen Sie?",
  2: "Ab wann und wie viele?",
  3: "Wie heißen Sie?",
  4: "Unter welcher E-Mail erreichen wir Sie?",
  5: "Unter welcher Telefonnummer erreichen wir Sie?",
};

export default function RegisterEmployerPage() {
  const tIndustry = useTranslations("industry");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [pendingAdvance, setPendingAdvance] = useState(false);
  const [startDateValue, setStartDateValue] = useState("");
  const [chooseSpecificStartDate, setChooseSpecificStartDate] = useState(false);
  const [slotsValue, setSlotsValue] = useState("1");

  const {
    register,
    control,
    trigger,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    mode: "onTouched",
    defaultValues: {
      slots: 1,
      name: "",
      phone: "",
    },
  });

  const selectedIndustry = watch("industry");
  const selectedSeeking = watch("seekingType");
  const previousIndustryRef = useRef<string | undefined>(undefined);
  const previousSeekingRef = useRef<string | undefined>(undefined);

  // Auto-advance after industry selection (non-other)
  useEffect(() => {
    if (step !== 0 || !selectedIndustry) {
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

  // Auto-advance after seeking selection
  useEffect(() => {
    if (step !== 1 || !selectedSeeking) {
      previousSeekingRef.current = selectedSeeking;
      return;
    }
    const prev = previousSeekingRef.current;
    previousSeekingRef.current = selectedSeeking;
    if (prev === selectedSeeking) return;

    setPendingAdvance(true);
    let cancelled = false;
    let t: ReturnType<typeof setTimeout> | undefined;
    trigger("seekingType").then((ok) => {
      if (cancelled || !ok) {
        setPendingAdvance(false);
        return;
      }
      t = setTimeout(() => {
        setStep(2);
        setPendingAdvance(false);
      }, 800);
    });
    return () => {
      cancelled = true;
      if (t != null) clearTimeout(t);
    };
  }, [selectedSeeking, step, trigger]);

  async function goNext() {
    if (step === 2) {
      // timing step has no zod fields, just local state
      setValue("startDate", startDateValue.trim() || undefined);
      setValue("slots", Math.max(1, parseInt(slotsValue, 10) || 1));
      setStep((s) => s + 1);
      return;
    }
    const fieldsToValidate = STEP_FIELDS[STEPS[step].id];
    const valid = fieldsToValidate.length
      ? await trigger(fieldsToValidate)
      : true;
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleFinish() {
    const fieldsToValidate = STEP_FIELDS[STEPS[step].id];
    const valid = fieldsToValidate.length
      ? await trigger(fieldsToValidate)
      : true;
    if (!valid) return;

    setIsLoading(true);
    try {
      const data = getValues();
      const res = await fetch("/api/register/employer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industry: data.industry,
          industry_other: data.industryOther,
          seeking_type: data.seekingType,
          start_date: startDateValue.trim() || undefined,
          slots: Math.max(1, parseInt(slotsValue, 10) || 1),
          name: data.name,
          email: data.email,
          phone: data.phone,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || "Anfrage fehlgeschlagen.");
        return;
      }

      const emailEnc = encodeURIComponent(String(json.email ?? "").trim());
      router.replace(
        `/auth/register/employer/pending${emailEnc ? `?email=${emailEnc}` : ""}`
      );
    } catch {
      toast.error("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setIsLoading(false);
    }
  }

  const progressPercent = pendingAdvance
    ? ((step + 2) / STEPS.length) * 100
    : ((step + 1) / STEPS.length) * 100;

  return (
    <div className="auth-register-reveal-scope flex h-full min-h-0 w-full flex-col items-stretch overflow-hidden">
      <div className="home-reveal home-reveal-delay-1 w-full shrink-0 overflow-hidden rounded-b-2xl">
        <div className="h-2 w-full overflow-hidden bg-muted/80">
          <div
            className="h-full rounded-full bg-[oklch(0.38_0.12_255)] transition-all duration-200 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="home-reveal home-reveal-delay-1 flex w-full shrink-0 items-center px-4 py-2">
        {step > 0 ? (
          <button
            type="button"
            onClick={goBack}
            className="flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-[oklch(0.38_0.12_255)] focus:ring-offset-2"
            aria-label="Zurück"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        ) : (
          <span className="h-9 w-9" />
        )}
      </div>

      <div className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto">
        <div className="flex w-full min-w-0 flex-1 flex-col justify-center py-8 sm:py-12">
          <div className="w-full max-w-6xl shrink-0 pl-[28vw] pr-8">
          <BrandWordmarkLink
            href="/"
            size="xl"
            className="home-reveal home-reveal-delay-2 mb-6 inline-flex h-12 max-h-14 items-center focus-visible:ring-[oklch(0.38_0.12_255)]"
          />

          <div
            key={step}
            className="home-reveal home-reveal-delay-3 auth-register-step-reveal mb-6 flex min-h-[4.5rem] items-start gap-3 text-left sm:min-h-[3.75rem]"
          >
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[oklch(0.38_0.12_255)] text-sm font-semibold text-white">
              {step + 1}
            </span>
            <h2 className="font-[var(--font-display)] text-xl font-normal leading-snug tracking-tight text-foreground sm:text-2xl">
              {STEP_QUESTIONS[step]}
            </h2>
          </div>

          <div className="relative min-h-[min(22rem,50vh)]">
            {/* Step 0: Branche */}
            <div
              className={cn(
                "space-y-6",
                step !== 0 && "pointer-events-none absolute inset-0 opacity-0"
              )}
              aria-hidden={step !== 0}
            >
              <div
                key={`0-${step === 0 ? "active" : "idle"}`}
                className={cn(
                  step === 0 &&
                    "home-reveal home-reveal-delay-4 auth-register-step-reveal"
                )}
              >
                <div className="space-y-2">
                  <Controller
                    control={control}
                    name="industry"
                    render={({ field }) => (
                      <div
                        className="flex flex-col gap-2"
                        role="radiogroup"
                        aria-label="Branche"
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
                                  ? "border-2 border-[oklch(0.38_0.12_255)] bg-white"
                                  : "border-border bg-muted/40 hover:border-muted-foreground/40"
                              )}
                            >
                              <span
                                className={cn(
                                  "flex h-8 w-8 shrink-0 items-center justify-center rounded border text-sm font-semibold",
                                  selected
                                    ? "border-[oklch(0.38_0.12_255)] bg-[oklch(0.42_0.11_255)] text-white"
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
                      </div>
                    )}
                  />
                  {errors.industry && (
                    <p className="text-xs text-destructive">
                      {errors.industry.message}
                    </p>
                  )}
                </div>

              </div>
            </div>

            {/* Step 1: Wonach suchen Sie? */}
            <div
              className={cn(
                "space-y-6",
                step !== 1 && "pointer-events-none absolute inset-0 opacity-0"
              )}
              aria-hidden={step !== 1}
            >
              <div
                key={`1-${step === 1 ? "active" : "idle"}`}
                className={cn(
                  step === 1 &&
                    "home-reveal home-reveal-delay-4 auth-register-step-reveal"
                )}
              >
                <div className="space-y-2">
                  <Controller
                    control={control}
                    name="seekingType"
                    render={({ field }) => (
                      <div
                        className="flex flex-col gap-2"
                        role="radiogroup"
                        aria-label="Wonach suchen Sie?"
                        aria-invalid={!!errors.seekingType}
                      >
                        {SEEKING_OPTIONS.map((opt, i) => {
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
                                  ? "border-2 border-[oklch(0.38_0.12_255)] bg-white"
                                  : "border-border bg-muted/40 hover:border-muted-foreground/40"
                              )}
                            >
                              <span
                                className={cn(
                                  "flex h-8 w-8 shrink-0 items-center justify-center rounded border text-sm font-semibold",
                                  selected
                                    ? "border-[oklch(0.38_0.12_255)] bg-[oklch(0.42_0.11_255)] text-white"
                                    : "border-muted-foreground/30 bg-muted/10 text-foreground"
                                )}
                              >
                                {letter}
                              </span>
                              <span className="text-base font-medium">
                                {opt.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  />
                  {errors.seekingType && (
                    <p className="text-xs text-destructive">
                      {errors.seekingType.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Ab wann und wie viele */}
            <div
              className={cn(
                "space-y-6",
                step !== 2 && "pointer-events-none absolute inset-0 opacity-0"
              )}
              aria-hidden={step !== 2}
            >
              <div
                key={`2-${step === 2 ? "active" : "idle"}`}
                className={cn(
                  step === 2 &&
                    "home-reveal home-reveal-delay-4 auth-register-step-reveal"
                )}
              >
                <div className="space-y-6">
                  <div>
                    <Label className="text-base text-foreground">
                      Ab wann wird die Stelle benötigt?
                    </Label>
                    {!chooseSpecificStartDate ? (
                      <div className="mt-2 flex h-12 w-full items-center justify-between gap-3 rounded-md border border-input bg-background px-3 shadow-sm">
                        <span className="text-base text-foreground">
                          Ab sofort
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="shrink-0 text-[oklch(0.38_0.12_255)] hover:text-[oklch(0.30_0.11_255)]"
                          onClick={() => setChooseSpecificStartDate(true)}
                        >
                          Ändern
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Input
                          type="date"
                          className="h-12 sm:min-w-0 sm:flex-1"
                          value={startDateValue}
                          onChange={(e) => setStartDateValue(e.target.value)}
                          autoFocus
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-12 shrink-0 sm:h-12"
                          onClick={() => {
                            setStartDateValue("");
                            setChooseSpecificStartDate(false);
                          }}
                        >
                          Ab sofort
                        </Button>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="slots" className="text-base text-foreground">
                      Wie viele Stellen suchen Sie voraussichtlich?
                    </Label>
                    <Input
                      id="slots"
                      type="number"
                      min={1}
                      placeholder="1"
                      className="mt-2 h-12"
                      value={slotsValue}
                      onChange={(e) => setSlotsValue(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Name */}
            <div
              className={cn(
                "space-y-6",
                step !== 3 && "pointer-events-none absolute inset-0 opacity-0"
              )}
              aria-hidden={step !== 3}
            >
              <div
                key={`3-${step === 3 ? "active" : "idle"}`}
                className={cn(
                  step === 3 &&
                    "home-reveal home-reveal-delay-4 auth-register-step-reveal"
                )}
              >
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-base text-foreground">
                    Vor- und Nachname
                  </Label>
                  <Input
                    id="name"
                    className="h-12 text-base"
                    placeholder="z.B. Maria Müller"
                    {...register("name")}
                    aria-invalid={!!errors.name}
                    autoFocus={step === 3}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 4: E-Mail */}
            <div
              className={cn(
                "space-y-6",
                step !== 4 && "pointer-events-none absolute inset-0 opacity-0"
              )}
              aria-hidden={step !== 4}
            >
              <div
                key={`4-${step === 4 ? "active" : "idle"}`}
                className={cn(
                  step === 4 &&
                    "home-reveal home-reveal-delay-4 auth-register-step-reveal"
                )}
              >
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-base text-foreground">
                    E-Mail-Adresse
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    className="h-12 text-base"
                    placeholder="name@firma.de"
                    {...register("email")}
                    aria-invalid={!!errors.email}
                    autoFocus={step === 4}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 5: Telefon */}
            <div
              className={cn(
                "space-y-6",
                step !== 5 && "pointer-events-none absolute inset-0 opacity-0"
              )}
              aria-hidden={step !== 5}
            >
              <div
                key={`5-${step === 5 ? "active" : "idle"}`}
                className={cn(
                  step === 5 &&
                    "home-reveal home-reveal-delay-4 auth-register-step-reveal"
                )}
              >
                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-base text-foreground">
                    Telefonnummer
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    className="h-12 text-base"
                    placeholder="+49 170 1234567"
                    {...register("phone")}
                    aria-invalid={!!errors.phone}
                    autoFocus={step === 5}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div
              key={step}
              className="home-reveal home-reveal-delay-4 auth-register-step-reveal mt-8 flex items-center gap-3"
            >
              {step < STEPS.length - 1 ? (
                <Button
                  type="button"
                  onClick={goNext}
                  className="h-10 gap-1.5 px-4 text-lg font-semibold bg-[oklch(0.38_0.12_255)] text-white hover:bg-[oklch(0.30_0.11_255)]"
                >
                  Ok
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={isLoading}
                  onClick={handleFinish}
                  className="h-10 gap-1.5 px-4 text-lg font-semibold bg-[oklch(0.38_0.12_255)] text-white hover:bg-[oklch(0.30_0.11_255)]"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Absenden"
                  )}
                </Button>
              )}
              <div className="flex-1" />
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
