import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 🛡️ Admin Security Check
  if (pathname.startsWith('/control')) {
    const sessionToken = request.cookies.get('admin_session')?.value

    if (!sessionToken) {
      // Return 404 (rewrite to /not-found)
      return NextResponse.rewrite(new URL('/404', request.url))
    }
    
    // Note: We don't verify JWT in middleware because it's edge and requires jose.
    // The layout.tsx will do the full verification.
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/control/:path*']
}
