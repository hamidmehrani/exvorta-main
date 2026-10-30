'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  searchTariff,
  convert8to12,
  calculateDutyAndTaxes,
  serializeHsState,
  deserializeHsState,
  TARIFF_DATASET,
  TARIFF_DATASET_META,
  formatHsCode,
  type TariffEntry,
  type Jurisdiction,
  type DutyCalculationResult,
} from '@/lib/tools/hs-converter'

const PRESET_CHIPS = [
  { code: '39011010', label: 'LLDPE Polymers' },
  { code: '84713000', label: 'Laptop Computers' },
  { code: '71081200', label: 'Gold Bullion' },
  { code: '85171300', label: 'Smartphones' },
  { code: '09041100', label: 'Pepper & Spices' },
  { code: '22029910', label: 'Energy Drinks' },
] as const

const CURRENCIES = ['AED', 'SAR', 'USD', 'EUR'] as const
type SupportedCurrency = (typeof CURRENCIES)[number]

function formatMoney(amount: number, currency: string): string {
  return `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`
}

function formatDutyBadge(dutyRate: number, dutyType: string): string {
  if (dutyType === 'exempt' || dutyRate === 0) return 'Exempt (0%)'
  const pct = Math.round(dutyRate * 100)
  if (pct > 5) return `${pct}% Protective`
  return `${pct}% Duty`
}

export function HsConverterTool() {
  const searchParams = useSearchParams()

  const parsedInitial = useMemo(() => {
    return deserializeHsState(searchParams?.toString())
  }, [searchParams])

  const [searchQuery, setSearchQuery] = useState<string>(parsedInitial.query || '')
  const [jurisdictionFilter, setJurisdictionFilter] = useState<'ALL' | 'AE' | 'SA'>(
    parsedInitial.jurisdiction && parsedInitial.jurisdiction !== 'GCC'
      ? parsedInitial.jurisdiction
      : 'ALL'
  )
  const [cifValue, setCifValue] = useState<number>(
    parsedInitial.cifValue !== undefined && parsedInitial.cifValue > 0
      ? parsedInitial.cifValue
      : 10000
  )
  const [currency, setCurrency] = useState<SupportedCurrency>('AED')
  const [selectedCode, setSelectedCode] = useState<string>(
    parsedInitial.selectedCode || '39011010'
  )
  const [copiedLink, setCopiedLink] = useState<boolean>(false)

  // Reactive URL parameter synchronization
  useEffect(() => {
    if (typeof window === 'undefined') return
    const query = serializeHsState({
      query: searchQuery,
      jurisdiction: jurisdictionFilter === 'ALL' ? undefined : (jurisdictionFilter as Jurisdiction),
      cifValue,
      selectedCode,
    })
    const newPath = query ? `${window.location.pathname}?${query}` : window.location.pathname
    window.history.replaceState(null, '', newPath)
  }, [searchQuery, jurisdictionFilter, cifValue, selectedCode])

  // Filtered search results
  const searchResults = useMemo(() => {
    return searchTariff(searchQuery, {
      jurisdiction: jurisdictionFilter === 'ALL' ? undefined : (jurisdictionFilter as Jurisdiction),
      limit: 60,
    })
  }, [searchQuery, jurisdictionFilter])

  // Selected base entry
  const selectedEntry = useMemo<TariffEntry>(() => {
    if (selectedCode) {
      const match = TARIFF_DATASET.find(
        (e) => e.hsCode === selectedCode || e.hsCode.startsWith(selectedCode)
      )
      if (match) return match
    }
    return searchResults[0] || TARIFF_DATASET[0]
  }, [selectedCode, searchResults])

  // 12-digit national lines
  const uaeLines = useMemo(() => {
    if (!selectedEntry) return []
    return convert8to12(selectedEntry.hsCode, 'AE') || []
  }, [selectedEntry])

  const saLines = useMemo(() => {
    if (!selectedEntry) return []
    return convert8to12(selectedEntry.hsCode, 'SA') || []
  }, [selectedEntry])

  const uaeLine = uaeLines[0]
  const saLine = saLines[0]

  // Landed cost calculations
  const uaeCalculation = useMemo<DutyCalculationResult>(() => {
    const line = uaeLine || selectedEntry
    return calculateDutyAndTaxes({
      cifValue,
      currency,
      dutyRate: line?.dutyRate ?? 0.05,
      vatRate: line?.vatRate ?? 0.05,
      exciseRate: line?.exciseRate ?? 0,
    })
  }, [cifValue, currency, uaeLine, selectedEntry])

  const saCalculation = useMemo<DutyCalculationResult>(() => {
    const line = saLine || selectedEntry
    return calculateDutyAndTaxes({
      cifValue,
      currency,
      dutyRate: line?.dutyRate ?? 0.05,
      vatRate: line?.vatRate ?? 0.15,
      exciseRate: line?.exciseRate ?? 0,
    })
  }, [cifValue, currency, saLine, selectedEntry])

  const handleCopyLink = useCallback(async () => {
    if (typeof window === 'undefined') return
    const query = serializeHsState({
      query: searchQuery,
      jurisdiction: jurisdictionFilter === 'ALL' ? undefined : (jurisdictionFilter as Jurisdiction),
      cifValue,
      selectedCode: selectedEntry?.hsCode,
    })
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
        // clipboard write fallback
      }
    }
  }, [searchQuery, jurisdictionFilter, cifValue, selectedEntry])

  const handleReset = useCallback(() => {
    setSearchQuery('')
    setJurisdictionFilter('ALL')
    setCifValue(10000)
    setCurrency('AED')
    setSelectedCode('39011010')
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  const handlePresetSelect = useCallback((code: string) => {
    setSelectedCode(code)
    setSearchQuery('')
  }, [])

  return (
    <div className="w-full flex flex-col gap-12 md:gap-16">
      {/* Action Toolbar */}
      <div className="w-full border-y border-rule bg-surface-2/60 py-4">
        <div className="container-site flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald animate-pulse" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
              GCC Customs Engine &bull; Dubai Customs Notice 10/2025 &bull; ZATCA Res 1447-88-5
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider px-3.5 py-2 border border-rule bg-surface text-obsidian hover:border-obsidian transition-colors rounded-[4px] cursor-pointer"
              aria-label={copiedLink ? 'Link copied to clipboard' : 'Copy shareable configuration link'}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  copiedLink ? 'bg-emerald shadow-[0_0_6px_var(--color-emerald)]' : 'bg-muted'
                }`}
                aria-hidden="true"
              />
              <span>{copiedLink ? '[ Copied! ]' : '[ Copy Shareable Link ]'}</span>
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

      {/* Main Container */}
      <div className="container-site flex flex-col gap-12">
        {/* Search & Filter Header Section */}
        <section aria-labelledby="tariff-search-heading" className="frame border border-rule bg-surface p-6 md:p-8">
          <p className="eyebrow mb-2">
            <span className="eyebrow-index" aria-hidden="true">
              <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
            </span>
            Section A &bull; Tariff Search &amp; Jurisdictional Filter
          </p>
          <h2 id="tariff-search-heading" className="font-serif text-title font-semibold text-obsidian mb-6">
            Search Harmonized System Tariff Lines
          </h2>

          <div className="flex flex-col gap-5">
            {/* Search Input Bar */}
            <div className="relative w-full">
              <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-muted">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by 4, 6, or 8-digit HS code (e.g. 3901, 8471.30) or keyword (laptop, polymer, gold)..."
                className="w-full ps-11 pe-10 py-3.5 bg-surface-2/50 border border-rule focus:border-obsidian focus:bg-surface text-obsidian text-sm placeholder:text-muted rounded-[4px] outline-none transition-colors"
                aria-label="Search tariff codes or commodities"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-muted hover:text-obsidian transition-colors cursor-pointer"
                  aria-label="Clear search input"
                >
                  <span className="font-mono text-xs">[ &times; ]</span>
                </button>
              )}
            </div>

            {/* Jurisdiction Filters & Presets */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-rule">
              {/* Jurisdiction Filter Buttons */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted me-1">
                  Jurisdiction:
                </span>
                <button
                  type="button"
                  onClick={() => setJurisdictionFilter('ALL')}
                  className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider rounded-[3px] border transition-colors cursor-pointer ${
                    jurisdictionFilter === 'ALL'
                      ? 'bg-obsidian text-white border-obsidian'
                      : 'bg-surface-2 text-muted border-rule hover:text-obsidian hover:border-obsidian'
                  }`}
                >
                  All GCC
                </button>
                <button
                  type="button"
                  onClick={() => setJurisdictionFilter('AE')}
                  className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider rounded-[3px] border transition-colors cursor-pointer ${
                    jurisdictionFilter === 'AE'
                      ? 'bg-obsidian text-white border-obsidian'
                      : 'bg-surface-2 text-muted border-rule hover:text-obsidian hover:border-obsidian'
                  }`}
                >
                  UAE (AE)
                </button>
                <button
                  type="button"
                  onClick={() => setJurisdictionFilter('SA')}
                  className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider rounded-[3px] border transition-colors cursor-pointer ${
                    jurisdictionFilter === 'SA'
                      ? 'bg-obsidian text-white border-obsidian'
                      : 'bg-surface-2 text-muted border-rule hover:text-obsidian hover:border-obsidian'
                  }`}
                >
                  Saudi Arabia (SA)
                </button>
              </div>

              {/* Quick Preset Chips */}
              <div className="flex items-center flex-wrap gap-1.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted me-1">
                  High-Frequency:
                </span>
                {PRESET_CHIPS.map((chip) => {
                  const isActive = selectedEntry?.hsCode === chip.code
                  return (
                    <button
                      key={chip.code}
                      type="button"
                      onClick={() => handlePresetSelect(chip.code)}
                      className={`px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider rounded-[3px] border transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-emerald/10 text-emerald border-emerald/40 font-semibold'
                          : 'bg-surface text-muted border-rule hover:text-obsidian hover:border-obsidian'
                      }`}
                    >
                      {chip.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Two-Column Search Results & Breakdown Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Commodity List / Search Matches (Left 5 cols) */}
          <section
            aria-labelledby="commodity-results-heading"
            className="lg:col-span-5 frame border border-rule bg-surface p-5 md:p-6 flex flex-col"
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-rule">
              <div>
                <p className="eyebrow mb-1">Results Catalog</p>
                <h3 id="commodity-results-heading" className="font-serif text-lg font-semibold text-obsidian">
                  Commodities &amp; HS Lines
                </h3>
              </div>
              <span className="font-mono text-[11px] text-muted px-2 py-0.5 bg-surface-2 border border-rule rounded-[3px]">
                {searchResults.length} match{searchResults.length === 1 ? '' : 'es'}
              </span>
            </div>

            {searchResults.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <p className="font-mono text-sm text-muted mb-2">[ No matching tariff lines found ]</p>
                <p className="text-xs text-muted max-w-xs mx-auto mb-4">
                  Try searching by 4-digit HS heading (e.g. &quot;3901&quot;, &quot;8471&quot;) or keyword (&quot;laptop&quot;, &quot;gold&quot;).
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="font-mono text-xs uppercase tracking-wider px-3 py-1.5 border border-rule text-obsidian hover:border-obsidian rounded-[3px] cursor-pointer"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-h-[580px] overflow-y-auto pe-1">
                {searchResults.map((entry) => {
                  const isSelected = selectedEntry?.hsCode === entry.hsCode
                  return (
                    <button
                      key={entry.hsCode}
                      type="button"
                      onClick={() => setSelectedCode(entry.hsCode)}
                      className={`w-full text-start p-3.5 rounded-[4px] border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-obsidian bg-surface-2 shadow-xs'
                          : 'border-rule bg-surface hover:border-obsidian/40 hover:bg-surface-2/40'
                      }`}
                      aria-pressed={isSelected}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-obsidian tracking-wide">
                            {entry.formattedCode}
                          </span>
                          <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded-[2px] bg-obsidian/5 text-muted border border-rule">
                            {entry.jurisdiction}
                          </span>
                        </div>
                        <span
                          className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded-[2px] font-medium border ${
                            entry.dutyType === 'exempt'
                              ? 'bg-emerald/10 text-emerald border-emerald/30'
                              : entry.dutyRate > 0.05
                              ? 'bg-warning/10 text-warning border-warning/30'
                              : 'bg-surface-2 text-obsidian border-rule'
                          }`}
                        >
                          {formatDutyBadge(entry.dutyRate, entry.dutyType)}
                        </span>
                      </div>
                      <p className="text-xs text-obsidian font-normal line-clamp-2 leading-relaxed">
                        {entry.descriptionEn}
                      </p>
                      {entry.controllingAuthority && (
                        <div className="mt-2 flex items-center gap-1.5">
                          <span className="font-mono text-[10px] text-muted">Authority:</span>
                          <span className="font-mono text-[10px] text-muted font-medium">
                            {entry.controllingAuthority}
                          </span>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </section>

          {/* 8→12 Digit Conversion Breakdown Panel (Right 7 cols) */}
          <section
            aria-labelledby="conversion-breakdown-heading"
            className="lg:col-span-7 flex flex-col gap-6"
          >
            {/* Selected Base GCC 8-Digit Line Overview */}
            <div className="frame border border-rule bg-surface p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-rule">
                <div>
                  <p className="eyebrow mb-2">
                    <span className="eyebrow-index" aria-hidden="true">
                      <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
                    </span>
                    Section B &bull; GCC Unified Base (8-Digit)
                  </p>
                  <div className="flex items-center gap-3">
                    <h3 id="conversion-breakdown-heading" className="font-mono text-2xl font-bold text-obsidian tracking-tight">
                      {selectedEntry.formattedCode}
                    </h3>
                    <span className="font-mono text-xs uppercase px-2 py-0.5 rounded-[3px] bg-obsidian/5 border border-rule text-muted">
                      Common External Tariff (8-Digit)
                    </span>
                  </div>
                </div>
                <div className="text-start sm:text-end">
                  <span className="font-mono text-xs text-muted block mb-1">GCC Base Duty Rate</span>
                  <span
                    className={`inline-block font-mono text-sm px-3 py-1 rounded-[3px] font-semibold border ${
                      selectedEntry.dutyType === 'exempt'
                        ? 'bg-emerald/10 text-emerald border-emerald/30'
                        : selectedEntry.dutyRate > 0.05
                        ? 'bg-warning/10 text-warning border-warning/30'
                        : 'bg-surface-2 text-obsidian border-rule'
                    }`}
                  >
                    {formatDutyBadge(selectedEntry.dutyRate, selectedEntry.dutyType)}
                  </span>
                </div>
              </div>

              <div className="pt-6">
                <p className="text-sm md:text-base text-obsidian leading-relaxed mb-4">
                  {selectedEntry.descriptionEn}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-rule bg-surface-2/40 p-4 rounded-[4px]">
                  <div>
                    <span className="font-mono text-[10px] uppercase text-muted block mb-1">Unified Authority</span>
                    <span className="font-mono text-xs text-obsidian font-medium">
                      {selectedEntry.controllingAuthority || 'GCC Customs Committee'}
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase text-muted block mb-1">Statutory Citation</span>
                    <span className="font-mono text-xs text-obsidian">
                      {selectedEntry.sourceCitation}
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase text-muted block mb-1">Effective Date</span>
                    <span className="font-mono text-xs text-obsidian">
                      {selectedEntry.effectiveDate}
                    </span>
                  </div>
                </div>
                {selectedEntry.notes && (
                  <p className="mt-3 text-xs text-muted italic">
                    Note: {selectedEntry.notes}
                  </p>
                )}
              </div>
            </div>

            {/* 12-Digit National Subdivisions Comparison */}
            <div className="frame border border-rule bg-surface p-6 md:p-8">
              <div className="pb-6 mb-6 border-b border-rule flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <p className="eyebrow mb-1">Section C &bull; 8&rarr;12 Digit National Subdivisions</p>
                  <h3 className="font-serif text-title font-semibold text-obsidian">
                    Statutory National Lines (UAE vs Saudi Arabia)
                  </h3>
                </div>
                <span className="font-mono text-[11px] text-muted">
                  Correlated via Notice 10/2025 &amp; Res 1447-88-5
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* UAE National Line Card */}
                <div className="frame border border-rule bg-surface-2/50 p-5 rounded-[4px] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-rule">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold uppercase px-2 py-0.5 rounded-[2px] bg-obsidian text-white">
                          UAE (AE)
                        </span>
                        <span className="font-mono text-[11px] text-muted">12-Digit Line</span>
                      </div>
                      <span className="font-mono text-xs font-semibold text-emerald">
                        VAT: 5%
                      </span>
                    </div>

                    <div className="mb-3">
                      <span className="font-mono text-[10px] uppercase text-muted block mb-1">
                        National Tariff Line (Dubai Customs)
                      </span>
                      <p className="font-mono text-sm font-bold text-obsidian">
                        {uaeLine ? formatHsCode(uaeLine.hsCode) : `${selectedEntry.hsCode}.0000`}
                      </p>
                    </div>

                    <p className="text-xs text-obsidian leading-relaxed mb-4">
                      {uaeLine?.descriptionEn || selectedEntry.descriptionEn}
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-rule bg-surface p-3 rounded-[3px]">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-muted">Statutory Duty:</span>
                      <span className="font-semibold text-obsidian">
                        {formatDutyBadge(uaeLine?.dutyRate ?? selectedEntry.dutyRate, uaeLine?.dutyType ?? selectedEntry.dutyType)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-muted">VAT Rate:</span>
                      <span className="font-semibold text-obsidian">5.0%</span>
                    </div>
                    {uaeLine?.exciseRate && uaeLine.exciseRate > 0 ? (
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="text-muted">Excise Tax:</span>
                        <span className="font-semibold text-warning">{(uaeLine.exciseRate * 100).toFixed(0)}%</span>
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-muted">Controlling Authority:</span>
                      <span className="font-medium text-obsidian">{uaeLine?.controllingAuthority || 'MoIAT / Dubai Customs'}</span>
                    </div>
                    <div className="pt-1.5 border-t border-rule font-mono text-[10px] text-muted truncate" title={uaeLine?.sourceCitation}>
                      Ref: {uaeLine?.sourceCitation || 'Customs Notice No. 10/2025'}
                    </div>
                  </div>
                </div>

                {/* Saudi Arabia National Line Card */}
                <div className="frame border border-rule bg-surface-2/50 p-5 rounded-[4px] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-rule">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold uppercase px-2 py-0.5 rounded-[2px] bg-obsidian text-white">
                          Saudi Arabia (SA)
                        </span>
                        <span className="font-mono text-[11px] text-muted">12-Digit Line</span>
                      </div>
                      <span className="font-mono text-xs font-semibold text-warning">
                        VAT: 15%
                      </span>
                    </div>

                    <div className="mb-3">
                      <span className="font-mono text-[10px] uppercase text-muted block mb-1">
                        National Tariff Line (ZATCA)
                      </span>
                      <p className="font-mono text-sm font-bold text-obsidian">
                        {saLine ? formatHsCode(saLine.hsCode) : `${selectedEntry.hsCode}.0000`}
                      </p>
                    </div>

                    <p className="text-xs text-obsidian leading-relaxed mb-4">
                      {saLine?.descriptionEn || selectedEntry.descriptionEn}
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-rule bg-surface p-3 rounded-[3px]">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-muted">Statutory Duty:</span>
                      <span className="font-semibold text-obsidian">
                        {formatDutyBadge(saLine?.dutyRate ?? selectedEntry.dutyRate, saLine?.dutyType ?? selectedEntry.dutyType)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-muted">VAT Rate:</span>
                      <span className="font-semibold text-obsidian">15.0%</span>
                    </div>
                    {saLine?.exciseRate && saLine.exciseRate > 0 ? (
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="text-muted">Excise Tax:</span>
                        <span className="font-semibold text-warning">{(saLine.exciseRate * 100).toFixed(0)}%</span>
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-muted">Controlling Authority:</span>
                      <span className="font-medium text-obsidian">{saLine?.controllingAuthority || 'ZATCA / SFDA / SABER'}</span>
                    </div>
                    <div className="pt-1.5 border-t border-rule font-mono text-[10px] text-muted truncate" title={saLine?.sourceCitation}>
                      Ref: {saLine?.sourceCitation || 'ZATCA Res No. 1447-88-5'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Statutory Differential Callout */}
              <div className="mt-6 p-4 rounded-[4px] border border-rule bg-surface-2/70 flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald mt-1.5 shrink-0" aria-hidden="true" />
                <div className="text-xs text-obsidian space-y-1">
                  <p className="font-semibold">Statutory Difference Callout:</p>
                  <p className="text-muted leading-relaxed">
                    While the 8-digit GCC base ({selectedEntry.formattedCode}) is harmonized across the customs union, the extended 12-digit lines carry significant fiscal divergence: UAE levies standard 5.0% VAT, whereas Saudi Arabia levies 15.0% VAT. Import declarations must strictly quote the respective national 12-digit code.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Section D: Real-Time Landed Cost & Duty Calculator */}
        <section
          aria-labelledby="calculator-heading"
          className="frame border border-rule bg-surface p-6 md:p-10"
        >
          <div className="pb-8 border-b border-rule flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-2">
                <span className="eyebrow-index" aria-hidden="true">
                  <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
                </span>
                Section D &bull; Duty &amp; Landed Tax Engine
              </p>
              <h2 id="calculator-heading" className="font-serif text-title font-semibold text-obsidian">
                GCC Customs Valuation &amp; Landed Cost Breakdown
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-muted">Valuation Currency:</span>
              <div className="inline-flex rounded-[4px] border border-rule bg-surface-2 p-0.5">
                {CURRENCIES.map((curr) => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => setCurrency(curr)}
                    className={`px-3 py-1 font-mono text-xs rounded-[3px] transition-colors cursor-pointer ${
                      currency === curr
                        ? 'bg-obsidian text-white font-semibold'
                        : 'text-muted hover:text-obsidian'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col gap-8">
            {/* CIF Input Box */}
            <div className="max-w-md">
              <label htmlFor="cif-input" className="block font-mono text-xs uppercase tracking-wider text-obsidian font-semibold mb-2">
                Customs CIF Value ({currency}):
              </label>
              <div className="relative">
                <input
                  id="cif-input"
                  type="number"
                  min="0"
                  step="100"
                  value={cifValue || ''}
                  onChange={(e) => setCifValue(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-4 py-3 bg-surface-2/50 border border-rule focus:border-obsidian focus:bg-surface font-mono text-lg font-bold text-obsidian rounded-[4px] outline-none transition-colors"
                  aria-describedby="cif-helper"
                />
                <span className="absolute inset-y-0 end-0 flex items-center pe-4 font-mono text-xs text-muted pointer-events-none">
                  {currency} CIF
                </span>
              </div>
              <p id="cif-helper" className="font-mono text-[11px] text-muted mt-1.5">
                Baseline customs valuation = Cost of Goods + Ocean/Air Freight + Transit Insurance.
              </p>
            </div>

            {/* Side-by-Side Dynamic Calculation Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* UAE Landed Calculation */}
              <div className="frame border border-rule bg-surface p-6 rounded-[4px]">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-rule">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-muted block mb-1">
                      Customs Jurisdiction
                    </span>
                    <h3 className="font-serif text-xl font-bold text-obsidian">
                      United Arab Emirates (AE)
                    </h3>
                  </div>
                  <span className="font-mono text-xs uppercase px-2.5 py-1 rounded-[3px] bg-emerald/10 text-emerald border border-emerald/30 font-semibold">
                    5% VAT
                  </span>
                </div>

                <dl className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between py-1">
                    <dt className="text-muted">1. CIF Valuation Base:</dt>
                    <dd className="font-medium text-obsidian">{formatMoney(uaeCalculation.cifValue, currency)}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-muted">
                      2. Customs Duty ({(uaeCalculation.dutyRate * 100).toFixed(1)}%):
                    </dt>
                    <dd className="font-medium text-obsidian">+ {formatMoney(uaeCalculation.dutyAmount, currency)}</dd>
                  </div>
                  {uaeCalculation.exciseRate > 0 && (
                    <div className="flex justify-between py-1 text-warning">
                      <dt>3. Excise Tax ({(uaeCalculation.exciseRate * 100).toFixed(0)}%):</dt>
                      <dd className="font-medium">+ {formatMoney(uaeCalculation.exciseAmount, currency)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between py-1 border-t border-rule/60 text-muted">
                    <dt>VAT Base (CIF + Duty + Excise):</dt>
                    <dd>{formatMoney(uaeCalculation.vatBase, currency)}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-muted">
                      4. Value Added Tax ({(uaeCalculation.vatRate * 100).toFixed(0)}%):
                    </dt>
                    <dd className="font-medium text-obsidian">+ {formatMoney(uaeCalculation.vatAmount, currency)}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-t border-rule font-semibold text-obsidian">
                    <dt>Total Landed Duties &amp; Taxes:</dt>
                    <dd className="text-emerald">{formatMoney(uaeCalculation.totalDutiesAndTaxes, currency)}</dd>
                  </div>
                  <div className="flex justify-between items-baseline py-3 px-3 bg-surface-2 rounded-[3px] text-sm font-bold text-obsidian">
                    <dt>Total Landed Cost:</dt>
                    <dd className="text-base text-obsidian">{formatMoney(uaeCalculation.totalLandedCost, currency)}</dd>
                  </div>
                  <div className="text-end font-mono text-[10px] text-muted">
                    Effective Combined Rate: {uaeCalculation.effectiveTotalRatePercent.toFixed(2)}%
                  </div>
                </dl>
              </div>

              {/* Saudi Arabia Landed Calculation */}
              <div className="frame border border-rule bg-surface p-6 rounded-[4px]">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-rule">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-muted block mb-1">
                      Customs Jurisdiction
                    </span>
                    <h3 className="font-serif text-xl font-bold text-obsidian">
                      Saudi Arabia (SA)
                    </h3>
                  </div>
                  <span className="font-mono text-xs uppercase px-2.5 py-1 rounded-[3px] bg-warning/10 text-warning border border-warning/30 font-semibold">
                    15% VAT
                  </span>
                </div>

                <dl className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between py-1">
                    <dt className="text-muted">1. CIF Valuation Base:</dt>
                    <dd className="font-medium text-obsidian">{formatMoney(saCalculation.cifValue, currency)}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-muted">
                      2. Customs Duty ({(saCalculation.dutyRate * 100).toFixed(1)}%):
                    </dt>
                    <dd className="font-medium text-obsidian">+ {formatMoney(saCalculation.dutyAmount, currency)}</dd>
                  </div>
                  {saCalculation.exciseRate > 0 && (
                    <div className="flex justify-between py-1 text-warning">
                      <dt>3. Excise Tax ({(saCalculation.exciseRate * 100).toFixed(0)}%):</dt>
                      <dd className="font-medium">+ {formatMoney(saCalculation.exciseAmount, currency)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between py-1 border-t border-rule/60 text-muted">
                    <dt>VAT Base (CIF + Duty + Excise):</dt>
                    <dd>{formatMoney(saCalculation.vatBase, currency)}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-muted">
                      4. Value Added Tax ({(saCalculation.vatRate * 100).toFixed(0)}%):
                    </dt>
                    <dd className="font-medium text-obsidian">+ {formatMoney(saCalculation.vatAmount, currency)}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-t border-rule font-semibold text-obsidian">
                    <dt>Total Landed Duties &amp; Taxes:</dt>
                    <dd className="text-warning">{formatMoney(saCalculation.totalDutiesAndTaxes, currency)}</dd>
                  </div>
                  <div className="flex justify-between items-baseline py-3 px-3 bg-surface-2 rounded-[3px] text-sm font-bold text-obsidian">
                    <dt>Total Landed Cost:</dt>
                    <dd className="text-base text-obsidian">{formatMoney(saCalculation.totalLandedCost, currency)}</dd>
                  </div>
                  <div className="text-end font-mono text-[10px] text-muted">
                    Effective Combined Rate: {saCalculation.effectiveTotalRatePercent.toFixed(2)}%
                  </div>
                </dl>
              </div>
            </div>

            {/* Cross-Border Fiscal Differential Banner */}
            <div className="p-5 border border-rule bg-surface-2/60 rounded-[4px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted block mb-1">
                  Cross-Border Differential Analysis
                </span>
                <p className="text-sm font-medium text-obsidian">
                  Landed duties &amp; taxes in Saudi Arabia are{' '}
                  <span className="font-bold text-obsidian">
                    +{formatMoney(Math.abs(saCalculation.totalDutiesAndTaxes - uaeCalculation.totalDutiesAndTaxes), currency)}
                  </span>{' '}
                  higher than the UAE on equivalent CIF value.
                </p>
              </div>
              <div className="font-mono text-xs text-muted">
                Divergence: +{(saCalculation.effectiveTotalRatePercent - uaeCalculation.effectiveTotalRatePercent).toFixed(2)}% effective rate
              </div>
            </div>
          </div>
        </section>

        {/* Section E: Regulatory Notes & Legal Disclaimers */}
        <section
          aria-labelledby="legal-notes-heading"
          className="frame border border-rule bg-surface p-6 md:p-8"
        >
          <p className="eyebrow mb-2">Section E &bull; Compliance &amp; Authorities</p>
          <h3 id="legal-notes-heading" className="font-serif text-title font-semibold text-obsidian mb-4">
            Controlling Regulatory Authorities &amp; Statutory Disclaimer
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-surface-2/50 border border-rule rounded-[4px]">
              <span className="font-mono text-xs uppercase tracking-wider font-semibold text-obsidian block mb-2">
                Mandatory Clearance Bodies
              </span>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 font-mono text-[10px] uppercase rounded-[3px] bg-surface border border-rule text-obsidian">
                  TDRA (Telecommunications)
                </span>
                <span className="px-2.5 py-1 font-mono text-[10px] uppercase rounded-[3px] bg-surface border border-rule text-obsidian">
                  MoIAT (Industrial Conformity)
                </span>
                <span className="px-2.5 py-1 font-mono text-[10px] uppercase rounded-[3px] bg-surface border border-rule text-obsidian">
                  SFDA (Food &amp; Drugs)
                </span>
                <span className="px-2.5 py-1 font-mono text-[10px] uppercase rounded-[3px] bg-surface border border-rule text-obsidian">
                  ZATCA (Zakat, Tax &amp; Customs)
                </span>
                <span className="px-2.5 py-1 font-mono text-[10px] uppercase rounded-[3px] bg-surface border border-rule text-obsidian">
                  SABER (SASO Conformity)
                </span>
              </div>
            </div>

            <div className="p-4 bg-surface-2/50 border border-rule rounded-[4px]">
              <span className="font-mono text-xs uppercase tracking-wider font-semibold text-obsidian block mb-2">
                Statutory Grounding
              </span>
              <p className="font-mono text-[11px] text-muted leading-relaxed">
                Grounded in Dubai Customs Notice No. 10/2025 &bull; Cabinet Resolution No. (119) of 2024 &bull; ZATCA Ministerial Resolution No. (1447-88-5) &amp; Decision No. (1447-88-7) &bull; Version: {TARIFF_DATASET_META.version}.
              </p>
            </div>
          </div>

          <div className="p-4 border border-rule bg-surface-2/30 rounded-[4px]">
            <p className="text-xs text-muted leading-relaxed">
              <strong className="text-obsidian">Legal Disclaimer:</strong> {TARIFF_DATASET_META.disclaimerEn}
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default HsConverterTool
