"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Camera, ClipboardPaste, Loader2, Upload } from "lucide-react";

type Props = {
  candidateId: string;
};

export function ProfilePhotoEditor({ candidateId }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function uploadFile(file: File) {
    setIsUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/admin/candidates/${candidateId}/photo`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Upload fehlgeschlagen");
      }

      setMessage("Profilbild aktualisiert.");
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload fehlgeschlagen");
    } finally {
      setIsUploading(false);
    }
  }

  function onPickFile() {
    fileInputRef.current?.click();
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
    e.currentTarget.value = "";
  }

  async function onPaste(e: React.ClipboardEvent<HTMLDivElement>) {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items)) {
      if (!item.type.startsWith("image/")) continue;
      const blob = item.getAsFile();
      if (!blob) continue;
      e.preventDefault();

      const file = new File([blob], `clipboard-${Date.now()}.png`, {
        type: blob.type || "image/png",
      });
      await uploadFile(file);
      return;
    }
  }

  return (
    <div className="space-y-2 rounded-lg border border-dashed p-3">
      <p className="text-xs text-muted-foreground">
        Profilbild bearbeiten: Datei hochladen oder Screenshot aus der
        Zwischenablage einfügen (Ctrl/Cmd + V).
      </p>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={onPickFile}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Datei wählen
        </Button>

        <div
          tabIndex={0}
          onPaste={onPaste}
          className="inline-flex h-9 items-center rounded-md border border-input bg-background px-3 text-sm text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <ClipboardPaste className="mr-1.5 h-4 w-4" />
          Hier klicken, dann einfügen
        </div>

        <div className="inline-flex h-9 items-center rounded-md border border-input bg-muted/40 px-3 text-xs text-muted-foreground">
          <Camera className="mr-1.5 h-3.5 w-3.5" />
          PNG/JPG/WebP
        </div>
      </div>

      {message && <p className="text-xs text-muted-foreground">{message}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
}

