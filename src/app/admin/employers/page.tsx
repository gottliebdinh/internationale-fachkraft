import Link from "next/link";
import dynamic from "next/dynamic";
import { createAdminClient } from "@/lib/supabase/admin";
import { Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatJobStartLine } from "@/lib/format-job-start";

const EmployerGrid = dynamic(
  () =>
    import("@/components/admin/employer-grid").then((m) => ({
      default: m.EmployerGrid,
    })),
  { ssr: true, loading: () => null }
);

const STATUS_ORDER = [
  "employer_accepted",
  "both_accepted",
  "ihk_submitted",
  "visa_applied",
  "visa_granted",
  "arrived",
];

export default async function AdminEmployersPage() {
  const supabase = createAdminClient();

  const { data: employers, error } = await supabase
    .from("employers")
    .select("id, company_name, industry, industry_other, city, contact_person, phone, verified, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-20 text-muted-foreground">
        <p>Fehler beim Laden: {error.message}</p>
      </div>
    );
  }

  const employerIds = (employers ?? []).map((e) => e.id);

  let matchRows: { employer_id: string; status: string }[] = [];
  if (employerIds.length > 0) {
    const { data } = await supabase
      .from("matches")
      .select("status, job_positions!inner(employer_id)")
      .in("job_positions.employer_id", employerIds);

    if (data) {
      matchRows = data.map((row: any) => ({
        employer_id: row.job_positions?.employer_id ?? row.job_positions?.[0]?.employer_id,
        status: row.status,
      }));
    }
  }

  let jpByEmployer = new Map<string, { slots_total: number; start_date: string }[]>();
  if (employerIds.length > 0) {
    const { data: jpData } = await supabase
      .from("job_positions")
      .select("employer_id, slots_total, start_date")
      .in("employer_id", employerIds);
    for (const jp of jpData ?? []) {
      const list = jpByEmployer.get(jp.employer_id) ?? [];
      list.push({ slots_total: jp.slots_total ?? 0, start_date: jp.start_date });
      jpByEmployer.set(jp.employer_id, list);
    }
  }

  const employersWithMatches = (employers ?? []).map((e) => {
    const myMatches = matchRows.filter((m) => m.employer_id === e.id);
    const statusCounts = new Map<string, number>();
    for (const m of myMatches) {
      statusCounts.set(m.status, (statusCounts.get(m.status) ?? 0) + 1);
    }
    const matchSummary = Array.from(statusCounts.entries()).map(
      ([status, count]) => ({ status, count })
    );

    const allArrived = myMatches.length > 0 && myMatches.every((m) => m.status === "arrived");

    const jps = jpByEmployer.get(e.id) ?? [];
    const slotsTotal = jps.reduce((s, jp) => s + jp.slots_total, 0);

    // Earliest (least progressed) status among all matches
    let earliestStatus: string | null = null;
    if (myMatches.length > 0) {
      let minIdx = STATUS_ORDER.length;
      for (const m of myMatches) {
        const idx = STATUS_ORDER.indexOf(m.status);
        if (idx !== -1 && idx < minIdx) minIdx = idx;
      }
      if (minIdx < STATUS_ORDER.length) earliestStatus = STATUS_ORDER[minIdx];
    }

    // Earliest start date across all positions
    let earliestStartDate: string | null = null;
    let earliestStartLabel: string | null = null;
    for (const jp of jps) {
      const sd = jp.start_date?.slice(0, 10);
      if (sd && (!earliestStartDate || sd < earliestStartDate)) {
        earliestStartDate = sd;
      }
    }
    if (earliestStartDate) {
      earliestStartLabel = formatJobStartLine(earliestStartDate);
    }

    return {
      ...e,
      matchSummary,
      totalMatches: myMatches.length,
      slotsTotal,
      allArrived,
      earliestStatus,
      earliestStartDate,
      earliestStartLabel,
    };
  });

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Unternehmen</h1>
            <p className="text-sm text-muted-foreground">
              {employersWithMatches.length} Unternehmen im System
            </p>
          </div>
        </div>

        <Button asChild className="gap-2 px-5 py-2.5 text-sm">
          <Link href="/admin/employers/new">
            <Plus className="h-4 w-4" />
            Hinzufügen
          </Link>
        </Button>
      </div>

      <EmployerGrid employers={employersWithMatches} />
    </div>
  );
}
