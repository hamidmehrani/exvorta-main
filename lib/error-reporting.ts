/**
 * Error Reporting & Monitoring Utility
 * --------------------------------------
 * Centralised error reporting abstraction. Currently logs to console in
 * production; swap the body of `reportError` for Sentry, LogRocket, or
 * LogSnag without touching any callsite.
 *
 * Usage:
 *   import { reportError, reportWarning } from '@/lib/error-reporting'
 *   reportError(new Error('DB timeout'), { route: '/api/rfq', userId: id })
 */

type ErrorContext = Record<string, unknown>

interface SentryConfig {
  endpoint: string
  publicKey: string
}

function parseSentryDsn(dsn?: string): SentryConfig | null {
  if (!dsn || !dsn.startsWith('http')) return null
  try {
    const url = new URL(dsn)
    const publicKey = url.username
    const projectId = url.pathname.replace(/^\//, '')
    if (!publicKey || !projectId) return null
    return {
      endpoint: `${url.protocol}//${url.host}/api/${projectId}/envelope/`,
      publicKey,
    }
  } catch {
    return null
  }
}

async function sendToSentry(level: 'error' | 'warning', message: string, error?: Error, extra?: ErrorContext): Promise<void> {
  const dsn = process.env.SENTRY_DSN
  const config = parseSentryDsn(dsn)
  if (!config) return

  try {
    const eventId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const header = JSON.stringify({
      event_id: eventId,
      sent_at: new Date().toISOString(),
      dsn,
    })
    const itemHeader = JSON.stringify({
      type: 'event',
      content_type: 'application/json',
    })
    const payload = JSON.stringify({
      event_id: eventId,
      timestamp: Date.now() / 1000,
      platform: 'javascript',
      level,
      message,
      exception: error
        ? {
            values: [
              {
                type: error.name || 'Error',
                value: error.message,
                stacktrace: error.stack ? { frames: [] } : undefined,
              },
            ],
          }
        : undefined,
      extra: extra || {},
      environment: process.env.NODE_ENV || 'production',
    })

    const body = `${header}\n${itemHeader}\n${payload}\n`

    await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-sentry-envelope',
        'X-Sentry-Auth': `Sentry sentry_version=7, sentry_client=exvorta-reporter/1.0, sentry_key=${config.publicKey}`,
      },
      body,
    })
  } catch {
    // Non-blocking: never crash the app if monitoring dispatch fails
  }
}

/**
 * Report a non-fatal warning.
 * In production, forwards to Sentry if configured.
 */
export const reportWarning = (message: string, context?: ErrorContext): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('[WARNING]', message, context)
    return
  }
  console.warn('[WARN]', message, context)
  sendToSentry('warning', message, undefined, context).catch(() => {})
}

/**
 * Report a fatal or unexpected error.
 * In production, forwards to Sentry if configured.
 */
export const reportError = (error: Error, context?: ErrorContext): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('[ERROR]', error.message, context, error.stack)
    return
  }
  console.error('[ERROR]', error.message, context)
  sendToSentry('error', error.message, error, context).catch(() => {})
}

/**
 * Wrap an async function and auto-report any errors it throws.
 * Returns null on failure instead of propagating.
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  context?: ErrorContext
): Promise<T | null> {
  try {
    return await fn()
  } catch (err) {
    reportError(err instanceof Error ? err : new Error(String(err)), context)
    return null
  }
}
