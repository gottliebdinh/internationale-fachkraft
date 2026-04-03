"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Lead {
  id: string;
  industry: string;
  industry_other: string | null;
  seeking_type: string;
  seeking_other: string | null;
  start_date: string | null;
  slots: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  notes: string | null;
  created_at: string;
}

const STATUS_OPTIONS = [
  { value: "new", label: "Neu", color: "bg-blue-100 text-blue-800" },
  { value: "contacted", label: "Kontaktiert", color: "bg-yellow-100 text-yellow-800" },
  { value: "converted", label: "Konvertiert", color: "bg-green-100 text-green-800" },
  { value: "archived", label: "Archiviert", color: "bg-gray-100 text-gray-600" },
];

const INDUSTRY_LABELS: Record<string, string> = {
  hospitality: "Hotellerie / Gastronomie",
  healthcare: "Gesundheitsbranche",
  trade: "Handwerk",
  retail: "Einzelhandel",
  other: "Andere",
  hairdressing: "Friseurhandwerk",
  nursing: "Pflege",
};

const SEEKING_LABELS: Record<string, string> = {
  fachkraft: "Fachkraft",
  auszubildender: "Auszubildende/r",
  other: "Andere",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
        Noch keine Leads vorhanden.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">E-Mail</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Telefon</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Branche</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Sucht</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ab wann</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Anz.</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Datum</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground" />
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <LeadRow
                key={lead.id}
                lead={lead}
                isExpanded={expandedId === lead.id}
                onToggle={() =>
                  setExpandedId((prev) => (prev === lead.id ? null : lead.id))
                }
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LeadRow({
  lead,
  isExpanded,
  onToggle,
}: {
  lead: Lead;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notes, setNotes] = useState(lead.notes ?? "");

  const industryLabel =
    lead.industry === "other" && lead.industry_other
      ? lead.industry_other
      : INDUSTRY_LABELS[lead.industry] ?? lead.industry;

  const seekingLabel =
    lead.seeking_type === "other" && lead.seeking_other
      ? lead.seeking_other
      : SEEKING_LABELS[lead.seeking_type] ?? lead.seeking_type;

  const statusOpt = STATUS_OPTIONS.find((s) => s.value === lead.status) ?? STATUS_OPTIONS[0];

  async function updateField(field: string, value: string) {
    startTransition(async () => {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        toast.error(json.error || "Fehler beim Speichern.");
      } else {
        toast.success("Gespeichert.");
        router.refresh();
      }
    });
  }

  return (
    <>
      <tr className={cn("border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors", isPending && "opacity-60")}>
        <td className="px-4 py-3 font-medium text-foreground">{lead.name}</td>
        <td className="px-4 py-3">
          <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
            {lead.email}
          </a>
        </td>
        <td className="px-4 py-3">
          <a href={`tel:${lead.phone}`} className="hover:underline">
            {lead.phone}
          </a>
        </td>
        <td className="px-4 py-3">{industryLabel}</td>
        <td className="px-4 py-3">{seekingLabel}</td>
        <td className="px-4 py-3">{lead.start_date || "Ab sofort"}</td>
        <td className="px-4 py-3">{lead.slots}</td>
        <td className="px-4 py-3">
          <select
            value={lead.status}
            onChange={(e) => updateField("status", e.target.value)}
            disabled={isPending}
            className={cn(
              "rounded-md px-2 py-1 text-xs font-medium border-0 cursor-pointer",
              statusOpt.color
            )}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </td>
        <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
          {formatDate(lead.created_at)}
        </td>
        <td className="px-4 py-3">
          <button
            type="button"
            onClick={onToggle}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={isExpanded ? "Notizen schließen" : "Notizen öffnen"}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </td>
      </tr>
      {isExpanded && (
        <tr className="border-b border-border last:border-b-0 bg-muted/10">
          <td colSpan={10} className="px-4 py-4">
            <div className="max-w-xl space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Notizen
              </label>
              <textarea
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                rows={3}
                placeholder="Interne Notizen zu diesem Lead …"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <button
                type="button"
                onClick={() => updateField("notes", notes)}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                Notiz speichern
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
