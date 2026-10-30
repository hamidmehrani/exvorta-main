'use client'

import React, { useRef, useActionState, useEffect } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { submitLeadAction } from '@/actions/submitLead'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary mt-2 min-h-[52px] w-full disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden />
          [ Sending… ]
        </span>
      ) : (
        '[ Send message ]'
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
    <form ref={formRef} action={formAction} className="flex w-full max-w-lg flex-col gap-6 text-start">
      {/* Invisible Honeypot Field */}
      <input type="text" name="bot-field" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div>
        <label htmlFor="name" className="field-label">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          aria-required="true"
          aria-invalid={Boolean(state.error)}
          aria-describedby={state.error ? 'contact-form-error' : undefined}
          autoComplete="name"
          className="field"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label htmlFor="email" className="field-label">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          aria-required="true"
          aria-invalid={Boolean(state.error)}
          aria-describedby={state.error ? 'contact-form-error' : undefined}
          autoComplete="email"
          className="field"
          placeholder="john@company.com"
        />
      </div>

      <div>
        <label htmlFor="phone" className="field-label">Phone (optional)</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          aria-invalid={Boolean(state.error)}
          aria-describedby={state.error ? 'contact-form-error' : undefined}
          autoComplete="tel"
          className="field"
          placeholder="+1 (555) 000-0000"
        />
      </div>

      <div>
        <label htmlFor="message" className="field-label">Message</label>
        <textarea
          id="message"
          name="message"
          required
          aria-required="true"
          aria-invalid={Boolean(state.error)}
          aria-describedby={state.error ? 'contact-form-error' : undefined}
          rows={4}
          className="field resize-y"
          placeholder="How can we help your business scale?"
        />
      </div>

      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <div className="my-2">
          <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
        </div>
      )}

      <SubmitButton />

      {/* Live region: announces the outcome to assistive tech without moving focus. */}
      <div aria-live="polite" role="status">
        {state.success && (
          <p className="border border-emerald/30 bg-emerald/10 p-4 text-center font-mono text-xs uppercase tracking-widest text-emerald">
            Message sent — our team will reach out shortly.
          </p>
        )}
        {state.error && (
          <p id="contact-form-error" role="alert" className="border border-danger/30 bg-danger/10 p-4 text-center font-mono text-xs uppercase tracking-widest text-danger">
            {state.error}
          </p>
        )}
      </div>
    </form>
  )
}
