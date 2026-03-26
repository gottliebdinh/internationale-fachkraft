"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type GridCandidate = {
  id: string;
  name: string;
  age: number;
  image: string;
};

/**
 * 3×2 Grid für das Employer-Dashboard.
 * Einheitlicher Blur für alle Karten.
 */

type EmployerCandidateGrid9Props = {
  candidates: GridCandidate[];
  className?: string;
};

const gridGap = "gap-2.5 sm:gap-3";
const gridMax = "mx-auto min-h-0 w-full max-w-3xl sm:max-w-4xl lg:max-w-5xl";
// Weniger starkes Blur für einen lesbareren Look.
const UNIFORM_BLUR_CLASS = "blur-[5px] opacity-[0.62]";

/** 3×2: obere Reihe Teaser (nicht klickbar), untere Reihe stärkerer Blur; CTA mittig über dem Raster. */
export function EmployerCandidateGrid9({ candidates, className }: EmployerCandidateGrid9Props) {
  const c = candidates;
  if (c.length < 3) return null;

  const slots: GridCandidate[] = Array.from({ length: 6 }, (_, i) => c[i % c.length]!);
  const topRow = slots.slice(0, 3);
  const bottomRow = slots.slice(3, 6);

  return (
    <div className={cn(gridMax, "relative flex min-h-0 flex-col", gridGap, className)}>
      <div className={cn("grid min-h-0 grid-cols-3", gridGap)}>
        {topRow.map((person, i) => {
          return (
            <div
              key={`${person.id}-${i}`}
              className="pointer-events-none select-none overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            >
              <div
                className={cn(
                  "relative w-full bg-muted h-[clamp(6.5rem,26dvh,14rem)] sm:h-[clamp(7.25rem,29dvh,16rem)]",
                  UNIFORM_BLUR_CLASS
                )}
              >
                <Image
                  src={person.image}
                  alt={person.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 32vw, (max-width: 1024px) 28vw, 280px"
                  draggable={false}
                />
              </div>
              <div
                className={cn(
                  "space-y-1 px-2 py-2 text-center sm:space-y-1.5 sm:px-2.5 sm:py-3",
                  UNIFORM_BLUR_CLASS
                )}
              >
                <p className="truncate text-sm font-semibold leading-tight text-foreground">
                  {person.name}
                </p>
                <p className="text-xs text-muted-foreground sm:text-sm">{person.age} Jahre</p>
                <div
                  className="flex h-9 w-full items-center justify-center rounded-md border border-border/80 bg-background/80 text-sm font-medium text-muted-foreground sm:h-10"
                  aria-hidden
                >
                  Profil
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={cn("grid min-h-0 grid-cols-3", gridGap)}>
        {bottomRow.map((person, index) => {
          const gridIndex = index + 3;

          return (
            <div
              key={`${person.id}-${gridIndex}`}
              className="pointer-events-none select-none overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            >
              <div
                  className={cn(
                    "relative w-full bg-muted h-[clamp(6.5rem,26dvh,14rem)] sm:h-[clamp(7.25rem,29dvh,16rem)]",
                    UNIFORM_BLUR_CLASS
                  )}
              >
                <Image
                  src={person.image}
                  alt=""
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 32vw, (max-width: 1024px) 28vw, 280px"
                  draggable={false}
                />
              </div>
              <div
                className={cn(
                  "space-y-1 px-2 py-2 text-center sm:space-y-1.5 sm:px-2.5 sm:py-3",
                  UNIFORM_BLUR_CLASS
                )}
              >
                <div className="mx-auto h-2.5 w-20 rounded-md bg-muted-foreground/20 sm:w-24" />
                <div className="mx-auto h-2 w-12 rounded bg-muted-foreground/15 sm:w-14" />
                <div className="h-9 w-full rounded-lg bg-muted-foreground/10 sm:h-10" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center p-3 sm:p-4 md:p-5">
        <div
          className="pointer-events-none flex w-full max-w-md flex-col items-center justify-center gap-3.5 rounded-xl border border-border/60 bg-card/92 px-4 py-5 text-center shadow-lg shadow-black/[0.06] sm:max-w-lg sm:gap-4 sm:px-6 sm:py-6 dark:border-border/50 dark:bg-card/90 dark:shadow-black/20"
          role="region"
          aria-label="Ihre Kandidaten anzeigen"
        >
          <div className="pointer-events-none flex w-full flex-col items-center justify-center gap-2.5 sm:gap-3">
            <p className="w-full text-balance text-center font-[var(--font-display)] text-lg font-semibold leading-snug tracking-tight text-foreground sm:text-xl md:text-2xl">
              Jetzt Ihre Kandidaten anzeigen
            </p>
            <span
              className="h-1 w-11 shrink-0 rounded-full bg-[oklch(0.38_0.12_255)] sm:w-12"
              aria-hidden
            />
          </div>
          <Button
            type="button"
            size="lg"
            className="pointer-events-auto h-12 min-h-12 w-full shrink-0 rounded-lg px-8 text-base font-semibold shadow-md shadow-[oklch(0.38_0.12_255/0.22)] transition-shadow hover:shadow-lg hover:shadow-[oklch(0.38_0.12_255/0.28)] sm:h-14 sm:min-h-14 sm:px-10 sm:text-lg bg-[oklch(0.38_0.12_255)] text-white hover:bg-[oklch(0.30_0.11_255)]"
            asChild
          >
            <Link href="/contact">Kontakt aufnehmen</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
