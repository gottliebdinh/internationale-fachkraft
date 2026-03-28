"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

type Props = {
  candidateId: string;
  displayName: string;
};

export function CandidateDeleteSection({ candidateId, displayName }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleClick() {
    const ok = window.confirm(
      `"${displayName}" unwiderruflich löschen? Dokumente, Zuordnungen und gespeicherte Dateien werden entfernt.`
    );
    if (!ok) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/candidates/${candidateId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const text = await res.text();
        window.alert(text || "Löschen fehlgeschlagen");
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex justify-center border-t pt-6">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-destructive"
        disabled={deleting}
        onClick={handleClick}
      >
        {deleting ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Trash2 className="h-3.5 w-3.5" />
        )}
        Kandidat löschen
      </Button>
    </div>
  );
}
