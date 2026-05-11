import { Context, MiddlewareFn } from 'telegraf'

// Rate limits
const OWNER_LIMIT_PER_DAY = 50      // KB updates per owner per day
const CUSTOMER_LIMIT_PER_MIN = 10   // Messages per customer per minute

// In-memory counters (use Redis for production)
const customerCounts = new Map<number, { count: number; resetAt: number }>()
const ownerDailyCounts = new Map<number, { count: number; resetAt: number }>()

export const rateLimitMiddleware: MiddlewareFn<Context> = async (ctx, next) => {
  const userId = ctx.from?.id
  if (!userId) return next()

  const now = Date.now()

  // 1. Check if user is an owner (to apply owner limit)
  // Note: For efficiency, we assume any text message from owner is a KB update
  const { getBusinessByOwnerId } = await import('../services/supabase')
  const business = await getBusinessByOwnerId(userId)
  const isOwner = !!business

  if (isOwner) {
    // Owner Daily Limit: 50 updates per day
    const existing = ownerDailyCounts.get(userId)
    const dayInMs = 24 * 60 * 60 * 1000
    
    if (existing) {
      if (now < existing.resetAt) {
        if (existing.count >= OWNER_LIMIT_PER_DAY) {
          await ctx.reply(
            '⚠️ የዛሬው የመረጃ መጠን አልቋል / Daily update limit reached (50/day). Please try tomorrow.'
          )
          return
        }
        existing.count++
      } else {
        ownerDailyCounts.set(userId, { count: 1, resetAt: now + dayInMs })
      }
    } else {
      ownerDailyCounts.set(userId, { count: 1, resetAt: now + dayInMs })
    }
  } else {
    // 2. Customer: 10 msg/min
    const existing = customerCounts.get(userId)
    if (existing) {
      if (now < existing.resetAt) {
        if (existing.count >= CUSTOMER_LIMIT_PER_MIN) {
          await ctx.reply(
            '⏳ ብዙ ጥያቄዎች / Too many messages. Please wait a minute and try again.'
          )
          return
        }
        existing.count++
      } else {
        customerCounts.set(userId, { count: 1, resetAt: now + 60_000 })
      }
    } else {
      customerCounts.set(userId, { count: 1, resetAt: now + 60_000 })
    }
  }

  return next()
}
