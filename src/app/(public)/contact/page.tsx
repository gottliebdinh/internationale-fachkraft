import { Button } from "@/components/ui/button";
import {
  CONTACT_EMAIL,
  CONTACT_WHATSAPP_ERSTBERATUNG_URL,
  LEGAL_ADDRESS_LINES,
  LEGAL_ENTITY_NAME,
} from "@/lib/contact-info";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontaktieren Sie LOTUS & EAGLE per WhatsApp-Erstberatung, E-Mail oder postalisch in Nürnberg.",
};

export default function ContactPage() {
  return (
    <section
      className="relative overflow-hidden border-t border-white/10 bg-[oklch(0.22_0.06_255)]"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-24 text-center sm:py-32 lg:px-8">
        <h1
          id="contact-heading"
          className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
        >
          Sprechen Sie{" "}
          <span className="text-[oklch(0.78_0.11_195)]">mit uns</span>
        </h1>

        <Button
          size="lg"
          asChild
          className="mt-10 h-12 min-h-12 px-8 text-base font-semibold shadow-sm bg-[oklch(0.50_0.11_195)] text-white hover:bg-[oklch(0.44_0.11_195)]"
        >
          <a
            href={CONTACT_WHATSAPP_ERSTBERATUNG_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Kostenlose Erstberatung
          </a>
        </Button>

        <div className="mt-12 space-y-1 text-sm leading-relaxed text-white/85">
          <p className="font-semibold text-white">{LEGAL_ENTITY_NAME}</p>
          {LEGAL_ADDRESS_LINES.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-8 text-base font-medium text-[oklch(0.82_0.11_195)] underline-offset-4 hover:text-white hover:underline"
        >
          {CONTACT_EMAIL}
        </a>
      </div>
    </section>
  );
}
