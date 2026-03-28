"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Save, X } from "lucide-react";
import Link from "next/link";

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

type Employer = {
  id: string;
  company_name: string;
  industry: string;
  industry_other: string | null;
  contact_person: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  plz: string;
  trade_license_number: string | null;
  accommodation_type: string;
  verified: boolean;
};

export function EmployerEditForm({ employer }: { employer: Employer }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [industry, setIndustry] = useState(employer.industry);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = {
      company_name: fd.get("company_name"),
      industry: fd.get("industry"),
      industry_other: fd.get("industry") === "other" ? fd.get("industry_other") : null,
      contact_person: fd.get("contact_person"),
      phone: fd.get("phone"),
      email: fd.get("email"),
      address: fd.get("address"),
      city: fd.get("city"),
      plz: fd.get("plz"),
      trade_license_number: fd.get("trade_license_number") || null,
      accommodation_type: fd.get("accommodation_type"),
      verified: fd.get("verified") === "on",
    };

    try {
      const res = await fetch(`/api/admin/employers/${employer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Fehler beim Speichern");
      }

      router.push(`/admin/employers/${employer.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Firmenname *" name="company_name" defaultValue={employer.company_name} required />

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
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {industry === "other" && (
          <Field
            label="Branche (Freitext) *"
            name="industry_other"
            defaultValue={employer.industry_other ?? ""}
            required
          />
        )}

        <Field label="Kontaktperson *" name="contact_person" defaultValue={employer.contact_person} required />
        <Field label="E-Mail *" name="email" defaultValue={employer.email ?? ""} type="email" required />
        <Field label="Telefon *" name="phone" defaultValue={employer.phone} type="tel" required />
        <Field label="Adresse *" name="address" defaultValue={employer.address} required />
        <Field label="Stadt *" name="city" defaultValue={employer.city} required />
        <Field label="PLZ *" name="plz" defaultValue={employer.plz} required />
        <Field
          label="Gewerbescheinnummer (optional)"
          name="trade_license_number"
          defaultValue={employer.trade_license_number ?? ""}
        />

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Unterkunft *</label>
          <select
            name="accommodation_type"
            required
            defaultValue={employer.accommodation_type}
            className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {ACCOMMODATION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="verified" defaultChecked={employer.verified} className="rounded" />
          Verifiziert
        </label>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" size="sm" className="gap-2" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Speichern
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/admin/employers/${employer.id}`} className="gap-2">
            <X className="h-4 w-4" />
            Abbrechen
          </Link>
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue = "",
  type = "text",
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="space-y-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      />
    </label>
  );
}
