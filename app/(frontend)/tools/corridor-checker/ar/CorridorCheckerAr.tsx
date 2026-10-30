'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  type Corridor,
  type TransportMode,
  type ProductRegulationStatus,
  type ItemStatus,
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

const CATEGORY_LABELS_AR: Record<ChecklistCategory, string> = {
  registration: 'التسجيل والتوثيق الإلكتروني',
  pre_shipment_filing: 'تقديم المستندات والمنافيست قبل الشحن',
  commercial_docs: 'المستندات التجارية والفواتير',
  conformity_cert: 'شهادات المطابقة الفنية والفحص',
  labeling: 'بطاقات البيان ودلالة المنشأ',
}

export default function CorridorCheckerAr() {
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
      setEmailError('يرجى إدخال عنوان بريد إلكتروني تجاري صالح.')
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
          locale: 'ar',
        },
      })

      if (result.success) {
        setSubmitted(true)
      } else {
        setEmailError(result.error || 'تعذر إرسال التقرير الجمركي. يرجى المحاولة لاحقاً.')
      }
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء الإرسال.')
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
    <div dir="rtl" className="w-full">
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
            direction: rtl !important;
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
            text-align: right !important;
          }
        }
      `,
        }}
      />

      {/* ── Formal Print Report (Hidden on Screen, Visible on Print) ───────── */}
      <div className="hidden print:block text-black p-6 font-sans" dir="rtl">
        <div className="border-b-2 border-black pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                محرك إكسفورتا للامتثال التجاري والتنظيمي
              </h1>
              <p className="text-xs tracking-wider text-neutral-600 mt-1 font-mono">
                تقرير فجوات الجاهزية الجمركية والتحقق المسبق للشحنات قبل الإبحار
              </p>
            </div>
            <div className="text-start font-mono text-xs">
              <p>التاريخ: {new Date().toISOString().split('T')[0]}</p>
              <p>الحالة التنظيمية: معتمد وفق المعايير الرسمية</p>
            </div>
          </div>
        </div>

        {/* Report Overview Box */}
        <div className="grid grid-cols-2 gap-4 border border-black p-4 mb-6 text-sm font-mono">
          <div>
            <p><strong>مسار الشحن:</strong> {meta.nameAr}</p>
            <p><strong>وسيلة النقل:</strong> {mode === 'sea' ? 'شحن بحري' : 'شحن جوي'}</p>
            <p><strong>الجهة المختصة:</strong> {meta.authority}</p>
            <p><strong>المرجع القانوني:</strong> {meta.legalReference}</p>
          </div>
          <div>
            <p><strong>قرار الجاهزية الجمركية:</strong> {readiness.verdict === 'READY' ? 'جاهز للشحن' : readiness.verdict === 'AT_RISK' ? 'معرض للمخاطر' : 'شحن محظور'}</p>
            <p><strong>نسبة استيفاء المتطلبات:</strong> {readiness.scorePct}%</p>
            <p><strong>المتطلبات الإلزامية المستوفاة:</strong> {readiness.readyCount} / {readiness.totalMandatory}</p>
            <p><strong>المتطلبات الإلزامية المفقودة (المحظورات):</strong> {readiness.blockingItemIds.length}</p>
          </div>
        </div>

        {/* Identifier Checks */}
        {corridor === 'egypt_aci' && (
          <div className="border border-black p-3 mb-6 text-xs font-mono bg-neutral-50">
            <p><strong>رقم التسجيل المسبق (19 رقماً - ACID):</strong> {acidInput || 'لم يتم إدخاله / قيد الإصدار'}</p>
            <p><strong>رقم البطاقة الضريبية للمستورد المصري:</strong> {importerTaxIdInput || 'لم يُحدد'}</p>
          </div>
        )}
        {corridor === 'ksa_saber' && (
          <div className="border border-black p-3 mb-6 text-xs font-mono bg-neutral-50">
            <p><strong>رقم شهادة سابر (PCoC / SCoC):</strong> {saberCertInput || 'لم يتم إدخاله'}</p>
            <p><strong>نطاق اللائحة الفنية للمنتج:</strong> {productStatus === 'regulated' ? 'خاضع للوائح (PCoC+SCoC)' : productStatus === 'non_regulated' ? 'غير خاضع (إقرار SDoC)' : 'معفى'}</p>
          </div>
        )}

        {/* Requirements Table */}
        <table className="print-table text-xs w-full mb-6 font-sans">
          <thead>
            <tr className="bg-neutral-100 font-mono">
              <th className="w-20">الحالة</th>
              <th className="w-1/3">المتطلب التنظيمي والسند القانوني</th>
              <th>الإجراء التشغيلي ومخاطر عدم الامتثال</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const status = documentStatus[item.id] ?? 'missing'
              return (
                <tr key={item.id} className={status === 'missing' && item.isMandatory ? 'bg-neutral-50' : ''}>
                  <td className="font-mono font-bold">
                    {status === 'ready' ? '[مكتمل]' : status === 'pending' ? '[قيد المتابعة]' : '[مفقود]'}
                  </td>
                  <td>
                    <p className="font-bold">{item.titleAr}</p>
                    <p className="text-[10px] text-neutral-600 font-mono mt-0.5">{item.legalReference}</p>
                  </td>
                  <td className="text-[11px]">
                    <p>{item.guidanceAr}</p>
                    {status === 'missing' && item.consequenceOfNonComplianceAr && (
                      <p className="text-red-700 font-semibold mt-1">
                        عقوبة المخالفة: {item.consequenceOfNonComplianceAr}
                      </p>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="text-[10px] text-neutral-500 font-mono border-t border-black pt-2 mt-8">
          تم تحديث وتوثيق البيانات التنظيمية حتى تاريخ {meta.sourceDate}. صيغة رقم ACID المكونة من 19 رقماً مؤقتة وقيد الاعتماد الفني مع نافذة. تتطلب كافة شحنات السعودية شهادة إرسالية SCoC مرتبطة ببوابة فسح. تم إصدار هذا التقرير عبر محرك إكسفورتا للامتثال التجاري.
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
                محرك الامتثال الجمركي الفوري &bull; حساب محلي 100% دون تأخير
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 border border-rule bg-surface hover:border-obsidian text-obsidian transition-colors rounded-[4px] cursor-pointer"
                title="طباعة التقرير أو تصديره بصيغة PDF"
              >
                <svg className="w-3.5 h-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>[ طباعة / PDF ]</span>
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 border border-rule bg-surface hover:border-obsidian text-obsidian transition-colors rounded-[4px] cursor-pointer"
                aria-label={copiedLink ? 'تم نسخ الرابط' : 'نسخ رابط الإعدادات'}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    copiedLink ? 'bg-emerald shadow-[0_0_6px_var(--color-emerald)]' : 'bg-muted'
                  }`}
                  aria-hidden="true"
                />
                <span>{copiedLink ? '[ تم النسخ! ]' : '[ نسخ الرابط للمشاركة ]'}</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 border border-rule hover:border-obsidian text-muted hover:text-obsidian bg-transparent transition-colors rounded-[4px] cursor-pointer"
              >
                [ إعادة ضبط ]
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
                  الخطوة 01 &bull; مسار الشحن ووسيلة النقل
                </p>
                <h2 className="font-serif text-title font-semibold text-obsidian">
                  اختر المسار الجمركي والتنظيمي
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
                  نظام التسجيل المسبق المصري (نافذة ACI)
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
                  منصة سابر السعودية (سليم / فسح)
                </button>
              </div>
            </div>

            {/* Transport Mode & Metadata Row */}
            <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 flex items-center gap-3">
                <span className="font-mono text-xs uppercase tracking-wider text-muted">وسيلة الشحن:</span>
                <div className="inline-flex rounded-[4px] border border-rule bg-surface-2 p-1">
                  <button
                    type="button"
                    onClick={() => setMode('sea')}
                    className={`px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer ${
                      mode === 'sea'
                        ? 'bg-obsidian text-white font-medium'
                        : 'text-muted hover:text-obsidian'
                    }`}
                  >
                    شحن بحري
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('air')}
                    className={`px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer ${
                      mode === 'air'
                        ? 'bg-obsidian text-white font-medium'
                        : 'text-muted hover:text-obsidian'
                    }`}
                  >
                    شحن جوي
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-wrap gap-4 text-xs font-mono text-muted lg:justify-end">
                <span>الجهة التنظيمية: <strong className="text-obsidian">{meta.authority}</strong></span>
                <span>&bull;</span>
                <span>المنصة: <strong className="text-obsidian">{meta.platform}</strong></span>
                <span>&bull;</span>
                <span>السند القانوني: <strong className="text-obsidian">{meta.legalReference}</strong></span>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: Dynamic Readiness Score & Verdict Card ───────────── */}
        <section className="no-print container-site" aria-labelledby="readiness-summary-heading-ar">
          <div className="frame border border-rule bg-surface p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Score Dial & Progress */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted">
                    مؤشر الجاهزية الجمركية
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
                  <span>المتطلبات الإلزامية المستوفاة: {readiness.readyCount} / {readiness.totalMandatory}</span>
                  <span>قيد المتابعة: {readiness.pendingCount}</span>
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
                          قرار الجاهزية: {readiness.verdict === 'READY' ? 'جاهز للشحن والإبحار' : readiness.verdict === 'AT_RISK' ? 'معرض للمخاطر الجمركية' : 'شحن محظور قانوناً'}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted leading-relaxed">
                        {readiness.verdict === 'READY' &&
                          'تم استيفاء وتوثيق كافة المتطلبات التنظيمية والمستندات الإلزامية قبل الشحن. يمكن تحريك الشحنة دون مخاطر رفض في ميناء الوصول.'}
                        {readiness.verdict === 'AT_RISK' &&
                          'لا توجد مخالفات قانونية قاطعة، لكن هناك متطلبات قيد المتابعة أو الفحص. شحن البضاعة قبل اكتمالها قد يعرضها للتأخير وغرامات الأرضيات.'}
                        {readiness.verdict === 'BLOCKED' &&
                          `يوجد ${readiness.blockingItemIds.length} متطلب(ات) إلزامي(ة) مفقود(ة). بموجب اللوائح الجمركية الملزمة، يحظر على الناقلين تحميل الشحنة؛ وسيتم إعادتها قسرياً فور وصولها.`}
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
                الخطوة 02 &bull; التحقق من الأرقام والشهادات الرسمية
              </p>
              <h2 className="font-serif text-title font-semibold text-obsidian">
                {corridor === 'egypt_aci'
                  ? 'التحقق من رقم التسجيل المسبق ACID والبطاقة الضريبية المصرية'
                  : 'التحقق من شهادات منصة سابر ونطاق اللائحة الفنية'}
              </h2>
            </div>

            <div className="py-6">
              {corridor === 'egypt_aci' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Input 1: ACID */}
                    <div className="space-y-2">
                      <label htmlFor="acid-input-ar" className="block font-mono text-xs uppercase tracking-wider text-obsidian font-semibold">
                        رقم التسجيل المسبق للشحنات ACID (19 رقماً)
                      </label>
                      <input
                        id="acid-input-ar"
                        type="text"
                        value={acidInput}
                        onChange={(e) => setAcidInput(e.target.value)}
                        placeholder="مثال: 1234567890123456789"
                        className="w-full px-3.5 py-2.5 bg-surface-2 border border-rule rounded-[4px] font-mono text-sm text-obsidian focus:outline-hidden focus:border-obsidian transition-colors text-start"
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
                              <p className="font-semibold">&bull; صيغة رقمية صحيحة (19 رقماً)</p>
                              <p className="text-[11px] text-muted mt-0.5">
                                [مواصفة مؤقتة] تم التحقق من البنية الرقمية، ويتم الاعتماد النهائي عبر المخلص ونافذة.
                              </p>
                            </div>
                          ) : (
                            <p>&bull; {acidValidation.errorAr || acidValidation.error}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Input 2: Egyptian Importer Tax ID */}
                    <div className="space-y-2">
                      <label htmlFor="tax-id-input-ar" className="block font-mono text-xs uppercase tracking-wider text-obsidian font-semibold">
                        رقم البطاقة الضريبية للمستورد المصري (9 أرقام)
                      </label>
                      <input
                        id="tax-id-input-ar"
                        type="text"
                        value={importerTaxIdInput}
                        onChange={(e) => setImporterTaxIdInput(e.target.value)}
                        placeholder="مثال: 123456789"
                        className="w-full px-3.5 py-2.5 bg-surface-2 border border-rule rounded-[4px] font-mono text-sm text-obsidian focus:outline-hidden focus:border-obsidian transition-colors text-start"
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
                            <p className="font-semibold">&bull; رقم بطاقة ضريبية مصرية صالح (9 أرقام)</p>
                          ) : (
                            <p>&bull; {taxIdValidation.errorAr || taxIdValidation.error}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Regulatory Notice for Egypt */}
                  <div className="border border-rule bg-surface-2/70 p-4 rounded-[4px] text-xs font-mono text-muted space-y-1">
                    <p className="font-semibold text-obsidian">
                      تنبيه تنظيمي ملزم &bull; قرار وزير المالية رقم 38 لسنة 2021
                    </p>
                    <p>
                      &bull; <strong>الشحن البحري:</strong> إصدار رقم ACID إلزامي قبل 48 ساعة على الأقل من تحرك السفينة (سارٍ منذ 1 أكتوبر 2021).
                    </p>
                    <p>
                      &bull; <strong>الشحن الجوي:</strong> تقديم المنافيست الإلكتروني إلزامي قبل 4 ساعات على الأقل من الإقلاع (سارٍ منذ 1 يناير 2026).
                    </p>
                    <p className="text-danger font-medium">
                      &bull; بموجب قانون الجمارك رقم 207 لسنة 2020، يُحظر على الخطوط الملاحية وشركات الطيران تحميل أي شحنة دون رقم ACID؛ والشحنات الواصلة دونه يُعاد تصديرها فوراً على نفقة الناقل أو المصدر دون تفريغ.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Input 1: SABER Certificate */}
                    <div className="space-y-2">
                      <label htmlFor="saber-input-ar" className="block font-mono text-xs uppercase tracking-wider text-obsidian font-semibold">
                        رقم شهادة سابر (PCoC / SCoC)
                      </label>
                      <input
                        id="saber-input-ar"
                        type="text"
                        value={saberCertInput}
                        onChange={(e) => setSaberCertInput(e.target.value)}
                        placeholder="مثال: SASO-PCOC-2026-9812"
                        className="w-full px-3.5 py-2.5 bg-surface-2 border border-rule rounded-[4px] font-mono text-sm text-obsidian focus:outline-hidden focus:border-obsidian transition-colors text-start"
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
                            <p className="font-semibold">&bull; صيغة شهادة سابر صالحة (حروف وأرقام بطول 6&ndash;35 حرفاً)</p>
                          ) : (
                            <p>&bull; {saberValidation.errorAr || saberValidation.error}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Product Regulation Selector */}
                    <div className="space-y-2">
                      <span className="block font-mono text-xs uppercase tracking-wider text-obsidian font-semibold">
                        نطاق الخضوع للوائح الفنية (ساسو)
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
                          خاضع للوائح (PCoC+SCoC)
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
                          غير خاضع (إقرار SDoC)
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
                          معفى
                        </button>
                      </div>
                      <p className="text-[11px] font-mono text-muted">
                        {productStatus === 'regulated' && 'المنتجات الخاضعة تتطلب تقرير فحص مخبري معتمد ISO/IEC 17025 وإصدار شهادة PCoC سنوية عبر جهة تقويم مقبولة.'}
                        {productStatus === 'non_regulated' && 'المنتجات غير الخاضعة تتطلب إقرار مطابقة ذاتي إلكتروني (SDoC) يصدره المستورد مباشرة على منصة سابر.'}
                        {productStatus === 'exempt' && 'المنتجات المعفاة لا تتطلب PCoC/SDoC ولكن تخضع لإجراءات الفحص والبيان الجمركي عبر فسح.'}
                      </p>
                    </div>
                  </div>

                  {/* Regulatory Notice for KSA */}
                  <div className="border border-rule bg-surface-2/70 p-4 rounded-[4px] text-xs font-mono text-muted space-y-1">
                    <p className="font-semibold text-obsidian">
                      تنبيه تنظيمي ملزم &bull; برنامج سلامة المنتجات (سليم) والربط مع بوابة فسح
                    </p>
                    <p>
                      &bull; <strong>إلزامية شهادة الإرسالية (SCoC):</strong> تتطلب كافة الشحنات الواردة للمملكة بنسبة 100% إصدار شهادة مطابقة إرسالية (SCoC) وربطها بالبيان الجمركي عبر فسح.
                    </p>
                    <p>
                      &bull; <strong>دلالة المنشأ والبيانات الإيضاحية:</strong> حفر أو طباعة دلالة منشأ ثابتة غير قابلة للإزالة والبيانات والتحذيرات باللغة العربية إلزامية تماماً على وحدات المنتج والتغليف الخارجي.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── SECTION 4: Interactive Compliance Checklist ──────────────────── */}
        <section className="no-print container-site" aria-labelledby="checklist-title-ar">
          <div className="frame border border-rule bg-surface p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-rule">
              <div>
                <p className="eyebrow mb-1">
                  <span className="eyebrow-index" aria-hidden="true">
                    <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
                  </span>
                  الخطوة 03 &bull; قائمة التحقق التنظيمية وتحليل الفجوات
                </p>
                <h2 id="checklist-title-ar" className="font-serif text-title font-semibold text-obsidian">
                  المتطلبات التنظيمية والإجرائية للشحنة
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
                  الكل ({items.length})
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
                      {cat === 'registration' ? 'التسجيل' : cat === 'pre_shipment_filing' ? 'المستندات' : cat === 'commercial_docs' ? 'الفواتير' : cat === 'conformity_cert' ? 'المطابقة' : 'المنشأ والبيان'} ({count})
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
                      {/* Right: Item Information (in RTL) */}
                      <div className="flex-1 space-y-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-sans text-base font-bold text-obsidian">
                            {item.titleAr}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-[2px] font-mono text-[10px] uppercase tracking-wider font-semibold ${
                              item.isMandatory
                                ? 'bg-danger/10 text-danger border border-danger/20'
                                : 'bg-surface-2 text-muted border border-rule'
                            }`}
                          >
                            {item.isMandatory ? 'إلزامي' : 'تكميلي'}
                          </span>
                          <span className="px-2 py-0.5 rounded-[2px] font-mono text-[10px] uppercase tracking-wider bg-surface-2 text-muted border border-rule">
                            {CATEGORY_LABELS_AR[item.category] || item.category}
                          </span>
                        </div>

                        {/* Statutory Citation */}
                        <div className="text-[11px] font-mono text-muted flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span>السند القانوني: <strong className="text-obsidian">{item.legalReference}</strong></span>
                          <span>&bull;</span>
                          <span>الجهة المختصة: {item.sourceAuthority}</span>
                          <span>&bull;</span>
                          <span>تاريخ التوثيق: {item.sourceDate}</span>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted leading-relaxed">
                          {item.descriptionAr}
                        </p>

                        {/* Practical Guidance */}
                        <div className="p-3 bg-surface-2 border-s-2 border-obsidian rounded-e-[4px] text-xs font-mono text-muted">
                          <strong className="text-obsidian">الإجراء التشغيلي:</strong> {item.guidanceAr}
                        </div>

                        {/* Consequence of Non-Compliance (Prominently shown when status is missing) */}
                        {status === 'missing' && item.consequenceOfNonComplianceAr && (
                          <div className="p-3 bg-danger/5 border border-danger/30 rounded-[4px] text-xs font-mono text-danger flex items-start gap-2.5">
                            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div>
                              <strong className="uppercase">مخاطر عدم الاستيفاء:</strong>{' '}
                              <span>{item.consequenceOfNonComplianceAr}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Left: Status Toggle Controls */}
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
                          مكتمل
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
                          قيد المتابعة
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
                          مفقود
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
                  تقرير الفجوات التنظيمية
                </p>
                <h2 className="font-serif text-title font-semibold text-obsidian">
                  أرسل لي هذا التقرير الجمركي عبر البريد الإلكتروني
                </h2>
                <p className="text-sm text-muted mt-2">
                  احصل على نسخة رقمية مهيكلة وجاهزة للطباعة من تقرير تحليل الفجوات، وتابع أحدث التحديثات الجمركية في الشرق الأوسط.
                </p>
              </div>

              {submitted ? (
                <div className="p-4 border border-emerald/40 bg-emerald/5 rounded-[4px] text-center font-mono text-xs text-emerald space-y-1">
                  <p className="font-bold text-sm">تم تسجيل وإرسال التقرير بنجاح!</p>
                  <p className="text-muted">
                    سجلنا نتائج فحص الجاهزية لمسار {corridor === 'egypt_aci' ? 'مصر (ACI)' : 'السعودية (سابر)'} لحساب <strong>{email}</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="user-email-ar" className="block font-mono text-xs uppercase tracking-wider text-obsidian mb-1">
                        البريد الإلكتروني للعمل <span className="text-danger">*</span>
                      </label>
                      <input
                        id="user-email-ar"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="trade.director@company.com"
                        className="w-full px-3.5 py-2.5 bg-surface-2 border border-rule rounded-[4px] font-sans text-sm text-obsidian focus:outline-hidden focus:border-obsidian transition-colors text-start"
                      />
                    </div>
                    <div>
                      <label htmlFor="user-company-ar" className="block font-mono text-xs uppercase tracking-wider text-obsidian mb-1">
                        اسم الشركة (اختياري)
                      </label>
                      <input
                        id="user-company-ar"
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="شركة التجارة الدولية"
                        className="w-full px-3.5 py-2.5 bg-surface-2 border border-rule rounded-[4px] font-sans text-sm text-obsidian focus:outline-hidden focus:border-obsidian transition-colors text-start"
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
                      {submitting ? '[ جاري تجهيز وإرسال التقرير... ]' : '[ إرسال تقرير الامتثال الجمركي ]'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
