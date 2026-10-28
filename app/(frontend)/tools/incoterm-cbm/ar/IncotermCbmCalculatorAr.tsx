'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  INCOTERMS,
  listIncoterms,
  getIncoterm,
  calculateCbm,
  calculateChargeableWeight,
  estimateContainerFit,
  serializeToolState,
  deserializeToolState,
  type IncotermCode,
  type TransportMode,
  type CargoItem,
  type Party,
  type IncotermResponsibilities,
} from '@/lib/tools/incoterm-cbm'

interface ArabicIncotermInfo {
  code: IncotermCode
  nameAr: string
  descriptionAr: string
  riskTransferAr: string
}

const INCOTERMS_AR_INFO: Record<IncotermCode, ArabicIncotermInfo> = {
  EXW: {
    code: 'EXW',
    nameAr: 'تسليم في المنشأة (Ex Works)',
    descriptionAr:
      'يضع البائع البضائع تحت تصرف المشتري في مقر البائع أو مستودعه. يتحمل المشتري كامل التكاليف والمخاطر من منشأة البائع حتى الوجهة النهائية.',
    riskTransferAr: 'منشأة ومستودع البائع (عند وضع البضائع تحت تصرف المشتري)',
  },
  FCA: {
    code: 'FCA',
    nameAr: 'تسليم للناقل (Free Carrier)',
    descriptionAr:
      'يسلم البائع البضائع مخلصة للتصدير إلى الناقل المعين من قِبل المشتري في المكان المتفق عليه. يتحمل المشتري تكاليف ومخاطر النقل الرئيسي.',
    riskTransferAr: 'عند تسليم البضائع للناقل الأول المعين من المشتري في المكان المحدد',
  },
  CPT: {
    code: 'CPT',
    nameAr: 'أجور النقل مدفوعة إلى (Carriage Paid To)',
    descriptionAr:
      'يدفع البائع تكلفة الشحن والنقل حتى وجهة الوصول المحددة، بينما تنتقل المخاطر للمشتري بمجرد تسليم الشحنة للناقل الأول في بلد المنشأ.',
    riskTransferAr: 'عند تسليم البضائع للناقل الأول في بلد المنشأ (قبل النقل الرئيسي)',
  },
  CIP: {
    code: 'CIP',
    nameAr: 'أجور النقل والتأمين مدفوعة إلى (Carriage and Insurance Paid To)',
    descriptionAr:
      'يدفع البائع تكاليف الشحن الدولي ووثيقة التأمين الشامل (وفق شروط معهد أ) حتى الوجهة. تنتقل المخاطر للمشتري عند التسليم للناقل الأول.',
    riskTransferAr: 'عند تسليم البضائع للناقل الأول في بلد المنشأ (مع التزام البائع بتأمين شامل)',
  },
  DAP: {
    code: 'DAP',
    nameAr: 'تسليم في المكان المحدد (Delivered At Place)',
    descriptionAr:
      'يسلم البائع البضائع جاهزة للتفريغ في المكان المتفق عليه بالوجهة. يتولى المشتري إجراءات التخليص الجمركي للاستيراد والرسوم والضرائب.',
    riskTransferAr: 'عند وصول وسيلة النقل جاهزة للتفريغ في نقطة الوصول المحددة',
  },
  DPU: {
    code: 'DPU',
    nameAr: 'تسليم في المكان مفرغة (Delivered at Place Unloaded)',
    descriptionAr:
      'يسلم البائع البضائع مفرغة من وسيلة النقل في الوجهة المحددة. هذه هي القاعدة الوحيدة التي تلزم البائع بتفريغ البضائع.',
    riskTransferAr: 'بعد إتمام تفريغ البضائع من وسيلة النقل في الوجهة المحددة',
  },
  DDP: {
    code: 'DDP',
    nameAr: 'تسليم مع دفع الرسوم الجمركية (Delivered Duty Paid)',
    descriptionAr:
      'يسلم البائع البضائع مخلصة جمركياً للاستيراد مع سداد جميع الرسوم والضرائب في الوجهة النهائية. تمثل هذه القاعدة أقصى التزام يقع على البائع.',
    riskTransferAr: 'في الوجهة النهائية المحددة بعد استكمال التخليص الجمركي وسداد الرسوم',
  },
  FAS: {
    code: 'FAS',
    nameAr: 'تسليم بجانب السفينة (Free Alongside Ship)',
    descriptionAr:
      'يسلم البائع البضائع بجانب سفينة الشحن على رصيف ميناء الشحن المحدد. مخصصة للنقل البحري والمائي الداخلي فقط.',
    riskTransferAr: 'بجانب السفينة على رصيف ميناء الشحن المحدد في بلد المنشأ',
  },
  FOB: {
    code: 'FOB',
    nameAr: 'تسليم على ظهر السفينة (Free On Board)',
    descriptionAr:
      'يسلم البائع البضائع محملة على متن السفينة بميناء الشحن المعين. تنتقل المخاطر والتكاليف للمشتري فور عبور البضائع حاجز السفينة واستقرارها على متنها.',
    riskTransferAr: 'على ظهر السفينة في ميناء الشحن المحدد بمجرد استقرار الشحنة على المتن',
  },
  CFR: {
    code: 'CFR',
    nameAr: 'التكلفة وأجور الشحن (Cost and Freight)',
    descriptionAr:
      'يدفع البائع نولون الشحن البحري حتى ميناء الوصول، لكن المخاطر تنتقل إلى المشتري بمجرد تحميل البضائع على ظهر السفينة في ميناء الشحن.',
    riskTransferAr: 'على ظهر السفينة في ميناء الشحن (المخاطر تنتقل عند الشحن، والنولون يدفعه البائع)',
  },
  CIF: {
    code: 'CIF',
    nameAr: 'التكلفة والتأمين وأجور الشحن (Cost, Insurance and Freight)',
    descriptionAr:
      'يدفع البائع نولون الشحن البحري وتأمين النقل البحري (شرط ج) حتى ميناء المقصد، بينما تنتقل المخاطر للمشتري على ظهر سفينة الشحن.',
    riskTransferAr: 'على ظهر السفينة بميناء الشحن (المخاطر تنتقل عند التحميل، مع التزام البائع بالتأمين)',
  },
}

interface ArabicStageMeta {
  key: keyof IncotermResponsibilities
  labelAr: string
  descriptionAr: string
  riskPointAr: string
}

const OBLIGATION_STAGES_AR: ArabicStageMeta[] = [
  {
    key: 'exportPackaging',
    labelAr: 'التعبئة والتغليف',
    descriptionAr: 'تجهيز وتغليف ووسم البضائع بما يتوافق مع المعايير الدولية للنقل والتصدير.',
    riskPointAr: 'في منشأة ومستودع البائع قبل بدء أي عمليات نقل',
  },
  {
    key: 'loadingOrigin',
    labelAr: 'التحميل في المنشأة',
    descriptionAr: 'تحميل البضائع والطرود على وسيلة النقل الأولى في مقر أو مستودع المنشأ.',
    riskPointAr: 'أثناء عملية التحميل أو فور الانتهاء منها بمقر البائع',
  },
  {
    key: 'exportClearance',
    labelAr: 'التخليص الجمركي للتصدير',
    descriptionAr: 'استخراج وثائق وبيانات وتراخيص التصدير والامتثال الجمركي في بلد المنشأ.',
    riskPointAr: 'عند إتمام إجراءات الجمارك التصديرية وإفراج المنفذ',
  },
  {
    key: 'mainCarriage',
    labelAr: 'الشحن والنقل الرئيسي',
    descriptionAr: 'أجور وتكاليف النقل الدولي الرئيسي بين ميناء/محطة المغادرة ومحطة الوصول.',
    riskPointAr: 'تنتقل المخاطر إما عند الشحن (FOB/CFR/CIF) أو عند الوصول (DAP/DDP)',
  },
  {
    key: 'cargoInsurance',
    labelAr: 'التأمين على البضائع',
    descriptionAr: 'شراء وثيقة التأمين البحري أو الجوي ضد أخطار التلف والضياع أثناء النقل.',
    riskPointAr: 'تغطية المخاطر طوال مسار الشحن الدولي',
  },
  {
    key: 'importClearance',
    labelAr: 'التخليص الجمركي للاستيراد',
    descriptionAr: 'إنهاء المعاملات والإفراج الجمركي وتقديم الإقرارات في بلد المقصد.',
    riskPointAr: 'في المنفذ الجمركي لبلد الاستيراد قبل الإفراج',
  },
  {
    key: 'destinationTerminalCharges',
    labelAr: 'التوصيل إلى الوجهة النهائية',
    descriptionAr: 'نقل وتوصيل الشحنة من ميناء الوصول أو المحطة إلى مقر المشتري المحدد.',
    riskPointAr: 'عند وصول وسيلة النقل إلى مقر المشتري أو المستودع النهائي',
  },
  {
    key: 'unloadingDestination',
    labelAr: 'التفريغ في الوجهة',
    descriptionAr: 'تنزيل وتفريغ البضائع من وسيلة النقل في مقر المشتري أو موقع التسليم النهائي.',
    riskPointAr: 'بعد إتمام التفريغ الكامل للبضائع وتسليمها فعلياً',
  },
]

interface ContainerCardSpec {
  id: string
  nameAr: string
  code: string
  usableCbm: number
  internalCbm: number
  maxPayloadKg: number
}

const CONTAINER_CARDS: ContainerCardSpec[] = [
  {
    id: '20ft',
    nameAr: 'حاوية 20 قدم قياسية (20ft)',
    code: '20ft',
    usableCbm: 28.0,
    internalCbm: 33.2,
    maxPayloadKg: 25000,
  },
  {
    id: '40ft',
    nameAr: 'حاوية 40 قدم قياسية (40ft)',
    code: '40ft',
    usableCbm: 58.0,
    internalCbm: 67.7,
    maxPayloadKg: 26500,
  },
  {
    id: '40hc',
    nameAr: 'حاوية 40 قدم عالية السقف (40HC)',
    code: '40hc',
    usableCbm: 68.0,
    internalCbm: 76.4,
    maxPayloadKg: 26500,
  },
  {
    id: '45hc',
    nameAr: 'حاوية 45 قدم عالية السقف (45HC)',
    code: '45hc',
    usableCbm: 75.0,
    internalCbm: 86.0,
    maxPayloadKg: 27600,
  },
]

interface ExtendedCargoItem extends CargoItem {
  description?: string
}

const DEFAULT_ITEMS: ExtendedCargoItem[] = [
  { id: 'cargo-1', description: 'طرد تجاري قياسي', pieces: 10, length: 50, width: 40, height: 30, unit: 'cm', weightKg: 15 },
]

export function IncotermCbmCalculatorAr() {
  const searchParams = useSearchParams()

  // Initialize state from URL query parameters if present, or defaults
  const parsedInitial = useMemo(() => {
    return deserializeToolState(searchParams?.toString())
  }, [searchParams])

  const initialCode: IncotermCode = parsedInitial.incoterm && getIncoterm(parsedInitial.incoterm)
    ? (parsedInitial.incoterm as IncotermCode)
    : 'FOB'

  const initialMode: TransportMode = parsedInitial.transportMode || 'sea'
  const initialItems: ExtendedCargoItem[] = parsedInitial.items && parsedInitial.items.length > 0
    ? parsedInitial.items.map((it, idx) => ({ ...it, description: `طرد #${idx + 1}` }))
    : DEFAULT_ITEMS

  const [selectedCode, setSelectedCode] = useState<IncotermCode>(initialCode)
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'multimodal' | 'sea_inland_waterway'>('all')
  const [transportMode, setTransportMode] = useState<TransportMode>(initialMode)
  const [cargoItems, setCargoItems] = useState<ExtendedCargoItem[]>(initialItems)
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg')
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedReport, setCopiedReport] = useState(false)

  // Reactive URL query parameter synchronization
  useEffect(() => {
    if (typeof window === 'undefined') return
    const query = serializeToolState({
      incoterm: selectedCode,
      transportMode,
      items: cargoItems,
    })
    const newPath = query ? `${window.location.pathname}?${query}` : window.location.pathname
    window.history.replaceState(null, '', newPath)
  }, [selectedCode, transportMode, cargoItems])

  // Calculations
  const incotermDef = useMemo(() => INCOTERMS[selectedCode] || INCOTERMS.FOB, [selectedCode])
  const incotermAr = useMemo(() => INCOTERMS_AR_INFO[selectedCode] || INCOTERMS_AR_INFO.FOB, [selectedCode])
  const incotermsList = useMemo(() => listIncoterms(), [])

  const filteredIncoterms = useMemo(() => {
    if (categoryFilter === 'all') return incotermsList
    return incotermsList.filter(item => item.category === categoryFilter)
  }, [incotermsList, categoryFilter])

  const cbmResult = useMemo(() => calculateCbm(cargoItems), [cargoItems])
  const chargeableResult = useMemo(() => {
    return calculateChargeableWeight(cbmResult.totalWeightKg, cbmResult.totalCbm, transportMode)
  }, [cbmResult.totalWeightKg, cbmResult.totalCbm, transportMode])

  const containerResult = useMemo(() => {
    return estimateContainerFit(cbmResult.totalCbm, cbmResult.totalWeightKg)
  }, [cbmResult.totalCbm, cbmResult.totalWeightKg])

  // Cargo Item Management
  const handleAddItem = useCallback(() => {
    setCargoItems(prev => [
      ...prev,
      {
        id: `cargo-${Date.now()}-${prev.length + 1}`,
        description: `طرد #${prev.length + 1}`,
        pieces: 1,
        length: 60,
        width: 40,
        height: 40,
        unit: 'cm',
        weightKg: 10,
      },
    ])
  }, [])

  const handleRemoveItem = useCallback((indexToRemove: number) => {
    setCargoItems(prev => {
      if (prev.length <= 1) return prev
      return prev.filter((_, idx) => idx !== indexToRemove)
    })
  }, [])

  const handleUpdateItem = useCallback((index: number, updates: Partial<ExtendedCargoItem>) => {
    setCargoItems(prev => {
      const next = [...prev]
      next[index] = { ...next[index], ...updates }
      return next
    })
  }, [])

  const handleGlobalUnitChange = useCallback((unit: 'cm' | 'in') => {
    setCargoItems(prev => prev.map(item => ({ ...item, unit })))
  }, [])

  // Link copy
  const handleCopyLink = useCallback(async () => {
    if (typeof window === 'undefined') return
    const query = serializeToolState({
      incoterm: selectedCode,
      transportMode,
      items: cargoItems,
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
        // clipboard fallback
      }
    }
  }, [selectedCode, transportMode, cargoItems])

  // Reset
  const handleReset = useCallback(() => {
    setSelectedCode('FOB')
    setCategoryFilter('all')
    setTransportMode('sea')
    setCargoItems(DEFAULT_ITEMS)
    setWeightUnit('kg')
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  // Formatted report string in Arabic
  const reportSummaryText = useMemo(() => {
    const modeLabel = transportMode === 'sea'
      ? 'شحن بحري (LCL)'
      : transportMode === 'air'
        ? 'شحن جوي'
        : 'شحن سريع / كوريير'

    const basisLabel = chargeableResult.chargeableBasis === 'volumetric'
      ? 'الوزن الحجمي معتمد'
      : 'الوزن الفعلي معتمد'

    const containerRec = containerResult.isLclRecommended
      ? 'يوصى بالشحن الجزئي (LCL - Less than Container Load)'
      : `حاوية كاملة (FCL): ${containerResult.optimalCombination.summary}`

    return [
      '=== تقرير الشحنة وتقدير الحجم — إكسفورتا (Exvorta) ===',
      `• شرط التجارة الدولية (Incoterms 2020): ${selectedCode} — ${incotermAr.nameAr}`,
      `• وسيلة الشحن والنقل: ${modeLabel}`,
      `• إجمالي عدد الطرود: ${cbmResult.totalPieces}`,
      `• إجمالي الحجم (CBM): ${cbmResult.totalCbm.toFixed(3)} m³`,
      `• الوزن الإجمالي الفعلي: ${cbmResult.totalWeightKg.toFixed(1)} kg`,
      `• الوزن الحجمي: ${chargeableResult.volumetricWeightKg.toFixed(1)} kg`,
      `• الوزن الخاضع للرسوم: ${chargeableResult.chargeableWeightKg.toFixed(1)} kg (${basisLabel})`,
      `• نقطة انتقال المخاطر: ${incotermAr.riskTransferAr}`,
      `• توصية الحاويات: ${containerRec}`,
      '',
      'صادر عبر إكسفورتا • Issued via Exvorta',
    ].join('\n')
  }, [
    selectedCode,
    incotermAr,
    transportMode,
    cbmResult,
    chargeableResult,
    containerResult,
  ])

  // Copy report handler
  const handleCopyReport = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(reportSummaryText)
      setCopiedReport(true)
      setTimeout(() => setCopiedReport(false), 2500)
    } catch {
      try {
        const textArea = document.createElement('textarea')
        textArea.value = reportSummaryText
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setCopiedReport(true)
        setTimeout(() => setCopiedReport(false), 2500)
      } catch {
        // clipboard fallback
      }
    }
  }, [reportSummaryText])

  const renderPartyBadge = (party: Party) => {
    if (party === 'seller') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider font-semibold rounded-[3px] bg-emerald/10 text-emerald border border-emerald/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald" aria-hidden="true" />
          التزام البائع
        </span>
      )
    }
    if (party === 'buyer') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded-[3px] bg-obsidian/5 text-muted border border-rule">
          <span className="w-1.5 h-1.5 rounded-full bg-muted" aria-hidden="true" />
          التزام المشتري
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider font-medium rounded-[3px] bg-warning/10 text-warning border border-warning/30">
        <span className="w-1.5 h-1.5 rounded-full bg-warning" aria-hidden="true" />
        قابل للتفاوض
      </span>
    )
  }

  return (
    <div dir="rtl" className="w-full flex flex-col gap-16 md:gap-24">
      {/* Action Toolbar: Share & Reset */}
      <div className="w-full border-y border-rule bg-surface-2/60 py-4">
        <div className="container-site flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald animate-pulse" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
              محرك تجاري فوري من جانب العميل • استجابة فورية دون تأخير
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider px-3.5 py-2 border border-rule bg-surface text-obsidian hover:border-obsidian transition-colors rounded-[4px] cursor-pointer"
              aria-label={copiedLink ? 'تم نسخ الرابط إلى الحافظة' : 'نسخ رابط الإعدادات المباشر'}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  copiedLink ? 'bg-emerald shadow-[0_0_6px_var(--color-emerald)]' : 'bg-muted'
                }`}
                aria-hidden="true"
              />
              <span>{copiedLink ? '[ تم النسخ! ]' : '[ نسخ رابط الإعدادات ]'}</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="font-mono text-[11px] uppercase tracking-wider px-3.5 py-2 border border-rule hover:border-obsidian text-muted hover:text-obsidian bg-transparent transition-colors rounded-[4px] cursor-pointer"
            >
              [ إعادة ضبط ]
            </button>
          </div>
        </div>
      </div>

      {/* SECTION A: Step 1 - Incoterms 2020 Responsibility Matrix */}
      <section className="container-site" aria-labelledby="section-incoterms-title">
        <div className="frame border border-rule bg-surface p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-rule">
            <div>
              <p className="eyebrow mb-2">
                <span className="eyebrow-index" aria-hidden="true">
                  <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
                </span>
                الخطوة 1 • مصفوفة Incoterms 2020
              </p>
              <h2 id="section-incoterms-title" className="font-serif text-title font-semibold text-obsidian">
                الخطوة 1: مصفوفة شروط التجارة الدولية (Incoterms 2020)
              </h2>
              <p className="mt-2 text-sm text-muted font-light max-w-2xl">
                حدد قاعدة الإنكوتيرمز لعرض تقسيم المسؤوليات ونقطة انتقال المخاطر بين البائع والمشتري.
              </p>
            </div>

            {/* Filter by Category */}
            <div className="flex flex-wrap items-center gap-1.5 bg-surface-2 p-1 border border-rule rounded-[4px] self-start md:self-auto">
              <button
                type="button"
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors rounded-[2px] cursor-pointer ${
                  categoryFilter === 'all'
                    ? 'bg-obsidian text-white font-semibold'
                    : 'text-muted hover:text-obsidian'
                }`}
              >
                الكل (11)
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('multimodal')}
                className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors rounded-[2px] cursor-pointer ${
                  categoryFilter === 'multimodal'
                    ? 'bg-obsidian text-white font-semibold'
                    : 'text-muted hover:text-obsidian'
                }`}
              >
                أي وسيلة نقل (7)
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('sea_inland_waterway')}
                className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors rounded-[2px] cursor-pointer ${
                  categoryFilter === 'sea_inland_waterway'
                    ? 'bg-obsidian text-white font-semibold'
                    : 'text-muted hover:text-obsidian'
                }`}
              >
                النقل البحري والنهري (4)
              </button>
            </div>
          </div>

          {/* Incoterm Selector Grid */}
          <div className="py-8">
            <label className="field-label mb-3 block">اختر قاعدة الإنكوتيرمز (Incoterms 2020):</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2">
              {filteredIncoterms.map(term => {
                const isSelected = term.code === selectedCode
                return (
                  <button
                    key={term.code}
                    type="button"
                    onClick={() => setSelectedCode(term.code)}
                    className={`flex flex-col items-center justify-center p-3 border rounded-[4px] transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-obsidian text-white border-obsidian shadow-sm ring-1 ring-obsidian'
                        : 'bg-surface hover:bg-surface-2 text-obsidian border-rule hover:border-obsidian/40'
                    }`}
                  >
                    <span className="font-mono text-base font-bold tracking-wider">{term.code}</span>
                    <span className={`text-[10px] font-mono tracking-wide mt-1 ${isSelected ? 'text-white/70' : 'text-muted'}`}>
                      {term.category === 'multimodal' ? 'أي وسيلة' : 'بحري/نهري'}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Active Incoterm Details Banner */}
          <div className="border border-rule bg-surface-2 p-6 rounded-[4px] mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="font-mono text-2xl font-bold px-3 py-1 bg-obsidian text-white rounded-[3px]">
                  {incotermAr.code}
                </span>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-obsidian">{incotermAr.nameAr}</h3>
                  <span className="font-mono text-[11px] tracking-wider text-muted block mt-0.5">
                    {incotermDef.category === 'multimodal'
                      ? 'أي وسيلة نقل (نقل متعدد الوسائط متوافق مع كافة وسائط الشحن)'
                      : 'النقل البحري والمائي الداخلي فقط'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald" aria-hidden="true" /> التزام البائع
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-muted" aria-hidden="true" /> التزام المشتري
                </span>
              </div>
            </div>

            {/* Risk Transfer Point Feature Callout */}
            <div className="mt-4 pt-4 border-t border-rule flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-semibold text-obsidian">نقطة انتقال المخاطر:</span>
                <span className="text-sm font-medium text-emerald">{incotermAr.riskTransferAr}</span>
              </div>
            </div>

            <p className="mt-3 text-sm text-obsidian/80 font-light border-t border-rule pt-3 leading-relaxed">
              {incotermAr.descriptionAr}
            </p>
          </div>

          {/* Incoterms Responsibility Matrix Table */}
          <div className="overflow-x-auto border border-rule rounded-[4px]">
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className="bg-surface-2 border-b border-rule font-mono text-[11px] uppercase tracking-wider text-muted">
                  <th scope="col" className="p-4 text-start font-medium w-16">#</th>
                  <th scope="col" className="p-4 text-start font-medium w-1/4">المرحلة / الالتزام</th>
                  <th scope="col" className="p-4 text-start font-medium">نطاق المسؤولية والوصف</th>
                  <th scope="col" className="p-4 text-start font-medium w-1/4">نقطة انتقال المخاطر</th>
                  <th scope="col" className="p-4 text-end font-medium w-40">الطرف المسؤول</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule font-sans text-sm">
                {OBLIGATION_STAGES_AR.map((stage, idx) => {
                  const party = incotermDef.responsibilities[stage.key]
                  return (
                    <tr key={stage.key} className="hover:bg-surface-2/40 transition-colors">
                      <td className="p-4 font-mono text-xs text-muted">{String(idx + 1).padStart(2, '0')}</td>
                      <td className="p-4 font-semibold text-obsidian">{stage.labelAr}</td>
                      <td className="p-4 text-muted font-light text-xs md:text-sm leading-relaxed">{stage.descriptionAr}</td>
                      <td className="p-4 text-muted font-mono text-xs leading-relaxed">{stage.riskPointAr}</td>
                      <td className="p-4 text-end">{renderPartyBadge(party)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION B: Step 2 - Cargo Dimensions & CBM Math */}
      <section className="container-site" aria-labelledby="section-cbm-title">
        <div className="frame border border-rule bg-surface p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-rule">
            <div>
              <p className="eyebrow mb-2">
                <span className="eyebrow-index" aria-hidden="true">
                  <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
                </span>
                الخطوة 2 • الحجم والوزن الخاضع للرسوم
              </p>
              <h2 id="section-cbm-title" className="font-serif text-title font-semibold text-obsidian">
                الخطوة 2: حاسبة الحجم (CBM) وملاءمة الحاويات
              </h2>
              <p className="mt-2 text-sm text-muted font-light max-w-2xl">
                أدخل أبعاد ووزن الطرود لحساب الحجم الكلي والوزن الخاضع للرسوم وتقدير السعة الاستيعابية للحاويات.
              </p>
            </div>

            {/* Quick Global Unit Selectors */}
            <div className="flex flex-wrap items-center gap-4 self-start md:self-auto">
              {/* Dimensions Unit */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted">الأبعاد:</span>
                <div className="flex border border-rule rounded-[4px] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => handleGlobalUnitChange('cm')}
                    className="px-2.5 py-1 font-mono text-xs hover:bg-surface-2 text-obsidian cursor-pointer"
                  >
                    سم
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGlobalUnitChange('in')}
                    className="px-2.5 py-1 font-mono text-xs border-s border-rule hover:bg-surface-2 text-obsidian cursor-pointer"
                  >
                    بوصة
                  </button>
                </div>
              </div>

              {/* Weight Unit */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted">الوزن:</span>
                <div className="flex border border-rule rounded-[4px] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setWeightUnit('kg')}
                    className={`px-2.5 py-1 font-mono text-xs cursor-pointer ${
                      weightUnit === 'kg' ? 'bg-obsidian text-white font-semibold' : 'hover:bg-surface-2 text-obsidian'
                    }`}
                  >
                    كجم
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeightUnit('lb')}
                    className={`px-2.5 py-1 font-mono text-xs border-s border-rule cursor-pointer ${
                      weightUnit === 'lb' ? 'bg-obsidian text-white font-semibold' : 'hover:bg-surface-2 text-obsidian'
                    }`}
                  >
                    رطل
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="py-6 border-b border-rule">
            <label className="field-label mb-3 block">وسيلة الشحن ومعدل الكثافة الحجمية:</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  mode: 'sea' as const,
                  label: 'الشحن البحري (LCL)',
                  factor: '1 CBM = 1,000 kg',
                  desc: 'المعيار القياسي للشحن البحري التجميعي',
                },
                {
                  mode: 'air' as const,
                  label: 'الشحن الجوي',
                  factor: '1 CBM = 167 kg',
                  desc: 'معيار اتحاد النقل الجوي الدولي IATA (1:6000)',
                },
                {
                  mode: 'courier' as const,
                  label: 'الشحن السريع / البريد',
                  factor: '1 CBM = 200 kg',
                  desc: 'معيار الشحن السريع والكوريير (1:5000)',
                },
              ].map(item => {
                const isActive = transportMode === item.mode
                return (
                  <button
                    key={item.mode}
                    type="button"
                    onClick={() => setTransportMode(item.mode)}
                    className={`p-4 border rounded-[4px] text-start transition-all cursor-pointer ${
                      isActive
                        ? 'bg-obsidian text-white border-obsidian ring-1 ring-obsidian'
                        : 'bg-surface hover:bg-surface-2 text-obsidian border-rule'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">{item.label}</span>
                      <span
                        className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-[2px] ${
                          isActive ? 'bg-white/20 text-white' : 'bg-surface-2 text-muted border border-rule'
                        }`}
                      >
                        {item.factor}
                      </span>
                    </div>
                    <p className={`text-xs font-light ${isActive ? 'text-white/70' : 'text-muted'}`}>{item.desc}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Cargo Items Table / List */}
          <div className="py-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="field-label">قائمة الطرود والبضائع ({cargoItems.length}):</span>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider px-3.5 py-1.5 bg-obsidian text-white hover:bg-obsidian/90 transition-colors rounded-[3px] cursor-pointer"
              >
                <span>+</span> إضافة طرد جديد
              </button>
            </div>

            {cargoItems.map((item, idx) => {
              const breakdown = cbmResult.breakdown[idx]
              const currentWeightDisplay = item.weightKg !== undefined
                ? weightUnit === 'lb'
                  ? Number((item.weightKg * 2.20462).toFixed(2))
                  : item.weightKg
                : ''

              return (
                <div
                  key={item.id || idx}
                  className="p-4 border border-rule bg-surface-2/40 rounded-[4px] flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold px-2 py-1 bg-surface border border-rule rounded-[2px]">
                      #{idx + 1}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-7 gap-3 flex-1">
                    {/* Description / Package */}
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-[10px] font-mono text-muted mb-1">الوصف / الطرد</label>
                      <input
                        type="text"
                        value={item.description || ''}
                        onChange={e => handleUpdateItem(idx, { description: e.target.value })}
                        className="field min-h-[40px] px-2 text-sm w-full"
                        placeholder="طرد تجاري"
                      />
                    </div>

                    {/* Pieces / Quantity */}
                    <div>
                      <label className="block text-[10px] font-mono text-muted mb-1">الكمية</label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={item.pieces || ''}
                        onChange={e => handleUpdateItem(idx, { pieces: Math.max(1, parseInt(e.target.value, 10) || 0) })}
                        className="field min-h-[40px] px-2 text-sm w-full"
                        placeholder="1"
                      />
                    </div>

                    {/* Length */}
                    <div>
                      <label className="block text-[10px] font-mono text-muted mb-1">
                        الطول ({item.unit === 'in' ? 'بوصة' : 'سم'})
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.length || ''}
                        onChange={e => handleUpdateItem(idx, { length: Math.max(0, parseFloat(e.target.value) || 0) })}
                        className="field min-h-[40px] px-2 text-sm w-full"
                        placeholder="0"
                      />
                    </div>

                    {/* Width */}
                    <div>
                      <label className="block text-[10px] font-mono text-muted mb-1">
                        العرض ({item.unit === 'in' ? 'بوصة' : 'سم'})
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.width || ''}
                        onChange={e => handleUpdateItem(idx, { width: Math.max(0, parseFloat(e.target.value) || 0) })}
                        className="field min-h-[40px] px-2 text-sm w-full"
                        placeholder="0"
                      />
                    </div>

                    {/* Height */}
                    <div>
                      <label className="block text-[10px] font-mono text-muted mb-1">
                        الارتفاع ({item.unit === 'in' ? 'بوصة' : 'سم'})
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.height || ''}
                        onChange={e => handleUpdateItem(idx, { height: Math.max(0, parseFloat(e.target.value) || 0) })}
                        className="field min-h-[40px] px-2 text-sm w-full"
                        placeholder="0"
                      />
                    </div>

                    {/* Dimension Unit */}
                    <div>
                      <label className="block text-[10px] font-mono text-muted mb-1">الوحدة</label>
                      <select
                        value={item.unit}
                        onChange={e => handleUpdateItem(idx, { unit: e.target.value as 'cm' | 'in' })}
                        className="field min-h-[40px] px-2 text-sm w-full"
                      >
                        <option value="cm">سم (cm)</option>
                        <option value="in">بوصة (in)</option>
                      </select>
                    </div>

                    {/* Weight per Unit */}
                    <div>
                      <label className="block text-[10px] font-mono text-muted mb-1">
                        الوزن للوحدة ({weightUnit === 'lb' ? 'رطل' : 'كجم'})
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={currentWeightDisplay}
                        onChange={e => {
                          if (e.target.value === '') {
                            handleUpdateItem(idx, { weightKg: undefined })
                          } else {
                            const val = Math.max(0, parseFloat(e.target.value) || 0)
                            const convertedKg = weightUnit === 'lb' ? val / 2.20462 : val
                            handleUpdateItem(idx, { weightKg: convertedKg })
                          }
                        }}
                        className="field min-h-[40px] px-2 text-sm w-full"
                        placeholder="اختياري"
                      />
                    </div>
                  </div>

                  {/* Row Actions & Metrics */}
                  <div className="flex items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 border-rule pt-3 lg:pt-0">
                    <div className="text-start lg:text-end">
                      <span className="block font-mono text-xs font-semibold text-obsidian">
                        {breakdown ? `${breakdown.totalCbm.toFixed(3)} m³` : '0.000 m³'}
                      </span>
                      <span className="block font-mono text-[10px] text-muted">
                        {breakdown?.totalWeightKg
                          ? weightUnit === 'lb'
                            ? `${(breakdown.totalWeightKg * 2.20462).toFixed(1)} lb إجمالي`
                            : `${breakdown.totalWeightKg.toFixed(1)} kg إجمالي`
                          : 'بدون وزن'}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={cargoItems.length <= 1}
                      onClick={() => handleRemoveItem(idx)}
                      className={`font-mono text-xs px-2.5 py-1.5 border rounded-[3px] transition-colors ${
                        cargoItems.length <= 1
                          ? 'opacity-30 border-rule text-muted cursor-not-allowed'
                          : 'border-rule hover:border-danger hover:text-danger text-muted cursor-pointer'
                      }`}
                      aria-label={`حذف الطرد رقم ${idx + 1}`}
                    >
                      حذف
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Live Calculated Metrics Cards Display */}
          <div className="mt-8 pt-8 border-t border-rule grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* 1. Total CBM */}
            <div className="p-4 border border-rule bg-surface-2 rounded-[4px]">
              <span className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1">
                إجمالي الحجم (CBM)
              </span>
              <span className="font-mono text-2xl font-bold text-emerald">
                {cbmResult.totalCbm.toFixed(3)} m³
              </span>
              <span className="block text-xs text-muted mt-1">متر مكعب إجمالي للشحنة</span>
            </div>

            {/* 2. Total Actual Weight */}
            <div className="p-4 border border-rule bg-surface-2 rounded-[4px]">
              <span className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1">
                الوزن الإجمالي الفعلي
              </span>
              <span className="font-mono text-2xl font-bold text-obsidian">
                {cbmResult.totalWeightKg.toFixed(1)} kg
              </span>
              <span className="block text-xs text-muted mt-1">
                {weightUnit === 'lb' ? `(${(cbmResult.totalWeightKg * 2.20462).toFixed(1)} lb)` : 'الوزن الحقيقي للبضائع'}
              </span>
            </div>

            {/* 3. Volumetric Air Weight */}
            <div className="p-4 border border-rule bg-surface-2 rounded-[4px]">
              <span className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1">
                الوزن الحجمي (الشحن الجوي 1:6000)
              </span>
              <span className="font-mono text-2xl font-bold text-obsidian">
                {(cbmResult.totalCbm * 167).toFixed(1)} kg
              </span>
              <span className="block text-xs text-muted mt-1">معيار الكثافة للشحن الجوي</span>
            </div>

            {/* 4. Volumetric Sea Weight */}
            <div className="p-4 border border-rule bg-surface-2 rounded-[4px]">
              <span className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1">
                الوزن الحجمي (الشحن البحري LCL)
              </span>
              <span className="font-mono text-2xl font-bold text-obsidian">
                {(cbmResult.totalCbm * 1000).toFixed(1)} kg
              </span>
              <span className="block text-xs text-muted mt-1">طن وزني لكل 1 متر مكعب</span>
            </div>

            {/* 5. Chargeable Weight */}
            <div className="p-4 border border-rule bg-surface-2 rounded-[4px] relative overflow-hidden">
              <span className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1">
                الوزن الخاضع للرسوم
              </span>
              <span className="font-mono text-2xl font-bold text-obsidian">
                {chargeableResult.chargeableWeightKg.toFixed(1)} kg
              </span>
              <div className="mt-1">
                <span
                  className={`inline-block font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-[2px] ${
                    chargeableResult.chargeableBasis === 'volumetric'
                      ? 'bg-warning/15 text-warning font-semibold border border-warning/30'
                      : 'bg-emerald/15 text-emerald font-semibold border border-emerald/30'
                  }`}
                >
                  [{chargeableResult.chargeableBasis === 'volumetric' ? 'الوزن الحجمي يطبق' : 'الوزن الفعلي يطبق'}]
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C: Container-Fit Estimator */}
      <section className="container-site" aria-labelledby="section-container-title">
        <div className="frame frame-dark border border-rule-dark bg-obsidian text-white p-6 md:p-10 rounded-[4px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-rule-dark">
            <div>
              <p className="eyebrow eyebrow-dark mb-2">
                <span className="eyebrow-index" aria-hidden="true">
                  <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
                </span>
                القسم 3 • معدات النقل البحري
              </p>
              <h2 id="section-container-title" className="font-serif text-title font-semibold text-white">
                تقدير ملاءمة وسعة الحاويات البحرية
              </h2>
              <p className="mt-2 text-sm text-muted-dark font-light max-w-2xl">
                محاكاة استيعاب حاويات الشحن القياسية ISO وتوصيات فورية للاختيار بين الشحن الجزئي (LCL) والحاوية الكاملة (FCL).
              </p>
            </div>

            {/* Recommendation Highlight Pill */}
            <div className="self-start md:self-auto">
              <div
                className={`px-4 py-3 border rounded-[4px] ${
                  containerResult.isLclRecommended
                    ? 'border-warning/40 bg-warning/10 text-warning'
                    : 'border-emerald/40 bg-emerald/10 text-emerald'
                }`}
              >
                <span className="block font-mono text-[10px] uppercase tracking-widest font-semibold">
                  توصية الشحن الرئيسية:
                </span>
                <span className="font-mono text-sm font-bold">
                  {containerResult.isLclRecommended
                    ? 'يوصى بالشحن الجزئي (LCL - Less than Container Load)'
                    : `حاوية كاملة (FCL): ${containerResult.primarySuggestion}`}
                </span>
              </div>
            </div>
          </div>

          {/* 4 Container Size Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
            {CONTAINER_CARDS.map(spec => {
              const utilPct = Number(((cbmResult.totalCbm / spec.usableCbm) * 100).toFixed(1))
              const weightUtilPct = cbmResult.totalWeightKg > 0
                ? Number(((cbmResult.totalWeightKg / spec.maxPayloadKg) * 100).toFixed(1))
                : undefined

              const fits = utilPct <= 100 && (weightUtilPct === undefined || weightUtilPct <= 100)

              // Estimate max pieces that can fit in this container
              const avgPieceCbm = cbmResult.totalPieces > 0 ? cbmResult.totalCbm / cbmResult.totalPieces : 0
              const maxPieces = avgPieceCbm > 0 ? Math.floor(spec.usableCbm / avgPieceCbm) : 0

              return (
                <div
                  key={spec.id}
                  className="p-6 border border-rule-dark bg-sidebar rounded-[4px] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-rule-dark">
                      <h3 className="font-mono text-sm font-bold text-white">{spec.nameAr}</h3>
                      <span
                        className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-[2px] ${
                          fits
                            ? 'bg-emerald/20 text-emerald border border-emerald/30'
                            : 'bg-warning/20 text-warning border border-warning/30'
                        }`}
                      >
                        {fits ? 'متاح' : 'يتجاوز السعة'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 my-4 text-xs font-mono">
                      <div>
                        <span className="block text-muted-dark text-[10px] uppercase">الحجم القابل للاستخدام</span>
                        <span className="text-sm font-semibold text-white">{spec.usableCbm} m³</span>
                      </div>
                      <div>
                        <span className="block text-muted-dark text-[10px] uppercase">أقصى حمولة</span>
                        <span className="text-sm font-semibold text-white">{spec.maxPayloadKg.toLocaleString()} kg</span>
                      </div>
                    </div>

                    {/* Volume Utilization Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-muted-dark">نسبة استيعاب الحجم</span>
                        <span className={utilPct > 100 ? 'text-warning font-semibold' : 'text-emerald'}>
                          {utilPct}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            utilPct > 100 ? 'bg-warning' : 'bg-emerald'
                          }`}
                          style={{ width: `${Math.min(100, utilPct)}%` }}
                        />
                      </div>
                    </div>

                    {/* Weight Utilization Bar (if weight present) */}
                    {weightUtilPct !== undefined && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs font-mono mb-1">
                          <span className="text-muted-dark">نسبة استيعاب الوزن</span>
                          <span className={weightUtilPct > 100 ? 'text-danger font-semibold' : 'text-white/80'}>
                            {weightUtilPct}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              weightUtilPct > 100 ? 'bg-danger' : 'bg-white/60'
                            }`}
                            style={{ width: `${Math.min(100, weightUtilPct)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Maximum Pieces Fit Metric */}
                    <div className="mt-4 p-2.5 rounded-[3px] bg-white/[0.03] border border-white/5 flex items-center justify-between font-mono text-xs">
                      <span className="text-muted-dark">أقصى عدد طرود يتسع:</span>
                      <span className="font-bold text-white">
                        {maxPieces > 0 ? `${maxPieces} طرد` : '—'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-rule-dark text-[11px] text-muted-dark font-mono">
                    الحجم الداخلي الكلي: {spec.internalCbm} m³
                  </div>
                </div>
              )
            })}
          </div>

          {/* Allocation Strategy Summary */}
          <div className="p-4 border border-rule-dark bg-card rounded-[4px] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-muted-dark block">
                استراتيجية توزيع المعدات والشحن:
              </span>
              <p className="text-sm font-light text-white/90 mt-1 leading-relaxed">
                {containerResult.isLclRecommended
                  ? `حجم البضاعة الحالي هو ${cbmResult.totalCbm.toFixed(3)} متر مكعب (أقل من معيار 15 م³). الشحن الجزئي LCL أكثر كفاءة وجدوى اقتصادية من حجز حاوية 20 قدم كاملة.`
                  : `مزيج الحاويات الأمثل الموصى به: ${containerResult.optimalCombination.summary} (السعة الإجمالية المتاحة: ${containerResult.optimalCombination.totalCapacityCbm} م³).`}
              </p>
            </div>
            <div className="font-mono text-xs text-muted-dark px-3 py-1.5 border border-rule-dark rounded-[2px] bg-sidebar whitespace-nowrap">
              إجمالي الحاويات المطلوبة: <strong className="text-white">{containerResult.optimalCombination.totalContainers}</strong>
            </div>
          </div>

          {/* Mandatory Footnote / Disclaimer Callout */}
          <div className="mt-6 p-4 border border-rule-dark bg-white/[0.02] rounded-[4px]">
            <p className="font-mono text-[11px] leading-relaxed text-muted-dark">
              ملاحظة: تقدير إرشادي للحجم وليس عرض أسعار نهائي للشحن. يعتمد التحميل الفعلي على أبعاد الطرود، وطريقة التنضيد (Palletization)، وتوزيع الوزن، والحدود التشغيلية للناقل البحري.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION D: Share & Export Summary Report */}
      <section className="container-site" aria-labelledby="section-report-title">
        <div className="frame border border-rule bg-surface p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-rule">
            <div>
              <h3 id="section-report-title" className="font-serif text-lg font-semibold text-obsidian">
                تصدير ومشاركة تقرير الشحنة
              </h3>
              <p className="text-sm text-muted font-light mt-1">
                انسخ ملخص بيانات الشحنة، وشروط التجارة المعتمدة، ومقاييس CBM لمشاركتها مع فريقك أو وكيل الشحن.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyReport}
              className="inline-flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider px-4 py-2.5 bg-obsidian text-white hover:bg-obsidian/90 transition-colors rounded-[4px] cursor-pointer"
            >
              <span
                className={`w-2 h-2 rounded-full transition-colors ${
                  copiedReport ? 'bg-emerald shadow-[0_0_6px_var(--color-emerald)]' : 'bg-white/40'
                }`}
                aria-hidden="true"
              />
              <span>{copiedReport ? 'تم نسخ التقرير إلى الحافظة!' : 'نسخ تقرير الشحنة'}</span>
            </button>
          </div>

          <div className="mt-6 p-4 bg-surface-2 border border-rule rounded-[4px]">
            <pre className="font-mono text-xs text-obsidian whitespace-pre-wrap leading-relaxed">
              {reportSummaryText}
            </pre>
          </div>
        </div>
      </section>

      {/* Footer Attribution Badge */}
      <div className="w-full py-4 text-center font-mono text-xs text-muted border-t border-rule">
        صادر عبر إكسفورتا • Issued via Exvorta
      </div>
    </div>
  )
}

export default IncotermCbmCalculatorAr
