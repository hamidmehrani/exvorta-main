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

interface EntityOptionAr {
  value: EntityType
  label: string
  sublabel: string
  phase: string
  aspDeadline: string
  goLive: string
}

const ENTITY_OPTIONS_AR: EntityOptionAr[] = [
  {
    value: 'enterprise_large',
    label: 'الشركات الكبرى (إيرادات ≥ 50 مليون درهم)',
    sublabel: 'المرحلة الأولى الإلزامية؛ تتطلب تعييناً معجلاً لمزود الخدمة المعتمد والتشغيل الفعلي.',
    phase: 'المرحلة 1',
    aspDeadline: '30 أكتوبر 2026',
    goLive: '1 يناير 2027',
  },
  {
    value: 'sme',
    label: 'الشركات الصغيرة والمتوسطة (إيرادات < 50 مليون درهم)',
    sublabel: 'المرحلة الثانية الإلزامية لعموم الشركات الخاضعة لضريبة القيمة المضافة.',
    phase: 'المرحلة 2',
    aspDeadline: '31 مارس 2027',
    goLive: '1 يوليو 2027',
  },
  {
    value: 'government',
    label: 'الجهات والدوائر الحكومية الاتحادية والمحلية',
    sublabel: 'المرحلة الثالثة الخاصة بالتوريدات والمشتريات الحكومية والمؤسسات العامة.',
    phase: 'المرحلة 3',
    aspDeadline: '31 مارس 2027',
    goLive: '1 أكتوبر 2027',
  },
  {
    value: 'micro_nonresident',
    label: 'المنشآت المتناهية الصغر / الكيانات غير المقيمة',
    sublabel: 'منشآت منخفضة المعاملات أو كيانات تابعة لتمثيل ضريبي غير مقيم.',
    phase: 'تجريبي / إعفاء',
    aspDeadline: '31 مارس 2027',
    goLive: '1 يوليو 2027',
  },
]

interface ErpOptionAr {
  value: ErpSystem
  label: string
  vendor: string
  points: number
  compatibility: 'توافق مباشر' | 'واجهة سحابية' | 'وسيط برمجي مطلوب' | 'غير متوافق'
}

const ERP_OPTIONS_AR: ErpOptionAr[] = [
  {
    value: 'sap_s4',
    label: 'ساب (SAP S/4HANA / ECC)',
    vendor: 'SAP SE',
    points: 25,
    compatibility: 'توافق مباشر',
  },
  {
    value: 'oracle_cloud',
    label: 'أوراكل كلاود / نت سويت (Oracle Fusion Cloud)',
    vendor: 'Oracle Corp',
    points: 25,
    compatibility: 'توافق مباشر',
  },
  {
    value: 'ms_dynamics',
    label: 'مايكروسوفت داينامكس (Dynamics 365 / BC)',
    vendor: 'Microsoft Corp',
    points: 22,
    compatibility: 'واجهة سحابية',
  },
  {
    value: 'zoho_books',
    label: 'زوهو بوكس (النسخة المعتمدة ضريبياً بالإمارات)',
    vendor: 'Zoho Corp',
    points: 20,
    compatibility: 'واجهة سحابية',
  },
  {
    value: 'quickbooks',
    label: 'إنتويت كويك بوكس (QuickBooks Online / Desktop)',
    vendor: 'Intuit Inc',
    points: 16,
    compatibility: 'وسيط برمجي مطلوب',
  },
  {
    value: 'xero',
    label: 'زيرو (Xero Accounting)',
    vendor: 'Xero Ltd',
    points: 16,
    compatibility: 'وسيط برمجي مطلوب',
  },
  {
    value: 'tally',
    label: 'تالي برايم (TallyPrime / Tally.ERP 9)',
    vendor: 'Tally Solutions',
    points: 15,
    compatibility: 'وسيط برمجي مطلوب',
  },
  {
    value: 'custom_legacy',
    label: 'نظام برمجي محلي مخصص / قديم (Custom In-House)',
    vendor: 'تطوير داخلي مخصص',
    points: 8,
    compatibility: 'وسيط برمجي مطلوب',
  },
  {
    value: 'manual_excel',
    label: 'فواتير يدوية / جداول إكسل (Manual Spreadsheets)',
    vendor: 'يدوي غير مؤتمت',
    points: 0,
    compatibility: 'غير متوافق',
  },
]

interface VolumeOptionAr {
  value: MonthlyVolume
  label: string
  description: string
}

const VOLUME_OPTIONS_AR: VolumeOptionAr[] = [
  { value: 'under_100', label: 'أقل من 100 شهرياً', description: 'حجم فواتير محدود' },
  { value: '100_to_1000', label: '100 – 1,000 شهرياً', description: 'حجم أعمال متوسط' },
  { value: '1000_to_10000', label: '1,000 – 10,000 شهرياً', description: 'كثافة معاملات مرتفعة' },
  { value: 'over_10000', label: 'أكثر من 10,000 شهرياً', description: 'معاملات مؤسسية ضخمة' },
]

interface AspOptionAr {
  value: AspStatus
  label: string
  sublabel: string
  points: number
}

const ASP_OPTIONS_AR: AspOptionAr[] = [
  {
    value: 'integrated',
    label: 'تم الربط والتكامل مع مزود خدمة معتمد (ASP)',
    sublabel: 'بيئة الاختبار التجريبية فعالة أو التبادل المباشر عبر شبكة بيبول قيد العمل.',
    points: 30,
  },
  {
    value: 'contracted',
    label: 'تم توقيع العقد الرسمي مع مزود خدمة معتمد',
    sublabel: 'تم إبرام الاتفاقية وبدأت مرحلة الإعداد والتكامل التقني للواجهات.',
    points: 20,
  },
  {
    value: 'shortlisting',
    label: 'مرحلة التقييم واختيار العروض (RFP)',
    sublabel: 'المفاضلة الفنية والمالية جارية بين المزودين المعتمدين من وزارة المالية.',
    points: 10,
  },
  {
    value: 'not_started',
    label: 'لم تبدأ الإجراءات بعد / لم يُعيّن مزود',
    sublabel: 'لم يتم التواصل أو بدء التقييم الرسمي مع أي مزود خدمة معتمد.',
    points: 0,
  },
]

// Arabic translation dictionary for Critical Gaps
const GAP_TRANSLATIONS: Record<
  string,
  { title: string; description: string; impact: string; actionRequired: string }
> = {
  'gap-manual-excel': {
    title: 'الفواتير اليدوية وجداول البيانات غير متوافقة مع نظام DCTCE',
    description:
      'إصدار الفواتير يدوياً أو عبر جداول إكسل يفتقر للقدرة على توليد مخططات XML ونقلها اللحظي لمزود الخدمة المعتمد.',
    impact: 'غرامة عدم امتثال تصل إلى 50,000 درهم بموجب قرار مجلس الوزراء رقم 106 لسنة 2025 ورفض الفواتير.',
    actionRequired: 'ترقية نظام الفوترة إلى برنامج محاسبي معتمد أو نظام ERP يدعم موصلات الربط مع مزودي الخدمة.',
  },
  'gap-phase1-asp-unappointed': {
    title: 'ضرورة التعاقد العاجل مع مزود خدمة معتمد (ASP) لكبرى الشركات',
    description:
      'يتعين على الشركات الكبرى (إيرادات ≥ 50 مليون درهم) تعيين مزود خدمة معتمد بحلول 30 أكتوبر 2026 تمهيداً للإلزام الفعلي في 1 يناير 2027.',
    impact: 'مخالفة صريحة للقرار الوزاري رقم 66 لسنة 2026 وغرامات إدارية تصل إلى 50,000 درهم.',
    actionRequired: 'إبرام عقد الخدمة فوراً مع مزود معتمد لبدء اختبارات البيئة التجريبية والتسجيل في دليل بيبول.',
  },
  'gap-missing-trn': {
    title: 'غياب أو عدم تسجيل رقم التسجيل الضريبي (TRN)',
    description: 'تفتقر المنشأة إلى رقم تسجيل ضريبي معتمد مكون من 15 رقماً مسجل رسمياً لدى الهيئة الاتحادية للضرائب.',
    impact: 'تعذر التسجيل في شبكة بيبول الإماراتية أو إصدار فواتير ضريبية مقبولة قانوناً.',
    actionRequired: 'استكمال إجراءات التسجيل الضريبي لدى الهيئة واستخراج الرقم الضريبي المعتمد.',
  },
  'gap-data-residency': {
    title: 'عدم الامتثال لمتطلب التوطين السيادي للبيانات في الإمارات',
    description: 'أنظمة أرشفة الفواتير وقواعد البيانات لا تضمن استضافة بيانات الفواتير الإلكترونية حصرياً داخل أراضي الدولة.',
    impact: 'مخالفة مباشرة لمتطلبات السيادة الرقمية وقرار مجلس الوزراء رقم 106 لسنة 2025.',
    actionRequired: 'تدقيق استضافة السحابة وعقود مزودي الخدمة لضمان استضافة قواعد البيانات والأرشيف في مراكز بيانات إماراتية.',
  },
  'gap-phase23-asp-not-started': {
    title: 'لم تبدأ إجراءات اختيار مزود الخدمة المعتمد (ASP)',
    description: 'لم يتم البدء في استدراج عروض مزودي الخدمة المعتمدين قبل الموعد النهائي المحدد في 31 مارس 2027.',
    impact: 'اختناق زمني وضيق نافذة الاختبار والتكامل قبل بدء الإلزام القانوني.',
    actionRequired: 'البدء الفوري في تقييم عروض مزودي الخدمة المعتمدين من قائمة وزارة المالية.',
  },
  'gap-custom-erp-integration': {
    title: 'نظام ERP المخصص يحتاج إلى موصل برمجي مخصص لنموذج PINT-AE',
    description: 'تتطلب الأنظمة البرمجية المطورة داخلياً برمجة واجهات API متوافقة مع مخطط PINT-AE (UBL 2.1) للربط مع الركن الثاني.',
    impact: 'فترة تطوير تتراوح بين 3 و6 أشهر ومخاطر تفويت موعد الإلزام.',
    actionRequired: 'تكليف فريق تطوير الواجهات بالتعاون مع مزود الخدمة المعتمد لبناء موصلات التحويل البرمجية.',
  },
  'gap-peppol-id-unready': {
    title: 'معرف مشارك بيبول (0237:<TRN>) غير مهيأ في النظام',
    description: 'تنسيق المعرف الدولي وفق ترميز ISO 6523 (الرمز 0237 متبوعاً بالرقم الضريبي) غير معرّف في سجلات النظام.',
    impact: 'تعذر توجيه أو استلام الفواتير الإلكترونية عبر شبكة بيبول الخماسية.',
    actionRequired: 'ضبط إعدادات النظام المحاسبي لإدراج المعرف الموحد 0237 متبوعاً بالرقم الضريبي المكون من 15 رقماً.',
  },
  'gap-tax-category-mapping': {
    title: 'فئات ضريبة القيمة المضافة (S, Z, E, O) غير معينة في النظام',
    description: 'بنود السلع والخدمات تفتقر للتصنيف المعياري لضريبة القيمة المضافة (الأساسية 5% [S]، الصفرية [Z]، المعفاة [E]، خارج النطاق [O]).',
    impact: 'فشل التحقق البرمجي لمخطط XML في الركنين الثاني والخامس ورفض إرسال الفواتير.',
    actionRequired: 'ربط شجرة الحسابات والمنتجات برموز الفئات المعتمدة في مواصفة PINT-AE.',
  },
  'gap-customer-trn-unverified': {
    title: 'عدم التحقق من الأرقام الضريبية للعملاء التجاريين',
    description: 'سجلات العملاء في النظام تفتقر للأرقام الضريبية الموثقة المكونة من 15 رقماً للشركاء التجاريين.',
    impact: 'تعذر التحقق من معرف المشتري في شبكة بيبول وتعطل إرسال الفواتير في الركن الثالث والرابع.',
    actionRequired: 'إطلاق حملة تدقيق لبيانات العملاء الأساسية والتحقق من أرقامهم الضريبية عبر بوابة الهيئة الاتحادية للضرائب.',
  },
  'gap-high-volume-fragility': {
    title: 'حجم معاملات مرتفع على بنية برمجية تقليدية غير مؤهلة',
    description: 'إصدار أكثر من 1,000 فاتورة شهرياً عبر جداول بيانات أو نظام قديم يعرض المنشأة لمخاطر فشل الامتثال اللحظي.',
    impact: 'توقف تدفق الفواتير، تأخر الإبلاغ لمنصة الهيئة (الركن الخامس)، وتراكم الغرامات الإدارية اليومية.',
    actionRequired: 'نشر وسيط برمجي مؤسسي معتمد أو الترقية لنظام ERP حديث متصل بمزود خدمة معتمد.',
  },
  'gap-b2g-without-asp': {
    title: 'حظر معاملات التوريد الحكومي لغياب مزود خدمة معتمد',
    description: 'المنشأة تورد لجهات حكومية لكنها لم تتعاقد مع مزود خدمة معتمد معتمد للمشتريات الفيدرالية.',
    impact: 'رفض بوابات المشتريات الحكومية استلام الفواتير غير المتوافقة وتجميد مستحقات الصرف.',
    actionRequired: 'التعاقد مع مزود خدمة معتمد معتمد للربط مع بوابات التوريد الحكومي للمرحلة الثالثة.',
  },
}

// Arabic translation for ASP selection checklist
const CHECKLIST_AR: Record<string, { requirement: string; description: string }> = {
  'asp-mof-accreditation': {
    requirement: 'الاعتماد الرسمي من وزارة المالية لمزود الخدمة (ASP)',
    description: 'حصول المزود على شهادة اعتماد سارية المفعول من وزارة المالية الإماراتية بموجب القرار الوزاري رقم 66 لسنة 2026.',
  },
  'peppol-corner-exchange': {
    requirement: 'دعم نموذج التبادل الخماسي عبر شبكة بيبول (Peppol DCTCE)',
    description: 'القدرة الفنية الكاملة على العمل كمزود للبائع (الركن 2) ومزود للمشتري (الركن 3) عبر شبكة بيبول الآمنة.',
  },
  'corner-5-reporting': {
    requirement: 'الإبلاغ اللحظي لمنصة الهيئة الاتحادية للضرائب (الركن 5)',
    description: 'نقل وتدقيق بيانات الفواتير الضريبية آلياً ولحظياً إلى منصة الهيئة الاتحادية للضرائب المعتمدة.',
  },
  'ubl-pint-ae-validation': {
    requirement: 'التحقق من صحة مخطط XML لنموذج PINT-AE (معيار UBL 2.1)',
    description: 'مطابقة البيانات آلياً مع المواصفات الفنية لنموذج الفوترة الدولي للإمارات وامتداداته الرسمية.',
  },
  'peppol-id-resolution': {
    requirement: 'الاستعلام التلقائي في دليل المشاركين (0237:<TRN>)',
    description: 'التوجيه البرمجي والتحقق التلقائي من معرفات بيبول باستخدام البادئة القياسية 0237 ISO 6523.',
  },
  'uae-data-residency': {
    requirement: 'التوطين السيادي للبيانات داخل أراضي دولة الإمارات',
    description: 'استضافة قواعد البيانات وسجلات المعاملات والأرشيف القانوني لمدة 5 سنوات داخل مراكز بيانات إماراتية حصراً.',
  },
  'tax-code-mapping-support': {
    requirement: 'محرك تصنيف بنود الفاتورة لضريبة القيمة المضافة',
    description: 'التدقيق الآلي على فئات الضريبة المعيارية (الأساسية 5% S، الصفرية Z، المعفاة E، وخارج النطاق O).',
  },
  'erp-connector-availability': {
    requirement: 'موصلات جاهزة لأنظمة ERP أو واجهات برمجية آمنة (REST API)',
    description: 'موصلات معتمدة لأنظمة المحاسبة الكبرى وواجهات ويب هوك آمنة للتكامل المؤسسي السريع.',
  },
}

export function UaeEinvoicingCalculatorAr() {
  const searchParams = useSearchParams()

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

  const result = useMemo(() => {
    return calculateReadiness(input)
  }, [input])

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

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!captureEmail.trim()) {
      setCaptureError('يرجى إدخال بريد إلكتروني صالح للعمل.')
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
            source: 'UAE-EInvoicing-Tool-AR',
            score: result.score,
            tier: result.tier,
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
          setCaptureError(res.error || 'تعذر حفظ التقييم. يرجى إعادة المحاولة.')
        }
      } catch {
        setCaptureStatus('error')
        setCaptureError('حدث خطأ في الاتصال بالشبكة. يرجى المحاولة لاحقاً.')
      }
    })
  }

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

  const getTierLabelAr = (tier: string) => {
    switch (tier) {
      case 'compliant_ready':
        return 'ممتثل وجاهز تماماً'
      case 'substantially_prepared':
        return 'جاهزية متقدمة وجوهرية'
      case 'developing':
        return 'جاهزية قيد التطوير والاستكمال'
      case 'critical_action':
      default:
        return 'إجراءات عاجلة مطلوبة فوراً'
    }
  }

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

  const getSeverityLabelAr = (sev: CriticalGap['severity']) => {
    switch (sev) {
      case 'critical':
        return 'حرج جداً'
      case 'high':
        return 'مرتفع'
      case 'medium':
        return 'متوسط'
      case 'low':
      default:
        return 'منخفض'
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
              محرك الامتثال اللحظي للفوترة الإلكترونية (DCTCE) &bull; نموذج PINT-AE &bull; لوائح موثقة
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider px-3.5 py-2 border border-rule bg-surface text-obsidian hover:border-obsidian transition-colors rounded-[4px] cursor-pointer"
              aria-label={copiedLink ? 'تم نسخ الرابط' : 'نسخ رابط التقييم القابل للمشاركة'}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  copiedLink ? 'bg-emerald' : 'bg-muted'
                }`}
                aria-hidden="true"
              />
              <span>{copiedLink ? '[ تم النسخ! ]' : '[ نسخ رابط التقييم ]'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="font-mono text-[11px] uppercase tracking-wider px-3.5 py-2 border border-rule hover:border-obsidian text-obsidian bg-surface transition-colors rounded-[4px] cursor-pointer"
            >
              [ طباعة التقرير ]
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="font-mono text-[11px] uppercase tracking-wider px-3.5 py-2 border border-rule hover:border-obsidian text-muted hover:text-obsidian bg-transparent transition-colors rounded-[4px] cursor-pointer"
            >
              [ إعادة الضبط ]
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
              القسم أ &bull; بيانات المنشأة ونطاق الإلزام القانوني
            </p>
            <h2 id="section-profile-title" className="font-serif text-title font-semibold text-obsidian">
              المعايير الضريبية والمعمارية التقنية
            </h2>
            <p className="mt-2 text-sm text-muted font-light max-w-3xl">
              حدد فئة إيرادات منشأتك، والبنية التحتية لنظام المحاسبة وإدارة الموارد، ومرحلة التعاقد الحالية مع مزود الخدمة المعتمد لحساب المواعيد القانونية والجاهزية الفنية.
            </p>
          </div>

          <div className="pt-8 flex flex-col gap-10">
            {/* Step 1: Entity Scale & Statutory Phase */}
            <div>
              <label className="field-label mb-3 block">
                1. فئة المنشأة والإيرادات السنوية (تحديد المرحلة القانونية الإلزامية)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ENTITY_OPTIONS_AR.map(opt => {
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
                            الإلزام الفعلي: {opt.goLive}
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
                        الموعد النهائي لتعيين مزود الخدمة: <strong className="font-semibold">{opt.aspDeadline}</strong>
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
                  2. نظام المحاسبة وإدارة الموارد (ERP) المعتمد في المنشأة
                </label>
                <span className="text-[11px] font-mono text-muted">25 نقطة كحد أقصى</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ERP_OPTIONS_AR.map(opt => {
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
                          +{opt.points} نقطة
                        </span>
                      </div>
                      <h4 className="font-sans font-semibold text-xs leading-snug">{opt.label}</h4>
                      <div
                        className={`mt-2 pt-2 border-t text-[10px] font-mono flex items-center justify-between ${
                          isSelected ? 'border-white/15 text-white/70' : 'border-rule text-muted'
                        }`}
                      >
                        <span>مستوى التوافق:</span>
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
                  3. متوسط عدد الفواتير الضريبية المصدرة شهرياً
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {VOLUME_OPTIONS_AR.map(opt => {
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
                    4. وضع التعاقد مع مزود الخدمة المعتمد (ASP)
                  </label>
                  <span className="text-[11px] font-mono text-muted">30 نقطة كحد أقصى</span>
                </div>
                <div className="flex flex-col gap-2">
                  {ASP_OPTIONS_AR.map(opt => {
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
                          +{opt.points} نقطة
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
                    5. معايير جاهزية ونظافة البيانات الأساسية (5 نقاط لكل بند)
                  </label>
                  <span className="text-[11px] font-mono text-muted">25 نقطة كحد أقصى</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {[
                    {
                      key: 'hasValidTrn' as const,
                      label: 'رقم تسجيل ضريبي معتمد (TRN) مكون من 15 رقماً',
                      desc: 'مسجل ومعتمد باسم المنشأة لدى الهيئة الاتحادية للضرائب.',
                    },
                    {
                      key: 'customerTrnVerified' as const,
                      label: 'توثيق وتحديث الأرقام الضريبية للعملاء التجاريين (B2B)',
                      desc: 'مطابقة سجلات العملاء دورياً مع قاعدة بيانات الهيئة الاتحادية للضرائب.',
                    },
                    {
                      key: 'peppolIdReady' as const,
                      label: 'تهيئة معرف مشارك شبكة بيبول (0237:<TRN>)',
                      desc: 'تنسيق المعرف القياسي الموحد وفق ترميز ISO 6523 داخل النظام المحاسبي.',
                    },
                    {
                      key: 'pintTaxCategoryMapped' as const,
                      label: 'تعيين فئات ضريبة القيمة المضافة (S, Z, E, O) لمواصفة PINT-AE',
                      desc: 'ربط بنود المنتجات والخدمات برموز الفئات المعتمدة (أساسية، صفرية، معفاة، خارج النطاق).',
                    },
                    {
                      key: 'uaeDataResidencyConfirmed' as const,
                      label: 'تأكيد التوطين السيادي للبيانات داخل دولة الإمارات',
                      desc: 'استضافة قواعد بيانات الفواتير والأرشيف القانوني لمدة 5 سنوات داخل الدولة.',
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
                    6. مسارات المعاملات التجارية النشطة في المنشأة
                  </label>
                  <span className="text-[11px] font-mono text-muted">نطاق الحوكمة</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {[
                    {
                      key: 'b2bDomestic' as const,
                      label: 'المعاملات التجارية المحلية بين الشركات (B2B)',
                      desc: 'المسار الإلزامي الأساسي المتبادل بين المنشآت والشركات في دولة الإمارات.',
                    },
                    {
                      key: 'b2gGovernment' as const,
                      label: 'عقود التوريد والمشتريات الحكومية (B2G)',
                      desc: 'التوريدات للمؤسسات والجهات الحكومية الخاضعة للمرحلة الثالثة.',
                    },
                    {
                      key: 'b2cRetail' as const,
                      label: 'معاملات التجزئة ونقاط البيع للأفراد (B2C)',
                      desc: 'مبيعات المستهلكين النهائيين التي تتطلب تكامل الإيصالات المالية المبسطة.',
                    },
                    {
                      key: 'crossBorderExport' as const,
                      label: 'فواتير الاستيراد والتصدير عبر الحدود',
                      desc: 'التوثيق التجاري للشحنات الدولية المرتبطة بالبيانات الجمركية.',
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
              القسم ب &bull; مؤشر الجاهزية والجدول الزمني للإلزام
            </p>
            <h2 id="section-results-title" className="font-serif text-title font-semibold text-obsidian">
              تقرير تقييم الامتثال القانوني والتقني
            </h2>
            <p className="mt-2 text-sm text-muted font-light max-w-3xl">
              نتائج فورية محسوبة ومطابقة للمرسوم بقانون اتحادي رقم 16 لسنة 2024، وقرار مجلس الوزراء رقم 106 لسنة 2025، والقرار الوزاري رقم 66 لسنة 2026.
            </p>
          </div>

          {/* Top KPI Cards: Score + Deadlines */}
          <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Score Card */}
            <div className="p-6 border border-rule bg-surface-2/50 rounded-[4px] flex flex-col justify-between">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                  مؤشر الجاهزية الإجمالي
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
                    {getTierLabelAr(result.tier)}
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
                  <span>حرج &lt;45</span>
                  <span>قيد التطوير 45-69</span>
                  <span>ممتثل 70+</span>
                </div>
              </div>
            </div>

            {/* ASP Appointment Deadline Card */}
            <div className="p-6 border border-rule bg-surface-2/50 rounded-[4px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                    الموعد النهائي لتعيين مزود الخدمة (ASP)
                  </span>
                  <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded-[2px] bg-obsidian text-white">
                    {result.phase === 'Phase 1'
                      ? 'المرحلة 1'
                      : result.phase === 'Phase 2'
                      ? 'المرحلة 2'
                      : result.phase === 'Phase 3'
                      ? 'المرحلة 3'
                      : 'تجريبي'}
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-2xl font-semibold text-obsidian">
                  {result.aspDeadline}
                </h3>
                <p className="mt-1 text-xs text-muted font-light">
                  الموعد القانوني الملزم للتعاقد مع مزود خدمة معتمد وفق القرار الوزاري رقم 66 لسنة 2026.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-rule flex items-center justify-between">
                <span className="font-mono text-xs text-muted">الحالة:</span>
                {result.aspDeadlinePassed ? (
                  <span className="font-mono text-xs font-bold text-danger bg-danger/10 px-2 py-0.5 rounded-[2px] border border-danger/30">
                    انتهت المهلة القانونية
                  </span>
                ) : (
                  <span className="font-mono text-xs font-bold text-emerald bg-emerald/10 px-2 py-0.5 rounded-[2px] border border-emerald/30">
                    متبقي {result.daysUntilAspDeadline} يوماً
                  </span>
                )}
              </div>
            </div>

            {/* Mandatory Go-Live Deadline Card */}
            <div className="p-6 border border-rule bg-surface-2/50 rounded-[4px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                    تاريخ الإلزام الفعلي (Go-Live)
                  </span>
                  <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded-[2px] bg-surface border border-rule text-obsidian">
                    تدقيق مستمر
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-2xl font-semibold text-obsidian">
                  {result.goLiveDeadline}
                </h3>
                <p className="mt-1 text-xs text-muted font-light">
                  بدء الإلزام القانوني بنقل بيانات الفواتير لحظياً لمنصة الهيئة بموجب قرار مجلس الوزراء رقم 106 لسنة 2025.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-rule flex items-center justify-between">
                <span className="font-mono text-xs text-muted">الحالة:</span>
                {result.goLivePassed ? (
                  <span className="font-mono text-xs font-bold text-danger bg-danger/10 px-2 py-0.5 rounded-[2px] border border-danger/30">
                    الإلزام الفعلي سارٍ الآن
                  </span>
                ) : (
                  <span className="font-mono text-xs font-bold text-obsidian bg-surface px-2 py-0.5 rounded-[2px] border border-rule">
                    متبقي {result.daysUntilGoLive} يوماً حتى الإلزام
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Pillar Breakdown */}
          <div className="mt-10 pt-8 border-t border-rule">
            <h3 className="font-sans text-sm font-semibold text-obsidian uppercase tracking-wider mb-6">
              تفصيل درجات الجاهزية وفق ركائز الامتثال الأربع
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: 'جاهزية بنية ERP التقنية',
                  category: result.scoreCategories.erpReadiness,
                },
                {
                  title: 'التعاقد مع مزود الخدمة (ASP)',
                  category: result.scoreCategories.aspProcurement,
                },
                {
                  title: 'نظافة البيانات الأساسية',
                  category: result.scoreCategories.masterDataHygiene,
                },
                {
                  title: 'حوكمة نطاق المعاملات',
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
                  الفجوات القانونية ومخاطر عدم الامتثال المرصودة ({result.criticalGaps.length})
                </h3>
                <p className="mt-1 text-xs text-muted font-light">
                  مخاطر امتثال مباشرة تعرض المنشأة لغرامات قرار مجلس الوزراء رقم 106 لسنة 2025 (تصل إلى 50,000 درهم).
                </p>
              </div>
              <span className="font-mono text-xs text-muted">
                {result.criticalGaps.filter(g => g.severity === 'critical').length} حرجة /{' '}
                {result.criticalGaps.filter(g => g.severity === 'high').length} مرتفعة
              </span>
            </div>

            {result.criticalGaps.length === 0 ? (
              <div className="p-6 border border-emerald/30 bg-emerald/10 text-emerald rounded-[4px]">
                <h4 className="font-sans font-semibold text-sm">
                  لم يتم رصد أي فجوات امتثال حرجة
                </h4>
                <p className="text-xs font-light mt-1">
                  البنية التحتية لمنشأتك، وتعاقدات مزودي الخدمة، ونظافة البيانات متوافقة مع متطلبات PINT-AE الإماراتية.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {result.criticalGaps.map(gap => {
                  const tr = GAP_TRANSLATIONS[gap.id]
                  const title = tr?.title || gap.title
                  const description = tr?.description || gap.description
                  const impact = tr?.impact || gap.impact
                  const actionRequired = tr?.actionRequired || gap.actionRequired

                  return (
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
                            {getSeverityLabelAr(gap.severity)}
                          </span>
                          <h4 className="font-sans text-sm font-semibold text-obsidian">
                            {title}
                          </h4>
                        </div>
                        <p className="text-xs text-muted font-light leading-relaxed">
                          {description}
                        </p>
                        <div className="mt-3 pt-3 border-t border-rule text-xs flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                          <div className="text-danger font-medium">
                            <strong>الأثر القانوني:</strong> {impact}
                          </div>
                          <div className="text-obsidian">
                            <strong>الإجراء المطلوب:</strong> {actionRequired}
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 text-start md:text-end">
                        <span className="font-mono text-[10px] text-muted block max-w-xs leading-normal">
                          السند القانوني: {gap.regulatoryCitation}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ASP Technical Procurement Checklist */}
          <div className="mt-10 pt-8 border-t border-rule">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-sans text-sm font-semibold text-obsidian uppercase tracking-wider">
                  قائمة المعايير الفنية لاختيار مزود الخدمة المعتمد (ASP)
                </h3>
                <p className="mt-1 text-xs text-muted font-light">
                  8 متطلبات معمارية غير قابلة للتفاوض للربط مع الركن الثاني والثالث بموجب القرارين الوزاريين 243 و244 لسنة 2025.
                </p>
              </div>
              <span className="font-mono text-xs text-muted hidden sm:inline-block">
                هندسة شبكة بيبول الخماسية (5-Corner)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.aspSelectionChecklist.map(item => {
                const tr = CHECKLIST_AR[item.id]
                const reqTitle = tr?.requirement || item.requirement
                const reqDesc = tr?.description || item.description

                return (
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
                        <h4 className="font-sans text-xs font-semibold text-obsidian">{reqTitle}</h4>
                        <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded-[2px] bg-surface-2 text-muted border border-rule shrink-0">
                          {item.cornerCapability}
                        </span>
                      </div>
                      <p className="text-[11px] font-light text-muted leading-relaxed">
                        {reqDesc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Regulatory Statutes Registry Table */}
          <div className="mt-10 pt-8 border-t border-rule">
            <h3 className="font-sans text-sm font-semibold text-obsidian uppercase tracking-wider mb-2">
              المرجعية القانونية والقرارات الوزارية الحاكمة
            </h3>
            <p className="text-xs text-muted font-light mb-6">
              التشريعات والقرارات الرسمية المعتمدة المنظمة لمنظومة الفوترة الإلكترونية بدولة الإمارات.
            </p>
            <div className="border border-rule rounded-[4px] overflow-x-auto">
              <table className="w-full text-start text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-2 border-b border-rule font-mono text-[10px] text-muted uppercase">
                    <th className="p-3 text-start">رمز التشريع</th>
                    <th className="p-3 text-start">عنوان المرسوم / القرار الوزاري</th>
                    <th className="p-3 text-start">تاريخ السريان</th>
                    <th className="p-3 text-start">الجهة المصدرة</th>
                    <th className="p-3 text-start">حالة التوثيق</th>
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
                          موثق ومطابق {statute.lastVerified}
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
              القسم ج &bull; ملف الامتثال المؤسسي
            </p>
            <h2 id="section-briefing-title" className="font-serif text-title font-semibold text-obsidian">
              حفظ التقرير وطلب جلسة استشارية فنية
            </h2>
            <p className="mt-2 text-sm text-muted font-light">
              احصل على ملف امتثال رسمي يتضمن تحليلاً تفصيلياً للفجوات بمؤسستك، وجداول المواعيد النهائية الإلزامية، ومصفوفة تقييم مزودي الخدمة المعتمدين.
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
                <label className="field-label mb-1.5 block" htmlFor="lead-email-ar">
                  البريد الإلكتروني للعمل <span className="text-danger">*</span>
                </label>
                <input
                  id="lead-email-ar"
                  type="email"
                  required
                  value={captureEmail}
                  onChange={e => setCaptureEmail(e.target.value)}
                  placeholder="finance.director@company.ae"
                  className="w-full px-3.5 py-2.5 text-xs bg-surface border border-rule focus:border-obsidian focus:ring-1 focus:ring-obsidian rounded-[4px] text-obsidian"
                />
              </div>
              <div>
                <label className="field-label mb-1.5 block" htmlFor="lead-company-ar">
                  اسم الشركة / المنشأة (اختياري)
                </label>
                <input
                  id="lead-company-ar"
                  type="text"
                  value={captureCompany}
                  onChange={e => setCaptureCompany(e.target.value)}
                  placeholder="شركة المنارة للتجارة ذ.م.م"
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
                <strong className="font-semibold block mb-0.5">تم حفظ التقييم بنجاح!</strong>
                سيقوم مهندسو الامتثال التجاري في إكسفورتا بإرسال ملف الجاهزية الفنية المخصص لنموذج PINT-AE وترتيب جلسة استشارية أولية.
              </div>
            )}

            <div className="mt-2 flex items-center gap-4">
              <button
                type="submit"
                disabled={isCapturing || captureStatus === 'success'}
                className="btn-primary cursor-pointer disabled:opacity-50"
              >
                {isCapturing ? 'جاري حفظ التقييم...' : '[ حفظ التقييم وطلب الاستشارة الفنية ]'}
              </button>
              <span className="text-[11px] font-mono text-muted">
                سرية تامة لبيانات المؤسسة &bull; حماية ضد البريد العشوائي
              </span>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export default UaeEinvoicingCalculatorAr
