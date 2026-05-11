import { NextResponse } from 'next/server'
import { createAdminSession, isAdminAuthorized } from '@/lib/admin-auth'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')
  const telegramId = searchParams.get('telegram_id')

  if (!secret || !telegramId) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
  }

  if (isAdminAuthorized(telegramId, secret)) {
    await createAdminSession(telegramId)
    return NextResponse.redirect(new URL('/control/dashboard', req.url))
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function POST(req: Request) {
  const { secret, telegramId } = await req.json()

  if (isAdminAuthorized(telegramId || 'system_admin', secret)) {
    await createAdminSession(telegramId || 'system_admin')
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function DELETE() {
  const { deleteAdminSession } = await import('@/lib/admin-auth')
  deleteAdminSession()
  return NextResponse.json({ success: true })
}
