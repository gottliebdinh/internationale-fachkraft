"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";

export function PublicNavbar() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/how-it-works", label: t("howItWorks") },
    { href: "/for-employers", label: t("forEmployers") },
    { href: "/for-schools", label: t("forSchools") },
    { href: "/faq", label: t("faq") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
            G
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            GeVin
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/auth/login">{tc("login")}</Link>
          </Button>
          <Button asChild className="h-11 min-h-11 px-6 text-base font-semibold">
            <Link href="/auth/register/employer">{tc("register")}</Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="md:hidden inline-flex shrink-0 items-center justify-center rounded-lg h-8 w-8 text-sm font-medium transition-all outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <nav className="flex flex-col gap-4 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground py-2"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t pt-4 flex flex-col gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">{tc("login")}</Link>
                </Button>
                <Button asChild className="h-11 min-h-11 px-6 text-base font-semibold">
                  <Link href="/auth/register/employer">{tc("register")}</Link>
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
