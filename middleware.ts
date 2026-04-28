import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Edge middleware for admin auth (Webflow Cloud and other hosts that do not
 * support Next.js 16+ Node "proxy" runtime).
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const normalizePath = (path: string) =>
    path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
  const pathname = normalizePath(request.nextUrl.pathname);
  const adminBase = pathname.startsWith("/pages/admin")
    ? "/pages/admin"
    : pathname.startsWith("/admin")
      ? "/admin"
      : null;

  // Safety guard: only run auth redirects on known admin paths.
  if (!adminBase) {
    return supabaseResponse;
  }

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
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh session — do not run any logic between createServerClient and getUser
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const loginPath = `${adminBase}/login`;
  const isLoginPage = pathname === loginPath;

  if (!isLoginPage && !user) {
    const url = request.nextUrl.clone();
    url.pathname = loginPath;
    const redirectPath = normalizePath(url.pathname);
    if (redirectPath !== pathname) {
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  if (isLoginPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = adminBase;
    const redirectPath = normalizePath(url.pathname);
    if (redirectPath !== pathname) {
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*", "/pages/admin/:path*"],
};
