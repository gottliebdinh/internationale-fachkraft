import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap, UserCheck, Handshake, CheckCircle2 } from "lucide-react";

const stats = [
  {
    title: "Kandidaten gesamt",
    value: 64,
    icon: GraduationCap,
    description: "Registrierte Kandidaten",
  },
  {
    title: "Aktive Kandidaten",
    value: 38,
    icon: UserCheck,
    description: "Bereit zur Vermittlung",
  },
  {
    title: "Eingehende Matches",
    value: 5,
    icon: Handshake,
    description: "Neue Vorschläge",
  },
  {
    title: "Vermittelt",
    value: 19,
    icon: CheckCircle2,
    description: "Erfolgreich platziert",
  },
];

const recentActivity = [
  {
    id: "1",
    description: "Neuer Match-Vorschlag für Nguyen Van A",
    type: "match",
    date: "2026-03-08",
  },
  {
    id: "2",
    description: "Kandidat Tran Thi B – Visum genehmigt",
    type: "status",
    date: "2026-03-07",
  },
  {
    id: "3",
    description: "Dokument-Anforderung: Le Van C – B1-Zertifikat",
    type: "document",
    date: "2026-03-06",
  },
  {
    id: "4",
    description: "Pham Thi D – Profil aktualisiert",
    type: "update",
    date: "2026-03-05",
  },
];

export default function SchoolDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Schul-Dashboard</h2>
        <p className="text-muted-foreground">
          Übersicht Ihrer Kandidaten und Vermittlungen
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
          <CardTitle>Letzte Aktivitäten</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <p className="text-sm font-medium">{activity.description}</p>
                <p className="text-xs text-muted-foreground">
                  {activity.date}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
