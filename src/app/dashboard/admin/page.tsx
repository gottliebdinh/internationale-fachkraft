import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, ShieldCheck, Handshake, CheckCircle2 } from "lucide-react";

const stats = [
  {
    title: "Benutzer gesamt",
    value: 142,
    icon: Users,
    description: "Registrierte Benutzer",
  },
  {
    title: "Ausstehende Verifizierungen",
    value: 7,
    icon: ShieldCheck,
    description: "Warten auf Prüfung",
  },
  {
    title: "Aktive Matches",
    value: 34,
    icon: Handshake,
    description: "In Bearbeitung",
  },
  {
    title: "Vermittlungen gesamt",
    value: 89,
    icon: CheckCircle2,
    description: "Erfolgreich abgeschlossen",
  },
];

const systemOverview = [
  { label: "Schulen", value: 12 },
  { label: "Arbeitgeber", value: 28 },
  { label: "Kandidaten", value: 102 },
  { label: "Offene Stellen", value: 45 },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Admin-Dashboard</h2>
        <p className="text-muted-foreground">
          Systemübersicht und Verwaltung
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Systemübersicht</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {systemOverview.map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center rounded-lg border p-4"
              >
                <span className="text-2xl font-bold">{item.value}</span>
                <span className="text-sm text-muted-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
