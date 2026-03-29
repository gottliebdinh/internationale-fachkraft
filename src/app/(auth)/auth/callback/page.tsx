"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/** Supabase-Kette kann `next` mehrfach encodieren (%252F → %2F → /). */
function normalizeNextPath(raw: string | null): string | null {
  if (!raw) return null;
  let s = raw.trim();
  for (let i = 0; i < 4; i++) {
    if (s.startsWith("/") && !s.includes("%")) break;
    try {
      const d = decodeURIComponent(s);
      if (d === s) break;
      s = d;
    } catch {
      break;
    }
  }
  if (!s.startsWith("/")) s = `/${s}`;
  return s;
}

/**
 * Handles both PKCE (`?code=`) and implicit-flow (`#access_token=`) redirects
 * from Supabase invite / recovery links.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  /** Verhindert doppeltes exchangeCodeForSession mit demselben Code in einem Mount-Zyklus. */
  const pkceStarted = useRef(false);

  useEffect(() => {
    const supabase = createClient();

    function resolveDest(hash: string): string {
      const nextRaw = searchParams.get("next");
      const nextPath = normalizeNextPath(nextRaw);
      if (nextPath) {
        return nextPath;
      }
      if (searchParams.get("type") === "recovery") {
        return "/auth/reset-password";
      }
      const hp = new URLSearchParams(hash.replace(/^#/, ""));
      if (hp.get("type") === "recovery") {
        return "/auth/reset-password";
      }
      return "/dashboard/employer";
    }

    const initialHash = typeof window !== "undefined" ? window.location.hash : "";
    let dest = resolveDest(initialHash);

    async function handlePKCE(code: string) {
      const { data: existing } = await supabase.auth.getSession();
      if (existing.session) {
        const h = typeof window !== "undefined" ? window.location.hash : "";
        dest = resolveDest(h);
        router.replace(dest);
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        const { data: afterFail } = await supabase.auth.getSession();
        if (afterFail.session) {
          const h = typeof window !== "undefined" ? window.location.hash : "";
          dest = resolveDest(h);
          router.replace(dest);
          return;
        }
        router.replace(
          `/auth/login?error=auth_callback&reason=${encodeURIComponent(error.message)}`
        );
        return;
      }
      const h = typeof window !== "undefined" ? window.location.hash : "";
      dest = resolveDest(h);
      router.replace(dest);
    }

    async function handleHashOrSession() {
      const hash = window.location.hash;
      dest = resolveDest(hash);
      if (hash && hash.includes("access_token")) {
        const params = new URLSearchParams(hash.replace("#", ""));
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (!error) {
            window.location.hash = "";
            router.replace(dest);
            return;
          }
        }
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.replace(dest);
        return;
      }

      router.replace("/auth/login?error=auth_callback");
    }

    const code = searchParams.get("code");
    if (code) {
      if (pkceStarted.current) return;
      pkceStarted.current = true;
      void handlePKCE(code);
    } else {
      void handleHashOrSession();
    }
  }, [router, searchParams]);

  return (
    <div className="flex h-full min-h-[40vh] w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}
