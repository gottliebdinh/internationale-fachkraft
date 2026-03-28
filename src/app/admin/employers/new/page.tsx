"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Loader2, Plus, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmployerJobStartField } from "@/components/admin/employer-job-start-field";
import { todayIsoDate } from "@/lib/format-job-start";

const INDUSTRY_OPTIONS = [
  { value: "hospitality", label: "Gastronomie" },
  { value: "hairdressing", label: "Friseur" },
  { value: "nursing", label: "Pflege" },
  { value: "other", label: "Andere" },
];

const ACCOMMODATION_OPTIONS = [
  { value: "none", label: "Keine" },
  { value: "company_housing", label: "Firmenwohnung" },
  { value: "rental_support", label: "Mietunterstützung" },
];

const POSITION_OPTIONS = [
  { value: "skilled_worker", label: "Fachkraft" },
  { value: "apprenticeship", label: "Auszubildende/r" },
  { value: "seasonal", label: "Saison" },
];

type PositionDraft = {
  key: number;
  title: string;
  position_type: string;
  slots_total: number;
  useSpecificDate: boolean;
  startDateValue: string;
};

let nextKey = 1;

function emptyPosition(): PositionDraft {
  return {
    key: nextKey++,
    title: "",
    position_type: "skilled_worker",
    slots_total: 1,
    useSpecificDate: false,
    startDateValue: "",
  };
}

export default function NewEmployerPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [industry, setIndustry] = useState("hospitality");
  const [positions, setPositions] = useState<PositionDraft[]>([]);

  function addPosition() {
    setPositions((prev) => [...prev, emptyPosition()]);
  }

  function removePosition(key: number) {
    setPositions((prev) => prev.filter((p) => p.key !== key));
  }

  function updatePosition(key: number, patch: Partial<PositionDraft>) {
    setPositions((prev) =>
      prev.map((p) => (p.key === key ? { ...p, ...patch } : p))
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = {
      company_name: fd.get("company_name"),
      industry: fd.get("industry"),
      industry_other: fd.get("industry_other"),
      contact_person: fd.get("contact_person"),
      phone: fd.get("phone"),
      email: fd.get("email"),
      address: fd.get("address"),
      city: fd.get("city"),
      plz: fd.get("plz"),
      trade_license_number: fd.get("trade_license_number") || null,
      accommodation_type: fd.get("accommodation_type"),
    };

    const validPositions = positions
      .filter((p) => p.title.trim().length >= 2)
      .map((p) => ({
        title: p.title.trim(),
        position_type: p.position_type,
        slots_total: Math.max(1, p.slots_total),
        start_date: p.useSpecificDate && p.startDateValue ? p.startDateValue : todayIsoDate(),
      }));

    if (validPositions.length > 0) {
      payload.initial_positions = validPositions;
    }

    try {
      const res = await fetch("/api/admin/employers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Fehler beim Speichern");
      }

      const { id } = await res.json();
      router.push(`/admin/employers/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/employers" className="gap-2 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          Zurück
        </Link>
      </Button>

      <div className="flex items-center gap-3">
        <Building2 className="h-6 w-6 text-muted-foreground" />
        <h1 className="text-2xl font-bold tracking-tight">
          Neues Unternehmen
        </h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-sm">Unternehmensdaten</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Firmenname *" name="company_name" required />

              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Branche *</label>
                <select
                  name="industry"
                  required
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  {INDUSTRY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {industry === "other" && (
                <Field
                  label="Branche (Freitext) *"
                  name="industry_other"
                  required
                />
              )}

              <Field label="Kontaktperson *" name="contact_person" required />
              <Field label="Telefon *" name="phone" type="tel" required />
              <Field label="E-Mail *" name="email" type="email" required autoComplete="email" />
              <Field label="Adresse *" name="address" required />
              <Field label="Stadt *" name="city" required />
              <Field label="PLZ *" name="plz" required />
              <Field
                label="Gewerbescheinnummer (optional)"
                name="trade_license_number"
              />

              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Unterkunft *</label>
                <select
                  name="accommodation_type"
                  required
                  defaultValue="none"
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  {ACCOMMODATION_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-sm">Stellen (optional)</CardTitle>
            <p className="text-xs text-muted-foreground">
              Stellen können Sie jetzt oder auch später ergänzen — nicht nötig zum Anlegen.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {positions.map((pos, idx) => (
              <div
                key={pos.key}
                className="relative overflow-hidden rounded-xl border bg-muted/10 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">
                    Stelle {idx + 1}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => removePosition(pos.key)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1">
                    <span className="text-xs text-muted-foreground">Bezeichnung</span>
                    <input
                      value={pos.title}
                      onChange={(e) => updatePosition(pos.key, { title: e.target.value })}
                      placeholder="z. B. Koch / Fachkraft"
                      className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs text-muted-foreground">Positionsart</span>
                    <select
                      value={pos.position_type}
                      onChange={(e) => updatePosition(pos.key, { position_type: e.target.value })}
                      className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                    >
                      {POSITION_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs text-muted-foreground">Anzahl Plätze</span>
                    <input
                      type="number"
                      min={1}
                      value={pos.slots_total}
                      onChange={(e) => updatePosition(pos.key, { slots_total: Number(e.target.value) || 1 })}
                      className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                    />
                  </label>
                  <EmployerJobStartField
                    idPrefix={`new-pos-${pos.key}`}
                    chooseSpecificStartDate={pos.useSpecificDate}
                    setChooseSpecificStartDate={(v) => updatePosition(pos.key, { useSpecificDate: v })}
                    startDateValue={pos.startDateValue}
                    setStartDateValue={(v) => updatePosition(pos.key, { startDateValue: v })}
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              onClick={addPosition}
            >
              <Plus className="h-4 w-4" />
              Stelle hinzufügen
            </Button>
          </CardContent>
        </Card>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <div className="flex justify-end">
          <Button type="submit" size="sm" className="gap-2" disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Unternehmen anlegen
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  autoComplete?: string;
}) {
  return (
    <label className="space-y-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        min={type === "number" ? 1 : undefined}
        className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      />
    </label>
  );
}
