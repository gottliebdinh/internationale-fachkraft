"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                G
              </div>
              <span className="text-lg font-bold">GeVin</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Die professionelle Brücke zwischen deutschen Unternehmen und
              vietnamesischen Fachkräften.
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
            <h3 className="font-semibold mb-3 text-sm">Plattform</h3>
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
                  href="/for-schools"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Für Schulen
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  So funktioniert&apos;s
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
                <Link
                  href="/faq"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
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
