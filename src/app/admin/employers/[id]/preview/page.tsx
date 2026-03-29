import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import { EmployerDashboardView } from "@/components/dashboard/employer-dashboard-view";
import { getEmployerDashboardViewModel } from "@/lib/employer-dashboard-data";
import { ArrowLeft, Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "Arbeitgeber-Dashboard (Vorschau) | Admin",
  description: "Vorschau der Arbeitgeber-Ansicht",
};

export default async function EmployerDashboardPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = createAdminClient();
  const vm = await getEmployerDashboardViewModel(admin, id);
  if (!vm) notFound();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Eye className="h-4 w-4 shrink-0" />
          <span>
            <span className="font-medium text-foreground">Vorschau:</span> So sieht das
            Arbeitgeber-Dashboard für <strong className="text-foreground">{vm.employer.company_name}</strong> aus.
            Kandidaten öffnen die Admin-Detailseite.
          </span>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/admin/employers/${id}`} className="gap-2">
            <ArrowLeft className="h-3.5 w-3.5" />
            Zurück zum Unternehmen
          </Link>
        </Button>
      </div>

      <EmployerDashboardView
        employer={vm.employer}
        positions={vm.positions}
        totalMatches={vm.totalMatches}
        teaserCandidates={vm.teaserCandidates}
        candidateProfileBasePath="/admin/candidates"
      />
    </div>
  );
}
