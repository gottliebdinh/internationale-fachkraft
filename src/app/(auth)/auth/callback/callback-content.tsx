"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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

export function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pkceStarted = useRef(false);
  // #region agent log — visible debug state
  const [dbg, setDbg] = useState<string[]>(["mount"]);
  const log = (msg: string) => {
    setDbg((p) => [...p, msg]);
    console.warn("[CB]", msg);
  };
  // #endregion

  useEffect(() => {
    const supabase = createClient();

    const hash = window.location.hash;
    const search = window.location.search;
    const code = new URLSearchParams(search).get("code");
    const hasAccessToken = hash.includes("access_token");
    const nextRaw = searchParams.get("next");

    log(`url: hash=${hash.length}ch code=${!!code} AT=${hasAccessToken} next=${nextRaw}`);

    function resolveDest(h: string): string {
      const nextPath = normalizeNextPath(nextRaw);
      if (nextPath) return nextPath;
      if (searchParams.get("type") === "recovery") return "/auth/reset-password";
      const hp = new URLSearchParams(h.replace(/^#/, ""));
      if (hp.get("type") === "recovery") return "/auth/reset-password";
      return "/dashboard/employer";
    }

    let dest = resolveDest(hash);
    log(`dest=${dest}`);

    async function handlePKCE(c: string) {
      log("pkce:start");
      const { data: existing } = await supabase.auth.getSession();
      log(`pkce:existSession=${!!existing.session}`);
      if (existing.session) {
        dest = resolveDest(window.location.hash);
        log(`pkce:redirect-existing → ${dest}`);
        router.replace(dest);
        return;
      }
      const { error } = await supabase.auth.exchangeCodeForSession(c);
      log(`pkce:exchange ok=${!error} err=${error?.message?.slice(0, 80)}`);
      if (error) {
        const { data: afterFail } = await supabase.auth.getSession();
        if (afterFail.session) {
          dest = resolveDest(window.location.hash);
          log(`pkce:fallback-session → ${dest}`);
          router.replace(dest);
          return;
        }
        log("pkce:FAIL → login");
        router.replace(`/auth/login?error=auth_callback&reason=${encodeURIComponent(error.message)}`);
        return;
      }
      dest = resolveDest(window.location.hash);
      log(`pkce:ok → ${dest}`);
      router.replace(dest);
    }

    async function handleHashOrSession() {
      log(`hash:start hasAT=${hasAccessToken}`);
      if (hash && hasAccessToken) {
        const params = new URLSearchParams(hash.replace("#", ""));
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
          log("hash:setSession...");
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          log(`hash:setSession ok=${!error} err=${error?.message?.slice(0, 80)}`);
          if (!error) {
            window.location.hash = "";
            log(`hash:REDIRECT → ${dest}`);
            router.replace(dest);
            return;
          }
        }
      }

      log("hash:getSession...");
      const { data: { session } } = await supabase.auth.getSession();
      log(`hash:session=${!!session}`);
      if (session) {
        log(`hash:redirect → ${dest}`);
        router.replace(dest);
        return;
      }

      log("hash:NO_SESSION → login");
      router.replace("/auth/login?error=auth_callback");
    }

    const codeParam = searchParams.get("code");
    log(`decision: code=${!!codeParam} pkceStarted=${pkceStarted.current}`);

    async function run() {
      if (codeParam) {
        if (pkceStarted.current) return;
        pkceStarted.current = true;
        await handlePKCE(codeParam);
      } else {
        await handleHashOrSession();
      }
    }
    run().catch((err) => {
      log(`FATAL: ${String(err)}`);
      router.replace("/auth/login?error=auth_callback");
    });
  }, [router, searchParams]);

  return (
    <div className="flex h-full min-h-[40vh] w-full flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      {/* #region agent log — visible debug overlay */}
      <pre className="mt-4 max-w-md overflow-auto rounded bg-gray-100 p-3 text-[10px] text-gray-600 leading-tight">
        {dbg.join("\n")}
      </pre>
      {/* #endregion */}
    </div>
  );
}
