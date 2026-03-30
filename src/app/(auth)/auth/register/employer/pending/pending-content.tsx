"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function RegisterEmployerPendingContent() {
  return (
    <div className="auth-register-reveal-scope auth-card-enter flex min-h-0 flex-1 w-full flex-col items-center justify-center px-6 py-8 text-center">
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        <span className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-[oklch(0.50_0.11_195)] text-white shadow-md">
          <CheckCircle2 className="h-9 w-9" aria-hidden />
        </span>
        <h1 className="font-[var(--font-display)] text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Vielen Dank für Ihr Interesse.
        </h1>
        <p className="mt-6 text-xl font-normal leading-relaxed text-muted-foreground sm:text-2xl md:text-2xl">
          Wir werden uns schnellstmöglich mit Ihnen in Verbindung setzen.
        </p>
        <Button
          asChild
          className="mt-12 h-12 min-h-12 px-8 text-base font-semibold shadow-sm bg-[oklch(0.38_0.12_255)] text-white transition-colors hover:bg-[oklch(0.30_0.11_255)] hover:scale-[1.01] active:scale-[0.99]"
        >
          <Link href="/">Zur Startseite</Link>
        </Button>
      </div>
    </div>
  );
}
