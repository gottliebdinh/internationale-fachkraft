"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, FolderOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useCandidateImportStore } from "@/lib/stores/candidate-import-store";

export function CandidateImportDialog() {
  const [open, setOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const startImport = useCandidateImportStore((s) => s.startImport);
  const phase = useCandidateImportStore((s) => s.phase);

  const launch = useCallback(
    (files: File[], folderName: string) => {
      startImport(files, folderName);
      setOpen(false);
    },
    [startImport]
  );

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);

    const items = Array.from(e.dataTransfer.items);
    const collected: File[] = [];
    let folder = "Import";

    for (const item of items) {
      const entry = item.webkitGetAsEntry?.();
      if (entry?.isDirectory) {
        folder = entry.name;
        await readDir(entry as FileSystemDirectoryEntry, collected);
      } else if (entry?.isFile) {
        const file = await getFile(entry as FileSystemFileEntry);
        if (file) collected.push(file);
      }
    }

    if (collected.length > 0) launch(collected, folder);
  }

  function handleFolderSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const list = e.target.files;
    if (!list || list.length === 0) return;
    const arr = Array.from(list);
    const path =
      (arr[0] as File & { webkitRelativePath?: string }).webkitRelativePath ?? "";
    const folder = path.split("/")[0] || "Import";
    launch(arr, folder);
  }

  const busy = phase !== "idle" && phase !== "done" && phase !== "error";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="gap-2"
            disabled={busy}
          />
        }
      >
        <Upload className="h-4 w-4" />
        {busy ? "Import läuft…" : "Kandidat importieren"}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Kandidat importieren</DialogTitle>
          <DialogDescription>
            Ziehen Sie den Bewerber-Ordner hierher oder wählen Sie ihn aus.
          </DialogDescription>
        </DialogHeader>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed py-12 transition-colors",
            dragOver
              ? "border-[oklch(0.38_0.12_255)] bg-[oklch(0.38_0.12_255)]/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/40"
          )}
        >
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-full transition-colors",
              dragOver
                ? "bg-[oklch(0.38_0.12_255)]/10 text-[oklch(0.38_0.12_255)]"
                : "bg-muted text-muted-foreground"
            )}
          >
            <FolderOpen className="h-7 w-7" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Ordner hierher ziehen
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              PDF, JPG, PNG, WebP
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px w-8 bg-border" />
            oder
            <span className="h-px w-8 bg-border" />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => folderInputRef.current?.click()}
          >
            Ordner auswählen
          </Button>
          <input
            ref={folderInputRef}
            type="file"
            className="hidden"
            {...({ webkitdirectory: "", directory: "" } as React.InputHTMLAttributes<HTMLInputElement>)}
            onChange={handleFolderSelect}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function readDir(
  dir: FileSystemDirectoryEntry,
  out: File[]
): Promise<void> {
  return new Promise((resolve) => {
    const reader = dir.createReader();
    const batch = () => {
      reader.readEntries(async (entries) => {
        if (entries.length === 0) { resolve(); return; }
        for (const entry of entries) {
          if (entry.isFile) {
            const f = await getFile(entry as FileSystemFileEntry);
            if (f) out.push(f);
          } else if (entry.isDirectory) {
            await readDir(entry as FileSystemDirectoryEntry, out);
          }
        }
        batch();
      });
    };
    batch();
  });
}

function getFile(entry: FileSystemFileEntry): Promise<File | null> {
  return new Promise((resolve) => {
    entry.file((f) => resolve(f), () => resolve(null));
  });
}
