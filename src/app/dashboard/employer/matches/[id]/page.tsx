"use client";

import { use as reactUse } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  X,
  Upload,
  Clock,
  FileText,
  User,
  Building2,
} from "lucide-react";
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
import type { MatchStatus, MatchDocumentType } from "@/types/database";

const allStatuses: MatchStatus[] = [
  "proposed",
  "school_accepted",
  "employer_accepted",
  "both_accepted",
  "interview_scheduled",
  "contract_phase",
  "ihk_submitted",
  "approved",
  "visa_applied",
  "visa_granted",
  "arrived",
];

const statusLabels: Record<MatchStatus, string> = {
  proposed: "Vorgeschlagen",
  school_accepted: "Schule akzeptiert",
  employer_accepted: "AG akzeptiert",
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

const documentTypeLabels: Record<MatchDocumentType, string> = {
  berufsausbildungsvertrag: "Berufsausbildungsvertrag",
  erklaerung_beschaeftigung: "Erklärung zum Beschäftigungsverhältnis",
  ausbildungsplan: "Ausbildungsplan",
  mietvertrag: "Mietvertrag / Wohnungsnachweis",
  arbeitsvertrag: "Arbeitsvertrag",
  visa_application: "Visumsantrag",
  anerkennungsbescheid: "Anerkennungsbescheid",
  other: "Sonstige Dokumente",
};

interface MockMatchDetail {
  id: string;
  candidateName: string;
  candidateSpecialization: string;
  candidateGermanLevel: string;
  positionTitle: string;
  positionType: string;
  status: MatchStatus;
  createdAt: string;
  documents: {
    type: MatchDocumentType;
    fileName: string | null;
    signed: boolean;
    uploadedAt: string | null;
  }[];
}

const mockMatch: MockMatchDetail = {
  id: "match-3",
  candidateName: "Thi Lan Pham",
  candidateSpecialization: "Friseurhandwerk",
  candidateGermanLevel: "A2",
  positionTitle: "Friseur/in Fachkraft",
  positionType: "Fachkraft",
  status: "contract_phase",
  createdAt: "2026-02-10",
  documents: [
    {
      type: "berufsausbildungsvertrag",
      fileName: "vertrag_pham.pdf",
      signed: true,
      uploadedAt: "2026-02-28",
    },
    {
      type: "erklaerung_beschaeftigung",
      fileName: "erklaerung_pham.pdf",
      signed: false,
      uploadedAt: "2026-03-01",
    },
    {
      type: "ausbildungsplan",
      fileName: null,
      signed: false,
      uploadedAt: null,
    },
    {
      type: "mietvertrag",
      fileName: "mietvertrag_pham.pdf",
      signed: true,
      uploadedAt: "2026-02-25",
    },
    {
      type: "arbeitsvertrag",
      fileName: null,
      signed: false,
      uploadedAt: null,
    },
  ],
};

function StatusTimeline({ currentStatus }: { currentStatus: MatchStatus }) {
  const currentIdx = allStatuses.indexOf(currentStatus);
  const isTerminal = currentStatus === "rejected" || currentStatus === "withdrawn";

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2">
      {allStatuses.map((status, idx) => {
        const isCompleted = !isTerminal && idx < currentIdx;
        const isCurrent = !isTerminal && idx === currentIdx;

        return (
          <div key={status} className="flex items-center gap-1">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex size-7 items-center justify-center rounded-full text-xs font-medium ${
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : isCurrent
                    ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isCompleted ? <Check className="size-3.5" /> : idx + 1}
              </div>
              <span
                className={`text-[10px] text-center max-w-16 leading-tight ${
                  isCurrent ? "font-semibold text-foreground" : "text-muted-foreground"
                }`}
              >
                {statusLabels[status]}
              </span>
            </div>
            {idx < allStatuses.length - 1 && (
              <div
                className={`h-0.5 w-4 shrink-0 mt-[-16px] ${
                  isCompleted ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function MatchDetailPage() {
  const params = reactUse(
    Promise.resolve(useParams())
  ) as { id?: string | string[] | undefined };
  const match = mockMatch;

  const isEarlyStage =
    match.status === "proposed" ||
    match.status === "school_accepted";
  const isTerminal =
    match.status === "rejected" || match.status === "withdrawn";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/employer/matches">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">Match Details</h2>
          <p className="text-muted-foreground">Match ID: {params.id}</p>
        </div>
        <div className="flex gap-2">
          {isEarlyStage && (
            <>
              <Button>
                <Check className="size-4" />
                Akzeptieren
              </Button>
              <Button variant="destructive">
                <X className="size-4" />
                Ablehnen
              </Button>
            </>
          )}
          {!isTerminal && !isEarlyStage && (
            <Button variant="outline">
              <Upload className="size-4" />
              Dokument hochladen
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="size-5" />
            Status-Verlauf
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StatusTimeline currentStatus={match.status} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5" />
              Kandidat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{match.candidateName}</span>
              <Badge variant="secondary">{match.candidateSpecialization}</Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Deutschniveau: <span className="font-medium text-foreground">{match.candidateGermanLevel}</span>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/employer/candidates/cand-3">
                Vollständiges Profil ansehen
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="size-5" />
              Stelle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{match.positionTitle}</span>
              <Badge variant="outline">{match.positionType}</Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Erstellt am: {new Date(match.createdAt).toLocaleDateString("de-DE")}
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/employer/positions">
                Stellenübersicht
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-5" />
            Dokumente-Checkliste
          </CardTitle>
          <CardDescription>
            Übersicht der erforderlichen und hochgeladenen Dokumente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {match.documents.map((doc) => (
              <div
                key={doc.type}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">
                    {documentTypeLabels[doc.type]}
                  </p>
                  {doc.fileName ? (
                    <p className="text-xs text-muted-foreground">{doc.fileName}</p>
                  ) : (
                    <p className="text-xs text-destructive">Noch nicht hochgeladen</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {doc.fileName ? (
                    <>
                      <Badge variant={doc.signed ? "default" : "outline"}>
                        {doc.signed ? "Unterschrieben" : "Nicht unterschrieben"}
                      </Badge>
                      <Button variant="ghost" size="icon-xs">
                        <FileText className="size-3.5" />
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm">
                      <Upload className="size-3.5" />
                      Hochladen
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">Fortschritt:</span>
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{
                  width: `${
                    (match.documents.filter((d) => d.fileName).length /
                      match.documents.length) *
                    100
                  }%`,
                }}
              />
            </div>
            <span className="font-medium">
              {match.documents.filter((d) => d.fileName).length}/{match.documents.length}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
