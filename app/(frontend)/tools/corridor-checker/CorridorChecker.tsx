'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  type Corridor,
  type TransportMode,
  type ProductRegulationStatus,
  type ItemStatus,
  type Verdict,
  type ChecklistItem,
  type ChecklistCategory,
  getChecklistItems,
  calculateReadiness,
  validateAcidNumber,
  validateEgyptianTaxId,
  validateSaberCertificateNumber,
  serializeChecklistState,
  deserializeChecklistState,
  CORRIDOR_METADATA,
} from '@/lib/tools/aci-saber'
import { submitWaitlist } from '@/actions/submitWaitlist'

const CATEGORY_LABELS: Record<ChecklistCategory, string> = {
  registration: 'Registration & Portal Accounts',
  pre_shipment_filing: 'Pre-Shipment Filing & Manifest',
  commercial_docs: 'Commercial Invoices & Documents',
  conformity_cert: 'Conformity & Lab Testing',
  labeling: 'Packaging & Origin Labeling',
}

export default function CorridorChecker() {
  // ── 1. Interactive State ───────────────────────────────────────────────────
  const [corridor, setCorridor] = useState<Corridor>('egypt_aci')
  const [mode, setMode] = useState<TransportMode>('sea')
  const [productStatus, setProductStatus] = useState<ProductRegulationStatus>('regulated')
  const [documentStatus, setDocumentStatus] = useState<Record<string, ItemStatus>>({})
  const [categoryFilter, setCategoryFilter] = useState<'all' | ChecklistCategory>('all')

  // Identifier verification inputs
  const [acidInput, setAcidInput] = useState('')
  const [importerTaxIdInput, setImporterTaxIdInput] = useState('')
  const [saberCertInput, setSaberCertInput] = useState('')

  // UI state
  const [copiedLink, setCopiedLink] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Email capture state
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)

  // ── 2. URL Deserialization on Mount ────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return
    const parsed = deserializeChecklistState(window.location.search)
    if (parsed.corridor) setCorridor(parsed.corridor)
    if (parsed.mode) setMode(parsed.mode)
    if (parsed.regulationStatus) setProductStatus(parsed.regulationStatus)
    if (parsed.statusMap && Object.keys(parsed.statusMap).length > 0) {
      setDocumentStatus(parsed.statusMap)
    }
    setIsInitialized(true)
  }, [])

  // ── 3. URL Serialization on State Changes ──────────────────────────────────
  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') return
    const query = serializeChecklistState({
      corridor,
      mode,
      regulationStatus: corridor === 'ksa_saber' ? productStatus : undefined,
      statusMap: documentStatus,
    })
    const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname
    window.history.replaceState(null, '', newUrl)
  }, [corridor, mode, productStatus, documentStatus, isInitialized])

  // ── 4. Calculation & Metrics ───────────────────────────────────────────────
  const items = useMemo(() => {
    return getChecklistItems({
      corridor,
      mode,
      regulationStatus: corridor === 'ksa_saber' ? productStatus : undefined,
    })
  }, [corridor, mode, productStatus])

  const readiness = useMemo(() => {
    return calculateReadiness(items, documentStatus)
  }, [items, documentStatus])

  // Identifier validations
  const acidValidation = useMemo(() => {
    if (!acidInput.trim()) return null
    return validateAcidNumber(acidInput)
  }, [acidInput])

  const taxIdValidation = useMemo(() => {
    if (!importerTaxIdInput.trim()) return null
    return validateEgyptianTaxId(importerTaxIdInput)
  }, [importerTaxIdInput])

  const saberValidation = useMemo(() => {
    if (!saberCertInput.trim()) return null
    return validateSaberCertificateNumber(saberCertInput)
  }, [saberCertInput])

  // ── 5. Action Handlers ─────────────────────────────────────────────────────
  const setItemStatus = useCallback((itemId: string, status: ItemStatus) => {
    setDocumentStatus((prev) => ({
      ...prev,
      [itemId]: status,
    }))
  }, [])

  const handleShare = useCallback(() => {
    if (typeof window === 'undefined') return
    const query = serializeChecklistState({
      corridor,
      mode,
      regulationStatus: corridor === 'ksa_saber' ? productStatus : undefined,
      statusMap: documentStatus,
    })
    const url = `${window.location.origin}${window.location.pathname}${query ? `?${query}` : ''}`
    navigator.clipboard.writeText(url)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }, [corridor, mode, productStatus, documentStatus])

  const handleReset = useCallback(() => {
    setCorridor('egypt_aci')
    setMode('sea')
    setProductStatus('regulated')
    setDocumentStatus({})
    setAcidInput('')
    setImporterTaxIdInput('')
    setSaberCertInput('')
    setCategoryFilter('all')
    setSubmitted(false)
    setEmailError(null)
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  const handlePrint = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }, [])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) {
      setEmailError('Please enter a valid business email address.')
      return
    }

    setSubmitting(true)
    setEmailError(null)

    try {
      const result = await submitWaitlist({
        email: email.trim(),
        source: 'Corridor-Checker',
        company: company.trim() || undefined,
        payload: {
          tool: 'corridor-checker',
          corridor,
          mode,
          readinessScore: readiness.readinessScore,
          verdict: readiness.verdict,
          missingMandatoryCount: readiness.missingMandatoryItems.length,
          timestamp: new Date().toISOString(),
        },
      })

      if (result.success) {
        setSubmitted(true)
      } else {
        setEmailError(result.error || 'Failed to submit checklist report. Please try again.')
      }
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  // Filter items by category
  const filteredItems = useMemo(() => {
    if (categoryFilter === 'all') return items
    return items.filter((item) => item.category === categoryFilter)
  }, [items, categoryFilter])

  // Categories present in active corridor
  const availableCategories = useMemo(() => {
    const cats = new Set<ChecklistCategory>()
    items.forEach((item) => cats.add(item.category))
    return Array.from(cats)
  }, [items])

  const meta = CORRIDOR_METADATA[corridor]

  // Dynamic progress bar styling
  const score = readiness.scorePct
  const scoreColorClass =
    score >= 85
      ? 'bg-emerald text-emerald'
      : score >= 50
        ? 'bg-warning text-warning'
        : 'bg-danger text-danger'

  return (
    <>
      {/* ── Print-Specific Stylesheet ─────────────────────────────────────── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm 10mm;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          header, footer, nav, #header, #footer, .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          .print-table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          .print-table th, .print-table td {
            border: 1px solid #d1d5db !important;
            padding: 6px 8px !important;
            text-align: start !important;
          }
        }
      `,
        }}
      />

      {/* ── Formal Print Report (Hidden on Screen, Visible on Print) ───────── */}
      <div className="hidden print:block text-black p-6 font-sans">
        <div className="border-b-2 border-black pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-tight">
                Exvorta Regulatory Trade Engine
              </h1>
              <p className="text-xs uppercase tracking-widest text-neutral-600 mt-1 font-mono">
                Pre-Shipment Compliance Certificate &amp; Gap Analysis Report
              </p>
            </div>
            <div className="text-end font-mono text-xs">
              <p>DATE: {new Date().toISOString().split('T')[0]}</p>
              <p>STATUS: VERIFIED BASELINE</p>
            </div>
          </div>
        </div>

        {/* Report Overview Box */}
        <div className="grid grid-cols-2 gap-4 border border-black p-4 mb-6 text-sm font-mono">
          <div>
            <p><strong>Corridor:</strong> {meta.name}</p>
            <p><strong>Transport Mode:</strong> {mode.toUpperCase()}</p>
            <p><strong>Authority:</strong> {meta.authority}</p>
            <p><strong>Legal Citation:</strong> {meta.legalReference}</p>
          </div>
          <div>
            <p><strong>Compliance Verdict:</strong> {readiness.verdict}</p>
            <p><strong>Readiness Score:</strong> {readiness.scorePct}%</p>
            <p><strong>Mandatory Items Cleared:</strong> {readiness.readyCount} / {readiness.totalMandatory}</p>
            <p><strong>Critical Blockers:</strong> {readiness.blockingItemIds.length}</p>
          </div>
        </div>

        {/* Identifier Checks */}
        {corridor === 'egypt_aci' && (
          <div className="border border-black p-3 mb-6 text-xs font-mono bg-neutral-50">
            <p><strong>ACID Number (19-digit):</strong> {acidInput || 'NOT FILED / UNVALIDATED'}</p>
            <p><strong>Egyptian Importer Tax Card ID:</strong> {importerTaxIdInput || 'NOT PROVIDED'}</p>
          </div>
        )}
        {corridor === 'ksa_saber' && (
          <div className="border border-black p-3 mb-6 text-xs font-mono bg-neutral-50">
            <p><strong>SABER Certificate Ref:</strong> {saberCertInput || 'NOT ENTERED'}</p>
            <p><strong>Product Regulation Status:</strong> {productStatus.toUpperCase()}</p>
          </div>
        )}

        {/* Requirements Table */}
        <table className="print-table text-xs w-full mb-6 font-sans">
          <thead>
            <tr className="bg-neutral-100 font-mono">
              <th className="w-16">Status</th>
              <th className="w-1/3">Requirement &amp; Legal Ref</th>
              <th>Operational Guidance &amp; Non-Compliance Consequence</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const status = documentStatus[item.id] ?? 'missing'
              return (
                <tr key={item.id} className={status === 'missing' && item.isMandatory ? 'bg-neutral-50' : ''}>
                  <td className="font-mono font-bold uppercase">
                    {status === 'ready' ? '[READY]' : status === 'pending' ? '[PENDING]' : '[MISSING]'}
                  </td>
                  <td>
                    <p className="font-bold">{item.title}</p>
                    <p className="text-[10px] text-neutral-600 font-mono mt-0.5">{item.legalReference}</p>
                  </td>
                  <td className="text-[11px]">
                    <p>{item.guidance}</p>
                    {status === 'missing' && item.consequenceOfNonCompliance && (
                      <p className="text-red-700 font-semibold mt-1">
                        Violation Risk: {item.consequenceOfNonCompliance}
                      </p>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="text-[10px] text-neutral-500 font-mono border-t border-black pt-2 mt-8">
          Regulatory facts verified as of {meta.sourceDate}. Egypt ACI 19-digit format UNVERIFIED pending MTS technical decree confirmation. All SABER shipments require FASAH SCoC linkage. Generated via Exvorta Pre-Shipment Compliance Engine.
        </div>
      </div>

      {/* ── Screen Workspace ──────────────────────────────────────────────── */}
      <div className="w-full flex flex-col gap-12 md:gap-16">
        {/* Action Toolbar */}
        <div className="no-print w-full border-y border-rule bg-surface-2/60 py-3.5">
          <div className="container-site flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald animate-pulse shrink-0" aria-hidden="true" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
                Statutory Trade Readiness Engine &bull; Zero Network Dependency
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 border border-rule bg-surface hover:border-obsidian text-obsidian transition-colors rounded-[4px] cursor-pointer"
                title="Print formal gap analysis report or export to PDF"
              >
                <svg className="w-3.5 h-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>[ Print / PDF ]</span>
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 border border-rule bg-surface hover:border-obsidian text-obsidian transition-colors rounded-[4px] cursor-pointer"
                aria-label={copiedLink ? 'Link copied' : 'Copy configuration link'}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    copiedLink ? 'bg-emerald shadow-[0_0_6px_var(--color-emerald)]' : 'bg-muted'
                  }`}
                  aria-hidden="true"
                />
                <span>{copiedLink ? '[ Copied! ]' : '[ Share Config ]'}</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 border border-rule hover:border-obsidian text-muted hover:text-obsidian bg-transparent transition-colors rounded-[4px] cursor-pointer"
              >
                [ Reset ]
              </button>
            </div>
          </div>
        </div>

        {/* ── SECTION 1: Corridor & Transport Mode Selector ───────────────── */}
        <section className="no-print container-site">
          <div className="frame border border-rule bg-surface p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-rule">
              <div>
                <p className="eyebrow mb-1">
                  <span className="eyebrow-index" aria-hidden="true">
                    <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
                  </span>
                  Step 01 &bull; Corridor &amp; Transport Mode
                </p>
                <h2 className="font-serif text-title font-semibold text-obsidian">
                  Select Regulatory Corridor
                </h2>
              </div>

              {/* Corridor Toggle Buttons */}
              <div className="flex flex-wrap items-center gap-2 bg-surface-2 p-1.5 border border-rule rounded-[4px]">
                <button
                  type="button"
                  onClick={() => {
                    setCorridor('egypt_aci')
                    setDocumentStatus({})
                  }}
                  className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors rounded-[3px] cursor-pointer ${
                    corridor === 'egypt_aci'
                      ? 'bg-obsidian text-white font-semibold shadow-xs'
                      : 'text-muted hover:text-obsidian'
                  }`}
                >
                  Egypt ACI (Nafeza)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCorridor('ksa_saber')
                    setDocumentStatus({})
                  }}
                  className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors rounded-[3px] cursor-pointer ${
                    corridor === 'ksa_saber'
                      ? 'bg-obsidian text-white font-semibold shadow-xs'
                      : 'text-muted hover:text-obsidian'
                  }`}
                >
                  Saudi SABER (FASAH)
                </button>
              </div>
            </div>

            {/* Transport Mode & Metadata Row */}
            <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 flex items-center gap-3">
                <span className="font-mono text-xs uppercase tracking-wider text-muted">Transport Mode:</span>
                <div className="inline-flex rounded-[4px] border border-rule bg-surface-2 p-1">
                  <button
                    type="button"
                    onClick={() => setMode('sea')}
                    className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer ${
                      mode === 'sea'
                        ? 'bg-obsidian text-white font-medium'
                        : 'text-muted hover:text-obsidian'
                    }`}
                  >
                    Sea Freight
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('air')}
                    className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer ${
                      mode === 'air'
                        ? 'bg-obsidian text-white font-medium'
                        : 'text-muted hover:text-obsidian'
                    }`}
                  >
                    Air Freight
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-wrap gap-4 text-xs font-mono text-muted lg:justify-end">
                <span>Authority: <strong className="text-obsidian">{meta.authority}</strong></span>
                <span>&bull;</span>
                <span>Platform: <strong className="text-obsidian">{meta.platform}</strong></span>
                <span>&bull;</span>
                <span>Legal Ref: <strong className="text-obsidian">{meta.legalReference}</strong></span>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: Dynamic Readiness Score & Verdict Card ───────────── */}
        <section className="no-print container-site" aria-labelledby="readiness-summary-heading">
          <div className="frame border border-rule bg-surface p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Score Dial & Progress */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted">
                    Readiness Score
                  </span>
                  <span className={`font-mono text-3xl md:text-4xl font-bold ${scoreColorClass.split(' ')[1]}`}>
                    {score}%
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-3 bg-surface-2 rounded-full overflow-hidden border border-rule">
                  <div
                    className={`h-full transition-all duration-500 ease-out ${scoreColorClass.split(' ')[0]}`}
                    style={{ width: `${Math.max(5, score)}%` }}
                    role="progressbar"
                    aria-valuenow={score}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-muted">
                  <span>Mandatory Cleared: {readiness.readyCount} / {readiness.totalMandatory}</span>
                  <span>Pending: {readiness.pendingCount}</span>
                </div>
              </div>

              {/* Verdict Banner */}
              <div className="lg:col-span-7">
                <div
                  className={`p-5 rounded-[4px] border ${
                    readiness.verdict === 'READY'
                      ? 'border-emerald/40 bg-emerald/5 text-emerald'
                      : readiness.verdict === 'AT_RISK'
                        ? 'border-warning/40 bg-warning/5 text-obsidian'
                        : 'border-danger/40 bg-danger/5 text-danger'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {readiness.verdict === 'READY' && (
                      <svg className="w-6 h-6 text-emerald shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {readiness.verdict === 'AT_RISK' && (
                      <svg className="w-6 h-6 text-warning shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    )}
                    {readiness.verdict === 'BLOCKED' && (
                      <svg className="w-6 h-6 text-danger shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold uppercase tracking-wider">
                          Verdict: {readiness.verdict === 'READY' ? 'Ready for Dispatch' : readiness.verdict === 'AT_RISK' ? 'At Risk: Incomplete Filing' : 'Critical Blockers: Loading Prohibited'}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted leading-relaxed">
                        {readiness.verdict === 'READY' &&
                          'All mandatory pre-shipment filings and regulatory credentials are confirmed. The consignment may proceed to carrier dispatch.'}
                        {readiness.verdict === 'AT_RISK' &&
                          'No critical statutory blockers detected, but required document verifications remain pending. Carrier loading may experience customs hold.'}
                        {readiness.verdict === 'BLOCKED' &&
                          `${readiness.blockingItemIds.length} mandatory requirement(s) are missing. By statutory authority, carriers are barred from loading unverified cargo; port arrival triggers mandatory re-export.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: Identifier Validation Card ────────────────────────── */}
        <section className="no-print container-site">
          <div className="frame border border-rule bg-surface p-6 md:p-8">
            <div className="pb-6 border-b border-rule">
              <p className="eyebrow mb-1">
                <span className="eyebrow-index" aria-hidden="true">
                  <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
                </span>
                Step 02 &bull; Statutory Number Validation
              </p>
              <h2 className="font-serif text-title font-semibold text-obsidian">
                {corridor === 'egypt_aci'
                  ? 'Nafeza ACID & Egyptian Tax ID Verification'
                  : 'SABER Certificate & Product Conformity Verification'}
              </h2>
            </div>

            <div className="py-6">
              {corridor === 'egypt_aci' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Input 1: ACID */}
                    <div className="space-y-2">
                      <label htmlFor="acid-input" className="block font-mono text-xs uppercase tracking-wider text-obsidian font-semibold">
                        ACID Number (19 Digits)
                      </label>
                      <input
                        id="acid-input"
                        type="text"
                        value={acidInput}
                        onChange={(e) => setAcidInput(e.target.value)}
                        placeholder="e.g. 1234567890123456789"
                        className="w-full px-3.5 py-2.5 bg-surface-2 border border-rule rounded-[4px] font-mono text-sm text-obsidian focus:outline-hidden focus:border-obsidian transition-colors"
                      />
                      {acidValidation && (
                        <div
                          className={`p-2.5 rounded-[4px] text-xs font-mono border ${
                            acidValidation.isValid
                              ? 'border-emerald/40 bg-emerald/5 text-emerald'
                              : 'border-danger/40 bg-danger/5 text-danger'
                          }`}
                        >
                          {acidValidation.isValid ? (
                            <div>
                              <p className="font-semibold">&bull; Valid 19-Digit Syntax</p>
                              <p className="text-[11px] text-muted mt-0.5">
                                [PROVISIONAL] Syntax accepted. Final validation confirmed upon MTS / Nafeza forwarder transmission.
                              </p>
                            </div>
                          ) : (
                            <p>&bull; {acidValidation.error}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Input 2: Egyptian Importer Tax ID */}
                    <div className="space-y-2">
                      <label htmlFor="tax-id-input" className="block font-mono text-xs uppercase tracking-wider text-obsidian font-semibold">
                        Egyptian Importer Tax ID (9 Digits)
                      </label>
                      <input
                        id="tax-id-input"
                        type="text"
                        value={importerTaxIdInput}
                        onChange={(e) => setImporterTaxIdInput(e.target.value)}
                        placeholder="e.g. 123456789"
                        className="w-full px-3.5 py-2.5 bg-surface-2 border border-rule rounded-[4px] font-mono text-sm text-obsidian focus:outline-hidden focus:border-obsidian transition-colors"
                      />
                      {taxIdValidation && (
                        <div
                          className={`p-2.5 rounded-[4px] text-xs font-mono border ${
                            taxIdValidation.isValid
                              ? 'border-emerald/40 bg-emerald/5 text-emerald'
                              : 'border-danger/40 bg-danger/5 text-danger'
                          }`}
                        >
                          {taxIdValidation.isValid ? (
                            <p className="font-semibold">&bull; Valid 9-Digit Egyptian Tax Card Format</p>
                          ) : (
                            <p>&bull; {taxIdValidation.error}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Regulatory Notice for Egypt */}
                  <div className="border border-rule bg-surface-2/70 p-4 rounded-[4px] text-xs font-mono text-muted space-y-1">
                    <p className="font-semibold text-obsidian">
                      Statutory Authority Notice &bull; Ministry of Finance Decree No. 38/2021
                    </p>
                    <p>
                      &bull; <strong>Sea Freight:</strong> ACID number issuance mandatory &ge;48 hours prior to vessel departure (active since 1 Oct 2021).
                    </p>
                    <p>
                      &bull; <strong>Air Freight:</strong> Manifest filing mandatory &ge;4 hours prior to takeoff (active since 1 Jan 2026).
                    </p>
                    <p className="text-danger font-medium">
                      &bull; Under Customs Law No. 207/2020, carriers are legally barred from loading non-ACID cargo; non-compliant goods arriving at Egyptian ports are subject to immediate re-export at carrier/exporter expense.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Input 1: SABER Certificate */}
                    <div className="space-y-2">
                      <label htmlFor="saber-input" className="block font-mono text-xs uppercase tracking-wider text-obsidian font-semibold">
                        SABER Certificate Number (PCoC / SCoC)
                      </label>
                      <input
                        id="saber-input"
                        type="text"
                        value={saberCertInput}
                        onChange={(e) => setSaberCertInput(e.target.value)}
                        placeholder="e.g. SASO-PCOC-2026-9812"
                        className="w-full px-3.5 py-2.5 bg-surface-2 border border-rule rounded-[4px] font-mono text-sm text-obsidian focus:outline-hidden focus:border-obsidian transition-colors"
                      />
                      {saberValidation && (
                        <div
                          className={`p-2.5 rounded-[4px] text-xs font-mono border ${
                            saberValidation.isValid
                              ? 'border-emerald/40 bg-emerald/5 text-emerald'
                              : 'border-danger/40 bg-danger/5 text-danger'
                          }`}
                        >
                          {saberValidation.isValid ? (
                            <p className="font-semibold">&bull; Valid SABER Alphanumeric Format (6&ndash;35 chars)</p>
                          ) : (
                            <p>&bull; {saberValidation.error}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Product Regulation Selector */}
                    <div className="space-y-2">
                      <span className="block font-mono text-xs uppercase tracking-wider text-obsidian font-semibold">
                        Product Technical Regulation Scope
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setProductStatus('regulated')}
                          className={`p-2.5 rounded-[4px] border font-mono text-xs text-center transition-colors cursor-pointer ${
                            productStatus === 'regulated'
                              ? 'border-obsidian bg-obsidian text-white font-semibold'
                              : 'border-rule bg-surface-2 text-muted hover:text-obsidian'
                          }`}
                        >
                          Regulated (PCoC+SCoC)
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductStatus('non_regulated')}
                          className={`p-2.5 rounded-[4px] border font-mono text-xs text-center transition-colors cursor-pointer ${
                            productStatus === 'non_regulated'
                              ? 'border-obsidian bg-obsidian text-white font-semibold'
                              : 'border-rule bg-surface-2 text-muted hover:text-obsidian'
                          }`}
                        >
                          Non-Regulated (SDoC)
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductStatus('exempt')}
                          className={`p-2.5 rounded-[4px] border font-mono text-xs text-center transition-colors cursor-pointer ${
                            productStatus === 'exempt'
                              ? 'border-obsidian bg-obsidian text-white font-semibold'
                              : 'border-rule bg-surface-2 text-muted hover:text-obsidian'
                          }`}
                        >
                          Exempt
                        </button>
                      </div>
                      <p className="text-[11px] font-mono text-muted">
                        {productStatus === 'regulated' && 'Regulated goods require an ISO/IEC 17025 accredited test report and a CAB-issued Product Certificate (PCoC).'}
                        {productStatus === 'non_regulated' && 'Non-regulated goods require an electronic Self-Declaration of Conformity (SDoC) issued by the Saudi importer.'}
                        {productStatus === 'exempt' && 'Exempt goods do not require PCoC/SDoC, but custom documentation and FASAH clearance apply.'}
                      </p>
                    </div>
                  </div>

                  {/* Regulatory Notice for KSA */}
                  <div className="border border-rule bg-surface-2/70 p-4 rounded-[4px] text-xs font-mono text-muted space-y-1">
                    <p className="font-semibold text-obsidian">
                      Statutory Authority Notice &bull; SASO SALEEM &amp; ZATCA FASAH Integration
                    </p>
                    <p>
                      &bull; <strong>100% SCoC Mandate:</strong> A Shipment Certificate of Conformity (SCoC) issued via SABER and integrated with FASAH is strictly required for 100% of shipments.
                    </p>
                    <p>
                      &bull; <strong>Labeling &amp; Origin:</strong> Non-removable, permanent Country of Origin marking and Arabic labels/safety instructions are mandatory on both primary products and master cartons.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── SECTION 4: Interactive Compliance Checklist ──────────────────── */}
        <section className="no-print container-site" aria-labelledby="checklist-title">
          <div className="frame border border-rule bg-surface p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-rule">
              <div>
                <p className="eyebrow mb-1">
                  <span className="eyebrow-index" aria-hidden="true">
                    <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
                  </span>
                  Step 03 &bull; Regulatory Checklist &amp; Gap Analysis
                </p>
                <h2 id="checklist-title" className="font-serif text-title font-semibold text-obsidian">
                  Statutory Pre-Shipment Requirements
                </h2>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 bg-surface-2 p-1 border border-rule rounded-[4px]">
                <button
                  type="button"
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer ${
                    categoryFilter === 'all'
                      ? 'bg-obsidian text-white font-semibold'
                      : 'text-muted hover:text-obsidian'
                  }`}
                >
                  All ({items.length})
                </button>
                {availableCategories.map((cat) => {
                  const count = items.filter((i) => i.category === cat).length
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer ${
                        categoryFilter === cat
                          ? 'bg-obsidian text-white font-semibold'
                          : 'text-muted hover:text-obsidian'
                      }`}
                    >
                      {cat === 'registration' ? 'Registration' : cat === 'pre_shipment_filing' ? 'Filing' : cat === 'commercial_docs' ? 'Commercial' : cat === 'conformity_cert' ? 'Conformity' : 'Labeling'} ({count})
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Checklist Items Loop */}
            <div className="divide-y divide-rule">
              {filteredItems.map((item) => {
                const status = documentStatus[item.id] ?? 'missing'

                return (
                  <div key={item.id} className="py-6 first:pt-6 last:pb-0">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      {/* Left: Item Information */}
                      <div className="flex-1 space-y-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-sans text-base font-bold text-obsidian">
                            {item.title}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-[2px] font-mono text-[10px] uppercase tracking-wider font-semibold ${
                              item.isMandatory
                                ? 'bg-danger/10 text-danger border border-danger/20'
                                : 'bg-surface-2 text-muted border border-rule'
                            }`}
                          >
                            {item.isMandatory ? 'MANDATORY' : 'DISCRETIONARY'}
                          </span>
                          <span className="px-2 py-0.5 rounded-[2px] font-mono text-[10px] uppercase tracking-wider bg-surface-2 text-muted border border-rule">
                            {CATEGORY_LABELS[item.category] || item.category}
                          </span>
                        </div>

                        {/* Statutory Citation */}
                        <div className="text-[11px] font-mono text-muted flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span>Legal Ref: <strong className="text-obsidian">{item.legalReference}</strong></span>
                          <span>&bull;</span>
                          <span>Authority: {item.sourceAuthority}</span>
                          <span>&bull;</span>
                          <span>Source Date: {item.sourceDate}</span>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted leading-relaxed">
                          {item.description}
                        </p>

                        {/* Practical Guidance */}
                        <div className="p-3 bg-surface-2 border-s-2 border-obsidian rounded-e-[4px] text-xs font-mono text-muted">
                          <strong className="text-obsidian">Operational Guidance:</strong> {item.guidance}
                        </div>

                        {/* Consequence of Non-Compliance (Prominently shown when status is missing) */}
                        {status === 'missing' && item.consequenceOfNonCompliance && (
                          <div className="p-3 bg-danger/5 border border-danger/30 rounded-[4px] text-xs font-mono text-danger flex items-start gap-2.5">
                            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div>
                              <strong className="uppercase">Consequence of Non-Compliance:</strong>{' '}
                              <span>{item.consequenceOfNonCompliance}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Status Toggle Controls */}
                      <div className="shrink-0 flex items-center gap-1.5 self-start lg:self-center bg-surface-2 p-1 border border-rule rounded-[4px]">
                        <button
                          type="button"
                          onClick={() => setItemStatus(item.id, 'ready')}
                          className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer ${
                            status === 'ready'
                              ? 'bg-emerald text-white font-bold shadow-xs'
                              : 'text-muted hover:text-emerald'
                          }`}
                        >
                          Ready
                        </button>
                        <button
                          type="button"
                          onClick={() => setItemStatus(item.id, 'pending')}
                          className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer ${
                            status === 'pending'
                              ? 'bg-warning text-obsidian font-bold shadow-xs'
                              : 'text-muted hover:text-warning'
                          }`}
                        >
                          Pending
                        </button>
                        <button
                          type="button"
                          onClick={() => setItemStatus(item.id, 'missing')}
                          className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer ${
                            status === 'missing'
                              ? 'bg-danger text-white font-bold shadow-xs'
                              : 'text-muted hover:text-danger'
                          }`}
                        >
                          Missing
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── SECTION 5: "Email Me This Checklist" Lead Card ───────────────── */}
        <section className="no-print container-site">
          <div className="frame border border-rule bg-surface p-6 md:p-8">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <p className="eyebrow justify-center mb-1">
                  <span className="eyebrow-index" aria-hidden="true">
                    <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
                  </span>
                  Compliance Gap Report
                </p>
                <h2 className="font-serif text-title font-semibold text-obsidian">
                  Email Me This Pre-Shipment Checklist
                </h2>
                <p className="text-sm text-muted mt-2">
                  Receive a structured PDF-ready copy of this gap analysis report and stay updated with live Middle East trade compliance decrees.
                </p>
              </div>

              {submitted ? (
                <div className="p-4 border border-emerald/40 bg-emerald/5 rounded-[4px] text-center font-mono text-xs text-emerald space-y-1">
                  <p className="font-bold text-sm">Checklist Report Successfully Queued!</p>
                  <p className="text-muted">
                    We have recorded your {corridor === 'egypt_aci' ? 'Egypt ACI' : 'Saudi SABER'} compliance gap analysis for <strong>{email}</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="user-email" className="block font-mono text-xs uppercase tracking-wider text-obsidian mb-1">
                        Business Email <span className="text-danger">*</span>
                      </label>
                      <input
                        id="user-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="trade.director@company.com"
                        className="w-full px-3.5 py-2.5 bg-surface-2 border border-rule rounded-[4px] font-sans text-sm text-obsidian focus:outline-hidden focus:border-obsidian transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="user-company" className="block font-mono text-xs uppercase tracking-wider text-obsidian mb-1">
                        Company Name (Optional)
                      </label>
                      <input
                        id="user-company"
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Global Trading Ltd"
                        className="w-full px-3.5 py-2.5 bg-surface-2 border border-rule rounded-[4px] font-sans text-sm text-obsidian focus:outline-hidden focus:border-obsidian transition-colors"
                      />
                    </div>
                  </div>

                  {emailError && (
                    <p className="font-mono text-xs text-danger text-center">&bull; {emailError}</p>
                  )}

                  <div className="flex justify-center pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-3 bg-obsidian text-white rounded-[4px] font-mono text-xs uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                    >
                      {submitting ? '[ Dispatching Report... ]' : '[ Send Checklist Report ]'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
