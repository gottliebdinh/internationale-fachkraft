"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Check, ExternalLink, Loader2 } from "lucide-react";

const PIPELINE_STEPS = [
  { key: "employer_accepted", label: "AG akzeptiert" },
  { key: "both_accepted", label: "Beide akzeptiert" },
  { key: "ihk_submitted", label: "IHK eingereicht" },
  { key: "visa_applied", label: "Visum beantragt" },
  { key: "visa_granted", label: "Visum erteilt" },
  { key: "arrived", label: "Angekommen" },
];

type Props = {
  matchId: string;
  employerId: string;
  currentStatus: string;
  employer: {
    id: string;
    company_name: string;
    position_title: string;
  };
};

export function MatchPipelineEditor({
  matchId,
  employerId,
  currentStatus,
  employer,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  const currentIndex = PIPELINE_STEPS.findIndex((s) => s.key === status);

  async function updateStatus(newStatus: string) {
    if (newStatus === status || saving) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/employers/${employerId}/matches`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ match_id: matchId, status: newStatus }),
      });
      if (res.ok) {
        setStatus(newStatus);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardContent className="py-5">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">{employer.company_name}</p>
              <p className="text-xs text-muted-foreground">
                {employer.position_title}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/admin/employers/${employer.id}`}
              className="gap-1.5"
            >
              Zum Unternehmen
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Prozess-Status
          </p>
          {saving && (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
          )}
        </div>

        <div className="flex items-center gap-0">
          {PIPELINE_STEPS.map((step, i) => {
            const done = i <= currentIndex;
            const isCurrent = i === currentIndex;
            return (
              <div
                key={step.key}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div className="flex w-full items-center">
                  {i > 0 ? (
                    <div
                      className={`h-0.5 flex-1 transition-colors ${
                        i <= currentIndex
                          ? "bg-[oklch(0.50_0.11_195)]"
                          : "bg-border"
                      }`}
                    />
                  ) : (
                    <div className="flex-1" />
                  )}

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => updateStatus(step.key)}
                    className={`relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 text-xs font-semibold transition-all hover:scale-110 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                      done
                        ? "border-[oklch(0.50_0.11_195)] bg-[oklch(0.50_0.11_195)] text-white"
                        : "border-border bg-background text-muted-foreground hover:border-[oklch(0.50_0.11_195)]/50"
                    } ${isCurrent ? "ring-2 ring-[oklch(0.50_0.11_195)]/30 ring-offset-2 ring-offset-background" : ""}`}
                  >
                    {done ? <Check className="h-4 w-4" /> : i + 1}
                  </button>

                  {i < PIPELINE_STEPS.length - 1 ? (
                    <div
                      className={`h-0.5 flex-1 transition-colors ${
                        i < currentIndex
                          ? "bg-[oklch(0.50_0.11_195)]"
                          : "bg-border"
                      }`}
                    />
                  ) : (
                    <div className="flex-1" />
                  )}
                </div>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => updateStatus(step.key)}
                  className={`cursor-pointer text-center text-[10px] leading-tight transition-colors hover:text-foreground disabled:cursor-not-allowed sm:text-xs ${
                    isCurrent
                      ? "font-semibold text-foreground"
                      : done
                        ? "font-medium text-[oklch(0.50_0.11_195)]"
                        : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
