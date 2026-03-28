"use client";

import { Button } from "@/components/ui/button";
import { todayIsoDate } from "@/lib/format-job-start";

/** Wie native Inputs im Admin-Stellenformular (employer-job-positions-panel). */
const CONTROL =
  "h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

type Props = {
  /** Eindeutig pro Formular (z. B. admin-jp-add), für Label-/Input-ids */
  idPrefix: string;
  chooseSpecificStartDate: boolean;
  setChooseSpecificStartDate: (v: boolean) => void;
  startDateValue: string;
  setStartDateValue: (v: string) => void;
};

/**
 * Gleiche Interaktion wie Registrierung (Ab sofort / Ändern / Datum), optisch abgestimmt
 * auf die übrigen Admin-Felder (h-9, text-xs-Label).
 */
export function EmployerJobStartField({
  idPrefix,
  chooseSpecificStartDate,
  setChooseSpecificStartDate,
  startDateValue,
  setStartDateValue,
}: Props) {
  const inputId = `${idPrefix}-startDate`;

  return (
    <div className="space-y-1">
      <span
        id={`${idPrefix}-start-q`}
        className="text-xs text-muted-foreground"
      >
        Ab wann wird die Stelle benötigt?
      </span>
      {!chooseSpecificStartDate ? (
        <div
          className={`flex items-center justify-between gap-2 ${CONTROL}`}
          role="group"
          aria-labelledby={`${idPrefix}-start-q`}
        >
          <span className="truncate">Ab sofort</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 shrink-0 px-2 text-xs text-[oklch(0.38_0.12_255)] hover:text-[oklch(0.30_0.11_255)]"
            onClick={() => {
              setChooseSpecificStartDate(true);
              if (!startDateValue) {
                setStartDateValue(todayIsoDate());
              }
            }}
          >
            Ändern
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            id={inputId}
            type="date"
            className={`${CONTROL} sm:min-w-0 sm:flex-1`}
            value={startDateValue}
            onChange={(e) => setStartDateValue(e.target.value)}
            autoFocus
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 shrink-0 px-3 text-sm sm:self-auto"
            onClick={() => {
              setStartDateValue("");
              setChooseSpecificStartDate(false);
            }}
          >
            Ab sofort
          </Button>
        </div>
      )}
    </div>
  );
}
