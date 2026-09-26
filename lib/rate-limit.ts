import { sql } from '@payloadcms/db-vercel-postgres/drizzle'
import type { Payload } from 'payload'

export const RATE_LIMIT_WINDOW_MINUTES = 30
export const RATE_LIMIT_MAX_ATTEMPTS = 20

export type RateLimitResult = {
  allowed: boolean
  remaining: number
}

/**
 * IP-based sliding-window rate limiter backed by the "rate_limits" table.
 *
 * The table is created on demand if a migration hasn't run yet, so a missing
 * table can never 500 the contact/RFQ forms — worst case the limit is simply
 * not enforced for that request.
 */
export async function checkRateLimit(
  payload: Payload,
  identifier: string,
): Promise<RateLimitResult> {
  const db = payload.db as unknown as {
    drizzle: { execute: (query: unknown) => Promise<{ rows: Record<string, unknown>[] }> }
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

    await db.drizzle.execute(
      sql`DELETE FROM "rate_limits" WHERE "window_start" < now() - interval '15 minutes'`,
    )

    const existing = await db.drizzle.execute(
      sql`SELECT "attempt_count" FROM "rate_limits" WHERE "identifier" = ${identifier}`,
    )

    if (existing.rows?.length > 0) {
      const attempts = Number(existing.rows[0].attempt_count)
      if (attempts >= RATE_LIMIT_MAX_ATTEMPTS) {
        return { allowed: false, remaining: 0 }
      }
      await db.drizzle.execute(
        sql`UPDATE "rate_limits" SET "attempt_count" = "attempt_count" + 1 WHERE "identifier" = ${identifier}`,
      )
      return { allowed: true, remaining: RATE_LIMIT_MAX_ATTEMPTS - attempts - 1 }
    }

    await db.drizzle.execute(
      sql`INSERT INTO "rate_limits" ("identifier", "attempt_count", "window_start") VALUES (${identifier}, 1, now())`,
    )
    return { allowed: true, remaining: RATE_LIMIT_MAX_ATTEMPTS - 1 }
  } catch (err) {
    // DB unavailable / no permission to create table: fail open so real
    // users are never blocked by the anti-spam layer.
    console.error('[rate-limit] check failed, failing open:', err)
    return { allowed: true, remaining: RATE_LIMIT_MAX_ATTEMPTS }
  }
}

export async function verifyTurnstile(token: string | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    // Fail-open when Turnstile is not configured at all: a closed funnel
    // costs real leads, while honeypot + rate limiting still run. The
    // warning tells the operator to add TURNSTILE_SECRET_KEY to Vercel.
    console.warn('[turnstile] TURNSTILE_SECRET_KEY is not configured — skipping verification (set it in Vercel envs to enable bot protection)')
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
    console.error('[turnstile] verification request failed:', err)
    return false
  }
}
