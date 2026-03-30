import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileCheck,
  ShieldCheck,
  Users,
  Building2,
  Scissors,
  HeartPulse,
  UtensilsCrossed,
  UserPlus,
  Search,
  FileSignature,
  GraduationCap,
} from "lucide-react";

const benefits = [
  {
    icon: Users,
    title: "Qualifizierte Fachkräfte",
    desc: "Zugang zu motivierten, vorqualifizierten Kandidaten mit Sprachzertifikat und fachlicher Ausbildung.",
  },
  {
    icon: FileCheck,
    title: "IHK-konformer Prozess",
    desc: "Automatisierte Erstellung aller IHK-Dokumente – kein manueller Aufwand, keine Fehler.",
  },
  {
    icon: Clock,
    title: "Zeitersparnis",
    desc: "Intelligentes Matching reduziert die Suchzeit erheblich. Fokussieren Sie sich auf Ihr Kerngeschäft.",
  },
  {
    icon: ShieldCheck,
    title: "Rechtssicherheit",
    desc: "Volle Konformität mit DSGVO und Fachkräfteeinwanderungsgesetz – Sie sind auf der sicheren Seite.",
  },
];

const howToStart = [
  {
    step: "01",
    icon: UserPlus,
    title: "Registrieren",
    desc: "Erstellen Sie Ihr Firmenprofil in wenigen Minuten. Hinterlegen Sie Standort, Branche und Unternehmensinformationen.",
  },
  {
    step: "02",
    icon: Search,
    title: "Stelle ausschreiben",
    desc: "Erstellen Sie detaillierte Stellenangebote und lassen Sie sich passende Kandidaten vorschlagen.",
  },
  {
    step: "03",
    icon: FileSignature,
    title: "Kandidat auswählen",
    desc: "Prüfen Sie Profile, führen Sie Video-Interviews und wählen Sie Ihren Wunschkandidaten. Den Rest erledigt die Plattform.",
  },
];

const industries = [
  {
    icon: UtensilsCrossed,
    title: "Hotellerie & Gastronomie",
    desc: "Köche, Restaurantfachkräfte und Hotelfachkräfte für Ihr Unternehmen. Unsere Kandidaten bringen Leidenschaft und Fachwissen mit.",
    roles: ["Koch/Köchin", "Restaurantfachkraft", "Hotelfachkraft", "Bäcker/in"],
    image: "/schwerpunkt/köchin.png",
  },
  {
    icon: Scissors,
    title: "Friseurhandwerk",
    desc: "Ausgebildete Friseurinnen und Friseure mit deutschen Sprachkenntnissen und handwerklichem Geschick.",
    roles: ["Friseur/in", "Salon-Assistent/in", "Auszubildende/r"],
    image: "/schwerpunkt/friseur.png",
  },
  {
    icon: HeartPulse,
    title: "Pflege",
    desc: "Dringend benötigte Pflegekräfte mit anerkannter Qualifikation für Krankenhäuser und Pflegeeinrichtungen.",
    roles: ["Pflegefachkraft", "Altenpfleger/in", "Krankenpfleger/in"],
    image: "/schwerpunkt/pflege.png",
  },
];

export default function ForEmployersPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Fachkräfte finden,{" "}
              <span className="text-accent">die passen</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Nachhaltige Fachkräfte- und Ausbildungsgewinnung mit Planungssicherheit – 
              kein klassischer Vermittler, sondern strukturierter Partner mit vier eigenen Sprachschulen in Vietnam, professionellem Screening und klarer Verantwortung in Deutschland.
            </p>
            <p className="mt-3 text-base font-medium text-foreground">
              Über uns: <span className="text-accent">völlige Transparenz</span>, <span className="text-accent">Schnelligkeit</span> und <span className="text-accent">Sicherheit</span> – von der Bedarfsanalyse bis zur Integration.
            </p>
            <div className="mt-10">
              <Button
                size="lg"
                asChild
                className="h-12 min-h-12 px-8 text-base font-semibold shadow-sm bg-[oklch(0.28_0.06_255)] text-white hover:bg-[oklch(0.22_0.06_255)]"
              >
                <Link href="/auth/register/employer" className="inline-flex items-center justify-center gap-2">
                  Jetzt kostenlos registrieren
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
            Ihre Vorteile mit Lotus&Eagle
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Stabilität, Struktur und wirtschaftliche Planungssicherheit – kein reines Preisargument.
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

      {/* Leistungsbereiche: Ausbildung + Fachkräfte */}
      <section className="py-20 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            Leistungsbereiche
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Zwei klare Wege: Auszubildende mit nachhaltiger Vorbereitung oder qualifizierte Fachkräfte mit Anerkennungs- und Integrationsbegleitung.
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="h-2 bg-[oklch(0.50_0.11_195)]" />
              <CardContent className="pt-6">
                <GraduationCap className="h-10 w-10 text-[oklch(0.50_0.11_195)] mb-4" />
                <h3 className="font-semibold text-lg mb-2">Ausbildung</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Strukturierte Gewinnung internationaler Auszubildender mit nachhaltiger Vorbereitung und klarer Integrationsbegleitung. Von der Rekrutierung über Sprachtraining und interkulturelle Vorbereitung bis zur Ankunft und Stabilisierung in Deutschland.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="h-2 bg-[oklch(0.28_0.06_255)]" />
              <CardContent className="pt-6">
                <Users className="h-10 w-10 text-[oklch(0.28_0.06_255)] mb-4" />
                <h3 className="font-semibold text-lg mb-2">Fachkräfte</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Direktvermittlung qualifizierter Fachkräfte mit Anerkennungsbegleitung, behördlicher Koordination und strukturierter Integrationsphase. IHK-/HWK-/ZAV-Koordination und Begleitung im Visa-Prozess inklusive.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How to get started */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            In drei Schritten starten
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Der Einstieg ist einfach – wir begleiten Sie auf dem ganzen Weg.
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {howToStart.map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-5xl font-bold text-accent/20 mb-4">
                  {item.step}
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 mx-auto mb-4">
                  <item.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            Branchen, die wir bedienen
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Spezialisiert auf die Bereiche mit dem größten Fachkräftebedarf.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {industries.map((industry) => (
              <div
                key={industry.title}
                className="home-card-hover overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm"
              >
                <div className="h-1.5 w-full bg-[oklch(0.55_0.10_195)]" />
                {industry.image && (
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={industry.image}
                      alt={industry.title}
                      fill
                      className="object-cover object-center"
                      sizes="400px"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-card to-transparent" />
                  </div>
                )}
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

      {/* Pricing */}
      <section className="py-20 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Preise</h2>
            <p className="text-muted-foreground mb-8">
              Unsere Preise richten sich nach der Anzahl der Platzierungen und
              Ihren individuellen Anforderungen. Die Registrierung und
              Kandidatensuche sind kostenlos. Wir arbeiten im Vermittlungsmodell ohne Arbeitnehmerüberlassung.
            </p>
            <Card className="border-0 shadow-sm">
              <CardContent className="py-12">
                <Building2 className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Individuelles Angebot
                </h3>
                <p className="text-muted-foreground mb-6">
                  Kontaktieren Sie uns für ein maßgeschneidertes Angebot, das zu
                  Ihrem Unternehmen passt.
                </p>
                <Button
                  size="lg"
                  asChild
                  className="h-12 min-h-12 px-8 text-base font-semibold shadow-sm bg-[oklch(0.28_0.06_255)] text-white hover:bg-[oklch(0.22_0.06_255)]"
                >
                  <Link href="/contact">Kontaktieren Sie uns</Link>
                </Button>
              </CardContent>
            </Card>
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
            Starten Sie jetzt mit Lotus&Eagle
          </h2>
          <p className="mt-3 text-base text-[oklch(0.88_0.01_260)]">
            Registrieren Sie sich kostenlos und erhalten Sie Zugang zu qualifizierten Fachkräften aus Vietnam.
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
