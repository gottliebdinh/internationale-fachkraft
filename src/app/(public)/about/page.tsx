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
  MessageCircle,
} from "lucide-react";
import type { Metadata } from "next";
import { CONTACT_PHONE_TEL } from "@/lib/contact-info";

export const metadata: Metadata = {
  title: "Über uns – Lotus&Eagle",
  description:
    "Lotus&Eagle ist Ihr strategischer Partner für die nachhaltige Gewinnung internationaler Fachkräfte aus Vietnam – mit Struktur in Deutschland und Vietnam.",
};

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
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Über <span className="text-accent">Lotus&Eagle</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Lotus&Eagle ist Ihr strategischer Partner für die Gewinnung
              internationaler Fachkräfte aus Vietnam. Wir begleiten den
              gesamten Prozess – von der gezielten Auswahl über die sprachliche
              und fachliche Vorbereitung bis zur vollständigen Integration.
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
                    { value: "2", label: "Fokusbranchen", icon: Target },
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

      {/* USP */}
      <section className="py-20 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-2">
            Warum Lotus&Eagle?
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Was uns von klassischen Vermittlungsagenturen unterscheidet.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {uspItems.map((item) => (
              <Card
                key={item.title}
                className="border-0 shadow-sm bg-card text-center"
              >
                <CardContent className="pt-8 pb-8">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent/15 mb-4">
                    <item.icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Zwei-Säulen-Modell */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            Unser integriertes System
          </h2>
          <p className="text-center text-muted-foreground mb-4 max-w-2xl mx-auto">
            Klare Zuständigkeitsstruktur für Planungssicherheit – in Vietnam und
            in Deutschland.
          </p>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mt-12">
            <Card className="border-0 shadow-sm bg-card overflow-hidden">
              <div className="h-1.5 w-full bg-[oklch(0.55_0.10_195)]" />
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[oklch(0.55_0.10_195/0.2)]">
                    <Leaf className="h-6 w-6 text-[oklch(0.50_0.11_195)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Vietnam</h3>
                    <p className="text-xs text-muted-foreground">
                      Auswahl & Vorbereitung
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Gezielte Auswahl geeigneter Kandidaten, sprachliche und
                  fachliche Vorbereitung, interkulturelle Schulung und
                  Dokumentenvorbereitung gemäß deutscher Anforderungen.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.50_0.11_195)]" />
                    Professionelles Screening & Auswahl
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.50_0.11_195)]" />
                    Sprachtraining & interkulturelle Vorbereitung
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.50_0.11_195)]" />
                    Dokumente nach deutschen Standards
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-card overflow-hidden">
              <div className="h-1.5 w-full bg-[oklch(0.28_0.06_255)]" />
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[oklch(0.28_0.06_255/0.2)]">
                    <Building2 className="h-6 w-6 text-[oklch(0.28_0.06_255)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Deutschland</h3>
                    <p className="text-xs text-muted-foreground">
                      Vermittlung & Integration
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Analyse des konkreten Personalbedarfs, strukturierte
                  Vertragsgestaltung, Behördenkoordination, Begleitung im
                  Visa-Prozess und Integrationsmanagement nach Ankunft.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.28_0.06_255)]" />
                    Analyse des Personalbedarfs & Vertragsgestaltung
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.28_0.06_255)]" />
                    Koordination Behörden & Visa
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.28_0.06_255)]" />
                    Integrationsmanagement nach Ankunft
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Unsere Werte</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Diese Grundsätze leiten unser Handeln und prägen jede Entscheidung,
            die wir treffen.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Card key={value.title} className="border-0 shadow-sm bg-card">
                <CardContent className="pt-6">
                  <value.icon className="h-10 w-10 text-accent mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.desc}
                  </p>
                </CardContent>
              </Card>
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
            Erfahren Sie, wie Lotus&Eagle Sie bei der nachhaltigen Sicherung
            von Fachkräften unterstützen kann.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button
              size="lg"
              asChild
              className="h-12 min-h-12 px-8 text-base font-semibold w-full sm:w-auto bg-[oklch(0.50_0.11_195)] text-white hover:bg-[oklch(0.44_0.11_195)]"
            >
              <Link href="/auth/register/employer">Kostenlose Erstberatung</Link>
            </Button>
          </div>
          <a
            href={`https://wa.me/${CONTACT_PHONE_TEL.replace("+", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[oklch(0.85_0.02_260)] hover:text-white transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Oder direkt per WhatsApp schreiben
          </a>
        </div>
      </section>
    </>
  );
}
