'use client'

import React, { useRef, useState, useTransition } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { submitLeadAction } from '@/actions/submitLead'

export default function ContactForm() {
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      setStatus('idle')
      const res = await submitLeadAction(null, formData)
      if (res.success) {
        setStatus('success')
        formRef.current?.reset()
      } else {
        setStatus('error')
        setErrorMessage(res.error || 'Submission failed.')
      }
    })
  }

  return (
    <form ref={formRef} action={handleSubmit} className="w-full max-w-lg flex flex-col gap-4">
      {/* Invisible Honeypot Field */}
      <input type="text" name="bot-field" className="hidden" tabIndex={-1} autoComplete="off" />
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-muted mb-1">Name</label>
        <input id="name" name="name" type="text" required className="w-full h-10 px-3 bg-surface border border-border rounded text-text focus:outline-none focus:border-accent" />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-muted mb-1">Email</label>
        <input id="email" name="email" type="email" required className="w-full h-10 px-3 bg-surface border border-border rounded text-text focus:outline-none focus:border-accent" />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-muted mb-1">Phone (Optional)</label>
        <input id="phone" name="phone" type="tel" className="w-full h-10 px-3 bg-surface border border-border rounded text-text focus:outline-none focus:border-accent" />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-muted mb-1">Message</label>
        <textarea id="message" name="message" required rows={4} className="w-full px-3 py-2 bg-surface border border-border rounded text-text focus:outline-none focus:border-accent" />
      </div>

      <div className="my-2">
        <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'} />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="h-10 px-6 rounded bg-primary text-bg font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {isPending ? 'Submitting...' : 'Send Message'}
      </button>

      {status === 'success' && <p className="text-teal text-sm font-medium">Message sent successfully!</p>}
      {status === 'error' && <p className="text-danger text-sm font-medium">{errorMessage}</p>}
    </form>
  )
}
