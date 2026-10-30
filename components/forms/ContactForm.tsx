'use client'

import React, { useRef, useActionState, useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { submitLeadAction } from '@/actions/submitLead'
import { useFormStatus } from 'react-dom'

const TRADE_TYPE_OPTIONS = [
  'Agricultural Commodities & Food',
  'Building Materials & Construction',
  'Chemicals & Polymers',
  'Consumer Goods & FMCG',
  'Industrial Equipment & Machinery',
  'Metals & Minerals',
  'Textiles, Apparel & Footwear',
  'Cross-Border General Trading',
  'Other / Custom Trade Route',
] as const

const BUDGET_BAND_OPTIONS = [
  '$25,000 – $50,000',
  '$50,000 – $100,000',
  '$100,000 – $250,000',
  '$250,000+',
] as const

const TIMELINE_OPTIONS = [
  'Immediate (< 1 month)',
  '1 – 3 months',
  '3 – 6 months',
  'Exploring / Strategic Planning',
] as const

const CALL_PREFERENCE_OPTIONS = [
  'Async Review Only (Written engineering scope & quote within 1 business day)',
  'Introductory Architecture Call (30-minute direct scoping session)',
] as const

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
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden />
          [ Transmitting Brief… ]
        </span>
      ) : (
        '[ Submit Project Brief ]'
      )}
    </button>
  )
}

export default function ContactForm() {
  const [state, formAction] = useActionState(submitLeadAction, { success: false, error: '' })
  const formRef = useRef<HTMLFormElement>(null)
  const [formKey, setFormKey] = useState(0)
  const [dismissedKey, setDismissedKey] = useState<unknown>(null)

  const showSuccess = Boolean(state.success && dismissedKey !== state)

  const handleReset = () => {
    setDismissedKey(state)
    setFormKey((prev) => prev + 1)
  }

  if (showSuccess) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="w-full border border-rule bg-surface p-8 sm:p-10 text-start shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald/10 border border-emerald/30 text-emerald">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-emerald font-semibold">
            [ Brief Transmitted ]
          </span>
        </div>

        <h2 className="font-serif text-2xl font-semibold text-obsidian mb-3">
          What Happens Next
        </h2>
        <p className="text-sm text-muted leading-relaxed mb-8">
          Your project brief has been securely transmitted. Every submission is analyzed directly by senior systems architects with zero intermediary sales pitch.
        </p>

        <div className="border-t border-rule divide-y divide-rule mb-8">
          <div className="py-4 flex items-start gap-4">
            <span className="font-mono text-sm font-bold text-emerald">01</span>
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider font-semibold text-obsidian">
                Engineering Review
              </h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Direct analysis of technical requirements and trade constraints within 1 business day.
              </p>
            </div>
          </div>

          <div className="py-4 flex items-start gap-4">
            <span className="font-mono text-sm font-bold text-emerald">02</span>
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider font-semibold text-obsidian">
                Architectural Scope & Estimate
              </h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Detailed written response with fixed-price or milestone estimates.
              </p>
            </div>
          </div>

          <div className="py-4 flex items-start gap-4">
            <span className="font-mono text-sm font-bold text-emerald">03</span>
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider font-semibold text-obsidian">
                Alignment
              </h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Direct kickoff or async specification review per your communication preference.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="btn-ghost w-full min-h-[48px] text-center justify-center font-mono text-xs uppercase tracking-widest"
        >
          Submit another brief
        </button>
      </div>
    )
  }

  return (
    <form
      key={formKey}
      ref={formRef}
      action={formAction}
      className="flex w-full flex-col gap-6 text-start"
    >
      {/* Hidden Source */}
      <input type="hidden" name="source" value="RFQ" />

      {/* Invisible Honeypot Field */}
      <input type="text" name="bot-field" className="hidden" tabIndex={-1} autoComplete="off" />

      {/* Full Name & Business Email */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="field-label">
            Full Name <span className="text-emerald" aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="field"
            placeholder="Alex Wright"
          />
        </div>

        <div>
          <label htmlFor="email" className="field-label">
            Business Email <span className="text-emerald" aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="field"
            placeholder="alex@company.com"
          />
        </div>
      </div>

      {/* Company Name & Current Website */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className="field-label">
            Company Name <span className="text-emerald" aria-hidden="true">*</span>
          </label>
          <input
            id="company"
            name="company"
            type="text"
            required
            autoComplete="organization"
            className="field"
            placeholder="Acme Global Trading Ltd."
          />
        </div>

        <div>
          <label htmlFor="currentSite" className="field-label">
            Current Website / Digital Presence <span className="font-mono text-[10px] text-muted lowercase">(optional)</span>
          </label>
          <input
            id="currentSite"
            name="currentSite"
            type="text"
            autoComplete="url"
            className="field"
            placeholder="https://example.com"
          />
        </div>
      </div>

      {/* Type of Trade & Budget Band */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="tradeType" className="field-label">
            Type of Trade <span className="text-emerald" aria-hidden="true">*</span>
          </label>
          <select
            id="tradeType"
            name="tradeType"
            required
            defaultValue=""
            className="field cursor-pointer"
          >
            <option value="" disabled hidden>
              Select trade sector
            </option>
            {TRADE_TYPE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="budgetBand" className="field-label">
            Budget Band <span className="text-emerald" aria-hidden="true">*</span>
          </label>
          <select
            id="budgetBand"
            name="budgetBand"
            required
            defaultValue=""
            className="field cursor-pointer"
          >
            <option value="" disabled hidden>
              Select budget range
            </option>
            {BUDGET_BAND_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Timeline & Preferred Communication */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="timeline" className="field-label">
            Target Timeline <span className="text-emerald" aria-hidden="true">*</span>
          </label>
          <select
            id="timeline"
            name="timeline"
            required
            defaultValue=""
            className="field cursor-pointer"
          >
            <option value="" disabled hidden>
              Select timeline
            </option>
            {TIMELINE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="callPreference" className="field-label">
            Preferred Communication <span className="text-emerald" aria-hidden="true">*</span>
          </label>
          <select
            id="callPreference"
            name="callPreference"
            required
            defaultValue={CALL_PREFERENCE_OPTIONS[0]}
            className="field cursor-pointer"
          >
            {CALL_PREFERENCE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Project Scope & Requirements */}
      <div>
        <label htmlFor="message" className="field-label">
          Project Scope & Requirements <span className="text-emerald" aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="field resize-y"
          placeholder="Describe your technical requirements, ERP/trade integrations, target jurisdictions, or operational goals…"
        />
      </div>

      {/* Async-First Expectation Note */}
      <div className="border-s-2 border-emerald bg-surface p-4 text-xs font-mono leading-relaxed text-muted">
        <strong className="font-semibold text-obsidian uppercase tracking-wider">Strictly async-first: </strong>
        Every brief is evaluated directly by senior engineers within 1 business day. No unsolicited sales calls and zero spam.
      </div>

      {/* Turnstile */}
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <div className="my-2">
          <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
        </div>
      )}

      {/* Submit Button */}
      <SubmitButton />

      {/* Live region: announces the outcome to assistive tech without moving focus */}
      <div aria-live="polite" role="status">
        {state.error && (
          <p role="alert" className="border border-danger/30 bg-danger/10 p-4 text-center font-mono text-xs uppercase tracking-widest text-danger">
            {state.error}
          </p>
        )}
      </div>
    </form>
  )
}
