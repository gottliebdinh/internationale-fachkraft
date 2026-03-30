"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { BRAND_WORDMARK } from "@/lib/brand-logo";

const AdminNav = dynamic(
  () =>
    import("@/components/admin/admin-nav").then((m) => ({
      default: m.AdminNav,
    })),
  { ssr: true }
);

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return (
      <div className="flex min-h-dvh flex-col bg-background">
        <header className="flex h-14 shrink-0 items-center border-b bg-background px-4">
          <Link
            href="/admin/login"
            className="font-[var(--font-display)] text-xl font-semibold tracking-tight text-foreground"
          >
            {BRAND_WORDMARK}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              Admin
            </span>
          </Link>
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex h-dvh max-h-dvh min-h-0 flex-col overflow-hidden bg-background">
      <header className="flex h-14 shrink-0 items-center gap-6 border-b bg-background px-4">
        <Link
          href="/admin/leads"
          className="font-[var(--font-display)] text-xl font-semibold tracking-tight text-foreground"
        >
          {BRAND_WORDMARK}
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            Admin
          </span>
        </Link>
        <AdminNav />
      </header>
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
        {children}
      </main>
    </div>
  );
}
