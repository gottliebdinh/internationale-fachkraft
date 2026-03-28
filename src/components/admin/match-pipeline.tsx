"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Search, UserPlus, X } from "lucide-react";

type CandidateRef = {
  id: string;
  first_name: string;
  last_name: string;
  profile_photo_url: string | null;
  german_level: string | null;
  desired_position: string | null;
  desired_field: string | null;
};

type MatchRow = {
  id: string;
  status: string;
  candidate_id: string;
  job_position_id: string;
  created_at: string;
  candidates: CandidateRef;
  photoUrl: string | null;
  jobPositionTitle?: string | null;
};

type PositionSummaryItem = {
  id: string;
  title: string;
  positionTypeLabel: string;
  slotsTotal: number;
  slotsFilled: number;
  startDateLabel: string;
};

type PositionsSummary = {
  items: PositionSummaryItem[];
  totalSlots: number;
  totalFilled: number;
};

type JobPositionForAssign = {
  id: string;
  title: string;
  slotsTotal: number;
  slotsFilled: number;
};

type Props = {
  employerId: string;
  matches: MatchRow[];
  availableCandidates: CandidateRef[];
  positionsSummary?: PositionsSummary | null;
  jobPositionsForAssign?: JobPositionForAssign[];
};

const STATUS_OPTIONS = [
  { value: "employer_accepted", label: "AG akzeptiert", color: "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  { value: "both_accepted", label: "Beide akzeptiert", color: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300" },
  { value: "ihk_submitted", label: "IHK eingereicht", color: "bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-300" },
  { value: "visa_applied", label: "Visum beantragt", color: "bg-cyan-50 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300" },
  { value: "visa_granted", label: "Visum erteilt", color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" },
  { value: "arrived", label: "Angekommen", color: "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300" },
];

const STATUS_MAP = new Map(STATUS_OPTIONS.map((s) => [s.value, s]));

export function MatchPipeline({
  employerId,
  matches,
  availableCandidates,
  positionsSummary,
  jobPositionsForAssign,
}: Props) {
  const router = useRouter();
  const [updatingMatchId, setUpdatingMatchId] = useState<string | null>(null);
  const [assigningForJpId, setAssigningForJpId] = useState<string | null>(null);
  const [assigningCandidateId, setAssigningCandidateId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const positions = positionsSummary?.items ?? [];
  const hasPositions = positions.length > 0;

  const matchesByJp = useMemo(() => {
    const map = new Map<string, MatchRow[]>();
    for (const m of matches) {
      const list = map.get(m.job_position_id) ?? [];
      list.push(m);
      map.set(m.job_position_id, list);
    }
    return map;
  }, [matches]);

  async function changeStatus(matchId: string, newStatus: string) {
    setUpdatingMatchId(matchId);
    try {
      await fetch(`/api/admin/employers/${employerId}/matches`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ match_id: matchId, status: newStatus }),
      });
      router.refresh();
    } finally {
      setUpdatingMatchId(null);
    }
  }

  async function assignCandidate(candidateId: string, jpId: string) {
    setAssigningCandidateId(candidateId);
    try {
      const res = await fetch(`/api/admin/employers/${employerId}/matches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate_id: candidateId, job_position_id: jpId }),
      });

      if (res.ok) {
        setAssigningForJpId(null);
        setSearchQuery("");
        router.refresh();
      } else {
        const t = await res.text();
        window.alert(t || "Zuordnung fehlgeschlagen");
      }
    } finally {
      setAssigningCandidateId(null);
    }
  }

  const filteredCandidates = useMemo(() => {
    if (!searchQuery.trim()) return availableCandidates;
    const q = searchQuery.toLowerCase();
    return availableCandidates.filter((c) => {
      const text = [c.first_name, c.last_name, c.desired_position, c.desired_field, c.german_level]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return text.includes(q);
    });
  }, [searchQuery, availableCandidates]);

  function renderMatchRow(m: MatchRow) {
    const c = m.candidates;
    const statusInfo = STATUS_MAP.get(m.status);

    return (
      <div
        key={m.id}
        className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
      >
        <div className="flex items-center gap-3 sm:flex-1">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
            {m.photoUrl ? (
              <Image
                src={m.photoUrl}
                alt={`${c.first_name} ${c.last_name}`}
                fill
                className="object-cover"
                sizes="40px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">
                {c.first_name?.[0]}
                {c.last_name?.[0]}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium">
              {c.first_name} {c.last_name}
            </p>
            <p className="text-xs text-muted-foreground">
              {[c.desired_position, c.desired_field, c.german_level]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {updatingMatchId === m.id && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          <select
            value={m.status}
            disabled={updatingMatchId === m.id}
            onChange={(e) => changeStatus(m.id, e.target.value)}
            className={`h-8 rounded-md border-0 px-2.5 text-xs font-medium outline-none ring-1 ring-inset ring-border focus-visible:ring-2 focus-visible:ring-ring/50 ${statusInfo?.color ?? ""}`}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  function renderAssignPanel(jpId: string) {
    if (assigningForJpId !== jpId) return null;

    return (
      <div className="rounded-lg border border-dashed bg-muted/10 p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kandidat suchen..."
            className="h-9 w-full rounded-md border border-border bg-background pl-10 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            autoFocus
          />
        </div>

        {filteredCandidates.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            {availableCandidates.length === 0
              ? "Alle Kandidaten sind bereits zugeordnet."
              : "Keine Treffer."}
          </p>
        ) : (
          <div className="max-h-64 space-y-1 overflow-y-auto">
            {filteredCandidates.slice(0, 20).map((c) => (
              <button
                key={c.id}
                disabled={assigningCandidateId === c.id}
                onClick={() => assignCandidate(c.id, jpId)}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted disabled:opacity-50"
              >
                {assigningCandidateId === c.id ? (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <span className="font-medium">
                  {c.first_name} {c.last_name}
                </span>
                {c.desired_position && (
                  <span className="text-muted-foreground">
                    {c.desired_position}
                  </span>
                )}
                {c.german_level && (
                  <Badge variant="outline" className="ml-auto text-xs">
                    {c.german_level}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!hasPositions) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Bitte zuerst eine Stelle oben anlegen, um Kandidaten zuzuordnen.
        </p>
        {matches.length > 0 && (
          <div className="divide-y rounded-lg border">
            {matches.map(renderMatchRow)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {positions.map((pos) => {
        const jpMatches = matchesByJp.get(pos.id) ?? [];
        const full = jpMatches.length >= pos.slotsTotal && pos.slotsTotal > 0;
        const jpForAssign = jobPositionsForAssign?.find((j) => j.id === pos.id);

        return (
          <div key={pos.id} className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-muted/30 px-4 py-3">
              <div className="min-w-0 space-y-0.5">
                <p className="text-sm font-medium text-foreground">{pos.title}</p>
                <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                  <Badge variant="outline" className="text-xs font-normal">
                    {pos.positionTypeLabel}
                  </Badge>
                  {pos.startDateLabel !== "–" && (
                    <span className="text-xs">{pos.startDateLabel}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={
                    full
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                      : ""
                  }
                >
                  {jpMatches.length}/{pos.slotsTotal} besetzt
                </Badge>
                {!full && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 px-2 text-xs"
                    onClick={() => {
                      if (assigningForJpId === pos.id) {
                        setAssigningForJpId(null);
                        setSearchQuery("");
                      } else {
                        setAssigningForJpId(pos.id);
                        setSearchQuery("");
                      }
                    }}
                  >
                    {assigningForJpId === pos.id ? (
                      <>
                        <X className="h-3 w-3" />
                        Schliessen
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-3 w-3" />
                        Zuordnen
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {renderAssignPanel(pos.id)}

            {jpMatches.length === 0 ? (
              <p className="py-4 text-center text-xs text-muted-foreground">
                Noch keine Kandidaten für diese Stelle.
              </p>
            ) : (
              <div className="divide-y rounded-lg border">
                {jpMatches.map(renderMatchRow)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
