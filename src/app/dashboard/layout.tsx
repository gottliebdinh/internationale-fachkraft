import { getUserProfile } from "@/lib/supabase/actions";
import { DashboardHeaderSimple } from "@/components/shared/dashboard-header-simple";

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

  const effectiveProfile = profile ?? FALLBACK_PROFILE;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardHeaderSimple />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
