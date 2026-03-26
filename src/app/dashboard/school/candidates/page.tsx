"use client";

import Link from "next/link";
import { Plus, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Candidate, CandidateStatus, GermanLevel } from "@/types/database";

const statusConfig: Record<CandidateStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  draft: { label: "Entwurf", variant: "outline" },
  active: { label: "Aktiv", variant: "default" },
  matched: { label: "Zugeordnet", variant: "secondary" },
  in_process: { label: "In Bearbeitung", variant: "secondary" },
  placed: { label: "Vermittelt", variant: "default" },
  withdrawn: { label: "Zurückgezogen", variant: "destructive" },
};

const placeholderCandidates: Candidate[] = [
  {
    id: "c1",
    school_id: "s1",
    first_name: "Nguyen",
    last_name: "Van A",
    date_of_birth: "1998-05-12",
    nationality: "VN",
    passport_number: "B12345678",
    passport_expiry: "2028-05-12",
    gender: "male",
    specialization: "hospitality",
    german_level: "B1",
    b1_certificate_date: "2025-11-20",
    education_level: "Bachelor",
    work_experience_years: 2,
    availability_date: "2026-06-01",
    urgency: "3_months",
    video_intro_url: null,
    profile_photo_url: null,
    status: "active",
    position_type: null,
    desired_position: null,
    desired_field: null,
    created_at: "2026-01-15T10:00:00Z",
    updated_at: "2026-03-01T12:00:00Z",
  },
  {
    id: "c2",
    school_id: "s1",
    first_name: "Tran",
    last_name: "Thi B",
    date_of_birth: "2000-09-23",
    nationality: "VN",
    passport_number: "B98765432",
    passport_expiry: "2029-01-15",
    gender: "female",
    specialization: "hairdressing",
    german_level: "B2",
    b1_certificate_date: "2025-08-10",
    education_level: "Berufsausbildung",
    work_experience_years: 3,
    availability_date: "2026-04-15",
    urgency: "immediate",
    video_intro_url: null,
    profile_photo_url: null,
    status: "matched",
    position_type: null,
    desired_position: null,
    desired_field: null,
    created_at: "2025-12-01T10:00:00Z",
    updated_at: "2026-02-20T15:00:00Z",
  },
  {
    id: "c3",
    school_id: "s1",
    first_name: "Le",
    last_name: "Van C",
    date_of_birth: "1999-03-10",
    nationality: "VN",
    passport_number: "B55566677",
    passport_expiry: "2027-11-30",
    gender: "male",
    specialization: "nursing",
    german_level: "A2",
    b1_certificate_date: null,
    education_level: "Bachelor",
    work_experience_years: 1,
    availability_date: "2026-09-01",
    urgency: "6_months",
    video_intro_url: null,
    profile_photo_url: null,
    status: "draft",
    position_type: null,
    desired_position: null,
    desired_field: null,
    created_at: "2026-02-10T10:00:00Z",
    updated_at: "2026-03-05T09:00:00Z",
  },
  {
    id: "c4",
    school_id: "s1",
    first_name: "Pham",
    last_name: "Thi D",
    date_of_birth: "1997-07-18",
    nationality: "VN",
    passport_number: "B44433322",
    passport_expiry: "2028-07-18",
    gender: "female",
    specialization: "hospitality",
    german_level: "B1",
    b1_certificate_date: "2025-12-01",
    education_level: "Master",
    work_experience_years: 4,
    availability_date: "2026-05-01",
    urgency: "3_months",
    video_intro_url: null,
    profile_photo_url: null,
    status: "placed",
    position_type: null,
    desired_position: null,
    desired_field: null,
    created_at: "2025-10-20T10:00:00Z",
    updated_at: "2026-02-28T11:00:00Z",
  },
  {
    id: "c5",
    school_id: "s1",
    first_name: "Hoang",
    last_name: "Van E",
    date_of_birth: "2001-01-05",
    nationality: "VN",
    passport_number: "B11122233",
    passport_expiry: "2029-06-01",
    gender: "male",
    specialization: "nursing",
    german_level: "B1",
    b1_certificate_date: "2026-01-15",
    education_level: "Bachelor",
    work_experience_years: 0,
    availability_date: "2026-07-01",
    urgency: "flexible",
    video_intro_url: null,
    profile_photo_url: null,
    status: "in_process",
    position_type: null,
    desired_position: null,
    desired_field: null,
    created_at: "2026-01-05T10:00:00Z",
    updated_at: "2026-03-08T10:00:00Z",
  },
];

const specializationLabels: Record<string, string> = {
  hospitality: "Gastgewerbe",
  hairdressing: "Friseurhandwerk",
  nursing: "Pflege",
  other: "Andere",
};

function germanLevelBadgeVariant(level: GermanLevel): "default" | "secondary" | "outline" {
  if (level >= "B1") return "default";
  return "outline";
}

export default function SchoolCandidatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Kandidaten</h2>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre registrierten Kandidaten
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/school/candidates/new">
            <Plus className="mr-1.5 h-4 w-4" />
            Neuer Kandidat
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Fachrichtung</TableHead>
              <TableHead>Deutschniveau</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verfügbarkeit</TableHead>
              <TableHead className="w-[60px]">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {placeholderCandidates.map((candidate) => {
              const status = statusConfig[candidate.status];
              return (
                <TableRow key={candidate.id}>
                  <TableCell className="font-medium">
                    {candidate.first_name} {candidate.last_name}
                  </TableCell>
                  <TableCell>
                    {specializationLabels[candidate.specialization] ?? candidate.specialization}
                  </TableCell>
                  <TableCell>
                    <Badge variant={germanLevelBadgeVariant(candidate.german_level)}>
                      {candidate.german_level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                  <TableCell>{candidate.availability_date}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          render={
                            <Link href={`/dashboard/school/candidates/${candidate.id}`} />
                          }
                        >
                          <Eye className="h-4 w-4" />
                          Ansehen
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          render={
                            <Link href={`/dashboard/school/candidates/${candidate.id}`} />
                          }
                        >
                          <Pencil className="h-4 w-4" />
                          Bearbeiten
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive">
                          <Trash2 className="h-4 w-4" />
                          Löschen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
