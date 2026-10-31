'use client'

import React, { useRef, useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { TurnstileWidget, type TurnstileWidgetRef } from '@/components/forms/TurnstileWidget'
import { submitLeadAction } from '@/actions/submitLead'

export const PARTNER_CATEGORY_OPTIONS = [
  'Tax Consultants & Corporate Tax Advisors',
  'Clearing Agents & Customs Brokers',
  'Free-Zone Setup & Company Formation Agencies',
  'Other Commercial Partner',
] as const

export type PartnerCategoryOption = (typeof PARTNER_CATEGORY_OPTIONS)[number]

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary mt-2 min-h-[52px] w-full disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <span
            className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"
            aria-hidden="true"
          />
          [ Transmitting Application… ]
        </span>
      ) : (
        '[ Submit Partner Application ]'
      )}
    </button>
  )
}

export interface PartnerApplicationFormProps {
  className?: string
}

export function PartnerApplicationForm({ className = '' }: PartnerApplicationFormProps) {
  const [state, formAction] = useActionState(submitLeadAction, { success: false, error: '' })
  const formRef = useRef<HTMLFormElement>(null)
  const turnstileRef = useRef<TurnstileWidgetRef>(null)
  const [turnstileToken, setTurnstileToken] = useState<string>()

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
      turnstileRef.current?.reset()
      setTurnstileToken(undefined)
    }
  }, [state.success])

  useEffect(() => {
    if (state.error) {
      turnstileRef.current?.reset()
      setTurnstileToken(undefined)
    }
  }, [state.error])

  return (
    <form
      ref={formRef}
      action={formAction}
      className={`flex w-full flex-col gap-6 text-start ${className}`.trim()}
    >
      {/* Hidden honeypot field */}
      <input
        type="text"
        name="bot-field"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Hidden source and tag fields */}
      <input type="hidden" name="source" value="RFQ" />
      <input type="hidden" name="tag" value="partner" />
      <input type="hidden" name="interest" value="partner-program" />

      {/* Name and Email */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="field-label">
            Name <span className="text-danger">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="field"
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="field-label">
            Email <span className="text-danger">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="field"
            placeholder="jane@advisory.ae"
          />
        </div>
      </div>

      {/* Organization and Phone */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="company" className="field-label">
            Organization / Firm Name <span className="text-danger">*</span>
          </label>
          <input
            id="company"
            name="company"
            type="text"
            required
            autoComplete="organization"
            className="field"
            placeholder="Al-Mansoor Advisory LLC"
          />
        </div>

        <div>
          <label htmlFor="phone" className="field-label">
            Phone / WhatsApp (optional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className="field"
            placeholder="+971 4 000 0000"
          />
        </div>
      </div>

      {/* Partner Category and Jurisdiction */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="partnerCategory" className="field-label">
            Partner Category <span className="text-danger">*</span>
          </label>
          <select
            id="partnerCategory"
            name="partnerCategory"
            required
            defaultValue={PARTNER_CATEGORY_OPTIONS[0]}
            className="field cursor-pointer"
          >
            {PARTNER_CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="jurisdiction" className="field-label">
            Jurisdiction / Free-Zone / City (optional)
          </label>
          <input
            id="jurisdiction"
            name="jurisdiction"
            type="text"
            className="field"
            placeholder="e.g. DIFC, ADGM, DMCC, Dubai Mainland"
          />
        </div>
      </div>

      {/* Referral profile / message */}
      <div>
        <label htmlFor="message" className="field-label">
          Primary Client Referral Profile / Message <span className="text-danger">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="field resize-y"
          placeholder="Typical client export volume, trade domains, jurisdictions, or referral profile…"
        />
      </div>

      {/* Turnstile Captcha */}
      <div className="my-2">
        <TurnstileWidget
          ref={turnstileRef}
          onSuccess={setTurnstileToken}
          onExpire={() => setTurnstileToken(undefined)}
        />
        <input type="hidden" name="turnstileToken" value={turnstileToken || ''} />
      </div>

      {/* Submit Button */}
      <SubmitButton />

      {/* Status Announcement Banner */}
      <div aria-live="polite" role="status">
        {state.success && (
          <p className="border border-emerald/30 bg-emerald/10 p-4 text-center font-mono text-xs uppercase tracking-widest text-emerald">
            Partner application received. Our partner director will initiate NDA & onboarding dispatch within 4 business hours.
          </p>
        )}
        {state.error && (
          <p
            role="alert"
            className="border border-danger/30 bg-danger/10 p-4 text-center font-mono text-xs uppercase tracking-widest text-danger"
          >
            {state.error}
          </p>
        )}
      </div>
    </form>
  )
}

export default PartnerApplicationForm
