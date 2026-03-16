"use client";

import { usePathname } from "next/navigation";

export function AuthLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isEmployerRegister = pathname?.includes("/auth/register/employer");

  return (
    <div
      className={
        isEmployerRegister
          ? "relative flex h-screen max-h-screen flex-col items-center justify-start overflow-hidden bg-white"
          : "relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden bg-white"
      }
    >
      {children}
    </div>
  );
}
