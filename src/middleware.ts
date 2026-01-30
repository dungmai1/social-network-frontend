import { NextRequest, NextResponse } from 'next/server'

const publicRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')
  const path = request.nextUrl.pathname

  const isPublicRoute = publicRoutes.includes(path)
  const isAuthenticated = !!token

  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL('/login', request.nextUrl)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
