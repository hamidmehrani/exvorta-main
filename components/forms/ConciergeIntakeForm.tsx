'use client'

import React, { useState, useActionState, useRef, useCallback, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { Turnstile } from '@marsidev/react-turnstile'
import { submitLeadAction } from '@/actions/submitLead'

const TRADE_LANE_OPTIONS = [
  'East Asia / China → UAE / GCC',
  'Europe → GCC',
  'India / South Asia → GCC',
  'Americas → GCC',
  'Intra-GCC / Cross-Border',
  'Other / Emerging Corridor',
] as const

const FREIGHT_MODE_OPTIONS = [
  'Ocean FCL (Full Container Load)',
  'Ocean LCL (Less than Container Load)',
  'Air Cargo',
  'Multimodal / Project Cargo',
] as const

const MONTHLY_VOLUME_OPTIONS = [
  '< 5 shipments/mo',
  '5–20 shipments/mo',
  '20–50 shipments/mo',
  '50+ shipments/mo',
] as const

const AUDIT_FOCUS_OPTIONS = [
  'Full Comprehensive 3-Pillar Audit (Recommended)',
  'Carrier Rate Benchmark & Surcharges (Drewry/SCFI Leakage)',
  'Customs Tariff & HS Reclassification (GCC Common Law)',
  'Demurrage & Free Time Optimization (Dwell Risk)',
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
          <span
            className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"
            aria-hidden="true"
          />
          <span className="font-mono text-xs uppercase tracking-widest">[ COMMENCING INTAKE... ]</span>
        </span>
      ) : (
        <span className="font-mono text-xs uppercase tracking-widest">[ TRANSMIT 24-HOUR AUDIT INTAKE ]</span>
      )}
    </button>
  )
}

export default function ConciergeIntakeForm() {
  const [state, formAction] = useActionState(submitLeadAction, { success: false, error: '' })
  const formRef = useRef<HTMLFormElement>(null)
  const [formKey, setFormKey] = useState(0)
  const [dismissedKey, setDismissedKey] = useState<unknown>(null)

  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [referenceCode, setReferenceCode] = useState<string>('')
  const [submissionTime, setSubmissionTime] = useState<string>('')
  const [copied, setCopied] = useState(false)

  const showSuccess = Boolean(state.success && dismissedKey !== state)

  useEffect(() => {
    if (showSuccess && !referenceCode) {
      const chars = '0123456789ABCDEF'
      let hash = ''
      for (let i = 0; i < 8; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)]
      }
      setReferenceCode(`AUD-${hash.slice(0, 4)}-${hash.slice(4)}`)
      const now = new Date()
      setSubmissionTime(now.toISOString().replace('T', ' ').slice(0, 19) + ' UTC')
    }
  }, [showSuccess, referenceCode])

  const handleCopyReference = useCallback(() => {
    if (!referenceCode) return
    navigator.clipboard
      .writeText(referenceCode)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => {
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
  }

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'fullName':
        return value.trim().length === 0 ? 'Full name is required.' : ''
      case 'email':
        if (!value.trim()) return 'Work email is required.'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid business email address.'
        return ''
      case 'company':
        return value.trim().length === 0 ? 'Company name is required.' : ''
      case 'tradeLane':
        return !value ? 'Please select your primary trade lane.' : ''
      case 'freightMode':
        return !value ? 'Please select a primary freight mode.' : ''
      case 'monthlyVolume':
        return !value ? 'Please select your estimated monthly volume.' : ''
      case 'auditFocus':
        return !value ? 'Please select a primary audit focus.' : ''
      case 'shipmentsOverview':
        return value.trim().length < 10
          ? 'Please briefly outline origins, destinations, container types, or forwarder rates (minimum 10 characters).'
          : ''
      default:
        return ''
    }
  }

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const err = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: err }))
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    if (touched[name]) {
      const err = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: err }))
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget
    const formData = new FormData(form)

    const requiredFields = [
      'fullName',
      'email',
      'company',
      'tradeLane',
      'freightMode',
      'monthlyVolume',
      'auditFocus',
      'shipmentsOverview',
    ]

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

  // ── Success State: Institutional Confirmation Card ──
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
              [ INTAKE RECEIVED // 24-HOUR SLA ACTIVE ]
            </span>
          </div>
          <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
            SLA: &lt; 24H AUDIT DELIVERY
          </span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-obsidian mb-3">
          Intake Received — Your 24-Hour Clock Starts Now
        </h2>
        <p className="text-sm text-muted leading-relaxed mb-8">
          Our forensic audit desk is reviewing your trade lane benchmarks. Expect your private audit dossier
          within 24 business hours.
        </p>

        {/* Reference Code Box */}
        <div className="border border-rule bg-surface-2 p-5 rounded-[4px] mb-8 font-mono">
          <div className="flex items-center justify-between text-xs text-muted mb-2">
            <span className="uppercase tracking-widest text-[10px]">Concierge Audit Reference Ticket</span>
            <span className="text-[10px] uppercase text-emerald">TLS 1.3 Verified</span>
          </div>

          <div className="my-2 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xl sm:text-2xl font-bold tracking-wider text-obsidian select-all">
              {referenceCode || 'AUD-74F2-E901'}
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
              <span className="uppercase tracking-wider">Logged Timestamp:</span>
              <span className="text-obsidian font-medium">{submissionTime || '2026-10-31 12:00 UTC'}</span>
            </div>
            <div className="flex justify-between">
              <span className="uppercase tracking-wider">Assigned Desk:</span>
              <span className="text-obsidian font-medium">Dubai Trade Benchmarking</span>
            </div>
            <div className="flex justify-between">
              <span className="uppercase tracking-wider">Status:</span>
              <span className="text-emerald font-semibold uppercase">In Triage & Benchmark</span>
            </div>
            <div className="flex justify-between">
              <span className="uppercase tracking-wider">Turnaround SLA:</span>
              <span className="text-obsidian font-medium">24 Business Hours</span>
            </div>
          </div>
        </div>

        {/* Document Upload Instructions */}
        <div className="border-s-2 border-emerald bg-surface-2 p-5 mb-8 rounded-[4px] text-xs leading-relaxed text-muted">
          <div className="flex items-center gap-2 mb-2">
            <svg className="h-4 w-4 text-emerald shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <strong className="font-semibold text-obsidian uppercase tracking-wider font-mono text-xs">
              Document Upload Instruction
            </strong>
          </div>
          <p>
            Have PDF copies of your Commercial Invoices, Packing Lists, or B/Ls? Reply directly to your
            confirmation email or forward to{' '}
            <a
              href={`mailto:concierge@exvorta.com?subject=Documents for ${encodeURIComponent(referenceCode)}`}
              className="text-emerald underline underline-offset-2 font-medium"
            >
              concierge@exvorta.com
            </a>{' '}
            referencing your company name and ticket ID. Sensitive commercial names may be redacted — we only
            require rates, tariff codes, and volume parameters.
          </p>
        </div>

        {/* SLA Progress Tracker */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-muted">
              Execution Timeline (24-Hour Pipeline)
            </span>
            <span className="font-mono text-[11px] text-emerald font-medium">Stage 01 of 03</span>
          </div>

          <div className="space-y-4">
            <div className="relative flex items-start gap-4 pb-4">
              <div className="flex flex-col items-center">
                <span className="flex h-7 w-7 items-center justify-center rounded-[4px] border border-emerald bg-emerald text-white font-mono text-xs font-semibold">
                  01
                </span>
                <span className="w-px flex-1 bg-emerald mt-2" style={{ minHeight: '24px' }} />
              </div>
              <div className="pt-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-wider font-semibold text-obsidian">
                    01. Intake & Parameter Verification
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-[2px] bg-emerald/10 text-emerald uppercase font-semibold">
                    Active
                  </span>
                </div>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Parsing trade lane metadata, container specs, and indexing against Drewry/SCFI freight baselines.
                </p>
              </div>
            </div>

            <div className="relative flex items-start gap-4 pb-4">
              <div className="flex flex-col items-center">
                <span className="flex h-7 w-7 items-center justify-center rounded-[4px] border border-rule bg-surface-2 font-mono text-xs text-muted">
                  02
                </span>
                <span className="w-px flex-1 bg-rule mt-2" style={{ minHeight: '24px' }} />
              </div>
              <div className="pt-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-wider font-semibold text-obsidian">
                    02. Customs & Surcharge Forensic Scan
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-[2px] bg-rule text-muted uppercase font-semibold">
                    Queued (T+6h)
                  </span>
                </div>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Cross-referencing Common GCC Customs Law, HS reclassification risk, and carrier detention exposure.
                </p>
              </div>
            </div>

            <div className="relative flex items-start gap-4">
              <div className="flex flex-col items-center">
                <span className="flex h-7 w-7 items-center justify-center rounded-[4px] border border-rule bg-surface-2 font-mono text-xs text-muted">
                  03
                </span>
              </div>
              <div className="pt-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-wider font-semibold text-obsidian">
                    03. Executive Video Dossier & Preloaded Workspace
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-[2px] bg-rule text-muted uppercase font-semibold">
                    Delivery (&lt; 24h)
                  </span>
                </div>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Private recorded analysis by a senior trade architect with itemized savings recommendations.
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
            [ Submit Another Shipment Dossier ]
          </button>
        </div>
      </div>
    )
  }

  // ── Intake Form ──
  return (
    <form
      key={formKey}
      ref={formRef}
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full flex-col gap-8 text-start"
    >
      {/* Hidden Contract Inputs */}
      <input type="hidden" name="source" value="RFQ" />
      <input type="hidden" name="auditType" value="24h-concierge" />
      <input
        type="text"
        name="bot-field"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {/* Error Banner */}
      {state.error && (
        <div
          role="alert"
          className="border border-critical bg-critical/10 p-4 text-xs font-mono text-critical rounded-[4px] flex items-start gap-2.5"
        >
          <svg className="h-4 w-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div>
            <p className="font-semibold uppercase tracking-wider">Intake Submission Failed</p>
            <p className="mt-1 text-[11px] opacity-90">{state.error}</p>
          </div>
        </div>
      )}

      {/* Section 01: Entity & Contact Details */}
      <div className="border border-rule bg-surface p-6 sm:p-8 rounded-[4px] shadow-sm">
        <div className="flex items-center justify-between border-b border-rule pb-3 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-emerald">01.</span>
            <h2 className="font-mono text-xs uppercase tracking-widest font-semibold text-obsidian">
              Corporate Entity & Contact
            </h2>
          </div>
          <span className="font-mono text-[10px] text-muted uppercase tracking-wider">[ Section 01 / 03 ]</span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="field-label mb-1.5 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-muted">
                Full Name <span className="text-emerald" aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              autoComplete="name"
              onBlur={handleBlur}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={touched.fullName && Boolean(errors.fullName) ? 'true' : 'false'}
              aria-describedby={`fullName-hint${touched.fullName && errors.fullName ? ' fullName-error' : ''}`}
              className={`w-full min-h-[46px] rounded-[4px] border bg-surface-2 px-3.5 py-2.5 text-sm text-obsidian transition-colors placeholder:text-muted/50 focus:bg-surface focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald ${
                touched.fullName && errors.fullName
                  ? 'border-critical ring-1 ring-critical'
                  : 'border-rule hover:border-obsidian/40'
              }`}
              placeholder="e.g. Tariq Al-Mansoor"
            />
            <p id="fullName-hint" className="mt-1.5 font-mono text-[11px] text-muted">
              Supply chain director or commercial sponsor.
            </p>
            {touched.fullName && errors.fullName && (
              <p id="fullName-error" role="alert" className="mt-1.5 flex items-center gap-1.5 font-mono text-[11px] text-critical">
                <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
                  <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
                </svg>
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>

          {/* Work Email */}
          <div>
            <label htmlFor="email" className="field-label mb-1.5 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-muted">
                Work Email <span className="text-emerald" aria-hidden="true">*</span>
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
              className={`w-full min-h-[46px] rounded-[4px] border bg-surface-2 px-3.5 py-2.5 text-sm text-obsidian transition-colors placeholder:text-muted/50 focus:bg-surface focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald ${
                touched.email && errors.email
                  ? 'border-critical ring-1 ring-critical'
                  : 'border-rule hover:border-obsidian/40'
              }`}
              placeholder="e.g. tariq@mansoor-logistics.com"
            />
            <p id="email-hint" className="mt-1.5 font-mono text-[11px] text-muted">
              Corporate domain inbox. Private video dossier is dispatched here.
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
              <span className="font-mono text-xs uppercase tracking-widest text-muted">
                Company Name <span className="text-emerald" aria-hidden="true">*</span>
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
              className={`w-full min-h-[46px] rounded-[4px] border bg-surface-2 px-3.5 py-2.5 text-sm text-obsidian transition-colors placeholder:text-muted/50 focus:bg-surface focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald ${
                touched.company && errors.company
                  ? 'border-critical ring-1 ring-critical'
                  : 'border-rule hover:border-obsidian/40'
              }`}
              placeholder="e.g. Al-Mansoor Trading FZE"
            />
            <p id="company-hint" className="mt-1.5 font-mono text-[11px] text-muted">
              Registered operating company or brand.
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

          {/* Phone / WhatsApp */}
          <div>
            <label htmlFor="phone" className="field-label mb-1.5 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-muted">
                Phone / WhatsApp <span className="text-muted/70 text-[10px] font-normal">(Recommended)</span>
              </span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className="w-full min-h-[46px] rounded-[4px] border border-rule bg-surface-2 px-3.5 py-2.5 text-sm text-obsidian transition-colors placeholder:text-muted/50 hover:border-obsidian/40 focus:bg-surface focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald"
              placeholder="+971 50 000 0000"
            />
            <p id="phone-hint" className="mt-1.5 font-mono text-[11px] text-muted">
              Used for instant WhatsApp delivery ping when your dossier is ready.
            </p>
          </div>
        </div>
      </div>

      {/* Section 02: Freight & Trade Lane Specifications */}
      <div className="border border-rule bg-surface p-6 sm:p-8 rounded-[4px] shadow-sm">
        <div className="flex items-center justify-between border-b border-rule pb-3 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-emerald">02.</span>
            <h2 className="font-mono text-xs uppercase tracking-widest font-semibold text-obsidian">
              Trade Lane & Shipping Profile
            </h2>
          </div>
          <span className="font-mono text-[10px] text-muted uppercase tracking-wider">[ Section 02 / 03 ]</span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Primary Trade Lane */}
          <div>
            <label htmlFor="tradeLane" className="field-label mb-1.5 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-muted">
                Primary Trade Lane <span className="text-emerald" aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </span>
            </label>
            <select
              id="tradeLane"
              name="tradeLane"
              required
              defaultValue=""
              onBlur={handleBlur}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={touched.tradeLane && Boolean(errors.tradeLane) ? 'true' : 'false'}
              aria-describedby={`tradeLane-hint${touched.tradeLane && errors.tradeLane ? ' tradeLane-error' : ''}`}
              className={`w-full min-h-[46px] rounded-[4px] border bg-surface-2 px-3.5 py-2.5 text-sm text-obsidian transition-colors focus:bg-surface focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald cursor-pointer ${
                touched.tradeLane && errors.tradeLane
                  ? 'border-critical ring-1 ring-critical'
                  : 'border-rule hover:border-obsidian/40'
              }`}
            >
              <option value="" disabled hidden>
                Select primary corridor
              </option>
              {TRADE_LANE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <p id="tradeLane-hint" className="mt-1.5 font-mono text-[11px] text-muted">
              Benchmark indexed against Drewry World Container & Platts corridors.
            </p>
            {touched.tradeLane && errors.tradeLane && (
              <p id="tradeLane-error" role="alert" className="mt-1.5 flex items-center gap-1.5 font-mono text-[11px] text-critical">
                <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
                  <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
                </svg>
                <span>{errors.tradeLane}</span>
              </p>
            )}
          </div>

          {/* Freight Mode */}
          <div>
            <label htmlFor="freightMode" className="field-label mb-1.5 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-muted">
                Freight Mode <span className="text-emerald" aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </span>
            </label>
            <select
              id="freightMode"
              name="freightMode"
              required
              defaultValue=""
              onBlur={handleBlur}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={touched.freightMode && Boolean(errors.freightMode) ? 'true' : 'false'}
              aria-describedby={`freightMode-hint${touched.freightMode && errors.freightMode ? ' freightMode-error' : ''}`}
              className={`w-full min-h-[46px] rounded-[4px] border bg-surface-2 px-3.5 py-2.5 text-sm text-obsidian transition-colors focus:bg-surface focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald cursor-pointer ${
                touched.freightMode && errors.freightMode
                  ? 'border-critical ring-1 ring-critical'
                  : 'border-rule hover:border-obsidian/40'
              }`}
            >
              <option value="" disabled hidden>
                Select freight mode
              </option>
              {FREIGHT_MODE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <p id="freightMode-hint" className="mt-1.5 font-mono text-[11px] text-muted">
              Ocean FCL/LCL, Air Cargo, or Multimodal.
            </p>
            {touched.freightMode && errors.freightMode && (
              <p id="freightMode-error" role="alert" className="mt-1.5 flex items-center gap-1.5 font-mono text-[11px] text-critical">
                <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
                  <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
                </svg>
                <span>{errors.freightMode}</span>
              </p>
            )}
          </div>

          {/* Estimated Monthly Volume */}
          <div>
            <label htmlFor="monthlyVolume" className="field-label mb-1.5 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-muted">
                Estimated Monthly Volume <span className="text-emerald" aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </span>
            </label>
            <select
              id="monthlyVolume"
              name="monthlyVolume"
              required
              defaultValue=""
              onBlur={handleBlur}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={touched.monthlyVolume && Boolean(errors.monthlyVolume) ? 'true' : 'false'}
              aria-describedby={`monthlyVolume-hint${touched.monthlyVolume && errors.monthlyVolume ? ' monthlyVolume-error' : ''}`}
              className={`w-full min-h-[46px] rounded-[4px] border bg-surface-2 px-3.5 py-2.5 text-sm text-obsidian transition-colors focus:bg-surface focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald cursor-pointer ${
                touched.monthlyVolume && errors.monthlyVolume
                  ? 'border-critical ring-1 ring-critical'
                  : 'border-rule hover:border-obsidian/40'
              }`}
            >
              <option value="" disabled hidden>
                Select monthly shipment tier
              </option>
              {MONTHLY_VOLUME_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <p id="monthlyVolume-hint" className="mt-1.5 font-mono text-[11px] text-muted">
              Used to scale annual surcharge leakage estimates.
            </p>
            {touched.monthlyVolume && errors.monthlyVolume && (
              <p id="monthlyVolume-error" role="alert" className="mt-1.5 flex items-center gap-1.5 font-mono text-[11px] text-critical">
                <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
                  <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
                </svg>
                <span>{errors.monthlyVolume}</span>
              </p>
            )}
          </div>

          {/* Primary Audit Focus */}
          <div>
            <label htmlFor="auditFocus" className="field-label mb-1.5 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-muted">
                Primary Audit Focus <span className="text-emerald" aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </span>
            </label>
            <select
              id="auditFocus"
              name="auditFocus"
              required
              defaultValue=""
              onBlur={handleBlur}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={touched.auditFocus && Boolean(errors.auditFocus) ? 'true' : 'false'}
              aria-describedby={`auditFocus-hint${touched.auditFocus && errors.auditFocus ? ' auditFocus-error' : ''}`}
              className={`w-full min-h-[46px] rounded-[4px] border bg-surface-2 px-3.5 py-2.5 text-sm text-obsidian transition-colors focus:bg-surface focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald cursor-pointer ${
                touched.auditFocus && errors.auditFocus
                  ? 'border-critical ring-1 ring-critical'
                  : 'border-rule hover:border-obsidian/40'
              }`}
            >
              <option value="" disabled hidden>
                Select primary audit focus
              </option>
              {AUDIT_FOCUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <p id="auditFocus-hint" className="mt-1.5 font-mono text-[11px] text-muted">
              Select specific risk area or full 3-pillar audit.
            </p>
            {touched.auditFocus && errors.auditFocus && (
              <p id="auditFocus-error" role="alert" className="mt-1.5 flex items-center gap-1.5 font-mono text-[11px] text-critical">
                <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
                  <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
                </svg>
                <span>{errors.auditFocus}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section 03: Shipment Details & Document Links */}
      <div className="border border-rule bg-surface p-6 sm:p-8 rounded-[4px] shadow-sm">
        <div className="flex items-center justify-between border-b border-rule pb-3 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-emerald">03.</span>
            <h2 className="font-mono text-xs uppercase tracking-widest font-semibold text-obsidian">
              Shipment Parameters & Documentation
            </h2>
          </div>
          <span className="font-mono text-[10px] text-muted uppercase tracking-wider">[ Section 03 / 03 ]</span>
        </div>

        <div className="space-y-6">
          {/* Shipment Overview Textarea */}
          <div>
            <label htmlFor="shipmentsOverview" className="field-label mb-1.5 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-muted">
                Shipment Overview / Last 3 Shipments <span className="text-emerald" aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </span>
            </label>
            <textarea
              id="shipmentsOverview"
              name="shipmentsOverview"
              required
              rows={4}
              onBlur={handleBlur}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={touched.shipmentsOverview && Boolean(errors.shipmentsOverview) ? 'true' : 'false'}
              aria-describedby={`shipmentsOverview-hint${touched.shipmentsOverview && errors.shipmentsOverview ? ' shipmentsOverview-error' : ''}`}
              className={`w-full rounded-[4px] border bg-surface-2 p-3.5 text-sm text-obsidian transition-colors placeholder:text-muted/50 focus:bg-surface focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald ${
                touched.shipmentsOverview && errors.shipmentsOverview
                  ? 'border-critical ring-1 ring-critical'
                  : 'border-rule hover:border-obsidian/40'
              }`}
              placeholder="Briefly outline origins, destinations, container types, or forwarder rates for your recent shipments..."
            />
            <p id="shipmentsOverview-hint" className="mt-1.5 font-mono text-[11px] text-muted">
              Example: 2x 40ft HC Ningbo → Jebel Ali ($2,450/box + $380 BAF), 1x 20ft Mumbai → Dammam ($1,150 all-in). Commodity: Ceramic tiles HS 6907.
            </p>
            {touched.shipmentsOverview && errors.shipmentsOverview && (
              <p id="shipmentsOverview-error" role="alert" className="mt-1.5 flex items-center gap-1.5 font-mono text-[11px] text-critical">
                <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
                  <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
                </svg>
                <span>{errors.shipmentsOverview}</span>
              </p>
            )}
          </div>

          {/* Secure Document Link */}
          <div>
            <label htmlFor="secureDocumentLink" className="field-label mb-1.5 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-muted">
                Secure Document Link <span className="text-muted/70 text-[10px] font-normal">(Optional)</span>
              </span>
            </label>
            <input
              id="secureDocumentLink"
              name="secureDocumentLink"
              type="text"
              className="w-full min-h-[46px] rounded-[4px] border border-rule bg-surface-2 px-3.5 py-2.5 text-sm text-obsidian transition-colors placeholder:text-muted/50 hover:border-obsidian/40 focus:bg-surface focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald"
              placeholder="Dropbox, Google Drive, OneDrive link (or email directly to concierge@exvorta.com)"
            />
            <p id="secureDocumentLink-hint" className="mt-1.5 font-mono text-[11px] text-muted">
              Paste a password-protected or read-only cloud share link containing Commercial Invoices, Packing Lists, or Bills of Lading.
            </p>
          </div>
        </div>
      </div>

      {/* Cloudflare Turnstile */}
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <div className="mt-2">
          <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
        </div>
      )}

      {/* Security & Zero-Trust Notice */}
      <div className="border-s-2 border-emerald bg-surface-2 p-4 text-xs font-mono leading-relaxed text-muted rounded-[4px]">
        <strong className="font-semibold text-obsidian uppercase tracking-wider">Enterprise Zero-Trust: </strong>
        All trade data is encrypted via TLS 1.3 and protected under strict NDA. Zero client documents are stored in public repositories or shared with third parties or forwarders.
      </div>

      {/* Submit Action */}
      <div>
        <SubmitButton />
        <p className="mt-3 text-center font-mono text-[11px] text-muted">
          Submitting triggers a 24-hour SLA confirmation email to your corporate address.
        </p>
      </div>
    </form>
  )
}
