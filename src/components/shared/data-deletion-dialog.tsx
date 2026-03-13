"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, AlertTriangle } from "lucide-react";

async function requestDataDeletion() {
  const res = await fetch("/api/account/delete", { method: "POST" });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? "Löschanfrage fehlgeschlagen");
  }
}

interface DataDeletionDialogProps {
  trigger?: React.ReactNode;
}

export function DataDeletionDialog({ trigger }: DataDeletionDialogProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      await requestDataDeletion();
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setConfirmed(false);
      setError(null);
      setSuccess(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant="destructive">
            <Trash2 data-icon="inline-start" />
            Konto &amp; Daten löschen
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        {success ? (
          <>
            <DialogHeader>
              <DialogTitle>Anfrage eingegangen</DialogTitle>
              <DialogDescription>
                Ihre Löschanfrage wurde erfolgreich übermittelt. Sie erhalten
                eine Bestätigung per E-Mail, sobald Ihre Daten gelöscht wurden.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Schließen
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Konto und Daten löschen</DialogTitle>
              <DialogDescription>
                Gemäß Art.&nbsp;17 DSGVO haben Sie das Recht auf Löschung Ihrer
                personenbezogenen Daten.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
              <div className="text-sm text-destructive">
                <p className="font-medium">
                  Diese Aktion kann nicht rückgängig gemacht werden.
                </p>
                <p className="mt-1 text-destructive/80">
                  Alle Ihre Kontodaten, hochgeladenen Dokumente und
                  Match-Historien werden unwiderruflich gelöscht.
                </p>
              </div>
            </div>

            <Label className="cursor-pointer gap-3">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="size-4 rounded border-input accent-destructive"
              />
              <span className="text-sm">
                Ich verstehe, dass alle meine Daten unwiderruflich gelöscht
                werden und diese Aktion nicht rückgängig gemacht werden kann.
              </span>
            </Label>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Abbrechen
              </Button>
              <Button
                variant="destructive"
                disabled={!confirmed || loading}
                onClick={handleSubmit}
              >
                {loading ? "Wird verarbeitet…" : "Endgültig löschen"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
