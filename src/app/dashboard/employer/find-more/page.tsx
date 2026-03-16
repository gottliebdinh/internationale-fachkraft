"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { EMPLOYER_POSITIONS_KEY, type StoredPosition } from "../employer-positions";

const POSITION_OPTIONS = [
  { value: "chef", label: "Koch / Köchin" },
  { value: "service", label: "Servicekraft" },
  { value: "hotel", label: "Hotelfachkraft" },
  { value: "trainee_h", label: "Auszubildende/r" },
  { value: "hairdresser", label: "Friseur/in" },
  { value: "salon", label: "Salon-Assistent/in" },
  { value: "nurse", label: "Pflegefachkraft" },
  { value: "assistant", label: "Pflegehelfer/in" },
  { value: "trainee_n", label: "Auszubildende/r Pflege" },
  { value: "specialist", label: "Fachkraft" },
  { value: "trainee", label: "Auszubildende/r" },
];

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

function getInitialPositions(): StoredPosition[] {
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
  return [];
}

function savePositions(positions: StoredPosition[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(EMPLOYER_POSITIONS_KEY, JSON.stringify(positions));
}

export default function FindMorePage() {
  const router = useRouter();
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [customText, setCustomText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [slots, setSlots] = useState<string>("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const title = customText.trim() || (POSITION_OPTIONS.find((o) => o.value === selectedPositions[0])?.label ?? selectedPositions[0] ?? "Neue Stelle");
    const positions = getInitialPositions();
    const newPosition: StoredPosition = {
      id: `pos-${Date.now()}`,
      title,
      startDate: startDate || undefined,
      slots: slots ? parseInt(slots, 10) : undefined,
    };
    savePositions([...positions, newPosition]);
    router.replace("/dashboard/employer");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/employer" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Weitere Arbeitskräfte finden
        </h1>
        <p className="mt-1 text-muted-foreground">
          Nach was suchen Sie und wie viele Stellen? Die Position wird darunter auf dem Dashboard hinzugefügt.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <Label className="text-base font-medium">Nach welchen Arbeitskräften suchen Sie?</Label>
          <p className="text-sm text-muted-foreground">
            Sie können mehrere auswählen. Zusätzlich können Sie eigene Begriffe eingeben.
          </p>
          <div className="space-y-2">
            {POSITION_OPTIONS.map((opt) => {
              const checked = selectedPositions.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors",
                    checked ? "border-2 border-[oklch(0.38_0.12_255)] bg-[oklch(0.38_0.12_255/0.08)]" : "border-border bg-muted/30 hover:border-muted-foreground/40"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      setSelectedPositions((prev) =>
                        prev.includes(opt.value) ? prev.filter((x) => x !== opt.value) : [...prev, opt.value]
                      );
                    }}
                    className="h-4 w-4 rounded border-input"
                  />
                  <span className="text-sm font-medium">{opt.label}</span>
                </label>
              );
            })}
          </div>
          <div>
            <Label htmlFor="customPosition" className="text-sm text-foreground">
              Nach Wörtern suchen / selbst eingeben (z. B. Küchenhilfe, Teilzeit)
            </Label>
            <Input
              id="customPosition"
              className="mt-2 h-11"
              placeholder="Eingabe passend zu Ihrer Branche …"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label htmlFor="startDate" className="text-base font-medium">
            Ab wann wird die Stelle benötigt?
          </Label>
          <Input
            id="startDate"
            type="date"
            className="h-12"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <div>
            <Label htmlFor="slots" className="text-base font-medium">
              Wie viele Stellen suchen Sie voraussichtlich?
            </Label>
            <Input
              id="slots"
              type="number"
              min={1}
              placeholder="z. B. 2"
              className="mt-2 h-12"
              value={slots}
              onChange={(e) => setSlots(e.target.value)}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full gap-2 bg-[oklch(0.38_0.12_255)] text-white hover:bg-[oklch(0.30_0.11_255)] sm:w-auto"
        >
          Position hinzufügen
        </Button>
      </form>
    </div>
  );
}
