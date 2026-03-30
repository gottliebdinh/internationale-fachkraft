"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Shield, Search, Filter } from "lucide-react";

interface AuditEntry {
  id: string;
  timestamp: string;
  user_email: string;
  user_role: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  ip_address: string;
}

const placeholderAudit: AuditEntry[] = [
  {
    id: "a1",
    timestamp: "2026-03-09T14:23:00Z",
    user_email: "admin@lotus-eagle.de",
    user_role: "admin",
    action: "user.verified",
    entity_type: "school",
    entity_id: "s3",
    details: "Schule 'Pflegeschule Hanoi' verifiziert",
    ip_address: "192.168.1.10",
  },
  {
    id: "a2",
    timestamp: "2026-03-09T13:15:00Z",
    user_email: "schule@sprachzentrum.vn",
    user_role: "school",
    action: "candidate.created",
    entity_type: "candidate",
    entity_id: "c6",
    details: "Neuer Kandidat 'Dao Van G' erstellt",
    ip_address: "10.0.0.25",
  },
  {
    id: "a3",
    timestamp: "2026-03-09T11:42:00Z",
    user_email: "info@hotel-vj.de",
    user_role: "employer",
    action: "match.accepted",
    entity_type: "match",
    entity_id: "m1",
    details: "Match m1 akzeptiert",
    ip_address: "172.16.0.5",
  },
  {
    id: "a4",
    timestamp: "2026-03-08T16:30:00Z",
    user_email: "admin@lotus-eagle.de",
    user_role: "admin",
    action: "user.suspended",
    entity_type: "user",
    entity_id: "u8",
    details: "Benutzer u8 gesperrt – Verdacht auf Missbrauch",
    ip_address: "192.168.1.10",
  },
  {
    id: "a5",
    timestamp: "2026-03-08T10:05:00Z",
    user_email: "schule@sprachzentrum.vn",
    user_role: "school",
    action: "candidate.updated",
    entity_type: "candidate",
    entity_id: "c1",
    details: "Kandidatenprofil aktualisiert – Deutschniveau auf B2 geändert",
    ip_address: "10.0.0.25",
  },
  {
    id: "a6",
    timestamp: "2026-03-07T09:18:00Z",
    user_email: "hr@klinikum-sued.de",
    user_role: "employer",
    action: "document.uploaded",
    entity_type: "match_document",
    entity_id: "md4",
    details: "Berufsausbildungsvertrag hochgeladen für Match m3",
    ip_address: "172.16.0.12",
  },
  {
    id: "a7",
    timestamp: "2026-03-07T08:00:00Z",
    user_email: "admin@lotus-eagle.de",
    user_role: "admin",
    action: "data.exported",
    entity_type: "system",
    entity_id: "export-2026-03-07",
    details: "DSGVO-Datenexport durchgeführt",
    ip_address: "192.168.1.10",
  },
];

const actionLabels: Record<string, string> = {
  "user.verified": "Benutzer verifiziert",
  "user.suspended": "Benutzer gesperrt",
  "candidate.created": "Kandidat erstellt",
  "candidate.updated": "Kandidat aktualisiert",
  "match.accepted": "Match akzeptiert",
  "match.rejected": "Match abgelehnt",
  "document.uploaded": "Dokument hochgeladen",
  "data.exported": "Datenexport",
};

const actionVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  "user.verified": "default",
  "user.suspended": "destructive",
  "candidate.created": "secondary",
  "candidate.updated": "secondary",
  "match.accepted": "default",
  "match.rejected": "destructive",
  "document.uploaded": "outline",
  "data.exported": "outline",
};

export default function AdminAuditPage() {
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = placeholderAudit.filter((entry) => {
    if (actionFilter !== "all" && entry.action !== actionFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !entry.user_email.toLowerCase().includes(q) &&
        !entry.details.toLowerCase().includes(q)
      )
        return false;
    }
    if (dateFrom && entry.timestamp < dateFrom) return false;
    if (dateTo && entry.timestamp > dateTo + "T23:59:59Z") return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Audit-Protokoll</h2>
        <p className="text-muted-foreground">
          DSGVO-konformes Zugriffs- und Aktionsprotokoll
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4" />
            Datenschutzhinweis
          </CardTitle>
          <CardDescription>
            Dieses Protokoll wird gemäß DSGVO Art. 30 geführt und darf nur von
            autorisierten Administratoren eingesehen werden. Alle Zugriffe auf
            dieses Protokoll werden ebenfalls protokolliert.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex flex-wrap items-end gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Suche nach Benutzer oder Details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-end gap-2">
          <div className="space-y-1">
            <Label className="text-xs">Von</Label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-[150px]"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Bis</Label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-[150px]"
            />
          </div>
        </div>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-[200px]">
            <Filter className="mr-1.5 h-3.5 w-3.5" />
            <SelectValue placeholder="Aktion filtern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Aktionen</SelectItem>
            <SelectItem value="user.verified">Benutzer verifiziert</SelectItem>
            <SelectItem value="user.suspended">Benutzer gesperrt</SelectItem>
            <SelectItem value="candidate.created">Kandidat erstellt</SelectItem>
            <SelectItem value="candidate.updated">Kandidat aktualisiert</SelectItem>
            <SelectItem value="match.accepted">Match akzeptiert</SelectItem>
            <SelectItem value="match.rejected">Match abgelehnt</SelectItem>
            <SelectItem value="document.uploaded">Dokument hochgeladen</SelectItem>
            <SelectItem value="data.exported">Datenexport</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Zeitstempel</TableHead>
              <TableHead>Benutzer</TableHead>
              <TableHead>Aktion</TableHead>
              <TableHead>Entitätstyp</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>IP-Adresse</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-mono text-xs">
                  {new Date(entry.timestamp).toLocaleString("de-DE")}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{entry.user_email}</p>
                    <p className="text-xs text-muted-foreground capitalize">{entry.user_role}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={actionVariant[entry.action] ?? "outline"}>
                    {actionLabels[entry.action] ?? entry.action}
                  </Badge>
                </TableCell>
                <TableCell className="capitalize">{entry.entity_type}</TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {entry.details}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {entry.ip_address}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Keine Protokolleinträge gefunden
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" size="sm">
          Protokoll exportieren (CSV)
        </Button>
      </div>
    </div>
  );
}
