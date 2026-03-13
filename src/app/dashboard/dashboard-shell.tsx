"use client";

import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/shared/dashboard-sidebar";
import { signOut } from "@/lib/supabase/actions";
import type { UserRole } from "@/types/database";

interface DashboardShellProps {
  role: UserRole;
  children: React.ReactNode;
}

export function DashboardShell({ role, children }: DashboardShellProps) {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <>
      <DashboardSidebar role={role} onSignOut={handleSignOut} />
      {children}
    </>
  );
}
