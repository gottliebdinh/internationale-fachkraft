"use client";

import { useRouter } from "next/navigation";
import { Loader2, Sparkles, CheckCircle2, XCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useCandidateImportStore,
  type ImportPhase,
} from "@/lib/stores/candidate-import-store";

const DOC_LABELS: Record<string, string> = {
  reisepass: "Reisepass",
  sprachzertifikat: "Sprachzertifikat",
  lebenslauf: "Lebenslauf",
  zeugnis_abitur: "Abitur-Zeugnis",
  anschreiben: "Anschreiben",
  schulzeugnis: "Schulzeugnis",
  bewerbungsfoto: "Bewerbungsfoto",
  gesundheitszeugnis: "Gesundheitszeugnis",
  bewerbungsmappe: "Bewerbungsmappe",
  unterschrift: "Unterschrift",
  sonstiges: "Sonstiges",
};

export function CandidateImportCard() {
  const phase = useCandidateImportStore((s) => s.phase);
  const files = useCandidateImportStore((s) => s.files);
  const mergedName = useCandidateImportStore((s) => s.mergedName);
  const mergedLevel = useCandidateImportStore((s) => s.mergedLevel);
  const mergedPosition = useCandidateImportStore((s) => s.mergedPosition);
  const candidateId = useCandidateImportStore((s) => s.candidateId);
  const errorMsg = useCandidateImportStore((s) => s.errorMsg);
  const currentFile = useCandidateImportStore((s) => s.currentFile);
  const reset = useCandidateImportStore((s) => s.reset);
  const router = useRouter();

  if (phase === "idle") return null;

  const analyzed = files.filter((f) => f.status === "analyzed" || f.status === "uploading" || f.status === "uploaded").length;
  const total = files.length;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card transition-all",
        phase === "done"
          ? "cursor-pointer ring-1 ring-emerald-500/20 hover:shadow-md"
          : phase === "error"
            ? "ring-1 ring-destructive/20"
            : "ring-1 ring-[oklch(0.38_0.12_255)]/20"
      )}
      onClick={() => {
        if (phase === "done" && candidateId) {
          reset();
          router.push(`/admin/candidates/${candidateId}`);
          router.refresh();
        }
      }}
    >
      {/* Photo area — shimmer / animation */}
      <div className="relative h-[19rem] w-full bg-muted sm:h-[22rem]">
        {phase === "done" ? (
          <DoneVisual name={mergedName} />
        ) : phase === "error" ? (
          <ErrorVisual message={errorMsg} onRetry={reset} />
        ) : (
          <ActiveVisual
            phase={phase}
            currentFile={currentFile}
            analyzed={analyzed}
            total={total}
            files={files}
          />
        )}
      </div>

      {/* Bottom info */}
      <div className="space-y-2.5 px-4 py-3.5">
        <div>
          <p className="text-base font-semibold leading-snug text-foreground">
            {mergedName ?? "Wird importiert…"}
          </p>
          <p className="text-sm text-muted-foreground">
            {phase === "done"
              ? "Import abgeschlossen — Klicken zum Öffnen"
              : phase === "error"
                ? "Import fehlgeschlagen"
                : phaseLabel(phase, analyzed, total)}
          </p>
        </div>
        {(mergedLevel || mergedPosition) && (
          <div className="flex flex-wrap gap-1.5">
            {mergedLevel && (
              <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium">
                Deutsch {mergedLevel}
              </span>
            )}
            {mergedPosition && (
              <span className="inline-flex items-center rounded-full border bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                {mergedPosition}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function phaseLabel(phase: ImportPhase, analyzed: number, total: number): string {
  switch (phase) {
    case "running":
      return `Dokumente analysieren… ${analyzed}/${total}`;
    case "merging":
      return "Profil wird erstellt…";
    case "uploading":
      return "Dateien werden hochgeladen…";
    default:
      return "";
  }
}

function ActiveVisual({
  phase,
  currentFile,
  analyzed,
  total,
  files,
}: {
  phase: ImportPhase;
  currentFile: string | null;
  analyzed: number;
  total: number;
  files: { name: string; status: string; docClass: string | null }[];
}) {
  const progress = total > 0 ? (analyzed / total) * 100 : 0;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
      {/* Pulsating ring */}
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-[oklch(0.38_0.12_255)]/20" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[oklch(0.38_0.12_255)]/10">
          {phase === "merging" ? (
            <Sparkles className="h-7 w-7 text-[oklch(0.38_0.12_255)] animate-pulse" />
          ) : (
            <Loader2 className="h-7 w-7 animate-spin text-[oklch(0.38_0.12_255)]" />
          )}
        </div>
      </div>

      {/* Progress bar */}
      {phase === "running" && (
        <div className="w-full max-w-[200px]">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted-foreground/10">
            <div
              className="h-full rounded-full bg-[oklch(0.38_0.12_255)] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Current activity */}
      <p className="max-w-[220px] truncate text-center text-xs text-muted-foreground">
        {phase === "merging"
          ? "Profil wird zusammengeführt…"
          : phase === "uploading"
            ? "Dateien hochladen…"
            : currentFile
              ? `Analysiere ${currentFile}`
              : "Vorbereitung…"}
      </p>

      {/* Mini file list */}
      <div className="flex max-w-[240px] flex-wrap justify-center gap-1">
        {files.slice(0, 12).map((f, i) => (
          <div
            key={i}
            className={cn(
              "flex h-6 items-center gap-1 rounded-md px-1.5 text-[10px] font-medium transition-all duration-300",
              f.status === "analyzing" && "bg-[oklch(0.38_0.12_255)]/10 text-[oklch(0.38_0.12_255)]",
              (f.status === "analyzed" || f.status === "uploading" || f.status === "uploaded") &&
                "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
              f.status === "error" && "bg-destructive/10 text-destructive",
              f.status === "pending" && "bg-muted text-muted-foreground/50"
            )}
          >
            {f.status === "analyzing" ? (
              <Loader2 className="h-2.5 w-2.5 animate-spin" />
            ) : f.status === "analyzed" || f.status === "uploading" || f.status === "uploaded" ? (
              <CheckCircle2 className="h-2.5 w-2.5" />
            ) : (
              <FileText className="h-2.5 w-2.5" />
            )}
            <span className="max-w-[60px] truncate">
              {f.docClass ? (DOC_LABELS[f.docClass] ?? f.docClass) : f.name.split(".")[0]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DoneVisual({ name }: { name: string | null }) {
  const initials =
    name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "?";

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
        {initials}
      </div>
      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
    </div>
  );
}

function ErrorVisual({
  message,
  onRetry,
}: {
  message: string | null;
  onRetry: () => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <XCircle className="h-8 w-8 text-destructive" />
      </div>
      <p className="max-w-[220px] text-center text-xs text-muted-foreground">
        {message ?? "Unbekannter Fehler"}
      </p>
      <button
        onClick={(e) => { e.stopPropagation(); onRetry(); }}
        className="text-xs font-medium text-primary hover:underline"
      >
        Schließen
      </button>
    </div>
  );
}
