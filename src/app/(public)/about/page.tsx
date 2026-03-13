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
  { year: "2022", title: "Gründung", desc: "Idee und erste Konzeptentwicklung der GeVin-Plattform." },
  { year: "2023", title: "Erste Partnerschaften", desc: "Kooperationsverträge mit 5 vietnamesischen Berufsschulen." },
  { year: "2024", title: "Plattform-Launch", desc: "Start der digitalen Plattform mit ersten erfolgreichen Vermittlungen." },
  { year: "2025", title: "Wachstum", desc: "Über 100 erfolgreiche Platzierungen und 15 Partnerschulen." },
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
              Über <span className="text-accent">GeVin</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              GeVin verbindet deutsche Arbeitgeber mit qualifizierten
              vietnamesischen Fachkräften und Auszubildenden – digital,
              compliant und menschlich.
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
                GeVin schließt diese Lücke mit einer professionellen digitalen
                Plattform, die den gesamten Vermittlungsprozess abdeckt – von
                der Kandidatensuche über die IHK-konforme Dokumentenerstellung
                bis hin zur Visa-Beantragung und Ankunft in Deutschland.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Unser Ziel ist es, den Prozess der internationalen
                Fachkräftegewinnung transparent, effizient und rechtssicher zu
                gestalten – für alle Beteiligten.
              </p>
            </div>
            <Card className="border-0 bg-muted/30">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: "120+", label: "Platzierungen", icon: Users },
                    { value: "15", label: "Partnerschulen", icon: Globe },
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

      {/* Values */}
      <section className="py-20 bg-muted/20">
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
      <section className="py-20">
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
