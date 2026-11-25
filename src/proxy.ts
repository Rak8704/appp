
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // Login page আলাদা থাকবে
  if (pathname === "/admin/login") {
    if (token) {
      const session = await verifyAuthToken(token);

      if (session && ADMIN_ROLES.includes(session.role)) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }

    return NextResponse.next();
  }

  // অন্য সব Admin Route Protect করা
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const session = await verifyAuthToken(token);

  if (!session) {
    const response = NextResponse.redirect(
      new URL("/admin/login", request.url)
    );

    response.cookies.delete(COOKIE_NAME);
    return response;
  }

  // Admin permission পরীক্ষা
  if (!ADMIN_ROLES.includes(session.role)) {
    return NextResponse.redirect(
      new URL("/unauthorized", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
