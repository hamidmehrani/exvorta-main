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

/**
 * Report a non-fatal warning.
 * In production, forwards to the monitoring service.
 */
export const reportWarning = (message: string, context?: ErrorContext): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('[WARNING]', message, context)
    return
  }
  // TODO: replace with monitoring service call, e.g.:
  // Sentry.captureMessage(message, { level: 'warning', extra: context })
  console.warn('[WARN]', message, context)
}

/**
 * Report a fatal or unexpected error.
 * In production, forwards to the monitoring service.
 */
export const reportError = (error: Error, context?: ErrorContext): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('[ERROR]', error.message, context, error.stack)
    return
  }
  // TODO: replace with monitoring service call, e.g.:
  // Sentry.captureException(error, { extra: context })
  console.error('[ERROR]', error.message, context)
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
