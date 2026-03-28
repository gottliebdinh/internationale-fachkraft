"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Supabase-Links nutzen manchmal nur die Site-URL (z. B. http://localhost:3000)
 * als redirect_to – dann landen Tokens im Hash auf "/". Die Session-Verarbeitung
 * liegt auf /auth/callback → hier umleiten.
 */
export function AuthRecoveryRedirect() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;
    const hash = window.location.hash;
    if (!hash || !hash.includes("access_token")) return;

    window.location.replace(
      `/auth/callback${window.location.search}${window.location.hash}`
    );
  }, [pathname]);

  return null;
}
