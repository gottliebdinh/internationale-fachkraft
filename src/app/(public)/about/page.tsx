import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Globe,
  ShieldCheck,
  Handshake,
  Milestone,
  Target,
  Users,
  Building2,
  Leaf,
  Eye,
  Zap,
  Shield,
} from "lucide-react";

const values = [
  {
    icon: Handshake,
    title: "Partnerschaftlichkeit",
    desc: "Wir bauen Brücken zwischen deutschen Unternehmen und vietnamesischen Talenten – auf Augenhöhe und mit gegenseitigem Respekt.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance & Qualität",
    desc: "IHK-konforme Prozesse, DSGVO-Konformität und die Einhaltung des Fachkräfteeinwanderungsgesetzes stehen im Mittelpunkt.",
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

const milestones = [
  { year: "2022", title: "Gründung", desc: "Idee und erste Konzeptentwicklung der Lotus&Eagle-Plattform." },
  { year: "2023", title: "Eigenes Schulnetz", desc: "Ausbau der vier eigenen Sprachschulen in Vietnam und Professionalisierung von Screening und Ankunftsbetreuung." },
  { year: "2024", title: "Plattform-Launch", desc: "Start der digitalen Plattform mit ersten erfolgreichen Vermittlungen." },
  { year: "2025", title: "Wachstum", desc: "Über 100 erfolgreiche Platzierungen; vier eigene Sprachschulen als festes Rückgrat der Vorbereitung." },
  { year: "2026", title: "Expansion", desc: "Erweiterung auf weitere Berufsfelder und Ausbau der KI-gestützten Matching-Algorithmen." },
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
              Wir sind ein strukturierter, international integrierter Partner für nachhaltige Fachkräfte- und Ausbildungsgewinnung zwischen Vietnam und Deutschland – kein klassischer Vermittler, sondern Systemanbieter mit vier eigenen Sprachschulen in Vietnam, professionellem Screening und klarer Verantwortungsstruktur in Deutschland.
            </p>
            <p className="mt-4 text-base font-medium text-foreground">
              Wenn Sie über uns rekrutieren: <span className="text-accent">völlige Transparenz</span>, <span className="text-accent">Schnelligkeit</span> und <span className="text-accent">Sicherheit</span> – von der Bedarfsanalyse bis zur Integration.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
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
                Lotus&Eagle schließt diese Lücke mit einer professionellen digitalen
                Plattform und einer klaren unternehmerischen Architektur: vier
                eigene Sprachschulen in Vietnam, professionelles Screening und
                klare Verantwortung in Deutschland.
                Von der Kandidatensuche über IHK-konforme Dokumente bis zur
                Visa-Beantragung und Integration – strukturiert und mit Planungssicherheit.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Unser Ziel: Langfristige Partnerschaft statt Einmalvermittlung.
                Transparent, rechtssicher und mit Fokus auf Stabilität für alle Beteiligten.
              </p>
            </div>
            <Card className="border-0 bg-muted/30">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: "120+", label: "Platzierungen", icon: Users },
                    { value: "4", label: "Eigene Sprachschulen (VN)", icon: Globe },
                    { value: "85+", label: "Arbeitgeber", icon: Handshake },
                    { value: "3", label: "Branchen", icon: Target },
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

      {/* Transparenz, Schnelligkeit, Sicherheit – Warum über uns */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-2">
            Warum über uns?
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Wenn Sie Ihre Fachkräftegewinnung über Lotus&Eagle abwickeln, profitieren Sie von drei zentralen Vorteilen.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="border-0 shadow-sm bg-card text-center">
              <CardContent className="pt-8 pb-8">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent/15 mb-4">
                  <Eye className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Völlige Transparenz</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Jeder Schritt ist nachvollziehbar und dokumentiert – von der Rekrutierung bis zur Integration. Sie sehen jederzeit den Status, die Unterlagen und die nächsten Schritte.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-card text-center">
              <CardContent className="pt-8 pb-8">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent/15 mb-4">
                  <Zap className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Schnelligkeit</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Klare Prozesse, digitale Plattform und erfahrene Koordination mit Behörden und Partnern – damit Ihr Personalbedarf zügig und planbar gedeckt wird.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-card text-center">
              <CardContent className="pt-8 pb-8">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent/15 mb-4">
                  <Shield className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Sicherheit</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Rechtssichere Verträge, IHK-/HWK-/ZAV-Konformität, DSGVO-konforme Datenverarbeitung und klare Verantwortung – Sie sind auf der sicheren Seite.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Zwei-Säulen-Modell – Green Germany / Lotus & Eagle Alliance */}
      <section className="py-20 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            Unser integriertes System
          </h2>
          <p className="text-center text-muted-foreground mb-4 max-w-2xl mx-auto">
            Klare Zuständigkeitsstruktur für Planungssicherheit – in Vietnam und in Deutschland.
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
                    <h3 className="font-semibold text-lg">Green Germany GmbH – Vietnam</h3>
                    <p className="text-xs text-muted-foreground">seit 2018</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Operative Grundlage unseres internationalen Modells: Wir betreiben vier eigene Sprachschulen in Vietnam – dadurch sind Rekrutierung, professionelles Screening und Sprachausbildung durchgängig aufeinander abgestimmt und präzise steuerbar. Sprachtraining mit deutschsprachigen Lehrkräften, interkulturelle Vorbereitung, Abholung am Flughafen bei der Ankunft sowie Dokumentenvorbereitung gemäß deutscher Anforderungen. Ziel: Integrationsrisiken, Fehlbesetzungen und Ausbildungsabbrüche minimieren.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.50_0.11_195)]" />
                    Professionelles Screening & mehrstufige Auswahl
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.50_0.11_195)]" />
                    Vier eigene Sprachschulen, Sprachtraining & Interkultur
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.50_0.11_195)]" />
                    Flughafen-Abholung & Dokumente nach deutschen Standards
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
                    <h3 className="font-semibold text-lg">Lotus & Eagle Alliance – Deutschland</h3>
                    <p className="text-xs text-muted-foreground">Verantwortung gegenüber Partnerunternehmen</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Übernimmt die unternehmerische Verantwortung gegenüber deutschen Partnerunternehmen: Analyse des konkreten Personalbedarfs, strukturierte Vertragsgestaltung, Koordination mit IHK, HWK und ZAV, Begleitung im Anerkennungs- und Visa-Prozess sowie Integrationsmanagement nach Ankunft.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.28_0.06_255)]" />
                    Analyse des Personalbedarfs & Vertragsgestaltung
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.28_0.06_255)]" />
                    Koordination IHK, HWK, ZAV & Visa
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
          <h2 className="text-3xl font-bold text-center mb-4">
            Unsere Werte
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Diese Grundsätze leiten unser Handeln und prägen jede
            Entscheidung, die wir treffen.
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

      {/* Timeline */}
      <section className="py-20 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            Unsere Geschichte
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Von der Idee zur führenden Plattform für deutsch-vietnamesische
            Fachkräftevermittlung.
          </p>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border md:left-1/2" />
            <div className="space-y-12">
              {milestones.map((milestone, i) => (
                <div
                  key={milestone.year}
                  className={`relative flex items-start gap-6 md:gap-12 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="hidden md:block md:w-1/2" />
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
                      <Milestone className="h-4 w-4 text-accent-foreground" />
                    </div>
                  </div>
                  <Card className="ml-12 md:ml-0 md:w-1/2 border-0 shadow-sm">
                    <CardContent className="pt-4">
                      <Badge variant="outline" className="mb-2">
                        {milestone.year}
                      </Badge>
                      <h3 className="font-semibold text-base mb-1">
                        {milestone.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {milestone.desc}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
