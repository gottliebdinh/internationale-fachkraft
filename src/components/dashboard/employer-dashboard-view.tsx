import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatJobStartLine } from "@/lib/format-job-start";
import { EmployerCandidateGrid9 } from "@/components/dashboard/employer-candidate-grid-9";
import { Building2, Calendar } from "lucide-react";
import type { GridCandidate } from "@/lib/employer-teaser-candidates";

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  employer_accepted: {
    label: "AG akzeptiert",
    cls: "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-200",
  },
  both_accepted: {
    label: "Beide akzeptiert",
    cls: "border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-200",
  },
  ihk_submitted: {
    label: "IHK eingereicht",
    cls: "border-purple-200 bg-purple-50 text-purple-800 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-200",
  },
  visa_applied: {
    label: "Visum beantragt",
    cls: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200",
  },
  visa_granted: {
    label: "Visum erteilt",
    cls: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  },
  arrived: {
    label: "Angekommen",
    cls: "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200",
  },
};

function getAge(dob: string | null): number | null {
  if (!dob) return null;
  const b = new Date(dob);
  if (isNaN(b.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  if (
    now.getMonth() < b.getMonth() ||
    (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())
  )
    age--;
  return age;
}

type MatchRow = {
  id: string;
  status: string;
  photoUrl: string | null;
  candidates: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    date_of_birth: string | null;
    german_level: string | null;
    desired_position: string | null;
    desired_field: string | null;
    position_type: string | null;
  } | null;
};

type PositionBlock = {
  id: string;
  title: string;
  position_type: string | null;
  slots_total: number;
  start_date: string;
  matches: MatchRow[];
};

type EmployerMini = {
  company_name: string;
  contact_person: string | null;
  phone: string | null;
};

type Props = {
  employer: EmployerMini;
  positions: PositionBlock[];
  totalMatches: number;
  teaserCandidates: GridCandidate[];
  /** z. B. `/dashboard/employer/candidates` oder `/admin/candidates` */
  candidateProfileBasePath: string;
};

export function EmployerDashboardView({
  employer,
  positions,
  totalMatches,
  teaserCandidates,
  candidateProfileBasePath,
}: Props) {
  const base = candidateProfileBasePath.replace(/\/$/, "");

  if (totalMatches === 0) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h1 className="font-[var(--font-display)] text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Willkommen, {employer.company_name}
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Ihre Stellen und zugeordnete Kandidaten im Überblick
            </p>
          </div>
        </div>

        {positions.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            Noch keine Stellen angelegt.
          </p>
        )}

        {teaserCandidates.length > 0 && (
          <div className="flex min-h-[28rem] flex-1 flex-col">
            <div className="mb-3 shrink-0 space-y-0.5 sm:space-y-1">
              <h2 className="font-[var(--font-display)] text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                Ihre Kandidaten
              </h2>
              <p className="text-sm text-muted-foreground sm:text-base">
                Passende Vorschläge zu Ihrer ausgeschriebenen Stelle
              </p>
            </div>
            <EmployerCandidateGrid9
              candidates={teaserCandidates}
              contactPersonName={employer.contact_person?.trim() || null}
              initialSubmittedPhone={employer.phone?.trim() || null}
              className="min-h-0 flex-1"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 pb-8">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
          <Building2 className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Willkommen, {employer.company_name}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Ihre Stellen und zugeordnete Kandidaten im Überblick
          </p>
        </div>
      </div>

      {positions.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Noch keine Stellen angelegt.
        </p>
      )}

      {positions.map((pos) => {
        const filled = pos.matches.length;
        const full = filled >= pos.slots_total && pos.slots_total > 0;

        return (
          <section key={pos.id}>
            <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="font-[var(--font-display)] text-lg font-semibold tracking-tight text-foreground">
                {capitalize(pos.title)}
              </h2>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {formatJobStartLine(pos.start_date)}
              </span>
              <span
                className={`ml-auto text-xs font-medium ${
                  full
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-muted-foreground"
                }`}
              >
                {filled}/{pos.slots_total} besetzt
              </span>
            </div>

            {pos.matches.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Noch keine Kandidaten zugeordnet.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pos.matches.map((m) => {
                  const c = m.candidates;
                  if (!c) return null;
                  const age = getAge(c.date_of_birth);
                  const st = STATUS_LABELS[m.status];
                  const initials =
                    (c.first_name?.[0] ?? "") + (c.last_name?.[0] ?? "");

                  return (
                    <Link
                      key={m.id}
                      href={`${base}/${c.id}`}
                      className="group overflow-hidden rounded-xl border border-border bg-card ring-1 ring-transparent transition-all hover:border-border/80 hover:shadow-md hover:ring-foreground/5"
                    >
                      <div className="relative h-[19rem] w-full bg-muted sm:h-[22rem]">
                        {m.photoUrl ? (
                          <Image
                            src={m.photoUrl}
                            alt={`${c.first_name} ${c.last_name}`}
                            fill
                            className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted text-3xl font-semibold text-muted-foreground/40">
                            {initials || "?"}
                          </div>
                        )}

                        {st && (
                          <div className="absolute right-2 top-2">
                            <Badge
                              variant="outline"
                              className={`bg-card/90 text-xs font-medium backdrop-blur-sm ${st.cls}`}
                            >
                              {st.label}
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2.5 px-4 py-3.5">
                        <div>
                          <p className="text-base font-semibold leading-snug text-foreground">
                            {c.first_name} {c.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {age !== null ? `${age} Jahre` : "Alter unbekannt"}
                          </p>
                        </div>

                        {c.desired_position && (
                          <p className="text-sm leading-snug text-foreground/80">
                            {capitalize(c.desired_position)}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-1.5">
                          {c.desired_field && (
                            <Badge variant="secondary">{c.desired_field}</Badge>
                          )}
                          {c.german_level && (
                            <Badge variant="outline">Deutsch {c.german_level}</Badge>
                          )}
                          {c.position_type && (
                            <Badge variant="outline">{c.position_type}</Badge>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
