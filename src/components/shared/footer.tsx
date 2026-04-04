"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { CONTACT_PHONE_TEL } from "@/lib/contact-info";
import { BRAND_SYMBOL_SRC } from "@/lib/brand-logo";
import { cn } from "@/lib/utils";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto w-full max-w-[min(100%,1340px)] px-4 py-12 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <Link
              href="/"
              className={cn(
                "mb-4 inline-flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md sm:gap-3",
                "text-[#0A2240] dark:text-foreground",
              )}
            >
              <Image
                src={BRAND_SYMBOL_SRC}
                alt=""
                width={80}
                height={80}
                className="h-7 w-7 shrink-0 object-contain sm:h-8 sm:w-8"
              />
              <span className="inline-flex min-w-0 max-w-full flex-col items-stretch gap-0.5 leading-none">
                <span className="text-center font-[var(--font-display)] text-base font-semibold uppercase leading-tight tracking-tight sm:text-lg">
                  LOTUS & EAGLE
                </span>
                <span className="mt-px flex w-full items-center gap-2 font-[var(--font-body)] text-[0.65rem] font-semibold uppercase leading-none tracking-[0.2em] text-[#0A2240] dark:text-foreground sm:gap-2.5 sm:text-[0.72rem]">
                  <span
                    className="h-px min-w-2 flex-1 bg-current opacity-45"
                    aria-hidden
                  />
                  <span className="shrink-0">Alliance</span>
                  <span
                    className="h-px min-w-2 flex-1 bg-current opacity-45"
                    aria-hidden
                  />
                </span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Ihr strategischer Partner für die Gewinnung internationaler
              Fachkräfte aus Vietnam.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm">{t("legal")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/legal/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/imprint"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("imprint")}
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terms"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("terms")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm">Unternehmen</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/for-employers"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Für Arbeitgeber
                </Link>
              </li>
              <li>
                <Link
                  href="/for-applicants"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Für Bewerber
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Über uns
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm">{t("contact")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("contact")}
                </Link>
              </li>
              <li>
                <a
                  href={`https://wa.me/${CONTACT_PHONE_TEL.replace("+", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-muted-foreground text-center">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
