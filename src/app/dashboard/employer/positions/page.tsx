"use client";

import Link from "next/link";
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
import type { JobPosition, JobStatus, Urgency } from "@/types/database";

const urgencyLabels: Record<Urgency, string> = {
  immediate: "Sofort",
  "3_months": "3 Monate",
  "6_months": "6 Monate",
  flexible: "Flexibel",
};

const urgencyVariants: Record<Urgency, "destructive" | "default" | "secondary" | "outline"> = {
  immediate: "destructive",
  "3_months": "default",
  "6_months": "secondary",
  flexible: "outline",
};

const statusLabels: Record<JobStatus, string> = {
  draft: "Entwurf",
  active: "Aktiv",
  filled: "Besetzt",
  closed: "Geschlossen",
};

const statusVariants: Record<JobStatus, "default" | "secondary" | "outline" | "destructive"> = {
  draft: "outline",
  active: "default",
  filled: "secondary",
  closed: "destructive",
};

const specializationLabels: Record<string, string> = {
  hospitality: "Gastronomie",
  hairdressing: "Friseurhandwerk",
  nursing: "Pflege",
  other: "Andere",
};

const positionTypeLabels: Record<string, string> = {
  apprenticeship: "Ausbildung",
  skilled_worker: "Fachkraft",
  seasonal: "Saisonarbeit",
};

const mockPositions: JobPosition[] = [
  {
    id: "pos-1",
    employer_id: "emp-1",
    title: "Koch/Köchin Ausbildung",
    position_type: "apprenticeship",
    specialization: "hospitality",
    description: "Ausbildung zum Koch in unserem Restaurant",
    start_date: "2026-09-01",
    urgency: "3_months",
    slots_total: 3,
    slots_filled: 1,
    salary_range: { min: 900, max: 1100 },
    accommodation_provided: true,
    training_plan_url: null,
    status: "active",
    created_at: "2026-01-15T10:00:00Z",
    updated_at: "2026-01-15T10:00:00Z",
  },
  {
    id: "pos-2",
    employer_id: "emp-1",
    title: "Friseur/in Fachkraft",
    position_type: "skilled_worker",
    specialization: "hairdressing",
    description: "Erfahrene Friseurkraft gesucht",
    start_date: "2026-07-01",
    urgency: "immediate",
    slots_total: 2,
    slots_filled: 0,
    salary_range: { min: 2200, max: 2800 },
    accommodation_provided: false,
    training_plan_url: null,
    status: "active",
    created_at: "2026-02-01T10:00:00Z",
    updated_at: "2026-02-01T10:00:00Z",
  },
  {
    id: "pos-3",
    employer_id: "emp-1",
    title: "Pflegefachkraft Ausbildung",
    position_type: "apprenticeship",
    specialization: "nursing",
    description: "Ausbildung zur Pflegefachkraft",
    start_date: "2026-10-01",
    urgency: "6_months",
    slots_total: 5,
    slots_filled: 2,
    salary_range: { min: 1100, max: 1300 },
    accommodation_provided: true,
    training_plan_url: null,
    status: "draft",
    created_at: "2026-02-20T10:00:00Z",
    updated_at: "2026-02-20T10:00:00Z",
  },
  {
    id: "pos-4",
    employer_id: "emp-1",
    title: "Restaurantfachmann/-frau",
    position_type: "apprenticeship",
    specialization: "hospitality",
    description: "Ausbildung im Service",
    start_date: "2026-09-01",
    urgency: "flexible",
    slots_total: 2,
    slots_filled: 2,
    salary_range: { min: 900, max: 1050 },
    accommodation_provided: true,
    training_plan_url: null,
    status: "filled",
    created_at: "2025-11-10T10:00:00Z",
    updated_at: "2026-03-01T10:00:00Z",
  },
];

export default function PositionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Stellenangebote</h2>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre offenen Stellen und Ausbildungsplätze.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/employer/positions/new">
            <Plus className="size-4" />
            Neue Stelle
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titel</TableHead>
              <TableHead>Typ</TableHead>
              <TableHead>Fachrichtung</TableHead>
              <TableHead>Dringlichkeit</TableHead>
              <TableHead>Plätze</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12">
                <span className="sr-only">Aktionen</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPositions.map((position) => (
              <TableRow key={position.id}>
                <TableCell className="font-medium">{position.title}</TableCell>
                <TableCell>{positionTypeLabels[position.position_type]}</TableCell>
                <TableCell>{specializationLabels[position.specialization]}</TableCell>
                <TableCell>
                  <Badge variant={urgencyVariants[position.urgency]}>
                    {urgencyLabels[position.urgency]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {position.slots_filled}/{position.slots_total}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariants[position.status]}>
                    {statusLabels[position.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={<Button variant="ghost" size="icon-xs" />}
                    >
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Pencil className="size-4" />
                        Bearbeiten
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="size-4" />
                        Löschen
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
