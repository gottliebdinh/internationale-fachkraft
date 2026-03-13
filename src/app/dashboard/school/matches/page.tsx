"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Eye, Building2, User, Clock } from "lucide-react";
import type { MatchStatus, Urgency } from "@/types/database";

interface MatchProposal {
  id: string;
  employer_company: string;
  position_title: string;
  candidate_name: string;
  urgency: Urgency;
  status: MatchStatus;
  proposed_date: string;
}

const urgencyLabels: Record<Urgency, string> = {
  immediate: "Sofort",
  "3_months": "3 Monate",
  "6_months": "6 Monate",
  flexible: "Flexibel",
};

const statusLabels: Record<MatchStatus, string> = {
  proposed: "Vorgeschlagen",
  school_accepted: "Von Schule akzeptiert",
  employer_accepted: "Von Arbeitgeber akzeptiert",
  both_accepted: "Beidseitig akzeptiert",
  interview_scheduled: "Interview geplant",
  contract_phase: "Vertragsphase",
  ihk_submitted: "IHK eingereicht",
  approved: "Genehmigt",
  visa_applied: "Visum beantragt",
  visa_granted: "Visum erteilt",
  arrived: "Angekommen",
  rejected: "Abgelehnt",
  withdrawn: "Zurückgezogen",
};

const statusVariant: Record<MatchStatus, "default" | "secondary" | "outline" | "destructive"> = {
  proposed: "outline",
  school_accepted: "secondary",
  employer_accepted: "secondary",
  both_accepted: "default",
  interview_scheduled: "secondary",
  contract_phase: "secondary",
  ihk_submitted: "secondary",
  approved: "default",
  visa_applied: "secondary",
  visa_granted: "default",
  arrived: "default",
  rejected: "destructive",
  withdrawn: "destructive",
};

const placeholderMatches: MatchProposal[] = [
  {
    id: "m1",
    employer_company: "Hotel Vier Jahreszeiten",
    position_title: "Koch – Ausbildung",
    candidate_name: "Nguyen Van A",
    urgency: "immediate",
    status: "proposed",
    proposed_date: "2026-03-07",
  },
  {
    id: "m2",
    employer_company: "Salon Elegance GmbH",
    position_title: "Friseurin – Fachkraft",
    candidate_name: "Tran Thi B",
    urgency: "3_months",
    status: "school_accepted",
    proposed_date: "2026-03-05",
  },
  {
    id: "m3",
    employer_company: "Klinikum Süd",
    position_title: "Pflegefachkraft",
    candidate_name: "Le Van C",
    urgency: "6_months",
    status: "both_accepted",
    proposed_date: "2026-02-28",
  },
  {
    id: "m4",
    employer_company: "Gasthaus zum Löwen",
    position_title: "Koch – Fachkraft",
    candidate_name: "Pham Thi D",
    urgency: "3_months",
    status: "rejected",
    proposed_date: "2026-02-20",
  },
  {
    id: "m5",
    employer_company: "Pflegezentrum Nord",
    position_title: "Pflegeassistent",
    candidate_name: "Hoang Van E",
    urgency: "flexible",
    status: "interview_scheduled",
    proposed_date: "2026-03-01",
  },
];

type TabFilter = "all" | "pending" | "active" | "completed" | "rejected";

const tabFilters: Record<TabFilter, MatchStatus[]> = {
  all: [],
  pending: ["proposed"],
  active: [
    "school_accepted",
    "employer_accepted",
    "both_accepted",
    "interview_scheduled",
    "contract_phase",
    "ihk_submitted",
    "approved",
    "visa_applied",
    "visa_granted",
  ],
  completed: ["arrived"],
  rejected: ["rejected", "withdrawn"],
};

export default function SchoolMatchesPage() {
  const [tab, setTab] = useState<string>("all");

  const filtered =
    tab === "all"
      ? placeholderMatches
      : placeholderMatches.filter((m) =>
          tabFilters[tab as TabFilter]?.includes(m.status)
        );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Match-Vorschläge</h2>
        <p className="text-muted-foreground">
          Eingehende Vermittlungsvorschläge verwalten
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">Alle ({placeholderMatches.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Neu ({placeholderMatches.filter((m) => tabFilters.pending.includes(m.status)).length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Aktiv ({placeholderMatches.filter((m) => tabFilters.active.includes(m.status)).length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Abgelehnt ({placeholderMatches.filter((m) => tabFilters.rejected.includes(m.status)).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">Keine Matches in dieser Kategorie</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filtered.map((match) => (
                <Card key={match.id}>
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {match.employer_company}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {match.position_title}
                      </p>
                    </div>
                    <Badge variant={statusVariant[match.status]}>
                      {statusLabels[match.status]}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        {match.candidate_name}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        {urgencyLabels[match.urgency]}
                      </span>
                      <span className="text-muted-foreground">
                        Vorgeschlagen: {match.proposed_date}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/dashboard/school/matches/${match.id}`}>
                          <Eye className="mr-1.5 h-3.5 w-3.5" />
                          Details
                        </Link>
                      </Button>
                      {match.status === "proposed" && (
                        <>
                          <Button size="sm">
                            <Check className="mr-1.5 h-3.5 w-3.5" />
                            Akzeptieren
                          </Button>
                          <Button size="sm" variant="destructive">
                            <X className="mr-1.5 h-3.5 w-3.5" />
                            Ablehnen
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
