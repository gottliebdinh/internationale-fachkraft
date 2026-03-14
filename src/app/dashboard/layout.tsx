import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/supabase/actions";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { DashboardShell } from "./dashboard-shell";

const FALLBACK_PROFILE = { id: "demo", role: "employer" as const };

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let profile = null;
  try {
    profile = await getUserProfile();
  } catch {
    // Supabase nicht konfiguriert oder Fehler: mit Fallback trotzdem Dashboard anzeigen
  }

  // Ohne Backend: Bei fehlender Session oder Fehler mit Fallback-Profil ins Dashboard (jede Anmeldung/Registrierung führt hierher)
  const effectiveProfile = profile ?? FALLBACK_PROFILE;

  return (
    <SidebarProvider>
      <DashboardShell role={effectiveProfile.role}>
        <SidebarInset>
          <DashboardHeader title="Dashboard" />
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </DashboardShell>
    </SidebarProvider>
  );
}
