"use client";

import { use as reactUse } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Building2,
  User,
  Calendar,
  Clock,
  FileText,
  Check,
  X,
} from "lucide-react";

const matchDetail = {
  id: "m1",
  status: "proposed" as const,
  initiated_by: "employer" as const,
  created_at: "2026-03-07",
  updated_at: "2026-03-07",
  employer: {
    company_name: "Hotel Vier Jahreszeiten",
    contact_person: "Hans Müller",
    phone: "+49 89 1234567",
    city: "München",
    industry: "hospitality" as const,
  },
  position: {
    title: "Koch – Ausbildung",
    position_type: "apprenticeship" as const,
    start_date: "2026-09-01",
    urgency: "immediate" as const,
    salary_range: { min: 1200, max: 1500 },
    accommodation_provided: true,
    description:
      "Wir suchen einen motivierten Auszubildenden für unsere Hotelküche. Die Ausbildung dauert 3 Jahre und umfasst alle Bereiche der Gastronomie.",
  },
  candidate: {
    first_name: "Nguyen",
    last_name: "Van A",
    specialization: "hospitality" as const,
    german_level: "B1" as const,
    availability_date: "2026-06-01",
  },
  documents: [
    { name: "Stellenausschreibung.pdf", type: "job_description" },
    { name: "Ausbildungsplan.pdf", type: "training_plan" },
  ],
  notes: "Kandidat passt sehr gut zum Anforderungsprofil. B1-Niveau bestätigt.",
};

const statusLabels: Record<string, string> = {
  proposed: "Vorgeschlagen",
  school_accepted: "Von Schule akzeptiert",
  employer_accepted: "Von Arbeitgeber akzeptiert",
  both_accepted: "Beidseitig akzeptiert",
  interview_scheduled: "Interview geplant",
  contract_phase: "Vertragsphase",
  rejected: "Abgelehnt",
  withdrawn: "Zurückgezogen",
};

export default function SchoolMatchDetailPage() {
  const params = reactUse(
    Promise.resolve(useParams())
  ) as { id?: string | string[] | undefined };
  const matchId = params.id as string;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/school/matches">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight">
                Match-Details
              </h2>
              <Badge variant="outline">
                {statusLabels[matchDetail.status] ?? matchDetail.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">Match-ID: {matchId}</p>
          </div>
        </div>

        {matchDetail.status === "proposed" && (
          <div className="flex items-center gap-2">
            <Button>
              <Check className="mr-1.5 h-4 w-4" />
              Akzeptieren
            </Button>
            <Button variant="destructive">
              <X className="mr-1.5 h-4 w-4" />
              Ablehnen
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Arbeitgeber
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Unternehmen</p>
              <p className="font-medium">{matchDetail.employer.company_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ansprechpartner</p>
              <p className="font-medium">{matchDetail.employer.contact_person}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Standort</p>
              <p className="font-medium">{matchDetail.employer.city}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Telefon</p>
              <p className="font-medium">{matchDetail.employer.phone}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Kandidat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">
                {matchDetail.candidate.first_name} {matchDetail.candidate.last_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fachrichtung</p>
              <p className="font-medium capitalize">
                {matchDetail.candidate.specialization}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Deutschniveau</p>
              <Badge>{matchDetail.candidate.german_level}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Verfügbar ab</p>
              <p className="font-medium">{matchDetail.candidate.availability_date}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stellendetails</CardTitle>
          <CardDescription>{matchDetail.position.title}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Startdatum</p>
                <p className="text-sm font-medium">{matchDetail.position.start_date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Dringlichkeit</p>
                <p className="text-sm font-medium capitalize">
                  {matchDetail.position.urgency === "immediate" ? "Sofort" : matchDetail.position.urgency}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Gehaltsspanne</p>
              <p className="text-sm font-medium">
                {matchDetail.position.salary_range.min}–{matchDetail.position.salary_range.max} €/Monat
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Unterkunft</p>
              <p className="text-sm font-medium">
                {matchDetail.position.accommodation_provided ? "Ja, bereitgestellt" : "Nein"}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="mb-2 text-sm font-medium">Beschreibung</p>
            <p className="text-sm text-muted-foreground">
              {matchDetail.position.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {matchDetail.documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Dokumente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {matchDetail.documents.map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">{doc.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {matchDetail.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Anmerkungen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{matchDetail.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
