import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[oklch(0.98_0.008_260)]">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.75 0.1 75 / 0.2), transparent 60%)",
        }}
      />

      <div className="relative z-10 w-full px-4 py-12">
        <div className="mx-auto flex w-full max-w-lg flex-col items-center">
          <Link
            href="/"
            className="mb-6 block text-center focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.11_195)] focus:ring-offset-2 rounded-md"
          >
            <h1 className="font-[var(--font-display)] text-3xl font-semibold tracking-tight text-foreground">
              Ge<span className="text-[oklch(0.50_0.11_195)]">Vin</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Fachkräfte für Deutschland
            </p>
          </Link>
          <p className="mb-8 text-center text-xs text-muted-foreground">
            Kostenlos · Unverbindlich · DSGVO-sicher · IHK-konform
          </p>

          {children}
        </div>
      </div>
    </div>
  );
}
