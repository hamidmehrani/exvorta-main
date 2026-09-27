import { pgTable, text, integer, timestamp } from '@payloadcms/db-vercel-postgres/drizzle/pg-core'
import { eq, sql } from '@payloadcms/db-vercel-postgres/drizzle'
import type { Payload } from 'payload'
import { reportWarning, reportError } from '@/lib/error-reporting'

export const RATE_LIMIT_WINDOW_MINUTES = 30
export const RATE_LIMIT_MAX_ATTEMPTS = 20

/**
 * Idiomatic Drizzle table definition for sliding-window rate limits.
 */
export const rateLimits = pgTable('rate_limits', {
  identifier: text('identifier').primaryKey(),
  attemptCount: integer('attempt_count').notNull().default(1),
  windowStart: timestamp('window_start').notNull().defaultNow(),
})

export type RateLimitResult = {
  allowed: boolean
  remaining: number
}

/**
 * Sliding-window rate limiter using Drizzle ORM parameterized queries.
 */
export async function checkRateLimit(
  payload: Payload,
  identifier: string,
): Promise<RateLimitResult> {
  const db = payload.db as unknown as {
    drizzle: {
      select: (fields?: unknown) => any
      insert: (table: unknown) => any
      update: (table: unknown) => any
      delete: (table: unknown) => any
      execute: (query: unknown) => Promise<any>
    }
  }

  const ensureTable = async () => {
    await db.drizzle.execute(sql`
      CREATE TABLE IF NOT EXISTS "rate_limits" (
        "identifier" TEXT PRIMARY KEY,
        "attempt_count" INTEGER NOT NULL DEFAULT 1,
        "window_start" TIMESTAMP NOT NULL DEFAULT now()
      )
    `)
  }

  try {
    await ensureTable()

    // 1. Purge entries outside the active sliding window
    await db.drizzle
      .delete(rateLimits)
      .where(sql`${rateLimits.windowStart} < now() - (${RATE_LIMIT_WINDOW_MINUTES} || ' minutes')::interval`)

    // 2. Query attempts for the identifier
    const existing = await db.drizzle
      .select({ attemptCount: rateLimits.attemptCount })
      .from(rateLimits)
      .where(eq(rateLimits.identifier, identifier))

    if (existing && existing.length > 0) {
      const attempts = Number(existing[0].attemptCount)
      if (attempts >= RATE_LIMIT_MAX_ATTEMPTS) {
        return { allowed: false, remaining: 0 }
      }
      await db.drizzle
        .update(rateLimits)
        .set({ attemptCount: sql`${rateLimits.attemptCount} + 1` })
        .where(eq(rateLimits.identifier, identifier))

      return { allowed: true, remaining: RATE_LIMIT_MAX_ATTEMPTS - attempts - 1 }
    }

    // 3. Register initial attempt for new window
    await db.drizzle.insert(rateLimits).values({
      identifier,
      attemptCount: 1,
      windowStart: sql`now()`,
    })

    return { allowed: true, remaining: RATE_LIMIT_MAX_ATTEMPTS - 1 }
  } catch (err) {
    // Fail-open for graceful degradation if DB connection is interrupted
    reportWarning('[rate-limit] check failed, failing open for availability', { error: String(err) })
    return { allowed: true, remaining: RATE_LIMIT_MAX_ATTEMPTS }
  }
}

const isPlaceholder = (val: string | undefined): boolean => {
  if (!val) return true
  const lower = val.toLowerCase().trim()
  const isVercelProd = process.env.VERCEL_ENV === 'production'
  return (
    lower.includes('your_') ||
    lower.includes('your-') ||
    lower.includes('secret-here') ||
    lower.includes('placeholder') ||
    (isVercelProd && lower === '1x0000000000000000000000000000000aa')
  )
}

export async function verifyTurnstile(token: string | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  const isProd = process.env.NODE_ENV === 'production'

  if (!secret || isPlaceholder(secret)) {
    if (isProd) {
      throw new Error(
        '[Security Exception] TURNSTILE_SECRET_KEY is required in production but missing or set to a placeholder.',
      )
    }
    reportWarning(
      '[turnstile] TURNSTILE_SECRET_KEY is missing or using placeholder in development. Verification bypassed.',
    )
    return true
  }

  if (!token) return false

  try {
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    const verifyData = (await verifyRes.json()) as { success?: boolean }
    return Boolean(verifyData.success)
  } catch (err) {
    reportError(err instanceof Error ? err : new Error(String(err)), { context: 'verifyTurnstile' })
    return false
  }
}
