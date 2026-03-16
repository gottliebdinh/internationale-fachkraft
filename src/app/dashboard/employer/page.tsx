"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Trash2 } from "lucide-react";
import { EMPLOYER_POSITIONS_KEY, type StoredPosition } from "./employer-positions";

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

function savePositions(positions: StoredPosition[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(EMPLOYER_POSITIONS_KEY, JSON.stringify(positions));
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

export default function EmployerDashboardPage() {
  const [positions, setPositions] = useState<StoredPosition[]>([]);
  const [positionToRemove, setPositionToRemove] = useState<StoredPosition | null>(null);

  useEffect(() => {
    setPositions(getPositions());
  }, []);

  function handleRemovePosition() {
    if (!positionToRemove) return;
    const next = positions.filter((p) => p.id !== positionToRemove.id);
    savePositions(next);
    setPositions(next);
    setPositionToRemove(null);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Ihre Kandidaten
        </h2>
        <p className="text-muted-foreground">
          Passende Vorschläge zu Ihrer ausgeschriebenen Stelle
        </p>
      </div>

      {positions.map((pos) => (
        <div key={pos.id} className="space-y-4">
          <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Position
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {pos.title}
              </p>
              {(pos.startDate || pos.slots != null) && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {pos.startDate && <>Ab {pos.startDate}</>}
                  {pos.startDate && pos.slots != null && " · "}
                  {pos.slots != null && <>{pos.slots} Stelle(n)</>}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => setPositionToRemove(pos)}
              aria-label={`Position „${pos.title}" entfernen`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {CANDIDATES.map((c) => (
              <Card key={c.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col items-center p-6 text-center">
                    <div className="relative h-20 w-20 overflow-hidden rounded-full bg-muted">
                      <Image
                        src={c.image}
                        alt={c.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <p className="mt-3 font-semibold text-foreground">{c.name}</p>
                    <p className="text-sm text-muted-foreground">{c.age} Jahre</p>
                    <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
                      <Link href={`/dashboard/employer/candidates/${c.id}`}>Profil</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Nach weiteren Personen oder anderen Stellen suchen
        </p>
        <Button asChild className="gap-2 bg-[oklch(0.38_0.12_255)] text-white hover:bg-[oklch(0.30_0.11_255)]">
          <Link href="/dashboard/employer/find-more">
            <Search className="h-4 w-4" />
            Weitere Arbeitskräfte finden
          </Link>
        </Button>
      </div>

      <Dialog open={!!positionToRemove} onOpenChange={(open) => !open && setPositionToRemove(null)}>
        <DialogContent className="sm:max-w-md" showCloseButton={true}>
          <DialogHeader>
            <DialogTitle>Position entfernen?</DialogTitle>
            <DialogDescription>
              {positionToRemove && (
                <>
                  Möchten Sie die Position „<strong>{positionToRemove.title}</strong>“ wirklich entfernen?
                  Die zugehörigen Kandidaten-Vorschläge bleiben für andere Positionen sichtbar.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton={false}>
            <Button variant="outline" onClick={() => setPositionToRemove(null)}>
              Abbrechen
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemovePosition}
            >
              Position entfernen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
