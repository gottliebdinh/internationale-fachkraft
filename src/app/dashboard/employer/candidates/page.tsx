"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Candidate, Industry, GermanLevel, Urgency } from "@/types/database";

const specializationLabels: Record<Industry, string> = {
  hospitality: "Gastronomie",
  hairdressing: "Friseurhandwerk",
  nursing: "Pflege",
  other: "Andere",
};

const germanLevelColors: Record<GermanLevel, "default" | "secondary" | "outline"> = {
  A1: "outline",
  A2: "outline",
  B1: "secondary",
  B2: "default",
  C1: "default",
};

const urgencyLabels: Record<Urgency, string> = {
  immediate: "Sofort",
  "3_months": "3 Monate",
  "6_months": "6 Monate",
  flexible: "Flexibel",
};

const mockCandidates: Candidate[] = [
  {
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
    education_level: "Bachelor",
    work_experience_years: 3,
    availability_date: "2026-06-01",
    urgency: "3_months",
    video_intro_url: null,
    profile_photo_url: null,
    status: "active",
    position_type: null,
    desired_position: null,
    desired_field: null,
    created_at: "2025-12-01T10:00:00Z",
    updated_at: "2025-12-01T10:00:00Z",
  },
  {
    id: "cand-2",
    school_id: "school-1",
    first_name: "Van Duc",
    last_name: "Tran",
    date_of_birth: "1999-08-23",
    nationality: "Vietnamesisch",
    passport_number: "B87654321",
    passport_expiry: "2031-08-23",
    gender: "male",
    specialization: "hospitality",
    german_level: "B2",
    b1_certificate_date: "2025-11-20",
    education_level: "Berufsausbildung",
    work_experience_years: 5,
    availability_date: "2026-04-01",
    urgency: "immediate",
    video_intro_url: "https://example.com/video",
    profile_photo_url: null,
    status: "active",
    position_type: null,
    desired_position: null,
    desired_field: null,
    created_at: "2025-11-15T10:00:00Z",
    updated_at: "2025-11-15T10:00:00Z",
  },
  {
    id: "cand-3",
    school_id: "school-2",
    first_name: "Thi Lan",
    last_name: "Pham",
    date_of_birth: "2000-01-30",
    nationality: "Vietnamesisch",
    passport_number: "C11223344",
    passport_expiry: "2032-01-30",
    gender: "female",
    specialization: "hairdressing",
    german_level: "A2",
    b1_certificate_date: null,
    education_level: "Abitur",
    work_experience_years: 2,
    availability_date: "2026-09-01",
    urgency: "6_months",
    video_intro_url: null,
    profile_photo_url: null,
    status: "active",
    position_type: null,
    desired_position: null,
    desired_field: null,
    created_at: "2026-01-05T10:00:00Z",
    updated_at: "2026-01-05T10:00:00Z",
  },
  {
    id: "cand-4",
    school_id: "school-2",
    first_name: "Minh Hoang",
    last_name: "Le",
    date_of_birth: "1997-11-05",
    nationality: "Vietnamesisch",
    passport_number: "D55667788",
    passport_expiry: "2029-11-05",
    gender: "male",
    specialization: "nursing",
    german_level: "B1",
    b1_certificate_date: "2026-02-01",
    education_level: "Bachelor",
    work_experience_years: 4,
    availability_date: "2026-07-01",
    urgency: "3_months",
    video_intro_url: null,
    profile_photo_url: null,
    status: "active",
    position_type: null,
    desired_position: null,
    desired_field: null,
    created_at: "2026-01-20T10:00:00Z",
    updated_at: "2026-01-20T10:00:00Z",
  },
  {
    id: "cand-5",
    school_id: "school-1",
    first_name: "Thi Huong",
    last_name: "Vo",
    date_of_birth: "2001-03-18",
    nationality: "Vietnamesisch",
    passport_number: "E99001122",
    passport_expiry: "2033-03-18",
    gender: "female",
    specialization: "hospitality",
    german_level: "B1",
    b1_certificate_date: "2026-01-25",
    education_level: "Abitur",
    work_experience_years: 1,
    availability_date: "2026-08-01",
    urgency: "flexible",
    video_intro_url: null,
    profile_photo_url: null,
    status: "active",
    position_type: null,
    desired_position: null,
    desired_field: null,
    created_at: "2026-02-10T10:00:00Z",
    updated_at: "2026-02-10T10:00:00Z",
  },
  {
    id: "cand-6",
    school_id: "school-3",
    first_name: "Quoc Bao",
    last_name: "Dang",
    date_of_birth: "1996-07-22",
    nationality: "Vietnamesisch",
    passport_number: "F33445566",
    passport_expiry: "2030-07-22",
    gender: "male",
    specialization: "nursing",
    german_level: "B2",
    b1_certificate_date: "2025-09-15",
    education_level: "Bachelor",
    work_experience_years: 6,
    availability_date: "2026-05-01",
    urgency: "immediate",
    video_intro_url: "https://example.com/video2",
    profile_photo_url: null,
    status: "active",
    position_type: null,
    desired_position: null,
    desired_field: null,
    created_at: "2025-10-01T10:00:00Z",
    updated_at: "2025-10-01T10:00:00Z",
  },
];

export default function CandidatesPage() {
  const [searchText, setSearchText] = useState("");
  const [specFilter, setSpecFilter] = useState<string>("all");
  const [germanFilter, setGermanFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");

  const filtered = mockCandidates.filter((c) => {
    if (specFilter !== "all" && c.specialization !== specFilter) return false;
    if (germanFilter !== "all" && c.german_level !== germanFilter) return false;
    if (urgencyFilter !== "all" && c.urgency !== urgencyFilter) return false;
    if (searchText) {
      const q = searchText.toLowerCase();
      const fullName = `${c.first_name} ${c.last_name}`.toLowerCase();
      if (!fullName.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Kandidatensuche</h2>
        <p className="text-muted-foreground">
          Durchsuchen Sie qualifizierte Kandidaten aus vietnamesischen Partnerschulen.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Name suchen..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={specFilter} onValueChange={(val) => setSpecFilter(val ?? "all")}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Fachrichtung" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Fachrichtungen</SelectItem>
            <SelectItem value="hospitality">Gastronomie</SelectItem>
            <SelectItem value="hairdressing">Friseurhandwerk</SelectItem>
            <SelectItem value="nursing">Pflege</SelectItem>
            <SelectItem value="other">Andere</SelectItem>
          </SelectContent>
        </Select>

        <Select value={germanFilter} onValueChange={(val) => setGermanFilter(val ?? "all")}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Deutschniveau" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Niveaus</SelectItem>
            <SelectItem value="A1">A1</SelectItem>
            <SelectItem value="A2">A2</SelectItem>
            <SelectItem value="B1">B1</SelectItem>
            <SelectItem value="B2">B2</SelectItem>
            <SelectItem value="C1">C1</SelectItem>
          </SelectContent>
        </Select>

        <Select value={urgencyFilter} onValueChange={(val) => setUrgencyFilter(val ?? "all")}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Verfügbarkeit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle</SelectItem>
            <SelectItem value="immediate">Sofort</SelectItem>
            <SelectItem value="3_months">3 Monate</SelectItem>
            <SelectItem value="6_months">6 Monate</SelectItem>
            <SelectItem value="flexible">Flexibel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-lg font-medium">Keine Kandidaten gefunden</p>
          <p className="text-sm text-muted-foreground">
            Versuchen Sie andere Filterkriterien.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((candidate) => (
            <Link
              key={candidate.id}
              href={`/dashboard/employer/candidates/${candidate.id}`}
            >
              <Card className="transition-shadow hover:shadow-md cursor-pointer h-full">
                <CardContent className="flex gap-4">
                  <Avatar size="lg">
                    <AvatarFallback>
                      {candidate.first_name[0]}
                      {candidate.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="font-semibold leading-tight">
                        {candidate.first_name} {candidate.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {candidate.education_level} · {candidate.work_experience_years} Jahre Erfahrung
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="secondary">
                        {specializationLabels[candidate.specialization]}
                      </Badge>
                      <Badge variant={germanLevelColors[candidate.german_level]}>
                        Deutsch {candidate.german_level}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <p>Verfügbar ab: {new Date(candidate.availability_date).toLocaleDateString("de-DE")}</p>
                      <p>Dringlichkeit: {urgencyLabels[candidate.urgency]}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
