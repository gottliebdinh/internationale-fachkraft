"use client";

import { usePathname } from "next/navigation";

export function AuthLayoutWrapper({
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
          ? "relative z-10 flex min-h-0 flex-1 flex-col w-full overflow-hidden pt-0 px-0 pb-12"
          : "relative z-10 w-full px-4 py-12"
      }
    >
      {children}
    </div>
  );
}
