"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/**
 * Handles both PKCE (`?code=`) and implicit-flow (`#access_token=`) redirects
 * from Supabase invite / recovery links.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const next = searchParams.get("next") ?? "/dashboard/employer";
    const dest = next.startsWith("/") ? next : `/${next}`;

    const supabase = createClient();

    async function handlePKCE(code: string) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        router.replace(`/auth/login?error=auth_callback&reason=${encodeURIComponent(error.message)}`);
        return;
      }
      router.replace(dest);
    }

    async function handleHashOrSession() {
      const hash = window.location.hash;
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

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace(dest);
        return;
      }

      router.replace("/auth/login?error=auth_callback");
    }

    const code = searchParams.get("code");
    if (code) {
      handlePKCE(code);
    } else {
      handleHashOrSession();
    }
  }, [router, searchParams]);

  return (
    <div className="flex h-full min-h-[40vh] w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}
