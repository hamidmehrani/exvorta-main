import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  reportError,
  reportWarning,
  safeAsync,
  sendToSentry,
  parseSentryDsn,
} from '@/lib/error-reporting'

describe('error-reporting module', () => {
  const originalEnv = process.env
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.restoreAllMocks()
    process.env = { ...originalEnv }
    delete process.env.SENTRY_DSN
    delete process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
    delete process.env.VERCEL_GIT_COMMIT_SHA
    delete process.env.GIT_COMMIT_SHA

    fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    process.env = originalEnv
    vi.unstubAllGlobals()
  })

  describe('DSN parsing and graceful no-ops', () => {
    it('returns null for empty, non-http, or malformed DSNs', () => {
      expect(parseSentryDsn(undefined)).toBeNull()
      expect(parseSentryDsn('')).toBeNull()
      expect(parseSentryDsn('ftp://key@sentry.test/123')).toBeNull()
      expect(parseSentryDsn('invalid-url-string')).toBeNull()
      expect(parseSentryDsn('https://sentry.test.local/123')).toBeNull() // missing public key
      expect(parseSentryDsn('https://key@sentry.test.local')).toBeNull() // missing project id
      expect(parseSentryDsn('https://key@sentry.test.local/')).toBeNull() // empty project id
    })

    it('correctly parses valid DSN format', () => {
      const parsed = parseSentryDsn('https://pubkey@sentry.test.local/123')
      expect(parsed).toEqual({
        endpoint: 'https://sentry.test.local/api/123/envelope/',
        publicKey: 'pubkey',
      })
    })

    it('executes reportError and reportWarning without throwing when SENTRY_DSN is unset', () => {
      delete process.env.SENTRY_DSN
      expect(() => reportError(new Error('unhandled error test'))).not.toThrow()
      expect(() => reportWarning('warning message test')).not.toThrow()
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('executes reportError and reportWarning without throwing when SENTRY_DSN is invalid', () => {
      process.env.SENTRY_DSN = 'invalid-dsn-value'
      expect(() => reportError(new Error('unhandled error test with bad dsn'))).not.toThrow()
      expect(() => reportWarning('warning test with bad dsn')).not.toThrow()
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('sendToSentry no-ops without throwing when SENTRY_DSN is unset or invalid', async () => {
      delete process.env.SENTRY_DSN
      await expect(sendToSentry('error', 'msg')).resolves.toBeUndefined()
      expect(fetchMock).not.toHaveBeenCalled()

      process.env.SENTRY_DSN = 'not-valid'
      await expect(sendToSentry('warning', 'msg')).resolves.toBeUndefined()
      expect(fetchMock).not.toHaveBeenCalled()
    })
  })

  describe('safeAsync wrapper', () => {
    it('returns the function result on successful resolution', async () => {
      const res = await safeAsync(async () => 'computation result')
      expect(res).toBe('computation result')
    })

    it('returns null and catches thrown error when wrapped function fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const res = await safeAsync(
        async () => {
          throw new Error('async task failed')
        },
        { operation: 'sync-data', itemId: 42 }
      )

      expect(res).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith(
        '[ERROR]',
        'async task failed',
        { operation: 'sync-data', itemId: 42 },
        expect.any(String)
      )
    })
  })

  describe('Sentry envelope dispatch and release tagging', () => {
    it('dispatches expected envelope HTTP request with headers, release, and exception payload', async () => {
      process.env.SENTRY_DSN = 'https://pubkey@sentry.test.local/123'
      process.env.GIT_COMMIT_SHA = 'commit-sha-789'

      const testError = new Error('Database connection failed')
      testError.name = 'DatabaseError'

      await sendToSentry('error', 'Database connection failed', testError, {
        table: 'leads',
        retries: 3,
      })

      expect(fetchMock).toHaveBeenCalledTimes(1)
      const [endpoint, options] = fetchMock.mock.calls[0]

      expect(endpoint).toBe('https://sentry.test.local/api/123/envelope/')
      expect(options.method).toBe('POST')
      expect(options.headers).toEqual({
        'Content-Type': 'application/x-sentry-envelope',
        'X-Sentry-Auth': 'Sentry sentry_version=7, sentry_client=exvorta-reporter/1.0, sentry_key=pubkey',
      })

      const rawBody = options.body as string
      const lines = rawBody.trim().split('\n')
      expect(lines).toHaveLength(3)

      const header = JSON.parse(lines[0])
      const itemHeader = JSON.parse(lines[1])
      const payload = JSON.parse(lines[2])

      // Envelope header
      expect(header.dsn).toBe('https://pubkey@sentry.test.local/123')
      expect(header.event_id).toBeDefined()
      expect(typeof header.sent_at).toBe('string')

      // Item header
      expect(itemHeader).toEqual({
        type: 'event',
        content_type: 'application/json',
      })

      // Event payload
      expect(payload.event_id).toBe(header.event_id)
      expect(payload.platform).toBe('javascript')
      expect(payload.level).toBe('error')
      expect(payload.message).toBe('Database connection failed')
      expect(payload.release).toBe('commit-sha-789')
      expect(payload.exception).toEqual({
        values: [
          {
            type: 'DatabaseError',
            value: 'Database connection failed',
            stacktrace: expect.any(Object),
          },
        ],
      })
      expect(payload.extra).toEqual({
        table: 'leads',
        retries: 3,
      })
    })

    it('resolves release tagging with correct precedence order', async () => {
      process.env.SENTRY_DSN = 'https://pubkey@sentry.test.local/123'

      // Precedence 1: NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
      process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA = 'sha-next-public'
      process.env.VERCEL_GIT_COMMIT_SHA = 'sha-vercel'
      process.env.GIT_COMMIT_SHA = 'sha-git'

      await sendToSentry('warning', 'Release precedence test 1')
      let payload = JSON.parse((fetchMock.mock.calls[0][1].body as string).trim().split('\n')[2])
      expect(payload.release).toBe('sha-next-public')

      // Precedence 2: VERCEL_GIT_COMMIT_SHA
      delete process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
      await sendToSentry('warning', 'Release precedence test 2')
      payload = JSON.parse((fetchMock.mock.calls[1][1].body as string).trim().split('\n')[2])
      expect(payload.release).toBe('sha-vercel')

      // Precedence 3: GIT_COMMIT_SHA
      delete process.env.VERCEL_GIT_COMMIT_SHA
      await sendToSentry('warning', 'Release precedence test 3')
      payload = JSON.parse((fetchMock.mock.calls[2][1].body as string).trim().split('\n')[2])
      expect(payload.release).toBe('sha-git')

      // Fallback: undefined when none set
      delete process.env.GIT_COMMIT_SHA
      await sendToSentry('warning', 'Release precedence test 4')
      payload = JSON.parse((fetchMock.mock.calls[3][1].body as string).trim().split('\n')[2])
      expect(payload.release).toBeUndefined()
    })

    it('handles network failure non-blockingly without throwing', async () => {
      process.env.SENTRY_DSN = 'https://pubkey@sentry.test.local/123'
      fetchMock.mockRejectedValueOnce(new Error('Network offline'))

      await expect(
        sendToSentry('error', 'Network failure test', new Error('Something failed'))
      ).resolves.toBeUndefined()
    })
  })
})
