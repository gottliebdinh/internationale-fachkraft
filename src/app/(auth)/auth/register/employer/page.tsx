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
  Building2,
  Lock,
  Briefcase,
  ShieldCheck,
  Calendar,
  Users,
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
import { scheduleEmployerMatchIntroAfterRegister } from "@/lib/employer-dashboard-intro";

const STEPS = [
  { id: "industry", icon: Briefcase, label: "Branche" },
  { id: "company", icon: Building2, label: "Firmenname" },
  { id: "positions", icon: Users, label: "Arbeitskräfte" },
  { id: "startDate", icon: Calendar, label: "Ab wann" },
  { id: "account", icon: Lock, label: "Benutzer erstellen" },
  { id: "verification", icon: ShieldCheck, label: "Verifizierung" },
] as const;

const STEP_FIELDS: Record<string, (keyof RegisterEmployerFormData)[]> = {
  industry: ["industry", "industryOther"],
  company: ["companyName"],
  account: ["email", "password", "confirmPassword"],
  verification: ["verificationCode"],
  positions: [],
  startDate: [],
};

const INDUSTRY_OPTIONS = [
  { value: "hospitality" as const, labelKey: "hospitality" },
  { value: "hairdressing" as const, labelKey: "hairdressing" },
  { value: "nursing" as const, labelKey: "nursing" },
];

const STEP_QUESTIONS: Record<number, string> = {
  0: "Aus welcher Branche kommen Sie?",
  1: "Wie heißt Ihr Unternehmen?",
  2: "Nach welchen Arbeitskräften suchen Sie?",
  3: "Ab wann und wie viele Stellen?",
  4: "Benutzerkonto erstellen",
  5: "E-Mail-Verifizierung",
};

// Optionen pro Branche (Mehrfachauswahl + Freitext)
const POSITION_OPTIONS_BY_INDUSTRY: Record<string, { value: string; label: string }[]> = {
  hospitality: [
    { value: "chef", label: "Koch / Köchin" },
    { value: "service", label: "Servicekraft" },
    { value: "hotel", label: "Hotelfachkraft" },
    { value: "trainee_h", label: "Auszubildende/r" },
  ],
  hairdressing: [
    { value: "hairdresser", label: "Friseur/in" },
    { value: "trainee_f", label: "Auszubildende/r" },
    { value: "salon", label: "Salon-Assistent/in" },
  ],
  nursing: [
    { value: "nurse", label: "Pflegefachkraft" },
    { value: "assistant", label: "Pflegehelfer/in" },
    { value: "trainee_n", label: "Auszubildende/r Pflege" },
  ],
  other: [
    { value: "specialist", label: "Fachkraft" },
    { value: "trainee", label: "Auszubildende/r" },
  ],
};

export default function RegisterEmployerPage() {
  const t = useTranslations("auth");
  const tEmployer = useTranslations("employer");
  const tIndustry = useTranslations("industry");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [pendingAdvance, setPendingAdvance] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [customPositionText, setCustomPositionText] = useState("");
  const [startDateValue, setStartDateValue] = useState("");
  const [chooseSpecificStartDate, setChooseSpecificStartDate] = useState(false);
  const [slotsValue, setSlotsValue] = useState("1");

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
    defaultValues: {
      lookingFor: "",
      verificationCode: "",
      positionTypes: [],
      positionCustom: "",
      startDate: "",
    },
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
    if (step === 2 || step === 3) {
      setStep((s) => s + 1);
      return;
    }
    const fieldsToValidate = STEP_FIELDS[STEPS[step].id];
    const valid = fieldsToValidate.length ? await trigger(fieldsToValidate) : true;
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  const onSubmit = async (data: RegisterEmployerFormData) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        companyName: data.companyName,
        industry: data.industry,
        industryOther: data.industryOther,
        email: data.email,
        verificationCode: data.verificationCode,
        positionTypes: selectedPositions,
        positionCustom: customPositionText,
        startDate: startDateValue.trim() ? startDateValue : "Ab sofort",
        slots: Math.max(1, parseInt(slotsValue, 10) || 1),
      };
      if (typeof window !== "undefined") {
        window.localStorage.setItem("register_employer_draft", JSON.stringify(payload));
        // Damit nach dem Redirect kurz die Intro-Animation im Employer-Dashboard läuft.
        scheduleEmployerMatchIntroAfterRegister();
      }
      toast.success("Registrierung abgeschlossen.");
      router.replace("/dashboard/employer");
    } finally {
      setIsLoading(false);
    }
  };

  function handleFinish() {
    handleSubmit(onSubmit)();
  }

  // Strahl reagiert sofort bei Auswahl; nur der Wechsel zur nächsten Seite ist verzögert
  const progressPercent = pendingAdvance
    ? ((step + 2) / STEPS.length) * 100
    : ((step + 1) / STEPS.length) * 100;

  return (
    <div className="auth-card-enter flex h-full min-h-0 w-full flex-col items-stretch overflow-hidden">
      {/* Strahl ganz oben, komplette Breite, rund (unten abgerundet) */}
      <div className="w-full rounded-b-2xl overflow-hidden shrink-0">
        <div className="h-2 w-full overflow-hidden bg-muted/80">
          <div
            className="h-full rounded-full bg-[oklch(0.38_0.12_255)] transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
      {/* Pfeil drunter: Zurück als Icon (nur bei step > 0) */}
      <div className="flex w-full shrink-0 items-center px-4 py-2">
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

      {/* Fragen-Bereich: vertikal zentriert, links bei 1/4 der Seite */}
      <div className="flex-1 min-h-0 w-full flex flex-col justify-center py-8">
        <div className="w-full max-w-6xl pl-[28vw] pr-8">
      <Link
        href="/"
        className="mb-6 block text-left focus:outline-none focus:ring-2 focus:ring-[oklch(0.38_0.12_255)] focus:ring-offset-2 rounded-md"
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
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[oklch(0.38_0.12_255)] text-sm font-semibold text-white">
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
                    <button
                      type="button"
                      onClick={() => field.onChange("other")}
                      className={cn(
                        "mt-3 flex w-full items-center gap-4 rounded-lg border px-5 py-2.5 text-left text-foreground transition-colors",
                        field.value === "other"
                          ? "border-2 border-[oklch(0.38_0.12_255)] bg-white"
                          : "border-border bg-muted/40 hover:border-muted-foreground/40"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded border text-sm font-semibold",
                          field.value === "other"
                            ? "border-[oklch(0.38_0.12_255)] bg-[oklch(0.42_0.11_255)] text-white"
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
                <Label htmlFor="industryOther" className="text-sm font-medium text-foreground">
                  Geben Sie Ihre Branche ein
                </Label>
                <Input
                  id="industryOther"
                  className="mt-2 h-12 text-base"
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

        {/* Step 2: Nach welchen Arbeitskräften (Mehrfachauswahl + Freitext) */}
        <div
          className={cn(
            "space-y-6 transition-opacity duration-200",
            step !== 2 && "pointer-events-none absolute inset-0 opacity-0"
          )}
          aria-hidden={step !== 2}
        >
          <div className={cn(step === 2 && "animate-in slide-in-from-top-4 fade-in-0 duration-300")}>
            <p className="mb-4 text-sm text-muted-foreground">
              Sie können mehrere auswählen. Zusätzlich können Sie unten eigene Begriffe eingeben, die zu Ihrer Branche passen.
            </p>
            <div className="space-y-3">
              {(POSITION_OPTIONS_BY_INDUSTRY[selectedIndustry || "other"] ?? POSITION_OPTIONS_BY_INDUSTRY.other).map((opt) => {
                const checked = selectedPositions.includes(opt.value);
                return (
                  <label
                    key={opt.value}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors",
                      checked ? "border-2 border-[oklch(0.38_0.12_255)] bg-[oklch(0.38_0.12_255/0.08)]" : "border-border bg-muted/30 hover:border-muted-foreground/40"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        setSelectedPositions((prev) =>
                          prev.includes(opt.value) ? prev.filter((x) => x !== opt.value) : [...prev, opt.value]
                        );
                      }}
                      className="h-4 w-4 rounded border-input"
                    />
                    <span className="text-sm font-medium">{opt.label}</span>
                  </label>
                );
              })}
            </div>
            <div className="mt-6">
              <Label htmlFor="positionCustom" className="text-sm text-foreground">
                Nach Wörtern suchen / selbst eingeben (z. B. „Küchenhilfe“, „Teilzeit“)
              </Label>
              <Input
                id="positionCustom"
                className="mt-2 h-11"
                placeholder="Eingabe, die zu Ihrer Branche passt …"
                value={customPositionText}
                onChange={(e) => setCustomPositionText(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Step 3: Ab wann + relevante Fragen */}
        <div
          className={cn(
            "space-y-6 transition-opacity duration-200",
            step !== 3 && "pointer-events-none absolute inset-0 opacity-0"
          )}
          aria-hidden={step !== 3}
        >
          <div className={cn(step === 3 && "animate-in slide-in-from-top-4 fade-in-0 duration-300")}>
            <div className="space-y-4">
              <div>
                <Label htmlFor={chooseSpecificStartDate ? "startDate" : undefined} className="text-base text-foreground">
                  Ab wann wird die Stelle benötigt?
                </Label>
                {!chooseSpecificStartDate ? (
                  <div className="mt-2 flex h-12 w-full items-center justify-between gap-3 rounded-md border border-input bg-background px-3 shadow-sm">
                    <span id="start-date-display" className="text-base text-foreground">
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
                      id="startDate"
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

        {/* Step 4: Benutzer erstellen */}
        <div
          className={cn(
            "space-y-6 transition-opacity duration-200",
            step !== 4 && "pointer-events-none absolute inset-0 opacity-0"
          )}
          aria-hidden={step !== 4}
        >
          <div className={cn(step === 4 && "animate-in slide-in-from-top-4 fade-in-0 duration-300")}>
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
                autoFocus={step === 4}
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

        {/* Step 5: 6-stellige Verifizierung (wie an E-Mail gesendet) – letzter Schritt, danach Dashboard */}
        <div
          className={cn(
            "space-y-6 transition-opacity duration-200",
            step !== 5 && "pointer-events-none absolute inset-0 opacity-0"
          )}
          aria-hidden={step !== 5}
        >
          <div className={cn(step === 5 && "animate-in slide-in-from-top-4 fade-in-0 duration-300")}>
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
                    autoFocus={step === 5}
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

        {/* Ok / Kandidaten finden */}
        <div className="mt-8 flex items-center gap-3">
          {step < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={goNext}
              className="h-10 gap-1.5 px-4 text-lg font-semibold bg-[oklch(0.38_0.12_255)] text-white hover:bg-[oklch(0.30_0.11_255)]"
            >
              Ok
            </Button>
          ) : (
            <div className="flex flex-col items-start gap-2">
              <Button
                type="button"
                disabled={isLoading}
                onClick={handleFinish}
                className="h-10 gap-1.5 px-4 text-lg font-semibold bg-[oklch(0.38_0.12_255)] text-white hover:bg-[oklch(0.30_0.11_255)]"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Kandidaten finden"
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                Ihre Daten werden DSGVO-konform und vertraulich verarbeitet.
              </p>
            </div>
          )}

          <div className="flex-1" />
        </div>
      </form>

      <div className="mt-6 border-t border-border pt-6 text-center text-sm">
        <p className="text-muted-foreground">
          {t("hasAccount")}{" "}
          <Link
            href="/auth/login"
            className="font-medium text-[oklch(0.38_0.12_255)] transition-colors hover:text-[oklch(0.30_0.11_255)]"
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
