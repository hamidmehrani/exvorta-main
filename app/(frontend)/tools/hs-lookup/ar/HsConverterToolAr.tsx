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

const PRESET_CHIPS_AR = [
  { code: '39011010', label: 'بوليمرات LLDPE' },
  { code: '84713000', label: 'حواسيب محمولة' },
  { code: '71081200', label: 'سبائك الذهب' },
  { code: '85171300', label: 'هواتف ذكية' },
  { code: '09041100', label: 'الفلفل والبهارات' },
  { code: '22029910', label: 'مشروبات الطاقة' },
] as const

const CURRENCIES = ['AED', 'SAR', 'USD', 'EUR'] as const
type SupportedCurrency = (typeof CURRENCIES)[number]

const CURRENCY_LABELS_AR: Record<SupportedCurrency, string> = {
  AED: 'درهم إماراتي (AED)',
  SAR: 'ريال سعودي (SAR)',
  USD: 'دولار أمريكي (USD)',
  EUR: 'يورو (EUR)',
}

function formatMoney(amount: number, currency: string): string {
  return `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`
}

function formatDutyBadgeAr(dutyRate: number, dutyType: string): string {
  if (dutyType === 'exempt' || dutyRate === 0) return 'معفى (0%)'
  const pct = Math.round(dutyRate * 100)
  if (pct > 5) return `${pct}% رسم حمائي`
  return `${pct}% رسم جمركي`
}

export function HsConverterToolAr() {
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
    <div dir="rtl" lang="ar" className="w-full flex flex-col gap-12 md:gap-16">
      {/* Action Toolbar */}
      <div className="w-full border-y border-rule bg-surface-2/60 py-4">
        <div className="container-site flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald animate-pulse" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
              محرك التعرفة الجمركية لدول مجلس التعاون &bull; إشعار جمارك دبي 10/2025 &bull; قرار هيئة الزكاة 1447-88-5
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider px-3.5 py-2 border border-rule bg-surface text-obsidian hover:border-obsidian transition-colors rounded-[4px] cursor-pointer"
              aria-label={copiedLink ? 'تم نسخ الرابط إلى الحافظة' : 'نسخ رابط الإعدادات للمشاركة'}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  copiedLink ? 'bg-emerald shadow-[0_0_6px_var(--color-emerald)]' : 'bg-muted'
                }`}
                aria-hidden="true"
              />
              <span>{copiedLink ? '[ تم النسخ! ]' : '[ نسخ الرابط المشارك ]'}</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="font-mono text-[11px] uppercase tracking-wider px-3.5 py-2 border border-rule hover:border-obsidian text-muted hover:text-obsidian bg-transparent transition-colors rounded-[4px] cursor-pointer"
            >
              [ إعادة تعيين ]
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="container-site flex flex-col gap-12">
        {/* Search & Filter Header Section */}
        <section aria-labelledby="tariff-search-heading-ar" className="frame border border-rule bg-surface p-6 md:p-8">
          <p className="eyebrow mb-2">
            <span className="eyebrow-index" aria-hidden="true">
              <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
            </span>
            البند الأول &bull; البحث في بنود التعرفة والتصفية الجغرافية
          </p>
          <h2 id="tariff-search-heading-ar" className="font-serif text-title font-semibold text-obsidian mb-6">
            البحث في بنود النظام المنسق للتعرفة الجمركية
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
                placeholder="ابحث برمز النظام المنسق (4 أو 6 أو 8 أرقام مثل 3901 أو 8471.30) أو باسم السلعة (حاسوب، بوليمر، ذهب)..."
                className="w-full ps-11 pe-10 py-3.5 bg-surface-2/50 border border-rule focus:border-obsidian focus:bg-surface text-obsidian text-sm placeholder:text-muted rounded-[4px] outline-none transition-colors"
                aria-label="البحث في رموز التعرفة أو مسميات السلع"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-muted hover:text-obsidian transition-colors cursor-pointer"
                  aria-label="مسح حقل البحث"
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
                  النطاق الجغرافي:
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
                  كافة دول المجلس
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
                  الإمارات (AE)
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
                  السعودية (SA)
                </button>
              </div>

              {/* Quick Preset Chips */}
              <div className="flex items-center flex-wrap gap-1.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted me-1">
                  سلع متكررة:
                </span>
                {PRESET_CHIPS_AR.map((chip) => {
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
          {/* Commodity List / Search Matches (5 cols) */}
          <section
            aria-labelledby="commodity-results-heading-ar"
            className="lg:col-span-5 frame border border-rule bg-surface p-5 md:p-6 flex flex-col"
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-rule">
              <div>
                <p className="eyebrow mb-1">دليل السلع والبنود</p>
                <h3 id="commodity-results-heading-ar" className="font-serif text-lg font-semibold text-obsidian">
                  بنود التعرفة والسلع المطابقة
                </h3>
              </div>
              <span className="font-mono text-[11px] text-muted px-2 py-0.5 bg-surface-2 border border-rule rounded-[3px]">
                {searchResults.length} بند مطابق
              </span>
            </div>

            {searchResults.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <p className="font-mono text-sm text-muted mb-2">[ لا توجد بنود تعرفة مطابقة للبحث ]</p>
                <p className="text-xs text-muted max-w-xs mx-auto mb-4">
                  جرب البحث برمز البند الجمركي المكون من 4 أرقام (مثل &quot;3901&quot; أو &quot;8471&quot;) أو باسم السلعة (&quot;حاسوب&quot;، &quot;ذهب&quot;).
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="font-mono text-xs uppercase tracking-wider px-3 py-1.5 border border-rule text-obsidian hover:border-obsidian rounded-[3px] cursor-pointer"
                >
                  مسح معايير البحث
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
                          <span dir="ltr" className="font-mono text-xs font-semibold text-obsidian tracking-wide">
                            {entry.formattedCode}
                          </span>
                          <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded-[2px] bg-obsidian/5 text-muted border border-rule">
                            {entry.jurisdiction === 'GCC' ? 'دول المجلس' : entry.jurisdiction === 'AE' ? 'الإمارات' : 'السعودية'}
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
                          {formatDutyBadgeAr(entry.dutyRate, entry.dutyType)}
                        </span>
                      </div>
                      <p className="text-xs text-obsidian font-normal line-clamp-2 leading-relaxed">
                        {entry.descriptionAr}
                      </p>
                      {entry.controllingAuthority && (
                        <div className="mt-2 flex items-center gap-1.5">
                          <span className="font-mono text-[10px] text-muted">الهيئة المختصة:</span>
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

          {/* 8→12 Digit Conversion Breakdown Panel (7 cols) */}
          <section
            aria-labelledby="conversion-breakdown-heading-ar"
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
                    البند الثاني &bull; البند الموحد لدول مجلس التعاون (8 أرقام)
                  </p>
                  <div className="flex items-center gap-3">
                    <h3 id="conversion-breakdown-heading-ar" dir="ltr" className="font-mono text-2xl font-bold text-obsidian tracking-tight">
                      {selectedEntry.formattedCode}
                    </h3>
                    <span className="font-mono text-xs uppercase px-2 py-0.5 rounded-[3px] bg-obsidian/5 border border-rule text-muted">
                      التعرفة الجمركية الموحدة (8 أرقام)
                    </span>
                  </div>
                </div>
                <div className="text-start sm:text-end">
                  <span className="font-mono text-xs text-muted block mb-1">نسبة الرسم الجمركي الموحد</span>
                  <span
                    className={`inline-block font-mono text-sm px-3 py-1 rounded-[3px] font-semibold border ${
                      selectedEntry.dutyType === 'exempt'
                        ? 'bg-emerald/10 text-emerald border-emerald/30'
                        : selectedEntry.dutyRate > 0.05
                        ? 'bg-warning/10 text-warning border-warning/30'
                        : 'bg-surface-2 text-obsidian border-rule'
                    }`}
                  >
                    {formatDutyBadgeAr(selectedEntry.dutyRate, selectedEntry.dutyType)}
                  </span>
                </div>
              </div>

              <div className="pt-6">
                <p className="text-sm md:text-base text-obsidian leading-relaxed mb-4">
                  {selectedEntry.descriptionAr}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-rule bg-surface-2/40 p-4 rounded-[4px]">
                  <div>
                    <span className="font-mono text-[10px] uppercase text-muted block mb-1">الهيئة المختصة</span>
                    <span className="font-mono text-xs text-obsidian font-medium">
                      {selectedEntry.controllingAuthority || 'لجنة الاتحاد الجمركي الخليجي'}
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase text-muted block mb-1">السند القانوني</span>
                    <span className="font-mono text-xs text-obsidian">
                      {selectedEntry.sourceCitation}
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase text-muted block mb-1">تاريخ النفاذ</span>
                    <span dir="ltr" className="font-mono text-xs text-obsidian">
                      {selectedEntry.effectiveDate}
                    </span>
                  </div>
                </div>
                {selectedEntry.notes && (
                  <p className="mt-3 text-xs text-muted italic">
                    ملاحظة: {selectedEntry.notes}
                  </p>
                )}
              </div>
            </div>

            {/* 12-Digit National Subdivisions Comparison */}
            <div className="frame border border-rule bg-surface p-6 md:p-8">
              <div className="pb-6 mb-6 border-b border-rule flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <p className="eyebrow mb-1">البند الثالث &bull; البنود الوطنية الممتدة (8 إلى 12 رقماً)</p>
                  <h3 className="font-serif text-title font-semibold text-obsidian">
                    بنود التعرفة الوطنية المعتمدة (الإمارات مقابل السعودية)
                  </h3>
                </div>
                <span className="font-mono text-[11px] text-muted">
                  متطابقة وفقاً لإشعار 10/2025 والقرار 1447-88-5
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* UAE National Line Card */}
                <div className="frame border border-rule bg-surface-2/50 p-5 rounded-[4px] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-rule">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold uppercase px-2 py-0.5 rounded-[2px] bg-obsidian text-white">
                          الإمارات (AE)
                        </span>
                        <span className="font-mono text-[11px] text-muted">بند وطني ممتد</span>
                      </div>
                      <span className="font-mono text-xs font-semibold text-emerald">
                        ضريبة: 5%
                      </span>
                    </div>

                    <div className="mb-3">
                      <span className="font-mono text-[10px] uppercase text-muted block mb-1">
                        رمز التعرفة الوطنية (جمارك دبي)
                      </span>
                      <p dir="ltr" className="font-mono text-sm font-bold text-obsidian text-end">
                        {uaeLine ? formatHsCode(uaeLine.hsCode) : `${selectedEntry.hsCode}.0000`}
                      </p>
                    </div>

                    <p className="text-xs text-obsidian leading-relaxed mb-4">
                      {uaeLine?.descriptionAr || selectedEntry.descriptionAr}
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-rule bg-surface p-3 rounded-[3px]">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-muted">الرسم الجمركي النظامي:</span>
                      <span className="font-semibold text-obsidian">
                        {formatDutyBadgeAr(uaeLine?.dutyRate ?? selectedEntry.dutyRate, uaeLine?.dutyType ?? selectedEntry.dutyType)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-muted">نسبة ضريبة القيمة المضافة:</span>
                      <span className="font-semibold text-obsidian">5.0%</span>
                    </div>
                    {uaeLine?.exciseRate && uaeLine.exciseRate > 0 ? (
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="text-muted">الضريبة الانتقائية:</span>
                        <span className="font-semibold text-warning">{(uaeLine.exciseRate * 100).toFixed(0)}%</span>
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-muted">الهيئة المختصة:</span>
                      <span className="font-medium text-obsidian">{uaeLine?.controllingAuthority || 'وزارة الصناعة / جمارك دبي'}</span>
                    </div>
                    <div className="pt-1.5 border-t border-rule font-mono text-[10px] text-muted truncate" title={uaeLine?.sourceCitation}>
                      المرجع: {uaeLine?.sourceCitation || 'إشعار جمركي رقم 10/2025'}
                    </div>
                  </div>
                </div>

                {/* Saudi Arabia National Line Card */}
                <div className="frame border border-rule bg-surface-2/50 p-5 rounded-[4px] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-rule">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold uppercase px-2 py-0.5 rounded-[2px] bg-obsidian text-white">
                          السعودية (SA)
                        </span>
                        <span className="font-mono text-[11px] text-muted">بند وطني ممتد</span>
                      </div>
                      <span className="font-mono text-xs font-semibold text-warning">
                        ضريبة: 15%
                      </span>
                    </div>

                    <div className="mb-3">
                      <span className="font-mono text-[10px] uppercase text-muted block mb-1">
                        رمز التعرفة الوطنية (هيئة الزكاة والضريبة والجمارك)
                      </span>
                      <p dir="ltr" className="font-mono text-sm font-bold text-obsidian text-end">
                        {saLine ? formatHsCode(saLine.hsCode) : `${selectedEntry.hsCode}.0000`}
                      </p>
                    </div>

                    <p className="text-xs text-obsidian leading-relaxed mb-4">
                      {saLine?.descriptionAr || selectedEntry.descriptionAr}
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-rule bg-surface p-3 rounded-[3px]">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-muted">الرسم الجمركي النظامي:</span>
                      <span className="font-semibold text-obsidian">
                        {formatDutyBadgeAr(saLine?.dutyRate ?? selectedEntry.dutyRate, saLine?.dutyType ?? selectedEntry.dutyType)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-muted">نسبة ضريبة القيمة المضافة:</span>
                      <span className="font-semibold text-obsidian">15.0%</span>
                    </div>
                    {saLine?.exciseRate && saLine.exciseRate > 0 ? (
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="text-muted">الضريبة الانتقائية:</span>
                        <span className="font-semibold text-warning">{(saLine.exciseRate * 100).toFixed(0)}%</span>
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-muted">الهيئة المختصة:</span>
                      <span className="font-medium text-obsidian">{saLine?.controllingAuthority || 'هيئة الزكاة والضريبة والجمارك / سابر'}</span>
                    </div>
                    <div className="pt-1.5 border-t border-rule font-mono text-[10px] text-muted truncate" title={saLine?.sourceCitation}>
                      المرجع: {saLine?.sourceCitation || 'قرار وزاري رقم 1447-88-5'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Statutory Differential Callout */}
              <div className="mt-6 p-4 rounded-[4px] border border-rule bg-surface-2/70 flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald mt-1.5 shrink-0" aria-hidden="true" />
                <div className="text-xs text-obsidian space-y-1">
                  <p className="font-semibold">تنبيه الفروق التشريعية بين الدولتين:</p>
                  <p className="text-muted leading-relaxed">
                    على الرغم من تطابق البند الأساسي لدول مجلس التعاون ({selectedEntry.formattedCode}) في التعرفة الموحدة، إلا أن البنود الوطنية الممتدة (12 رقماً) تختلف في التطبيق الضريبي: تفرض الإمارات ضريبة قيمة مضافة بنسبة 5.0%، بينما تفرض المملكة العربية السعودية نسبة 15.0%. يجب استخدام البند الممتد (12 رقماً) المعتمد في كل دولة عند تقديم البيان الجمركي.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Section D: Real-Time Landed Cost & Duty Calculator */}
        <section
          aria-labelledby="calculator-heading-ar"
          className="frame border border-rule bg-surface p-6 md:p-10"
        >
          <div className="pb-8 border-b border-rule flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-2">
                <span className="eyebrow-index" aria-hidden="true">
                  <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
                </span>
                البند الرابع &bull; حاسبة الرسوم الجمركية وتكاليف الوصول
              </p>
              <h2 id="calculator-heading-ar" className="font-serif text-title font-semibold text-obsidian">
                احتساب القيمة الجمركية وتكاليف الوصول (Landed Cost) في دول المجلس
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-muted">عملة التقييم:</span>
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
              <label htmlFor="cif-input-ar" className="block font-mono text-xs uppercase tracking-wider text-obsidian font-semibold mb-2">
                القيمة سيف الجمركية (CIF) - {CURRENCY_LABELS_AR[currency]}:
              </label>
              <div className="relative">
                <input
                  id="cif-input-ar"
                  type="number"
                  min="0"
                  step="100"
                  value={cifValue || ''}
                  onChange={(e) => setCifValue(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-4 py-3 bg-surface-2/50 border border-rule focus:border-obsidian focus:bg-surface font-mono text-lg font-bold text-obsidian rounded-[4px] outline-none transition-colors"
                  aria-describedby="cif-helper-ar"
                />
                <span className="absolute inset-y-0 end-0 flex items-center pe-4 font-mono text-xs text-muted pointer-events-none">
                  {currency} CIF
                </span>
              </div>
              <p id="cif-helper-ar" className="font-mono text-[11px] text-muted mt-1.5">
                أساس التقييم الجمركي = ثمن البضاعة + نولون الشحن البحري أو الجوي + قسط التأمين أثناء النقل.
              </p>
            </div>

            {/* Side-by-Side Dynamic Calculation Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* UAE Landed Calculation */}
              <div className="frame border border-rule bg-surface p-6 rounded-[4px]">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-rule">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-muted block mb-1">
                      النطاق الجمركي
                    </span>
                    <h3 className="font-serif text-xl font-bold text-obsidian">
                      دولة الإمارات العربية المتحدة (AE)
                    </h3>
                  </div>
                  <span className="font-mono text-xs uppercase px-2.5 py-1 rounded-[3px] bg-emerald/10 text-emerald border border-emerald/30 font-semibold">
                    5% ضريبة
                  </span>
                </div>

                <dl className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between py-1">
                    <dt className="text-muted">1. أساس التقييم سيف (CIF):</dt>
                    <dd className="font-medium text-obsidian">{formatMoney(uaeCalculation.cifValue, currency)}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-muted">
                      2. الرسوم الجمركية ({(uaeCalculation.dutyRate * 100).toFixed(1)}%):
                    </dt>
                    <dd className="font-medium text-obsidian">+ {formatMoney(uaeCalculation.dutyAmount, currency)}</dd>
                  </div>
                  {uaeCalculation.exciseRate > 0 && (
                    <div className="flex justify-between py-1 text-warning">
                      <dt>3. الضريبة الانتقائية ({(uaeCalculation.exciseRate * 100).toFixed(0)}%):</dt>
                      <dd className="font-medium">+ {formatMoney(uaeCalculation.exciseAmount, currency)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between py-1 border-t border-rule/60 text-muted">
                    <dt>وعاء ضريبة القيمة المضافة (سيف + الرسوم + الانتقائية):</dt>
                    <dd>{formatMoney(uaeCalculation.vatBase, currency)}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-muted">
                      4. ضريبة القيمة المضافة ({(uaeCalculation.vatRate * 100).toFixed(0)}%):
                    </dt>
                    <dd className="font-medium text-obsidian">+ {formatMoney(uaeCalculation.vatAmount, currency)}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-t border-rule font-semibold text-obsidian">
                    <dt>إجمالي التكاليف والرسوم الجمركية المقدرة:</dt>
                    <dd className="text-emerald">{formatMoney(uaeCalculation.totalDutiesAndTaxes, currency)}</dd>
                  </div>
                  <div className="flex justify-between items-baseline py-3 px-3 bg-surface-2 rounded-[3px] text-sm font-bold text-obsidian">
                    <dt>إجمالي تكلفة الوصول (Total Landed Cost):</dt>
                    <dd className="text-base text-obsidian">{formatMoney(uaeCalculation.totalLandedCost, currency)}</dd>
                  </div>
                  <div className="text-end font-mono text-[10px] text-muted">
                    المعدل الضريبي الإجمالي الفعلي: {uaeCalculation.effectiveTotalRatePercent.toFixed(2)}%
                  </div>
                </dl>
              </div>

              {/* Saudi Arabia Landed Calculation */}
              <div className="frame border border-rule bg-surface p-6 rounded-[4px]">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-rule">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-muted block mb-1">
                      النطاق الجمركي
                    </span>
                    <h3 className="font-serif text-xl font-bold text-obsidian">
                      المملكة العربية السعودية (SA)
                    </h3>
                  </div>
                  <span className="font-mono text-xs uppercase px-2.5 py-1 rounded-[3px] bg-warning/10 text-warning border border-warning/30 font-semibold">
                    15% ضريبة
                  </span>
                </div>

                <dl className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between py-1">
                    <dt className="text-muted">1. أساس التقييم سيف (CIF):</dt>
                    <dd className="font-medium text-obsidian">{formatMoney(saCalculation.cifValue, currency)}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-muted">
                      2. الرسوم الجمركية ({(saCalculation.dutyRate * 100).toFixed(1)}%):
                    </dt>
                    <dd className="font-medium text-obsidian">+ {formatMoney(saCalculation.dutyAmount, currency)}</dd>
                  </div>
                  {saCalculation.exciseRate > 0 && (
                    <div className="flex justify-between py-1 text-warning">
                      <dt>3. الضريبة الانتقائية ({(saCalculation.exciseRate * 100).toFixed(0)}%):</dt>
                      <dd className="font-medium">+ {formatMoney(saCalculation.exciseAmount, currency)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between py-1 border-t border-rule/60 text-muted">
                    <dt>وعاء ضريبة القيمة المضافة (سيف + الرسوم + الانتقائية):</dt>
                    <dd>{formatMoney(saCalculation.vatBase, currency)}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-muted">
                      4. ضريبة القيمة المضافة ({(saCalculation.vatRate * 100).toFixed(0)}%):
                    </dt>
                    <dd className="font-medium text-obsidian">+ {formatMoney(saCalculation.vatAmount, currency)}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-t border-rule font-semibold text-obsidian">
                    <dt>إجمالي التكاليف والرسوم الجمركية المقدرة:</dt>
                    <dd className="text-warning">{formatMoney(saCalculation.totalDutiesAndTaxes, currency)}</dd>
                  </div>
                  <div className="flex justify-between items-baseline py-3 px-3 bg-surface-2 rounded-[3px] text-sm font-bold text-obsidian">
                    <dt>إجمالي تكلفة الوصول (Total Landed Cost):</dt>
                    <dd className="text-base text-obsidian">{formatMoney(saCalculation.totalLandedCost, currency)}</dd>
                  </div>
                  <div className="text-end font-mono text-[10px] text-muted">
                    المعدل الضريبي الإجمالي الفعلي: {saCalculation.effectiveTotalRatePercent.toFixed(2)}%
                  </div>
                </dl>
              </div>
            </div>

            {/* Cross-Border Fiscal Differential Banner */}
            <div className="p-5 border border-rule bg-surface-2/60 rounded-[4px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted block mb-1">
                  تحليل الفروق المالية العابرة للحدود
                </span>
                <p className="text-sm font-medium text-obsidian">
                  إجمالي الرسوم والضرائب الجمركية في المملكة العربية السعودية أعلى بمقدار{' '}
                  <span className="font-bold text-obsidian">
                    +{formatMoney(Math.abs(saCalculation.totalDutiesAndTaxes - uaeCalculation.totalDutiesAndTaxes), currency)}
                  </span>{' '}
                  عن دولة الإمارات لنفس القيمة سيف (CIF).
                </p>
              </div>
              <div className="font-mono text-xs text-muted">
                فارق النسبة الفعالة: +{(saCalculation.effectiveTotalRatePercent - uaeCalculation.effectiveTotalRatePercent).toFixed(2)}%
              </div>
            </div>
          </div>
        </section>

        {/* Section E: Regulatory Notes & Legal Disclaimers */}
        <section
          aria-labelledby="legal-notes-heading-ar"
          className="frame border border-rule bg-surface p-6 md:p-8"
        >
          <p className="eyebrow mb-2">البند الخامس &bull; الامتثال والجهات الرقابية المختصة</p>
          <h3 id="legal-notes-heading-ar" className="font-serif text-title font-semibold text-obsidian mb-4">
            الهيئات والجهات الرقابية المختصة والإشعار القانوني
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-surface-2/50 border border-rule rounded-[4px]">
              <span className="font-mono text-xs uppercase tracking-wider font-semibold text-obsidian block mb-2">
                جهات الفسح الإلزامية
              </span>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 font-mono text-[10px] uppercase rounded-[3px] bg-surface border border-rule text-obsidian">
                  TDRA (تنظيم الاتصالات والحكومة الرقمية)
                </span>
                <span className="px-2.5 py-1 font-mono text-[10px] uppercase rounded-[3px] bg-surface border border-rule text-obsidian">
                  MoIAT (وزارة الصناعة والتكنولوجيا المتقدمة)
                </span>
                <span className="px-2.5 py-1 font-mono text-[10px] uppercase rounded-[3px] bg-surface border border-rule text-obsidian">
                  SFDA (الهيئة العامة للغذاء والدواء)
                </span>
                <span className="px-2.5 py-1 font-mono text-[10px] uppercase rounded-[3px] bg-surface border border-rule text-obsidian">
                  ZATCA (هيئة الزكاة والضريبة والجمارك)
                </span>
                <span className="px-2.5 py-1 font-mono text-[10px] uppercase rounded-[3px] bg-surface border border-rule text-obsidian">
                  SABER (منصة سابر / المواصفات السعودية)
                </span>
              </div>
            </div>

            <div className="p-4 bg-surface-2/50 border border-rule rounded-[4px]">
              <span className="font-mono text-xs uppercase tracking-wider font-semibold text-obsidian block mb-2">
                المرجعية التشريعية والنظامية
              </span>
              <p className="font-mono text-[11px] text-muted leading-relaxed">
                مستند إلى إشعار جمارك دبي رقم 10/2025 &bull; قرار مجلس الوزراء رقم (119) لسنة 2024 &bull; قرار وزير المالية ورئيس مجلس إدارة هيئة الزكاة والضريبة والجمارك رقم (1447-88-5) والقرار رقم (1447-88-7) &bull; إصدار البيانات: {TARIFF_DATASET_META.version}.
              </p>
            </div>
          </div>

          <div className="p-4 border border-rule bg-surface-2/30 rounded-[4px]">
            <p className="text-xs text-muted leading-relaxed">
              <strong className="text-obsidian">إشعار قانوني:</strong> {TARIFF_DATASET_META.disclaimerAr}
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default HsConverterToolAr
