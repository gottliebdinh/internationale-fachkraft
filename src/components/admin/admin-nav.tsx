"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users, Building2, LogOut } from "lucide-react";
import { signOutFromAdmin } from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/admin", label: "Kandidaten", icon: Users, exact: true },
  { href: "/admin/employers", label: "Unternehmen", icon: Building2 },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 items-center justify-between gap-4">
      <div className="flex items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const active = item.exact
            ? pathname === item.href || pathname.startsWith("/admin/candidates")
            : pathname.startsWith(item.href);
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
      <form action={signOutFromAdmin}>
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground"
        >
          <LogOut className="h-4 w-4" />
          Abmelden
        </Button>
      </form>
    </nav>
  );
}
