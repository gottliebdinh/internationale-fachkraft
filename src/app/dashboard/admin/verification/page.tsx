"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  X,
  FileText,
  Building2,
  GraduationCap,
  Calendar,
  ExternalLink,
} from "lucide-react";

interface VerificationEntry {
  id: string;
  type: "school" | "employer";
  organization_name: string;
  contact_person: string;
  email: string;
  submitted_at: string;
  documents: { name: string; type: string }[];
  details: Record<string, string>;
}

const pendingVerifications: VerificationEntry[] = [
  {
    id: "v1",
    type: "school",
    organization_name: "Pflegeschule Hanoi",
    contact_person: "Dr. Le Thi Mai",
    email: "leitung@pflegeschule-hanoi.vn",
    submitted_at: "2026-03-01",
    documents: [
      { name: "Lizenz_Hanoi_2025.pdf", type: "Lizenzurkunde" },
      { name: "Akkreditierung_MOET.pdf", type: "Akkreditierung" },
    ],
    details: {
      Region: "Hanoi",
      Lizenznummer: "VN-DE-2025-0088",
      Behördenzugehörigkeit: "Sở Giáo dục và Đào tạo Hà Nội",
    },
  },
  {
    id: "v2",
    type: "employer",
    organization_name: "Salon Elegance GmbH",
    contact_person: "Maria Schmidt",
    email: "kontakt@salon-elegance.de",
    submitted_at: "2026-02-10",
    documents: [
      { name: "Gewerbeschein_2024.pdf", type: "Gewerbeschein" },
      { name: "Handwerksrolle.pdf", type: "Handwerksrollenauszug" },
    ],
    details: {
      Branche: "Friseurhandwerk",
      Stadt: "München",
      PLZ: "80331",
      Gewerbescheinnummer: "HWK-MUC-2024-1234",
    },
  },
  {
    id: "v3",
    type: "employer",
    organization_name: "Pflegezentrum Nord GmbH",
    contact_person: "Thomas Bauer",
    email: "hr@pflegezentrum-nord.de",
    submitted_at: "2026-02-25",
    documents: [
      { name: "Gewerbeschein_PZN.pdf", type: "Gewerbeschein" },
      { name: "Versorgungsvertrag.pdf", type: "Versorgungsvertrag" },
    ],
    details: {
      Branche: "Pflege",
      Stadt: "Hamburg",
      PLZ: "20095",
      Gewerbescheinnummer: "HK-HH-2024-5678",
    },
  },
];

export default function AdminVerificationPage() {
  const [tab, setTab] = useState("all");
  const [entries, setEntries] = useState(pendingVerifications);

  const filtered =
    tab === "all"
      ? entries
      : entries.filter((e) => e.type === tab);

  function handleApprove(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function handleReject(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Verifizierungswarteschlange</h2>
        <p className="text-muted-foreground">
          Prüfen und verifizieren Sie neue Schulen und Arbeitgeber
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">
            Alle ({entries.length})
          </TabsTrigger>
          <TabsTrigger value="school">
            Schulen ({entries.filter((e) => e.type === "school").length})
          </TabsTrigger>
          <TabsTrigger value="employer">
            Arbeitgeber ({entries.filter((e) => e.type === "employer").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">
                  Keine ausstehenden Verifizierungen
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filtered.map((entry) => (
                <Card key={entry.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {entry.type === "school" ? (
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                          )}
                          {entry.organization_name}
                        </CardTitle>
                        <CardDescription>
                          {entry.contact_person} &middot; {entry.email}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">
                        {entry.type === "school" ? "Schule" : "Arbeitgeber"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {Object.entries(entry.details).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-xs text-muted-foreground">{key}</p>
                          <p className="text-sm font-medium">{value}</p>
                        </div>
                      ))}
                      <div>
                        <p className="text-xs text-muted-foreground">Eingereicht am</p>
                        <p className="text-sm font-medium flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {entry.submitted_at}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Eingereichte Dokumente</p>
                      <div className="space-y-1">
                        {entry.documents.map((doc) => (
                          <div
                            key={doc.name}
                            className="flex items-center justify-between rounded-md border p-2"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm">{doc.name}</p>
                                <p className="text-xs text-muted-foreground">{doc.type}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Button size="sm" onClick={() => handleApprove(entry.id)}>
                        <Check className="mr-1.5 h-3.5 w-3.5" />
                        Genehmigen
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(entry.id)}
                      >
                        <X className="mr-1.5 h-3.5 w-3.5" />
                        Ablehnen
                      </Button>
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
