import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/auth/login", "/auth/register"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (
    PUBLIC_ROUTES.includes(request.nextUrl.pathname) ||
    request.nextUrl.pathname === "/"
  ) {
    return NextResponse.next();
  }

  // if (!token) {
  //   const urlNext = request.nextUrl.clone();
  //   urlNext.pathname = "/auth/login";
  //   return NextResponse.redirect(urlNext);
  // }

  return NextResponse.next();
}
