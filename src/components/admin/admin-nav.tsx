"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { UserPlus, LogOut } from "lucide-react";
import { signOutFromAdmin } from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";

/** Kandidaten / Unternehmen vorübergehend ausgeblendet — nur Leads sichtbar. */
const NAV_ITEMS = [{ href: "/admin/leads", label: "Leads", icon: UserPlus }];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(async () => {
      await signOutFromAdmin();
      router.push("/admin/login");
      router.refresh();
    });
  }

  return (
    <nav className="flex flex-1 items-center justify-between gap-4">
      <div className="flex items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="gap-1.5 text-muted-foreground"
        disabled={pending}
        onClick={handleSignOut}
      >
        <LogOut className="h-4 w-4" />
        Abmelden
      </Button>
    </nav>
  );
}
