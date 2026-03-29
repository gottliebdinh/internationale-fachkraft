"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const INTERVAL_MS = 8000;

/** Ruft router.refresh() auf, damit Login-Badges in der Liste ohne manuellen Reload aktuell bleiben. */
export function EmployersListAutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [router]);

  return null;
}
