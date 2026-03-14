"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AuthLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isEmployerRegister = pathname?.includes("/auth/register/employer");

  if (isEmployerRegister) {
    return <>{children}</>;
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center">
      <Link
        href="/"
        className="mb-8 block text-center focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.11_195)] focus:ring-offset-2 rounded-md"
      >
        <h1 className="font-[var(--font-display)] text-3xl font-semibold tracking-tight text-foreground">
          Ge<span className="text-[oklch(0.50_0.11_195)]">Vin</span>
        </h1>
      </Link>
      {children}
    </div>
  );
}
