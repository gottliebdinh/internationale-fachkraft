"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Building2, Calendar, Phone, Search, User, X } from "lucide-react";

type MatchSummary = { status: string; count: number };

type EmployerRow = {
  id: string;
  company_name: string;
  industry: string;
  industry_other: string | null;
  city: string;
  contact_person: string;
  phone: string;
  verified: boolean;
  created_at: string;
  matchSummary: MatchSummary[];
  totalMatches: number;
  slotsTotal: number;
  allArrived: boolean;
  earliestStatus: string | null;
  earliestStartDate: string | null;
  earliestStartLabel: string | null;
};

type Tab = "offen" | "zugewiesen" | "vermittelt";

const TABS: { key: Tab; label: string }[] = [
  { key: "offen", label: "Offen" },
  { key: "zugewiesen", label: "Zugewiesen" },
  { key: "vermittelt", label: "Erfolgreich vermittelt" },
];

type SortKey = "name" | "start";

const STATUS_LABELS: Record<string, string> = {
  employer_accepted: "AG akzeptiert",
  both_accepted: "Beide akzeptiert",
  ihk_submitted: "IHK eingereicht",
  visa_applied: "Visum beantragt",
  visa_granted: "Visum erteilt",
  arrived: "Angekommen",
};

const STATUS_COLORS: Record<string, string> = {
  employer_accepted: "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  both_accepted: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  ihk_submitted: "bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  visa_applied: "bg-cyan-50 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
  visa_granted: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  arrived: "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300",
};

function getEmployerTab(e: EmployerRow): Tab {
  if (e.allArrived && e.totalMatches > 0 && e.totalMatches >= e.slotsTotal) return "vermittelt";
  if (e.totalMatches > 0 && e.totalMatches >= e.slotsTotal) return "zugewiesen";
  return "offen";
}

const INDUSTRY_LABELS: Record<string, string> = {
  hospitality: "Gastronomie",
  hairdressing: "Friseur",
  nursing: "Pflege",
  other: "Andere",
};

function bigrams(s: string): Set<string> {
  const low = s.toLowerCase();
  const set = new Set<string>();
  for (let i = 0; i < low.length - 1; i++) set.add(low.slice(i, i + 2));
  return set;
}

function similarity(a: string, b: string): number {
  if (a.length < 2 || b.length < 2) return a.toLowerCase() === b.toLowerCase() ? 1 : 0;
  const bg1 = bigrams(a);
  const bg2 = bigrams(b);
  let intersection = 0;
  for (const bg of bg1) if (bg2.has(bg)) intersection++;
  return (2 * intersection) / (bg1.size + bg2.size);
}

function matchesQuery(tokens: string[], haystack: string): boolean {
  const low = haystack.toLowerCase();
  const words = low.split(/\s+/);
  return tokens.every(
    (t) => low.includes(t) || words.some((w) => similarity(t, w) >= 0.35)
  );
}

function buildSearchString(e: EmployerRow): string {
  return [
    e.company_name,
    INDUSTRY_LABELS[e.industry] ?? e.industry,
    e.industry_other,
    e.city,
    e.contact_person,
    e.phone,
    e.verified ? "verifiziert" : "",
    e.totalMatches > 0 ? `${e.totalMatches} kandidaten` : "",
    e.earliestStartLabel,
    e.earliestStatus ? STATUS_LABELS[e.earliestStatus] : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function EmployerGrid({ employers }: { employers: EmployerRow[] }) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("offen");
  const [sort, setSort] = useState<SortKey>("name");

  const indexed = useMemo(
    () => employers.map((e) => ({ e, text: buildSearchString(e), tab: getEmployerTab(e) })),
    [employers]
  );

  const tabCounts = useMemo(() => {
    const counts: Record<Tab, number> = { offen: 0, zugewiesen: 0, vermittelt: 0 };
    for (const item of indexed) counts[item.tab]++;
    return counts;
  }, [indexed]);

  const filtered = useMemo(() => {
    let items = indexed.filter((i) => i.tab === tab);
    const q = query.trim();
    if (q) {
      const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
      items = items.filter((i) => matchesQuery(tokens, i.text));
    }

    const result = items.map((i) => i.e);

    if (sort === "start") {
      result.sort((a, b) => {
        const aDate = a.earliestStartDate ?? "9999-12-31";
        const bDate = b.earliestStartDate ?? "9999-12-31";
        return aDate.localeCompare(bDate);
      });
    } else {
      result.sort((a, b) => a.company_name.localeCompare(b.company_name, "de"));
    }

    return result;
  }, [query, indexed, tab, sort]);

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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Suche nach Firma, Branche, Stadt, Startdatum..."
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
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/30 sm:w-48"
        >
          <option value="name">Sortierung: Name</option>
          <option value="start">Sortierung: Startdatum</option>
        </select>
      </div>

      {query && (
        <p className="text-sm text-muted-foreground">
          {filtered.length} von {tabCounts[tab]} Unternehmen
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((e) => {
          const industryLabel =
            e.industry === "other" && e.industry_other
              ? e.industry_other
              : INDUSTRY_LABELS[e.industry] ?? e.industry;

          return (
            <Link
              key={e.id}
              href={`/admin/employers/${e.id}`}
              className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 ring-1 ring-transparent transition-all hover:border-border/80 hover:shadow-md hover:ring-foreground/5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-base font-semibold leading-snug text-foreground">
                      {e.company_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {industryLabel}
                      {e.city ? ` · ${e.city}` : ""}
                    </p>
                  </div>
                </div>
                {e.verified && (
                  <Badge
                    variant="outline"
                    className="shrink-0 border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                  >
                    Verifiziert
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {e.contact_person && (
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    {e.contact_person}
                  </span>
                )}
                {e.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    {e.phone}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {e.slotsTotal > 0 || e.totalMatches > 0 ? (
                  <Badge
                    variant="secondary"
                    className={e.totalMatches >= e.slotsTotal && e.slotsTotal > 0 ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400" : ""}
                  >
                    {e.totalMatches}/{e.slotsTotal || "?"} besetzt
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground/60">
                    Noch keine Stellen
                  </span>
                )}

                {e.earliestStatus && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-normal",
                      STATUS_COLORS[e.earliestStatus] ?? ""
                    )}
                  >
                    {STATUS_LABELS[e.earliestStatus] ?? e.earliestStatus}
                  </Badge>
                )}

                {e.earliestStartLabel && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {e.earliestStartLabel}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-16 text-muted-foreground">
          <Building2 className="h-10 w-10" />
          <p>{query ? "Keine Treffer" : "Keine Unternehmen vorhanden"}</p>
        </div>
      )}
    </div>
  );
}
