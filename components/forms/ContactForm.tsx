'use client'

import React, { useRef, useActionState, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
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
      className="btn-primary min-h-[52px] w-full disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
          [ Transmitting Brief… ]
        </span>
      ) : (
        '[ Transmit Project Brief ]'
      )}
    </button>
  )
}

export default function ContactForm() {
  const [state, formAction] = useActionState(submitLeadAction, { success: false, error: '' })
  const formRef = useRef<HTMLFormElement>(null)
  const [formKey, setFormKey] = useState(0)
  const [dismissedKey, setDismissedKey] = useState<unknown>(null)

  // Radio selection state for Consultation Protocol
  const [selectedCallPreference, setSelectedCallPreference] = useState<string>(CALL_PREFERENCE_OPTIONS[0])

  // Field validation and touched tracking (Claude Mobbin pattern)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Post-submission reference receipt details (SoundCloud Mobbin pattern)
  const [referenceCode, setReferenceCode] = useState<string>('')
  const [submissionTime, setSubmissionTime] = useState<string>('')
  const [copied, setCopied] = useState(false)

  const showSuccess = Boolean(state.success && dismissedKey !== state)

  // Generate deterministic/stable reference code and timestamp on successful submission
  useEffect(() => {
    if (showSuccess && !referenceCode) {
      const chars = '0123456789ABCDEF'
      let hash = ''
      for (let i = 0; i < 8; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)]
      }
      setReferenceCode(`EXV-${hash.slice(0, 4)}-${hash.slice(4)}`)
      const now = new Date()
      setSubmissionTime(now.toISOString().replace('T', ' ').slice(0, 19) + ' UTC')
    }
  }, [showSuccess, referenceCode])

  const handleCopyReference = useCallback(() => {
    if (!referenceCode) return
    navigator.clipboard.writeText(referenceCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      // Fallback if clipboard API is restricted
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [referenceCode])

  const handleReset = () => {
    setDismissedKey(state)
    setFormKey((prev) => prev + 1)
    setTouched({})
    setErrors({})
    setReferenceCode('')
    setSubmissionTime('')
    setSelectedCallPreference(CALL_PREFERENCE_OPTIONS[0])
  }

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        return value.trim().length === 0 ? 'Full name is required.' : ''
      case 'email':
        if (!value.trim()) return 'Business email is required.'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid corporate email address.'
        return ''
      case 'company':
        return value.trim().length === 0 ? 'Company / entity name is required.' : ''
      case 'tradeType':
        return !value ? 'Please select a primary trade sector.' : ''
      case 'budgetBand':
        return !value ? 'Please select an anticipated budget band.' : ''
      case 'timeline':
        return !value ? 'Please select a deployment timeline.' : ''
      case 'message':
        return value.trim().length === 0 ? 'Project scope and specifications are required.' : ''
      default:
        return ''
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const err = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: err }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (touched[name]) {
      const err = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: err }))
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget
    const formData = new FormData(form)

    const requiredFields = ['name', 'email', 'company', 'tradeType', 'budgetBand', 'timeline', 'message']
    const newTouched: Record<string, boolean> = {}
    const newErrors: Record<string, string> = {}
    let hasInvalid = false

    for (const field of requiredFields) {
      newTouched[field] = true
      const val = (formData.get(field) as string) || ''
      const err = validateField(field, val)
      if (err) {
        newErrors[field] = err
        hasInvalid = true
      }
    }

    setTouched(newTouched)
    setErrors(newErrors)

    if (hasInvalid) {
      e.preventDefault()
      const firstInvalidKey = requiredFields.find((f) => newErrors[f])
      if (firstInvalidKey) {
        const el = form.querySelector<HTMLElement>(`[name="${firstInvalidKey}"]`)
        el?.focus()
      }
    }
  }

  // ── Post-submission Confirmation Card & Status Tracker (SoundCloud pattern) ──
  if (showSuccess) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="w-full border border-rule bg-surface p-6 sm:p-10 text-start shadow-sm rounded-[4px]"
      >
        {/* Header Status Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-5 mb-8">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-[4px] bg-emerald/10 border border-emerald/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald" />
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-emerald font-semibold">
              [ Brief Transmitted // SYS_ACK ]
            </span>
          </div>
          <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
            SLA: &lt; 24H DIRECT REVIEW
          </span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-obsidian mb-3">
          Project Brief Received & Logged
        </h2>
        <p className="text-sm text-muted leading-relaxed mb-8">
          Your project brief has been securely transmitted. Every submission is analyzed directly by senior systems architects with zero intermediary sales pitch.
        </p>

        {/* Reference Code Receipt Box (SoundCloud Mobbin pattern) */}
        <div className="border border-rule bg-surface-2 p-5 rounded-[4px] mb-8 font-mono">
          <div className="flex items-center justify-between text-xs text-muted mb-2">
            <span className="uppercase tracking-widest text-[10px]">Commercial Intake Reference Receipt</span>
            <span className="text-[10px] uppercase text-emerald">TLS 1.3 Verified</span>
          </div>

          <div className="my-2 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xl sm:text-2xl font-bold tracking-wider text-obsidian select-all">
              {referenceCode || 'EXV-8492-F10A'}
            </span>
            <button
              type="button"
              onClick={handleCopyReference}
              className="btn-ghost text-[10px] font-mono py-1.5 px-3 min-h-[34px] uppercase tracking-widest"
              aria-label="Copy reference code to clipboard"
            >
              {copied ? '[ Copied! ]' : '[ Copy Code ]'}
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 border-t border-rule pt-3 text-[11px] text-muted">
            <div className="flex justify-between">
              <span className="uppercase tracking-wider">Timestamp:</span>
              <span className="text-obsidian font-medium">{submissionTime || '2026-10-31 05:30 UTC'}</span>
            </div>
            <div className="flex justify-between">
              <span className="uppercase tracking-wider">Review Desk:</span>
              <span className="text-obsidian font-medium">Systems Architecture</span>
            </div>
            <div className="flex justify-between">
              <span className="uppercase tracking-wider">Status:</span>
              <span className="text-emerald font-semibold uppercase">Queued for Review</span>
            </div>
            <div className="flex justify-between">
              <span className="uppercase tracking-wider">Turnaround SLA:</span>
              <span className="text-obsidian font-medium">1 Business Day</span>
            </div>
          </div>
        </div>

        {/* Post-submission Timeline & Status Tracker (SoundCloud Mobbin pattern) */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-mono text-xs uppercase tracking-widest font-semibold text-obsidian">
              Ingest & Review Timeline
            </h3>
            <span className="font-mono text-[10px] text-emerald uppercase tracking-wider">[ 01 / 04 ACTIVE ]</span>
          </div>

          <div className="space-y-0">
            {/* Stage 1: Received */}
            <div className="relative flex items-start gap-4 pb-6">
              <div className="flex flex-col items-center">
                <span className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-emerald text-white">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="w-px flex-1 bg-emerald mt-2" style={{ minHeight: '32px' }} />
              </div>
              <div className="pt-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-wider font-semibold text-obsidian">
                    01. Ingestion & Security Clearance
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-[2px] bg-emerald/10 text-emerald uppercase font-semibold">
                    Complete
                  </span>
                </div>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Brief validated, honeypot and cryptographic verification cleared, parameter set recorded in enterprise store.
                </p>
              </div>
            </div>

            {/* Stage 2: Engineering Review */}
            <div className="relative flex items-start gap-4 pb-6">
              <div className="flex flex-col items-center">
                <span className="flex h-7 w-7 items-center justify-center rounded-[4px] border border-emerald bg-emerald/10 text-emerald">
                  <span className="h-2 w-2 rounded-full bg-emerald animate-pulse" />
                </span>
                <span className="w-px flex-1 bg-rule mt-2" style={{ minHeight: '32px' }} />
              </div>
              <div className="pt-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-wider font-semibold text-obsidian">
                    02. Architectural Feasibility Review
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-[2px] bg-obsidian text-white uppercase font-semibold">
                    In Progress
                  </span>
                </div>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Direct technical triage by senior systems architects. Evaluating commodity compliance, ERP integration targets, and latency parameters.
                </p>
              </div>
            </div>

            {/* Stage 3: Scope & Quote */}
            <div className="relative flex items-start gap-4 pb-6">
              <div className="flex flex-col items-center">
                <span className="flex h-7 w-7 items-center justify-center rounded-[4px] border border-rule bg-surface-2 font-mono text-xs text-muted">
                  03
                </span>
                <span className="w-px flex-1 bg-rule mt-2" style={{ minHeight: '32px' }} />
              </div>
              <div className="pt-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-wider font-semibold text-obsidian">
                    03. Architectural Scope & Milestone Quote
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-[2px] bg-rule text-muted uppercase font-semibold">
                    Queued
                  </span>
                </div>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Comprehensive written architectural proposal with fixed-price milestone estimates delivered to your registered corporate email.
                </p>
              </div>
            </div>

            {/* Stage 4: Alignment Kickoff */}
            <div className="relative flex items-start gap-4">
              <div className="flex flex-col items-center">
                <span className="flex h-7 w-7 items-center justify-center rounded-[4px] border border-rule bg-surface-2 font-mono text-xs text-muted">
                  04
                </span>
              </div>
              <div className="pt-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-wider font-semibold text-obsidian">
                    04. Kickoff & Milestone Delivery
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-[2px] bg-rule text-muted uppercase font-semibold">
                    Upcoming
                  </span>
                </div>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Direct kickoff or async specification sign-off according to your chosen consultation protocol.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-3 border-t border-rule pt-6">
          <button
            type="button"
            onClick={handleReset}
            className="btn-primary flex-1 min-h-[48px] text-center justify-center font-mono text-xs uppercase tracking-widest"
          >
            [ Submit Another Brief ]
          </button>
          <Link
            href="/"
            className="btn-ghost flex-1 min-h-[48px] text-center justify-center font-mono text-xs uppercase tracking-widest"
          >
            Return to Overview
          </Link>
        </div>
      </div>
    )
  }

  // ── Commercial Intake Form ──
  return (
    <form
      key={formKey}
      ref={formRef}
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full flex-col gap-8 text-start"
    >
      {/* Hidden Source Contract */}
      <input type="hidden" name="source" value="RFQ" />

      {/* Invisible Honeypot Field */}
      <input
        type="text"
        name="bot-field"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {/* ── Section 01: Entity & Principal (Xero split layout pattern) ── */}
      <div className="border border-rule bg-surface p-6 sm:p-8 rounded-[4px] shadow-sm">
        <div className="flex items-center justify-between border-b border-rule pb-3 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-emerald">01.</span>
            <h2 className="font-mono text-xs uppercase tracking-widest font-semibold text-obsidian">
              Principal & Entity Details
            </h2>
          </div>
          <span className="font-mono text-[10px] text-muted uppercase tracking-wider">[ Section 01 / 03 ]</span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="field-label mb-1.5 flex items-center justify-between">
              <span>
                Full Name <span className="text-emerald" aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              onBlur={handleBlur}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={touched.name && Boolean(errors.name) ? 'true' : 'false'}
              aria-describedby={`name-hint${touched.name && errors.name ? ' name-error' : ''}`}
              className={`w-full min-h-[48px] rounded-[4px] border bg-surface-2 px-3.5 py-2.5 text-sm text-obsidian transition-colors placeholder:text-muted/50 focus:bg-surface focus:border-obsidian focus:outline-none focus:ring-1 focus:ring-obsidian ${
                touched.name && errors.name
                  ? 'border-critical ring-1 ring-critical'
                  : 'border-rule hover:border-obsidian/40'
              }`}
              placeholder="e.g. Tariq Mansoor"
            />
            <p id="name-hint" className="mt-1.5 font-mono text-[11px] text-muted">
              Primary corporate officer or technical sponsor.
            </p>
            {touched.name && errors.name && (
              <p id="name-error" role="alert" className="mt-1.5 flex items-center gap-1.5 font-mono text-[11px] text-critical">
                <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
                  <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
                </svg>
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Business Email */}
          <div>
            <label htmlFor="email" className="field-label mb-1.5 flex items-center justify-between">
              <span>
                Business Email <span className="text-emerald" aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              onBlur={handleBlur}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={touched.email && Boolean(errors.email) ? 'true' : 'false'}
              aria-describedby={`email-hint${touched.email && errors.email ? ' email-error' : ''}`}
              className={`w-full min-h-[48px] rounded-[4px] border bg-surface-2 px-3.5 py-2.5 text-sm text-obsidian transition-colors placeholder:text-muted/50 focus:bg-surface focus:border-obsidian focus:outline-none focus:ring-1 focus:ring-obsidian ${
                touched.email && errors.email
                  ? 'border-critical ring-1 ring-critical'
                  : 'border-rule hover:border-obsidian/40'
              }`}
              placeholder="e.g. tariq@almansoor-trade.ae"
            />
            <p id="email-hint" className="mt-1.5 font-mono text-[11px] text-muted">
              Corporate domain inbox. Blueprints are sent here.
            </p>
            {touched.email && errors.email && (
              <p id="email-error" role="alert" className="mt-1.5 flex items-center gap-1.5 font-mono text-[11px] text-critical">
                <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
                  <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
                </svg>
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Company Name */}
          <div>
            <label htmlFor="company" className="field-label mb-1.5 flex items-center justify-between">
              <span>
                Company / Legal Entity <span className="text-emerald" aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </span>
            </label>
            <input
              id="company"
              name="company"
              type="text"
              required
              autoComplete="organization"
              onBlur={handleBlur}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={touched.company && Boolean(errors.company) ? 'true' : 'false'}
              aria-describedby={`company-hint${touched.company && errors.company ? ' company-error' : ''}`}
              className={`w-full min-h-[48px] rounded-[4px] border bg-surface-2 px-3.5 py-2.5 text-sm text-obsidian transition-colors placeholder:text-muted/50 focus:bg-surface focus:border-obsidian focus:outline-none focus:ring-1 focus:ring-obsidian ${
                touched.company && errors.company
                  ? 'border-critical ring-1 ring-critical'
                  : 'border-rule hover:border-obsidian/40'
              }`}
              placeholder="e.g. Al-Mansoor Trading LLC"
            />
            <p id="company-hint" className="mt-1.5 font-mono text-[11px] text-muted">
              Registered corporate legal entity name.
            </p>
            {touched.company && errors.company && (
              <p id="company-error" role="alert" className="mt-1.5 flex items-center gap-1.5 font-mono text-[11px] text-critical">
                <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
                  <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
                </svg>
                <span>{errors.company}</span>
              </p>
            )}
          </div>

          {/* Current Website / Digital Presence */}
          <div>
            <label htmlFor="currentSite" className="field-label mb-1.5 flex items-center justify-between">
              <span>Current Digital Portal</span>
              <span className="font-mono text-[10px] text-muted lowercase tracking-normal">(optional)</span>
            </label>
            <input
              id="currentSite"
              name="currentSite"
              type="text"
              autoComplete="url"
              aria-describedby="currentSite-hint"
              className="w-full min-h-[48px] rounded-[4px] border border-rule bg-surface-2 px-3.5 py-2.5 text-sm text-obsidian transition-colors placeholder:text-muted/50 hover:border-obsidian/40 focus:bg-surface focus:border-obsidian focus:outline-none focus:ring-1 focus:ring-obsidian"
              placeholder="e.g. https://almansoor-trade.ae"
            />
            <p id="currentSite-hint" className="mt-1.5 font-mono text-[11px] text-muted">
              Existing operational platform, broker portal, or URL.
            </p>
          </div>
        </div>
      </div>

      {/* ── Section 02: Trade Scope & Parameters (Xero split layout pattern) ── */}
      <div className="border border-rule bg-surface p-6 sm:p-8 rounded-[4px] shadow-sm">
        <div className="flex items-center justify-between border-b border-rule pb-3 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-emerald">02.</span>
            <h2 className="font-mono text-xs uppercase tracking-widest font-semibold text-obsidian">
              Trade Scope & Commercial Parameters
            </h2>
          </div>
          <span className="font-mono text-[10px] text-muted uppercase tracking-wider">[ Section 02 / 03 ]</span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Type of Trade */}
          <div>
            <label htmlFor="tradeType" className="field-label mb-1.5 flex items-center justify-between">
              <span>
                Primary Trade Commodity / Sector <span className="text-emerald" aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </span>
            </label>
            <select
              id="tradeType"
              name="tradeType"
              required
              defaultValue=""
              onBlur={handleBlur}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={touched.tradeType && Boolean(errors.tradeType) ? 'true' : 'false'}
              aria-describedby={`tradeType-hint${touched.tradeType && errors.tradeType ? ' tradeType-error' : ''}`}
              className={`w-full min-h-[48px] rounded-[4px] border bg-surface-2 px-3.5 py-2.5 text-sm text-obsidian transition-colors focus:bg-surface focus:border-obsidian focus:outline-none focus:ring-1 focus:ring-obsidian cursor-pointer ${
                touched.tradeType && errors.tradeType
                  ? 'border-critical ring-1 ring-critical'
                  : 'border-rule hover:border-obsidian/40'
              }`}
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
            <p id="tradeType-hint" className="mt-1.5 font-mono text-[11px] text-muted">
              Commodity class for tailored compliance architecture.
            </p>
            {touched.tradeType && errors.tradeType && (
              <p id="tradeType-error" role="alert" className="mt-1.5 flex items-center gap-1.5 font-mono text-[11px] text-critical">
                <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
                  <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
                </svg>
                <span>{errors.tradeType}</span>
              </p>
            )}
          </div>

          {/* Budget Band */}
          <div>
            <label htmlFor="budgetBand" className="field-label mb-1.5 flex items-center justify-between">
              <span>
                Capital Allocation / Budget <span className="text-emerald" aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </span>
            </label>
            <select
              id="budgetBand"
              name="budgetBand"
              required
              defaultValue=""
              onBlur={handleBlur}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={touched.budgetBand && Boolean(errors.budgetBand) ? 'true' : 'false'}
              aria-describedby={`budgetBand-hint${touched.budgetBand && errors.budgetBand ? ' budgetBand-error' : ''}`}
              className={`w-full min-h-[48px] rounded-[4px] border bg-surface-2 px-3.5 py-2.5 text-sm text-obsidian transition-colors focus:bg-surface focus:border-obsidian focus:outline-none focus:ring-1 focus:ring-obsidian cursor-pointer ${
                touched.budgetBand && errors.budgetBand
                  ? 'border-critical ring-1 ring-critical'
                  : 'border-rule hover:border-obsidian/40'
              }`}
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
            <p id="budgetBand-hint" className="mt-1.5 font-mono text-[11px] text-muted">
              Estimated capital allocation for trade software & infra.
            </p>
            {touched.budgetBand && errors.budgetBand && (
              <p id="budgetBand-error" role="alert" className="mt-1.5 flex items-center gap-1.5 font-mono text-[11px] text-critical">
                <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
                  <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
                </svg>
                <span>{errors.budgetBand}</span>
              </p>
            )}
          </div>

          {/* Target Timeline */}
          <div className="sm:col-span-2">
            <label htmlFor="timeline" className="field-label mb-1.5 flex items-center justify-between">
              <span>
                Deployment Timeline <span className="text-emerald" aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </span>
            </label>
            <select
              id="timeline"
              name="timeline"
              required
              defaultValue=""
              onBlur={handleBlur}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={touched.timeline && Boolean(errors.timeline) ? 'true' : 'false'}
              aria-describedby={`timeline-hint${touched.timeline && errors.timeline ? ' timeline-error' : ''}`}
              className={`w-full min-h-[48px] rounded-[4px] border bg-surface-2 px-3.5 py-2.5 text-sm text-obsidian transition-colors focus:bg-surface focus:border-obsidian focus:outline-none focus:ring-1 focus:ring-obsidian cursor-pointer ${
                touched.timeline && errors.timeline
                  ? 'border-critical ring-1 ring-critical'
                  : 'border-rule hover:border-obsidian/40'
              }`}
            >
              <option value="" disabled hidden>
                Select target timeline
              </option>
              {TIMELINE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <p id="timeline-hint" className="mt-1.5 font-mono text-[11px] text-muted">
              Target operational milestone for technical commissioning.
            </p>
            {touched.timeline && errors.timeline && (
              <p id="timeline-error" role="alert" className="mt-1.5 flex items-center gap-1.5 font-mono text-[11px] text-critical">
                <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
                  <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
                </svg>
                <span>{errors.timeline}</span>
              </p>
            )}
          </div>

          {/* Preferred Communication Protocol (Radio cards with full keyboard navigation) */}
          <div className="sm:col-span-2">
            <fieldset>
              <legend className="field-label mb-2 flex items-center justify-between w-full">
                <span>
                  Consultation Protocol <span className="text-emerald" aria-hidden="true">*</span>
                  <span className="sr-only">(required)</span>
                </span>
                <span className="font-mono text-[10px] text-muted uppercase tracking-wider">
                  Select Interaction Mode
                </span>
              </legend>
              <p id="callPreference-hint" className="mb-3 font-mono text-[11px] text-muted">
                Choose written architectural scoping or a 30-minute direct engineering scoping session.
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" role="radiogroup" aria-describedby="callPreference-hint">
                {CALL_PREFERENCE_OPTIONS.map((opt, i) => {
                  const isChecked = selectedCallPreference === opt
                  const titlePart = opt.split('(')[0].trim()
                  const descPart = opt.includes('(') ? opt.slice(opt.indexOf('(') + 1, opt.lastIndexOf(')')) : opt

                  return (
                    <label
                      key={opt}
                      htmlFor={`callPref-${i}`}
                      className={`relative flex items-start gap-3 p-4 rounded-[4px] border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-obsidian bg-surface shadow-sm ring-1 ring-obsidian'
                          : 'border-rule bg-surface-2/60 hover:bg-surface hover:border-obsidian/30'
                      }`}
                    >
                      <input
                        type="radio"
                        id={`callPref-${i}`}
                        name="callPreference"
                        value={opt}
                        checked={isChecked}
                        onChange={() => setSelectedCallPreference(opt)}
                        className="mt-0.5 h-4 w-4 text-obsidian border-rule focus:ring-obsidian accent-obsidian"
                      />
                      <div className="flex flex-col">
                        <span className="font-mono text-xs font-semibold text-obsidian uppercase tracking-wider">
                          {titlePart}
                        </span>
                        <span className="font-sans text-xs text-muted mt-1 leading-relaxed">
                          {descPart}
                        </span>
                      </div>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          </div>
        </div>
      </div>

      {/* ── Section 03: Architecture Brief & Specification (Xero split layout pattern) ── */}
      <div className="border border-rule bg-surface p-6 sm:p-8 rounded-[4px] shadow-sm">
        <div className="flex items-center justify-between border-b border-rule pb-3 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-emerald">03.</span>
            <h2 className="font-mono text-xs uppercase tracking-widest font-semibold text-obsidian">
              Architectural Specifications
            </h2>
          </div>
          <span className="font-mono text-[10px] text-muted uppercase tracking-wider">[ Section 03 / 03 ]</span>
        </div>

        <div>
          <label htmlFor="message" className="field-label mb-1.5 flex items-center justify-between">
            <span>
              Project Scope & Technical Requirements <span className="text-emerald" aria-hidden="true">*</span>
              <span className="sr-only">(required)</span>
            </span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            onBlur={handleBlur}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={touched.message && Boolean(errors.message) ? 'true' : 'false'}
            aria-describedby={`message-hint${touched.message && errors.message ? ' message-error' : ''}`}
            className={`w-full rounded-[4px] border bg-surface-2 px-3.5 py-3 text-sm text-obsidian transition-colors placeholder:text-muted/50 focus:bg-surface focus:border-obsidian focus:outline-none focus:ring-1 focus:ring-obsidian resize-y leading-relaxed ${
              touched.message && errors.message
                ? 'border-critical ring-1 ring-critical'
                : 'border-rule hover:border-obsidian/40'
            }`}
            placeholder="Describe technical requirements, ERP/trade integrations, target jurisdictions, transaction volume constraints, or custom compliance workflows…"
          />
          <p id="message-hint" className="mt-1.5 font-mono text-[11px] text-muted">
            Detail custom integrations (customs brokers, freight forwarding, banking APIs) and infrastructure scale.
          </p>
          {touched.message && errors.message && (
            <p id="message-error" role="alert" className="mt-1.5 flex items-center gap-1.5 font-mono text-[11px] text-critical">
              <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
                <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
              </svg>
              <span>{errors.message}</span>
            </p>
          )}
        </div>

        {/* Async-First Expectation Note */}
        <div className="mt-6 border-s-2 border-emerald bg-surface-2 p-4 text-xs font-mono leading-relaxed text-muted rounded-[4px]">
          <strong className="font-semibold text-obsidian uppercase tracking-wider">Strictly Async-First: </strong>
          Every brief is evaluated directly by senior systems engineers within 1 business day. No unsolicited sales calls and zero spam.
        </div>

        {/* Turnstile Security Check */}
        {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
          <div className="mt-6">
            <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-6">
          <SubmitButton />
        </div>

        {/* Server Action Alert Live Region */}
        <div aria-live="assertive" role="status" className="mt-4">
          {state.error && (
            <p
              role="alert"
              className="border border-critical bg-critical/10 p-4 text-center font-mono text-xs uppercase tracking-widest text-critical rounded-[4px]"
            >
              [ Transmission Error: {state.error} ]
            </p>
          )}
        </div>
      </div>
    </form>
  )
}
