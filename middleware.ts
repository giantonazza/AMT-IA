import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isRegisterPage = req.nextUrl.pathname === '/auth/register'

    if (isAuthPage) {
      if (isAuth && !isRegisterPage) {
        return NextResponse.redirect(new URL('/', req.url))
      }
      return null
    }

    if (!isAuth && req.nextUrl.pathname !== '/') {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }

      return NextResponse.redirect(
        new URL(`/auth/signin?from=${encodeURIComponent(from)}`, req.url)
      )
    }

    return null
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname === '/' || req.nextUrl.pathname === '/auth/register') return true
        return !!token
      }
    },
  }
)

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    '/profile'
  ],
}

