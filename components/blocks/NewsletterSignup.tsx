'use client'

import React, { useState } from 'react'
import { m as motion, AnimatePresence } from 'framer-motion'
import { AnimatedButton } from '@/components/ui/AnimatedButton'
import { submitWaitlist } from '@/actions/submitWaitlist'
import { EASE_OUT } from '@/components/ui/Reveal'

export interface NewsletterSignupProps {
  variant?: 'dark' | 'light'
  className?: string
}

export function NewsletterSignup({
  variant = 'light',
  className = '',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [botField, setBotField] = useState('')
  const [state, setState] = useState<'idle' | 'pending' | 'done' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const isDark = variant === 'dark'

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setState('pending')
    setError(null)

    try {
      const res = await submitWaitlist({
        source: 'Newsletter',
        email,
        botField: botField || undefined,
        collection: 'waitlist',
      })

      if (res.success) {
        setState('done')
        setEmail('')
      } else {
        setState('error')
        setError(res.error || 'Subscription transmission failed. Please try again.')
      }
    } catch (err) {
      setState('error')
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.')
    }
  }

  const handleRetry = () => {
    setState('idle')
    setError(null)
  }

  return (
    <div
      className={`w-full text-start transition-colors duration-200 ${
        isDark
          ? 'bg-obsidian text-white border border-rule-dark'
          : 'bg-surface text-obsidian border border-rule'
      } p-6 sm:p-8 rounded-sm ${className}`}
    >
      {/* Monospace Metadata Badges */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-dashed ${
          isDark ? 'border-rule-dark text-muted-dark' : 'border-rule text-muted'
        } font-mono text-[11px] uppercase tracking-wider`}
      >
        <span>[ CADENCE: THURSDAY 08:00 GST ]</span>
        <span>[ DISPATCH: TRADE COMPLIANCE & MACRO ]</span>
      </div>

      <AnimatePresence mode="wait">
        {state === 'done' ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className={`p-6 sm:p-8 text-center rounded-sm border ${
              isDark
                ? 'border-emerald/40 bg-emerald/10 text-white'
                : 'border-emerald/40 bg-emerald/5 text-obsidian'
            }`}
          >
            <div className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-emerald font-semibold mb-3">
              [ SUBSCRIBED — CHECK YOUR INBOX ]
            </div>
            <p
              className={`text-xs sm:text-sm font-sans font-light leading-relaxed max-w-md mx-auto ${
                isDark ? 'text-muted-dark' : 'text-muted'
              }`}
            >
              Confirmation dispatch transmitted. Check your inbox to review your executive briefing credentials.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4"
          >
            {/* Honeypot field for bot suppression */}
            <input
              type="text"
              name="bot-field"
              value={botField}
              onChange={(e) => setBotField(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-grow">
                <label htmlFor="newsletter-signup-email" className="sr-only">
                  Corporate email address
                </label>
                <input
                  id="newsletter-signup-email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={state === 'pending'}
                  placeholder="ENTER CORPORATE EMAIL ADDRESS..."
                  autoComplete="email"
                  className={`w-full font-mono text-xs tracking-wider px-4 py-3.5 rounded-sm outline-none transition-colors disabled:opacity-50 ${
                    isDark
                      ? 'bg-white/[0.04] border border-white/15 text-white placeholder:text-muted-dark focus:border-white/50 focus:ring-1 focus:ring-white/20'
                      : 'bg-cream border border-rule text-obsidian placeholder:text-muted focus:border-obsidian focus:ring-1 focus:ring-obsidian/20'
                  }`}
                />
              </div>

              <AnimatedButton
                type="submit"
                disabled={state === 'pending'}
                className={`font-mono text-label uppercase tracking-widest px-6 py-3.5 rounded-sm transition-colors disabled:opacity-50 whitespace-nowrap min-h-[46px] ${
                  isDark
                    ? 'bg-white text-obsidian hover:bg-neutral-200'
                    : 'bg-obsidian text-white hover:bg-neutral-800'
                }`}
              >
                {state === 'pending' ? 'SUBSCRIBING...' : '[ SUBSCRIBE ]'}
              </AnimatedButton>
            </div>

            {state === 'error' && error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                className="flex items-center justify-between gap-3 p-3 bg-red-500/10 border border-red-500/30 text-red-500 font-mono text-[11px] tracking-wider uppercase rounded-sm"
              >
                <span>{error}</span>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="underline hover:opacity-80 ms-auto font-mono text-[10px] tracking-widest cursor-pointer"
                >
                  [ RETRY ]
                </button>
              </motion.div>
            )}

            <div
              className={`font-mono text-[10px] tracking-widest uppercase flex items-center justify-between ${
                isDark ? 'text-muted-dark' : 'text-muted'
              }`}
            >
              <span>CONFIDENTIAL // NO MARKETING SPAM</span>
              <span>UNSUBSCRIBE AT ANY TIME</span>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NewsletterSignup
