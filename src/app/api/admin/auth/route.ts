import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * POST /api/admin/auth
 * Handles admin login. Sets a secure cookie on success.
 */
export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()
    const adminSecret = process.env.ADMIN_SECRET

    if (!adminSecret || password !== adminSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Set admin session cookie (expires in 2 hours as requested)
    const cookieStore = await cookies()
    cookieStore.set('askmela_admin_token', adminSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 2, // 2 hours
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/auth
 * Handles admin logout.
 */
export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('askmela_admin_token')
  return NextResponse.json({ success: true })
}
