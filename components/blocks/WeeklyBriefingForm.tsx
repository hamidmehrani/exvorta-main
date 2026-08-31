'use client'

import React, { useState } from 'react'
import { m as motion, AnimatePresence } from 'framer-motion'
import { AnimatedButton } from '@/components/ui/Reveal'
import { submitWaitlist } from '@/actions/submitWaitlist'
import { EASE_OUT } from '@/components/ui/Reveal'

/**
 * WeeklyBriefingForm — newsletter capture for the Insights archive.
 * Posts to the waitlist pipeline (Turnstile + rate-limit + Payload DB).
 */
export function WeeklyBriefingForm() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'pending' | 'done' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setState('pending')
    setError(null)
    const res = await submitWaitlist({ source: 'Waitlist', email, collection: 'waitlist' })
    if (res.success) {
      setState('done')
      setEmail('')
    } else {
      setState('error')
      setError(res.error || 'Submission failed')
    }
  }

  if (state === 'done') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        className="w-full flex justify-center"
      >
        <div className="border border-white/20 bg-white/[0.03] px-8 py-6 text-center">
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-white">
            [ SUBSCRIBED — CHECK YOUR INBOX ]
          </span>
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="w-full flex flex-col sm:flex-row gap-4">
      <label htmlFor="weekly-briefing-email" className="sr-only">
        Corporate email address
      </label>
      <input
        id="weekly-briefing-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={state === 'pending'}
        placeholder="CORPORATE EMAIL ADDRESS..."
        className="flex-grow bg-white/[0.03] border border-white/10 px-6 py-5 text-white placeholder:text-white/30 font-mono text-xs tracking-widest outline-none focus:border-white/40 text-center sm:text-left disabled:opacity-50"
      />
      <AnimatedButton
        type="submit"
        disabled={state === 'pending'}
        className="bg-white text-black px-8 py-5 text-[11px] uppercase tracking-[0.2em] font-mono hover:bg-gray-200 disabled:opacity-50"
      >
        {state === 'pending' ? '[ SUBMITTING… ]' : '[ SUBSCRIBE ]'}
      </AnimatedButton>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            role="alert"
            className="sm:absolute sm:mt-20 text-red-400 font-mono text-[11px] tracking-widest uppercase w-full text-center"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  )
}

export default WeeklyBriefingForm
