"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { MatchStatus } from "@/types/database";

interface MockMatch {
  id: string;
  candidateName: string;
  positionTitle: string;
  status: MatchStatus;
  date: string;
}

const statusLabels: Record<MatchStatus, string> = {
  proposed: "Vorgeschlagen",
  school_accepted: "Schule akzeptiert",
  employer_accepted: "Arbeitgeber akzeptiert",
  both_accepted: "Beidseitig akzeptiert",
  interview_scheduled: "Interview geplant",
  contract_phase: "Vertragsphase",
  ihk_submitted: "IHK eingereicht",
  approved: "Genehmigt",
  visa_applied: "Visum beantragt",
  visa_granted: "Visum erteilt",
  arrived: "Angereist",
  rejected: "Abgelehnt",
  withdrawn: "Zurückgezogen",
};

const statusVariants: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  proposed: "outline",
  school_accepted: "secondary",
  employer_accepted: "secondary",
  both_accepted: "default",
  interview_scheduled: "default",
  contract_phase: "default",
  ihk_submitted: "default",
  approved: "default",
  visa_applied: "secondary",
  visa_granted: "default",
  arrived: "default",
  rejected: "destructive",
  withdrawn: "destructive",
};

type TabKey = "all" | "proposed" | "confirmed" | "contract" | "completed";

const tabFilters: Record<TabKey, MatchStatus[] | null> = {
  all: null,
  proposed: ["proposed"],
  confirmed: [
    "school_accepted",
    "employer_accepted",
    "both_accepted",
    "interview_scheduled",
  ],
  contract: ["contract_phase", "ihk_submitted", "approved"],
  completed: ["visa_applied", "visa_granted", "arrived"],
};

const mockMatches: MockMatch[] = [
  {
    id: "match-1",
    candidateName: "Thi Mai Nguyen",
    positionTitle: "Koch/Köchin Ausbildung",
    status: "proposed",
    date: "2026-03-01",
  },
  {
    id: "match-2",
    candidateName: "Van Duc Tran",
    positionTitle: "Koch/Köchin Ausbildung",
    status: "both_accepted",
    date: "2026-02-20",
  },
  {
    id: "match-3",
    candidateName: "Thi Lan Pham",
    positionTitle: "Friseur/in Fachkraft",
    status: "contract_phase",
    date: "2026-02-10",
  },
  {
    id: "match-4",
    candidateName: "Minh Hoang Le",
    positionTitle: "Pflegefachkraft Ausbildung",
    status: "employer_accepted",
    date: "2026-02-25",
  },
  {
    id: "match-5",
    candidateName: "Quoc Bao Dang",
    positionTitle: "Pflegefachkraft Ausbildung",
    status: "visa_applied",
    date: "2026-01-15",
  },
  {
    id: "match-6",
    candidateName: "Thi Huong Vo",
    positionTitle: "Restaurantfachmann/-frau",
    status: "rejected",
    date: "2026-02-05",
  },
  {
    id: "match-7",
    candidateName: "Duc Anh Hoang",
    positionTitle: "Koch/Köchin Ausbildung",
    status: "arrived",
    date: "2025-12-20",
  },
];

function MatchCard({ match }: { match: MockMatch }) {
  return (
    <Link href={`/dashboard/employer/matches/${match.id}`}>
      <Card className="transition-shadow hover:shadow-md cursor-pointer">
        <CardContent className="flex items-center justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <p className="font-semibold truncate">{match.candidateName}</p>
            <p className="text-sm text-muted-foreground truncate">
              {match.positionTitle}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <Badge variant={statusVariants[match.status] ?? "outline"}>
              {statusLabels[match.status]}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(match.date).toLocaleDateString("de-DE")}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function MatchesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Matches</h2>
        <p className="text-muted-foreground">
          Verfolgen Sie den Status Ihrer Kandidaten-Matches im Überblick.
        </p>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">
            Alle ({mockMatches.length})
          </TabsTrigger>
          <TabsTrigger value="proposed">
            Vorgeschlagen (
            {mockMatches.filter((m) => tabFilters.proposed!.includes(m.status)).length})
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Bestätigt (
            {mockMatches.filter((m) => tabFilters.confirmed!.includes(m.status)).length})
          </TabsTrigger>
          <TabsTrigger value="contract">
            Vertragsphase (
            {mockMatches.filter((m) => tabFilters.contract!.includes(m.status)).length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Abgeschlossen (
            {mockMatches.filter((m) => tabFilters.completed!.includes(m.status)).length})
          </TabsTrigger>
        </TabsList>

        {(Object.keys(tabFilters) as TabKey[]).map((tab) => {
          const filtered = tab === "all"
            ? mockMatches
            : mockMatches.filter((m) => tabFilters[tab]!.includes(m.status));

          return (
            <TabsContent key={tab} value={tab}>
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                  <p className="text-lg font-medium">Keine Matches</p>
                  <p className="text-sm text-muted-foreground">
                    In dieser Kategorie gibt es aktuell keine Matches.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
