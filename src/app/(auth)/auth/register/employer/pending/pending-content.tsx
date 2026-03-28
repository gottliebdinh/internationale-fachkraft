"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

export function RegisterEmployerPendingContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email")?.trim() ?? "";

  return (
    <div className="auth-card-enter flex h-full min-h-0 w-full flex-col items-stretch overflow-hidden">
      <div className="flex min-h-0 w-full flex-1 flex-col justify-center py-8">
        <div className="w-full max-w-6xl pl-[28vw] pr-8">
          <Link
            href="/"
            className="mb-6 block text-left rounded-md focus:outline-none focus:ring-2 focus:ring-[oklch(0.38_0.12_255)] focus:ring-offset-2"
          >
            <h1 className="font-[var(--font-display)] text-3xl font-semibold tracking-tight text-foreground">
              Ge<span className="text-[oklch(0.50_0.11_195)]">Vin</span>
            </h1>
          </Link>

          <div className="mb-6 flex items-start gap-3 text-left">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[oklch(0.38_0.12_255)] text-white">
              <Mail className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="font-[var(--font-display)] text-xl font-normal tracking-tight text-foreground sm:text-2xl">
                Fast geschafft
              </h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Wir haben eine E-Mail an{" "}
                {email ? (
                  <span className="font-medium text-foreground">{email}</span>
                ) : (
                  "Ihre Adresse"
                )}{" "}
                gesendet. Öffnen Sie den Link in der E-Mail, um Ihr Passwort zu
                setzen. Danach gelangen Sie ins Dashboard.
              </p>
            </div>
          </div>

          <Button variant="outline" asChild className="mt-4">
            <Link href="/auth/login">Zur Anmeldung</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
