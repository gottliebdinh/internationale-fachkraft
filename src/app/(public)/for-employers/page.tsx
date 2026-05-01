import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Award,
  Clock,
  FileCheck,
  Hammer,
  HeartPulse,
  Hotel,
  ShieldCheck,
  Store,
  Users,
  UtensilsCrossed,
  GraduationCap,
} from "lucide-react";
import type { Metadata } from "next";
import { CONTACT_WHATSAPP_ERSTBERATUNG_URL } from "@/lib/contact-info";

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

/** Wie Startseite „Unser strukturierter Prozess“ (Petrol + Grün + Gold) */
const homeProcessFadeBackground = `
  radial-gradient(ellipse 65% 60% at 10% 18%, oklch(0.58 0.09 195 / 0.22), transparent 68%),
  radial-gradient(ellipse 65% 60% at 92% 88%, oklch(0.52 0.08 152 / 0.18), transparent 68%),
  radial-gradient(ellipse 58% 52% at 50% 48%, oklch(0.78 0.11 80 / 0.16), transparent 62%),
  oklch(0.992 0.008 255)
`;

/** Kacheln in dunkelblauer Sektion (wie Startseite „Die Herausforderung“) */
const benefitCardFrameOnDark =
  "rounded-2xl border border-white/15 bg-white/[0.06] px-6 py-7 shadow-[inset_0_1px_0_0_oklch(1_0_0/0.06)]";
const benefitIconWrapOnDark =
  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-inset ring-white/15";
const benefitIconClassOnDark = "h-6 w-6 text-white/90";

/** Gold-Sektion & Karten (wie Startseite „Warum LOTUS & EAGLE“) */
const solutionsGoldSection =
  "border-t border-[oklch(0.42_0.06_78)]/35 bg-[oklch(0.30_0.065_78)]";
const solutionsGoldCard =
  "group flex h-full min-h-0 w-full flex-col items-center rounded-2xl border border-[oklch(0.50_0.07_78)]/40 border-t-[3px] border-t-[oklch(0.72_0.13_82)] bg-[oklch(0.26_0.052_78)] px-6 py-8 text-center shadow-[inset_0_1px_0_0_oklch(0.72_0.13_82/0.12)] transition-[box-shadow,border-color] duration-300 hover:border-[oklch(0.72_0.13_82)]/35 hover:shadow-[0_12px_40px_-8px_oklch(0.15_0.04_78/0.35)] md:min-h-full";
const solutionsGoldIconWrap =
  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[oklch(0.42_0.08_78)]/45 ring-1 ring-inset ring-[oklch(0.72_0.13_82)]/25 transition-transform duration-300 group-hover:scale-[1.03]";
const solutionsGoldIconClass =
  "h-6 w-6 sm:h-7 sm:w-7 text-[oklch(0.82_0.10_82)]";

/** Wie Startseite „Unser strukturierter Prozess“ */
const processSteps: {
  step: string;
  title: string;
  detail?: string;
}[] = [
  {
    step: "01",
    title: "Aussuchen des Kandidaten",
    detail: "Gezielte Auswahl passender Profile für Ihren Betrieb.",
  },
  {
    step: "02",
    title: "Kennenlernen per Video Call",
    detail: "Persönliches Kennenlernen des Kandidaten digital und unkompliziert.",
  },
  {
    step: "03",
    title: "Unterlagen vorbereiten (Arbeitsverhältnis)",
    detail: "Verträge und Unterlagen für das Arbeitsverhältnis – strukturiert und vollständig.",
  },
  {
    step: "04",
    title: "Visum beantragen",
    detail: "Antrag und Behördenweg begleitet – Sie bleiben entlastet.",
  },
  {
    step: "05",
    title: "Azubis kommen in der Stadt an",
    detail: "Die Auszubildenden treffen an Ihrem Ort ein – bereit für den Start.",
  },
];

const processStepColStart = [
  "lg:col-start-1",
  "lg:col-start-2",
  "lg:col-start-3",
  "lg:col-start-4",
  "lg:col-start-5",
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
  {
    icon: Award,
    title: "Vietnamesische Arbeitsmoral",
    desc: "Zuverlässigkeit und Einsatzbereitschaft – klare Pluspunkte im Alltag.",
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

const industries: {
  icon: typeof UtensilsCrossed;
  title: string;
  desc: string;
  /** Ohne Bild: Icon-Bereich mit Verlauf */
  image?: string;
}[] = [
  {
    icon: UtensilsCrossed,
    title: "Gastronomie",
    desc: "Küche, Service und Ausbildung – von Auszubildenden bis zu erfahrenen Fachkräften.",
    image: "/schwerpunkt/köchin.png",
  },
  {
    icon: Hotel,
    title: "Hotellerie",
    desc: "Front Office, Housekeeping und Empfang – zuverlässige Teams für Ihren Betrieb.",
  },
  {
    icon: HeartPulse,
    title: "Gesundheitsbranche",
    desc: "Pflege und medizinisches Umfeld – qualifizierte, vorbereitete Fachkräfte.",
    image: "/schwerpunkt/pflege.png",
  },
  {
    icon: Hammer,
    title: "Handwerk",
    desc: "Gewerke mit klarem Qualitätsanspruch – von Montage bis zu spezialisierten Berufen.",
  },
  {
    icon: Store,
    title: "Einzelhandel",
    desc: "Verkauf, Lager und Kundenservice – flexibel besetzbar bei Bedarf.",
  },
];

function FadeSection({
  children,
  className = "",
  bordered = true,
  fade = "blueGreen",
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
  /** `process` = wie Hero / „Unser strukturierter Prozess“ (Petrol + Grün + Gold) */
  fade?: "blueGreen" | "process";
} & Omit<React.ComponentProps<"section">, "children">) {
  const fadeBg =
    fade === "process"
      ? homeProcessFadeBackground
      : homeBlueGreenFadeBackground;

  return (
    <section
      className={`relative overflow-hidden ${bordered ? "border-t border-border" : ""} ${homeSectionY} ${className}`.trim()}
      {...rest}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{ background: fadeBg }}
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
      {/* Hero — Hintergrund wie Startseite „Unser strukturierter Prozess“ */}
      <section
        className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
        aria-labelledby="employer-hero-heading"
      >
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{ background: homeProcessFadeBackground }}
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
                <a
                  href={CONTACT_WHATSAPP_ERSTBERATUNG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2"
                >
                  Kostenlose Erstberatung
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </a>
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

      <section
        className={`border-t border-white/10 bg-[oklch(0.22_0.06_255)] ${homeSectionY}`}
        aria-labelledby="benefits-heading"
      >
        <div className={homeSectionInset}>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/75">
              Ihr Nutzen
            </p>
            <h2
              id="benefits-heading"
              className="mt-3 font-[var(--font-display)] text-2xl font-semibold tracking-tight text-white sm:text-3xl"
            >
              Ihre Vorteile mit Lotus&Eagle
            </h2>
            <div
              className="mx-auto mt-5 h-0.5 w-12 rounded-full bg-white/35"
              aria-hidden
            />
            <p className="mt-7 text-base leading-[1.65] text-white/88 sm:text-[1.0625rem]">
              Wir liefern nicht nur Personal – wir liefern Lösungen für nachhaltige
              Personalstrukturen und setzen dabei bewusst auf die ausgeprägte
              Arbeitsmoral vietnamesischer Fachkräfte.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {benefits.map((benefit) => (
              <div key={benefit.title} className={benefitCardFrameOnDark}>
                <div className={benefitIconWrapOnDark}>
                  <benefit.icon className={benefitIconClassOnDark} aria-hidden />
                </div>
                <h3 className="mt-4 font-[var(--font-display)] text-lg font-semibold leading-snug text-white">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80 sm:text-[0.9375rem]">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`relative overflow-hidden border-t border-border ${homeSectionY}`}
        aria-labelledby="employer-process-heading"
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
              id="employer-process-heading"
              className={`mt-3 font-[var(--font-display)] text-2xl font-semibold tracking-tight sm:text-3xl ${homeH2}`}
            >
              Unser strukturierter Prozess
            </h2>
            <div
              className="mx-auto mt-5 h-1 w-12 rounded-full bg-[oklch(0.50_0.11_195)]"
              aria-hidden
            />
            <p
              className={`mt-7 text-base leading-[1.65] sm:text-[1.0625rem] ${homeBodyMuted}`}
            >
              Von der Auswahl bis zur Ankunft der Auszubildenden in Ihrer Stadt –
              klar strukturiert und aus einer Hand begleitet.
            </p>
          </div>

          <div className="relative mt-12 sm:mt-14">
            <div
              className="pointer-events-none absolute left-[10%] right-[10%] top-[1.375rem] z-0 hidden h-1 rounded-full bg-[oklch(0.50_0.11_195)]/40 lg:block"
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

          <div
            className="mx-auto mt-12 max-w-5xl"
            role="group"
            aria-label="Zeitlicher Ablauf: Schritte 1 bis 4 in etwa 1,5 Wochen, von Schritt 4 bis zur Ankunft in Schritt 5 typischerweise 3 bis 4 weitere Wochen."
          >
            <p
              className={`mb-6 text-center text-xs font-medium uppercase tracking-[0.18em] ${homeEyebrow}`}
            >
              Zeitlicher Ablauf
            </p>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-x-2 lg:gap-y-0 xl:gap-x-3 2xl:gap-x-4">
              <div className="flex flex-col lg:col-span-4">
                <div
                  className="h-[4px] w-full rounded-full bg-[oklch(0.42_0.11_195)] shadow-[0_1px_0_oklch(0.55_0.11_195/0.35)]"
                  aria-hidden
                />
                <div className="mt-4 space-y-1 text-center lg:text-left lg:pl-1">
                  <p className="text-sm font-semibold text-[oklch(0.28_0.06_255)]">
                    ca. 1,5 Wochen
                  </p>
                  <p className={`text-xs leading-relaxed sm:text-sm ${homeBodyMuted}`}>
                    für Schritte 1 bis 4 (Auswahl bis Visumsantrag)
                  </p>
                </div>
              </div>
              <div className="flex flex-col border-t border-dashed border-[oklch(0.50_0.11_195)]/45 pt-8 lg:col-span-1 lg:border-l lg:border-t-0 lg:pt-0 lg:pl-4 xl:pl-5">
                <div
                  className="h-[4px] w-full rounded-full bg-[oklch(0.55_0.11_195)]"
                  aria-hidden
                />
                <div className="mt-4 space-y-1 text-center lg:text-left">
                  <p className="text-sm font-semibold text-[oklch(0.28_0.06_255)]">
                    3–4 Wochen
                  </p>
                  <p className={`text-xs leading-relaxed sm:text-sm ${homeBodyMuted}`}>
                    von Schritt 4 bis zur Ankunft (Schritt 5)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className={`${solutionsGoldSection} ${homeSectionY}`}
        aria-labelledby="solutions-heading"
      >
        <div className={homeSectionInset}>
          <header className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[oklch(0.88_0.04_88)]">
              Ihr Personalbedarf
            </p>
            <div
              className="mx-auto mt-4 h-0.5 w-12 rounded-full bg-[oklch(0.72_0.13_82)]"
              aria-hidden
            />
            <h2
              id="solutions-heading"
              className="mt-4 font-[var(--font-display)] text-2xl font-semibold tracking-tight text-[oklch(0.98_0.015_95)] sm:text-3xl"
            >
              Unsere Lösungen für Ihren Personalbedarf
            </h2>
            <p className="mx-auto mt-7 max-w-2xl text-base leading-[1.65] text-[oklch(0.94_0.025_92)] sm:text-[1.0625rem]">
              Drei klare Wege – passend zu Ihrem Bedarf.
            </p>
          </header>
          <ul
            className="mt-10 grid w-full list-none grid-cols-1 gap-5 p-0 sm:mt-12 sm:gap-6 md:grid-cols-3 md:items-stretch md:gap-6"
            aria-labelledby="solutions-heading"
          >
            {services.map((service) => (
              <li key={service.title} className={solutionsGoldCard}>
                <div className={solutionsGoldIconWrap}>
                  <service.icon
                    className={solutionsGoldIconClass}
                    aria-hidden
                  />
                </div>
                <h3 className="mt-5 text-balance font-[var(--font-display)] text-lg font-semibold leading-snug tracking-tight text-[oklch(0.99_0.01_95)]">
                  {service.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[oklch(0.94_0.025_92)] sm:text-[0.9375rem]">
                  {service.desc}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FadeSection fade="process" aria-labelledby="industries-heading">
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
        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-6 xl:gap-x-10 xl:gap-y-10">
          {industries.map((industry, index) => (
            <article
              key={industry.title}
              className={[
                "home-card-hover overflow-hidden rounded-2xl border border-border/80 bg-white/80 shadow-[0_1px_2px_oklch(0_0_0/0.04)] backdrop-blur-[2px]",
                "xl:col-span-2",
                index === 3 ? "xl:col-start-2" : "",
                index === 4 ? "xl:col-start-4" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="h-1.5 w-full bg-[oklch(0.55_0.10_195)]" />
              <div className="relative h-56 w-full overflow-hidden sm:h-64">
                {industry.image ? (
                  <>
                    <Image
                      src={industry.image}
                      alt=""
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white/95 to-transparent" />
                  </>
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[oklch(0.97_0.035_195)] via-[oklch(0.98_0.02_255)] to-[oklch(0.94_0.045_195)]"
                    aria-hidden
                  >
                    <industry.icon className="h-[4.5rem] w-[4.5rem] text-[oklch(0.55_0.11_195)]/45 sm:h-20 sm:w-20" />
                  </div>
                )}
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
          className={`mt-12 text-center text-sm leading-relaxed ${homeBodyMuted}`}
        >
          Weitere Branchen wie Logistik, Bau oder Dienstleistungen auf Anfrage.
        </p>
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
                <a
                  href={CONTACT_WHATSAPP_ERSTBERATUNG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Kostenlose Erstberatung sichern
                </a>
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
          </div>
        </div>
      </section>
    </div>
  );
}
