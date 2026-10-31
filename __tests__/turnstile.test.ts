import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { verifyTurnstile } from '@/lib/rate-limit'

describe('verifyTurnstile unit tests', () => {
  const originalEnv = process.env

  const setEnv = (key: string, val: string | undefined) => {
    if (val === undefined) {
      delete (process.env as any)[key]
    } else {
      ;(process.env as any)[key] = val
    }
  }

  beforeEach(() => {
    vi.restoreAllMocks()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
    vi.restoreAllMocks()
  })

  describe('production verification with Cloudflare siteverify', () => {
    it('returns true when Cloudflare API responds with success: true', async () => {
      setEnv('NODE_ENV', 'production')
      setEnv('TURNSTILE_SECRET_KEY', '0x4AAAAAAAPROD_SECRET_KEY')
      setEnv('ALLOW_TEST_TURNSTILE_KEY', undefined)
      setEnv('SKIP_TURNSTILE_IN_DEV', undefined)

      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response)

      const result = await verifyTurnstile('valid-user-token', '203.0.113.195')

      expect(result).toBe(true)
      expect(fetchSpy).toHaveBeenCalledTimes(1)
      const [url, init] = fetchSpy.mock.calls[0]
      expect(url).toBe('https://challenges.cloudflare.com/turnstile/v0/siteverify')
      expect(init?.method).toBe('POST')
      const body = String(init?.body)
      expect(body).toContain('secret=0x4AAAAAAAPROD_SECRET_KEY')
      expect(body).toContain('response=valid-user-token')
      expect(body).toContain('remoteip=203.0.113.195')
    })

    it('returns false when Cloudflare API responds with success: false', async () => {
      setEnv('NODE_ENV', 'production')
      setEnv('TURNSTILE_SECRET_KEY', '0x4AAAAAAAPROD_SECRET_KEY')
      setEnv('ALLOW_TEST_TURNSTILE_KEY', undefined)
      setEnv('SKIP_TURNSTILE_IN_DEV', undefined)

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: false, 'error-codes': ['invalid-input-response'] }),
      } as Response)

      const result = await verifyTurnstile('invalid-token')

      expect(result).toBe(false)
    })

    it('returns false when token is missing or empty string', async () => {
      setEnv('NODE_ENV', 'production')
      setEnv('TURNSTILE_SECRET_KEY', '0x4AAAAAAAPROD_SECRET_KEY')

      const fetchSpy = vi.spyOn(global, 'fetch')

      expect(await verifyTurnstile(undefined)).toBe(false)
      expect(await verifyTurnstile('')).toBe(false)
      expect(await verifyTurnstile('   ')).toBe(false)
      expect(fetchSpy).not.toHaveBeenCalled()
    })

    it('returns false gracefully when network fetch throws or times out', async () => {
      setEnv('NODE_ENV', 'production')
      setEnv('TURNSTILE_SECRET_KEY', '0x4AAAAAAAPROD_SECRET_KEY')

      vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network timeout after 5000ms'))

      const result = await verifyTurnstile('valid-user-token')

      expect(result).toBe(false)
    })

    it('throws security exception in production if TURNSTILE_SECRET_KEY is missing or placeholder', async () => {
      setEnv('NODE_ENV', 'production')
      setEnv('TURNSTILE_SECRET_KEY', undefined)

      await expect(verifyTurnstile('some-token')).rejects.toThrow(
        '[Security Exception] TURNSTILE_SECRET_KEY is required in production',
      )

      setEnv('TURNSTILE_SECRET_KEY', 'your_turnstile_secret_here')
      await expect(verifyTurnstile('some-token')).rejects.toThrow(
        '[Security Exception] TURNSTILE_SECRET_KEY is required in production',
      )
    })
  })

  describe('Cloudflare test keys and test environments', () => {
    it('passes dummy token when using Cloudflare always-pass secret and test key flag enabled', async () => {
      setEnv('NODE_ENV', 'production')
      setEnv('ALLOW_TEST_TURNSTILE_KEY', 'true')
      setEnv('TURNSTILE_SECRET_KEY', '1x0000000000000000000000000000000AA')

      const result1 = await verifyTurnstile('XXXX.DUMMY.TOKEN.XXXX')
      const result2 = await verifyTurnstile('test-token')
      const result3 = await verifyTurnstile('valid-turnstile-token')

      expect(result1).toBe(true)
      expect(result2).toBe(true)
      expect(result3).toBe(true)
    })

    it('fails when using Cloudflare always-fail secret (2x000...)', async () => {
      setEnv('NODE_ENV', 'production')
      setEnv('ALLOW_TEST_TURNSTILE_KEY', 'true')
      setEnv('TURNSTILE_SECRET_KEY', '2x0000000000000000000000000000000AA')

      const result = await verifyTurnstile('XXXX.DUMMY.TOKEN.XXXX')
      expect(result).toBe(false)
    })

    it('fails with test key when token is explicit invalid-token', async () => {
      setEnv('NODE_ENV', 'production')
      setEnv('ALLOW_TEST_TURNSTILE_KEY', 'true')
      setEnv('TURNSTILE_SECRET_KEY', '1x0000000000000000000000000000000AA')

      const result = await verifyTurnstile('invalid-token')
      expect(result).toBe(false)
    })
  })

  describe('development and preview mode behavior', () => {
    it('bypasses verification when SKIP_TURNSTILE_IN_DEV is true in development', async () => {
      setEnv('NODE_ENV', 'development')
      setEnv('SKIP_TURNSTILE_IN_DEV', 'true')
      setEnv('TURNSTILE_SECRET_KEY', undefined)

      const result = await verifyTurnstile(undefined)
      expect(result).toBe(true)
    })

    it('bypasses gracefully with warning in development when TURNSTILE_SECRET_KEY is missing', async () => {
      setEnv('NODE_ENV', 'development')
      setEnv('SKIP_TURNSTILE_IN_DEV', undefined)
      setEnv('TURNSTILE_SECRET_KEY', undefined)

      const result = await verifyTurnstile('any-token')
      expect(result).toBe(true)
    })

    it('bypasses gracefully with warning in development when TURNSTILE_SECRET_KEY is a placeholder', async () => {
      setEnv('NODE_ENV', 'development')
      setEnv('SKIP_TURNSTILE_IN_DEV', undefined)
      setEnv('TURNSTILE_SECRET_KEY', 'your_placeholder_secret')

      const result = await verifyTurnstile('any-token')
      expect(result).toBe(true)
    })
  })
})
