'use client'

import React, { useState, useTransition } from 'react'
import { submitWaitlist } from '@/actions/submitWaitlist'
import Container from '@/components/ui/Container'

export interface ToolsWaitlistBandProps {
  className?: string
}

export function ToolsWaitlistBand({ className = '' }: ToolsWaitlistBandProps) {
  const [email, setEmail] = useState('')
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) return

    setErrorMessage('')
    startTransition(async () => {
      try {
        const res = await submitWaitlist({
          source: 'Tools Hub',
          email: trimmed,
          collection: 'waitlist',
        })
        if (res.success) {
          setStatus('success')
          setEmail('')
        } else {
          setStatus('error')
          setErrorMessage(res.error || 'Failed to submit. Please try again.')
        }
      } catch {
        setStatus('error')
        setErrorMessage('An unexpected error occurred. Please try again.')
      }
    })
  }

  return (
    <section
      aria-labelledby="tools-waitlist-heading"
      className={`w-full bg-obsidian text-paper border border-white/10 py-16 md:py-24 ${className}`}
    >
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald mb-3">
            [ REGULATORY &amp; MODULE DISPATCH ]
          </p>
          <h2
            id="tools-waitlist-heading"
            className="font-serif text-3xl md:text-4xl text-paper font-semibold mb-4 tracking-tight"
          >
            Stay Ahead of Regional Trade Mandates
          </h2>
          <p className="text-sand/80 text-sm md:text-base mb-8 max-w-xl mx-auto leading-relaxed">
            Get automated release advisories when new GCC Unified Customs Tariff matrices, PINT-AE e-invoicing validators, and ACID conformity checks go live.
          </p>

          {status === 'success' ? (
            <div
              className="inline-flex items-center justify-center border border-emerald/40 bg-emerald/10 px-6 py-4 font-mono text-xs uppercase tracking-widest text-emerald"
              role="status"
              aria-live="polite"
            >
              [ SUBSCRIBED — CHECK YOUR INBOX ]
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto text-start">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label htmlFor="tools-hub-email" className="sr-only">
                    Corporate Email Address
                  </label>
                  <input
                    id="tools-hub-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="trade.ops@enterprise.com"
                    disabled={isPending}
                    className="w-full bg-white/5 border border-white/20 px-4 py-3 font-mono text-xs text-paper placeholder:text-sand/40 focus:outline-none focus:border-emerald transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-paper text-obsidian px-6 py-3 font-mono text-xs uppercase tracking-widest font-semibold hover:bg-cream transition-colors disabled:opacity-50 text-center"
                >
                  {isPending ? '[ SUBMITTING... ]' : '[ REQUEST ACCESS ]'}
                </button>
              </div>

              {status === 'error' && errorMessage && (
                <p role="alert" className="mt-3 font-mono text-xs text-danger text-start">
                  {errorMessage}
                </p>
              )}
            </form>
          )}
        </div>
      </Container>
    </section>
  )
}

export default ToolsWaitlistBand
