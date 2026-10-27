import { describe, it, expect } from 'vitest'
import { sanitizeHeadingHtml } from '@/utils/heading-sanitize'

describe('Vitest harness smoke test', () => {
  it('executes basic assertions and arithmetic correctly', () => {
    expect(1 + 1).toBe(2)
    expect(true).toBe(true)
  })

  it('supports path alias resolution (@/) for internal modules', () => {
    const result = sanitizeHeadingHtml('<span class="text-white/30">Test</span>')
    expect(result).toBe('<span class="text-brand-emerald">Test</span>')
  })
})
