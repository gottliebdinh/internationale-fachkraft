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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, Eye, Ban, ShieldCheck, UserCog, Search } from "lucide-react";
import type { UserRole } from "@/types/database";

interface UserEntry {
  id: string;
  email: string;
  role: UserRole;
  verified: boolean;
  created_at: string;
  organization_name: string | null;
}

const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  school: "Schule",
  employer: "Arbeitgeber",
};

const roleVariant: Record<UserRole, "default" | "secondary" | "outline"> = {
  admin: "default",
  school: "secondary",
  employer: "outline",
};

const placeholderUsers: UserEntry[] = [
  {
    id: "u1",
    email: "admin@gevin.de",
    role: "admin",
    verified: true,
    created_at: "2025-06-01",
    organization_name: null,
  },
  {
    id: "u2",
    email: "schule@sprachzentrum.vn",
    role: "school",
    verified: true,
    created_at: "2025-08-15",
    organization_name: "Deutsches Sprachzentrum HCMC",
  },
  {
    id: "u3",
    email: "info@hotel-vj.de",
    role: "employer",
    verified: true,
    created_at: "2025-09-20",
    organization_name: "Hotel Vier Jahreszeiten",
  },
  {
    id: "u4",
    email: "kontakt@salon-elegance.de",
    role: "employer",
    verified: false,
    created_at: "2026-02-10",
    organization_name: "Salon Elegance GmbH",
  },
  {
    id: "u5",
    email: "leitung@pflegeschule-hanoi.vn",
    role: "school",
    verified: false,
    created_at: "2026-03-01",
    organization_name: "Pflegeschule Hanoi",
  },
  {
    id: "u6",
    email: "hr@klinikum-sued.de",
    role: "employer",
    verified: true,
    created_at: "2025-11-05",
    organization_name: "Klinikum Süd",
  },
  {
    id: "u7",
    email: "verwaltung@gasthaus-loewen.de",
    role: "employer",
    verified: true,
    created_at: "2025-12-18",
    organization_name: "Gasthaus zum Löwen",
  },
];

export default function AdminUsersPage() {
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = placeholderUsers.filter((user) => {
    if (roleFilter !== "all" && user.role !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        user.email.toLowerCase().includes(q) ||
        user.organization_name?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Benutzerverwaltung</h2>
        <p className="text-muted-foreground">
          Alle registrierten Benutzer verwalten
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Suche nach E-Mail oder Organisation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Rolle filtern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Rollen</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="school">Schule</SelectItem>
            <SelectItem value="employer">Arbeitgeber</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>E-Mail</TableHead>
              <TableHead>Organisation</TableHead>
              <TableHead>Rolle</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Erstellt am</TableHead>
              <TableHead className="w-[60px]">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>{user.organization_name ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={roleVariant[user.role]}>
                    {roleLabels[user.role]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.verified ? "default" : "outline"}>
                    {user.verified ? "Verifiziert" : "Unverifiziert"}
                  </Badge>
                </TableCell>
                <TableCell>{user.created_at}</TableCell>
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
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4" />
                        Ansehen
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <UserCog className="h-4 w-4" />
                        Rolle ändern
                      </DropdownMenuItem>
                      {!user.verified && (
                        <DropdownMenuItem>
                          <ShieldCheck className="h-4 w-4" />
                          Verifizieren
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">
                        <Ban className="h-4 w-4" />
                        Sperren
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Keine Benutzer gefunden
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
