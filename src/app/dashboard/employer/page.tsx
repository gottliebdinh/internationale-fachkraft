import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { EmployerDashboardView } from "@/components/dashboard/employer-dashboard-view";
import { getEmployerDashboardViewModel } from "@/lib/employer-dashboard-data";

export const metadata: Metadata = {
  title: "Dashboard | Lotus&Eagle",
  description: "Ihr Arbeitgeber-Dashboard mit Stellen und Kandidaten.",
};

export default async function EmployerDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const admin = createAdminClient();

  const { data: employerRow } = await admin
    .from("employers")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!employerRow) redirect("/auth/login");

  const vm = await getEmployerDashboardViewModel(admin, employerRow.id);
  if (!vm) redirect("/auth/login");

  return (
    <EmployerDashboardView
      employer={vm.employer}
      positions={vm.positions}
      totalMatches={vm.totalMatches}
      teaserCandidates={vm.teaserCandidates}
      candidateProfileBasePath="/dashboard/employer/candidates"
    />
  );
}
