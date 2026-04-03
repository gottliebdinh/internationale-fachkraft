import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { CONTACT_PHONE_TEL } from "@/lib/contact-info";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Für Bewerber – Ihre Karriere in Deutschland",
  description:
    "Sie möchten in Deutschland arbeiten oder eine Ausbildung beginnen? Lotus&Eagle begleitet Sie auf dem gesamten Weg – von der Vorbereitung bis zur Integration.",
};

export default function ForApplicantsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Ihre Karriere in{" "}
              <span className="text-accent">Deutschland</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Sie möchten in Deutschland arbeiten oder eine Ausbildung beginnen?
              Wir begleiten Sie auf dem gesamten Weg – von der sprachlichen
              Vorbereitung über die Vermittlung bis zur Integration vor Ort.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                asChild
                className="h-12 min-h-12 px-8 text-base font-semibold shadow-sm bg-[oklch(0.28_0.06_255)] text-white hover:bg-[oklch(0.22_0.06_255)]"
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2"
                >
                  Kontakt aufnehmen
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
              </Button>
              <a
                href={`https://wa.me/${CONTACT_PHONE_TEL.replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Per WhatsApp schreiben
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Wir melden uns bei Ihnen
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Derzeit nehmen wir Interessenten persönlich auf. Schreiben Sie uns
            eine Nachricht über das Kontaktformular oder per WhatsApp – wir
            informieren Sie über aktuelle Möglichkeiten und begleiten Sie
            individuell.
          </p>
          <Button
            size="lg"
            asChild
            className="h-12 min-h-12 px-8 text-base font-semibold shadow-sm bg-[oklch(0.28_0.06_255)] text-white hover:bg-[oklch(0.22_0.06_255)]"
          >
            <Link href="/contact">Jetzt anfragen</Link>
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section
        className="relative overflow-hidden bg-[oklch(0.16_0.03_260)] py-20 sm:py-24"
        aria-labelledby="cta-heading"
      >
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background:
              "radial-gradient(ellipse 70% 80% at 50% 50%, oklch(0.55 0.12 195 / 0.4), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2
            id="cta-heading"
            className="font-[var(--font-display)] text-2xl font-semibold tracking-tight text-white sm:text-3xl"
          >
            Starten Sie Ihren Weg nach Deutschland
          </h2>
          <p className="mt-3 text-base text-[oklch(0.88_0.01_260)]">
            Wir unterstützen Sie bei jedem Schritt – sprechen Sie uns an.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button
              size="lg"
              asChild
              className="h-12 min-h-12 px-8 text-base font-semibold w-full sm:w-auto bg-[oklch(0.50_0.11_195)] text-white hover:bg-[oklch(0.44_0.11_195)]"
            >
              <Link href="/contact">Kontakt aufnehmen</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
