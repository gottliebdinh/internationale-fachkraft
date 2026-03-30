"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  CheckCircle2,
  Clock,
  GraduationCap,
  Building2,
  TrendingUp,
  Users,
} from "lucide-react";

const kpiCards = [
  {
    title: "Vermittlungen gesamt",
    value: "89",
    change: "+12 diesen Monat",
    icon: CheckCircle2,
  },
  {
    title: "Durchschn. Vermittlungsdauer",
    value: "4.2 Monate",
    change: "-0.3 vs. Vormonat",
    icon: Clock,
  },
  {
    title: "Aktive Kandidaten",
    value: "156",
    change: "+23 diese Woche",
    icon: Users,
  },
  {
    title: "Aktive Arbeitgeber",
    value: "28",
    change: "+2 diesen Monat",
    icon: Building2,
  },
];

const topSchools = [
  { name: "Deutsches Sprachzentrum HCMC", candidates: 64, placements: 19 },
  { name: "Pflegeschule Hanoi", candidates: 42, placements: 14 },
  { name: "Berufsschule Da Nang", candidates: 28, placements: 8 },
  { name: "Sprachinstitut Can Tho", candidates: 18, placements: 5 },
];

const topEmployers = [
  { name: "Hotel Vier Jahreszeiten", positions: 12, filled: 8 },
  { name: "Klinikum Süd", positions: 10, filled: 7 },
  { name: "Pflegezentrum Nord", positions: 8, filled: 5 },
  { name: "Gasthaus zum Löwen", positions: 6, filled: 4 },
];

const monthlyPlacements = [
  { month: "Okt", count: 6 },
  { month: "Nov", count: 8 },
  { month: "Dez", count: 5 },
  { month: "Jan", count: 10 },
  { month: "Feb", count: 12 },
  { month: "Mär", count: 14 },
];

const specializationDistribution = [
  { name: "Gastgewerbe", count: 45, color: "bg-blue-500" },
  { name: "Pflege", count: 32, color: "bg-emerald-500" },
  { name: "Friseurhandwerk", count: 12, color: "bg-amber-500" },
];

const maxMonthly = Math.max(...monthlyPlacements.map((m) => m.count));
const maxSpec = Math.max(...specializationDistribution.map((s) => s.count));

export default function AdminStatisticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Statistiken</h2>
        <p className="text-muted-foreground">
          Kennzahlen und Übersichten der Lotus&Eagle-Plattform
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                {kpi.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vermittlungen pro Monat</CardTitle>
            <CardDescription>Letzte 6 Monate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-48">
              {monthlyPlacements.map((month) => (
                <div key={month.month} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs font-medium">{month.count}</span>
                  <div
                    className="w-full rounded-t-md bg-primary transition-all"
                    style={{
                      height: `${(month.count / maxMonthly) * 100}%`,
                      minHeight: "8px",
                    }}
                  />
                  <span className="text-xs text-muted-foreground">{month.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verteilung nach Fachrichtung</CardTitle>
            <CardDescription>Kandidaten pro Fachbereich</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {specializationDistribution.map((spec) => (
                <div key={spec.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{spec.name}</span>
                    <span className="text-muted-foreground">{spec.count} Kandidaten</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${spec.color} transition-all`}
                      style={{ width: `${(spec.count / maxSpec) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Top Schulen
            </CardTitle>
            <CardDescription>Nach Anzahl der Vermittlungen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSchools.map((school, i) => (
                <div
                  key={school.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-bold">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{school.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {school.candidates} Kandidaten
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold">{school.placements} Vermittlungen</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Top Arbeitgeber
            </CardTitle>
            <CardDescription>Nach besetzten Stellen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topEmployers.map((employer, i) => (
                <div
                  key={employer.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-bold">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{employer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {employer.positions} Positionen
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold">{employer.filled} besetzt</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
