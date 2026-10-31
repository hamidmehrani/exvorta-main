'use client'

import React, { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import {
  CORRIDORS,
  EXPORT_DOCUMENTS,
  EGYPT_ACID_DISCLAIMER,
  calculateChecklistStats,
  type CorridorId,
  type ExportDocument,
} from '@/lib/tools/export-checklist'
import { submitWaitlist } from '@/actions/submitWaitlist'

const STATS = calculateChecklistStats()

interface CorridorTab {
  id: string
  label: string
  badgeCount: number
}

const CORRIDOR_TABS: CorridorTab[] = [
  { id: 'all', label: 'All Corridors', badgeCount: 25 },
  { id: 'intra-gcc', label: 'Intra-GCC', badgeCount: 5 },
  { id: 'ksa-inbound', label: 'KSA Inbound', badgeCount: 5 },
  { id: 'egypt-inbound', label: 'Egypt Inbound', badgeCount: 5 },
  { id: 'uae-inbound', label: 'UAE Inbound', badgeCount: 5 },
  { id: 'eu-cbam', label: 'EU CBAM', badgeCount: 5 },
]

export default function ExportChecklistClient() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [activeCorridor, setActiveCorridor] = useState<string>('all')
  const [filterMandatoryOnly, setFilterMandatoryOnly] = useState(false)

  // Form State
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [, startTransition] = useTransition()

  // Check localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('exvorta_checklist_unlocked')
        if (stored === 'true') {
          setIsUnlocked(true)
        }
      }
    } catch {
      // localStorage may fail in restricted/incognito frames
    }
  }, [])

  // Form submit handler
  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedEmail = email.trim()
    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setStatus('error')
      setErrorMessage('Please provide a valid corporate email address.')
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    startTransition(async () => {
      try {
        const result = await submitWaitlist({
          email: trimmedEmail,
          source: 'Waitlist',
          company: company.trim() || undefined,
          payload: {
            tool: 'export-checklist',
            name: name.trim() || undefined,
          },
        })

        if (result.success) {
          setStatus('success')
          setIsUnlocked(true)
          try {
            localStorage.setItem('exvorta_checklist_unlocked', 'true')
          } catch {
            // ignore localStorage quota/restriction
          }
        } else {
          setStatus('error')
          setErrorMessage(result.error || 'Unable to unlock compliance checklist. Please verify your email and try again.')
        }
      } catch {
        setStatus('error')
        setErrorMessage('A network error occurred while submitting your request. Please try again.')
      }
    })
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  // Helper to filter documents per corridor
  const getCorridorDocs = (corridorId: CorridorId): ExportDocument[] => {
    const list = EXPORT_DOCUMENTS.filter((d) => d.corridorId === corridorId)
    if (filterMandatoryOnly) {
      return list.filter((d) => d.mandatory)
    }
    return list
  }

  // Corridors data
  const gccDocs = getCorridorDocs('intra-gcc')
  const ksaDocs = getCorridorDocs('ksa-inbound')
  const egyptDocs = getCorridorDocs('egypt-inbound')
  const uaeDocs = getCorridorDocs('uae-inbound')
  const euDocs = getCorridorDocs('eu-cbam')

  // Screen display checks based on activeCorridor
  const showPage1Screen = activeCorridor === 'all' || activeCorridor === 'intra-gcc'
  const showPage2Screen = activeCorridor === 'all' || activeCorridor === 'ksa-inbound' || activeCorridor === 'egypt-inbound'
  const showPage3Screen = activeCorridor === 'all' || activeCorridor === 'uae-inbound' || activeCorridor === 'eu-cbam'
  const showPage4Screen = activeCorridor === 'all'

  return (
    <>
      {/* ── Global Print & A4 Pagination Styles ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 10mm 10mm 10mm;
          }
          html, body {
            background: #FFFFFF !important;
            color: #0D0D0D !important;
            font-size: 10.5px !important;
            line-height: 1.3 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          header, footer, nav, #header, #footer, .no-print, [data-hide-print="true"] {
            display: none !important;
          }
          .print-page {
            display: block !important;
            page-break-after: always !important;
            break-after: page !important;
            min-height: auto !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: #FFFFFF !important;
          }
          .print-page:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
          .print-break-inside-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          .print-only {
            display: block !important;
          }
        }
      ` }} />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Institutional Meta Strip ── */}
        <div className="no-print border border-rule bg-surface p-4 rounded-sm mb-6 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-muted shadow-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald/10 text-emerald border border-emerald/30 font-semibold rounded-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              [VERIFIED] STATUTORY REGULATORY DATA
            </span>
            <span>REF: <strong className="text-obsidian">EXV-DOC-CHK-2026-V1</strong></span>
            <span>EFFECTIVE DATE: <strong className="text-obsidian">2026-10-27</strong></span>
          </div>
          <div className="flex items-center gap-2 text-stone-600">
            <span>JURISDICTIONS: <strong>GCC • KSA • EGYPT • UAE • EU</strong></span>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* CASE A: GATED PREVIEW STATE (when not unlocked)                     */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {!isUnlocked && (
          <div className="no-print space-y-8">
            {/* Executive Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="border border-rule bg-surface p-5 rounded-sm">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1">
                  TOTAL COMPLIANCE ASSETS
                </span>
                <div className="font-serif text-3xl font-semibold text-obsidian">
                  {STATS.totalDocuments} Documents
                </div>
                <div className="font-mono text-xs text-stone-600 mt-1">
                  {STATS.mandatoryDocuments} Statutory Mandatory • {STATS.optionalDocuments} Preferential
                </div>
              </div>

              <div className="border border-rule bg-surface p-5 rounded-sm">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1">
                  REGIONAL CORRIDORS
                </span>
                <div className="font-serif text-3xl font-semibold text-obsidian">
                  5 Corridors
                </div>
                <div className="font-mono text-xs text-stone-600 mt-1">
                  Intra-GCC, KSA, Egypt, UAE, EU CBAM
                </div>
              </div>

              <div className="border border-rule bg-surface p-5 rounded-sm">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1">
                  STATUTORY RECENT DIRECTIVES
                </span>
                <div className="font-serif text-3xl font-semibold text-obsidian">
                  100% Enacted
                </div>
                <div className="font-mono text-xs text-stone-600 mt-1">
                  12-Digit Tariff • SABER SCoC • Egypt ACID • PINT-AE
                </div>
              </div>

              <div className="border border-rule bg-surface p-5 rounded-sm">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1">
                  PRINT & DISPATCH SPEC
                </span>
                <div className="font-serif text-3xl font-semibold text-obsidian">
                  A4 Multi-Page
                </div>
                <div className="font-mono text-xs text-stone-600 mt-1">
                  Tripartite Sign-off & Port Authorities Directory
                </div>
              </div>
            </div>

            {/* Email Gate Lock Banner & Form */}
            <div className="border-2 border-obsidian bg-surface p-6 md:p-10 rounded-sm shadow-md">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-obsidian text-white font-mono text-[11px] uppercase tracking-wider mb-4 rounded-xs">
                  <span>[ RESTRICTED ACCESS // ENTERPRISE VERIFICATION REQUIRED ]</span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-obsidian leading-tight">
                  Unlock the Complete 2026 MENA &amp; Cross-Border Pre-Shipment Document Matrix
                </h2>
                <p className="font-mono text-xs md:text-sm text-stone-600 mt-2 leading-relaxed">
                  Institutional compliance checklist with statutory citations, timing windows, required data fields, and browser print-to-PDF formatting.
                </p>

                {errorMessage && (
                  <div className="mt-4 p-3 border border-red-300 bg-red-50 text-red-900 font-mono text-xs rounded-xs flex items-center gap-2">
                    <span className="font-bold text-red-700">ERROR:</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleUnlockSubmit} className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="gate-email" className="block font-mono text-[11px] uppercase tracking-wider text-obsidian font-semibold mb-1">
                        Corporate Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="gate-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="trade.compliance@company.com"
                        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 text-stone-900 text-xs font-mono rounded-xs focus:bg-white focus:outline-none focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                      />
                    </div>

                    <div>
                      <label htmlFor="gate-company" className="block font-mono text-[11px] uppercase tracking-wider text-obsidian font-semibold mb-1">
                        Company / Organization <span className="text-stone-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        id="gate-company"
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Enterprise Exporter / Forwarder"
                        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 text-stone-900 text-xs font-mono rounded-xs focus:bg-white focus:outline-none focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                      />
                    </div>

                    <div>
                      <label htmlFor="gate-name" className="block font-mono text-[11px] uppercase tracking-wider text-obsidian font-semibold mb-1">
                        Signatory / Officer Name <span className="text-stone-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        id="gate-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Trade Officer Name"
                        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 text-stone-900 text-xs font-mono rounded-xs focus:bg-white focus:outline-none focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                      />
                    </div>
                  </div>

                  {/* Honeypot */}
                  <input type="text" name="b_field" className="hidden" tabIndex={-1} autoComplete="off" />

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="px-6 py-3 bg-obsidian text-white font-mono text-xs uppercase tracking-widest font-semibold hover:bg-stone-800 transition-colors rounded-xs disabled:opacity-60 cursor-pointer"
                    >
                      {status === 'submitting'
                        ? '[ VALIDATING & UNLOCKING... ]'
                        : '[ UNLOCK COMPLETE COMPLIANCE MATRIX -> ]'}
                    </button>
                    <span className="font-mono text-[11px] text-muted">
                      Instant access • Saves unlock state locally • Formatted for 4-page print-to-PDF
                    </span>
                  </div>
                </form>
              </div>
            </div>

            {/* Blurred Peek Preview of actual compliance checklist */}
            <div className="relative border border-rule bg-surface p-6 md:p-8 rounded-sm overflow-hidden select-none pointer-events-none">
              <div className="filter blur-[3px] opacity-40 space-y-6">
                <div className="border-b border-rule pb-4">
                  <div className="font-mono text-xs uppercase text-muted">
                    EXVORTA TRADE COMPLIANCE INTELLIGENCE // DOCUMENT REF: EXV-DOC-CHK-2026-V1
                  </div>
                  <h3 className="font-serif text-xl font-semibold mt-1">
                    Corridor 01 // Intra-GCC &amp; UAE-KSA Regional Trade
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-rule p-4 bg-stone-50">
                    <div className="font-serif font-semibold">GCC Unified Certificate of Origin (شهادة المنشأ الخليجية الموحدة)</div>
                    <div className="font-mono text-xs text-muted mt-1">Legal Basis: Unified Economic Agreement between GCC States (Article 3)</div>
                    <div className="font-mono text-xs mt-2">Critical Timing: Pre-departure Chamber of Commerce certification</div>
                  </div>
                  <div className="border border-rule p-4 bg-stone-50">
                    <div className="font-serif font-semibold">Commercial Invoice with 12-Digit GCC HS Codes (الفاتورة التجارية)</div>
                    <div className="font-mono text-xs text-muted mt-1">Legal Basis: GCC Unified 12-Digit Integrated Tariff Resolution (1 Jan 2026)</div>
                    <div className="font-mono text-xs mt-2">Critical Timing: Sourced electronically to customs declaration portal</div>
                  </div>
                </div>
              </div>

              {/* Floating lock badge */}
              <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/70 to-transparent flex flex-col items-center justify-center p-6 text-center">
                <div className="p-4 bg-surface border border-rule shadow-lg rounded-sm max-w-md pointer-events-auto">
                  <span className="font-mono text-xs uppercase tracking-widest text-emerald font-semibold block mb-1">
                    [ PREVIEW MODE ACTIVE ]
                  </span>
                  <p className="font-mono text-xs text-stone-700 leading-relaxed">
                    The 25-document statutory matrix with full legal citations, timing windows, required fields, sign-off table, and authority directory is locked.
                  </p>
                  <p className="font-mono text-[11px] text-muted mt-2">
                    Enter your work email in the verification form above to instantly unlock the full matrix.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* CASE B: UNLOCKED STATE (Complete 4-Page Document Matrix)            */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {isUnlocked && (
          <div className="space-y-8">
            {/* Action & Filter Banner */}
            <div className="no-print border-2 border-emerald/60 bg-emerald/5 p-6 rounded-sm shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald animate-pulse" />
                    <span className="font-mono text-xs uppercase tracking-widest text-emerald font-bold">
                      [ ACCESS GRANTED // EXV-DOC-CHK-2026-V1 UNLOCKED ]
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl font-semibold text-obsidian">
                    Document Matrix Unlocked
                  </h2>
                  <p className="font-mono text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
                    In the browser print dialogue, choose <strong>&apos;Save as PDF&apos;</strong>, <strong>A4 Portrait</strong>, Margins: <strong>Default or Minimum</strong>, Background graphics: <strong>Enabled</strong>.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-6 py-3.5 bg-obsidian text-white font-mono text-xs uppercase tracking-widest font-semibold hover:bg-stone-800 transition-colors rounded-xs shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-emerald font-bold">⎙</span>
                  <span>[ PRINT / SAVE AS PDF ]</span>
                </button>
              </div>

              {/* Interactive Corridor Filter Tabs & Mandatory Toggle */}
              <div className="border-t border-emerald/20 pt-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-xs uppercase text-muted me-2">FILTER CORRIDOR:</span>
                  {CORRIDOR_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveCorridor(tab.id)}
                      className={`px-3 py-1.5 font-mono text-xs uppercase transition-colors rounded-xs cursor-pointer ${
                        activeCorridor === tab.id
                          ? 'bg-obsidian text-white font-semibold'
                          : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {tab.label}
                      <span className="ms-1.5 text-[10px] opacity-70">({tab.badgeCount})</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={filterMandatoryOnly}
                      onChange={(e) => setFilterMandatoryOnly(e.target.checked)}
                      className="w-4 h-4 rounded-xs border-stone-300 text-obsidian focus:ring-obsidian"
                    />
                    <span className="font-mono text-xs uppercase tracking-wider text-obsidian font-semibold">
                      Mandatory Only
                    </span>
                  </label>
                  <span className="font-mono text-xs text-muted">
                    ({filterMandatoryOnly ? '24' : '25'} docs)
                  </span>
                </div>
              </div>
            </div>

            {/* ───────────────────────────────────────────────────────────── */}
            {/* PRINT-FORMATTED 4-PAGE DOCUMENT DOSSIER                       */}
            {/* ───────────────────────────────────────────────────────────── */}

            {/* ═════════════════════════════════════════════════════════════ */}
            {/* PAGE 1: Header, Legend, Corridor 1 (Intra-GCC Trade)          */}
            {/* ═════════════════════════════════════════════════════════════ */}
            <section
              className={`print-page border border-rule bg-surface p-6 md:p-10 rounded-sm shadow-xs mb-8 print:p-0 print:border-none print:shadow-none print:mb-0 ${
                showPage1Screen ? 'block' : 'hidden print:block'
              }`}
            >
              {/* Institutional Header */}
              <div className="border-b-2 border-obsidian pb-4 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-wider text-muted mb-1">
                  <span>EXVORTA TRADE COMPLIANCE INTELLIGENCE // DOCUMENT REF: EXV-DOC-CHK-2026-V1</span>
                  <span>PAGE 01 / 04</span>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h1 className="font-serif text-2xl md:text-3xl font-semibold text-obsidian">
                    Pre-Shipment Export Documents Checklist
                  </h1>
                  <span className="font-mono text-xs px-2.5 py-1 bg-emerald/10 text-emerald border border-emerald/30 font-bold rounded-xs">
                    STATUS: VERIFIED 2026-10-27
                  </span>
                </div>
                <p className="font-mono text-xs text-stone-600 mt-1">
                  Institutional Cross-Border Pre-Shipment Compliance Matrix across MENA, GCC, and European Union Corridors.
                </p>

                {/* Classification Legend */}
                <div className="mt-4 pt-3 border-t border-rule flex flex-wrap items-center gap-3 font-mono text-[10.5px]">
                  <span className="font-bold text-obsidian uppercase">Classification Legend:</span>
                  <span className="px-2 py-0.5 bg-emerald/10 text-emerald border border-emerald/30 rounded-xs font-semibold">
                    [VERIFIED] Statutory / Enacted Law
                  </span>
                  <span className="px-2 py-0.5 bg-amber-500/10 text-amber-800 border border-amber-500/30 rounded-xs font-semibold">
                    [UNVERIFIED] Industry Draft / Technical Spec pending
                  </span>
                  <span className="px-2 py-0.5 bg-stone-100 text-stone-700 border border-stone-300 rounded-xs font-semibold">
                    [ASSUMPTION] Standard Market Practice
                  </span>
                </div>
              </div>

              {/* Section 1: Corridor 1 - Intra-GCC & Regional Trade */}
              <div className="space-y-4">
                <div className="border-s-4 border-obsidian ps-4 py-1">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-emerald font-bold block">
                    CORRIDOR 01 // REGIONAL TRADE
                  </span>
                  <h2 className="font-serif text-xl font-semibold text-obsidian">
                    Intra-GCC &amp; Regional Trade (UAE, KSA, GCC Customs Union)
                  </h2>
                  <div className="font-mono text-xs text-stone-600 mt-0.5">
                    <strong>Governing Authority:</strong> GCC Customs Union Authority (GCC-CUA) / ZATCA / Dubai Customs
                    <br />
                    <strong>Enacted Legal Basis:</strong> GCC Unified Customs Law &amp; Unified 12-Digit Integrated Customs Tariff Framework (effective 1 Jan 2026)
                  </div>
                </div>

                <div className="space-y-3">
                  {gccDocs.map((doc) => (
                    <DocumentCard key={doc.id} doc={doc} />
                  ))}
                </div>
              </div>
            </section>

            {/* ═════════════════════════════════════════════════════════════ */}
            {/* PAGE 2: Corridor 2 (KSA Inbound) & Corridor 3 (Egypt Inbound) */}
            {/* ═════════════════════════════════════════════════════════════ */}
            <section
              className={`print-page border border-rule bg-surface p-6 md:p-10 rounded-sm shadow-xs mb-8 print:p-0 print:border-none print:shadow-none print:mb-0 ${
                showPage2Screen ? 'block' : 'hidden print:block'
              }`}
            >
              {/* Page 2 Header */}
              <div className="border-b border-rule pb-3 mb-6 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-muted">
                <span>EXVORTA TRADE COMPLIANCE INTELLIGENCE // DOCUMENT REF: EXV-DOC-CHK-2026-V1</span>
                <span>PAGE 02 / 04</span>
              </div>

              {/* Section 2: Corridor 2 - Saudi Arabia Inbound Trade */}
              {(activeCorridor === 'all' || activeCorridor === 'ksa-inbound') && (
                <div className="space-y-4 mb-8">
                  <div className="border-s-4 border-emerald ps-4 py-1">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-emerald font-bold block">
                      CORRIDOR 02 // DESTINATION CLEARANCE
                    </span>
                    <h2 className="font-serif text-xl font-semibold text-obsidian">
                      Saudi Arabia Inbound Trade (KSA Customs &amp; SASO)
                    </h2>
                    <div className="font-mono text-xs text-stone-600 mt-0.5">
                      <strong>Governing Authority:</strong> Zakat, Tax and Customs Authority (ZATCA) / SASO
                      <br />
                      <strong>Enacted Legal Basis:</strong> SALEEM Saudi Product Safety Program; SASO Technical Regulations; ZATCA Res. No. (1447-88-5)
                    </div>
                  </div>

                  <div className="space-y-3">
                    {ksaDocs.map((doc) => (
                      <DocumentCard key={doc.id} doc={doc} />
                    ))}
                  </div>
                </div>
              )}

              {/* Section 3: Corridor 3 - Egypt Inbound Trade */}
              {(activeCorridor === 'all' || activeCorridor === 'egypt-inbound') && (
                <div className="space-y-4 pt-4 border-t border-rule print:pt-2 print:border-t-stone-200">
                  <div className="border-s-4 border-amber-600 ps-4 py-1">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-amber-700 font-bold block">
                      CORRIDOR 03 // PRE-ARRIVAL ADVANCE CARGO INFORMATION
                    </span>
                    <h2 className="font-serif text-xl font-semibold text-obsidian">
                      Egypt Inbound Trade (Nafeza &amp; CargoX ACI System)
                    </h2>
                    <div className="font-mono text-xs text-stone-600 mt-0.5">
                      <strong>Governing Authority:</strong> Ministry of Finance / Egyptian Customs Authority / MTS Nafeza / CargoX
                      <br />
                      <strong>Enacted Legal Basis:</strong> Egyptian MoF Decree No. 38/2021 (Sea) &amp; Minister Statement (Air Freight mandatory 1 Jan 2026)
                    </div>
                  </div>

                  {/* Prominent exact verbatim disclaimer callout box */}
                  <div className="border-2 border-amber-500/50 bg-amber-500/10 p-3.5 rounded-sm my-3 print-break-inside-avoid">
                    <div className="flex items-start gap-2.5">
                      <span className="font-mono text-xs font-bold uppercase text-amber-800 shrink-0">
                        [STATUTORY NOTICE]
                      </span>
                      <p className="font-mono text-xs text-amber-950 leading-relaxed font-semibold">
                        {EGYPT_ACID_DISCLAIMER}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {egyptDocs.map((doc) => (
                      <DocumentCard key={doc.id} doc={doc} />
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* ═════════════════════════════════════════════════════════════ */}
            {/* PAGE 3: Corridor 4 (UAE Inbound) & Corridor 5 (EU CBAM)      */}
            {/* ═════════════════════════════════════════════════════════════ */}
            <section
              className={`print-page border border-rule bg-surface p-6 md:p-10 rounded-sm shadow-xs mb-8 print:p-0 print:border-none print:shadow-none print:mb-0 ${
                showPage3Screen ? 'block' : 'hidden print:block'
              }`}
            >
              {/* Page 3 Header */}
              <div className="border-b border-rule pb-3 mb-6 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-muted">
                <span>EXVORTA TRADE COMPLIANCE INTELLIGENCE // DOCUMENT REF: EXV-DOC-CHK-2026-V1</span>
                <span>PAGE 03 / 04</span>
              </div>

              {/* Section 4: Corridor 4 - UAE Inbound & Compliance */}
              {(activeCorridor === 'all' || activeCorridor === 'uae-inbound') && (
                <div className="space-y-4 mb-8">
                  <div className="border-s-4 border-obsidian ps-4 py-1">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-emerald font-bold block">
                      CORRIDOR 04 // DOMESTIC CLEARANCE &amp; E-INVOICING
                    </span>
                    <h2 className="font-serif text-xl font-semibold text-obsidian">
                      UAE Inbound &amp; Compliance (Dubai Customs &amp; PINT-AE)
                    </h2>
                    <div className="font-mono text-xs text-stone-600 mt-0.5">
                      <strong>Governing Authority:</strong> UAE Ministry of Finance (MoF) / Federal Tax Authority (FTA) / Dubai Customs
                      <br />
                      <strong>Enacted Legal Basis:</strong> Federal Decree-Law No. 16/2024; Cabinet Dec. 106/2025; MD 243 &amp; 244/2025; MR 66/2026; Dubai Notice 02/2026
                    </div>
                  </div>

                  <div className="space-y-3">
                    {uaeDocs.map((doc) => (
                      <DocumentCard key={doc.id} doc={doc} />
                    ))}
                  </div>
                </div>
              )}

              {/* Section 5: Corridor 5 - European Union Export Corridor */}
              {(activeCorridor === 'all' || activeCorridor === 'eu-cbam') && (
                <div className="space-y-4 pt-4 border-t border-rule print:pt-2 print:border-t-stone-200">
                  <div className="border-s-4 border-emerald ps-4 py-1">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-emerald font-bold block">
                      CORRIDOR 05 // SUSTAINABILITY &amp; TARIFF INTEGRATION
                    </span>
                    <h2 className="font-serif text-xl font-semibold text-obsidian">
                      European Union Export Corridor (EU CBAM &amp; Customs)
                    </h2>
                    <div className="font-mono text-xs text-stone-600 mt-0.5">
                      <strong>Governing Authority:</strong> European Commission DG TAXUD / EU Competent Authorities
                      <br />
                      <strong>Enacted Legal Basis:</strong> Regulation (EU) 2023/956 amended by Reg. (EU) 2025/2083; DG TAXUD Implementing Guidance No. 3
                    </div>
                  </div>

                  <div className="space-y-3">
                    {euDocs.map((doc) => (
                      <DocumentCard key={doc.id} doc={doc} />
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* ═════════════════════════════════════════════════════════════ */}
            {/* PAGE 4: Sign-off Table, Authority Directory & CTA Loop        */}
            {/* ═════════════════════════════════════════════════════════════ */}
            <section
              className={`print-page border border-rule bg-surface p-6 md:p-10 rounded-sm shadow-xs mb-8 print:p-0 print:border-none print:shadow-none print:mb-0 ${
                showPage4Screen ? 'block' : 'hidden print:block'
              }`}
            >
              {/* Page 4 Header */}
              <div className="border-b border-rule pb-3 mb-6 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-muted">
                <span>EXVORTA TRADE COMPLIANCE INTELLIGENCE // DOCUMENT REF: EXV-DOC-CHK-2026-V1</span>
                <span>PAGE 04 / 04</span>
              </div>

              {/* Master Pre-Shipment Dispatch Sign-off Protocol */}
              <div className="border border-rule bg-white p-4 md:p-6 rounded-xs mb-6 print-break-inside-avoid print:p-2 print:border-stone-300">
                <div className="border-b border-rule pb-2 mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-base md:text-lg font-semibold text-obsidian">
                      Master Pre-Shipment Dispatch Sign-off Protocol
                    </h3>
                    <p className="font-mono text-[11px] text-muted uppercase tracking-wider mt-0.5">
                      Mandatory Tripartite Verification Prior to Carrier Manifest Release
                    </p>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 bg-obsidian text-white rounded-xs">
                    FORM: EXV-SIG-2026
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-start border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-rule bg-stone-100/80 font-mono text-[10.5px] uppercase tracking-wider text-stone-700">
                        <th className="py-2 px-3 text-start">Authorization Role</th>
                        <th className="py-2 px-3 text-start">Authorized Signatory Name</th>
                        <th className="py-2 px-3 text-start">Organization &amp; License No.</th>
                        <th className="py-2 px-3 text-start">Signature</th>
                        <th className="py-2 px-3 text-start">Date (YYYY-MM-DD)</th>
                        <th className="py-2 px-3 text-center">Official Seal / Stamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-rule font-mono text-xs">
                      {/* Row 1: Customs Broker */}
                      <tr>
                        <td className="py-3 px-3 font-semibold text-obsidian">
                          1. Licensed Customs Broker
                          <span className="block text-[10px] text-stone-500 font-normal">
                            Customs Declaration &amp; HS Code Validation
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="border-b border-dashed border-stone-400 h-6 min-w-[120px]" />
                        </td>
                        <td className="py-3 px-3">
                          <div className="border-b border-dashed border-stone-400 h-6 min-w-[130px]" />
                        </td>
                        <td className="py-3 px-3">
                          <div className="border-b border-dashed border-stone-400 h-6 min-w-[100px]" />
                        </td>
                        <td className="py-3 px-3">
                          <div className="border-b border-dashed border-stone-400 h-6 min-w-[90px]" />
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="border border-dashed border-stone-400 h-14 w-20 mx-auto rounded-xs flex items-center justify-center text-[8.5px] text-stone-400">
                            [ STAMP ]
                          </div>
                        </td>
                      </tr>

                      {/* Row 2: Freight Forwarder */}
                      <tr>
                        <td className="py-3 px-3 font-semibold text-obsidian">
                          2. Freight Forwarder / Carrier
                          <span className="block text-[10px] text-stone-500 font-normal">
                            Manifest Filing &amp; Waybill Authorization
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="border-b border-dashed border-stone-400 h-6 min-w-[120px]" />
                        </td>
                        <td className="py-3 px-3">
                          <div className="border-b border-dashed border-stone-400 h-6 min-w-[130px]" />
                        </td>
                        <td className="py-3 px-3">
                          <div className="border-b border-dashed border-stone-400 h-6 min-w-[100px]" />
                        </td>
                        <td className="py-3 px-3">
                          <div className="border-b border-dashed border-stone-400 h-6 min-w-[90px]" />
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="border border-dashed border-stone-400 h-14 w-20 mx-auto rounded-xs flex items-center justify-center text-[8.5px] text-stone-400">
                            [ STAMP ]
                          </div>
                        </td>
                      </tr>

                      {/* Row 3: Enterprise Compliance Officer */}
                      <tr>
                        <td className="py-3 px-3 font-semibold text-obsidian">
                          3. Enterprise Compliance Officer
                          <span className="block text-[10px] text-stone-500 font-normal">
                            Shipper Corporate Attestation &amp; Origin
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="border-b border-dashed border-stone-400 h-6 min-w-[120px]" />
                        </td>
                        <td className="py-3 px-3">
                          <div className="border-b border-dashed border-stone-400 h-6 min-w-[130px]" />
                        </td>
                        <td className="py-3 px-3">
                          <div className="border-b border-dashed border-stone-400 h-6 min-w-[100px]" />
                        </td>
                        <td className="py-3 px-3">
                          <div className="border-b border-dashed border-stone-400 h-6 min-w-[90px]" />
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="border border-dashed border-stone-400 h-14 w-20 mx-auto rounded-xs flex items-center justify-center text-[8.5px] text-stone-400">
                            [ STAMP ]
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Official Regulatory Authority Directory */}
              <div className="border border-rule bg-white p-4 md:p-6 rounded-xs mb-6 print-break-inside-avoid print:p-2 print:border-stone-300">
                <div className="border-b border-rule pb-2 mb-3">
                  <h3 className="font-serif text-base md:text-lg font-semibold text-obsidian">
                    Official Regulatory Authority Directory &amp; Single Windows
                  </h3>
                  <p className="font-mono text-[11px] text-muted uppercase tracking-wider mt-0.5">
                    Direct Portals, Single-Window Gateways &amp; Statutory Systems
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 font-mono text-xs print:grid-cols-3 print:gap-1.5 print:text-[9.5px]">
                  {/* ZATCA */}
                  <div className="border border-rule p-2.5 bg-stone-50/50 rounded-xs">
                    <div className="font-bold text-obsidian">ZATCA (Saudi Arabia)</div>
                    <div className="text-[10.5px] text-muted mt-0.5">Zakat, Tax and Customs Authority</div>
                    <div className="text-[10px] text-stone-600 mt-1">12-Digit Tariff, FASAH &amp; Zakat Clearance</div>
                    <span className="text-emerald font-semibold block mt-1.5">zatca.gov.sa</span>
                  </div>

                  {/* SASO / SABER */}
                  <div className="border border-rule p-2.5 bg-stone-50/50 rounded-xs">
                    <div className="font-bold text-obsidian">SASO &amp; SABER (Saudi Arabia)</div>
                    <div className="text-[10.5px] text-muted mt-0.5">Standards, Metrology &amp; Quality Org.</div>
                    <div className="text-[10px] text-stone-600 mt-1">SABER PCoC &amp; SCoC Conformity Gate</div>
                    <span className="text-emerald font-semibold block mt-1.5">saso.gov.sa • saber.sa</span>
                  </div>

                  {/* Dubai Customs */}
                  <div className="border border-rule p-2.5 bg-stone-50/50 rounded-xs">
                    <div className="font-bold text-obsidian">Dubai Customs &amp; Dubai Trade (UAE)</div>
                    <div className="text-[10.5px] text-muted mt-0.5">Customs Tariff &amp; Single Window</div>
                    <div className="text-[10px] text-stone-600 mt-1">Mirsal 2 Clearance &amp; Electronic DO</div>
                    <span className="text-emerald font-semibold block mt-1.5">dubaicustoms.gov.ae</span>
                  </div>

                  {/* MTS Nafeza */}
                  <div className="border border-rule p-2.5 bg-stone-50/50 rounded-xs">
                    <div className="font-bold text-obsidian">MTS Nafeza (Egypt)</div>
                    <div className="text-[10.5px] text-muted mt-0.5">National Single Window for Foreign Trade</div>
                    <div className="text-[10px] text-stone-600 mt-1">19-Digit ACID Generation (Sea &amp; Air)</div>
                    <span className="text-emerald font-semibold block mt-1.5">nafeza.gov.eg</span>
                  </div>

                  {/* CargoX */}
                  <div className="border border-rule p-2.5 bg-stone-50/50 rounded-xs">
                    <div className="font-bold text-obsidian">CargoX Platform (Egypt ACI)</div>
                    <div className="text-[10.5px] text-muted mt-0.5">MTS Authorized Blockchain Transfer</div>
                    <div className="text-[10px] text-stone-600 mt-1">Foreign Exporter Verification &amp; Envelopes</div>
                    <span className="text-emerald font-semibold block mt-1.5">cargox.digital</span>
                  </div>

                  {/* UAE FTA */}
                  <div className="border border-rule p-2.5 bg-stone-50/50 rounded-xs">
                    <div className="font-bold text-obsidian">Federal Tax Authority (UAE FTA)</div>
                    <div className="text-[10.5px] text-muted mt-0.5">Ministry of Finance E-Invoicing</div>
                    <div className="text-[10px] text-stone-600 mt-1">PINT-AE Peppol Mandate &amp; ASP Registry</div>
                    <span className="text-emerald font-semibold block mt-1.5">tax.gov.ae</span>
                  </div>

                  {/* DG TAXUD */}
                  <div className="border border-rule p-2.5 bg-stone-50/50 rounded-xs sm:col-span-2 lg:col-span-3 print:col-span-3">
                    <div className="font-bold text-obsidian">DG TAXUD (European Commission)</div>
                    <div className="text-[10.5px] text-muted mt-0.5">Directorate-General for Taxation and Customs Union</div>
                    <div className="text-[10px] text-stone-600 mt-1">EU CBAM Registry, ICS2 Entry Declaration &amp; CN/TARIC Classification</div>
                    <span className="text-emerald font-semibold block mt-1">taxation-customs.ec.europa.eu</span>
                  </div>
                </div>
              </div>

              {/* CTA Loop back to Exvorta Tools */}
              <div className="border border-rule bg-obsidian text-white p-5 md:p-6 rounded-xs print-break-inside-avoid print:bg-white print:text-obsidian print:border-stone-300">
                <div className="border-b border-stone-800 pb-2 mb-3 print:border-stone-200">
                  <span className="font-mono text-emerald text-[11px] uppercase tracking-widest font-bold block">
                    [ EXVORTA SUITE // TRADE INTELLIGENCE &amp; WORKFLOWS ]
                  </span>
                  <h4 className="font-serif text-lg font-semibold text-white print:text-obsidian">
                    Connected Trade Applications &amp; Compliance Engines
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs print:grid-cols-3 print:text-[9.5px]">
                  <Link
                    href="/tools/incoterm-cbm"
                    className="p-3 border border-stone-800 bg-stone-900/50 hover:border-emerald transition-colors rounded-xs block print:border-stone-300 print:bg-stone-50"
                  >
                    <div className="text-emerald font-semibold">
                      Incoterm &amp; CBM Calculator →
                    </div>
                    <div className="text-[10.5px] text-stone-400 mt-1 print:text-stone-600">
                      CBM calculations, volumetric weight, and Incoterm 2020 risk transfer matrices.
                    </div>
                  </Link>

                  <Link
                    href="/tools/docs-generator"
                    className="p-3 border border-stone-800 bg-stone-900/50 hover:border-emerald transition-colors rounded-xs block print:border-stone-300 print:bg-stone-50"
                  >
                    <div className="text-emerald font-semibold">
                      Commercial Document Generator →
                    </div>
                    <div className="text-[10.5px] text-stone-400 mt-1 print:text-stone-600">
                      Generate Commercial Invoices, Packing Lists &amp; CMR Notes with browser PDF preview.
                    </div>
                  </Link>

                  <Link
                    href="/tools/uae-einvoicing"
                    className="p-3 border border-stone-800 bg-stone-900/50 hover:border-emerald transition-colors rounded-xs block print:border-stone-300 print:bg-stone-50"
                  >
                    <div className="text-emerald font-semibold">
                      UAE E-Invoicing Readiness Navigator →
                    </div>
                    <div className="text-[10.5px] text-stone-400 mt-1 print:text-stone-600">
                      Evaluate PINT-AE Peppol compliance, ASP deadlines, and ERP readiness scores.
                    </div>
                  </Link>

                  <Link
                    href="/tools"
                    className="p-3 border border-stone-800 bg-stone-900/50 hover:border-emerald transition-colors rounded-xs block print:border-stone-300 print:bg-stone-50"
                  >
                    <div className="text-emerald font-semibold">
                      All Free Trade Tools Hub →
                    </div>
                    <div className="text-[10.5px] text-stone-400 mt-1 print:text-stone-600">
                      Complete library of calculation engines, customs tariff tools, and trade lead magnets.
                    </div>
                  </Link>

                  <Link
                    href="/rfq"
                    className="p-3 border border-stone-800 bg-stone-900/50 hover:border-emerald transition-colors rounded-xs block sm:col-span-2 lg:col-span-2 print:col-span-2 print:border-stone-300 print:bg-stone-50"
                  >
                    <div className="text-emerald font-semibold">
                      Enterprise RFQ &amp; Trade Advisory →
                    </div>
                    <div className="text-[10.5px] text-stone-400 mt-1 print:text-stone-600">
                      Procurement specification builder and institutional trade advisory for enterprise exporters.
                    </div>
                  </Link>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </>
  )
}

function DocumentCard({ doc }: { doc: ExportDocument }) {
  const isVerified = doc.classification === 'VERIFIED'
  const isUnverified = doc.classification === 'UNVERIFIED'

  return (
    <div className="border border-rule bg-white p-4 md:p-5 rounded-xs shadow-xs print-break-inside-avoid print:p-2.5 print:border-stone-300">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-rule/70 pb-2 mb-2.5">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span className="font-mono text-[10px] text-muted uppercase tracking-wider">
              REF: {doc.id}
            </span>
            <span
              className={`font-mono text-[9.5px] uppercase px-1.5 py-0.5 rounded-xs font-semibold ${
                doc.mandatory
                  ? 'bg-obsidian text-white'
                  : 'bg-stone-200 text-stone-700'
              }`}
            >
              {doc.mandatory ? '[ MANDATORY ]' : '[ OPTIONAL / PREFERENTIAL ]'}
            </span>
            <span
              className={`font-mono text-[9.5px] uppercase px-1.5 py-0.5 rounded-xs font-semibold ${
                isVerified
                  ? 'bg-emerald/10 text-emerald border border-emerald/30'
                  : isUnverified
                  ? 'bg-amber-500/10 text-amber-800 border border-amber-500/30'
                  : 'bg-stone-100 text-stone-600 border border-stone-300'
              }`}
            >
              [{doc.classification}]
            </span>
          </div>
          <h3 className="font-serif text-sm md:text-base font-semibold text-obsidian leading-snug">
            {doc.title}
          </h3>
        </div>
        <div className="text-end font-mono text-[10px] text-muted">
          <span className="uppercase tracking-wider block">CATEGORY: {doc.category}</span>
          <span>DATE: {doc.verifiedDate}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono text-muted mb-3 print:grid-cols-2 print:gap-2 print:mb-2 print:text-[10px]">
        <div>
          <span className="text-obsidian font-semibold block text-[11px] print:text-[9.5px]">
            Governing Authority &amp; Statutory Legal Citation:
          </span>
          <p className="text-stone-800 mt-0.5 leading-relaxed">
            {doc.governingAuthority}
          </p>
          <p className="text-stone-500 text-[10px] mt-0.5 italic">
            Basis: {doc.legalBasis}
          </p>
        </div>
        <div>
          <span className="text-obsidian font-semibold block text-[11px] print:text-[9.5px]">
            Critical Timing Window:
          </span>
          <p className="text-stone-800 mt-0.5 leading-relaxed">
            {doc.criticalTiming}
          </p>
          <div className="mt-1 text-amber-900 text-[10.5px] leading-tight">
            <strong className="font-semibold text-amber-800">Non-Compliance Risk:</strong> {doc.nonComplianceRisk}
          </div>
        </div>
      </div>

      {/* Required Data Fields */}
      <div className="bg-stone-50/90 border border-rule/70 p-2.5 rounded-xs print:p-2 print:bg-stone-50">
        <span className="font-mono text-[10px] uppercase tracking-wider text-obsidian font-bold block mb-1">
          Statutory Required Data Fields ({doc.requiredDataFields.length}):
        </span>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[11px] font-mono text-stone-800 print:text-[9px] print:grid-cols-2">
          {doc.requiredDataFields.map((field, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <span className="text-emerald font-bold shrink-0">✓</span>
              <span>{field}</span>
            </li>
          ))}
        </ul>
      </div>

      {doc.notes && (
        <div className="mt-2 text-[10.5px] font-mono text-stone-600 italic print:text-[9px]">
          Operational Note: {doc.notes}
        </div>
      )}

      {doc.disclaimer && (
        <div className="mt-2 text-[10.5px] font-mono text-amber-900 bg-amber-500/10 p-2 rounded-xs border border-amber-500/30 font-medium">
          {doc.disclaimer}
        </div>
      )}
    </div>
  )
}
