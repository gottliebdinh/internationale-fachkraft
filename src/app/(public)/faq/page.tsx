"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  title: string;
  items: FaqItem[];
}

const faqCategories: FaqCategory[] = [
  {
    title: "Allgemein",
    items: [
      {
        question: "Was ist GeVin?",
        answer:
          "GeVin ist eine professionelle Plattform für die Vermittlung vietnamesischer Fachkräfte und Auszubildender an deutsche Unternehmen. Wir decken den gesamten Prozess ab – von der Kandidatensuche über die IHK-konforme Dokumentenerstellung bis zur Visa-Beantragung und Ankunft in Deutschland.",
      },
      {
        question: "Wer kann die Plattform nutzen?",
        answer:
          "GeVin richtet sich an zwei Hauptgruppen: Deutsche Arbeitgeber, die qualifizierte Fachkräfte oder Auszubildende suchen, und vietnamesische Berufsschulen, die ihre Absolvent/innen mit deutschen Unternehmen verbinden möchten. Einzelbewerber können sich über ihre Partnerschule registrieren.",
      },
      {
        question: "In welchen Branchen vermittelt GeVin?",
        answer:
          "Aktuell konzentrieren wir uns auf drei Branchen mit besonders hohem Fachkräftebedarf: Hotellerie & Gastronomie, Friseurhandwerk und Pflege. Wir planen, das Angebot in Zukunft auf weitere Branchen auszuweiten.",
      },
      {
        question: "Ist die Plattform kostenlos?",
        answer:
          "Die Registrierung und die Suche nach Kandidaten sind für Arbeitgeber kostenlos. Vermittlungsgebühren fallen erst bei einer erfolgreichen Platzierung an. Kontaktieren Sie uns für Details zu unserem Preismodell.",
      },
    ],
  },
  {
    title: "Für Arbeitgeber",
    items: [
      {
        question: "Wie lange dauert eine Vermittlung?",
        answer:
          "Von der Registrierung bis zur Ankunft des Kandidaten in Deutschland dauert der Prozess in der Regel 4–8 Monate. Die genaue Dauer hängt von der Visumsbearbeitung, der IHK-Prüfung und der individuellen Situation des Kandidaten ab.",
      },
      {
        question: "Was kostet die Vermittlung?",
        answer:
          "Unsere Preise richten sich nach der Anzahl der Platzierungen und Ihren individuellen Anforderungen. Die Registrierung und Kandidatensuche sind kostenlos. Kontaktieren Sie uns für ein maßgeschneidertes Angebot.",
      },
      {
        question: "Welche Dokumente werden für die IHK benötigt?",
        answer:
          "Die Plattform erstellt automatisch alle erforderlichen IHK-Dokumente: Berufsausbildungsvertrag, Erklärung zum Beschäftigungsverhältnis, Ausbildungsplan und weitere Pflichtdokumente. Sie müssen lediglich die Firmendaten und Stellendetails eingeben.",
      },
      {
        question: "Welches Sprachniveau haben die Kandidaten?",
        answer:
          "Alle Kandidaten auf der Plattform verfügen über mindestens ein B1-Sprachzertifikat in Deutsch. Viele bringen bereits B2-Kenntnisse mit. Die Sprachausbildung erfolgt an unseren zertifizierten Partnerschulen in Vietnam.",
      },
      {
        question: "Kann ich Video-Interviews mit Kandidaten führen?",
        answer:
          "Ja, die Plattform unterstützt die Koordination von Video-Interviews. Sie können direkt über das Dashboard Interview-Termine mit Kandidaten vereinbaren.",
      },
      {
        question: "Arbeitet GeVin mit Arbeitnehmerüberlassung?",
        answer:
          "Nein. Wir arbeiten im Vermittlungsmodell ohne Arbeitnehmerüberlassung. Die Kandidaten werden direkt bei Ihrem Unternehmen angestellt – wir vermitteln und begleiten den Prozess, überlassen aber keine Arbeitnehmer.",
      },
    ],
  },
  {
    title: "Für Schulen",
    items: [
      {
        question: "Wie wird man GeVin-Partnerschule?",
        answer:
          "Kontaktieren Sie uns über das Kontaktformular oder per E-Mail. Wir prüfen Ihre Einrichtung anhand unserer Qualitätskriterien und führen ein Onboarding durch. Voraussetzungen sind u. a. staatliche Anerkennung, ein B1-Sprachcurriculum und Erfahrung in relevanten Berufsfeldern.",
      },
      {
        question: "Welche Voraussetzungen muss unsere Schule erfüllen?",
        answer:
          "Ihre Schule muss eine staatlich anerkannte Bildungseinrichtung in Vietnam sein, ein Curriculum zur Vermittlung deutscher Sprachkenntnisse (mind. B1) anbieten und Erfahrung in der Ausbildung für Hotellerie, Friseurhandwerk oder Pflege haben.",
      },
      {
        question: "Wie laden wir Kandidatenprofile hoch?",
        answer:
          "Nach dem Onboarding erhalten Sie Zugang zum Schul-Dashboard. Dort können Sie Profile für Ihre Absolvent/innen erstellen und Dokumente wie Sprachzertifikate, Lebensläufe und Qualifikationsnachweise hochladen.",
      },
    ],
  },
  {
    title: "Rechtliches",
    items: [
      {
        question: "Ist GeVin DSGVO-konform?",
        answer:
          "Ja, GeVin ist vollständig DSGVO-konform. Alle personenbezogenen Daten werden verschlüsselt gespeichert und verarbeitet. Wir führen regelmäßige Audits durch und stellen sicher, dass alle Datenschutzanforderungen eingehalten werden. Weitere Details finden Sie in unserer Datenschutzerklärung.",
      },
      {
        question: "Welche Anforderungen stellt das Fachkräfteeinwanderungsgesetz (FEG)?",
        answer:
          "Das FEG regelt die Einwanderung qualifizierter Fachkräfte nach Deutschland. GeVin unterstützt den gesamten FEG-konformen Prozess, einschließlich der Anerkennung von Berufsabschlüssen, der Sprachzertifizierung und der Erstellung aller erforderlichen Dokumente für die Visumsbeantragung.",
      },
      {
        question: "Wie werden unsere Daten geschützt?",
        answer:
          "Wir setzen auf verschlüsselte Dokumentenspeicherung, strenge Zugriffskontrollen, Audit-Logs und regelmäßige Sicherheitsüberprüfungen. Alle Server befinden sich in der EU. Detaillierte Informationen finden Sie in unserer Datenschutzerklärung.",
      },
    ],
  },
];

function FaqDisclosure({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium hover:text-accent transition-colors"
      >
        {question}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          open ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FaqPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Häufig gestellte{" "}
              <span className="text-accent">Fragen</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Hier finden Sie Antworten auf die häufigsten Fragen rund um
              GeVin, den Vermittlungsprozess und unsere Plattform.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-10">
            {faqCategories.map((category) => (
              <div key={category.title}>
                <h2 className="text-xl font-bold mb-4">{category.title}</h2>
                <div className="rounded-xl bg-card ring-1 ring-foreground/10 px-4">
                  {category.items.map((item) => (
                    <FaqDisclosure
                      key={item.question}
                      question={item.question}
                      answer={item.answer}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still have questions */}
      <section className="py-20 bg-muted/20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-4">
            Ihre Frage war nicht dabei?
          </h2>
          <p className="text-muted-foreground mb-8">
            Kontaktieren Sie uns direkt – wir helfen Ihnen gerne weiter.
          </p>
          <Button
            size="lg"
            asChild
            className="h-12 min-h-12 px-8 text-base font-semibold shadow-sm bg-[oklch(0.28_0.06_255)] text-white hover:bg-[oklch(0.22_0.06_255)]"
          >
            <Link href="/contact">Kontakt aufnehmen</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
