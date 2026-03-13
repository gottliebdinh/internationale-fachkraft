"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Briefcase,
  GraduationCap,
  Globe,
  FileText,
  Video,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import type { CandidateWithDocuments, CandidateDocument } from "@/types/database";

const mockCandidate: CandidateWithDocuments = {
  id: "cand-1",
  school_id: "school-1",
  first_name: "Thi Mai",
  last_name: "Nguyen",
  date_of_birth: "1998-05-12",
  nationality: "Vietnamesisch",
  passport_number: "B12345678",
  passport_expiry: "2030-05-12",
  gender: "female",
  specialization: "hospitality",
  german_level: "B1",
  b1_certificate_date: "2026-01-10",
  education_level: "Bachelor Tourismusmanagement",
  work_experience_years: 3,
  availability_date: "2026-06-01",
  urgency: "3_months",
  video_intro_url: "https://example.com/video/thi-mai",
  profile_photo_url: null,
  status: "active",
  created_at: "2025-12-01T10:00:00Z",
  updated_at: "2025-12-01T10:00:00Z",
  documents: [
    {
      id: "doc-1",
      candidate_id: "cand-1",
      document_type: "passport",
      file_url: "#",
      file_name: "passport_nguyen.pdf",
      verified_by_admin: true,
      uploaded_at: "2025-12-01T10:00:00Z",
    },
    {
      id: "doc-2",
      candidate_id: "cand-1",
      document_type: "b1_certificate",
      file_url: "#",
      file_name: "b1_zertifikat.pdf",
      verified_by_admin: true,
      uploaded_at: "2026-01-10T10:00:00Z",
    },
    {
      id: "doc-3",
      candidate_id: "cand-1",
      document_type: "cv",
      file_url: "#",
      file_name: "lebenslauf_nguyen.pdf",
      verified_by_admin: false,
      uploaded_at: "2025-12-05T10:00:00Z",
    },
    {
      id: "doc-4",
      candidate_id: "cand-1",
      document_type: "diploma",
      file_url: "#",
      file_name: "diplom_tourismus.pdf",
      verified_by_admin: true,
      uploaded_at: "2025-12-02T10:00:00Z",
    },
  ],
  school: {
    id: "school-1",
    user_id: "user-school-1",
    name: "Hanoi Language & Vocational Academy",
    license_number: "VN-2024-001",
    region: "Hanoi",
    contact_person: "Dr. Tran Van Minh",
    phone: "+84 24 1234 5678",
    website: "https://hlva.edu.vn",
    government_affiliation: "Ministry of Education Vietnam",
    verified: true,
    documents: {},
    created_at: "2024-06-01T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
  },
};

const documentTypeLabels: Record<string, string> = {
  passport: "Reisepass",
  b1_certificate: "B1-Zertifikat",
  cv: "Lebenslauf",
  diploma: "Zeugnis/Diplom",
  health_certificate: "Gesundheitszeugnis",
  video: "Video",
  other: "Sonstige",
};

const specializationLabels: Record<string, string> = {
  hospitality: "Gastronomie",
  hairdressing: "Friseurhandwerk",
  nursing: "Pflege",
  other: "Andere",
};

export default function CandidateDetailPage() {
  const params = useParams();
  const candidate = mockCandidate;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/employer/candidates">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">
            {candidate.first_name} {candidate.last_name}
          </h2>
          <p className="text-muted-foreground">
            Kandidatenprofil · ID: {params.id}
          </p>
        </div>
        <Button>
          <Send className="size-4" />
          Match anfragen
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Persönliche Informationen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6">
                <Avatar size="lg" className="size-20">
                  <AvatarFallback className="text-xl">
                    {candidate.first_name[0]}
                    {candidate.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 gap-4 sm:grid-cols-2">
                  <InfoRow
                    icon={<GraduationCap className="size-4" />}
                    label="Ausbildung"
                    value={candidate.education_level}
                  />
                  <InfoRow
                    icon={<Briefcase className="size-4" />}
                    label="Berufserfahrung"
                    value={`${candidate.work_experience_years} Jahre`}
                  />
                  <InfoRow
                    icon={<Globe className="size-4" />}
                    label="Nationalität"
                    value={candidate.nationality}
                  />
                  <InfoRow
                    icon={<Calendar className="size-4" />}
                    label="Geburtsdatum"
                    value={new Date(candidate.date_of_birth).toLocaleDateString("de-DE")}
                  />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  {specializationLabels[candidate.specialization]}
                </Badge>
                <Badge variant="default">Deutsch {candidate.german_level}</Badge>
                <Badge variant="outline">
                  Verfügbar ab {new Date(candidate.availability_date).toLocaleDateString("de-DE")}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="size-5" />
                Video-Vorstellung
              </CardTitle>
            </CardHeader>
            <CardContent>
              {candidate.video_intro_url ? (
                <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Video className="mx-auto size-12 mb-2 opacity-50" />
                    <p className="text-sm">Video-Vorstellung verfügbar</p>
                    <Button variant="outline" size="sm" className="mt-3">
                      Video abspielen
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Keine Video-Vorstellung vorhanden.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-5" />
                Dokumente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {candidate.documents && candidate.documents.length > 0 ? (
                candidate.documents.map((doc: CandidateDocument) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">
                        {documentTypeLabels[doc.document_type] ?? doc.document_type}
                      </p>
                      <p className="text-xs text-muted-foreground">{doc.file_name}</p>
                    </div>
                    <Badge variant={doc.verified_by_admin ? "default" : "outline"}>
                      {doc.verified_by_admin ? "Verifiziert" : "Ausstehend"}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Keine Dokumente vorhanden.</p>
              )}
            </CardContent>
          </Card>

          {candidate.school && (
            <Card>
              <CardHeader>
                <CardTitle>Partnerschule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-medium">{candidate.school.name}</p>
                <p className="text-muted-foreground">Region: {candidate.school.region}</p>
                <p className="text-muted-foreground">
                  Kontakt: {candidate.school.contact_person}
                </p>
                {candidate.school.verified && (
                  <Badge variant="default">Verifiziert</Badge>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
