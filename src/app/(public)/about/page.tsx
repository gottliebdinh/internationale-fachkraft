import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Heart,
  Globe,
  ShieldCheck,
  Handshake,
  Target,
  Users,
  Building2,
  Leaf,
  Network,
  Briefcase,
  Lightbulb,
} from "lucide-react";
import type { Metadata } from "next";
import { CONTACT_WHATSAPP_ERSTBERATUNG_URL } from "@/lib/contact-info";

export const metadata: Metadata = {
  title: "Über uns – LOTUS & EAGLE",
  description:
    "LOTUS & EAGLE: rund acht Jahre Erfahrung in der internationalen Fachkräftevermittlung, eigene Schulen und Lernzentren in Vietnam – u. a. in Hanoi – sowie begleitete Integration in Deutschland.",
};

/** Wie Arbeitgeber-Hero „Fachkräfte nachhaltig sichern“ / Prozess-Sektion */
const homeProcessFadeBackground = `
  radial-gradient(ellipse 65% 60% at 10% 18%, oklch(0.58 0.09 195 / 0.22), transparent 68%),
  radial-gradient(ellipse 65% 60% at 92% 88%, oklch(0.52 0.08 152 / 0.18), transparent 68%),
  radial-gradient(ellipse 58% 52% at 50% 48%, oklch(0.78 0.11 80 / 0.16), transparent 62%),
  oklch(0.992 0.008 255)
`;

const values = [
  {
    icon: Handshake,
    title: "Partnerschaftlichkeit",
    desc: "Wir bauen Brücken zwischen deutschen Unternehmen und vietnamesischen Talenten – auf Augenhöhe und mit gegenseitigem Respekt.",
  },
  {
    icon: ShieldCheck,
    title: "Qualität & Compliance",
    desc: "Strukturierte Prozesse, rechtssichere Vertragsgestaltung und Einhaltung aller relevanten Gesetze stehen im Mittelpunkt.",
  },
  {
    icon: Heart,
    title: "Menschlichkeit",
    desc: "Hinter jedem Profil steht ein Mensch mit Träumen und Zielen. Wir begleiten jede Person persönlich auf ihrem Weg.",
  },
  {
    icon: Globe,
    title: "Interkulturelle Kompetenz",
    desc: "Unser deutsch-vietnamesisches Team versteht beide Kulturen und vermittelt nicht nur Fachkräfte, sondern auch Verständnis.",
  },
];

const uspItems = [
  {
    icon: Network,
    title: "Struktur in Deutschland und Vietnam",
    desc: "Durch unsere Präsenz in beiden Ländern steuern wir den gesamten Prozess – von der Auswahl bis zur Integration.",
  },
  {
    icon: Briefcase,
    title: "Erfahrung aus der Praxis",
    desc: "Wir kennen die Anforderungen aus realen Projekten und verfügen über umfassende Erfahrung im Umgang mit Behörden, Kammern und Unternehmen.",
  },
  {
    icon: Lightbulb,
    title: "Unternehmerisches Netzwerk",
    desc: "Unser Team besteht aus Fachkräften, Unternehmern und Ausbildern, die die Herausforderungen deutscher Betriebe aus erster Hand verstehen.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero — Hintergrund wie Arbeitgeber „Fachkräfte nachhaltig sichern“ */}
      <section
        className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
        aria-labelledby="about-hero-heading"
      >
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{ background: homeProcessFadeBackground }}
        />
        <div className="relative z-10 mx-auto w-full max-w-[min(100%,1340px)] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="mx-auto max-w-3xl text-center">
            <h1
              id="about-hero-heading"
              className="text-4xl font-bold tracking-tight sm:text-5xl"
            >
              Über <span className="text-accent">LOTUS & EAGLE</span>
            </h1>
            <p className="mt-6 mx-auto max-w-3xl text-lg text-muted-foreground leading-relaxed">
              LOTUS & EAGLE ist Ihr strategischer Partner für die Gewinnung
              internationaler Fachkräfte aus Vietnam – mit rund{" "}
              <span className="font-medium text-foreground/90">
                acht Jahren Erfahrung
              </span>{" "}
              in dieser Branche und einer fest verankerten Struktur vor Ort:
              Wir betreiben{" "}
              <span className="font-medium text-foreground/90">
                eigene Schulen und Lernzentren in Vietnam
              </span>
              , unter anderem in{" "}
              <span className="font-medium text-foreground/90">Hanoi</span>
              , und weiteren Standorten im Land. Damit sichern wir Auswahl,
              Sprach- und Fachvorbereitung sowie Qualität über den gesamten Weg
              – ergänzt durch unsere Präsenz in Deutschland für Verträge,
              Behörden und Integration. Von der ersten Idee bis zur
              erfolgreichen Ankunft Ihrer Fachkräfte begleiten wir Sie aus einer
              Hand.
            </p>
          </div>
        </div>
      </section>

      {/* Mission + Stats */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Unsere Mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Deutschland steht vor einer enormen Herausforderung: Der
                Fachkräftemangel gefährdet die Zukunft ganzer Branchen.
                Gleichzeitig gibt es in Vietnam hochmotivierte, gut ausgebildete
                junge Menschen, die nach internationalen Karrieremöglichkeiten
                suchen.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Unser Anspruch ist nicht die kurzfristige Vermittlung, sondern
                der Aufbau stabiler und langfristiger Personalstrukturen. Wir
                verbinden internationale Rekrutierung mit operativer Umsetzung
                in Deutschland.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Unser Ziel: Langfristige Partnerschaften mit Unternehmen, die
                auf Qualität, Verlässlichkeit und nachhaltige Lösungen setzen.
              </p>
            </div>
            <Card className="border-0 bg-muted/30">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: "120+", label: "Platzierungen", icon: Users },
                    { value: "5", label: "Fokusbranchen", icon: Target },
                    { value: "85+", label: "Arbeitgeber", icon: Handshake },
                    { value: "2", label: "Standorte (DE + VN)", icon: Globe },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <stat.icon className="h-6 w-6 mx-auto mb-2 text-accent" />
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* USP — Gold wie Startseite „Warum LOTUS & EAGLE“ */}
      <section
        className="border-t border-[oklch(0.42_0.06_78)]/35 bg-[oklch(0.30_0.065_78)] py-20 sm:py-24"
        aria-labelledby="about-usp-heading"
      >
        <div className="mx-auto w-full max-w-[min(100%,1340px)] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <header className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[oklch(0.88_0.04_88)]">
              Ihr Partner
            </p>
            <div
              className="mx-auto mt-4 h-0.5 w-12 rounded-full bg-[oklch(0.72_0.13_82)]"
              aria-hidden
            />
            <h2
              id="about-usp-heading"
              className="mt-4 font-[var(--font-display)] text-2xl font-semibold tracking-tight text-[oklch(0.98_0.015_95)] sm:text-3xl"
            >
              Warum LOTUS & EAGLE?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[oklch(0.94_0.025_92)]">
              Was uns von klassischen Vermittlungsagenturen unterscheidet.
            </p>
          </header>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-6">
            {uspItems.map((item) => (
              <div
                key={item.title}
                className="group flex h-full min-h-0 flex-col rounded-2xl border border-[oklch(0.50_0.07_78)]/40 border-t-[3px] border-t-[oklch(0.72_0.13_82)] bg-[oklch(0.26_0.052_78)] px-6 py-8 text-center shadow-[inset_0_1px_0_0_oklch(0.72_0.13_82/0.12)] transition-[box-shadow,border-color] duration-300 hover:border-[oklch(0.72_0.13_82)]/35"
              >
                <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[oklch(0.42_0.08_78)]/45 ring-1 ring-inset ring-[oklch(0.72_0.13_82)]/25 transition-transform duration-300 group-hover:scale-[1.03]">
                  <item.icon
                    className="h-6 w-6 text-[oklch(0.82_0.10_82)]"
                    aria-hidden
                  />
                </div>
                <h3 className="mt-5 font-[var(--font-display)] text-lg font-semibold leading-snug text-[oklch(0.99_0.01_95)]">
                  {item.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[oklch(0.94_0.025_92)] sm:text-[0.9375rem]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zwei-Säulen-Modell — dunkelblau wie Für-Arbeitgeber „Ihre Vorteile“ */}
      <section
        className="border-t border-white/10 bg-[oklch(0.22_0.06_255)] py-20 sm:py-24"
        aria-labelledby="about-system-heading"
      >
        <div className="mx-auto w-full max-w-[min(100%,1340px)] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <h2
            id="about-system-heading"
            className="text-center font-[var(--font-display)] text-2xl font-semibold tracking-tight text-white sm:text-3xl"
          >
            Unser integriertes System
          </h2>
          <div
            className="mx-auto mt-5 h-0.5 w-12 rounded-full bg-white/35"
            aria-hidden
          />
          <p className="mx-auto mt-7 max-w-2xl text-center text-base leading-relaxed text-white/88">
            Klare Zuständigkeitsstruktur für Planungssicherheit – in Vietnam und
            in Deutschland.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <article className="overflow-hidden rounded-2xl border border-white/15 border-t-[3px] border-t-[oklch(0.58_0.11_195)] bg-white/[0.06] px-6 py-7 shadow-[inset_0_1px_0_0_oklch(1_0_0/0.06)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-inset ring-white/15">
                  <Leaf className="h-6 w-6 text-[oklch(0.78_0.10_195)]" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h3 className="font-[var(--font-display)] font-semibold text-lg text-white">
                    Vietnam
                  </h3>
                  <p className="text-xs text-white/75">Auswahl & Vorbereitung</p>
                </div>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-white/80">
                Gezielte Auswahl geeigneter Kandidaten, sprachliche und fachliche
                Vorbereitung, interkulturelle Schulung und Dokumentenvorbereitung
                gemäß deutscher Anforderungen.
              </p>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[oklch(0.65_0.11_195)]" />
                  Professionelles Screening & Auswahl
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[oklch(0.65_0.11_195)]" />
                  Sprachtraining & interkulturelle Vorbereitung
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[oklch(0.65_0.11_195)]" />
                  Dokumente nach deutschen Standards
                </li>
              </ul>
            </article>
            <article className="overflow-hidden rounded-2xl border border-white/15 border-t-[3px] border-t-white/45 bg-white/[0.06] px-6 py-7 shadow-[inset_0_1px_0_0_oklch(1_0_0/0.06)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-inset ring-white/15">
                  <Building2
                    className="h-6 w-6 text-white/90"
                    aria-hidden
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-[var(--font-display)] font-semibold text-lg text-white">
                    Deutschland
                  </h3>
                  <p className="text-xs text-white/75">Vermittlung & Integration</p>
                </div>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-white/80">
                Analyse des konkreten Personalbedarfs, strukturierte
                Vertragsgestaltung, Behördenkoordination, Begleitung im
                Visa-Prozess und Integrationsmanagement nach Ankunft.
              </p>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/55" />
                  Analyse des Personalbedarfs & Vertragsgestaltung
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/55" />
                  Koordination Behörden & Visa
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/55" />
                  Integrationsmanagement nach Ankunft
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* Values — gleicher Aufbau wie Hero „Über LOTUS & EAGLE“ */}
      <section
        className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
        aria-labelledby="about-values-heading"
      >
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{ background: homeProcessFadeBackground }}
        />
        <div className="relative z-10 mx-auto w-full max-w-[min(100%,1340px)] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              id="about-values-heading"
              className="text-3xl font-bold text-center mb-4"
            >
              Unsere <span className="text-accent">Werte</span>
            </h2>
            <p className="max-w-2xl mx-auto text-center text-muted-foreground mb-12 leading-relaxed">
              Diese Grundsätze leiten unser Handeln und prägen jede Entscheidung,
              die wir treffen.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <article
                key={value.title}
                className="rounded-2xl border border-border/80 bg-white/80 p-6 shadow-[0_1px_2px_oklch(0_0_0/0.04)] backdrop-blur-[2px]"
              >
                <value.icon className="h-10 w-10 text-accent mb-4" aria-hidden />
                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.desc}
                </p>
              </article>
            ))}
          </div>
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
            Lassen Sie uns gemeinsam starten
          </h2>
          <p className="mt-3 text-base text-[oklch(0.88_0.01_260)]">
            Erfahren Sie, wie LOTUS & EAGLE Sie bei der nachhaltigen Sicherung
            von Fachkräften unterstützen kann.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button
              size="lg"
              asChild
              className="h-12 min-h-12 px-8 text-base font-semibold w-full sm:w-auto bg-[oklch(0.50_0.11_195)] text-white hover:bg-[oklch(0.44_0.11_195)]"
            >
              <a
                href={CONTACT_WHATSAPP_ERSTBERATUNG_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Kostenlose Erstberatung
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
