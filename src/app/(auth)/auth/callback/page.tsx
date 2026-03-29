"use client";

import { useEffect, useState } from "react";
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

export default function AuthCallbackPage() {
  // #region agent log — visible debug state
  const [dbg, setDbg] = useState<string[]>(["mount"]);
  const addLog = (msg: string) => {
    setDbg((p) => [...p, msg]);
    console.warn("[CB]", msg);
  };
  // #endregion

  useEffect(() => {
    const supabase = createClient();

    const search = window.location.search;
    const hash = window.location.hash;
    const sp = new URLSearchParams(search);
    const code = sp.get("code");
    const nextRaw = sp.get("next");
    const hasAccessToken = hash.includes("access_token");

    addLog(`params: hash=${hash.length}ch code=${!!code} AT=${hasAccessToken} next=${nextRaw}`);

    function resolveDest(): string {
      const nextPath = normalizeNextPath(nextRaw);
      if (nextPath) return nextPath;
      if (sp.get("type") === "recovery") return "/auth/reset-password";
      const hp = new URLSearchParams(hash.replace(/^#/, ""));
      if (hp.get("type") === "recovery") return "/auth/reset-password";
      return "/dashboard/employer";
    }

    const dest = resolveDest();
    addLog(`dest=${dest}`);

    async function handlePKCE(c: string) {
      addLog("pkce:start");
      try {
        const { data: existing } = await supabase.auth.getSession();
        addLog(`pkce:session=${!!existing.session}`);
        if (existing.session) {
          addLog(`pkce→${dest}`);
          window.location.replace(dest);
          return;
        }
        const { error } = await supabase.auth.exchangeCodeForSession(c);
        addLog(`pkce:exchange ok=${!error} err=${error?.message?.slice(0, 80)}`);
        if (error) {
          const { data: retry } = await supabase.auth.getSession();
          if (retry.session) {
            addLog(`pkce:retry→${dest}`);
            window.location.replace(dest);
            return;
          }
          addLog("pkce:FAIL→login");
          window.location.replace(`/auth/login?error=auth_callback&reason=${encodeURIComponent(error.message)}`);
          return;
        }
        addLog(`pkce:ok→${dest}`);
        window.location.replace(dest);
      } catch (e) {
        addLog(`pkce:ERR ${String(e)}`);
        window.location.replace("/auth/login?error=auth_callback");
      }
    }

    async function handleHashOrSession() {
      addLog(`hash:start AT=${hasAccessToken}`);
      if (hash && hasAccessToken) {
        const params = new URLSearchParams(hash.replace("#", ""));
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
          addLog("hash:setSession...");
          try {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            addLog(`hash:setSession ok=${!error} err=${error?.message?.slice(0, 80)}`);
            if (!error) {
              addLog(`hash→${dest}`);
              window.location.replace(dest);
              return;
            }
          } catch (e) {
            addLog(`hash:setSession ERR ${String(e)}`);
          }
        }
      }

      addLog("hash:getSession...");
      try {
        const { data: { session } } = await supabase.auth.getSession();
        addLog(`hash:session=${!!session}`);
        if (session) {
          addLog(`hash→${dest}`);
          window.location.replace(dest);
          return;
        }
      } catch (e) {
        addLog(`hash:getSession ERR ${String(e)}`);
      }

      addLog("NO_SESSION→login");
      window.location.replace("/auth/login?error=auth_callback");
    }

    addLog(`route: code=${!!code}`);

    if (code) {
      void handlePKCE(code);
    } else {
      void handleHashOrSession();
    }
  }, []);

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
