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
  UtensilsCrossed,
  HeartPulse,
  GraduationCap,
} from "lucide-react";
import type { Metadata } from "next";
import { CONTACT_PHONE_TEL } from "@/lib/contact-info";

export const metadata: Metadata = {
  title: "Für Arbeitgeber – Fachkräfte nachhaltig sichern",
  description:
    "Lotus&Eagle ist Ihr strategischer Partner für die Gewinnung internationaler Fachkräfte aus Vietnam. Ausbildung, Fachkräfte und kurzfristige Beschäftigung.",
};

/** Gleiche Tokens wie Startseite (public home) */
const homeEyebrow = "text-[oklch(0.42_0.10_255)]";
const homeH2 = "text-[oklch(0.22_0.06_255)]";
const homeBodyMuted = "text-[oklch(0.44_0.028_255)]";
const homeSectionY = "py-20 sm:py-24";
const homeSectionInset =
  "mx-auto w-full max-w-[min(100%,1340px)] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16";
const homeBlueGreenFadeBackground = `
  radial-gradient(ellipse 65% 60% at 10% 18%, oklch(0.58 0.09 195 / 0.24), transparent 68%),
  radial-gradient(ellipse 65% 60% at 92% 88%, oklch(0.52 0.08 152 / 0.20), transparent 68%),
  oklch(0.992 0.008 255)
`;

const benefitCardFrame =
  "rounded-2xl border border-border/60 border-t-[3px] border-t-[oklch(0.55_0.11_195)] bg-gradient-to-b from-[oklch(0.995_0.012_195)] via-white to-[oklch(0.99_0.008_255)] px-6 py-7 shadow-[0_1px_2px_oklch(0_0_0/0.04)]";
const benefitIconWrap =
  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[oklch(0.96_0.035_195)] ring-1 ring-inset ring-[oklch(0.55_0.08_195/0.2)]";
const benefitIconClass = "h-6 w-6 text-[oklch(0.38_0.11_195)]";

const offerCardAccents = [
  {
    borderTop: "border-t-[oklch(0.55_0.11_195)]",
    iconBg:
      "bg-[oklch(0.96_0.035_195)] ring-1 ring-inset ring-[oklch(0.55_0.08_195/0.2)]",
    iconFg: "text-[oklch(0.38_0.11_195)]",
    cardBg:
      "bg-gradient-to-b from-[oklch(0.995_0.012_195)] via-white to-[oklch(0.99_0.008_255)]",
  },
  {
    borderTop: "border-t-[oklch(0.48_0.10_152)]",
    iconBg:
      "bg-[oklch(0.96_0.03_152)] ring-1 ring-inset ring-[oklch(0.48_0.08_152/0.22)]",
    iconFg: "text-[oklch(0.34_0.10_152)]",
    cardBg:
      "bg-gradient-to-b from-[oklch(0.995_0.012_152)] via-white to-[oklch(0.99_0.008_255)]",
  },
  {
    borderTop: "border-t-[oklch(0.52_0.10_230)]",
    iconBg:
      "bg-[oklch(0.96_0.03_230)] ring-1 ring-inset ring-[oklch(0.52_0.08_230/0.2)]",
    iconFg: "text-[oklch(0.38_0.10_230)]",
    cardBg:
      "bg-gradient-to-b from-[oklch(0.995_0.012_230)] via-white to-[oklch(0.99_0.008_255)]",
  },
] as const;

const benefits = [
  {
    icon: Users,
    title: "Qualifizierte Kandidaten",
    desc: "Zugang zu motivierten, vorbereiteten Kandidaten mit Sprachzertifikat und fachlicher Ausbildung.",
  },
  {
    icon: FileCheck,
    title: "Strukturierter Prozess",
    desc: "Von der Auswahl über die Vorbereitung bis zur Integration – alles aus einer Hand.",
  },
  {
    icon: Clock,
    title: "Planungssicherheit",
    desc: "Klare Abläufe und verlässliche Zeitpläne für Ihren Personalbedarf.",
  },
  {
    icon: ShieldCheck,
    title: "Rechtssicherheit",
    desc: "Begleitung bei Visum, Behörden und Vertragsgestaltung – Sie sind auf der sicheren Seite.",
  },
];

const services = [
  {
    icon: GraduationCap,
    title: "Ausbildung (Azubis aus Vietnam)",
    desc: "Nachhaltige Fachkräftesicherung durch motivierte und vorbereitete Auszubildende. Wir übernehmen Auswahl, Vorbereitung und den gesamten Vermittlungsprozess.",
  },
  {
    icon: Users,
    title: "Qualifizierte Fachkräfte",
    desc: "Direkt einsetzbare Mitarbeiter mit anerkannten Qualifikationen und relevanter Berufserfahrung.",
  },
  {
    icon: Clock,
    title: "Kurzfristige Beschäftigung (bis zu 8 Monate)",
    desc: "Flexible und rechtssichere Lösung bei akutem Personalbedarf.",
  },
] as const;

const industries = [
  {
    icon: UtensilsCrossed,
    title: "Gastronomie & Hotellerie",
    desc: "Zuverlässige Lösungen für Küchen, Service und Ausbildung – von Auszubildenden bis zu Fachkräften.",
    image: "/schwerpunkt/köchin.png",
  },
  {
    icon: HeartPulse,
    title: "Pflege & Gesundheitswesen",
    desc: "Nachhaltige Personalgewinnung mit qualifizierten und vorbereiteten Fachkräften.",
    image: "/schwerpunkt/pflege.png",
  },
];

function FadeSection({
  children,
  className = "",
  bordered = true,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
} & React.ComponentProps<"section">) {
  return (
    <section
      className={`relative overflow-hidden ${bordered ? "border-t border-border" : ""} ${homeSectionY} ${className}`.trim()}
      {...rest}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{ background: homeBlueGreenFadeBackground }}
      />
      <div className={`relative z-10 ${homeSectionInset}`}>{children}</div>
    </section>
  );
}

export default function ForEmployersPage() {
  return (
    <div
      className="font-[var(--font-body)]"
      id="main-content"
      aria-label="Für Arbeitgeber – Lotus&Eagle"
    >
      {/* Hero — gleicher Verlauf + Typo wie Home */}
      <section
        className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
        aria-labelledby="employer-hero-heading"
      >
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{ background: homeBlueGreenFadeBackground }}
        />
        <div className={`relative z-10 ${homeSectionInset}`}>
          <div className="mx-auto max-w-3xl text-center">
            <h1
              id="employer-hero-heading"
              className="font-[var(--font-display)] text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Fachkräfte nachhaltig{" "}
              <span className="text-[oklch(0.50_0.11_195)]">sichern</span>
            </h1>
            <p
              className={`mt-6 text-lg leading-relaxed sm:text-[1.0625rem] ${homeBodyMuted}`}
            >
              Lotus&Eagle ist Ihr strategischer Partner für die Gewinnung
              internationaler Fachkräfte aus Vietnam. Wir begleiten den gesamten
              Prozess – von der Auswahl bis zur erfolgreichen Integration in Ihr
              Unternehmen.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Button
                size="lg"
                asChild
                className="h-12 min-h-12 px-8 text-base font-semibold shadow-sm bg-[oklch(0.28_0.06_255)] text-white hover:bg-[oklch(0.22_0.06_255)]"
              >
                <Link
                  href="/auth/register/employer"
                  className="inline-flex items-center justify-center gap-2"
                >
                  Kostenlose Erstberatung
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
              </Button>
              <Button
                size="lg"
                asChild
                className="h-12 min-h-12 px-8 text-base font-semibold bg-[oklch(0.50_0.11_195)] text-white shadow-sm hover:bg-[oklch(0.44_0.11_195)]"
              >
                <Link href="/auth/register/employer">Fachkräfte anfragen</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <FadeSection aria-labelledby="benefits-heading">
        <div className="mx-auto max-w-3xl text-center">
          <p
            className={`text-xs font-medium uppercase tracking-[0.2em] ${homeEyebrow}`}
          >
            Ihr Nutzen
          </p>
          <h2
            id="benefits-heading"
            className={`mt-3 font-[var(--font-display)] text-2xl font-semibold tracking-tight sm:text-3xl ${homeH2}`}
          >
            Ihre Vorteile mit Lotus&Eagle
          </h2>
          <div
            className="mx-auto mt-5 h-0.5 w-12 rounded-full bg-[oklch(0.50_0.11_195)]"
            aria-hidden
          />
          <p className={`mt-7 text-base leading-[1.65] sm:text-[1.0625rem] ${homeBodyMuted}`}>
            Wir liefern nicht nur Personal – wir liefern Lösungen für nachhaltige
            Personalstrukturen.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div key={benefit.title} className={benefitCardFrame}>
              <div className={benefitIconWrap}>
                <benefit.icon className={benefitIconClass} aria-hidden />
              </div>
              <h3
                className={`mt-4 font-[var(--font-display)] text-lg font-semibold leading-snug ${homeH2}`}
              >
                {benefit.title}
              </h3>
              <p
                className={`mt-2 text-sm leading-relaxed sm:text-[0.9375rem] ${homeBodyMuted}`}
              >
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>
      </FadeSection>

      <FadeSection aria-labelledby="solutions-heading">
        <header className="text-center">
          <h2
            id="solutions-heading"
            className={`font-[var(--font-display)] text-2xl font-semibold tracking-tight sm:text-3xl ${homeH2}`}
          >
            Unsere Lösungen für Ihren Personalbedarf
          </h2>
          <div
            className="mx-auto mt-5 h-0.5 w-12 rounded-full bg-[oklch(0.50_0.11_195)]"
            aria-hidden
          />
          <p
            className={`mx-auto mt-7 max-w-2xl text-base leading-[1.65] sm:text-[1.0625rem] ${homeBodyMuted}`}
          >
            Drei klare Wege – passend zu Ihrem Bedarf.
          </p>
        </header>
        <ul
          className="mt-10 grid w-full list-none grid-cols-1 gap-5 p-0 sm:mt-12 sm:gap-6 md:grid-cols-3 md:items-stretch md:gap-6"
          aria-labelledby="solutions-heading"
        >
          {services.map((service, index) => {
            const accent = offerCardAccents[index]!;
            return (
              <li
                key={service.title}
                className={`group flex h-full min-h-0 w-full flex-col items-center rounded-2xl border border-border/60 ${accent.borderTop} border-t-[3px] ${accent.cardBg} px-6 py-8 text-center shadow-[0_1px_2px_oklch(0_0_0/0.04)] transition-[box-shadow,border-color] duration-300 hover:border-border hover:shadow-[0_12px_40px_-8px_oklch(0.25_0.04_255/0.12)] md:min-h-full`}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-[1.03] ${accent.iconBg}`}
                >
                  <service.icon
                    className={`h-6 w-6 sm:h-7 sm:w-7 ${accent.iconFg}`}
                    aria-hidden
                  />
                </div>
                <h3
                  className={`mt-5 text-balance font-[var(--font-display)] text-lg font-semibold leading-snug tracking-tight ${homeH2}`}
                >
                  {service.title}
                </h3>
                <p
                  className={`mt-3 flex-1 text-sm leading-relaxed sm:text-[0.9375rem] ${homeBodyMuted}`}
                >
                  {service.desc}
                </p>
              </li>
            );
          })}
        </ul>
      </FadeSection>

      <FadeSection aria-labelledby="industries-heading">
        <div className="mx-auto max-w-3xl text-center">
          <p
            className={`text-xs font-medium uppercase tracking-[0.2em] ${homeEyebrow}`}
          >
            Branchen
          </p>
          <h2
            id="industries-heading"
            className={`mt-3 font-[var(--font-display)] text-2xl font-semibold tracking-tight sm:text-3xl ${homeH2}`}
          >
            Unsere Fokusbranchen
          </h2>
          <div
            className="mx-auto mt-5 h-0.5 w-12 rounded-full bg-[oklch(0.50_0.11_195)]"
            aria-hidden
          />
          <p className={`mt-7 text-base leading-[1.65] sm:text-[1.0625rem] ${homeBodyMuted}`}>
            Spezialisiert auf die Bereiche mit dem größten Fachkräftebedarf.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          {industries.map((industry) => (
            <article
              key={industry.title}
              className="home-card-hover overflow-hidden rounded-2xl border border-border/80 bg-white/80 shadow-[0_1px_2px_oklch(0_0_0/0.04)] backdrop-blur-[2px]"
            >
              <div className="h-1.5 w-full bg-[oklch(0.55_0.10_195)]" />
              <div className="relative h-56 w-full overflow-hidden sm:h-64">
                <Image
                  src={industry.image}
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white/95 to-transparent" />
              </div>
              <div className="p-6">
                <div className="flex items-start gap-3">
                  <industry.icon
                    className="mt-0.5 h-6 w-6 shrink-0 text-[oklch(0.45_0.11_195)]"
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <h3
                      className={`font-[var(--font-display)] text-lg font-semibold leading-snug ${homeH2}`}
                    >
                      {industry.title}
                    </h3>
                    <p
                      className={`mt-2 text-sm leading-relaxed sm:text-[0.9375rem] ${homeBodyMuted}`}
                    >
                      {industry.desc}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p
          className={`mt-10 text-center text-sm leading-relaxed ${homeBodyMuted}`}
        >
          Weitere Branchen wie Logistik, Bau, Einzelhandel oder Dienstleistungen
          auf Anfrage.
        </p>
      </FadeSection>

      <FadeSection aria-labelledby="more-heading">
        <div className="mx-auto max-w-3xl">
          <h2
            id="more-heading"
            className={`text-center font-[var(--font-display)] text-2xl font-semibold tracking-tight sm:text-3xl ${homeH2}`}
          >
            Mehr als klassische Vermittlung
          </h2>
          <div
            className="mx-auto mt-5 h-0.5 w-12 rounded-full bg-[oklch(0.50_0.11_195)]"
            aria-hidden
          />
          <p
            className={`mt-7 text-center text-base leading-[1.65] sm:text-[1.0625rem] ${homeBodyMuted}`}
          >
            Wir unterstützen Sie ganzheitlich über die reine Personalvermittlung
            hinaus:
          </p>
          <ul className="mx-auto mt-8 max-w-xl space-y-4">
            {[
              "Visum- und Behördenmanagement",
              "Sprachliche Vorbereitung der Kandidaten",
              "Unterstützung bei Integration und Onboarding",
              "Persönliche Betreuung während der gesamten Zusammenarbeit",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 shrink-0 text-[oklch(0.50_0.11_195)]"
                  aria-hidden
                />
                <span className={`text-base leading-relaxed ${homeBodyMuted}`}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </FadeSection>

      {/* CTA — wie Home-Schlussblock */}
      <section
        className={`relative overflow-hidden border-t border-white/10 bg-[oklch(0.14_0.035_260)] ${homeSectionY}`}
        aria-labelledby="employer-cta-heading"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.28]"
          style={{
            background:
              "radial-gradient(ellipse 75% 85% at 50% 40%, oklch(0.48 0.11 195 / 0.45), transparent 72%)",
          }}
          aria-hidden
        />
        <div className={`relative ${homeSectionInset} text-center`}>
          <div className="mx-auto max-w-2xl">
            <h2
              id="employer-cta-heading"
              className="font-[var(--font-display)] text-2xl font-semibold tracking-tight text-white sm:text-3xl"
            >
              Sichern Sie Ihre Fachkräfte von morgen – heute.
            </h2>
            <p className="mt-3 text-base text-[oklch(0.88_0.01_260)]">
              Lassen Sie sich unverbindlich beraten und erfahren Sie, wie wir Sie
              bei der Lösung Ihres Personalbedarfs unterstützen können.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Button
                size="lg"
                asChild
                className="h-12 min-h-12 px-8 text-base font-semibold w-full sm:w-auto bg-[oklch(0.50_0.11_195)] text-white shadow-md hover:bg-[oklch(0.44_0.11_195)]"
              >
                <Link href="/auth/register/employer">
                  Kostenlose Erstberatung sichern
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-12 min-h-12 px-8 text-base font-semibold w-full sm:w-auto border-2 border-white/55 bg-transparent text-white hover:bg-white/12 hover:text-white"
              >
                <Link href="/contact">Jetzt Kontakt aufnehmen</Link>
              </Button>
            </div>
            <a
              href={`https://wa.me/${CONTACT_PHONE_TEL.replace("+", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[oklch(0.85_0.02_260)] transition-colors hover:text-white"
            >
              <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden />
              Oder direkt per WhatsApp schreiben
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
