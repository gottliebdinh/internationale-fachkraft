"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

type Props = {
  employerId: string;
  companyName: string;
};

export function EmployerDeleteSection({ employerId, companyName }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleClick() {
    const ok = window.confirm(
      `"${companyName}" unwiderruflich löschen? Das Login dieses Arbeitgebers, alle Stellen, Matches und zugehörigen Daten werden entfernt.`
    );
    if (!ok) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/employers/${employerId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const text = await res.text();
        window.alert(text || "Löschen fehlgeschlagen");
        return;
      }
      router.push("/admin/employers");
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
        Unternehmen löschen
      </Button>
    </div>
  );
}
