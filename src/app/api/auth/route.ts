import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

/**
 * POST /api/auth
 * Verifies Telegram login widget data and sets a session cookie.
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { hash, ...userData } = data

    if (!hash || !process.env.BOT_TOKEN) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    // 1. Verify Telegram hash
    const secretKey = crypto.createHash('sha256').update(process.env.BOT_TOKEN).digest()
    const dataCheckString = Object.keys(userData)
      .sort()
      .map(key => `${key}=${userData[key]}`)
      .join('\n')
    
    const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex')

    if (hmac !== hash) {
      return NextResponse.json({ error: 'Invalid hash' }, { status: 401 })
    }

    // 2. Check if auth_date is fresh (last 24 hours)
    const now = Math.floor(Date.now() / 1000)
    if (now - userData.auth_date > 86400) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 })
    }

    // 3. Set session cookie
    const cookieStore = await cookies()
    cookieStore.set('askmela_user', JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })

    return NextResponse.json({ success: true, user: userData })
  } catch (err) {
    console.error('Auth error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

/**
 * GET /api/auth
 * Returns the current logged-in user.
 */
export async function GET() {
  const cookieStore = await cookies()
  const session = cookieStore.get('askmela_user')
  
  if (!session) {
    return NextResponse.json({ user: null })
  }

  try {
    const user = JSON.parse(session.value)
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ user: null })
  }
}

/**
 * DELETE /api/auth
 * Logs out the user.
 */
export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('askmela_user')
  return NextResponse.json({ success: true })
}
