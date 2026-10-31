import { describe, it, expect } from 'vitest';
import {
  buildIncotermCbmSummary,
  buildEinvoicingSummary,
  formatWhatsAppUrl,
  type IncotermCbmSummaryInput,
  type EinvoicingSummaryInput,
} from './summary';

const MANDATORY_FOOTER_PLAIN = [
  'Issued via Exvorta • Commercial Trade & Logistics Intelligence',
  'https://exvorta.com',
].join('\n');

describe('buildIncotermCbmSummary', () => {
  const sampleEnglishInput: IncotermCbmSummaryInput = {
    incoterm: 'CIF',
    incotermName: 'Cost, Insurance and Freight',
    transportMode: 'sea-waterway',
    totalPieces: 10,
    totalCbm: 4.5,
    totalWeightKg: 1200,
    volumetricWeightKg: 750,
    chargeableWeightKg: 1200,
    chargeableBasis: 'actual',
    recommendation: {
      isLclRecommended: true,
      primarySuggestion: 'Ship via LCL consolidation',
      optimalSummary: 'Shared container space (approx. 4.5 CBM)',
    },
    referenceId: 'REF-12345',
    date: '2026-10-31',
    lang: 'en',
  };

  it('renders all required fields in basic English summary', () => {
    const result = buildIncotermCbmSummary(sampleEnglishInput);

    // Verify plain text structure and fields
    expect(result.plain).toContain('EXVORTA // CARGO & INCOTERMS DOSSIER');
    expect(result.plain).toContain('Reference: REF-12345');
    expect(result.plain).toContain('Date: 2026-10-31');
    expect(result.plain).toContain('Incoterm: CIF - Cost, Insurance and Freight');
    expect(result.plain).toContain('Transport Mode: Sea & Inland Waterway');
    expect(result.plain).toContain('Total Volume: 4.50 CBM (m³)');
    expect(result.plain).toContain('Total Pieces: 10');
    expect(result.plain).toContain('Gross Weight: 1,200.00 kg');
    expect(result.plain).toContain('Volumetric Weight: 750.00 kg');
    expect(result.plain).toContain('Chargeable Weight: 1,200.00 kg');
    expect(result.plain).toContain('Chargeable Basis: Actual Weight');
    expect(result.plain).toContain('Mode: LCL (Less than Container Load)');
    expect(result.plain).toContain('Suggestion: Ship via LCL consolidation');
    expect(result.plain).toContain('Container Allocation: Shared container space (approx. 4.5 CBM)');

    // Verify WhatsApp text formatting with markdown asterisks and bullets
    expect(result.whatsapp).toContain('*EXVORTA // CARGO & INCOTERMS DOSSIER*');
    expect(result.whatsapp).toContain('*Reference:* REF-12345');
    expect(result.whatsapp).toContain('*Date:* 2026-10-31');
    expect(result.whatsapp).toContain('*Incoterm:* CIF - Cost, Insurance and Freight');
    expect(result.whatsapp).toContain('*Transport Mode:* Sea & Inland Waterway');
    expect(result.whatsapp).toContain('• *Total Volume:* 4.50 CBM (m³)');
    expect(result.whatsapp).toContain('• *Total Pieces:* 10');
    expect(result.whatsapp).toContain('• *Gross Weight:* 1,200.00 kg');
    expect(result.whatsapp).toContain('• *Volumetric Weight:* 750.00 kg');
    expect(result.whatsapp).toContain('• *Chargeable Weight:* 1,200.00 kg');
    expect(result.whatsapp).toContain('• *Chargeable Basis:* Actual Weight');
    expect(result.whatsapp).toContain('• *Mode:* LCL (Less than Container Load)');
    expect(result.whatsapp).toContain('• *Suggestion:* Ship via LCL consolidation');
    expect(result.whatsapp).toContain('• *Container Allocation:* Shared container space (approx. 4.5 CBM)');
  });

  it('correctly labels chargeable basis as Volumetric Weight or Actual Weight', () => {
    // When volumetric > actual
    const volumetricBasisInput: IncotermCbmSummaryInput = {
      ...sampleEnglishInput,
      totalWeightKg: 500,
      volumetricWeightKg: 1200,
      chargeableWeightKg: 1200,
      chargeableBasis: 'volumetric',
    };
    const volResult = buildIncotermCbmSummary(volumetricBasisInput);
    expect(volResult.plain).toContain('Chargeable Basis: Volumetric Weight');
    expect(volResult.whatsapp).toContain('• *Chargeable Basis:* Volumetric Weight');

    // When actual >= volumetric
    const actualBasisInput: IncotermCbmSummaryInput = {
      ...sampleEnglishInput,
      totalWeightKg: 1500,
      volumetricWeightKg: 1200,
      chargeableWeightKg: 1500,
      chargeableBasis: 'actual',
    };
    const actResult = buildIncotermCbmSummary(actualBasisInput);
    expect(actResult.plain).toContain('Chargeable Basis: Actual Weight');
    expect(actResult.whatsapp).toContain('• *Chargeable Basis:* Actual Weight');
  });

  it('correctly outputs LCL vs FCL recommendation text', () => {
    // LCL recommendation
    const lclInput: IncotermCbmSummaryInput = {
      ...sampleEnglishInput,
      recommendation: {
        isLclRecommended: true,
        primarySuggestion: 'Ship LCL',
        optimalSummary: 'LCL summary',
      },
    };
    const lclResult = buildIncotermCbmSummary(lclInput);
    expect(lclResult.plain).toContain('Mode: LCL (Less than Container Load)');
    expect(lclResult.whatsapp).toContain('• *Mode:* LCL (Less than Container Load)');

    // FCL recommendation
    const fclInput: IncotermCbmSummaryInput = {
      ...sampleEnglishInput,
      recommendation: {
        isLclRecommended: false,
        primarySuggestion: 'Book 1x 20ft container',
        optimalSummary: '1x 20GP container',
      },
    };
    const fclResult = buildIncotermCbmSummary(fclInput);
    expect(fclResult.plain).toContain('Mode: FCL (Full Container Load)');
    expect(fclResult.whatsapp).toContain('• *Mode:* FCL (Full Container Load)');
  });

  it('supports Arabic language with Arabic labels, incoterm names, and recommendations', () => {
    const arabicInput: IncotermCbmSummaryInput = {
      incoterm: 'FOB',
      incotermName: 'تسليم على ظهر السفينة',
      transportMode: 'sea-waterway',
      totalPieces: 50,
      totalCbm: 28.5,
      totalWeightKg: 8500,
      volumetricWeightKg: 4750,
      chargeableWeightKg: 8500,
      chargeableBasis: 'actual',
      recommendation: {
        isLclRecommended: false,
        primarySuggestion: 'حاوية 40 قدم قياسية',
        optimalSummary: 'حاوية واحدة 40GP',
      },
      referenceId: 'REF-AR-100',
      date: '2026-10-31',
      lang: 'ar',
    };

    const result = buildIncotermCbmSummary(arabicInput);

    // Plain text Arabic assertions
    expect(result.plain).toContain('EXVORTA // ملف الشحنة والإنكوتيرمز');
    expect(result.plain).toContain('المرجع: REF-AR-100');
    expect(result.plain).toContain('التاريخ: 2026-10-31');
    expect(result.plain).toContain('شرط الشحن (Incoterm): FOB - تسليم على ظهر السفينة');
    expect(result.plain).toContain('وسيلة النقل: النقل البحري والممرات المائية');
    expect(result.plain).toContain('تفاصيل الشحنة والأوزان:');
    expect(result.plain).toContain('- إجمالي الحجم: 28.50 م³ (CBM)');
    expect(result.plain).toContain('- إجمالي القطع/الطرود: 50');
    expect(result.plain).toContain('- الوزن الإجمالي: 8,500.00 كغ');
    expect(result.plain).toContain('- الوزن الحجمي: 4,750.00 كغ');
    expect(result.plain).toContain('- الوزن الخاضع للرسوم: 8,500.00 كغ');
    expect(result.plain).toContain('- أساس احتساب الوزن: الوزن الفعلي');
    expect(result.plain).toContain('توصية الشحن والمعدات:');
    expect(result.plain).toContain('- نوع الشحن: حاوية كاملة (FCL)');
    expect(result.plain).toContain('- المقترح الأساسي: حاوية 40 قدم قياسية');
    expect(result.plain).toContain('- توزيع الحاويات: حاوية واحدة 40GP');

    // WhatsApp Arabic assertions
    expect(result.whatsapp).toContain('*EXVORTA // ملف الشحنة والإنكوتيرمز*');
    expect(result.whatsapp).toContain('*المرجع:* REF-AR-100');
    expect(result.whatsapp).toContain('*التاريخ:* 2026-10-31');
    expect(result.whatsapp).toContain('*شرط الشحن (Incoterm):* FOB - تسليم على ظهر السفينة');
    expect(result.whatsapp).toContain('• *نوع الشحن:* حاوية كاملة (FCL)');

    // Arabic LCL and volumetric basis test
    const arabicLclVolInput: IncotermCbmSummaryInput = {
      ...arabicInput,
      transportMode: 'any-mode',
      chargeableBasis: 'volumetric',
      recommendation: {
        isLclRecommended: true,
        primarySuggestion: 'شحن جزئي موصى به',
        optimalSummary: 'مساحة مشتركة',
      },
    };
    const arLclResult = buildIncotermCbmSummary(arabicLclVolInput);
    expect(arLclResult.plain).toContain('وسيلة النقل: كافة وسائل النقل (متعدد الوسائط)');
    expect(arLclResult.plain).toContain('- أساس احتساب الوزن: الوزن الحجمي');
    expect(arLclResult.plain).toContain('- نوع الشحن: شحن جزئي (LCL)');
  });

  it('handles reference ID and date when provided and when omitted', () => {
    // When provided
    const withMetadata = buildIncotermCbmSummary(sampleEnglishInput);
    expect(withMetadata.plain).toContain('Reference: REF-12345');
    expect(withMetadata.plain).toContain('Date: 2026-10-31');
    expect(withMetadata.whatsapp).toContain('*Reference:* REF-12345');
    expect(withMetadata.whatsapp).toContain('*Date:* 2026-10-31');

    // When omitted
    const withoutMetadataInput: IncotermCbmSummaryInput = {
      ...sampleEnglishInput,
      referenceId: undefined,
      date: undefined,
      transportMode: undefined,
    };
    const withoutMetadata = buildIncotermCbmSummary(withoutMetadataInput);
    expect(withoutMetadata.plain).not.toContain('Reference:');
    expect(withoutMetadata.plain).not.toContain('Date:');
    expect(withoutMetadata.plain).not.toContain('Transport Mode:');
    expect(withoutMetadata.whatsapp).not.toContain('*Reference:*');
    expect(withoutMetadata.whatsapp).not.toContain('*Date:*');
    expect(withoutMetadata.whatsapp).not.toContain('*Transport Mode:*');
  });

  it('satisfies MANDATORY invariant footer in both plain and whatsapp', () => {
    const enResult = buildIncotermCbmSummary(sampleEnglishInput);
    expect(enResult.plain).toContain(MANDATORY_FOOTER_PLAIN);
    expect(enResult.whatsapp).toContain(MANDATORY_FOOTER_PLAIN);

    const arResult = buildIncotermCbmSummary({ ...sampleEnglishInput, lang: 'ar' });
    expect(arResult.plain).toContain(MANDATORY_FOOTER_PLAIN);
    expect(arResult.whatsapp).toContain(MANDATORY_FOOTER_PLAIN);
  });

  it('generates whatsappUrl properly and decodes to match whatsapp text', () => {
    const result = buildIncotermCbmSummary(sampleEnglishInput);
    expect(result.whatsappUrl.startsWith('https://wa.me/?text=')).toBe(true);

    const encodedText = result.whatsappUrl.replace('https://wa.me/?text=', '');
    expect(decodeURIComponent(encodedText)).toBe(result.whatsapp);
  });
});

describe('buildEinvoicingSummary', () => {
  const sampleEinvoicingInput: EinvoicingSummaryInput = {
    score: 85,
    tier: 'substantially_prepared',
    tierLabel: 'Substantially Prepared',
    phase: 'Phase 2 (Revenue > AED 50M)',
    aspDeadline: '31 Dec 2025',
    daysUntilAsp: 60,
    goLiveDeadline: '31 Mar 2026',
    daysUntilGoLive: 150,
    criticalGapsCount: 1,
    highGapsCount: 3,
    referenceId: 'EINV-2026-001',
    date: '2026-10-31',
    lang: 'en',
  };

  it('renders all required fields in basic English summary', () => {
    const result = buildEinvoicingSummary(sampleEinvoicingInput);

    // Plain text checks
    expect(result.plain).toContain('EXVORTA // UAE E-INVOICING ASSESSMENT');
    expect(result.plain).toContain('Reference: EINV-2026-001');
    expect(result.plain).toContain('Date: 2026-10-31');
    expect(result.plain).toContain('Readiness Score: 85/100');
    expect(result.plain).toContain('Compliance Tier: Substantially Prepared');
    expect(result.plain).toContain('Mandate Timeline & Deadlines:');
    expect(result.plain).toContain('Implementation Phase: Phase 2 (Revenue > AED 50M)');
    expect(result.plain).toContain('ASP Appointment Deadline: 31 Dec 2025 (60 days remaining)');
    expect(result.plain).toContain('Mandatory Go-Live Deadline: 31 Mar 2026 (150 days remaining)');
    expect(result.plain).toContain('Gap Analysis:');
    expect(result.plain).toContain('- Critical Gaps: 1');
    expect(result.plain).toContain('- High Priority Gaps: 3');

    // WhatsApp checks
    expect(result.whatsapp).toContain('*EXVORTA // UAE E-INVOICING ASSESSMENT*');
    expect(result.whatsapp).toContain('*Reference:* EINV-2026-001');
    expect(result.whatsapp).toContain('*Date:* 2026-10-31');
    expect(result.whatsapp).toContain('*Readiness Score:* 85/100');
    expect(result.whatsapp).toContain('*Compliance Tier:* Substantially Prepared');
    expect(result.whatsapp).toContain('• *Implementation Phase:* Phase 2 (Revenue > AED 50M)');
    expect(result.whatsapp).toContain('• *ASP Appointment Deadline:* 31 Dec 2025 (60 days remaining)');
    expect(result.whatsapp).toContain('• *Mandatory Go-Live Deadline:* 31 Mar 2026 (150 days remaining)');
    expect(result.whatsapp).toContain('• *Critical Gaps:* 1');
    expect(result.whatsapp).toContain('• *High Priority Gaps:* 3');
  });

  it('correctly formats overdue, due today, and days remaining in en and ar', () => {
    // English variations
    const dueTodayEn = buildEinvoicingSummary({
      ...sampleEinvoicingInput,
      daysUntilAsp: 0,
      daysUntilGoLive: -5,
    });
    expect(dueTodayEn.plain).toContain('ASP Appointment Deadline: 31 Dec 2025 (Due today (0 days remaining))');
    expect(dueTodayEn.plain).toContain('Mandatory Go-Live Deadline: 31 Mar 2026 (Deadline passed (5 days overdue))');

    // Arabic variations
    const daysAr = buildEinvoicingSummary({
      ...sampleEinvoicingInput,
      lang: 'ar',
      daysUntilAsp: 14,
      daysUntilGoLive: 0,
    });
    expect(daysAr.plain).toContain('(متبقي 14 يوم)');
    expect(daysAr.plain).toContain('(مستحق اليوم (0 يوم متبقي))');

    const overdueAr = buildEinvoicingSummary({
      ...sampleEinvoicingInput,
      lang: 'ar',
      daysUntilAsp: -10,
    });
    expect(overdueAr.plain).toContain('(انتهى الموعد (متأخر 10 يوم))');
  });

  it('supports Arabic language and maps known and fallback tier labels', () => {
    // Known Arabic tier mappings
    const tiersToTest = [
      { key: 'compliant_ready', expectedAr: 'جاهز ومتوافق بالكامل' },
      { key: 'substantially_prepared', expectedAr: 'جاهز بشكل جوهري' },
      { key: 'developing', expectedAr: 'قيد التطوير والتحضير' },
      { key: 'critical_action', expectedAr: 'إجراءات تصحيحية فورية مطلوبة' },
    ];

    for (const { key, expectedAr } of tiersToTest) {
      const res = buildEinvoicingSummary({
        ...sampleEinvoicingInput,
        lang: 'ar',
        tier: key,
      });
      expect(res.plain).toContain(`مستوى الامتثال: ${expectedAr}`);
      expect(res.whatsapp).toContain(`*مستوى الامتثال:* ${expectedAr}`);
    }

    // Fallback to input.tierLabel if tier is unrecognized
    const customTierRes = buildEinvoicingSummary({
      ...sampleEinvoicingInput,
      lang: 'ar',
      tier: 'custom_status',
      tierLabel: 'مخصص للمؤسسة',
    });
    expect(customTierRes.plain).toContain('مستوى الامتثال: مخصص للمؤسسة');

    // Arabic headers & sections check
    expect(customTierRes.plain).toContain('EXVORTA // تقييم الجاهزية للفوترة الإلكترونية في الإمارات');
    expect(customTierRes.plain).toContain('درجة الجاهزية: 85/100');
    expect(customTierRes.plain).toContain('المواعيد التنظيمية والإلزام:');
    expect(customTierRes.plain).toContain('- مرحلة التطبيق: Phase 2 (Revenue > AED 50M)');
    expect(customEinvoicingWhatsApp(customTierRes.whatsapp));
  });

  function customEinvoicingWhatsApp(whatsapp: string) {
    expect(whatsapp).toContain('*EXVORTA // تقييم الجاهزية للفوترة الإلكترونية في الإمارات*');
    expect(whatsapp).toContain('*درجة الجاهزية:* 85/100');
    expect(whatsapp).toContain('*المواعيد التنظيمية والإلزام:*');
    expect(whatsapp).toContain('*تحليل الفجوات التنظيمية:*');
  }

  it('handles reference ID and date when provided and when omitted', () => {
    // When provided
    const withMeta = buildEinvoicingSummary(sampleEinvoicingInput);
    expect(withMeta.plain).toContain('Reference: EINV-2026-001');
    expect(withMeta.plain).toContain('Date: 2026-10-31');

    // When omitted
    const withoutMeta = buildEinvoicingSummary({
      ...sampleEinvoicingInput,
      referenceId: undefined,
      date: undefined,
    });
    expect(withoutMeta.plain).not.toContain('Reference:');
    expect(withoutMeta.plain).not.toContain('Date:');
    expect(withoutMeta.whatsapp).not.toContain('*Reference:*');
    expect(withoutMeta.whatsapp).not.toContain('*Date:*');
  });

  it('satisfies MANDATORY invariant footer in both plain and whatsapp', () => {
    const enResult = buildEinvoicingSummary(sampleEinvoicingInput);
    expect(enResult.plain).toContain(MANDATORY_FOOTER_PLAIN);
    expect(enResult.whatsapp).toContain(MANDATORY_FOOTER_PLAIN);

    const arResult = buildEinvoicingSummary({ ...sampleEinvoicingInput, lang: 'ar' });
    expect(arResult.plain).toContain(MANDATORY_FOOTER_PLAIN);
    expect(arResult.whatsapp).toContain(MANDATORY_FOOTER_PLAIN);
  });

  it('generates whatsappUrl properly and decodes to match whatsapp text', () => {
    const result = buildEinvoicingSummary(sampleEinvoicingInput);
    expect(result.whatsappUrl.startsWith('https://wa.me/?text=')).toBe(true);

    const encodedText = result.whatsappUrl.replace('https://wa.me/?text=', '');
    expect(decodeURIComponent(encodedText)).toBe(result.whatsapp);
  });
});

describe('formatWhatsAppUrl', () => {
  it('correctly formats URL with https://wa.me/?text= and URL-encodes special characters', () => {
    const message = 'Hello World & Company! Special #1: 100% *bold* & /path?';
    const url = formatWhatsAppUrl(message);

    expect(url.startsWith('https://wa.me/?text=')).toBe(true);
    expect(url).toContain('%20'); // space
    expect(url).toContain('%26'); // &
    expect(url).toContain('%23'); // #
    expect(url).toContain('%25'); // %

    const rawParam = url.replace('https://wa.me/?text=', '');
    expect(decodeURIComponent(rawParam)).toBe(message);
  });

  it('handles multi-line text with newlines and Arabic characters', () => {
    const arabicMultiline = 'سطر أول\nسطر ثاني • تفاصيل & أرقام';
    const url = formatWhatsAppUrl(arabicMultiline);

    expect(url.startsWith('https://wa.me/?text=')).toBe(true);
    expect(url).toContain('%0A'); // newline
    const decoded = decodeURIComponent(url.replace('https://wa.me/?text=', ''));
    expect(decoded).toBe(arabicMultiline);
  });
});
