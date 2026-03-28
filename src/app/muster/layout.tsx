import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function MusterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh max-h-dvh min-h-0 flex-col overflow-hidden bg-background">
      <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4">
        <Link
          href="/"
          className="font-[var(--font-display)] text-xl font-semibold tracking-tight text-foreground"
        >
          Ge<span className="text-[oklch(0.50_0.11_195)]">Vin</span>
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs font-normal">
            Muster
          </Badge>
          <Link
            href="/"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Zur Startseite
          </Link>
        </div>
      </header>
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-3 sm:px-4 sm:py-4">
        {children}
      </main>
    </div>
  );
}
