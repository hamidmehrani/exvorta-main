'use client'

import React, { useRef, useActionState, useEffect } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { submitLeadAction } from '@/actions/submitLead'
import { useFormStatus } from 'react-dom'
import { m, AnimatePresence } from 'framer-motion'
import { EASE_OUT } from '@/components/ui/Reveal'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-12 px-6 mt-2 rounded-lg bg-primary text-bg font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center w-full shadow-lg"
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <span className="w-5 h-5 border-2 border-bg border-t-transparent rounded-full animate-spin"></span>
          Sending...
        </span>
      ) : (
        'Send Message'
      )}
    </button>
  )
}

export default function ContactForm() {
  const [state, formAction] = useActionState(submitLeadAction, { success: false, error: '' })
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
    }
  }, [state.success])

  return (
    <form ref={formRef} action={formAction} className="w-full max-w-lg flex flex-col gap-4 text-start">
      {/* Required lead source for Payload CMS Leads collection */}
      <input type="hidden" name="source" value="RFQ" />

      {/* Honeypot field for bot trapping — completely hidden from human visitors */}
      <div aria-hidden="true" className="absolute opacity-0 -z-50 pointer-events-none h-0 w-0 overflow-hidden" tabIndex={-1}>
        <label htmlFor="contact-bot-field">Do not fill this field</label>
        <input
          id="contact-bot-field"
          type="text"
          name="bot-field"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      
      <div>
        <label htmlFor="name" className="block text-xs font-semibold text-text uppercase tracking-wider mb-2">Name</label>
        <input id="name" name="name" type="text" required className="w-full h-12 px-4 bg-surface-2 border border-border rounded-lg text-text focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" placeholder="John Doe" />
      </div>

      <div>
        <label htmlFor="email" className="block text-xs font-semibold text-text uppercase tracking-wider mb-2">Email</label>
        <input id="email" name="email" type="email" required className="w-full h-12 px-4 bg-surface-2 border border-border rounded-lg text-text focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" placeholder="john@company.com" />
      </div>

      <div>
        <label htmlFor="phone" className="block text-xs font-semibold text-text uppercase tracking-wider mb-2">Phone (Optional)</label>
        <input id="phone" name="phone" type="tel" className="w-full h-12 px-4 bg-surface-2 border border-border rounded-lg text-text focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" placeholder="+1 (555) 000-0000" />
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-semibold text-text uppercase tracking-wider mb-2">Message</label>
        <textarea id="message" name="message" required rows={4} className="w-full px-4 py-3 bg-surface-2 border border-border rounded-lg text-text focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-y" placeholder="How can we help your business scale?" />
      </div>

      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <div className="my-2">
          <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
        </div>
      )}

      <SubmitButton />

      <AnimatePresence>
        {state.success && (
          <m.div
            key="success"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="p-4 mt-2 bg-teal/10 border border-teal/20 text-teal rounded-lg text-sm font-medium text-center shadow-sm"
          >
            Message sent successfully! Our team will reach out shortly.
          </m.div>
        )}
        {state.error && (
          <m.div
            key="error"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="p-4 mt-2 bg-danger/10 border border-danger/20 text-danger rounded-lg text-sm font-medium text-center shadow-sm"
          >
            {state.error}
          </m.div>
        )}
      </AnimatePresence>
    </form>
  )
}
