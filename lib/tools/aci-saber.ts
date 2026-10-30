/**
 * Egypt ACI & Saudi Arabia SABER Pre-Shipment Readiness Checker Engine
 *
 * 100% Pure TypeScript: zero React/DOM imports, zero network calls, zero side effects.
 * Regulatory baseline verified as of 2026-10-27 (docs/research/regulatory-facts.md).
 */

// ---------------------------------------------------------------------------
// 1. Core Types
// ---------------------------------------------------------------------------

export type Corridor = 'egypt_aci' | 'ksa_saber'
export type TransportMode = 'sea' | 'air'
export type ProductRegulationStatus = 'regulated' | 'non_regulated' | 'exempt'
export type ItemStatus = 'ready' | 'pending' | 'missing'
export type Verdict = 'READY' | 'AT_RISK' | 'BLOCKED'

export interface CorridorMetadata {
  id: Corridor
  name: string
  nameAr: string
  authority: string
  authorities: string[]
  platform: string
  platforms: string[]
  legalReference: string
  seaMandateDate?: string
  airMandateDate?: string
  sourceDate: string
  description: string
  descriptionAr: string
}

export const CORRIDOR_METADATA: Record<Corridor, CorridorMetadata> = {
  egypt_aci: {
    id: 'egypt_aci',
    name: 'Egypt Advance Cargo Information (ACI)',
    nameAr: 'نظام التسجيل المسبق للشحنات المصري (ACI)',
    authority: 'Egyptian Ministry of Finance / MTS',
    authorities: [
      'Egyptian Ministry of Finance',
      'MTS (Misr Technology Services)',
      'Egyptian Customs Authority',
    ],
    platform: 'Nafeza / CargoX',
    platforms: ['Nafeza', 'CargoX'],
    legalReference: 'Decree No. 38/2021; Customs Law No. 207/2020',
    seaMandateDate: '2021-10-01',
    airMandateDate: '2026-01-01',
    sourceDate: '2026-10-27',
    description:
      'Mandatory pre-shipment filing via CargoX and Nafeza. Sea shipments require ACID >= 48h before departure; air freight requires electronic manifest submission >= 4h prior to takeoff (mandated 2026-01-01).',
    descriptionAr:
      'نظام التسجيل المسبق الإلزامي عبر منصتي كارجو إكس ونافذة. يتطلب الشحن البحري إصدار رقم ACID قبل 48 ساعة من الإبحار؛ بينما يلزم الشحن الجوي تقديم المنافيست قبل 4 ساعات من الإقلاع (منذ 1 يناير 2026).',
  },
  ksa_saber: {
    id: 'ksa_saber',
    name: 'Saudi Arabia SABER Platform (SALEEM)',
    nameAr: 'منصة سابر السعودية (برنامج سليم)',
    authority: 'SASO & ZATCA',
    authorities: [
      'SASO (Saudi Standards, Metrology and Quality Organization)',
      'ZATCA (Zakat, Tax and Customs Authority)',
    ],
    platform: 'SABER / FASAH',
    platforms: ['SABER', 'FASAH'],
    legalReference: 'Royal Decree M/10; SALEEM Saudi Product Safety Program; FASAH Clearance Integration',
    sourceDate: '2026-10-27',
    description:
      'Saudi pre-shipment conformity platform integrated with ZATCA FASAH single window. Requires PCoC (1-year) for regulated goods, SDoC for non-regulated goods, and mandatory SCoC for 100% of consignments.',
    descriptionAr:
      'المنصة السعودية الإلكترونية لشهادات المطابقة المرتبطة ببوابة فسح (ZATCA). تتطلب شهادة PCoC للمنتجات الخاضعة وإقرار SDoC للمنتجات غير الخاضعة وشهادة SCoC لكافة الشحنات بنسبة 100%.',
  },
}

export type ChecklistCategory =
  | 'registration'
  | 'pre_shipment_filing'
  | 'commercial_docs'
  | 'conformity_cert'
  | 'labeling'

export interface ChecklistContext {
  corridor: Corridor
  mode?: TransportMode
  regulationStatus?: ProductRegulationStatus
}

export interface ChecklistItem {
  id: string
  corridor: Corridor
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  category: ChecklistCategory
  sourceAuthority: string
  sourceDate: string
  legalReference: string
  isMandatory: boolean
  appliesTo: (context: ChecklistContext) => boolean
  guidance: string
  guidanceAr: string
  consequenceOfNonCompliance: string
  consequenceOfNonComplianceAr: string
}

export interface ReadinessResult {
  totalMandatory: number
  readyCount: number
  pendingCount: number
  missingCount: number
  scorePct: number
  verdict: Verdict
  blockingItemIds: string[]
  warnings: string[]
  warningsAr: string[]
}

export interface AcidValidationResult {
  isValid: boolean
  normalized: string
  error?: string
  errorAr?: string
  isProvisional: boolean
}

export interface SaberCertValidationResult {
  isValid: boolean
  normalized: string
  error?: string
  errorAr?: string
}

export interface TaxIdValidationResult {
  isValid: boolean
  normalized: string
  error?: string
  errorAr?: string
}

export interface ChecklistState {
  corridor: Corridor
  mode?: TransportMode
  regulationStatus?: ProductRegulationStatus
  statusMap: Record<string, ItemStatus>
}

// ---------------------------------------------------------------------------
// 2. Regulatory Checklist Definitions
// ---------------------------------------------------------------------------

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  // =========================================================================
  // Egypt ACI (Nafeza / CargoX) Items
  // =========================================================================
  {
    id: 'eg_importer_nafeza_reg',
    corridor: 'egypt_aci',
    title: 'Importer Nafeza Account & Tax ID Registration',
    titleAr: 'تسجيل المستورد على منصة نافذة والبطاقة الضريبية',
    description:
      'Egyptian importer must possess an active, verified account on the Nafeza National Single Window portal with an active 9-digit Egyptian Tax Card ID.',
    descriptionAr:
      'يجب أن يمتلك المستورد المصري حساباً مفعلاً وموثقاً على النافذة القومية الموحدة (نافذة) وبطاقة ضريبية مصرية سارية مكونة من 9 أرقام.',
    category: 'registration',
    sourceAuthority: 'Egyptian Ministry of Finance / MTS (Misr Technology Services)',
    sourceDate: '2026-10-27',
    legalReference: 'Decree No. 38/2021, Article 2; Customs Law No. 207/2020',
    isMandatory: true,
    appliesTo: (ctx) => ctx.corridor === 'egypt_aci',
    guidance:
      'Ensure the Egyptian importer has completed e-token / digital signature registration on Nafeza before issuing proforma invoices.',
    guidanceAr:
      'تأكد من إتمام المستورد المصري للتوقيع الإلكتروني وتفعيل حسابه على منصة نافذة قبل إصدار الفاتورة المبدئية.',
    consequenceOfNonCompliance:
      'Inability to request or receive the 19-digit ACID number; cargo cannot be processed or cleared at Egyptian ports.',
    consequenceOfNonComplianceAr:
      'عدم القدرة على طلب أو إصدار رقم ACID المكون من 19 رقماً؛ ولا يمكن بدء الإجراءات الجمركية أو التخليص في الموانئ المصرية.',
  },
  {
    id: 'eg_exporter_cargox_reg',
    corridor: 'egypt_aci',
    title: 'Foreign Exporter CargoX Account & Company Verification',
    titleAr: 'حساب المصدر الأجنبي وتوثيق الشركة على منصة CargoX',
    description:
      'Foreign exporter must hold a verified company account on CargoX platform with completed 1-USD/EUR bank verification or accredited third-party identity check.',
    descriptionAr:
      'يجب على المصدر الأجنبي إنشاء وتوثيق حساب الشركة على منصة CargoX عبر التحويل المصرفي التأكيدي أو التحقق المعتمد للهوية.',
    category: 'registration',
    sourceAuthority: 'CargoX Official Platform Documentation / Egyptian Customs Authority',
    sourceDate: '2026-10-27',
    legalReference: 'Ministry of Finance Decree No. 38/2021',
    isMandatory: true,
    appliesTo: (ctx) => ctx.corridor === 'egypt_aci',
    guidance:
      'Complete CargoX company verification and purchase sufficient CargoX units (blockchain filing credits) prior to dispatching cargo.',
    guidanceAr:
      'أكمل توثيق شركة التصدير على CargoX واشترِ وحدات الرصيد (CargoX units) الكافية لنقل المستندات المشفرة قبل الشحن.',
    consequenceOfNonCompliance:
      'Exporter cannot transfer required shipping documents via blockchain to Nafeza; shipment cannot clear Egyptian customs.',
    consequenceOfNonComplianceAr:
      'تعذر رفع ونقل مستندات الشحن عبر البلوكشين إلى نافذة؛ وتوقف التخليص الجمركي للشحنة تماماً.',
  },
  {
    id: 'eg_proforma_invoice',
    corridor: 'egypt_aci',
    title: 'Proforma Invoice for Initial Filing',
    titleAr: 'الفاتورة المبدئية لطلب القيد الأولي',
    description:
      'Preliminary commercial agreement containing HS codes, goods description, exporter details, and importer tax ID used to generate the initial ACID request.',
    descriptionAr:
      'الاتفاق التجاري المبدئي المتضمن البنود الجمركية ووصف البضائع وبيانات المصدر والرقم الضريبي للمستورد لطلب رقم ACID.',
    category: 'pre_shipment_filing',
    sourceAuthority: 'MTS Nafeza Operational Guidelines',
    sourceDate: '2026-10-27',
    legalReference: 'Decree No. 38/2021, Article 3',
    isMandatory: true,
    appliesTo: (ctx) => ctx.corridor === 'egypt_aci',
    guidance:
      'Ensure unit prices, quantities, and 6-to-10 digit HS codes align with final commercial documents before filing for ACID.',
    guidanceAr:
      'تأكد من تطابق أسعار الوحدات والكميات والبنود الجمركية مع المستندات النهائية قبل طلب الرقم المبدئي.',
    consequenceOfNonCompliance: 'Rejection of ACID issuance application on Nafeza portal.',
    consequenceOfNonComplianceAr: 'رفض طلب إصدار رقم ACID على بوابة نافذة.',
  },
  {
    id: 'eg_acid_sea_filing',
    corridor: 'egypt_aci',
    title: 'ACID Generation (Sea Freight >= 48h Prior to Vessel Departure)',
    titleAr: 'إصدار رقم ACID (الشحن البحري قبل 48 ساعة على الأقل من الإبحار)',
    description:
      '19-digit Advance Cargo Information Declaration (ACID) number issued via Nafeza at least 48 hours before vessel departure (mandatory since 1 October 2021).',
    descriptionAr:
      'رقم التسجيل المسبق للشحنات (ACID) المكون من 19 رقماً الصادر عبر نافذة قبل 48 ساعة على الأقل من تحرك السفينة (إلزامي منذ 1 أكتوبر 2021).',
    category: 'pre_shipment_filing',
    sourceAuthority: 'Egyptian Ministry of Finance Decree No. 38/2021 / CargoX',
    sourceDate: '2026-10-27',
    legalReference: 'Decree No. 38/2021, Mandatory Sea Freight ACI since 1 Oct 2021',
    isMandatory: true,
    appliesTo: (ctx) => ctx.corridor === 'egypt_aci' && (!ctx.mode || ctx.mode === 'sea'),
    guidance:
      'Apply for ACID well ahead of loading. The issued 19-digit ACID is valid for 3 months and must be listed on all shipping documents.',
    guidanceAr:
      'اطلب رقم ACID قبل الشحن بوقت كافٍ؛ الرقم صالح لمدة 3 أشهر ويجب إدراجه في كافة مستندات الشحن.',
    consequenceOfNonCompliance:
      'Carriers are prohibited by Egyptian law from loading cargo without an ACID. Goods arrived without ACID are subject to mandatory return at carrier/exporter expense.',
    consequenceOfNonComplianceAr:
      'يحظر القانون المصري على الخطوط الملاحية شحن البضائع دون رقم ACID؛ والشحنات الواصلة دونه يعاد تصديرها فوراً على نفقة الناقل أو المصدر.',
  },
  {
    id: 'eg_acid_air_filing',
    corridor: 'egypt_aci',
    title: 'ACID Generation & Manifest Filing (Air Freight >= 4h Prior to Takeoff)',
    titleAr: 'إصدار رقم ACID والمنافيست (الشحن الجوي قبل 4 ساعات على الأقل من الإقلاع)',
    description:
      'Mandatory electronic ACI filing and manifest submission via Nafeza at least 4 hours before aircraft departure (mandatory since 1 January 2026).',
    descriptionAr:
      'التسجيل المسبق الإلكتروني الإلزامي وتقديم منافيست الشحن عبر نافذة قبل 4 ساعات على الأقل من إقلاع الطائرة (إلزامي منذ 1 يناير 2026).',
    category: 'pre_shipment_filing',
    sourceAuthority: 'Egyptian Ministry of Finance (Minister Statement) / MTS',
    sourceDate: '2026-10-27',
    legalReference: 'Ministry of Finance Statement; Air Freight Mandatory Directive effective 1 Jan 2026',
    isMandatory: true,
    appliesTo: (ctx) => ctx.corridor === 'egypt_aci' && (!ctx.mode || ctx.mode === 'air'),
    guidance:
      'Verify that the airline has the verified 19-digit ACID on the electronic manifest >= 4 hours before takeoff.',
    guidanceAr:
      'تأكد من إدراج رقم ACID الموثق في المنافيست الإلكتروني لشركة الطيران قبل 4 ساعات على الأقل من الإقلاع.',
    consequenceOfNonCompliance:
      'Airlines are legally barred from loading Egypt-bound cargo without a validated ACID. Heavy carrier fines and immediate cargo offloading.',
    consequenceOfNonComplianceAr:
      'يحظر قانوناً على شركات الطيران تحميل أي شحنة متجهة لمصر دون رقم ACID معتمد؛ مع فرض غرامات وإنزال فوري للبضائع.',
  },
  {
    id: 'eg_commercial_invoice',
    corridor: 'egypt_aci',
    title: 'Commercial Invoice with ACID & Tax IDs',
    titleAr: 'الفاتورة التجارية متضمنة رقم ACID والبيانات الضريبية',
    description:
      'Final commercial invoice prominently displaying the 19-digit ACID number, Egyptian importer 9-digit tax ID, and foreign exporter registration number.',
    descriptionAr:
      'الفاتورة التجارية النهائية متضمنة بوضوح رقم ACID المكون من 19 رقماً والرقم الضريبي للمستورد (9 أرقام) وبيانات تسجيل المصدر.',
    category: 'commercial_docs',
    sourceAuthority: 'Egyptian Customs Authority',
    sourceDate: '2026-10-27',
    legalReference: 'Customs Law No. 207/2020, Executive Regulations',
    isMandatory: true,
    appliesTo: (ctx) => ctx.corridor === 'egypt_aci',
    guidance:
      'Upload final invoice in PDF/structured XML to CargoX envelope prior to shipment departure.',
    guidanceAr:
      'ارفع الفاتورة النهائية بصيغة PDF أو بيانات مهيكلة داخل مظروف CargoX قبل مغادرة الشحنة.',
    consequenceOfNonCompliance:
      'Customs clearance rejection and failure of CargoX blockchain envelope verification.',
    consequenceOfNonComplianceAr:
      'رفض التخليص الجمركي وفشل مطابقة مظروف البلوكشين على منصة CargoX.',
  },
  {
    id: 'eg_packing_list',
    corridor: 'egypt_aci',
    title: 'Detailed Packing List Matching Transport Documents',
    titleAr: 'قائمة التعبئة التفصيلية المطابقة لمستندات النقل',
    description:
      'Itemized packing list specifying container numbers, package marks, gross/net weights, and dimensions matching the transport bill.',
    descriptionAr:
      'قائمة تعبئة تفصيلية توضح أرقام الحاويات، والعلامات، والأوزان الإجمالية والصافية، والأبعاد مطابقة لبوليصة الشحن.',
    category: 'commercial_docs',
    sourceAuthority: 'Egyptian Customs Authority',
    sourceDate: '2026-10-27',
    legalReference: 'Decree No. 38/2021',
    isMandatory: true,
    appliesTo: (ctx) => ctx.corridor === 'egypt_aci',
    guidance:
      'Ensure gross and net weights match the bill of lading or air waybill exactly to prevent customs discrepancy penalties.',
    guidanceAr:
      'تأكد من تطابق الأوزان الإجمالية والصافية تماماً مع بوليصة الشحن لتفادي غرامات فروقات الأوزان الجمركية.',
    consequenceOfNonCompliance:
      'Physical customs inspection delays, weight discrepancy fines, and clearance holds.',
    consequenceOfNonComplianceAr:
      'تأخير الكشف الجمركي الفعلي، وفرض غرامات فروق أوزان، ووقف الإفراج الجمركي.',
  },
  {
    id: 'eg_bill_of_lading',
    corridor: 'egypt_aci',
    title: 'Bill of Lading (B/L) Displaying 19-Digit ACID',
    titleAr: 'بوليصة الشحن البحري متضمنة رقم ACID المكون من 19 رقماً',
    description:
      'Ocean bill of lading issued by shipping line showing 19-digit ACID, Egyptian importer tax card ID, and exporter registration.',
    descriptionAr:
      'بوليصة الشحن البحري الصادرة من الخط الملاحي متضمنة رقم ACID المكون من 19 رقماً والرقم الضريبي للمستورد وبيانات المصدر.',
    category: 'commercial_docs',
    sourceAuthority: 'Egyptian Customs Authority / MTS',
    sourceDate: '2026-10-27',
    legalReference: 'Decree No. 38/2021, Article 4',
    isMandatory: true,
    appliesTo: (ctx) => ctx.corridor === 'egypt_aci' && (!ctx.mode || ctx.mode === 'sea'),
    guidance:
      'Provide shipping line with the 19-digit ACID at shipping instructions stage so it prints directly on the master B/L.',
    guidanceAr:
      'زود الخط الملاحي برقم ACID المكون من 19 رقماً عند تقديم تعليمات الشحن ليُطبع مباشرة على البوليصة الأصلية.',
    consequenceOfNonCompliance:
      'Carrier cannot file electronic manifest; vessel prohibited from discharging cargo at Egyptian ports.',
    consequenceOfNonComplianceAr:
      'تعذر تسجيل المنافيست الإلكتروني للناقل؛ وحظر تفريغ الشحنة في الموانئ البحرية المصرية.',
  },
  {
    id: 'eg_air_waybill',
    corridor: 'egypt_aci',
    title: 'Air Waybill (AWB) Displaying 19-Digit ACID',
    titleAr: 'بوليصة الشحن الجوي متضمنة رقم ACID المكون من 19 رقماً',
    description:
      'Master/House Air Waybill containing the 19-digit ACID number filed into the airline cargo system prior to flight departure.',
    descriptionAr:
      'بوليصة الشحن الجوي الرئيسية أو الفرعية متضمنة رقم ACID المكون من 19 رقماً والمسجلة في نظام طيران الشحن قبل الإقلاع.',
    category: 'commercial_docs',
    sourceAuthority: 'Egyptian Ministry of Finance / MTS',
    sourceDate: '2026-10-27',
    legalReference: 'Ministry of Finance Air Freight ACI Directive (effective 1 Jan 2026)',
    isMandatory: true,
    appliesTo: (ctx) => ctx.corridor === 'egypt_aci' && (!ctx.mode || ctx.mode === 'air'),
    guidance:
      'Enter ACID in the handling information / OSI field of the AWB and verify transmission to Egyptian airport customs.',
    guidanceAr:
      'أدرج رقم ACID في حقل تعليمات المناولة (OSI) بالبوليصة وتأكد من إرسال البيانات لجمرك المطار المصري.',
    consequenceOfNonCompliance:
      'Cargo denied loading by air carrier; immediate seizure or return on next available flight at exporter expense.',
    consequenceOfNonComplianceAr:
      'رفض شحن البضاعة من قبل الناقل الجوي، مع حجز فوري أو إعادة الشحنة على أول رحلة على نفقة المصدر.',
  },
  {
    id: 'eg_certificate_of_origin',
    corridor: 'egypt_aci',
    title: 'Certificate of Origin (COO) via CargoX',
    titleAr: 'شهادة المنشأ عبر منصة CargoX',
    description:
      'Official Certificate of Origin issued by competent authority in exporting country, uploaded electronically to CargoX blockchain envelope.',
    descriptionAr:
      'شهادة المنشأ الرسمية الصادرة من الجهة المختصة في بلد التصدير والمرفوعة إلكترونياً ضمن مظروف CargoX المشفر.',
    category: 'commercial_docs',
    sourceAuthority: 'Egyptian Customs Authority',
    sourceDate: '2026-10-27',
    legalReference: 'Customs Law No. 207/2020',
    isMandatory: true,
    appliesTo: (ctx) => ctx.corridor === 'egypt_aci',
    guidance:
      'Ensure chamber of commerce stamp and manufacturer address match the invoice and CargoX declared data.',
    guidanceAr:
      'تأكد من مصادقة الغرفة التجارية ومطابقة عنوان المصنع مع بيانات الفاتورة ومظروف CargoX.',
    consequenceOfNonCompliance:
      'Denial of preferential tariff treatment and administrative clearance delays.',
    consequenceOfNonComplianceAr:
      'حرمان الشحنة من الإعفاءات التفضيلية وتأخير الإفراج الجمركي لطلب ضمانات.',
  },

  // =========================================================================
  // Saudi Arabia SABER (SASO / FASAH) Items
  // =========================================================================
  {
    id: 'sa_importer_saber_reg',
    corridor: 'ksa_saber',
    title: 'Importer SABER Account & FASAH Clearance Integration',
    titleAr: 'حساب المستورد على سابر والربط مع منصة فسح',
    description:
      'Saudi importer must maintain an active Commercial Registration (CR) and SABER account integrated with ZATCA FASAH single window.',
    descriptionAr:
      'يجب أن يمتلك المستورد السعودي سجلاً تجارياً سارياً وحساباً مفعلاً على منصة سابر مرتبطاً ببوابة فسح (ZATCA).',
    category: 'registration',
    sourceAuthority: 'SASO / ZATCA',
    sourceDate: '2026-10-27',
    legalReference: 'SALEEM Saudi Product Safety Program; FASAH Clearance Integration',
    isMandatory: true,
    appliesTo: (ctx) => ctx.corridor === 'ksa_saber',
    guidance:
      'Confirm that the importer CR covers the specific imported product commercial activities.',
    guidanceAr:
      'تأكد من تغطية السجل التجاري للمستورد لنشاط استيراد المنتجات المحددة.',
    consequenceOfNonCompliance:
      'Importer cannot create product or shipment certificates on SABER; customs declaration cannot proceed.',
    consequenceOfNonComplianceAr:
      'تعذر تسجيل المنتجات أو طلب شهادات الإرسالية على سابر؛ وتوقف المعاملة الجمركية تماماً.',
  },
  {
    id: 'sa_pcoc_certificate',
    corridor: 'ksa_saber',
    title: 'Product Certificate of Conformity (PCoC) via Accredited CAB',
    titleAr: 'شهادة مطابقة المنتج (PCoC) من جهة تقويم مقبولة',
    description:
      'Mandatory for Regulated Products. Issued via SABER by an accredited Conformity Assessment Body (CAB, e.g. TÜV, SGS, Intertek) and valid for 1 year.',
    descriptionAr:
      'إلزامية للمنتجات الخاضعة للوائح الفنية. تصدر عبر سابر من جهة تقويم معتمدة (مثل TÜV، SGS، Intertek) وتسري لمدة سنة واحدة.',
    category: 'conformity_cert',
    sourceAuthority: 'SASO (Saudi Standards, Metrology and Quality Organization)',
    sourceDate: '2026-10-27',
    legalReference: 'SASO Conformity System Regulations; SALEEM Product Safety Program',
    isMandatory: true,
    appliesTo: (ctx) =>
      ctx.corridor === 'ksa_saber' &&
      (!ctx.regulationStatus || ctx.regulationStatus === 'regulated'),
    guidance:
      'Select an accredited CAB on SABER and verify the 1-year PCoC expiration date before booking the shipment.',
    guidanceAr:
      'اختر جهة تقويم مقبولة (CAB) عبر سابر وتأكد من صلاحية شهادة PCoC (سنة واحدة) قبل حجز الشحن.',
    consequenceOfNonCompliance:
      'Shipment Certificate (SCoC) cannot be issued. Goods will be rejected at Saudi ports of entry.',
    consequenceOfNonComplianceAr:
      'لا يمكن إصدار شهادة مطابقة الإرسالية (SCoC)؛ وسيتم رفض دخول البضائع بالموانئ السعودية.',
  },
  {
    id: 'sa_iso_test_report',
    corridor: 'ksa_saber',
    title: 'ISO/IEC 17025 Accredited Laboratory Test Report',
    titleAr: 'تقرير اختبار صادر من مختبر معتمد وفق ISO/IEC 17025',
    description:
      'Product safety and technical test report issued by an ISO/IEC 17025 accredited laboratory, required to issue the 1-year PCoC.',
    descriptionAr:
      'تقرير فحص واختبار صادر من مختبر معتمد وفق ISO/IEC 17025 يثبت مطابقة المنتج للائحة الفنية وهو شرط لإصدار PCoC.',
    category: 'conformity_cert',
    sourceAuthority: 'SASO (Saudi Standards, Metrology and Quality Organization)',
    sourceDate: '2026-10-27',
    legalReference: 'SASO SALEEM Technical Regulations',
    isMandatory: true,
    appliesTo: (ctx) =>
      ctx.corridor === 'ksa_saber' &&
      (!ctx.regulationStatus || ctx.regulationStatus === 'regulated'),
    guidance:
      'Ensure laboratory test reports are within allowed validity limits and cover applicable SASO standards.',
    guidanceAr:
      'تأكد من سريان تقرير الاختبار وتغطيته لمتطلبات المواصفات القياسية السعودية المعتمدة للمنتج.',
    consequenceOfNonCompliance:
      'CAB will reject PCoC issuance on SABER; consignment cannot be certified.',
    consequenceOfNonComplianceAr:
      'رفض جهة تقويم المطابقة (CAB) إصدار شهادة PCoC على سابر؛ وتعذر ترخيص المنتج.',
  },
  {
    id: 'sa_sdoc_declaration',
    corridor: 'ksa_saber',
    title: 'Self-Declaration of Conformity (SDoC) for Non-Regulated Goods',
    titleAr: 'إقرار المطابقة الذاتي (SDoC) للمنتجات غير الخاضعة للوائح',
    description:
      'Electronic self-declaration issued by importer directly on SABER confirming non-regulated goods meet general Saudi consumer safety standards. Exempt from PCoC.',
    descriptionAr:
      'إقرار مطابقة ذاتي إلكتروني يقدمه المستورد عبر سابر يؤكد سلامة المنتجات غير الخاضعة للوائح الفنية؛ معفي من PCoC.',
    category: 'conformity_cert',
    sourceAuthority: 'SASO (Saudi Standards, Metrology and Quality Organization)',
    sourceDate: '2026-10-27',
    legalReference: 'SASO General Product Safety Regulations',
    isMandatory: true,
    appliesTo: (ctx) =>
      ctx.corridor === 'ksa_saber' &&
      (!ctx.regulationStatus || ctx.regulationStatus === 'non_regulated'),
    guidance:
      'Ensure technical files and manufacturer declarations are archived in case of SASO market surveillance audits.',
    guidanceAr:
      'احتفظ بالملف الفني وإقرارات المصنع في أرشيف الشركة لمتطلبات الرقابة الميدانية والتفتيش اللاحق.',
    consequenceOfNonCompliance: 'Cannot proceed to SCoC generation on SABER.',
    consequenceOfNonComplianceAr:
      'تعذر الانتقال لإصدار شهادة مطابقة الإرسالية (SCoC) على سابر.',
  },
  {
    id: 'sa_scoc_certificate',
    corridor: 'ksa_saber',
    title: 'Shipment Certificate of Conformity (SCoC - 100% Mandatory Consignment Mandate)',
    titleAr: 'شهادة مطابقة الإرسالية (SCoC - إلزامية بنسبة 100% لكافة الشحنات)',
    description:
      'Mandatory for 100% of commercial consignments (both regulated and non-regulated goods). Issued per shipment via SABER against commercial invoice and packing list; syncs directly to FASAH.',
    descriptionAr:
      'إلزامية لـ 100% من الشحنات التجارية (الخاضعة وغير الخاضعة). تصدر لكل شحنة عبر سابر بناءً على الفاتورة وقائمة التعبئة وترتبط آلياً بفسح.',
    category: 'pre_shipment_filing',
    sourceAuthority: 'SASO / ZATCA FASAH Integration Mandate',
    sourceDate: '2026-10-27',
    legalReference: 'SASO / ZATCA Mandatory Clearance Decision; Customs Law',
    isMandatory: true,
    appliesTo: (ctx) => ctx.corridor === 'ksa_saber',
    guidance:
      'Issue SCoC after commercial invoice and packing list are finalized. FASAH validates SCoC before granting customs release.',
    guidanceAr:
      'أصدر شهادة SCoC فور اعتماد الفاتورة وقائمة التعبئة؛ يتحقق نظام فسح آلياً من الشهادة قبل فسح الشحنة.',
    consequenceOfNonCompliance:
      'Shipments arriving without an SCoC cannot be cleared and face mandatory re-export and financial penalties.',
    consequenceOfNonComplianceAr:
      'لا يمكن فسح الشحنات الواصلة دون شهادة SCoC وتخضع لإعادة التصدير الإلزامية وغرامات مالية.',
  },
  {
    id: 'sa_commercial_docs',
    corridor: 'ksa_saber',
    title: 'Commercial Invoice & Packing List with 12-Digit HS Codes',
    titleAr: 'الفاتورة التجارية وقائمة التعبئة بالرمز الجمركي ذي الـ 12 رقماً',
    description:
      'Final commercial invoice and packing list showing KSA 12-digit HS tariff codes, itemized quantities, country of origin, and matching SABER certificate quantities.',
    descriptionAr:
      'الفاتورة التجارية وقائمة التعبئة موضحاً بها البنود الجمركية السعودية ذات الـ 12 رقماً، ودلالة المنشأ، والكميات مطابقة لشهادة سابر.',
    category: 'commercial_docs',
    sourceAuthority: 'ZATCA (Zakat, Tax and Customs Authority)',
    sourceDate: '2026-10-27',
    legalReference: 'ZATCA Ministerial Resolution No. (1447-88-5); Customs Law',
    isMandatory: true,
    appliesTo: (ctx) => ctx.corridor === 'ksa_saber',
    guidance:
      'Ensure full 12-digit KSA integrated customs tariff classification is used on the commercial invoice.',
    guidanceAr:
      'تأكد من استخدام رمز التعريفة الجمركية المتكامل المكون من 12 رقماً المعتمد بالسعودية على الفاتورة.',
    consequenceOfNonCompliance:
      'ZATCA customs declaration rejection and tariff reclassification penalties.',
    consequenceOfNonComplianceAr:
      'رفض البيان الجمركي في منصة فسح وفرض غرامات إعادة تصنيف جمركي.',
  },
  {
    id: 'sa_coo_marking',
    corridor: 'ksa_saber',
    title: 'Non-Removable Country of Origin Marking ("Made in ...")',
    titleAr: 'دلالة المنشأ غير القابلة للإزالة ("صنع في ...")',
    description:
      'Physical, non-removable country of origin marking ("Made in [Country]") affixed permanently on each individual product and primary packaging.',
    descriptionAr:
      'دلالة منشأ ثابتة وغير قابلة للإزالة ("صنع في [الدولة]") مطبوعة أو محفورة بشكل دائم على كل وحدة منتج وعلى التغليف الأساسي.',
    category: 'labeling',
    sourceAuthority: 'SASO / ZATCA',
    sourceDate: '2026-10-27',
    legalReference: 'ZATCA Rules of Origin; SASO Marking Standards',
    isMandatory: true,
    appliesTo: (ctx) => ctx.corridor === 'ksa_saber',
    guidance:
      'Labels must be permanent (engraved, embossed, stitched, or permanent printing). Removable adhesive stickers are prohibited and rejected at port.',
    guidanceAr:
      'يجب أن تكون العلامة دائمة (حفر، نقش، خياطة أو طباعة غير قابلة للإزالة). الملصقات الورقية القابلة للإزالة ممنوعة وتؤدي لرفض الشحنة.',
    consequenceOfNonCompliance:
      'Customs border confiscation or mandatory return to country of origin at importer/carrier expense.',
    consequenceOfNonComplianceAr:
      'مصادرة البضاعة في المنفذ الجمركي أو الإعادة الإلزامية لبلد المنشأ على نفقة المستورد أو الناقل.',
  },
  {
    id: 'sa_arabic_labeling',
    corridor: 'ksa_saber',
    title: 'Arabic Labeling, Safety Warnings & Conformity Marks',
    titleAr: 'البيانات الإيضاحية والتحذيرات بالعربية وعلامات المطابقة',
    description:
      'All product packaging, safety instructions, user manuals, and specifications must include Arabic. Applicable marks (SASO Quality Mark, G-Mark) must be displayed.',
    descriptionAr:
      'يجب تضمين اللغة العربية في بطاقات المنتجات، وتعليمات السلامة، ودليل الاستخدام؛ مع طباعة علامة الجودة أو علامة المطابقة الخليجية (G-Mark) حيث ينطبق.',
    category: 'labeling',
    sourceAuthority: 'SASO (Saudi Standards, Metrology and Quality Organization)',
    sourceDate: '2026-10-27',
    legalReference: 'SASO Technical Regulations for Labeling; Gulf Technical Regulations',
    isMandatory: true,
    appliesTo: (ctx) => ctx.corridor === 'ksa_saber',
    guidance:
      'Verify Arabic translation accuracy on retail boxes and instruction leaflets prior to export dispatch.',
    guidanceAr:
      'راجع دقة الترجمة العربية على عبوات التجزئة وكتيبات التعليمات قبل شحن البضائع.',
    consequenceOfNonCompliance:
      'Product clearance denial, customs hold, and mandatory re-labeling under customs custody or re-export.',
    consequenceOfNonComplianceAr:
      'رفض الإفراج عن المنتجات، واحتجازها الجمركي، وإلزام المستورد بإعادة وضع العلامات داخل الدائرة الجمركية أو إعادة التصدير.',
  },
]

// ---------------------------------------------------------------------------
// 3. Engine Functions
// ---------------------------------------------------------------------------

/**
 * Filter checklist items applicable to the given corridor, mode, and regulation status.
 */
export function getChecklistItems(context: ChecklistContext): ChecklistItem[] {
  return CHECKLIST_ITEMS.filter((item) => item.appliesTo(context))
}

/**
 * Calculate readiness metrics, score, verdict, and regulatory warnings.
 */
export function calculateReadiness(
  items: ChecklistItem[],
  statusMap: Record<string, ItemStatus>
): ReadinessResult {
  const totalMandatory = items.filter((item) => item.isMandatory).length

  let readyCount = 0
  let pendingCount = 0
  let missingCount = 0
  const blockingItemIds: string[] = []

  for (const item of items) {
    const status = statusMap[item.id] ?? 'missing'
    if (status === 'ready') {
      readyCount += 1
    } else if (status === 'pending') {
      pendingCount += 1
    } else {
      missingCount += 1
      if (item.isMandatory) {
        blockingItemIds.push(item.id)
      }
    }
  }

  const scorePct = items.length === 0 ? 100 : Math.round((readyCount / items.length) * 100)

  let verdict: Verdict = 'READY'
  if (blockingItemIds.length > 0) {
    verdict = 'BLOCKED'
  } else if (pendingCount > 0 || missingCount > 0) {
    verdict = 'AT_RISK'
  } else {
    verdict = 'READY'
  }

  const warnings: string[] = []
  const warningsAr: string[] = []

  if (verdict === 'BLOCKED') {
    warnings.push(
      `Shipment cannot proceed: ${blockingItemIds.length} mandatory requirement(s) are missing.`
    )
    warningsAr.push(
      `لا يمكن شحن البضاعة: يوجد ${blockingItemIds.length} متطلب(ات) إلزامي(ة) مفقود(ة).`
    )
  } else if (verdict === 'AT_RISK') {
    warnings.push(
      `Shipment is at risk: ${pendingCount} requirement(s) are pending verification or completion.`
    )
    warningsAr.push(
      `الشحنة معرضة للمخاطر: يوجد ${pendingCount} متطلب(ات) قيد المتابعة أو استكمال التحقق.`
    )
  }

  // Corridor-specific regulatory alerts
  const hasEgypt = items.some((i) => i.corridor === 'egypt_aci')
  const hasKsa = items.some((i) => i.corridor === 'ksa_saber')

  if (hasEgypt) {
    warnings.push(
      'Egypt ACI: 19-digit ACID number syntax is provisional pending Egyptian forwarder / MTS technical confirmation.'
    )
    warningsAr.push(
      'نظام التسجيل المسبق المصري: صيغة رقم ACID المكون من 19 رقماً هي مواصفة مؤقتة قيد اعتماد المخلص الجمركي والدعم الفني لنافذة.'
    )

    const hasAir = items.some((i) => i.id === 'eg_acid_air_filing' || i.id === 'eg_air_waybill')
    const hasSea = items.some((i) => i.id === 'eg_acid_sea_filing' || i.id === 'eg_bill_of_lading')

    if (hasAir && !hasSea) {
      warnings.push(
        'Air Freight ACI: Mandatory since 1 January 2026. Electronic manifest must be submitted >= 4h before departure. Carriers cannot load without verified ACID.'
      )
      warningsAr.push(
        'التسجيل المسبق الجوي: إلزامي منذ 1 يناير 2026. يجب تقديم المنافيست الإلكتروني قبل 4 ساعات على الأقل من الإقلاع، ويحظر على الناقلين الشحن دون رقم ACID.'
      )
    } else if (hasSea && !hasAir) {
      warnings.push(
        'Sea Freight ACI: ACID number must be issued at least 48 hours prior to vessel departure.'
      )
      warningsAr.push(
        'التسجيل المسبق البحري: يجب إصدار رقم ACID قبل 48 ساعة على الأقل من إبحار السفينة.'
      )
    }
  }

  if (hasKsa) {
    warnings.push(
      'KSA SABER: Shipment Certificate (SCoC) is strictly mandatory for 100% of consignments entering Saudi Arabia via FASAH; missing SCoC results in mandatory re-export.'
    )
    warningsAr.push(
      'منصة سابر السعودية: شهادة مطابقة الإرسالية (SCoC) إلزامية تماماً لـ 100% من الشحنات عبر فسح؛ وعدم إصدارها يوجب إعادة التصدير الإلزامية.'
    )

    warnings.push(
      'KSA Customs: All goods and outer packaging must bear permanent, non-removable Country of Origin marking and Arabic labels.'
    )
    warningsAr.push(
      'الجمارك السعودية: يجب أن تحمل كافة المنتجات وأغلفتها الخارجية دلالة منشأ ثابتة غير قابلة للإزالة وبيانات باللغة العربية.'
    )

    const hasPcoc = items.some((i) => i.id === 'sa_pcoc_certificate')
    const hasSdoc = items.some((i) => i.id === 'sa_sdoc_declaration')

    if (hasPcoc && !hasSdoc) {
      warnings.push(
        'Regulated Products: Require an ISO/IEC 17025 accredited test report and a CAB-issued Product Certificate (PCoC) valid for 1 year.'
      )
      warningsAr.push(
        'المنتجات الخاضعة للوائح: تتطلب تقرير اختبار معتمد وفق ISO/IEC 17025 وشهادة مطابقة منتج (PCoC) صالحة لمدة سنة صادرة من جهة تقويم مقبولة.'
      )
    } else if (hasSdoc && !hasPcoc) {
      warnings.push(
        'Non-Regulated Products: Importer must issue an electronic Self-Declaration of Conformity (SDoC) on SABER.'
      )
      warningsAr.push(
        'المنتجات غير الخاضعة للوائح: يجب على المستورد إصدار إقرار مطابقة ذاتي إلكتروني (SDoC) مباشرة عبر سابر.'
      )
    }
  }

  return {
    totalMandatory,
    readyCount,
    pendingCount,
    missingCount,
    scorePct,
    verdict,
    blockingItemIds,
    warnings,
    warningsAr,
  }
}

// ---------------------------------------------------------------------------
// 4. Validation Helpers
// ---------------------------------------------------------------------------

/**
 * Validate Egyptian Advance Cargo Information Declaration (ACID) number.
 * Standard format: 19 digits.
 * Note: Maintained as UNVERIFIED-UNTIL-FORWARDER pending Egyptian forwarder / MTS confirmation.
 */
export function validateAcidNumber(acid: string): AcidValidationResult {
  const normalized = (acid ?? '').replace(/[\s-]/g, '')

  if (normalized.length === 0) {
    return {
      isValid: false,
      normalized,
      error: 'ACID number is required.',
      errorAr: 'رقم التسجيل المسبق للشحنات (ACID) مطلوب.',
      isProvisional: true,
    }
  }

  if (!/^\d+$/.test(normalized)) {
    return {
      isValid: false,
      normalized,
      error: 'ACID number must contain only numeric digits.',
      errorAr: 'يجب أن يتكون رقم ACID من أرقام فقط.',
      isProvisional: true,
    }
  }

  if (normalized.length !== 19) {
    return {
      isValid: false,
      normalized,
      error: 'ACID number must be exactly 19 digits (provisional forwarder specification).',
      errorAr: 'يجب أن يتكون رقم ACID من 19 رقماً بالضبط (مواصفة مؤقتة قيد اعتماد المخلص الجمركي).',
      isProvisional: true,
    }
  }

  return {
    isValid: true,
    normalized,
    isProvisional: true,
  }
}

/**
 * Validate Egyptian Tax Identification Number (Tax Card).
 * Standard format: exactly 9 digits.
 */
export function validateEgyptianTaxId(taxId: string): TaxIdValidationResult {
  const normalized = (taxId ?? '').replace(/[\s-]/g, '')

  if (normalized.length === 0) {
    return {
      isValid: false,
      normalized,
      error: 'Egyptian Tax ID is required.',
      errorAr: 'رقم البطاقة الضريبية المصرية مطلوب.',
    }
  }

  if (!/^\d+$/.test(normalized)) {
    return {
      isValid: false,
      normalized,
      error: 'Egyptian Tax ID must contain only numeric digits.',
      errorAr: 'يجب أن يحتوي الرقم الضريبي المصري على أرقام فقط.',
    }
  }

  if (normalized.length !== 9) {
    return {
      isValid: false,
      normalized,
      error: 'Egyptian Tax ID must be exactly 9 digits.',
      errorAr: 'يجب أن يتكون الرقم الضريبي المصري من 9 أرقام بالضبط (رقم البطاقة الضريبية).',
    }
  }

  return {
    isValid: true,
    normalized,
  }
}

/**
 * Validate Saudi SABER Certificate Number (PCoC or SCoC).
 * Accepts alphanumeric reference codes with hyphens, underscores, or slashes (length 6-35).
 */
export function validateSaberCertificateNumber(cert: string): SaberCertValidationResult {
  const normalized = (cert ?? '').trim()

  if (normalized.length === 0) {
    return {
      isValid: false,
      normalized,
      error: 'SABER certificate number is required.',
      errorAr: 'رقم شهادة سابر مطلوب.',
    }
  }

  if (!/^[A-Za-z0-9\-_/]+$/.test(normalized)) {
    return {
      isValid: false,
      normalized,
      error: 'SABER certificate number must contain only letters, numbers, hyphens, and slashes.',
      errorAr: 'يجب أن يحتوي رقم شهادة سابر على حروف أو أرقام أو فواصل فقط دون مسافات أو رموز خاصة.',
    }
  }

  if (normalized.length < 6 || normalized.length > 35) {
    return {
      isValid: false,
      normalized,
      error: 'SABER certificate number must be between 6 and 35 characters.',
      errorAr: 'يجب أن يتراوح طول رقم شهادة سابر بين 6 و35 حرفاً.',
    }
  }

  return {
    isValid: true,
    normalized,
  }
}

// ---------------------------------------------------------------------------
// 5. URL Query Serialization & Deserialization
// ---------------------------------------------------------------------------

/**
 * Serialize tool state to a URL query string.
 */
export function serializeChecklistState(state: {
  corridor: Corridor
  mode?: TransportMode
  regulationStatus?: ProductRegulationStatus
  statusMap: Record<string, ItemStatus>
}): string {
  const params = new URLSearchParams()
  params.set('corridor', state.corridor)

  if (state.mode) {
    params.set('mode', state.mode)
  }
  if (state.regulationStatus) {
    params.set('regulationStatus', state.regulationStatus)
  }
  if (state.statusMap && Object.keys(state.statusMap).length > 0) {
    params.set('statusMap', JSON.stringify(state.statusMap))
  }

  return params.toString()
}

/**
 * Deserialize URL query string to tool state.
 */
export function deserializeChecklistState(queryString: string): {
  corridor: Corridor
  mode?: TransportMode
  regulationStatus?: ProductRegulationStatus
  statusMap: Record<string, ItemStatus>
} {
  const raw = (queryString ?? '').startsWith('?') ? queryString.slice(1) : (queryString ?? '')
  let params: URLSearchParams
  try {
    params = new URLSearchParams(raw)
  } catch {
    return { corridor: 'egypt_aci', statusMap: {} }
  }

  const rawCorridor = params.get('corridor')
  const corridor: Corridor = rawCorridor === 'ksa_saber' ? 'ksa_saber' : 'egypt_aci'

  const rawMode = params.get('mode')
  const mode: TransportMode | undefined =
    rawMode === 'sea' || rawMode === 'air' ? rawMode : undefined

  const rawReg = params.get('regulationStatus')
  const regulationStatus: ProductRegulationStatus | undefined =
    rawReg === 'regulated' || rawReg === 'non_regulated' || rawReg === 'exempt'
      ? rawReg
      : undefined

  const statusMap: Record<string, ItemStatus> = {}
  const rawStatus = params.get('statusMap')
  if (rawStatus) {
    try {
      const parsed = JSON.parse(rawStatus)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        for (const [k, v] of Object.entries(parsed)) {
          if (v === 'ready' || v === 'pending' || v === 'missing') {
            statusMap[k] = v
          }
        }
      }
    } catch {
      // Malformed JSON safely ignored, fallback to empty statusMap
    }
  }

  return {
    corridor,
    ...(mode ? { mode } : {}),
    ...(regulationStatus ? { regulationStatus } : {}),
    statusMap,
  }
}
