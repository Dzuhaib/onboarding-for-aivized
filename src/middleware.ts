import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE = "aivized_admin_token";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  const isLogin = pathname === "/admin/login";

  if (pathname.startsWith("/admin") && !isLogin && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (isLogin && token) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
