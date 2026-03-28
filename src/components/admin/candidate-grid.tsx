"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Search, Users, X } from "lucide-react";
import { CandidateImportCard } from "./candidate-import-card";

const MATCH_STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  employer_accepted: {
    label: "AG akzeptiert",
    cls: "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-200",
  },
  both_accepted: {
    label: "Beide akzeptiert",
    cls: "border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-200",
  },
  ihk_submitted: {
    label: "IHK eingereicht",
    cls: "border-purple-200 bg-purple-50 text-purple-800 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-200",
  },
  visa_applied: {
    label: "Visum beantragt",
    cls: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200",
  },
  visa_granted: {
    label: "Visum erteilt",
    cls: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  },
  arrived: {
    label: "Angekommen",
    cls: "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200",
  },
};

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

type Candidate = {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  gender: string | null;
  desired_position: string | null;
  desired_field: string | null;
  position_type: string | null;
  german_level: string | null;
  nationality: string | null;
  status: string | null;
  photoUrl: string | null;
  matchStatus: string | null;
};

type Tab = "offen" | "zugewiesen" | "vermittelt";

const TABS: { key: Tab; label: string }[] = [
  { key: "offen", label: "Offen" },
  { key: "zugewiesen", label: "Zugewiesen" },
  { key: "vermittelt", label: "Erfolgreich vermittelt" },
];

function getCandidateTab(c: Candidate): Tab {
  if (!c.matchStatus) return "offen";
  if (c.matchStatus === "arrived") return "vermittelt";
  return "zugewiesen";
}

function getAge(dob: string | null): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

// Bigram set for a string
function bigrams(s: string): Set<string> {
  const low = s.toLowerCase();
  const set = new Set<string>();
  for (let i = 0; i < low.length - 1; i++) {
    set.add(low.slice(i, i + 2));
  }
  return set;
}

// Dice coefficient between two strings (0..1)
function similarity(a: string, b: string): number {
  if (a.length < 2 || b.length < 2) {
    return a.toLowerCase() === b.toLowerCase() ? 1 : 0;
  }
  const bg1 = bigrams(a);
  const bg2 = bigrams(b);
  let intersection = 0;
  for (const bg of bg1) if (bg2.has(bg)) intersection++;
  return (2 * intersection) / (bg1.size + bg2.size);
}

const FUZZY_THRESHOLD = 0.35;

function matchesQuery(searchTokens: string[], haystack: string): boolean {
  const haystackLow = haystack.toLowerCase();
  const haystackWords = haystackLow.split(/\s+/);

  return searchTokens.every((token) => {
    if (haystackLow.includes(token)) return true;
    return haystackWords.some((w) => similarity(token, w) >= FUZZY_THRESHOLD);
  });
}

function buildSearchString(c: Candidate): string {
  const age = getAge(c.date_of_birth);
  return [
    c.first_name,
    c.last_name,
    age !== null ? `${age}` : "",
    c.nationality,
    c.desired_position,
    c.desired_field,
    c.position_type,
    c.german_level ? `${c.german_level} Deutsch` : "",
    c.gender === "male" ? "Männlich" : c.gender === "female" ? "Weiblich" : "",
    c.status,
  ]
    .filter(Boolean)
    .join(" ");
}

export function CandidateGrid({
  candidates,
}: {
  candidates: Candidate[];
}) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("offen");

  const indexed = useMemo(
    () => candidates.map((c) => ({ c, text: buildSearchString(c), tab: getCandidateTab(c) })),
    [candidates]
  );

  const tabCounts = useMemo(() => {
    const counts: Record<Tab, number> = { offen: 0, zugewiesen: 0, vermittelt: 0 };
    for (const item of indexed) counts[item.tab]++;
    return counts;
  }, [indexed]);

  const filtered = useMemo(() => {
    let items = indexed.filter((item) => item.tab === tab);
    const q = query.trim();
    if (q) {
      const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
      items = items.filter((item) => matchesQuery(tokens, item.text));
    }
    return items.map((item) => item.c);
  }, [query, indexed, tab]);

  return (
    <div className="space-y-5">
      <div className="flex w-full gap-1 rounded-lg border bg-muted/40 p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-center text-sm font-medium leading-tight transition-colors sm:px-3",
              tab === t.key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
            <span className={cn(
              "ml-0.5 rounded-full px-1.5 py-0.5 text-xs tabular-nums",
              tab === t.key ? "bg-primary-foreground/20" : "bg-transparent"
            )}>
              {tabCounts[t.key]}
            </span>
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Suche nach Name, Alter, Beruf, Bereich, Deutsch-Level..."
          className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-10 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-foreground/20 focus-visible:ring-2 focus-visible:ring-ring/30"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {query && (
        <p className="text-sm text-muted-foreground">
          {filtered.length} von {tabCounts[tab]} Kandidaten
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CandidateImportCard />
        {filtered.map((c) => {
          const age = getAge(c.date_of_birth);
          const initials =
            (c.first_name?.[0] ?? "") + (c.last_name?.[0] ?? "");
          const st = c.matchStatus ? MATCH_STATUS_LABELS[c.matchStatus] : null;

          return (
            <Link
              key={c.id}
              href={`/admin/candidates/${c.id}`}
              className="group overflow-hidden rounded-xl border border-border bg-card ring-1 ring-transparent transition-all hover:border-border/80 hover:shadow-md hover:ring-foreground/5"
            >
              <div className="relative h-[19rem] w-full bg-muted sm:h-[22rem]">
                {c.photoUrl ? (
                  <Image
                    src={c.photoUrl}
                    alt={`${c.first_name} ${c.last_name}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-3xl font-semibold text-muted-foreground/40">
                    {initials || "?"}
                  </div>
                )}

                {st && (
                  <div className="absolute right-2 top-2">
                    <Badge
                      variant="outline"
                      className={`bg-card/90 text-xs font-medium backdrop-blur-sm ${st.cls}`}
                    >
                      {st.label}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="space-y-2.5 px-4 py-3.5">
                <div>
                  <p className="text-base font-semibold leading-snug text-foreground">
                    {c.first_name} {c.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {age !== null ? `${age} Jahre` : "Alter unbekannt"}
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
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-16 text-muted-foreground">
          <Users className="h-10 w-10" />
          <p>{query ? "Keine Treffer" : "Keine Kandidaten vorhanden"}</p>
        </div>
      )}
    </div>
  );
}
