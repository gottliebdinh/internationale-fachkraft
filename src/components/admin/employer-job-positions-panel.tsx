"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmployerJobStartField } from "@/components/admin/employer-job-start-field";
import { formatJobStartLine, isJobStartAsap, todayIsoDate } from "@/lib/format-job-start";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";

export type JobPositionRow = {
  id: string;
  title: string;
  position_type: string;
  slots_total: number;
  start_date: string;
  matches_count: number;
};

const POSITION_OPTIONS = [
  { value: "apprenticeship", label: "Auszubildende/r" },
  { value: "skilled_worker", label: "Fachkraft" },
  { value: "seasonal", label: "Saison" },
];

type Props = {
  employerId: string;
  positions: JobPositionRow[];
};

export function EmployerJobPositionsPanel({ employerId, positions }: Props) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [chooseSpecificStartDate, setChooseSpecificStartDate] = useState(false);
  const [startDateValue, setStartDateValue] = useState("");
  const [chooseSpecificStartDateEdit, setChooseSpecificStartDateEdit] =
    useState(false);
  const [startDateValueEdit, setStartDateValueEdit] = useState("");

  useEffect(() => {
    if (!editingId) return;
    const p = positions.find((x) => x.id === editingId);
    if (p) {
      const specific = !isJobStartAsap(p.start_date);
      setChooseSpecificStartDateEdit(specific);
      setStartDateValueEdit(specific ? p.start_date.slice(0, 10) : "");
    }
  }, [editingId, positions]);

  async function createPosition(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const start_date =
      chooseSpecificStartDate && startDateValue
        ? startDateValue
        : todayIsoDate();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/employers/${employerId}/job-positions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: fd.get("title"),
          position_type: fd.get("position_type"),
          slots_total: fd.get("slots_total"),
          start_date,
        }),
      });
      if (!res.ok) {
        window.alert(await res.text());
        return;
      }
      setAdding(false);
      setChooseSpecificStartDate(false);
      setStartDateValue("");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function updatePosition(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingId) return;
    const fd = new FormData(e.currentTarget);
    const start_date =
      chooseSpecificStartDateEdit && startDateValueEdit
        ? startDateValueEdit
        : todayIsoDate();
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
            start_date,
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

  async function deletePosition(id: string, title: string) {
    const ok = window.confirm(`Stelle „${title}“ wirklich löschen?`);
    if (!ok) return;
    setDeletingId(id);
    try {
      const res = await fetch(
        `/api/admin/employers/${employerId}/job-positions/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        window.alert(await res.text());
        return;
      }
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Pro Stelle: Bezeichnung, Positionsart, Anzahl Plätze und Start — standardmäßig
          „Ab sofort“ (wie bei der Registrierung), optional ein festes Datum.
        </p>
        {!adding && !editingId && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => {
              setChooseSpecificStartDate(false);
              setStartDateValue("");
              setAdding(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Stelle hinzufügen
          </Button>
        )}
      </div>

      {adding && (
        <form
          onSubmit={createPosition}
          className="rounded-lg border border-dashed bg-muted/20 p-4 space-y-3"
        >
          <p className="text-sm font-medium">Neue Stelle</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 sm:col-start-1 sm:row-start-1">
              <span className="text-xs text-muted-foreground">Bezeichnung *</span>
              <input
                name="title"
                required
                placeholder="z. B. Koch / Fachkraft"
                className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              />
            </label>
            <label className="space-y-1 sm:col-start-2 sm:row-start-1">
              <span className="text-xs text-muted-foreground">Positionsart</span>
              <select
                name="position_type"
                defaultValue="skilled_worker"
                className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                {POSITION_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 sm:col-start-1 sm:row-start-2">
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
            <div className="sm:col-start-2 sm:row-start-2">
              <EmployerJobStartField
                idPrefix="admin-jp-add"
                chooseSpecificStartDate={chooseSpecificStartDate}
                setChooseSpecificStartDate={setChooseSpecificStartDate}
                startDateValue={startDateValue}
                setStartDateValue={setStartDateValue}
              />
            </div>
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
              setChooseSpecificStartDate(false);
              setStartDateValue("");
            }}
            >
              Abbrechen
            </Button>
          </div>
        </form>
      )}

      {positions.length === 0 && !adding ? (
        <p className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
          Noch keine Stellen angelegt. Bitte mindestens eine Stelle mit Plätzen anlegen
          (Start standardmäßig „Ab sofort“).
        </p>
      ) : (
        <div className="divide-y rounded-lg border">
          {positions.map((p) => {
            const posLabel =
              POSITION_OPTIONS.find((o) => o.value === p.position_type)?.label ??
              p.position_type;
            const full = p.matches_count >= p.slots_total && p.slots_total > 0;

            if (editingId === p.id) {
              return (
                <form
                  key={p.id}
                  onSubmit={updatePosition}
                  className="space-y-3 bg-muted/10 p-4"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-1 sm:col-start-1 sm:row-start-1">
                      <span className="text-xs text-muted-foreground">Bezeichnung *</span>
                      <input
                        name="title"
                        required
                        defaultValue={p.title}
                        className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                      />
                    </label>
                    <label className="space-y-1 sm:col-start-2 sm:row-start-1">
                      <span className="text-xs text-muted-foreground">Positionsart</span>
                      <select
                        name="position_type"
                        defaultValue={p.position_type}
                        className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                      >
                        {POSITION_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="space-y-1 sm:col-start-1 sm:row-start-2">
                      <span className="text-xs text-muted-foreground">Anzahl Plätze *</span>
                      <input
                        name="slots_total"
                        type="number"
                        min={1}
                        defaultValue={p.slots_total}
                        required
                        className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                      />
                    </label>
                    <div className="sm:col-start-2 sm:row-start-2">
                      <EmployerJobStartField
                        idPrefix={`admin-jp-edit-${p.id}`}
                        chooseSpecificStartDate={chooseSpecificStartDateEdit}
                        setChooseSpecificStartDate={setChooseSpecificStartDateEdit}
                        startDateValue={startDateValueEdit}
                        setStartDateValue={setStartDateValueEdit}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" disabled={saving}>
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Speichern"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingId(null)}
                    >
                      Abbrechen
                    </Button>
                  </div>
                </form>
              );
            }

            return (
              <div
                key={p.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="font-medium leading-snug">{p.title}</p>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className="text-xs font-normal">
                      {posLabel}
                    </Badge>
                    <span>{formatJobStartLine(p.start_date)}</span>
                    <Badge
                      variant="secondary"
                      className={
                        full
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                          : ""
                      }
                    >
                      {p.matches_count}/{p.slots_total} besetzt
                    </Badge>
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={!!editingId || adding}
                    onClick={() => setEditingId(p.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    disabled={deletingId === p.id || !!editingId || adding}
                    onClick={() => deletePosition(p.id, p.title)}
                  >
                    {deletingId === p.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
