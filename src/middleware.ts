import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const publicRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.includes(".")
  ) {
    return NextResponse.next();
  }

  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const response = await fetch(`${API_BASE_URL}/api/me`, {
      method: "GET",
      headers: {
        cookie: cookieHeader,
      },
    });

    const isAuthenticated = response.status === 200;
    console.log(isAuthenticated);
    if (isAuthenticated && isPublicRoute) {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }

    if (!isAuthenticated && !isPublicRoute) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
    
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
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
