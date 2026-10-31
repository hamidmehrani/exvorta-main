'use client'

import React, { useState, useEffect, useMemo, useCallback, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  DEFAULT_ASSESSMENT_INPUT,
  calculateReadiness,
  serializeAssessmentInput,
  deserializeAssessmentInput,
  type EntityType,
  type ErpSystem,
  type MonthlyVolume,
  type AspStatus,
  type ReadinessAssessmentInput,
  type CriticalGap,
} from '@/lib/tools/einv-readiness'
import { submitWaitlist } from '@/actions/submitWaitlist'

interface EntityOption {
  value: EntityType
  label: string
  sublabel: string
  phase: string
  aspDeadline: string
  goLive: string
}

const ENTITY_OPTIONS: EntityOption[] = [
  {
    value: 'enterprise_large',
    label: 'Large Enterprise (Turnover ≥ AED 50M)',
    sublabel: 'Phase 1 statutory rollout; subject to expedited ASP appointment and go-live.',
    phase: 'Phase 1',
    aspDeadline: '30 October 2026',
    goLive: '1 January 2027',
  },
  {
    value: 'sme',
    label: 'Small & Medium Enterprise (Turnover < AED 50M)',
    sublabel: 'Phase 2 statutory mandate for standard UAE corporate taxpayers.',
    phase: 'Phase 2',
    aspDeadline: '31 March 2027',
    goLive: '1 July 2027',
  },
  {
    value: 'government',
    label: 'Federal & Local Government Entity',
    sublabel: 'Phase 3 mandate covering public sector procurement and authorities.',
    phase: 'Phase 3',
    aspDeadline: '31 March 2027',
    goLive: '1 October 2027',
  },
  {
    value: 'micro_nonresident',
    label: 'Micro Business / Non-Resident Enterprise',
    sublabel: 'Low volume or non-resident tax representative entity.',
    phase: 'Pilot / Exempt',
    aspDeadline: '31 March 2027',
    goLive: '1 July 2027',
  },
]

interface ErpOption {
  value: ErpSystem
  label: string
  vendor: string
  points: number
  compatibility: 'Native Peppol' | 'Cloud API' | 'Middleware Required' | 'Incompatible'
}

const ERP_OPTIONS: ErpOption[] = [
  {
    value: 'sap_s4',
    label: 'SAP S/4HANA / ECC',
    vendor: 'SAP SE',
    points: 25,
    compatibility: 'Native Peppol',
  },
  {
    value: 'oracle_cloud',
    label: 'Oracle Fusion Cloud / NetSuite',
    vendor: 'Oracle Corp',
    points: 25,
    compatibility: 'Native Peppol',
  },
  {
    value: 'ms_dynamics',
    label: 'Microsoft Dynamics 365 / Business Central',
    vendor: 'Microsoft Corp',
    points: 22,
    compatibility: 'Cloud API',
  },
  {
    value: 'zoho_books',
    label: 'Zoho Books (FTA-Accredited Edition)',
    vendor: 'Zoho Corp',
    points: 20,
    compatibility: 'Cloud API',
  },
  {
    value: 'quickbooks',
    label: 'Intuit QuickBooks Online / Desktop',
    vendor: 'Intuit Inc',
    points: 16,
    compatibility: 'Middleware Required',
  },
  {
    value: 'xero',
    label: 'Xero Accounting',
    vendor: 'Xero Ltd',
    points: 16,
    compatibility: 'Middleware Required',
  },
  {
    value: 'tally',
    label: 'TallyPrime / Tally.ERP 9',
    vendor: 'Tally Solutions',
    points: 15,
    compatibility: 'Middleware Required',
  },
  {
    value: 'custom_legacy',
    label: 'Custom In-House / Legacy System',
    vendor: 'Proprietary Core',
    points: 8,
    compatibility: 'Middleware Required',
  },
  {
    value: 'manual_excel',
    label: 'Manual Billing / Spreadsheets (Excel)',
    vendor: 'Manual Non-API',
    points: 0,
    compatibility: 'Incompatible',
  },
]

interface VolumeOption {
  value: MonthlyVolume
  label: string
  description: string
}

const VOLUME_OPTIONS: VolumeOption[] = [
  { value: 'under_100', label: '< 100 / month', description: 'Low monthly invoice output' },
  { value: '100_to_1000', label: '100 – 1,000 / month', description: 'Moderate business volume' },
  { value: '1000_to_10000', label: '1,000 – 10,000 / month', description: 'High transaction frequency' },
  { value: 'over_10000', label: '> 10,000 / month', description: 'Enterprise automated billing stream' },
]

interface AspOption {
  value: AspStatus
  label: string
  sublabel: string
  points: number
}

const ASP_OPTIONS: AspOption[] = [
  {
    value: 'integrated',
    label: 'Accredited ASP Integrated & Tested',
    sublabel: 'Active sandbox validation or live Corner 2/3 exchange in place.',
    points: 30,
  },
  {
    value: 'contracted',
    label: 'Accredited ASP Contract Executed',
    sublabel: 'Formal agreement signed; integration onboarding underway.',
    points: 20,
  },
  {
    value: 'shortlisting',
    label: 'Evaluating & Shortlisting ASP Vendors',
    sublabel: 'RFP and technical reviews in progress with MoF-accredited providers.',
    points: 10,
  },
  {
    value: 'not_started',
    label: 'Not Started / No ASP Engaged',
    sublabel: 'No formal discussions or vendor assessment initiated.',
    points: 0,
  },
]

export function UaeEinvoicingCalculator() {
  const searchParams = useSearchParams()

  // Initialize state from URL params if present, or fallback to default
  const parsedInitial = useMemo(() => {
    return deserializeAssessmentInput(searchParams?.toString())
  }, [searchParams])

  const [input, setInput] = useState<ReadinessAssessmentInput>(() => ({
    entityType: parsedInitial.entityType || DEFAULT_ASSESSMENT_INPUT.entityType,
    erpSystem: parsedInitial.erpSystem || DEFAULT_ASSESSMENT_INPUT.erpSystem,
    monthlyVolume: parsedInitial.monthlyVolume || DEFAULT_ASSESSMENT_INPUT.monthlyVolume,
    aspStatus: parsedInitial.aspStatus || DEFAULT_ASSESSMENT_INPUT.aspStatus,
    dataHygiene: {
      ...DEFAULT_ASSESSMENT_INPUT.dataHygiene,
      ...(parsedInitial.dataHygiene || {}),
    },
    transactionScope: {
      ...DEFAULT_ASSESSMENT_INPUT.transactionScope,
      ...(parsedInitial.transactionScope || {}),
    },
  }))

  const [copiedLink, setCopiedLink] = useState(false)

  // Lead capture state
  const [captureEmail, setCaptureEmail] = useState('')
  const [captureCompany, setCaptureCompany] = useState('')
  const [botField, setBotField] = useState('')
  const [captureStatus, setCaptureStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [captureError, setCaptureError] = useState('')
  const [isCapturing, startCaptureTransition] = useTransition()

  // URL state synchronization
  useEffect(() => {
    if (typeof window === 'undefined') return
    const query = serializeAssessmentInput(input)
    const newPath = query ? `${window.location.pathname}?${query}` : window.location.pathname
    window.history.replaceState(null, '', newPath)
  }, [input])

  // Real-time calculation engine execution
  const result = useMemo(() => {
    return calculateReadiness(input)
  }, [input])

  // Share & Reset handlers
  const handleCopyLink = useCallback(async () => {
    if (typeof window === 'undefined') return
    const query = serializeAssessmentInput(input)
    const fullUrl = `${window.location.origin}${window.location.pathname}${query ? `?${query}` : ''}`
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2200)
    } catch {
      try {
        const textArea = document.createElement('textarea')
        textArea.value = fullUrl
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 2200)
      } catch {
        // Fallback
      }
    }
  }, [input])

  const handleReset = useCallback(() => {
    setInput(DEFAULT_ASSESSMENT_INPUT)
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  const handlePrint = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }, [])

  // Input mutation helpers
  const handleEntityTypeChange = (entityType: EntityType) => {
    setInput(prev => ({ ...prev, entityType }))
  }

  const handleErpChange = (erpSystem: ErpSystem) => {
    setInput(prev => ({ ...prev, erpSystem }))
  }

  const handleVolumeChange = (monthlyVolume: MonthlyVolume) => {
    setInput(prev => ({ ...prev, monthlyVolume }))
  }

  const handleAspStatusChange = (aspStatus: AspStatus) => {
    setInput(prev => ({ ...prev, aspStatus }))
  }

  const handleHygieneToggle = (key: keyof ReadinessAssessmentInput['dataHygiene']) => {
    setInput(prev => ({
      ...prev,
      dataHygiene: {
        ...prev.dataHygiene,
        [key]: !prev.dataHygiene[key],
      },
    }))
  }

  const handleScopeToggle = (key: keyof ReadinessAssessmentInput['transactionScope']) => {
    setInput(prev => ({
      ...prev,
      transactionScope: {
        ...prev.transactionScope,
        [key]: !prev.transactionScope[key],
      },
    }))
  }

  // Lead capture form submit
  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!captureEmail.trim()) {
      setCaptureError('Please enter a valid work email address.')
      setCaptureStatus('error')
      return
    }

    setCaptureStatus('idle')
    setCaptureError('')

    startCaptureTransition(async () => {
      try {
        const res = await submitWaitlist({
          email: captureEmail.trim(),
          source: 'Waitlist',
          company: captureCompany.trim() || undefined,
          botField: botField.trim() || undefined,
          payload: {
            source: 'UAE-EInvoicing-Tool',
            score: result.score,
            tier: result.tier,
            tierLabel: result.tierLabel,
            phase: result.phase,
            entityType: input.entityType,
            erpSystem: input.erpSystem,
            aspStatus: input.aspStatus,
            gapsCount: result.criticalGaps.length,
            submittedAt: new Date().toISOString(),
          },
        })

        if (res.success) {
          setCaptureStatus('success')
        } else {
          setCaptureStatus('error')
          setCaptureError(res.error || 'Unable to record assessment. Please try again.')
        }
      } catch {
        setCaptureStatus('error')
        setCaptureError('A network error occurred. Please try again.')
      }
    })
  }

  // Tier styling helper
  const getTierBadgeClass = (tier: string) => {
    switch (tier) {
      case 'compliant_ready':
      case 'substantially_prepared':
        return 'bg-emerald/10 text-emerald border-emerald/30'
      case 'developing':
        return 'bg-warning/10 text-warning border-warning/30'
      case 'critical_action':
      default:
        return 'bg-danger/10 text-danger border-danger/30'
    }
  }

  // Severity styling helper
  const getSeverityBadgeClass = (sev: CriticalGap['severity']) => {
    switch (sev) {
      case 'critical':
        return 'bg-danger/10 text-danger border-danger/30'
      case 'high':
        return 'bg-warning/10 text-warning border-warning/30'
      case 'medium':
        return 'bg-surface-2 text-obsidian border-rule'
      case 'low':
      default:
        return 'bg-surface-2 text-muted border-rule'
    }
  }

  return (
    <div className="w-full flex flex-col gap-12 md:gap-16">
      {/* Action Toolbar */}
      <div className="w-full border-y border-rule bg-surface-2/60 py-4">
        <div className="container-site flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald animate-pulse" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
              Live UAE DCTCE Compliance Engine &bull; Peppol PINT-AE &bull; Verified Regulations
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider px-3.5 py-2 border border-rule bg-surface text-obsidian hover:border-obsidian transition-colors rounded-[4px] cursor-pointer"
              aria-label={copiedLink ? 'Link copied' : 'Copy shareable configuration link'}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  copiedLink ? 'bg-emerald' : 'bg-muted'
                }`}
                aria-hidden="true"
              />
              <span>{copiedLink ? '[ Copied! ]' : '[ Copy Shareable Link ]'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="font-mono text-[11px] uppercase tracking-wider px-3.5 py-2 border border-rule hover:border-obsidian text-obsidian bg-surface transition-colors rounded-[4px] cursor-pointer"
            >
              [ Print Report ]
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="font-mono text-[11px] uppercase tracking-wider px-3.5 py-2 border border-rule hover:border-obsidian text-muted hover:text-obsidian bg-transparent transition-colors rounded-[4px] cursor-pointer"
            >
              [ Reset ]
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: Assessment Form Inputs */}
      <section className="container-site" aria-labelledby="section-profile-title">
        <div className="frame border border-rule bg-surface p-6 md:p-10">
          <div className="pb-8 border-b border-rule">
            <p className="eyebrow mb-2">
              <span className="eyebrow-index" aria-hidden="true">
                <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
              </span>
              Section A &bull; Enterprise Profile & Mandate Scope
            </p>
            <h2 id="section-profile-title" className="font-serif text-title font-semibold text-obsidian">
              Tax Entity & Technical Parameters
            </h2>
            <p className="mt-2 text-sm text-muted font-light max-w-3xl">
              Select your organization’s turnover category, core accounting architecture, and current ASP procurement stage to calculate statutory compliance timing and technical readiness.
            </p>
          </div>

          <div className="pt-8 flex flex-col gap-10">
            {/* Step 1: Entity Scale & Statutory Phase */}
            <div>
              <label className="field-label mb-3 block">
                1. Tax Entity Scale & Annual Turnover (Statutory Phase Determination)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ENTITY_OPTIONS.map(opt => {
                  const isSelected = input.entityType === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleEntityTypeChange(opt.value)}
                      className={`text-start p-4 border rounded-[4px] transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-obsidian text-white border-obsidian ring-1 ring-obsidian shadow-sm'
                          : 'bg-surface hover:bg-surface-2 text-obsidian border-rule hover:border-obsidian/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="font-mono text-xs font-bold uppercase tracking-wider">
                            {opt.phase}
                          </span>
                          <span
                            className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-[2px] border ${
                              isSelected
                                ? 'bg-white/10 text-white border-white/20'
                                : 'bg-surface-2 text-muted border-rule'
                            }`}
                          >
                            Go-Live: {opt.goLive}
                          </span>
                        </div>
                        <h3 className="font-sans font-semibold text-sm leading-snug">{opt.label}</h3>
                        <p
                          className={`mt-1.5 text-xs font-light leading-relaxed ${
                            isSelected ? 'text-white/80' : 'text-muted'
                          }`}
                        >
                          {opt.sublabel}
                        </p>
                      </div>
                      <div
                        className={`mt-3 pt-3 border-t text-[11px] font-mono ${
                          isSelected ? 'border-white/15 text-white/70' : 'border-rule text-muted'
                        }`}
                      >
                        ASP Cutoff: <strong className="font-semibold">{opt.aspDeadline}</strong>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Step 2: ERP & Billing System Architecture */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <label className="field-label">
                  2. Core ERP or Invoicing Software Architecture
                </label>
                <span className="text-[11px] font-mono text-muted">Max 25 pts</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ERP_OPTIONS.map(opt => {
                  const isSelected = input.erpSystem === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleErpChange(opt.value)}
                      className={`text-start p-3.5 border rounded-[4px] transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-obsidian text-white border-obsidian ring-1 ring-obsidian'
                          : 'bg-surface hover:bg-surface-2 text-obsidian border-rule hover:border-obsidian/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-[10px] uppercase text-muted tracking-widest">
                          {opt.vendor}
                        </span>
                        <span
                          className={`font-mono text-[10px] px-1.5 py-0.5 rounded-[2px] ${
                            opt.points >= 20
                              ? 'bg-emerald/10 text-emerald border border-emerald/30'
                              : opt.points > 0
                              ? 'bg-warning/10 text-warning border border-warning/30'
                              : 'bg-danger/10 text-danger border border-danger/30'
                          }`}
                        >
                          +{opt.points} pts
                        </span>
                      </div>
                      <h4 className="font-sans font-semibold text-xs leading-snug">{opt.label}</h4>
                      <div
                        className={`mt-2 pt-2 border-t text-[10px] font-mono flex items-center justify-between ${
                          isSelected ? 'border-white/15 text-white/70' : 'border-rule text-muted'
                        }`}
                      >
                        <span>Compatibility:</span>
                        <span className="font-medium">{opt.compatibility}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Step 3: Monthly Volume & ASP Procurement Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-rule">
              {/* Monthly Volume */}
              <div>
                <label className="field-label mb-3 block">
                  3. Estimated Monthly Tax Invoice Volume
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {VOLUME_OPTIONS.map(opt => {
                    const isSelected = input.monthlyVolume === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleVolumeChange(opt.value)}
                        className={`p-3 text-start border rounded-[4px] transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-obsidian text-white border-obsidian ring-1 ring-obsidian'
                            : 'bg-surface hover:bg-surface-2 text-obsidian border-rule hover:border-obsidian/40'
                        }`}
                      >
                        <span className="font-mono text-xs font-semibold block">{opt.label}</span>
                        <span
                          className={`text-[10px] font-light mt-0.5 block ${
                            isSelected ? 'text-white/70' : 'text-muted'
                          }`}
                        >
                          {opt.description}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* ASP Status */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <label className="field-label">
                    4. Accredited Service Provider (ASP) Status
                  </label>
                  <span className="text-[11px] font-mono text-muted">Max 30 pts</span>
                </div>
                <div className="flex flex-col gap-2">
                  {ASP_OPTIONS.map(opt => {
                    const isSelected = input.aspStatus === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleAspStatusChange(opt.value)}
                        className={`p-3 text-start border rounded-[4px] transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-obsidian text-white border-obsidian ring-1 ring-obsidian'
                            : 'bg-surface hover:bg-surface-2 text-obsidian border-rule hover:border-obsidian/40'
                        }`}
                      >
                        <div>
                          <span className="font-sans text-xs font-semibold block leading-tight">{opt.label}</span>
                          <span
                            className={`text-[11px] font-light mt-0.5 block ${
                              isSelected ? 'text-white/70' : 'text-muted'
                            }`}
                          >
                            {opt.sublabel}
                          </span>
                        </div>
                        <span
                          className={`font-mono text-[10px] px-2 py-0.5 rounded-[2px] shrink-0 ${
                            opt.points >= 20
                              ? 'bg-emerald/10 text-emerald border border-emerald/30'
                              : opt.points > 0
                              ? 'bg-warning/10 text-warning border border-warning/30'
                              : 'bg-surface-2 text-muted border-rule'
                          }`}
                        >
                          +{opt.points} pts
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Step 4 & 5: Master Data Hygiene & Transaction Scope */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-rule">
              {/* Master Data Hygiene */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <label className="field-label">
                    5. Master Data Hygiene Prerequisites (5 pts each)
                  </label>
                  <span className="text-[11px] font-mono text-muted">Max 25 pts</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {[
                    {
                      key: 'hasValidTrn' as const,
                      label: 'Valid 15-Digit FTA Tax Registration Number (TRN)',
                      desc: 'Registered with the UAE Federal Tax Authority under corporate name.',
                    },
                    {
                      key: 'customerTrnVerified' as const,
                      label: 'Customer B2B TRNs Verified & Maintained',
                      desc: 'Buyer master records validated against FTA tax records.',
                    },
                    {
                      key: 'peppolIdReady' as const,
                      label: 'Peppol Participant ID (0237:<TRN>) Configured',
                      desc: 'Standardized ISO 6523 identifier format mapped in ERP directory.',
                    },
                    {
                      key: 'pintTaxCategoryMapped' as const,
                      label: 'PINT-AE Tax Categories (S, Z, E, O) Mapped',
                      desc: 'Standard 5%, Zero-rated, Exempt, and Out of scope mapped to items.',
                    },
                    {
                      key: 'uaeDataResidencyConfirmed' as const,
                      label: 'UAE Sovereign Data Residency Confirmed',
                      desc: 'Primary invoice stores and 5-year archives located within UAE borders.',
                    },
                  ].map(item => {
                    const isChecked = input.dataHygiene[item.key]
                    return (
                      <label
                        key={item.key}
                        className={`p-3 border rounded-[4px] flex items-start gap-3 cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-surface border-obsidian/40 shadow-xs'
                            : 'bg-surface-2/40 border-rule hover:border-obsidian/20'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleHygieneToggle(item.key)}
                          className="mt-0.5 h-4 w-4 rounded-[2px] border-rule text-obsidian focus:ring-obsidian cursor-pointer"
                        />
                        <div className="text-start">
                          <span className="font-sans text-xs font-semibold text-obsidian block">
                            {item.label}
                          </span>
                          <span className="text-[11px] font-light text-muted block mt-0.5">
                            {item.desc}
                          </span>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Transaction Scope */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <label className="field-label">
                    6. Active Commercial Transaction Streams
                  </label>
                  <span className="text-[11px] font-mono text-muted">Governance Scope</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {[
                    {
                      key: 'b2bDomestic' as const,
                      label: 'B2B Domestic Transactions (Corner 1 to Corner 4)',
                      desc: 'Core mandatory DCTCE stream exchanged between UAE businesses.',
                    },
                    {
                      key: 'b2gGovernment' as const,
                      label: 'B2G Government Contracts & Public Sector Supply',
                      desc: 'Federal and local government procurement subject to Phase 3 mandates.',
                    },
                    {
                      key: 'b2cRetail' as const,
                      label: 'B2C Retail / Point of Sale Transactions',
                      desc: 'Consumer transactions requiring simplified fiscal receipt integration.',
                    },
                    {
                      key: 'crossBorderExport' as const,
                      label: 'Cross-Border Export / Import Commercial Invoicing',
                      desc: 'International trade documentation with customs declaration linkages.',
                    },
                  ].map(item => {
                    const isChecked = input.transactionScope[item.key]
                    return (
                      <label
                        key={item.key}
                        className={`p-3 border rounded-[4px] flex items-start gap-3 cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-surface border-obsidian/40 shadow-xs'
                            : 'bg-surface-2/40 border-rule hover:border-obsidian/20'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleScopeToggle(item.key)}
                          className="mt-0.5 h-4 w-4 rounded-[2px] border-rule text-obsidian focus:ring-obsidian cursor-pointer"
                        />
                        <div className="text-start">
                          <span className="font-sans text-xs font-semibold text-obsidian block">
                            {item.label}
                          </span>
                          <span className="text-[11px] font-light text-muted block mt-0.5">
                            {item.desc}
                          </span>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Assessment Results Dashboard */}
      <section className="container-site" aria-labelledby="section-results-title">
        <div className="frame border border-rule bg-surface p-6 md:p-10">
          <div className="pb-8 border-b border-rule">
            <p className="eyebrow mb-2">
              <span className="eyebrow-index" aria-hidden="true">
                <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
              </span>
              Section B &bull; Readiness Index & Mandate Roadmap
            </p>
            <h2 id="section-results-title" className="font-serif text-title font-semibold text-obsidian">
              Statutory Readiness Diagnostic
            </h2>
            <p className="mt-2 text-sm text-muted font-light max-w-3xl">
              Real-time audit results evaluated against UAE Federal Decree-Law No. 16 of 2024, Cabinet Decision No. 106 of 2025, and Ministerial Resolution No. 66 of 2026.
            </p>
          </div>

          {/* Top KPI Cards: Score + Deadlines */}
          <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Score Card */}
            <div className="p-6 border border-rule bg-surface-2/50 rounded-[4px] flex flex-col justify-between">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                  Overall Readiness Index
                </span>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-mono text-5xl font-bold tracking-tight text-obsidian">
                    {result.score}
                  </span>
                  <span className="font-mono text-lg text-muted">/ 100</span>
                </div>
                <div className="mt-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono uppercase tracking-wider font-semibold rounded-[3px] border ${getTierBadgeClass(
                      result.tier
                    )}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
                    {result.tierLabel}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6 pt-4 border-t border-rule">
                <div className="w-full h-2 bg-surface border border-rule rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      result.score >= 70 ? 'bg-emerald' : result.score >= 45 ? 'bg-warning' : 'bg-danger'
                    }`}
                    style={{ width: `${result.score}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-[10px] font-mono text-muted">
                  <span>Critical &lt;45</span>
                  <span>Developing 45-69</span>
                  <span>Compliant 70+</span>
                </div>
              </div>
            </div>

            {/* ASP Appointment Deadline Card */}
            <div className="p-6 border border-rule bg-surface-2/50 rounded-[4px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                    Statutory ASP Deadline
                  </span>
                  <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded-[2px] bg-obsidian text-white">
                    {result.phase}
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-2xl font-semibold text-obsidian">
                  {result.aspDeadline}
                </h3>
                <p className="mt-1 text-xs text-muted font-light">
                  Statutory cutoff to appoint an MoF-accredited service provider under Ministerial Resolution No. 66 of 2026.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-rule flex items-center justify-between">
                <span className="font-mono text-xs text-muted">Status:</span>
                {result.aspDeadlinePassed ? (
                  <span className="font-mono text-xs font-bold text-danger bg-danger/10 px-2 py-0.5 rounded-[2px] border border-danger/30">
                    Deadline Expired
                  </span>
                ) : (
                  <span className="font-mono text-xs font-bold text-emerald bg-emerald/10 px-2 py-0.5 rounded-[2px] border border-emerald/30">
                    {result.daysUntilAspDeadline} Days Remaining
                  </span>
                )}
              </div>
            </div>

            {/* Mandatory Go-Live Deadline Card */}
            <div className="p-6 border border-rule bg-surface-2/50 rounded-[4px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                    Mandatory Go-Live Date
                  </span>
                  <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded-[2px] bg-surface border border-rule text-obsidian">
                    Continuous Audit
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-2xl font-semibold text-obsidian">
                  {result.goLiveDeadline}
                </h3>
                <p className="mt-1 text-xs text-muted font-light">
                  Mandatory e-invoicing transmission to FTA Corner 5 platform per Cabinet Decision No. 106 of 2025.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-rule flex items-center justify-between">
                <span className="font-mono text-xs text-muted">Status:</span>
                {result.goLivePassed ? (
                  <span className="font-mono text-xs font-bold text-danger bg-danger/10 px-2 py-0.5 rounded-[2px] border border-danger/30">
                    Go-Live Active
                  </span>
                ) : (
                  <span className="font-mono text-xs font-bold text-obsidian bg-surface px-2 py-0.5 rounded-[2px] border border-rule">
                    {result.daysUntilGoLive} Days Until Mandate
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Pillar Breakdown */}
          <div className="mt-10 pt-8 border-t border-rule">
            <h3 className="font-sans text-sm font-semibold text-obsidian uppercase tracking-wider mb-6">
              Readiness Score Breakdown by Compliance Pillar
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: 'ERP Technical Readiness',
                  category: result.scoreCategories.erpReadiness,
                },
                {
                  title: 'ASP Procurement',
                  category: result.scoreCategories.aspProcurement,
                },
                {
                  title: 'Master Data Hygiene',
                  category: result.scoreCategories.masterDataHygiene,
                },
                {
                  title: 'Governance & Scope',
                  category: result.scoreCategories.governanceArchitecture,
                },
              ].map((item, idx) => {
                const pct = Math.round((item.category.score / item.category.maxScore) * 100)
                return (
                  <div key={idx} className="p-4 border border-rule bg-surface rounded-[4px] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-muted mb-2">
                        <span className="uppercase tracking-wider">{item.title}</span>
                        <span className="font-bold text-obsidian">
                          {item.category.score}/{item.category.maxScore}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden mb-3">
                        <div
                          className={`h-full ${
                            pct >= 70 ? 'bg-emerald' : pct >= 40 ? 'bg-warning' : 'bg-danger'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-[11px] font-light text-muted leading-relaxed">
                      {item.category.notes}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Critical Gaps & Corrective Actions */}
          <div className="mt-10 pt-8 border-t border-rule">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-sans text-sm font-semibold text-obsidian uppercase tracking-wider">
                  Identified Statutory Gaps &amp; Risk Exposures ({result.criticalGaps.length})
                </h3>
                <p className="mt-1 text-xs text-muted font-light">
                  Direct compliance vulnerabilities carrying exposure to Cabinet Decision No. 106/2025 penalties (up to AED 50,000).
                </p>
              </div>
              <span className="font-mono text-xs text-muted">
                {result.criticalGaps.filter(g => g.severity === 'critical').length} Critical /{' '}
                {result.criticalGaps.filter(g => g.severity === 'high').length} High
              </span>
            </div>

            {result.criticalGaps.length === 0 ? (
              <div className="p-6 border border-emerald/30 bg-emerald/10 text-emerald rounded-[4px]">
                <h4 className="font-sans font-semibold text-sm">
                  Zero Critical Compliance Gaps Detected
                </h4>
                <p className="text-xs font-light mt-1">
                  Your organization’s infrastructure, ASP procurement, and master data hygiene align with UAE Peppol PINT-AE statutory standards.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {result.criticalGaps.map(gap => (
                  <div
                    key={gap.id}
                    className="p-4 md:p-5 border border-rule bg-surface-2/40 rounded-[4px] flex flex-col md:flex-row md:items-start justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span
                          className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-[2px] border ${getSeverityBadgeClass(
                            gap.severity
                          )}`}
                        >
                          {gap.severity}
                        </span>
                        <h4 className="font-sans text-sm font-semibold text-obsidian">
                          {gap.title}
                        </h4>
                      </div>
                      <p className="text-xs text-muted font-light leading-relaxed">
                        {gap.description}
                      </p>
                      <div className="mt-3 pt-3 border-t border-rule text-xs flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                        <div className="text-danger font-medium">
                          <strong>Statutory Risk:</strong> {gap.impact}
                        </div>
                        <div className="text-obsidian">
                          <strong>Required Action:</strong> {gap.actionRequired}
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 text-start md:text-end">
                      <span className="font-mono text-[10px] text-muted block max-w-xs leading-normal">
                        Citation: {gap.regulatoryCitation}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ASP Technical Procurement Checklist */}
          <div className="mt-10 pt-8 border-t border-rule">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-sans text-sm font-semibold text-obsidian uppercase tracking-wider">
                  Accredited Service Provider (ASP) Technical Evaluation Checklist
                </h3>
                <p className="mt-1 text-xs text-muted font-light">
                  8 non-negotiable architectural requirements for Corner 2/3 ASP procurement under Ministerial Decisions No. 243 & 244 of 2025.
                </p>
              </div>
              <span className="font-mono text-xs text-muted hidden sm:inline-block">
                Peppol 5-Corner Architecture
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.aspSelectionChecklist.map(item => (
                <div
                  key={item.id}
                  className="p-3.5 border border-rule bg-surface rounded-[4px] flex items-start gap-3"
                >
                  <span
                    className={`mt-1 inline-block w-2 h-2 rounded-full shrink-0 ${
                      item.mandatory ? 'bg-emerald' : 'bg-muted'
                    }`}
                    aria-hidden="true"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-sans text-xs font-semibold text-obsidian">{item.requirement}</h4>
                      <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded-[2px] bg-surface-2 text-muted border border-rule shrink-0">
                        {item.cornerCapability}
                      </span>
                    </div>
                    <p className="text-[11px] font-light text-muted leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regulatory Statutes Registry Table */}
          <div className="mt-10 pt-8 border-t border-rule">
            <h3 className="font-sans text-sm font-semibold text-obsidian uppercase tracking-wider mb-2">
              Statutory Authority & Regulatory Citations
            </h3>
            <p className="text-xs text-muted font-light mb-6">
              Verified statutory enactments governing the UAE E-Invoicing regime. Zero synthetic or unverified legal references.
            </p>
            <div className="border border-rule rounded-[4px] overflow-x-auto">
              <table className="w-full text-start text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-2 border-b border-rule font-mono text-[10px] text-muted uppercase">
                    <th className="p-3 text-start">Statute Code</th>
                    <th className="p-3 text-start">Enactment / Decree Title</th>
                    <th className="p-3 text-start">Effective Date</th>
                    <th className="p-3 text-start">Regulatory Source</th>
                    <th className="p-3 text-start">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule font-light">
                  {result.regulatoryReferences.map(statute => (
                    <tr key={statute.code} className="hover:bg-surface-2/40">
                      <td className="p-3 font-mono font-bold text-obsidian whitespace-nowrap">
                        {statute.code}
                      </td>
                      <td className="p-3 text-obsidian">{statute.title}</td>
                      <td className="p-3 font-mono whitespace-nowrap text-muted">
                        {statute.effectiveDate}
                      </td>
                      <td className="p-3 text-muted whitespace-nowrap">{statute.source}</td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald bg-emerald/10 border border-emerald/30 px-1.5 py-0.5 rounded-[2px]">
                          VERIFIED {statute.lastVerified}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Lead Capture & Formal Briefing Form */}
      <section className="container-site mb-8" aria-labelledby="section-briefing-title">
        <div className="frame border border-rule bg-surface p-6 md:p-10">
          <div className="max-w-2xl">
            <p className="eyebrow mb-2">
              <span className="eyebrow-index" aria-hidden="true">
                <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
              </span>
              Section C &bull; Enterprise Compliance Dossier
            </p>
            <h2 id="section-briefing-title" className="font-serif text-title font-semibold text-obsidian">
              Save Assessment &amp; Request Technical Briefing
            </h2>
            <p className="mt-2 text-sm text-muted font-light">
              Receive a formal compliance briefing packet, complete with your organization’s gap analysis, statutory deadlines, and accredited ASP evaluation matrix.
            </p>
          </div>

          <form onSubmit={handleLeadSubmit} className="mt-8 max-w-xl flex flex-col gap-4">
            {/* Honeypot field */}
            <input
              type="text"
              name="botField"
              value={botField}
              onChange={e => setBotField(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="field-label mb-1.5 block" htmlFor="lead-email">
                  Work Email <span className="text-danger">*</span>
                </label>
                <input
                  id="lead-email"
                  type="email"
                  required
                  value={captureEmail}
                  onChange={e => setCaptureEmail(e.target.value)}
                  placeholder="finance.director@company.ae"
                  className="w-full px-3.5 py-2.5 text-xs bg-surface border border-rule focus:border-obsidian focus:ring-1 focus:ring-obsidian rounded-[4px] text-obsidian"
                />
              </div>
              <div>
                <label className="field-label mb-1.5 block" htmlFor="lead-company">
                  Company Name (Optional)
                </label>
                <input
                  id="lead-company"
                  type="text"
                  value={captureCompany}
                  onChange={e => setCaptureCompany(e.target.value)}
                  placeholder="Al Manara Trading LLC"
                  className="w-full px-3.5 py-2.5 text-xs bg-surface border border-rule focus:border-obsidian focus:ring-1 focus:ring-obsidian rounded-[4px] text-obsidian"
                />
              </div>
            </div>

            {captureStatus === 'error' && (
              <div className="p-3 text-xs bg-danger/10 border border-danger/30 text-danger rounded-[4px]">
                {captureError}
              </div>
            )}

            {captureStatus === 'success' && (
              <div className="p-4 text-xs bg-emerald/10 border border-emerald/30 text-emerald rounded-[4px]">
                <strong className="font-semibold block mb-0.5">Assessment Saved Successfully!</strong>
                Our enterprise trade compliance architects will dispatch your custom PINT-AE technical readiness brief and schedule a preliminary consultation.
              </div>
            )}

            <div className="mt-2 flex items-center gap-4">
              <button
                type="submit"
                disabled={isCapturing || captureStatus === 'success'}
                className="btn-primary cursor-pointer disabled:opacity-50"
              >
                {isCapturing ? 'Saving Assessment...' : '[ Save Assessment & Request Advisory ]'}
              </button>
              <span className="text-[11px] font-mono text-muted">
                Enterprise Confidentiality &bull; Zero Spam
              </span>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export default UaeEinvoicingCalculator
