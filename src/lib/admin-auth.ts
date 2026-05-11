import { cookies } from 'next/headers'
import { sign, verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.ADMIN_SECRET || 'fallback-secret-change-me'

export async function createAdminSession(telegramId: string) {
  const token = sign({ telegramId, role: 'admin' }, JWT_SECRET, { expiresIn: '4h' })
  const cookieStore = await cookies()
  
  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 4 * 60 * 60, // 4 hours
    path: '/'
  })
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value
  if (!token) return null

  try {
    const payload = verify(token, JWT_SECRET) as { telegramId: string; role: string }
    if (payload.role !== 'admin') return null
    return payload
  } catch (err) {
    return null
  }
}

export async function deleteAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
}

export function isAdminAuthorized(telegramId: string, secret: string) {
  return (
    secret === process.env.ADMIN_SECRET &&
    telegramId === process.env.ADMIN_TELEGRAM_ID
  )
}
