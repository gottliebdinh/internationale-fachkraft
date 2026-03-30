import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // #region agent log
  if(pathname.startsWith('/auth/callback')||pathname==='/auth/employer/set-password'){const _mw={pathname,search:request.nextUrl.search,hasUser:!!user,userId:user?.id?.slice(0,8),mustSet:!!(user?.user_metadata as any)?.must_set_password};console.warn('[MW]',JSON.stringify(_mw));fetch('http://127.0.0.1:7248/ingest/9ef2793e-10d9-4ab2-a180-4e3f7610c727',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware:32',message:'auth route hit',data:_mw,timestamp:Date.now()})}).catch(()=>{});}
  // #endregion

  // Kurz-URL / falscher Supabase Site-URL → echte Login-Route (vermeidet 404 + Redirect-Schleifen)
  if (pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  const mustSetPassword =
    user?.user_metadata &&
    typeof user.user_metadata === "object" &&
    (user.user_metadata as { must_set_password?: boolean }).must_set_password ===
      true;

  // Alle „Passwort noch setzen“-Fälle: nicht zwischen Register/Dashboard/Login hin- und her redirecten.
  const isAdminLogin =
    pathname === "/admin/login" || pathname.startsWith("/admin/login/");

  if (mustSetPassword) {
    const allowed =
      pathname === "/auth/employer/set-password" ||
      pathname.startsWith("/auth/callback");
    if (
      !allowed &&
      (pathname.startsWith("/dashboard") ||
        (pathname.startsWith("/admin") && !isAdminLogin) ||
        pathname.startsWith("/auth"))
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/employer/set-password";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  // Public routes that don't need auth
  const publicRoutes = [
    "/",
    "/about",
    "/how-it-works",
    "/for-employers",
    "/for-schools",
    "/faq",
    "/contact",
    "/legal",
    "/auth",
  ];
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  const isDashboard = pathname.startsWith("/dashboard");
  const isPublicApi = pathname.startsWith("/api/register/");

  if (
    !user &&
    !isPublicRoute &&
    !isDashboard &&
    !isAdminLogin &&
    !isPublicApi
  ) {
    if (pathname.startsWith("/api/admin/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (pathname.startsWith("/admin")) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (user && isAdminLogin) {
    const { data: adminProfile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (adminProfile?.role === "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/leads";
      url.search = "";
      return NextResponse.redirect(url);
    }
    const away = request.nextUrl.clone();
    away.pathname = "/dashboard";
    away.search = "";
    return NextResponse.redirect(away);
  }

  if (user && pathname.startsWith("/admin") && !isAdminLogin) {
    const { data: adminCheck } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (adminCheck?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  if (user && pathname.startsWith("/api/admin/")) {
    const { data: apiAdmin } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (apiAdmin?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  if (user && pathname.startsWith("/auth/")) {
    const allowedAuthWithSession =
      pathname === "/auth/employer/set-password" ||
      pathname === "/auth/forgot-password" ||
      pathname === "/auth/reset-password" ||
      pathname.startsWith("/auth/callback");
    if (!allowedAuthWithSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // Altes Platzhalter-Admin unter /dashboard/admin → echtes Lotus&Eagle-Admin
  if (user && pathname.startsWith("/dashboard/admin")) {
    const { data: dashAdmin } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (dashAdmin?.role === "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/leads";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  // Role-based access control for dashboard routes
  if (user && pathname.startsWith("/dashboard/")) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile) {
      const role = profile.role;
      if (
        pathname.startsWith("/dashboard/admin") &&
        role !== "admin"
      ) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
      if (
        pathname.startsWith("/dashboard/school") &&
        role !== "school" &&
        role !== "admin"
      ) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
      if (
        pathname.startsWith("/dashboard/employer") &&
        role !== "employer" &&
        role !== "admin"
      ) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}
