import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Briefcase, Users, Handshake, CheckCircle2 } from "lucide-react";

const stats = [
  {
    title: "Aktive Stellen",
    value: 12,
    icon: Briefcase,
    description: "Offene Positionen",
  },
  {
    title: "Kandidaten gesamt",
    value: 48,
    icon: Users,
    description: "Vorgeschlagene Kandidaten",
  },
  {
    title: "Aktive Matches",
    value: 8,
    icon: Handshake,
    description: "In Bearbeitung",
  },
  {
    title: "Vermittelt",
    value: 23,
    icon: CheckCircle2,
    description: "Erfolgreich platziert",
  },
];

const recentMatches = [
  {
    id: "1",
    candidateName: "Nguyen Van A",
    position: "Koch – Ausbildung",
    status: "Interview geplant",
    date: "2026-03-07",
  },
  {
    id: "2",
    candidateName: "Tran Thi B",
    position: "Friseurin – Fachkraft",
    status: "Vertrag in Vorbereitung",
    date: "2026-03-05",
  },
  {
    id: "3",
    candidateName: "Le Van C",
    position: "Pflegefachkraft",
    status: "Vorgeschlagen",
    date: "2026-03-04",
  },
  {
    id: "4",
    candidateName: "Pham Thi D",
    position: "Koch – Fachkraft",
    status: "Beide akzeptiert",
    date: "2026-03-02",
  },
];

export default function EmployerDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Arbeitgeber-Dashboard
        </h2>
        <p className="text-muted-foreground">
          Übersicht Ihrer Stellen und Vermittlungen
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
          <CardTitle>Aktuelle Matches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentMatches.map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="space-y-1">
                  <p className="font-medium">{match.candidateName}</p>
                  <p className="text-sm text-muted-foreground">
                    {match.position}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{match.status}</p>
                  <p className="text-xs text-muted-foreground">{match.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
