import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/supabase/actions";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { DashboardShell } from "./dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/auth/login");
  }

  return (
    <SidebarProvider>
      <DashboardShell role={profile.role}>
        <SidebarInset>
          <DashboardHeader title="Dashboard" />
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </DashboardShell>
    </SidebarProvider>
  );
}
