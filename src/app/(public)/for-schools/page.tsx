import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  GraduationCap,
  Globe,
  FileCheck,
  Users,
  CheckCircle2,
  ArrowRight,
  Building2,
  Languages,
  ShieldCheck,
  BarChart3,
  Upload,
  Handshake,
} from "lucide-react";

const benefits = [
  {
    icon: Globe,
    title: "Internationale Reichweite",
    desc: "Verbinden Sie Ihre Absolvent/innen direkt mit deutschen Arbeitgebern – ohne Zwischenhändler.",
  },
  {
    icon: FileCheck,
    title: "Digitaler Prozess",
    desc: "Laden Sie Kandidatenprofile hoch, verfolgen Sie den Status und verwalten Sie alles über ein zentrales Dashboard.",
  },
  {
    icon: BarChart3,
    title: "Transparente Statistiken",
    desc: "Echtzeit-Übersicht über Vermittlungen, Matches und den Status Ihrer Kandidaten.",
  },
  {
    icon: ShieldCheck,
    title: "Vertrauenswürdige Plattform",
    desc: "DSGVO-konforme Datenverarbeitung und sichere Dokumentenspeicherung schützen Ihre Daten.",
  },
];

const requirements = [
  "Staatlich anerkannte Bildungseinrichtung in Vietnam",
  "Curriculum zur Vermittlung deutscher Sprachkenntnisse (mind. B1-Niveau)",
  "Erfahrung in der Ausbildung für Hotellerie, Friseurhandwerk oder Pflege",
  "Bereitschaft zur digitalen Zusammenarbeit über die Lotus&Eagle-Plattform",
  "Kapazität für regelmäßige Kandidatenbereitstellung",
];

const platformSteps = [
  {
    step: "01",
    icon: Handshake,
    title: "Partnerschaft vereinbaren",
    desc: "Kontaktieren Sie uns und durchlaufen Sie den Onboarding-Prozess. Wir richten Ihren Schulaccount ein.",
  },
  {
    step: "02",
    icon: Upload,
    title: "Kandidaten hochladen",
    desc: "Erstellen Sie Profile für Ihre Absolvent/innen mit Qualifikationen, Sprachzertifikaten und Dokumenten.",
  },
  {
    step: "03",
    icon: Users,
    title: "Matching verfolgen",
    desc: "Verfolgen Sie in Echtzeit, wie Ihre Kandidaten mit deutschen Arbeitgebern gematcht werden.",
  },
  {
    step: "04",
    icon: GraduationCap,
    title: "Erfolge feiern",
    desc: "Begleiten Sie Ihre Schüler/innen auf dem Weg nach Deutschland und bauen Sie Ihre Erfolgsgeschichte aus.",
  },
];

export default function ForSchoolsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Ihre Schule als{" "}
              <span className="text-accent">Karrierebrücke</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Werden Sie Lotus&Eagle-Partnerschule und ermöglichen Sie Ihren
              Absolvent/innen den direkten Einstieg in den deutschen
              Arbeitsmarkt.
            </p>
            <div className="mt-10">
              <Button
                size="lg"
                asChild
                className="h-12 min-h-12 px-8 text-base font-semibold shadow-sm bg-[oklch(0.28_0.06_255)] text-white hover:bg-[oklch(0.22_0.06_255)]"
              >
                <Link href="/contact" className="inline-flex items-center justify-center gap-2">
                  Partnerschaft anfragen
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            Vorteile einer Partnerschaft
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Gemeinsam schaffen wir Perspektiven für vietnamesische Fachkräfte.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="border-0 shadow-sm bg-muted/30">
                <CardContent className="pt-6">
                  <benefit.icon className="h-10 w-10 text-accent mb-4" />
                  <h3 className="font-semibold text-lg mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Voraussetzungen für Partnerschulen
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Um als Lotus&Eagle-Partnerschule zugelassen zu werden, müssen
                folgende Kriterien erfüllt sein:
              </p>
              <ul className="space-y-3">
                {requirements.map((req) => (
                  <li key={req} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Languages className="h-8 w-8 text-accent" />
                  <h3 className="font-semibold text-lg">Sprachausbildung</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Lotus&Eagle betreibt vier eigene Sprachschulen in Vietnam – dort
                  läuft die zentrale Deutsch-Vorbereitung mit professionellem
                  Screening. Als Partnerschule ergänzen Sie mit fachlicher
                  Bildung; Ihr Angebot sollte Deutsch mindestens auf B1-Niveau
                  nach dem Gemeinsamen Europäischen Referenzrahmen (GER)
                  vermitteln.
                </p>
                <div className="flex items-center gap-3 mb-4 mt-6">
                  <Building2 className="h-8 w-8 text-accent" />
                  <h3 className="font-semibold text-lg">
                    Staatliche Anerkennung
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Eine staatliche Anerkennung oder Affiliierung mit
                  Regierungsbehörden in Vietnam ist Voraussetzung, um die
                  Qualität und Verlässlichkeit der Ausbildung sicherzustellen.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works for schools */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            So funktioniert die Plattform für Schulen
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Ein klarer, digitaler Prozess von der Partnerschaft bis zur
            erfolgreichen Vermittlung.
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {platformSteps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-5xl font-bold text-accent/20 mb-4">
                  {item.step}
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 mx-auto mb-4">
                  <item.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA: wie Home – dunkler Block, Gold, ein Haupt-Button + Link */}
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
            Werden Sie Lotus&Eagle-Partnerschule
          </h2>
          <p className="mt-3 text-base text-[oklch(0.88_0.01_260)]">
            Kontaktieren Sie uns noch heute und erfahren Sie, wie Ihre Schule von einer Partnerschaft profitieren kann.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button
              size="lg"
              asChild
              className="h-12 min-h-12 px-8 text-base font-semibold w-full sm:w-auto bg-[oklch(0.50_0.11_195)] text-white hover:bg-[oklch(0.44_0.11_195)]"
            >
              <Link href="/contact" className="inline-flex items-center justify-center gap-2">
                Kontakt aufnehmen
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
            </Button>
            <Link
              href="/faq"
              className="text-sm font-medium text-[oklch(0.85_0.02_260)] hover:text-white underline underline-offset-2"
            >
              Häufige Fragen
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
