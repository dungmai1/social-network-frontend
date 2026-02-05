import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken");
  const path = request.nextUrl.pathname;

  // Skip middleware for static files and api routes
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.includes(".") // static files like .svg, .png, etc.
  ) {
    return NextResponse.next();
  }

  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));
  const isAuthenticated = !!token;

  // Redirect unauthenticated users to login (except for public routes)
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL("/login", request.nextUrl);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from public routes (login/register)
  // if (isAuthenticated && isPublicRoute) {
  //   return NextResponse.redirect(new URL('/', request.nextUrl))
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
