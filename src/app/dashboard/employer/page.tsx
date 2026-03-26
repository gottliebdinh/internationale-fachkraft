"use client";

import { useState, useEffect, useCallback } from "react";
import { EmployerCandidateGrid9 } from "@/components/dashboard/employer-candidate-grid-9";
import { EMPLOYER_POSITIONS_KEY, type StoredPosition } from "./employer-positions";
import { Loader2, Search } from "lucide-react";
import {
  EMPLOYER_MATCH_INTRO_AFTER_REGISTER_KEY,
  EMPLOYER_MATCH_INTRO_SEEN_KEY,
} from "@/lib/employer-dashboard-intro";

function matchCountLabel(n: number): string {
  if (n <= 0) return "";
  if (n === 1) return "1 passender Kandidat gefunden";
  if (n < 15) return `${n} passende Kandidaten gefunden`;
  return "15+ passende Kandidaten gefunden";
}

/** Nur die Zahl wechselt – kein Remount, kein Blinkeffekt. */
function MatchIntroCountLine({ n }: { n: number }) {
  if (n <= 0) return null;
  if (n === 1) {
    return <span className="tabular-nums">1 passender Kandidat gefunden</span>;
  }
  if (n < 15) {
    return (
      <span className="tabular-nums">
        <span className="inline-block min-w-[1.5em] text-right">{n}</span>
        {" passende Kandidaten gefunden"}
      </span>
    );
  }
  return <span className="tabular-nums">15+ passende Kandidaten gefunden</span>;
}

const POSITION_LABELS: Record<string, string> = {
  chef: "Koch / Köchin",
  service: "Servicekraft",
  hotel: "Hotelfachkraft",
  trainee_h: "Auszubildende/r",
  hairdresser: "Friseur/in",
  trainee_f: "Auszubildende/r",
  salon: "Salon-Assistent/in",
  nurse: "Pflegefachkraft",
  assistant: "Pflegehelfer/in",
  trainee_n: "Auszubildende/r Pflege",
  specialist: "Fachkraft",
  trainee: "Auszubildende/r",
};

function getPositions(): StoredPosition[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(EMPLOYER_POSITIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
    const draft = window.localStorage.getItem("register_employer_draft");
    if (draft) {
      const data = JSON.parse(draft);
      const custom = data.positionCustom as string | undefined;
      const types = data.positionTypes as string[] | undefined;
      const title =
        custom?.trim() ||
        (types?.length ? POSITION_LABELS[types[0]] ?? types[0] : "Stelle") ||
        "Koch / Köchin";
      return [{ id: "initial", title, startDate: data.startDate, slots: data.slots }];
    }
  } catch {
    // ignore
  }
  return [{ id: "initial", title: "Koch / Köchin" }];
}

const CANDIDATES = [
  {
    id: "1",
    name: "Mai Nguyen",
    age: 24,
    role: "Koch / Köchin",
    image: "/profilbilder/mai.png",
    cv: "Ausbildung Hotelfach, 2 Jahre Erfahrung in Restaurant. B2 Deutsch.",
    status: "Vorgeschlagen",
    statusDetail: "Profil wurde Ihnen passend zu Ihrer Stelle vorgeschlagen.",
    papiere: [
      { name: "Lebenslauf", status: "Vorhanden" },
      { name: "Sprachzertifikat B2", status: "Vorhanden" },
      { name: "Ausbildungsnachweis", status: "Vorhanden" },
    ],
  },
  {
    id: "2",
    name: "Linh Tran",
    age: 22,
    role: "Servicekraft",
    image: "/profilbilder/linh.png",
    cv: "Berufserfahrung in Gastronomie, B1 Deutsch. Motiviert für Ausbildung.",
    status: "Vorgeschlagen",
    statusDetail: "Profil wurde Ihnen passend zu Ihrer Stelle vorgeschlagen.",
    papiere: [
      { name: "Lebenslauf", status: "Vorhanden" },
      { name: "Sprachzertifikat B1", status: "Vorhanden" },
    ],
  },
  {
    id: "3",
    name: "Hoang Le",
    age: 26,
    role: "Koch / Köchin",
    image: "/profilbilder/hoang.png",
    cv: "Koch-Ausbildung Vietnam, 3 Jahre Küche. B2 Deutsch.",
    status: "Vorgeschlagen",
    statusDetail: "Profil wurde Ihnen passend zu Ihrer Stelle vorgeschlagen.",
    papiere: [
      { name: "Lebenslauf", status: "Vorhanden" },
      { name: "Sprachzertifikat B2", status: "Vorhanden" },
      { name: "Berufsabschluss", status: "Vorhanden" },
    ],
  },
];

const GRID_CANDIDATES = CANDIDATES.map((c) => ({
  id: c.id,
  name: c.name,
  age: c.age,
  image: c.image,
}));

export default function EmployerDashboardPage() {
  const [positions, setPositions] = useState<StoredPosition[]>([]);
  const [showMatchIntro, setShowMatchIntro] = useState(false);
  const [introPhase, setIntroPhase] = useState<"search" | "count" | "grid">("search");
  const [matchCount, setMatchCount] = useState(0);

  const finishMatchIntro = useCallback(() => {
    try {
      sessionStorage.setItem(EMPLOYER_MATCH_INTRO_SEEN_KEY, "1");
    } catch {
      // ignore
    }
    setShowMatchIntro(false);
  }, []);

  useEffect(() => {
    setPositions(getPositions());
  }, []);

  // Intro nur direkt nach Registrierung erzwingen
  useEffect(() => {
    try {
      const afterRegister = sessionStorage.getItem(
        EMPLOYER_MATCH_INTRO_AFTER_REGISTER_KEY
      );
      if (afterRegister === "1") {
        sessionStorage.removeItem(EMPLOYER_MATCH_INTRO_AFTER_REGISTER_KEY);
        setShowMatchIntro(true);
        setIntroPhase("search");
        setMatchCount(0);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!showMatchIntro || introPhase !== "search") return;
    const t = window.setTimeout(() => setIntroPhase("count"), 1400);
    return () => window.clearTimeout(t);
  }, [showMatchIntro, introPhase]);

  useEffect(() => {
    if (!showMatchIntro || introPhase !== "count") return;

    setMatchCount(0);
    let cancelled = false;
    let n = 0;

    const step = () => {
      if (cancelled) return;
      n += 1;
      setMatchCount(n);
      if (n < 15) {
        window.setTimeout(step, 70);
      } else {
        window.setTimeout(() => {
          if (!cancelled) setIntroPhase("grid");
        }, 200);
      }
    };

    const t0 = window.setTimeout(step, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(t0);
    };
  }, [showMatchIntro, introPhase]);

  useEffect(() => {
    if (!showMatchIntro || introPhase !== "grid") return;
    const t = window.setTimeout(() => finishMatchIntro(), 1200);
    return () => window.clearTimeout(t);
  }, [showMatchIntro, introPhase, finishMatchIntro]);

  return (
    <div className="relative mx-auto flex h-full max-h-full min-h-0 w-full max-w-5xl flex-col gap-1 overflow-hidden sm:gap-1.5">
      {showMatchIntro && (
        <div
          className="absolute inset-0 z-[80] flex flex-col items-center justify-center overflow-y-auto bg-background/92 p-4 backdrop-blur-md animate-in fade-in duration-300 sm:p-5"
          aria-live="polite"
          aria-busy={introPhase !== "grid"}
        >
          <div className="flex w-full max-w-lg flex-col items-center text-center animate-in zoom-in-95 duration-500">
            <div className="relative mb-5 flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[oklch(0.38_0.12_255/0.12)]">
              <Search className="h-11 w-11 text-[oklch(0.38_0.12_255)] motion-safe:animate-pulse" />
              <Loader2 className="absolute -bottom-1 -right-1 h-9 w-9 text-[oklch(0.38_0.12_255)] motion-safe:animate-spin" />
            </div>

            {introPhase === "search" && (
              <>
                <p className="font-[var(--font-display)] text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Passende Kandidaten werden gesucht …
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Wir gleichen Ihre Stelle mit unserem Kandidatenpool ab.
                </p>
              </>
            )}

            {introPhase === "count" && (
              <div className="flex w-full flex-col items-center">
                <p className="min-h-[3.5rem] font-[var(--font-display)] text-2xl font-semibold leading-snug tracking-tight text-foreground sm:min-h-[4rem] sm:text-3xl">
                  <MatchIntroCountLine n={matchCount} />
                </p>
                <div className="mt-6 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted sm:max-w-sm">
                  <div
                    className="h-full rounded-full bg-[oklch(0.38_0.12_255)] transition-[width] duration-150 ease-out"
                    style={{ width: `${Math.min(100, (matchCount / 15) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {introPhase === "grid" && (
              <div className="w-full animate-in fade-in zoom-in-95 duration-500">
                <p className="mb-3 text-center font-[var(--font-display)] text-base font-semibold text-foreground sm:text-lg">
                  {matchCountLabel(15)}
                </p>
                <EmployerCandidateGrid9
                  candidates={GRID_CANDIDATES}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="shrink-0 space-y-0.5 sm:space-y-1">
        <h2 className="font-[var(--font-display)] text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          Ihre Kandidaten
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg">
          Passende Vorschläge zu Ihrer ausgeschriebenen Stelle
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-start overflow-hidden pt-0.5">
        {!showMatchIntro &&
          positions.map((pos) => (
            <div
              key={pos.id}
              className="flex min-h-0 flex-1 items-start justify-center overflow-hidden pt-0 sm:pt-1"
            >
              <EmployerCandidateGrid9
                candidates={GRID_CANDIDATES}
                className="max-h-full min-h-0"
              />
            </div>
          ))}
      </div>

    </div>
  );
}
