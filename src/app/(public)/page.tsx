import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Scale,
  Users,
  Building2,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://gevin.de";

export const metadata: Metadata = {
  title: "GeVin – Internationale Fachkräfte für Deutschland",
  description:
    "Die professionelle Plattform für die Vermittlung vietnamesischer Fachkräfte und Auszubildender an deutsche Unternehmen. IHK-konform, DSGVO-sicher. Hotellerie, Friseurhandwerk, Pflege.",
  openGraph: {
    title: "GeVin – Internationale Fachkräfte für Deutschland",
    description:
      "IHK-konforme Vermittlung vietnamesischer Fachkräfte. Hotellerie, Friseurhandwerk, Pflege.",
    url: siteUrl,
  },
  alternates: {
    canonical: siteUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "GeVin",
      url: siteUrl,
      description:
        "Plattform für die Vermittlung vietnamesischer Fachkräfte und Auszubildender an deutsche Unternehmen. IHK-konform, DSGVO-sicher.",
      areaServed: [{ "@type": "Country", name: "Deutschland" }, { "@type": "Country", name: "Vietnam" }],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "GeVin – Fachkräfte für Deutschland",
      description:
        "IHK-konforme Vermittlung vietnamesischer Fachkräfte in Hotellerie, Friseurhandwerk und Pflege.",
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "de-DE",
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main
        className="font-[var(--font-body)]"
        id="main-content"
        aria-label="Startseite GeVin – Internationale Fachkräfte für Deutschland"
      >
      {/* Hero: links Textbox mit Hintergrund, rechts Bild über volle Höhe */}
      <section
        className="relative overflow-hidden bg-[oklch(0.98_0.008_260)] lg:min-h-screen"
        aria-labelledby="hero-heading"
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] lg:min-h-[calc(100vh-11rem)]">
            {/* Linke Spalte: nur Internationale Fachkräfte für Deutschland */}
            <div className="flex min-h-0 flex-col justify-center rounded-r-lg bg-[oklch(0.98_0.008_260)] py-10 sm:py-12 lg:py-14">
            <h1
              id="hero-heading"
              className="home-reveal home-reveal-delay-2 mt-0 font-[var(--font-display)] text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Internationale Fachkräfte
              <br />
              <span className="text-[oklch(0.50_0.11_195)]">für Deutschland</span>
            </h1>
            <p className="home-reveal home-reveal-delay-3 mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Rechtssicher Fachkräfte und Auszubildende finden – IHK-konform,
              von der Anerkennung bis zur Platzierung. Hotellerie, Friseurhandwerk, Pflege.
            </p>
            <p className="home-reveal home-reveal-delay-3 mt-2 text-sm text-muted-foreground">
              Kostenlos registrieren, unverbindlich Kandidaten entdecken.
            </p>
            <div className="home-reveal home-reveal-delay-4 mt-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Button
                size="lg"
                asChild
                className="h-12 min-h-12 px-8 text-base font-semibold shadow-sm bg-[oklch(0.28_0.06_255)] text-white hover:bg-[oklch(0.22_0.06_255)]"
              >
                <Link href="/auth/register/employer" className="inline-flex items-center justify-center gap-2">
                  Kandidaten finden
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
              </Button>
              <Link
                href="/how-it-works"
                className="text-sm font-medium text-muted-foreground hover:text-foreground underline underline-offset-2 sm:no-underline sm:hover:underline"
              >
                So funktioniert’s</Link>
            </div>
          </div>
            {/* Rechte Spalte: Bild nutzt gesamte Höhe und Breite */}
            <div className="relative min-h-[320px] overflow-hidden lg:min-h-0 lg:h-full">
              <Image
                src="/bilder/home2verticaladjust.png"
                alt=""
                fill
                className="object-cover object-center"
                priority
                sizes="50vw"
              />
            </div>
          </div>
          </div>
        </div>

        {/* IHK + Zusammenarbeit mit – unter Bild und Hero-Text */}
        <div
          id="trust-heading"
          className="home-reveal home-reveal-delay-4 border-t border-border bg-[oklch(0.98_0.008_260)] px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <p className="font-[var(--font-display)] text-lg font-semibold text-foreground sm:text-xl">
                IHK-konforme Prozesse &{" "}
                <span className="text-[oklch(0.50_0.11_195)]">DSGVO-sichere Plattform</span>
              </p>
              <p className="mt-1 max-w-lg text-sm text-muted-foreground">
                Rechtssicher von der Anerkennung bis zur Platzierung.
              </p>
            </div>
            <div className="flex flex-col gap-2 text-right sm:shrink-0 sm:items-end">
              <span className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Zusammenarbeit mit
              </span>
              <div className="flex items-center justify-end gap-5">
                <Image
                  src="/Bundesagentur_für_Arbeit/Bundesagentur_für_Arbeit_idefzv9ho6_2.svg"
                  alt="Bundesagentur für Arbeit"
                  width={120}
                  height={32}
                  className="h-7 w-auto opacity-90"
                />
                <Image
                  src="/ihk/id0U3VE7ma_1773417223568.png"
                  alt="IHK"
                  width={140}
                  height={32}
                  className="h-7 w-auto opacity-90"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust: drei Karten – gleiche helle Optik, klare Kartenhierarchie */}
      <section className="border-t border-border bg-[oklch(0.98_0.008_260)] py-16 sm:py-20" aria-labelledby="trust-cards-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 id="trust-cards-heading" className="sr-only">
            Unsere Standards im Detail
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: FileCheck,
                title: "IHK-konformer Prozess",
                desc: "Automatisierte Erstellung aller IHK-Dokumente – vom Berufsausbildungsvertrag bis zur Erklärung zum Beschäftigungsverhältnis.",
              },
              {
                icon: ShieldCheck,
                title: "DSGVO-zertifiziert",
                desc: "Verschlüsselte Dokumentenspeicherung, Audit-Logs und fein granulierte Zugriffskontrollen.",
              },
              {
                icon: Scale,
                title: "Fachkräfteeinwanderungsgesetz",
                desc: "Vollständige Abdeckung des FEG-Workflows – von der Anerkennung bis zum Visumsantrag.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="home-card-hover rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <item.icon className="mb-4 h-9 w-9 text-[oklch(0.50_0.11_195)]" />
                <h3 className="font-[var(--font-display)] text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats: Social Proof – kompakt, einheitliche Schriftgrößen-Hierarchie */}
      <section
        className="border-y border-border bg-[oklch(0.97_0.008_260)]"
        aria-labelledby="stats-heading"
      >
        <h2 id="stats-heading" className="sr-only">
          GeVin in Zahlen
        </h2>
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <p className="mb-8 text-center text-sm font-medium text-muted-foreground">
            Über 85 deutsche Unternehmen und 15 Partnerschulen vertrauen bereits auf GeVin.
          </p>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              { value: "120+", label: "Erfolgreiche Platzierungen", icon: Users },
              { value: "15", label: "Partnerschulen in Vietnam", icon: GraduationCap },
              { value: "85+", label: "Deutsche Arbeitgeber", icon: Building2 },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="mx-auto mb-3 h-8 w-8 text-[oklch(0.50_0.11_195)]" />
                <div className="font-[var(--font-display)] text-2xl font-semibold text-foreground sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works: Informationsblock, keine konkurrierenden CTAs */}
      <section
        className="bg-[oklch(0.98_0.008_260)] py-20 sm:py-24"
        aria-labelledby="how-heading"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-[oklch(0.50_0.11_195)]">
            Ablauf
          </p>
          <h2 id="how-heading" className="mt-3 text-center font-[var(--font-display)] text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            So funktioniert GeVin
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground">
            Ihr Weg in vier klaren Schritten – von der Registrierung zur erfolgreichen Platzierung.
          </p>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "Profil erstellen",
                desc: "Arbeitgeber erstellen ihr Firmenprofil und Stellenangebote. Schulen laden Kandidatenprofile hoch.",
              },
              {
                step: "02",
                title: "Matching & Auswahl",
                desc: "Unser intelligentes Matching verbindet passende Kandidaten mit den richtigen Stellen.",
              },
              {
                step: "03",
                title: "IHK-Prozess",
                desc: "Automatisierte Erstellung aller IHK-Dokumente und Begleitung durch den gesamten Prozess.",
              },
              {
                step: "04",
                title: "Erfolgreiche Platzierung",
                desc: "Vom Visumsantrag bis zur Ankunft – wir begleiten jeden Schritt.",
              },
            ].map((item) => (
              <div key={item.step} className="relative pl-12">
                <span
                  className="absolute left-0 top-0 font-[var(--font-display)] text-3xl font-bold text-[oklch(0.50_0.11_195/0.35)]"
                  aria-hidden
                >
                  {item.step}
                </span>
                <h3 className="font-[var(--font-display)] text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries: gleiche Section-Hierarchie wie „Ablauf“ */}
      <section className="border-t border-border bg-[oklch(0.97_0.008_260)] py-20 sm:py-24" aria-labelledby="industries-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-[oklch(0.50_0.11_195)]">
            Branchen
          </p>
          <h2 id="industries-heading" className="mt-3 text-center font-[var(--font-display)] text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Unsere Schwerpunkte
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Hotellerie & Gastronomie",
                roles: ["Koch/Köchin", "Restaurantfachkraft", "Hotelfachkraft"],
                desc: "Qualifizierte Fachkräfte und Auszubildende für Hotels und Restaurants.",
              },
              {
                title: "Friseurhandwerk",
                roles: ["Friseur/in", "Salon-Management"],
                desc: "Ausgebildete Friseure mit deutschem Sprachzertifikat und handwerklichem Können.",
              },
              {
                title: "Pflege",
                roles: ["Pflegefachkraft", "Altenpfleger/in", "Krankenpfleger/in"],
                desc: "Dringend benötigte Pflegekräfte mit anerkannter Qualifikation.",
              },
            ].map((industry) => (
              <div
                key={industry.title}
                className="home-card-hover overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm"
              >
                <div className="h-1.5 w-full bg-[oklch(0.55_0.10_195)]" />
                <div className="p-6">
                  <h3 className="font-[var(--font-display)] text-lg font-semibold text-foreground">
                    {industry.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {industry.desc}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {industry.roles.map((role) => (
                      <li
                        key={role}
                        className="flex items-center gap-2 text-sm text-foreground"
                      >
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[oklch(0.50_0.11_195)]" />
                        {role}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA: dunkler Block wie übrige Akzent-Sections, eine Hauptaktion + Kontakt-Link */}
      <section
        className="relative overflow-hidden bg-[oklch(0.16_0.03_260)] py-20 sm:py-24"
        aria-labelledby="cta-heading"
      >
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background: "radial-gradient(ellipse 70% 80% at 50% 50%, oklch(0.55 0.12 195 / 0.4), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 id="cta-heading" className="font-[var(--font-display)] text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Verpassen Sie keine passenden Kandidaten
          </h2>
          <p className="mt-3 text-base text-[oklch(0.88_0.01_260)]">
            Kostenlos registrieren – in wenigen Minuten sehen Sie erste passende Profile. Unverbindlich.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button
              size="lg"
              asChild
              className="h-12 min-h-12 px-8 text-base font-semibold w-full sm:w-auto bg-[oklch(0.50_0.11_195)] text-white hover:bg-[oklch(0.44_0.11_195)]"
            >
              <Link href="/auth/register/employer">Jetzt kostenlos starten</Link>
            </Button>
            <Link
              href="/contact"
              className="text-sm font-medium text-[oklch(0.85_0.02_260)] hover:text-white underline underline-offset-2"
            >
              Kontakt aufnehmen
            </Link>
          </div>
        </div>
      </section>
      </main>
    </>
  );
}
