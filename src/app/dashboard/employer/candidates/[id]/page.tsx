"use client";

import { use as reactUse } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowLeft, FileText, Play, FileCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const STATUS_STEPS = [
  { key: "vorgeschlagen", label: "Vorgeschlagen" },
  { key: "kontakt", label: "Kontakt aufgenommen" },
  { key: "interview", label: "Interview geplant" },
  { key: "vertrag", label: "Vertrag in Vorbereitung" },
  { key: "abgeschlossen", label: "Abgeschlossen" },
];

const CANDIDATES_DATA: Record<
  string,
  {
    name: string;
    age: number;
    role: string;
    cv: string;
    image: string;
    currentStepIndex: number;
    papiere: { name: string; status: string }[];
  }
> = {
  "1": {
    name: "Mai Nguyen",
    image: "/profilbilder/mai.png",
    age: 24,
    role: "Koch / Köchin",
    cv: "Ausbildung Hotelfach, 2 Jahre Erfahrung in Restaurant. B2 Deutsch.",
    currentStepIndex: 1,
    papiere: [
      { name: "Lebenslauf", status: "Vorhanden" },
      { name: "Sprachzertifikat B2", status: "Vorhanden" },
      { name: "Ausbildungsnachweis", status: "Vorhanden" },
    ],
  },
  "2": {
    name: "Linh Tran",
    image: "/profilbilder/linh.png",
    age: 22,
    role: "Servicekraft",
    cv: "Berufserfahrung in Gastronomie, B1 Deutsch. Motiviert für Ausbildung.",
    currentStepIndex: 0,
    papiere: [
      { name: "Lebenslauf", status: "Vorhanden" },
      { name: "Sprachzertifikat B1", status: "Vorhanden" },
    ],
  },
  "3": {
    name: "Hoang Le",
    image: "/profilbilder/hoang.png",
    age: 26,
    role: "Koch / Köchin",
    cv: "Koch-Ausbildung Vietnam, 3 Jahre Küche. B2 Deutsch.",
    currentStepIndex: 2,
    papiere: [
      { name: "Lebenslauf", status: "Vorhanden" },
      { name: "Sprachzertifikat B2", status: "Vorhanden" },
      { name: "Berufsabschluss", status: "Vorhanden" },
    ],
  },
};

export default function CandidateDetailPage() {
  const params = reactUse(
    Promise.resolve(useParams())
  ) as { id?: string | string[] | undefined };
  const id = typeof params.id === "string" ? params.id : null;
  const candidate = id ? CANDIDATES_DATA[id] : null;

  if (!candidate) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/employer">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück
          </Link>
        </Button>
        <p className="text-muted-foreground">Kandidat nicht gefunden.</p>
      </div>
    );
  }

  const currentStep = candidate.currentStepIndex;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header: Zurück + Kandidat */}
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-0">
        <Button variant="ghost" size="icon" className="shrink-0" asChild>
          <Link href="/dashboard/employer" aria-label="Zurück">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-muted">
            <Image
              src={candidate.image}
              alt={candidate.name}
              fill
              className="object-cover"
              sizes="36px"
            />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight">
              {candidate.name}
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              {candidate.age} Jahre · {candidate.role}
            </p>
          </div>
        </div>
      </header>

      <div className="space-y-8 pt-6">
      {/* Status: mehrere Steps zum Nachverfolgen */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status – Nachverfolgung</CardTitle>
          <p className="text-sm text-muted-foreground">
            Aktueller Schritt: {STATUS_STEPS[currentStep].label}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-0">
            {STATUS_STEPS.map((step, index) => {
              const isDone = index < currentStep;
              const isCurrent = index === currentStep;
              const isLast = index === STATUS_STEPS.length - 1;
              return (
                <div
                  key={step.key}
                  className={cn("flex flex-1 flex-col items-center", !isLast && "flex-1")}
                >
                  <div className="flex w-full items-center">
                    <div
                      className={cn(
                        "z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium",
                        isDone && "border-[oklch(0.38_0.12_255)] bg-[oklch(0.38_0.12_255)] text-white",
                        isCurrent && "border-[oklch(0.38_0.12_255)] bg-[oklch(0.38_0.12_255/0.2)] text-[oklch(0.38_0.12_255)]",
                        !isDone && !isCurrent && "border-muted-foreground/30 bg-muted/50 text-muted-foreground"
                      )}
                    >
                      {isDone ? <Check className="h-4 w-4" /> : index + 1}
                    </div>
                    {!isLast && (
                      <div
                        className={cn(
                          "h-0.5 flex-1",
                          isDone ? "bg-[oklch(0.38_0.12_255)]" : "bg-muted"
                        )}
                      />
                    )}
                  </div>
                  <span
                    className={cn(
                      "mt-2 text-center text-xs font-medium sm:text-sm",
                      isCurrent && "text-foreground",
                      isDone && "text-muted-foreground",
                      !isDone && !isCurrent && "text-muted-foreground/80"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Lebenslauf */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            Lebenslauf
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{candidate.cv}</p>
        </CardContent>
      </Card>

      {/* Video-Vorstellung */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Play className="h-4 w-4" />
            Video-Vorstellung
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex aspect-video items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Play className="h-12 w-12" />
          </div>
        </CardContent>
      </Card>

      {/* Papiere / Dokumente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileCheck className="h-4 w-4" />
            Papiere & Dokumente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {candidate.papiere.map((doc) => (
              <li
                key={doc.name}
                className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2 text-sm"
              >
                <span className="font-medium text-foreground">{doc.name}</span>
                <span className="text-xs text-muted-foreground">{doc.status}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
