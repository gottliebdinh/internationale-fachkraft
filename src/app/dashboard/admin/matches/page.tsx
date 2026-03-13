"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Search } from "lucide-react";
import type { MatchStatus } from "@/types/database";

interface AdminMatch {
  id: string;
  candidate_name: string;
  school_name: string;
  employer_name: string;
  position_title: string;
  status: MatchStatus;
  created_at: string;
  updated_at: string;
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

const placeholderMatches: AdminMatch[] = [
  {
    id: "m1",
    candidate_name: "Nguyen Van A",
    school_name: "Sprachzentrum HCMC",
    employer_name: "Hotel Vier Jahreszeiten",
    position_title: "Koch – Ausbildung",
    status: "proposed",
    created_at: "2026-03-07",
    updated_at: "2026-03-07",
  },
  {
    id: "m2",
    candidate_name: "Tran Thi B",
    school_name: "Sprachzentrum HCMC",
    employer_name: "Salon Elegance GmbH",
    position_title: "Friseurin – Fachkraft",
    status: "both_accepted",
    created_at: "2026-02-20",
    updated_at: "2026-03-05",
  },
  {
    id: "m3",
    candidate_name: "Le Van C",
    school_name: "Pflegeschule Hanoi",
    employer_name: "Klinikum Süd",
    position_title: "Pflegefachkraft",
    status: "interview_scheduled",
    created_at: "2026-02-15",
    updated_at: "2026-03-02",
  },
  {
    id: "m4",
    candidate_name: "Pham Thi D",
    school_name: "Sprachzentrum HCMC",
    employer_name: "Gasthaus zum Löwen",
    position_title: "Koch – Fachkraft",
    status: "visa_granted",
    created_at: "2025-11-10",
    updated_at: "2026-02-28",
  },
  {
    id: "m5",
    candidate_name: "Hoang Van E",
    school_name: "Pflegeschule Hanoi",
    employer_name: "Pflegezentrum Nord",
    position_title: "Pflegeassistent",
    status: "contract_phase",
    created_at: "2026-01-20",
    updated_at: "2026-03-06",
  },
  {
    id: "m6",
    candidate_name: "Vo Thi F",
    school_name: "Sprachzentrum HCMC",
    employer_name: "Hotel Vier Jahreszeiten",
    position_title: "Servicekraft – Ausbildung",
    status: "rejected",
    created_at: "2026-02-05",
    updated_at: "2026-02-12",
  },
];

export default function AdminMatchesPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = placeholderMatches.filter((match) => {
    if (statusFilter !== "all" && match.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        match.candidate_name.toLowerCase().includes(q) ||
        match.employer_name.toLowerCase().includes(q) ||
        match.school_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Alle Matches</h2>
        <p className="text-muted-foreground">
          Übersicht aller Vermittlungsvorgänge im System
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Suche nach Kandidat, Arbeitgeber, Schule..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Status filtern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Status</SelectItem>
            <SelectItem value="proposed">Vorgeschlagen</SelectItem>
            <SelectItem value="both_accepted">Beidseitig akzeptiert</SelectItem>
            <SelectItem value="interview_scheduled">Interview geplant</SelectItem>
            <SelectItem value="contract_phase">Vertragsphase</SelectItem>
            <SelectItem value="ihk_submitted">IHK eingereicht</SelectItem>
            <SelectItem value="approved">Genehmigt</SelectItem>
            <SelectItem value="visa_applied">Visum beantragt</SelectItem>
            <SelectItem value="visa_granted">Visum erteilt</SelectItem>
            <SelectItem value="arrived">Angekommen</SelectItem>
            <SelectItem value="rejected">Abgelehnt</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kandidat</TableHead>
              <TableHead>Schule</TableHead>
              <TableHead>Arbeitgeber</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Erstellt</TableHead>
              <TableHead>Aktualisiert</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((match) => (
              <TableRow key={match.id}>
                <TableCell className="font-medium">{match.candidate_name}</TableCell>
                <TableCell>{match.school_name}</TableCell>
                <TableCell>{match.employer_name}</TableCell>
                <TableCell>{match.position_title}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[match.status]}>
                    {statusLabels[match.status]}
                  </Badge>
                </TableCell>
                <TableCell>{match.created_at}</TableCell>
                <TableCell>{match.updated_at}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Keine Matches gefunden
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
