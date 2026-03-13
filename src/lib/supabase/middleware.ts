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

  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (user && pathname.startsWith("/auth/")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
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
