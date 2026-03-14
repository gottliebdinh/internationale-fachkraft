import Link from "next/link";
import Image from "next/image";
import {
  UserPlus,
  Brain,
  FileCheck,
  Plane,
  ArrowRight,
  Clock,
  FileText,
  HelpCircle,
  Euro,
  Languages,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const steps = [
  {
    step: "01",
    icon: UserPlus,
    image: "/funktioniert/anmelden.png",
    title: "Registrierung & Profilerstellung",
    description:
      "Arbeitgeber erstellen ein Firmenprofil mit detaillierten Stellenangeboten. Vietnamesische Partnerschulen laden die Profile ihrer qualifizierten Kandidaten hoch – inklusive Sprachzertifikaten, Qualifikationen und Lebensläufen.",
    details: [
      "Firmenprofil mit Standort und Branche",
      "Detaillierte Stellenbeschreibungen",
      "Kandidatenprofile mit Dokumenten",
      "Sprachzertifikate (B1/B2) hinterlegen",
    ],
  },
  {
    step: "02",
    icon: Brain,
    image: "/funktioniert/matching.png",
    title: "Intelligentes Matching",
    description:
      "Unser Algorithmus analysiert Anforderungen und Qualifikationen und erstellt optimale Matches. Arbeitgeber erhalten kuratierte Vorschläge und können Kandidaten direkt über die Plattform kontaktieren.",
    details: [
      "KI-gestützter Matching-Algorithmus",
      "Filterung nach Qualifikation und Sprache",
      "Direkte Kommunikation auf der Plattform",
      "Video-Interview-Koordination",
    ],
  },
  {
    step: "03",
    icon: FileCheck,
    image: "/funktioniert/dokumentenprozess.png",
    title: "IHK-konformer Dokumentenprozess",
    description:
      "Nach der Auswahl generiert die Plattform automatisch alle benötigten IHK-Dokumente: Berufsausbildungsvertrag, Erklärung zum Beschäftigungsverhältnis, Ausbildungsplan und weitere Pflichtdokumente.",
    details: [
      "Automatische Vertragsgenerierung (PDF)",
      "IHK-Dokumentenvorlagen",
      "Digitale Unterschrift und Freigabe",
      "Statusverfolgung aller Dokumente",
    ],
  },
  {
    step: "04",
    icon: Plane,
    image: "/funktioniert/visumAnkunft.png",
    title: "Visum & Ankunft",
    description:
      "Wir begleiten den gesamten Visa-Prozess und koordinieren die Anreise. Von der Zusammenstellung der Visumsunterlagen bis zur Unterstützung bei der Ankunft in Deutschland – alles aus einer Hand.",
    details: [
      "Checkliste für Visumsunterlagen",
      "Fortschrittsverfolgung des Antrags",
      "Koordination der Anreise",
      "Onboarding-Unterstützung",
    ],
  },
];

const faqs = [
  {
    icon: Clock,
    question: "Wie lange dauert der gesamte Prozess?",
    answer:
      "Von der Registrierung bis zur Ankunft des Kandidaten in Deutschland dauert der Prozess in der Regel 4–8 Monate. Die Dauer hängt von der Visumsbearbeitung und der individuellen Situation ab.",
  },
  {
    icon: FileText,
    question: "Welche Dokumente werden benötigt?",
    answer:
      "Arbeitgeber benötigen: Gewerbeanmeldung, Handelsregisterauszug, Nachweis der Ausbildungsberechtigung. Kandidaten: Reisepass, Sprachzertifikat (mind. B1), Bildungsabschlüsse, Gesundheitszeugnis.",
  },
  {
    icon: Euro,
    question: "Was kostet die Nutzung der Plattform?",
    answer:
      "Die Registrierung und Profilsuche sind kostenfrei. Vermittlungsgebühren fallen erst bei erfolgreicher Platzierung an. Kontaktieren Sie uns für ein individuelles Angebot.",
  },
  {
    icon: Languages,
    question: "Welches Sprachniveau wird vorausgesetzt?",
    answer:
      "Für die Berufsausbildung ist mindestens ein B1-Zertifikat erforderlich. Viele unserer Kandidaten bringen bereits B2 mit. Die Sprachausbildung erfolgt an unseren Partnerschulen in Vietnam.",
  },
  {
    icon: HelpCircle,
    question: "Was passiert nach der Ankunft in Deutschland?",
    answer:
      "GeVin bietet optionale Onboarding-Unterstützung: Behördengänge, Wohnungssuche und interkulturelle Begleitung in den ersten Wochen. Details werden individuell vereinbart.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              So funktioniert <span className="text-accent">GeVin</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              In vier klar definierten Schritten von der Registrierung zur
              erfolgreichen Fachkräfteplatzierung – transparent, effizient und
              rechtssicher.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {steps.map((step, i) => (
              <div
                key={step.step}
                className={`grid grid-cols-1 gap-8 lg:grid-cols-2 items-center ${
                  i % 2 === 1 ? "lg:direction-rtl" : ""
                }`}
              >
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="text-5xl font-bold text-accent/20 mb-2">
                    {step.step}
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <step.icon className="h-5 w-5 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold">{step.title}</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {step.description}
                  </p>
                  <ul className="space-y-2">
                    {step.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                <Card
                  className={`mx-auto max-w-sm overflow-hidden border-0 bg-muted/30 ${
                    i % 2 === 1 ? "lg:order-1" : ""
                  }`}
                >
                  <CardContent className="relative aspect-video w-full p-0">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 280px, 320px"
                    />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ-like section */}
      <section className="py-20 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            Häufige Fragen zum Prozess
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Die wichtigsten Antworten auf einen Blick.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {faqs.map((faq) => (
              <Card key={faq.question} className="border-0 shadow-sm">
                <CardContent className="pt-6">
                  <faq.icon className="h-8 w-8 text-accent mb-4" />
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA: wie Home – dunkler Block, Gold-Verlauf, ein Gold-Button, Link sekundär */}
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
            Bereit, den Prozess zu starten?
          </h2>
          <p className="mt-3 text-base text-[oklch(0.88_0.01_260)]">
            Registrieren Sie sich jetzt und beginnen Sie mit der Fachkräftegewinnung.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button
              size="lg"
              asChild
              className="h-12 min-h-12 px-8 text-base font-semibold w-full sm:w-auto bg-[oklch(0.50_0.11_195)] text-white hover:bg-[oklch(0.44_0.11_195)]"
            >
              <Link href="/auth/register/employer" className="inline-flex items-center justify-center gap-2">
                Jetzt kostenlos starten
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
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
    </>
  );
}
