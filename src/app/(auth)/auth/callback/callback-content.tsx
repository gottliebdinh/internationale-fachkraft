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
export function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pkceStarted = useRef(false);

  useEffect(() => {
    // #region agent log
    const _dl=(loc:string,msg:string,data?:any)=>{console.warn(`[CB] ${loc}: ${msg}`,data);fetch('http://127.0.0.1:7248/ingest/9ef2793e-10d9-4ab2-a180-4e3f7610c727',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:loc,message:msg,data,timestamp:Date.now()})}).catch(()=>{});};
    // #endregion
    // #region agent log
    _dl('cb:start','useEffect',{path:window.location.pathname,search:window.location.search,hashLen:window.location.hash.length,hasHash:window.location.hash.includes('access_token'),hasCode:new URLSearchParams(window.location.search).has('code')});
    // #endregion
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
      // #region agent log
      _dl('cb:pkce','start',{codePrefix:code.slice(0,12)});
      // #endregion
      const { data: existing } = await supabase.auth.getSession();
      // #region agent log
      _dl('cb:pkce','existSession',{hasSession:!!existing.session});
      // #endregion
      if (existing.session) {
        const h = typeof window !== "undefined" ? window.location.hash : "";
        dest = resolveDest(h);
        router.replace(dest);
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      // #region agent log
      _dl('cb:pkce','exchange',{ok:!error,err:error?.message?.slice(0,120)});
      // #endregion
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
      // #region agent log
      _dl('cb:hash','start',{hashLen:hash.length,hasAT:hash.includes('access_token'),dest});
      // #endregion
      if (hash && hash.includes("access_token")) {
        const params = new URLSearchParams(hash.replace("#", ""));
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          // #region agent log
          _dl('cb:hash','setSession',{ok:!error,err:error?.message?.slice(0,120),dest});
          // #endregion
          if (!error) {
            window.location.hash = "";
            // #region agent log
            _dl('cb:hash','REDIRECT',{dest});
            // #endregion
            router.replace(dest);
            return;
          }
        }
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      // #region agent log
      _dl('cb:hash','session',{hasSession:!!session,dest});
      // #endregion
      if (session) {
        router.replace(dest);
        return;
      }

      // #region agent log
      _dl('cb:hash','NO_SESSION->login',{});
      // #endregion
      router.replace("/auth/login?error=auth_callback");
    }

    const code = searchParams.get("code");
    // #region agent log
    _dl('cb:decision','route',{hasCode:!!code,codePrefix:code?.slice(0,12),nextRaw:searchParams.get("next"),dest,hashLen:initialHash.length,pkceStarted:pkceStarted.current});
    // #endregion

    async function run() {
      if (code) {
        if (pkceStarted.current) return;
        pkceStarted.current = true;
        await handlePKCE(code);
      } else {
        await handleHashOrSession();
      }
    }
    run().catch((err) => {
      // #region agent log
      _dl('cb:FATAL','uncaught',{msg:String(err),stack:String(err?.stack).slice(0,300)});
      // #endregion
      router.replace("/auth/login?error=auth_callback");
    });
  }, [router, searchParams]);

  return (
    <div className="flex h-full min-h-[40vh] w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}
