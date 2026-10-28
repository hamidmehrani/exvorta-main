import { describe, it, expect } from 'vitest'
import nextConfig from '@/next.config'
import { GET, dynamic } from '@/app/.well-known/security.txt/route'
// @ts-expect-error next/dist/compiled/path-to-regexp lacks type declarations
import { match } from 'next/dist/compiled/path-to-regexp'

describe('security headers and framing policies (PLAT-07)', () => {
  it('loads next.config.ts and defines headers()', () => {
    expect(nextConfig).toBeDefined()
    expect(typeof nextConfig.headers).toBe('function')
  })

  it('preserves dynamic security.txt Route Handler', async () => {
    expect(dynamic).toBe('force-dynamic')
    const res = await GET()
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toBe('text/plain; charset=utf-8')
    const text = await res.text()
    expect(text).toContain('Contact: mailto:security@exvorta.com')
  })

  it('returns general route rule matching /(.*) with security headers', async () => {
    const rules = (await nextConfig.headers?.()) ?? []
    const generalRule = rules.find((r) => r.source === '/(.*)')
    expect(generalRule).toBeDefined()

    const headersMap = new Map(generalRule!.headers.map((h) => [h.key.toLowerCase(), h.value]))

    expect(headersMap.get('x-content-type-options')).toBe('nosniff')
    expect(headersMap.get('referrer-policy')).toBe('strict-origin-when-cross-origin')
    expect(headersMap.get('permissions-policy')).toBe(
      'camera=(), microphone=(), geolocation=(), payment=(), browsing-topics=()',
    )
    expect(headersMap.get('strict-transport-security')).toBe(
      'max-age=31536000; includeSubDomains; preload',
    )
    expect(headersMap.get('x-frame-options')).toBe('SAMEORIGIN')
    expect(headersMap.get('content-security-policy')).toContain("frame-ancestors 'self'")
  })

  it('returns embed route rule matching /rfq/embed with frame-ancestors * and without X-Frame-Options: SAMEORIGIN', async () => {
    const rules = (await nextConfig.headers?.()) ?? []
    const embedRule = rules.find((r) => r.source === '/rfq/embed/:path*' || r.source === '/rfq/embed')
    expect(embedRule).toBeDefined()

    // Embed route matches /rfq/embed as well as subpaths
    const matcher = match(embedRule!.source)
    expect(Boolean(matcher('/rfq/embed'))).toBe(true)
    expect(Boolean(matcher('/rfq/embed/catalog'))).toBe(true)

    const headersMap = new Map(embedRule!.headers.map((h) => [h.key.toLowerCase(), h.value]))

    // Permissive framing: frame-ancestors *
    const csp = headersMap.get('content-security-policy')
    expect(csp).toBeDefined()
    expect(csp).toContain('frame-ancestors *')
    expect(csp).not.toContain("frame-ancestors 'self'")

    // Allow framing: do NOT set X-Frame-Options: SAMEORIGIN
    expect(headersMap.get('x-frame-options')).not.toBe('SAMEORIGIN')
    expect(headersMap.has('x-frame-options')).toBe(false)

    // General security baseline retained
    expect(headersMap.get('x-content-type-options')).toBe('nosniff')
    expect(headersMap.get('referrer-policy')).toBe('strict-origin-when-cross-origin')
    expect(headersMap.get('permissions-policy')).toBe(
      'camera=(), microphone=(), geolocation=(), payment=(), browsing-topics=()',
    )
    expect(headersMap.get('strict-transport-security')).toBe(
      'max-age=31536000; includeSubDomains; preload',
    )
  })

  it('preserves Payload admin header scoping', async () => {
    const rules = (await nextConfig.headers?.()) ?? []
    const payloadRule = rules.find((r) => r.source === '/admin/:path*')
    expect(payloadRule).toBeDefined()
    expect(payloadRule?.headers.some((h) => h.key === 'Critical-CH')).toBe(true)
  })
})
