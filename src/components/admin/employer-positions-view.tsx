"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmployerJobStartField } from "@/components/admin/employer-job-start-field";
import {
  formatJobStartLine,
  isJobStartAsap,
  todayIsoDate,
} from "@/lib/format-job-start";
import {
  Loader2,
  Minus,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";

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
};

export type PositionWithMatches = {
  id: string;
  title: string;
  position_type: string;
  slots_total: number;
  start_date: string;
  matches: MatchRow[];
};

type Props = {
  employerId: string;
  positions: PositionWithMatches[];
  availableCandidates: CandidateRef[];
};

const POSITION_OPTIONS = [
  { value: "apprenticeship", label: "Auszubildende/r" },
  { value: "skilled_worker", label: "Fachkraft" },
  { value: "seasonal", label: "Saison" },
];

const STATUS_OPTIONS = [
  { value: "employer_accepted", label: "AG akzeptiert", color: "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  { value: "both_accepted", label: "Beide akzeptiert", color: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300" },
  { value: "ihk_submitted", label: "IHK eingereicht", color: "bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-300" },
  { value: "visa_applied", label: "Visum beantragt", color: "bg-cyan-50 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300" },
  { value: "visa_granted", label: "Visum erteilt", color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" },
  { value: "arrived", label: "Angekommen", color: "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300" },
];

const STATUS_MAP = new Map(STATUS_OPTIONS.map((s) => [s.value, s]));

export function EmployerPositionsView({
  employerId,
  positions,
  availableCandidates,
}: Props) {
  const router = useRouter();

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [addStartSpecific, setAddStartSpecific] = useState(false);
  const [addStartValue, setAddStartValue] = useState("");

  const [editStartSpecific, setEditStartSpecific] = useState(false);
  const [editStartValue, setEditStartValue] = useState("");

  useEffect(() => {
    if (!editingId) return;
    const p = positions.find((x) => x.id === editingId);
    if (p) {
      const specific = !isJobStartAsap(p.start_date);
      setEditStartSpecific(specific);
      setEditStartValue(specific ? p.start_date.slice(0, 10) : "");
    }
  }, [editingId, positions]);

  const [updatingMatchId, setUpdatingMatchId] = useState<string | null>(null);
  const [removingMatchId, setRemovingMatchId] = useState<string | null>(null);
  const [confirmRemoveMatch, setConfirmRemoveMatch] = useState<{
    matchId: string;
    displayName: string;
  } | null>(null);
  const [confirmDeletePosition, setConfirmDeletePosition] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [assigningForJpId, setAssigningForJpId] = useState<string | null>(null);
  const [assigningCandidateId, setAssigningCandidateId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  async function createPosition(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/employers/${employerId}/job-positions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: fd.get("title"),
          position_type: fd.get("position_type"),
          slots_total: fd.get("slots_total"),
          start_date: addStartSpecific && addStartValue ? addStartValue : todayIsoDate(),
        }),
      });
      if (!res.ok) {
        window.alert(await res.text());
        return;
      }
      setAdding(false);
      setAddStartSpecific(false);
      setAddStartValue("");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function updatePosition(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingId) return;
    const fd = new FormData(e.currentTarget);
    setSaving(true);
    try {
      const res = await fetch(
        `/api/admin/employers/${employerId}/job-positions/${editingId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: fd.get("title"),
            position_type: fd.get("position_type"),
            slots_total: fd.get("slots_total"),
            start_date: editStartSpecific && editStartValue ? editStartValue : todayIsoDate(),
          }),
        }
      );
      if (!res.ok) {
        window.alert(await res.text());
        return;
      }
      setEditingId(null);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function executeDeletePosition() {
    if (!confirmDeletePosition) return;
    const { id, title } = confirmDeletePosition;
    setDeletingId(id);
    try {
      const res = await fetch(
        `/api/admin/employers/${employerId}/job-positions/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) window.alert(await res.text());
      else {
        setConfirmDeletePosition(null);
        router.refresh();
      }
    } finally {
      setDeletingId(null);
    }
  }

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

  async function executeRemoveMatch() {
    if (!confirmRemoveMatch) return;
    const { matchId } = confirmRemoveMatch;
    setRemovingMatchId(matchId);
    try {
      const res = await fetch(
        `/api/admin/employers/${employerId}/matches/${matchId}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        window.alert(await res.text());
        return;
      }
      setConfirmRemoveMatch(null);
      router.refresh();
    } finally {
      setRemovingMatchId(null);
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
        window.alert((await res.text()) || "Zuordnung fehlgeschlagen");
      }
    } finally {
      setAssigningCandidateId(null);
    }
  }

  function posLabel(pt: string) {
    return POSITION_OPTIONS.find((o) => o.value === pt)?.label ?? pt;
  }

  return (
    <div className="space-y-4">
      {/* Position boxes */}
      {positions.map((pos) => {
        const full = pos.matches.length >= pos.slots_total && pos.slots_total > 0;
        const isEditing = editingId === pos.id;
        const isAssigning = assigningForJpId === pos.id;

        return (
          <div
            key={pos.id}
            className="overflow-hidden rounded-xl border bg-card shadow-sm"
          >
            {/* Position header */}
            {isEditing ? (
              <form onSubmit={updatePosition} className="border-b bg-muted/10 p-4 space-y-3">
                <p className="text-sm font-medium">Stelle bearbeiten</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1">
                    <span className="text-xs text-muted-foreground">Bezeichnung *</span>
                    <input
                      name="title"
                      required
                      defaultValue={pos.title}
                      className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs text-muted-foreground">Positionsart</span>
                    <select
                      name="position_type"
                      defaultValue={pos.position_type}
                      className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                    >
                      {POSITION_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs text-muted-foreground">Anzahl Plätze *</span>
                    <input
                      name="slots_total"
                      type="number"
                      min={1}
                      defaultValue={pos.slots_total}
                      required
                      className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                    />
                  </label>
                  <EmployerJobStartField
                    idPrefix={`edit-${pos.id}`}
                    chooseSpecificStartDate={editStartSpecific}
                    setChooseSpecificStartDate={setEditStartSpecific}
                    startDateValue={editStartValue}
                    setStartDateValue={setEditStartValue}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm" disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Speichern"}
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                    Abbrechen
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="font-medium leading-snug">{pos.title}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs font-normal">
                      {posLabel(pos.position_type)}
                    </Badge>
                    <span>{formatJobStartLine(pos.start_date)}</span>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={
                    full
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                      : ""
                  }
                >
                  {pos.matches.length}/{pos.slots_total} besetzt
                </Badge>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={!!editingId || adding}
                    onClick={() => setEditingId(pos.id)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    disabled={deletingId === pos.id || !!editingId || adding}
                    onClick={() =>
                      setConfirmDeletePosition({ id: pos.id, title: pos.title })
                    }
                  >
                    {deletingId === pos.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Candidates for this position */}
            <div className="p-4 space-y-3">
              {pos.matches.length === 0 && !isAssigning && (
                <p className="py-3 text-center text-xs text-muted-foreground">
                  Noch keine Kandidaten zugeordnet.
                </p>
              )}

              {pos.matches.length > 0 && (
                <div className="divide-y rounded-lg border">
                  {pos.matches.map((m) => {
                    const c = m.candidates;
                    const statusInfo = STATUS_MAP.get(m.status);
                    return (
                      <div
                        key={m.id}
                        className="flex flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center"
                      >
                        <div className="flex items-center gap-3 sm:flex-1">
                          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-muted">
                            {m.photoUrl ? (
                              <Image
                                src={m.photoUrl}
                                alt={`${c.first_name} ${c.last_name}`}
                                fill
                                className="object-cover"
                                sizes="36px"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">
                                {c.first_name?.[0]}
                                {c.last_name?.[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <Link
                              href={`/admin/candidates/${c.id}`}
                              className="text-sm font-medium hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {c.first_name} {c.last_name}
                            </Link>
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
                            disabled={updatingMatchId === m.id || removingMatchId === m.id}
                            onChange={(e) => changeStatus(m.id, e.target.value)}
                            className={`h-8 rounded-md border-0 px-2.5 text-xs font-medium outline-none ring-1 ring-inset ring-border focus-visible:ring-2 focus-visible:ring-ring/50 ${statusInfo?.color ?? ""}`}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                            disabled={updatingMatchId === m.id || removingMatchId === m.id}
                            title="Von Stelle entfernen"
                            aria-label="Von Stelle entfernen"
                            onClick={() =>
                              setConfirmRemoveMatch({
                                matchId: m.id,
                                displayName:
                                  `${c.first_name ?? ""} ${c.last_name ?? ""}`.trim() ||
                                  "Kandidat",
                              })
                            }
                          >
                            {removingMatchId === m.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Minus className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Assign panel */}
              {isAssigning && (
                <div className="space-y-3 rounded-lg border border-dashed bg-muted/10 p-3">
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
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      {availableCandidates.length === 0
                        ? "Alle Kandidaten sind bereits zugeordnet."
                        : "Keine Treffer."}
                    </p>
                  ) : (
                    <div className="max-h-56 space-y-0.5 overflow-y-auto">
                      {filteredCandidates.slice(0, 20).map((c) => (
                        <button
                          key={c.id}
                          disabled={assigningCandidateId === c.id}
                          onClick={() => assignCandidate(c.id, pos.id)}
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
                            <span className="text-muted-foreground">{c.desired_position}</span>
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
              )}

              {/* Assign / close button */}
              {!isEditing && !full && (
                <Button
                  type="button"
                  variant={isAssigning ? "ghost" : "outline"}
                  size="sm"
                  className="w-full gap-1.5"
                  onClick={() => {
                    if (isAssigning) {
                      setAssigningForJpId(null);
                      setSearchQuery("");
                    } else {
                      setAssigningForJpId(pos.id);
                      setSearchQuery("");
                    }
                  }}
                >
                  {isAssigning ? (
                    <>
                      <X className="h-3.5 w-3.5" />
                      Schliessen
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-3.5 w-3.5" />
                      Kandidat zuordnen
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        );
      })}

      {/* Add position form */}
      {adding && (
        <div className="overflow-hidden rounded-xl border border-dashed bg-muted/10 shadow-sm">
          <form onSubmit={createPosition} className="p-4 space-y-3">
            <p className="text-sm font-medium">Neue Stelle</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="text-xs text-muted-foreground">Bezeichnung *</span>
                <input
                  name="title"
                  required
                  placeholder="z. B. Koch / Fachkraft"
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs text-muted-foreground">Positionsart</span>
                <select
                  name="position_type"
                  defaultValue="skilled_worker"
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  {POSITION_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-xs text-muted-foreground">Anzahl Plätze *</span>
                <input
                  name="slots_total"
                  type="number"
                  min={1}
                  defaultValue={1}
                  required
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                />
              </label>
              <EmployerJobStartField
                idPrefix="add-jp"
                chooseSpecificStartDate={addStartSpecific}
                setChooseSpecificStartDate={setAddStartSpecific}
                startDateValue={addStartValue}
                setStartDateValue={setAddStartValue}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Speichern"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setAdding(false);
                  setAddStartSpecific(false);
                  setAddStartValue("");
                }}
              >
                Abbrechen
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Empty state */}
      {positions.length === 0 && !adding && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-10 text-muted-foreground">
          <UserPlus className="h-8 w-8" />
          <p className="text-sm">Noch keine Stellen angelegt.</p>
        </div>
      )}

      {/* Add button */}
      {!adding && (
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          onClick={() => {
            setAddStartSpecific(false);
            setAddStartValue("");
            setAdding(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Stelle hinzufügen
        </Button>
      )}

      <Dialog
        open={!!confirmRemoveMatch}
        onOpenChange={(open) => {
          if (!open) {
            if (removingMatchId) return;
            setConfirmRemoveMatch(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Kandidat entfernen?</DialogTitle>
            <DialogDescription>
              {confirmRemoveMatch && (
                <>
                  <span className="font-medium text-foreground">
                    {confirmRemoveMatch.displayName}
                  </span>{" "}
                  wird von dieser Stelle gelöst. Die Zuordnung (Match) wird
                  entfernt; der Kandidat bleibt im System.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmRemoveMatch(null)}
              disabled={removingMatchId !== null}
            >
              Abbrechen
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void executeRemoveMatch()}
              disabled={removingMatchId !== null}
            >
              {removingMatchId !== null ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird entfernt…
                </>
              ) : (
                "Entfernen"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!confirmDeletePosition}
        onOpenChange={(open) => {
          if (!open) {
            if (deletingId) return;
            setConfirmDeletePosition(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Stelle löschen?</DialogTitle>
            <DialogDescription>
              {confirmDeletePosition && (
                <>
                  Die Stelle „
                  <span className="font-medium text-foreground">
                    {confirmDeletePosition.title}
                  </span>
                  “ und alle zugehörigen Zuordnungen werden gelöscht. Diese Aktion
                  kann nicht rückgängig gemacht werden.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmDeletePosition(null)}
              disabled={deletingId !== null}
            >
              Abbrechen
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void executeDeletePosition()}
              disabled={deletingId !== null}
            >
              {deletingId !== null ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird gelöscht…
                </>
              ) : (
                "Löschen"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
