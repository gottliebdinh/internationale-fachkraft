import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthRecoveryRedirect } from "@/components/auth/auth-recovery-redirect";
import { getPublicSiteUrl } from "@/lib/site-url";
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
    default: "GeVin – Fachkräfte für Deutschland | IHK-konforme Vermittlung",
    template: "%s | GeVin",
  },
  description:
    "Die professionelle Plattform für die Vermittlung vietnamesischer Fachkräfte und Auszubildender an deutsche Unternehmen – IHK-konform und DSGVO-sicher. Hotellerie, Friseurhandwerk, Pflege.",
  keywords: [
    "Fachkräfte Vietnam",
    "Fachkräfteeinwanderungsgesetz",
    "IHK Ausbildung",
    "Fachkräftemangel",
    "Arbeitsvermittlung Deutschland Vietnam",
    "FEG",
    "DSGVO Recruiting",
  ],
  authors: [{ name: "GeVin" }],
  creator: "GeVin",
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: siteUrl,
    siteName: "GeVin",
    title: "GeVin – Internationale Fachkräfte für Deutschland",
    description:
      "IHK-konforme Vermittlung vietnamesischer Fachkräfte und Auszubildender. Hotellerie, Friseurhandwerk, Pflege.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GeVin – Fachkräfte für Deutschland",
    description:
      "IHK-konform und DSGVO-sicher: Vermittlung vietnamesischer Fachkräfte an deutsche Unternehmen.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
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
