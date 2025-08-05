import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  const redirect = (path: string) => NextResponse.redirect(new URL(path, request.url));

  const hasToken = request.cookies.has("admin-token");
  if (request.nextUrl.pathname === "/") return redirect("/admin");
  if (request.nextUrl.pathname.startsWith("/admin") && !hasToken) return redirect("/login");
  if (request.nextUrl.pathname === "/login" && hasToken) return redirect("/admin");

  const headers = new Headers(request.headers);
  headers.set("x-current-path", request.nextUrl.pathname);
  return NextResponse.next({
    headers,
  });
}
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
