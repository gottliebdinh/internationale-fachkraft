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
  Briefcase,
  Users,
  User,
  Mail,
  Phone,
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
  { id: "position", icon: Users, label: "Stelle" },
  { id: "contact", icon: User, label: "Kontaktperson" },
  { id: "company", icon: Building2, label: "Unternehmen" },
  { id: "email", icon: Mail, label: "E-Mail" },
  { id: "phone", icon: Phone, label: "Telefon" },
] as const;

const STEP_FIELDS: Record<string, (keyof RegisterEmployerFormData)[]> = {
  industry: ["industry", "industryOther"],
  position: [],
  contact: ["contactPerson"],
  company: ["companyName", "address", "city", "plz"],
  email: ["email"],
  phone: ["phone"],
};

const INDUSTRY_OPTIONS = [
  { value: "hospitality" as const, labelKey: "hospitality" },
  { value: "hairdressing" as const, labelKey: "hairdressing" },
  { value: "nursing" as const, labelKey: "nursing" },
];

const STEP_QUESTIONS: Record<number, string> = {
  0: "Aus welcher Branche kommen Sie?",
  1: "Welche Stelle möchten Sie besetzen?",
  2: "Wer ist die Kontaktperson?",
  3: "Wie heißt Ihr Unternehmen?",
  4: "Unter welcher E-Mail erreichen wir Sie?",
  5: "Unter welcher Telefonnummer erreichen wir Sie?",
};

const POSITION_OPTIONS_BY_INDUSTRY: Record<
  string,
  { value: string; label: string }[]
> = {
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
    control,
    trigger,
    watch,
    getValues,
    formState: { errors },
  } = useForm<RegisterEmployerFormData>({
    resolver: zodResolver(registerEmployerSchema),
    mode: "onTouched",
    defaultValues: {
      contactPerson: "",
      address: "",
      city: "",
      plz: "",
      phone: "",
    },
  });

  const selectedIndustry = watch("industry");
  const previousIndustryRef = useRef<string | undefined>(undefined);

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
    if (step === 1) {
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
          email: data.email,
          company_name: data.companyName,
          industry: data.industry,
          industry_other: data.industryOther,
          contact_person: data.contactPerson,
          address: data.address,
          city: data.city,
          plz: data.plz,
          phone: data.phone,
          position_types: selectedPositions,
          position_custom: customPositionText,
          slots_total: Math.max(1, parseInt(slotsValue, 10) || 1),
          start_date: startDateValue.trim() || undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || "Registrierung fehlgeschlagen.");
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
    <div className="auth-card-enter flex h-full min-h-0 w-full flex-col items-stretch overflow-hidden">
      <div className="w-full shrink-0 overflow-hidden rounded-b-2xl">
        <div className="h-2 w-full overflow-hidden bg-muted/80">
          <div
            className="h-full rounded-full bg-[oklch(0.38_0.12_255)] transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

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

      <div className="flex min-h-0 w-full flex-1 flex-col justify-center py-8">
        <div className="w-full max-w-6xl pl-[28vw] pr-8">
          <Link
            href="/"
            className="mb-6 block text-left rounded-md focus:outline-none focus:ring-2 focus:ring-[oklch(0.38_0.12_255)] focus:ring-offset-2"
          >
            <h1 className="font-[var(--font-display)] text-3xl font-semibold tracking-tight text-foreground">
              Ge<span className="text-[oklch(0.50_0.11_195)]">Vin</span>
            </h1>
          </Link>

          <div
            key={step}
            className="mb-6 flex items-start gap-3 text-left animate-in fade-in-0 slide-in-from-top-4 duration-300"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[oklch(0.38_0.12_255)] text-sm font-semibold text-white">
              {step + 1}
            </span>
            <h2 className="font-[var(--font-display)] text-xl font-normal tracking-tight text-foreground sm:text-2xl">
              {STEP_QUESTIONS[step]}
            </h2>
          </div>

          <div className="relative">
            {/* Step 0: Branche */}
            <div
              className={cn(
                "space-y-6 transition-opacity duration-200",
                step !== 0 && "pointer-events-none absolute inset-0 opacity-0"
              )}
              aria-hidden={step !== 0}
            >
              <div
                className={cn(
                  step === 0 &&
                    "animate-in fade-in-0 slide-in-from-top-4 duration-300"
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
                    <Label
                      htmlFor="industryOther"
                      className="text-sm font-medium text-foreground"
                    >
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

            {/* Step 1: Stelle */}
            <div
              className={cn(
                "space-y-6 transition-opacity duration-200",
                step !== 1 && "pointer-events-none absolute inset-0 opacity-0"
              )}
              aria-hidden={step !== 1}
            >
              <div
                className={cn(
                  step === 1 &&
                    "animate-in fade-in-0 slide-in-from-top-4 duration-300"
                )}
              >
                <p className="mb-4 text-sm text-muted-foreground">
                  Sie können mehrere auswählen. Zusätzlich können Sie unten
                  eigene Begriffe eingeben.
                </p>
                <div className="space-y-3">
                  {(
                    POSITION_OPTIONS_BY_INDUSTRY[selectedIndustry || "other"] ??
                    POSITION_OPTIONS_BY_INDUSTRY.other
                  ).map((opt) => {
                    const checked = selectedPositions.includes(opt.value);
                    return (
                      <label
                        key={opt.value}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors",
                          checked
                            ? "border-2 border-[oklch(0.38_0.12_255)] bg-[oklch(0.38_0.12_255/0.08)]"
                            : "border-border bg-muted/30 hover:border-muted-foreground/40"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setSelectedPositions((prev) =>
                              prev.includes(opt.value)
                                ? prev.filter((x) => x !== opt.value)
                                : [...prev, opt.value]
                            )
                          }
                          className="h-4 w-4 rounded border-input"
                        />
                        <span className="text-sm font-medium">{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
                <div className="mt-6">
                  <Label
                    htmlFor="positionCustom"
                    className="text-sm text-foreground"
                  >
                    Nach Wörtern suchen / selbst eingeben (z.{"\u00A0"}B.
                    „Küchenhilfe", „Teilzeit")
                  </Label>
                  <Input
                    id="positionCustom"
                    className="mt-2 h-11"
                    placeholder="Eingabe, die zu Ihrer Branche passt …"
                    value={customPositionText}
                    onChange={(e) => setCustomPositionText(e.target.value)}
                  />
                </div>

                <div className="mt-6 space-y-4">
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

            {/* Step 2: Kontaktperson */}
            <div
              className={cn(
                "space-y-6 transition-opacity duration-200",
                step !== 2 && "pointer-events-none absolute inset-0 opacity-0"
              )}
              aria-hidden={step !== 2}
            >
              <div
                className={cn(
                  step === 2 &&
                    "animate-in fade-in-0 slide-in-from-top-4 duration-300"
                )}
              >
                <div className="space-y-3">
                  <Label
                    htmlFor="contactPerson"
                    className="text-base text-foreground"
                  >
                    Vor- und Nachname
                  </Label>
                  <Input
                    id="contactPerson"
                    className="h-12 text-base"
                    placeholder="z.B. Maria Müller"
                    {...register("contactPerson")}
                    aria-invalid={!!errors.contactPerson}
                    autoFocus={step === 2}
                  />
                  {errors.contactPerson && (
                    <p className="text-xs text-destructive">
                      {errors.contactPerson.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3: Unternehmen + Adresse */}
            <div
              className={cn(
                "space-y-6 transition-opacity duration-200",
                step !== 3 && "pointer-events-none absolute inset-0 opacity-0"
              )}
              aria-hidden={step !== 3}
            >
              <div
                className={cn(
                  step === 3 &&
                    "animate-in fade-in-0 slide-in-from-top-4 duration-300"
                )}
              >
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label
                      htmlFor="companyName"
                      className="text-base text-foreground"
                    >
                      {tEmployer("companyName")}
                    </Label>
                    <Input
                      id="companyName"
                      className="h-12 text-base"
                      placeholder="z.B. Hotel Adlon Kempinski"
                      {...register("companyName")}
                      aria-invalid={!!errors.companyName}
                      autoFocus={step === 3}
                    />
                    {errors.companyName && (
                      <p className="text-xs text-destructive">
                        {errors.companyName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="address"
                      className="text-base text-foreground"
                    >
                      Adresse
                    </Label>
                    <Input
                      id="address"
                      className="h-12 text-base"
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
                  <div className="grid grid-cols-[7rem_1fr] gap-3">
                    <div className="space-y-3">
                      <Label
                        htmlFor="plz"
                        className="text-base text-foreground"
                      >
                        PLZ
                      </Label>
                      <Input
                        id="plz"
                        className="h-12 text-base"
                        placeholder="10117"
                        {...register("plz")}
                        aria-invalid={!!errors.plz}
                      />
                      {errors.plz && (
                        <p className="text-xs text-destructive">
                          {errors.plz.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="city"
                        className="text-base text-foreground"
                      >
                        Stadt
                      </Label>
                      <Input
                        id="city"
                        className="h-12 text-base"
                        placeholder="Berlin"
                        {...register("city")}
                        aria-invalid={!!errors.city}
                      />
                      {errors.city && (
                        <p className="text-xs text-destructive">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: E-Mail */}
            <div
              className={cn(
                "space-y-6 transition-opacity duration-200",
                step !== 4 && "pointer-events-none absolute inset-0 opacity-0"
              )}
              aria-hidden={step !== 4}
            >
              <div
                className={cn(
                  step === 4 &&
                    "animate-in fade-in-0 slide-in-from-top-4 duration-300"
                )}
              >
                <div className="space-y-3">
                  <Label
                    htmlFor="email"
                    className="text-base text-foreground"
                  >
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
                "space-y-6 transition-opacity duration-200",
                step !== 5 && "pointer-events-none absolute inset-0 opacity-0"
              )}
              aria-hidden={step !== 5}
            >
              <div
                className={cn(
                  step === 5 &&
                    "animate-in fade-in-0 slide-in-from-top-4 duration-300"
                )}
              >
                <div className="space-y-3">
                  <Label
                    htmlFor="phone"
                    className="text-base text-foreground"
                  >
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
              )}
              <div className="flex-1" />
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Sie haben bereits ein Konto?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-[oklch(0.38_0.12_255)] transition-colors hover:text-[oklch(0.30_0.11_255)]"
              >
                Jetzt anmelden
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
