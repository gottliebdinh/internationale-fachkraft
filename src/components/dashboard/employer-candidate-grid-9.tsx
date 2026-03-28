"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, Loader2, Phone } from "lucide-react";
import type { GridCandidate } from "@/lib/employer-teaser-candidates";

export type { GridCandidate };

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

type EmployerCandidateGrid9Props = {
  candidates: GridCandidate[];
  /** Ansprechpartner (z. B. aus Registrierung) – erscheint neben „Vielen Dank“ */
  contactPersonName?: string | null;
  /** Telefon bereits im System: Erfolgs-Popup sofort (Nummer erhalten + Name) */
  initialSubmittedPhone?: string | null;
  className?: string;
};

const BLUR = "blur-[6px] opacity-[0.55]";

function normalizeStoredPhone(p: string | null | undefined): string | null {
  const t = p?.trim();
  return t && t.length > 0 ? t : null;
}

export function EmployerCandidateGrid9({
  candidates,
  contactPersonName,
  initialSubmittedPhone,
  className,
}: EmployerCandidateGrid9Props) {
  const cards = candidates.slice(0, 3);
  const preset = normalizeStoredPhone(initialSubmittedPhone);
  const [phone, setPhone] = useState(() => preset ?? "");
  const [submittedPhone, setSubmittedPhone] = useState<string | null>(() => preset);
  const [sending, setSending] = useState(false);

  const submitted = submittedPhone !== null;

  if (cards.length === 0) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = phone.trim();
    if (!trimmed || sending) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    setSubmittedPhone(trimmed);
  }

  function handleChangeNumber() {
    const n = submittedPhone;
    setSubmittedPhone(null);
    setPhone(n ?? "");
  }

  return (
    <div className={cn("relative mx-auto min-h-0 w-full max-w-5xl", className)}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const initials = (c.first_name?.[0] ?? "") + (c.last_name?.[0] ?? "");

          return (
            <div
              key={c.id}
              className="pointer-events-none select-none overflow-hidden rounded-xl border border-border bg-card ring-1 ring-transparent"
            >
              <div className={cn("relative h-[19rem] w-full bg-muted sm:h-[22rem]", BLUR)}>
                {c.image ? (
                  <Image
                    src={c.image}
                    alt={`${c.first_name} ${c.last_name}`}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    draggable={false}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-3xl font-semibold text-muted-foreground/40">
                    {initials || "?"}
                  </div>
                )}
              </div>

              <div className={cn("space-y-2.5 px-4 py-3.5", BLUR)}>
                <div>
                  <p className="text-base font-semibold leading-snug text-foreground">
                    {c.first_name} {c.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {c.age ? `${c.age} Jahre` : "Alter unbekannt"}
                    {c.nationality ? ` · ${c.nationality}` : ""}
                  </p>
                </div>

                {c.desired_position && (
                  <p className="text-sm leading-snug text-foreground/80">
                    {capitalize(c.desired_position)}
                  </p>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {c.desired_field && (
                    <Badge variant="secondary">{c.desired_field}</Badge>
                  )}
                  {c.german_level && (
                    <Badge variant="outline">Deutsch {c.german_level}</Badge>
                  )}
                  {c.position_type && (
                    <Badge variant="outline">{c.position_type}</Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-20 flex items-center justify-center p-3 sm:p-4 md:p-5",
          submitted &&
            "pointer-events-auto z-[100] bg-background/80 backdrop-blur-sm"
        )}
      >
        <div
          className={cn(
            "pointer-events-auto flex w-full max-w-md flex-col items-center justify-center gap-3.5 rounded-xl border border-border/60 bg-card px-5 py-6 text-center shadow-lg shadow-black/[0.06] backdrop-blur-sm sm:max-w-lg sm:gap-4 sm:px-7 sm:py-8 dark:border-border/50 dark:bg-card dark:shadow-black/20",
            submitted && "animate-in fade-in zoom-in-95 duration-300"
          )}
          role="region"
          aria-label={submitted ? "Bestätigung" : "Kandidaten freischalten"}
        >
          {submitted && submittedPhone ? (
            <div className="flex w-full flex-col items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="space-y-3">
                <p className="font-[var(--font-display)] text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                  {contactPersonName?.trim() ? (
                    <>
                      Vielen Dank,{" "}
                      <span className="text-foreground">
                        {contactPersonName.trim()}
                      </span>
                      !
                    </>
                  ) : (
                    "Vielen Dank!"
                  )}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Wir haben Ihre Nummer{" "}
                  <span className="font-medium text-foreground">
                    {submittedPhone}
                  </span>{" "}
                  erfolgreich erhalten und melden uns so bald wie möglich bei
                  Ihnen.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={handleChangeNumber}
              >
                Telefonnummer ändern
              </Button>
            </div>
          ) : (
            <>
              <div className="flex w-full flex-col items-center justify-center gap-2.5 sm:gap-3">
                <p className="w-full text-balance text-center font-[var(--font-display)] text-lg font-semibold leading-snug tracking-tight text-foreground sm:text-xl md:text-2xl">
                  Jetzt Ihre Kandidaten anzeigen
                </p>
                <p className="text-sm text-muted-foreground">
                  Hinterlassen Sie Ihre Nummer – wir melden uns bei Ihnen.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+49 123 456789"
                    required
                    className="h-12 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-base outline-none transition-colors placeholder:text-muted-foreground/50 focus-visible:border-foreground/20 focus-visible:ring-2 focus-visible:ring-ring/30 sm:h-14 sm:text-lg"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={sending || !phone.trim()}
                  className="h-12 w-full rounded-lg text-base font-semibold shadow-md shadow-[oklch(0.38_0.12_255/0.22)] transition-shadow hover:shadow-lg hover:shadow-[oklch(0.38_0.12_255/0.28)] sm:h-14 sm:text-lg bg-[oklch(0.38_0.12_255)] text-white hover:bg-[oklch(0.30_0.11_255)] disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Jetzt beraten lassen"
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
