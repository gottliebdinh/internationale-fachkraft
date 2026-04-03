import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthRecoveryRedirect } from "@/components/auth/auth-recovery-redirect";
import { getPublicSiteUrl } from "@/lib/site-url";
import { BRAND_SYMBOL_SRC } from "@/lib/brand-logo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = getPublicSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lotus&Eagle – Fachkräfte aus Vietnam für deutsche Unternehmen",
    template: "%s | Lotus&Eagle",
  },
  description:
    "Ihr strategischer Partner für die Gewinnung qualifizierter Fachkräfte und Auszubildender aus Vietnam – von der Auswahl bis zur erfolgreichen Integration. Gastronomie, Pflege.",
  keywords: [
    "Fachkräfte Vietnam",
    "Fachkräftemangel",
    "Fachkräfteeinwanderungsgesetz",
    "Gastronomie Fachkräfte",
    "Pflege Fachkräfte",
    "Arbeitsvermittlung Deutschland Vietnam",
    "Ausbildung Vietnam",
    "Integration Fachkräfte",
  ],
  authors: [{ name: "Lotus&Eagle" }],
  creator: "Lotus&Eagle",
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: siteUrl,
    siteName: "Lotus&Eagle",
    title: "Lotus&Eagle – Fachkräfte aus Vietnam für deutsche Unternehmen",
    description:
      "Strategischer Partner für die nachhaltige Gewinnung von Fachkräften und Auszubildenden aus Vietnam. Gastronomie, Pflege.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lotus&Eagle – Fachkräfte aus Vietnam",
    description:
      "Strategischer Partner für die nachhaltige Gewinnung qualifizierter Fachkräfte aus Vietnam.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [{ url: BRAND_SYMBOL_SRC, type: "image/png" }],
    shortcut: BRAND_SYMBOL_SRC,
    apple: [{ url: BRAND_SYMBOL_SRC }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${dmSans.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <TooltipProvider>
            <AuthRecoveryRedirect />
            {children}
            <Toaster />
          </TooltipProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
