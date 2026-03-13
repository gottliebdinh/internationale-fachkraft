"use client";

import { Download, Eye } from "lucide-react";
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

interface MockDocument {
  id: string;
  name: string;
  type: string;
  matchCandidate: string;
  matchPosition: string;
  signed: boolean;
  date: string;
}

const documentTypeLabels: Record<string, string> = {
  berufsausbildungsvertrag: "Berufsausbildungsvertrag",
  erklaerung_beschaeftigung: "Erklärung Beschäftigung",
  ausbildungsplan: "Ausbildungsplan",
  mietvertrag: "Mietvertrag",
  arbeitsvertrag: "Arbeitsvertrag",
  visa_application: "Visumsantrag",
  anerkennungsbescheid: "Anerkennungsbescheid",
};

const mockDocuments: MockDocument[] = [
  {
    id: "mdoc-1",
    name: "vertrag_nguyen.pdf",
    type: "berufsausbildungsvertrag",
    matchCandidate: "Thi Mai Nguyen",
    matchPosition: "Koch/Köchin Ausbildung",
    signed: true,
    date: "2026-02-28",
  },
  {
    id: "mdoc-2",
    name: "erklaerung_nguyen.pdf",
    type: "erklaerung_beschaeftigung",
    matchCandidate: "Thi Mai Nguyen",
    matchPosition: "Koch/Köchin Ausbildung",
    signed: true,
    date: "2026-03-01",
  },
  {
    id: "mdoc-3",
    name: "vertrag_pham.pdf",
    type: "berufsausbildungsvertrag",
    matchCandidate: "Thi Lan Pham",
    matchPosition: "Friseur/in Fachkraft",
    signed: true,
    date: "2026-02-25",
  },
  {
    id: "mdoc-4",
    name: "erklaerung_pham.pdf",
    type: "erklaerung_beschaeftigung",
    matchCandidate: "Thi Lan Pham",
    matchPosition: "Friseur/in Fachkraft",
    signed: false,
    date: "2026-03-01",
  },
  {
    id: "mdoc-5",
    name: "mietvertrag_pham.pdf",
    type: "mietvertrag",
    matchCandidate: "Thi Lan Pham",
    matchPosition: "Friseur/in Fachkraft",
    signed: true,
    date: "2026-02-25",
  },
  {
    id: "mdoc-6",
    name: "ausbildungsplan_le.pdf",
    type: "ausbildungsplan",
    matchCandidate: "Minh Hoang Le",
    matchPosition: "Pflegefachkraft Ausbildung",
    signed: false,
    date: "2026-03-05",
  },
  {
    id: "mdoc-7",
    name: "arbeitsvertrag_dang.pdf",
    type: "arbeitsvertrag",
    matchCandidate: "Quoc Bao Dang",
    matchPosition: "Pflegefachkraft Ausbildung",
    signed: true,
    date: "2026-01-20",
  },
];

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dokumente</h2>
        <p className="text-muted-foreground">
          Übersicht aller Match-bezogenen Dokumente und Verträge.
        </p>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dokument</TableHead>
              <TableHead>Typ</TableHead>
              <TableHead>Match</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Datum</TableHead>
              <TableHead className="w-24">
                <span className="sr-only">Aktionen</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockDocuments.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.name}</TableCell>
                <TableCell>
                  {documentTypeLabels[doc.type] ?? doc.type}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{doc.matchCandidate}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.matchPosition}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={doc.signed ? "default" : "outline"}>
                    {doc.signed ? "Unterschrieben" : "Ausstehend"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(doc.date).toLocaleDateString("de-DE")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon-xs" title="Ansehen">
                      <Eye className="size-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon-xs" title="Herunterladen">
                      <Download className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
