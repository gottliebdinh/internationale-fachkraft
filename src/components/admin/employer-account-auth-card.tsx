"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EmployerAccountAuthStatus } from "@/lib/employer-auth-account-status";

const POLL_MS = 4000;

function statusEqual(a: EmployerAccountAuthStatus, b: EmployerAccountAuthStatus) {
  return (
    a.emailConfirmed === b.emailConfirmed &&
    a.needsPassword === b.needsPassword &&
    a.shortLabel === b.shortLabel &&
    a.lines.length === b.lines.length &&
    a.lines.every(
      (l, i) =>
        l.label === b.lines[i]?.label &&
        l.value === b.lines[i]?.value &&
        l.ok === b.lines[i]?.ok
    )
  );
}

type Props = {
  employerId: string;
  initial: EmployerAccountAuthStatus;
};

export function EmployerAccountAuthCard({ employerId, initial }: Props) {
  const [status, setStatus] = useState<EmployerAccountAuthStatus>(initial);

  useEffect(() => {
    setStatus((prev) => (statusEqual(prev, initial) ? prev : initial));
  }, [initial]);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      if (document.visibilityState !== "visible") return;
      try {
        const res = await fetch(`/api/admin/employers/${employerId}/auth-status`, {
          cache: "no-store",
        });
        if (!res.ok || cancelled) return;
        const next = (await res.json()) as EmployerAccountAuthStatus;
        setStatus((prev) => (statusEqual(prev, next) ? prev : next));
      } catch {
        // ignorieren
      }
    }

    const id = setInterval(poll, POLL_MS);
    document.addEventListener("visibilitychange", poll);
    return () => {
      cancelled = true;
      clearInterval(id);
      document.removeEventListener("visibilitychange", poll);
    };
  }, [employerId]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Arbeitgeber-Konto (Login)</CardTitle>
        <p className="text-sm font-normal text-muted-foreground">
          Status der Registrierung: E-Mail bestätigen und erstes Passwort setzen.
          Wird automatisch aktualisiert.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {status.lines.map((line) => (
            <div
              key={line.label}
              className="flex flex-col gap-0.5 rounded-lg border bg-muted/30 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="text-xs text-muted-foreground">{line.label}</span>
              <span
                className={
                  line.ok
                    ? "text-sm font-medium text-emerald-700 dark:text-emerald-400"
                    : "text-sm font-medium text-amber-800 dark:text-amber-200"
                }
              >
                {line.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
