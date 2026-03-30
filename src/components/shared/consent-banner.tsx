"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

const CONSENT_KEY = "lotus-eagle-cookie-consent";

type ConsentValue = "all" | "essential" | null;

export function ConsentBanner() {
  const [consent, setConsent] = useState<ConsentValue>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(timer);
    }
    setConsent(stored as ConsentValue);
  }, []);

  function accept(value: "all" | "essential") {
    localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
    setVisible(false);
  }

  if (consent || !visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 animate-in slide-in-from-bottom duration-300">
      <Card className="mx-auto max-w-2xl shadow-lg">
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
            <p className="text-sm text-muted-foreground">
              Wir verwenden Cookies, um die Funktionalität der Plattform
              sicherzustellen und Ihr Nutzungserlebnis zu verbessern. Weitere
              Informationen finden Sie in unserer{" "}
              <a
                href="/legal/privacy"
                className="underline underline-offset-2 hover:text-foreground"
              >
                Datenschutzerklärung
              </a>
              .
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" onClick={() => accept("essential")}>
              Nur notwendige
            </Button>
            <Button onClick={() => accept("all")}>Alle akzeptieren</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
