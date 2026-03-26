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
    <div className="flex h-dvh max-h-dvh min-h-0 flex-col overflow-hidden bg-background">
      <DashboardHeaderSimple />
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-3 sm:px-4 sm:py-3">
        <div className="min-h-0 flex-1">{children}</div>
      </main>
    </div>
  );
}
