"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/supabase/actions";

export function DashboardHeaderSimple() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4">
      <Link href="/dashboard" className="font-[var(--font-display)] text-xl font-semibold tracking-tight text-foreground">
        Ge<span className="text-[oklch(0.50_0.11_195)]">Vin</span>
      </Link>
      <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2 text-muted-foreground">
        <LogOut className="h-4 w-4" />
        Abmelden
      </Button>
    </header>
  );
}
