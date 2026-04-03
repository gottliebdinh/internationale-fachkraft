"use client";

import Link from "next/link";
import { BrandWordmarkLink } from "@/components/shared/brand-wordmark-link";
import { useTranslations } from "next-intl";
import { CONTACT_PHONE_TEL } from "@/lib/contact-info";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto w-full max-w-[min(100%,1340px)] px-4 py-12 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <BrandWordmarkLink
              href="/"
              size="md"
              className="mb-4 inline-flex"
            />
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
