import { describe, it, expect } from 'vitest'
import { sanitizeHeadingHtml } from './heading-sanitize'

describe('sanitizeHeadingHtml', () => {
  it('rewrites opacity classes to text-brand-emerald when onDark is false/omitted', () => {
    const input = '<span class="text-white/40">Trade</span> <span class="text-white/60">Flow</span>'
    const output = sanitizeHeadingHtml(input)
    expect(output).toBe('<span class="text-brand-emerald">Trade</span> <span class="text-brand-emerald">Flow</span>')
  })

  it('leaves html untouched when onDark is true', () => {
    const input = '<span class="text-white/50">Trade</span>'
    const output = sanitizeHeadingHtml(input, { onDark: true })
    expect(output).toBe(input)
  })

  it('leaves other classes untouched', () => {
    const input = '<span class="text-white text-lg">Heading</span>'
    const output = sanitizeHeadingHtml(input)
    expect(output).toBe(input)
  })
})
