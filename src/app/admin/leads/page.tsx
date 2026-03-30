import { createAdminClient } from "@/lib/supabase/admin";
import { UserPlus } from "lucide-react";
import { LeadsTable } from "./leads-table";

export default async function AdminLeadsPage() {
  const supabase = createAdminClient();

  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-20 text-muted-foreground">
        <p>Fehler beim Laden: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex items-center gap-3">
        <UserPlus className="h-6 w-6 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="text-sm text-muted-foreground">
            {leads?.length ?? 0} Anfragen im System
          </p>
        </div>
      </div>

      <LeadsTable leads={leads ?? []} />
    </div>
  );
}
