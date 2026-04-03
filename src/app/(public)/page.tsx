import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  GraduationCap,
  Users,
  Globe,
  Briefcase,
  Clock,
  ShieldCheck,
  Network,
  Lightbulb,
} from "lucide-react";
import type { Metadata } from "next";
import { getPublicSiteUrl } from "@/lib/site-url";
import { CONTACT_PHONE_TEL } from "@/lib/contact-info";

const siteUrl = getPublicSiteUrl();

export const metadata: Metadata = {
  title: "Lotus&Eagle – Fachkräfte aus Vietnam für deutsche Unternehmen",
  description:
    "Ihr strategischer Partner für die Gewinnung qualifizierter Fachkräfte und Auszubildender aus Vietnam – von der Auswahl bis zur erfolgreichen Integration.",
  openGraph: {
    title: "Lotus&Eagle – Fachkräfte aus Vietnam für deutsche Unternehmen",
    description:
      "Wir unterstützen deutsche Unternehmen bei der Gewinnung qualifizierter Auszubildender und Fachkräfte – von der Auswahl bis zur erfolgreichen Integration.",
    url: siteUrl,
  },
  alternates: { canonical: siteUrl },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Lotus&Eagle",
      url: siteUrl,
      description:
        "Strategischer Partner für die Gewinnung internationaler Fachkräfte aus Vietnam für deutsche Unternehmen.",
      areaServed: [
        { "@type": "Country", name: "Deutschland" },
        { "@type": "Country", name: "Vietnam" },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Lotus&Eagle – Fachkräfte aus Vietnam",
      description:
        "Strategischer Partner für die nachhaltige Gewinnung von Fachkräften und Auszubildenden aus Vietnam.",
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "de-DE",
    },
  ],
};

const coreServices = [
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

/** Pro Karte: Petrol / Partner-Grün / kühles Blau — bricht visuelle Monotonie, bleibt im Marken-OKLCH-Raum */
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

const processSteps: {
  step: string;
  title: string;
  detail?: string;
}[] = [
  {
    step: "01",
    title: "Analyse Ihres Personalbedarfs",
    detail: "Bedarf und Profil klar definieren – zielgenaue Suche.",
  },
  {
    step: "02",
    title: "Selektive Kandidatenauswahl",
    detail: "Streng selektiv: nur passende Profile, kein Massengeschäft.",
  },
  {
    step: "03",
    title: "Intensive Kandidatenvorbereitung",
    detail: "Sprache, Fachkompetenz, Kultur – fit für den Job in Deutschland.",
  },
  {
    step: "04",
    title: "Visum und Einreise",
    detail: "Behörden und Formalitäten koordiniert – Sie bleiben entlastet.",
  },
  {
    step: "05",
    title: "Integration & langfristige Betreuung",
    detail: "Einarbeitung vor Ort und Begleitung über den Start hinaus.",
  },
];

const processStepColStart = [
  "lg:col-start-1",
  "lg:col-start-2",
  "lg:col-start-3",
  "lg:col-start-4",
  "lg:col-start-5",
] as const;

/** Light-section typography — navy family + petrol accents (trust / growth, B2B) */
const homeEyebrow = "text-[oklch(0.42_0.10_255)]";
const homeH2 = "text-[oklch(0.22_0.06_255)]";
const homeBodyMuted = "text-[oklch(0.44_0.028_255)]";

/** Einheitliche Section-Höhe (vertikal) und gleicher Content-Rahmen wie Hero/Partner */
const homeSectionY = "py-20 sm:py-24";
const homeSectionInset =
  "mx-auto w-full max-w-[min(100%,1340px)] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16";

/** Leichter Blau–Grün-Verlauf (Hero) */
const homeBlueGreenFadeBackground = `
  radial-gradient(ellipse 65% 60% at 10% 18%, oklch(0.58 0.09 195 / 0.24), transparent 68%),
  radial-gradient(ellipse 65% 60% at 92% 88%, oklch(0.52 0.08 152 / 0.20), transparent 68%),
  oklch(0.992 0.008 255)
`;

/** Petrol + Partner-Grün + Gold — Prozess & Drei Angebote */
const homeProcessFadeBackground = `
  radial-gradient(ellipse 65% 60% at 10% 18%, oklch(0.58 0.09 195 / 0.22), transparent 68%),
  radial-gradient(ellipse 65% 60% at 92% 88%, oklch(0.52 0.08 152 / 0.18), transparent 68%),
  radial-gradient(ellipse 58% 52% at 50% 48%, oklch(0.78 0.11 80 / 0.16), transparent 62%),
  oklch(0.992 0.008 255)
`;

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
        aria-label="Startseite Lotus&Eagle – Fachkräfte aus Vietnam"
      >
        {/* ───── HERO ───── */}
        <section
          className="relative overflow-hidden bg-background lg:min-h-screen"
          aria-labelledby="hero-heading"
        >
          <div className="mx-auto w-full max-w-[min(100%,1340px)] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
            <div className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] lg:min-h-[calc(100vh-18rem)]">
                <div className="flex min-h-0 flex-col justify-center rounded-r-lg bg-background py-10 sm:py-12 lg:py-14">
                  <h1
                    id="hero-heading"
                    className="home-reveal home-reveal-delay-2 mt-0 font-[var(--font-display)] leading-tight tracking-tight text-foreground"
                  >
                    <span className="block text-4xl font-semibold sm:text-5xl lg:text-6xl">
                      Fachkräfte aus Vietnam
                    </span>
                    <span className="mt-2 block text-xl font-semibold leading-snug text-[oklch(0.50_0.11_195)] sm:text-2xl lg:text-3xl">
                      zuverlässig, vorbereitet und langfristig integriert.
                    </span>
                  </h1>
                  <p
                    className={`home-reveal home-reveal-delay-3 mt-6 max-w-xl text-lg leading-relaxed ${homeBodyMuted}`}
                  >
                    Wir unterstützen deutsche Unternehmen bei der Gewinnung
                    qualifizierter Auszubildender und Fachkräfte – von der
                    Auswahl bis zur erfolgreichen Integration.
                  </p>
                  <div className="home-reveal home-reveal-delay-4 mt-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
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
                      <Link href="/auth/register/employer">
                        Fachkräfte anfragen
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="relative min-h-[320px] overflow-hidden lg:min-h-0 lg:h-full">
                  <Image
                    src="/bilder/home2verticaladjust.png"
                    alt=""
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent" />
                    <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent" />
                  </div>
                </div>
              </div>

              {/* Vertrauen + Partner: unterhalb Hero-Grid, gleiche Section (wie früher IHK-Streifen) */}
              <div
                className="home-reveal home-reveal-delay-4 border-t border-border bg-background py-6 pb-8 sm:py-8 sm:pb-10"
                aria-labelledby="trust-heading"
              >
                <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between sm:gap-8 lg:gap-10">
                  <div className="min-w-0 max-w-3xl">
                    <h2
                      id="trust-heading"
                      className={`font-[var(--font-display)] text-lg font-semibold leading-snug sm:text-xl ${homeH2}`}
                    >
                      Vertrauen durch Struktur und Erfahrung
                    </h2>
                    <div
                      className={`mt-3 space-y-2 text-sm leading-relaxed sm:text-[0.9375rem] ${homeBodyMuted}`}
                    >
                      <p>
                        Wir verbinden internationale Rekrutierung mit operativer
                        Umsetzung in Deutschland.
                      </p>
                      <p>
                        Unser Ziel ist der Aufbau langfristiger Partnerschaften mit
                        Unternehmen, die auf Qualität, Verlässlichkeit und
                        nachhaltige Lösungen setzen.
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-3 sm:items-end sm:text-right">
                    <span
                      className={`text-[0.7rem] font-medium uppercase tracking-[0.12em] ${homeBodyMuted}`}
                    >
                      In Zusammenarbeit mit
                    </span>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-4 sm:justify-end">
                      <Image
                        src="/Bundesagentur_für_Arbeit/Bundesagentur_für_Arbeit_idefzv9ho6_2.svg"
                        alt="Bundesagentur für Arbeit"
                        width={140}
                        height={36}
                        className="h-8 w-auto opacity-90"
                      />
                      <Image
                        src="/hwk/id7oEa_zCN_logos.png"
                        alt="HWK"
                        width={140}
                        height={36}
                        className="h-8 w-auto opacity-90"
                      />
                      <Image
                        src="/ihk/ihk.jpeg"
                        alt="IHK"
                        width={160}
                        height={36}
                        className="h-8 w-auto opacity-90"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───── HERAUSFORDERUNG ↔ ANTWORT (wie Warum Lotus&Eagle: einheitlich dunkelblau) ───── */}
        <section
          className={`border-t border-white/10 bg-[oklch(0.22_0.06_255)] ${homeSectionY}`}
          aria-labelledby="problem-heading solution-heading"
        >
          <div className={homeSectionInset}>
            <div className="grid gap-12 lg:grid-cols-[1fr_min-content_1fr] lg:grid-rows-[auto_auto_1fr] lg:gap-x-0 lg:gap-y-0">
              <div className="min-w-0 lg:contents">
                <p className="min-w-0 text-xs font-medium uppercase tracking-[0.2em] text-white/75 lg:col-start-1 lg:row-start-1 lg:pr-8 xl:pr-12">
                  Die Herausforderung
                </p>
                <h2
                  id="problem-heading"
                  className="mt-3 min-w-0 font-[var(--font-display)] text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:col-start-1 lg:row-start-2 lg:mt-0 lg:pr-8 xl:pr-12"
                >
                  Fachkräftemangel ist längst Realität.
                </h2>
                <div className="mt-6 min-w-0 space-y-4 text-base leading-relaxed text-white/88 lg:col-start-1 lg:row-start-3 lg:mt-6 lg:pr-8 xl:pr-12">
                  <p>
                    Unbesetzte Stellen, steigende Belastung im Team und fehlende
                    Planungssicherheit – viele Unternehmen stehen heute vor
                    denselben Herausforderungen.
                  </p>
                  <p>
                    Insbesondere in der Gastronomie und im Pflegebereich wird es
                    zunehmend schwieriger, geeignetes und zuverlässiges Personal
                    zu finden.
                  </p>
                  <p className="font-medium text-white">
                    Kurzfristige Lösungen reichen nicht mehr aus – gefragt sind
                    nachhaltige Strategien.
                  </p>
                </div>
              </div>

              <div
                className="hidden w-px shrink-0 bg-white/25 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:block lg:w-px lg:self-stretch"
                aria-hidden
              />

              <div className="min-w-0 lg:contents">
                <p className="min-w-0 border-t border-white/15 pt-10 text-xs font-medium uppercase tracking-[0.2em] text-white/75 lg:col-start-3 lg:row-start-1 lg:border-t-0 lg:pt-0 lg:pl-8 xl:pl-12">
                  Unsere Antwort
                </p>
                <h2
                  id="solution-heading"
                  className="mt-3 min-w-0 font-[var(--font-display)] text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:col-start-3 lg:row-start-2 lg:mt-0 lg:pl-8 xl:pl-12"
                >
                  Wir liefern nicht nur Personal – wir liefern Lösungen.
                </h2>
                <div className="mt-6 min-w-0 space-y-4 text-base leading-relaxed text-white/88 lg:col-start-3 lg:row-start-3 lg:mt-6 lg:pl-8 xl:pl-12">
                  <p>
                    Lotus&Eagle ist Ihr strategischer Partner für die Gewinnung
                    internationaler Fachkräfte aus Vietnam.
                  </p>
                  <p>
                    Wir begleiten den gesamten Prozess: von der gezielten Auswahl
                    geeigneter Kandidaten über die sprachliche und fachliche
                    Vorbereitung bis hin zur vollständigen Integration in Ihr
                    Unternehmen.
                  </p>
                  <p className="font-medium text-white">
                    Unser Anspruch ist nicht die kurzfristige Vermittlung, sondern
                    der Aufbau stabiler und langfristiger Personalstrukturen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───── PROZESS (vormals Leistungen-Platz): klarer Ablauf ───── */}
        <section
          className={`relative overflow-hidden border-t border-border ${homeSectionY}`}
          aria-labelledby="process-heading"
        >
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{ background: homeProcessFadeBackground }}
          />
          <div className={`relative z-10 ${homeSectionInset}`}>
            <div className="mx-auto max-w-3xl text-center">
              <p
                className={`text-xs font-medium uppercase tracking-[0.2em] ${homeEyebrow}`}
              >
                Ablauf
              </p>
              <h2
                id="process-heading"
                className={`mt-3 font-[var(--font-display)] text-2xl font-semibold tracking-tight sm:text-3xl ${homeH2}`}
              >
                Unser strukturierter Prozess
              </h2>
              <div
                className="mx-auto mt-5 h-0.5 w-12 rounded-full bg-[oklch(0.50_0.11_195)]"
                aria-hidden
              />
              <p
                className={`mt-7 text-base leading-[1.65] sm:text-[1.0625rem] ${homeBodyMuted}`}
              >
                Von der Analyse bis Visum, Einreise und langfristiger Betreuung –
                der komplette Ablauf aus einer Hand.
              </p>
            </div>

            <div className="relative mt-12 sm:mt-14">
              {/* Horizontale Linie zwischen 01–05 (nur wenn alle in einer Reihe) */}
              <div
                className="pointer-events-none absolute left-[10%] right-[10%] top-6 z-0 hidden h-0.5 rounded-full bg-[oklch(0.50_0.11_195)]/40 lg:block"
                aria-hidden
              />
              <div className="relative z-[1] grid w-full grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-5 lg:grid-rows-[auto_auto_1fr] lg:gap-x-2 lg:gap-y-4 xl:gap-x-3 2xl:gap-x-4">
            {processSteps.map((item, index) => {
              const col = processStepColStart[index]!;
              return (
                <div
                  key={item.step}
                  className="flex flex-col items-center text-center lg:contents"
                >
                  <span
                    className={`relative z-[2] inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[oklch(0.42_0.11_195)] font-[var(--font-display)] text-lg font-bold text-white shadow-md ring-2 ring-[oklch(0.50_0.11_195)]/25 ${col} lg:row-start-1 lg:mt-0 lg:justify-self-center`}
                  >
                    {item.step}
                  </span>
                  <h3
                    className={`mt-3 min-w-0 max-w-[16rem] font-[var(--font-display)] text-sm font-semibold leading-snug sm:max-w-none sm:text-[0.9375rem] lg:mt-0 ${col} lg:row-start-2 ${homeH2}`}
                  >
                    {item.title}
                  </h3>
                  {item.detail ? (
                    <p
                      className={`mt-2 min-w-0 max-w-[16rem] text-balance text-xs leading-relaxed sm:max-w-none sm:text-[0.8125rem] lg:mt-0 ${col} lg:row-start-3 ${homeBodyMuted}`}
                    >
                      {item.detail}
                    </p>
                  ) : null}
                </div>
              );
            })}
              </div>
            </div>
          </div>
        </section>

        {/* ───── PARTNER: Warum Lotus&Eagle (Gold / warmes Bernstein) ───── */}
        <section
          className={`border-t border-[oklch(0.42_0.06_78)]/35 bg-[oklch(0.30_0.065_78)] ${homeSectionY}`}
          aria-labelledby="usp-heading"
        >
          <div className={homeSectionInset}>
            <header className="text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[oklch(0.88_0.04_88)]">
                Ihr Partner
              </p>
              <div
                className="mx-auto mt-4 h-0.5 w-12 rounded-full bg-[oklch(0.72_0.13_82)]"
                aria-hidden
              />
              <h2
                id="usp-heading"
                className="mt-4 font-[var(--font-display)] text-2xl font-semibold tracking-tight text-[oklch(0.98_0.015_95)] sm:text-3xl"
              >
                Warum Lotus&Eagle?
              </h2>
            </header>

            <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_min-content_1fr] lg:items-start lg:gap-0">
              <ul className="min-w-0 space-y-10 text-[oklch(0.98_0.015_95)] lg:pr-8 xl:pr-12">
                {uspItems.map((item) => (
                  <li key={item.title} className="flex gap-4 sm:gap-5">
                    <item.icon
                      className="mt-0.5 h-7 w-7 shrink-0 text-[oklch(0.82_0.10_82)] sm:h-8 sm:w-8"
                      aria-hidden
                    />
                    <div className="min-w-0">
                      <h3 className="font-[var(--font-display)] text-lg font-semibold leading-snug text-[oklch(0.99_0.01_95)]">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-[0.9375rem] leading-relaxed text-[oklch(0.94_0.025_92)]">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div
                className="hidden w-px shrink-0 self-stretch bg-[oklch(0.55_0.09_80)]/45 lg:block"
                aria-hidden
              />

              <div
                className="min-w-0 border-t border-[oklch(0.50_0.07_78)]/40 pt-10 lg:border-t-0 lg:pl-8 lg:pt-0 xl:pl-12"
                aria-labelledby="ecosystem-heading"
              >
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[oklch(0.88_0.04_88)]">
                  Qualitätssicherung
                </p>
                <h3
                  id="ecosystem-heading"
                  className="mt-3 font-[var(--font-display)] text-xl font-semibold tracking-tight text-[oklch(0.99_0.01_95)] sm:text-2xl"
                >
                  Nachhaltige Qualität durch eigene Strukturen
                </h3>
                <div className="mt-8 space-y-8 text-[oklch(0.94_0.025_92)]">
                  <div className="flex gap-4 sm:gap-5">
                    <GraduationCap
                      className="mt-0.5 h-7 w-7 shrink-0 text-[oklch(0.82_0.10_82)] sm:h-8 sm:w-8"
                      aria-hidden
                    />
                    <p className="text-[0.9375rem] leading-relaxed">
                      Wir bauen derzeit ein eigenes Ausbildungs- und Sprachsystem
                      in Vietnam und Deutschland auf, um die Qualität unserer
                      Kandidaten langfristig zu sichern.
                    </p>
                  </div>
                  <div className="flex gap-4 sm:gap-5">
                    <Globe
                      className="mt-0.5 h-7 w-7 shrink-0 text-[oklch(0.82_0.10_82)] sm:h-8 sm:w-8"
                      aria-hidden
                    />
                    <p className="text-[0.9375rem] leading-relaxed">
                      Zusätzlich entwickeln wir digitale Lösungen zur
                      Sprachförderung, um die Integration weiter zu verbessern.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───── DREI ANGEBOTE: eigene Section, große Überschrift ───── */}
        <section
          className={`relative overflow-hidden border-t border-border ${homeSectionY}`}
          aria-labelledby="offers-heading"
        >
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{ background: homeProcessFadeBackground }}
          />
          <div className={`relative z-10 ${homeSectionInset}`}>
            <header className="text-center">
              <h2
                id="offers-heading"
                className={`font-[var(--font-display)] text-2xl font-semibold tracking-tight sm:text-3xl ${homeH2}`}
              >
                Drei Angebote für Ihren Bedarf
              </h2>
              <div
                className="mx-auto mt-5 h-0.5 w-12 rounded-full bg-[oklch(0.50_0.11_195)]"
                aria-hidden
              />
            </header>

            <ul
              className="mt-10 grid w-full list-none grid-cols-1 gap-5 p-0 sm:mt-12 sm:gap-6 md:grid-cols-3 md:items-stretch md:gap-6"
              aria-labelledby="offers-heading"
            >
              {coreServices.map((service, index) => {
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
          </div>
        </section>

        {/* ───── CTA FINAL (dunkler Hintergrund wie Herausforderung/Antwort) ───── */}
        <section
          className={`relative overflow-hidden border-t border-white/10 bg-[oklch(0.14_0.035_260)] ${homeSectionY}`}
          aria-labelledby="cta-heading"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.28]"
            style={{
              background:
                "radial-gradient(ellipse 75% 85% at 50% 40%, oklch(0.48 0.11 195 / 0.45), transparent 72%)",
            }}
          />
          <div className={`relative ${homeSectionInset} text-center`}>
            <div className="mx-auto max-w-2xl">
              <h2
                id="cta-heading"
                className="font-[var(--font-display)] text-2xl font-semibold tracking-tight text-white sm:text-3xl"
              >
                Sichern Sie Ihre Fachkräfte von morgen – heute.
              </h2>
              <p className="mt-3 text-base text-[oklch(0.88_0.01_260)]">
                Lassen Sie sich unverbindlich beraten und erfahren Sie, wie wir
                Sie bei der Lösung Ihres Personalbedarfs unterstützen können.
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
              {/* WhatsApp */}
              <a
                href={`https://wa.me/${CONTACT_PHONE_TEL.replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[oklch(0.85_0.02_260)] transition-colors hover:text-white"
              >
                <ShieldCheck className="h-4 w-4" />
                Oder direkt per WhatsApp schreiben
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
