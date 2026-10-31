/**
 * Summary Engine for Exvorta Free Tools (TOOL-10).
 *
 * Generates structured plain text and WhatsApp-formatted dossiers
 * for logistics calculations (Incoterms & CBM) and UAE E-Invoicing Readiness.
 *
 * 100% Pure TypeScript: zero React imports, zero DOM references,
 * zero network calls, zero external dependencies.
 */

// ============================================================================
// 1. Interfaces & Types
// ============================================================================

export interface IncotermCbmSummaryInput {
  incoterm: string;
  incotermName: string;
  transportMode?: 'sea-waterway' | 'any-mode';
  totalPieces: number;
  totalCbm: number;
  totalWeightKg: number;
  volumetricWeightKg: number;
  chargeableWeightKg: number;
  chargeableBasis: 'actual' | 'volumetric';
  recommendation: {
    isLclRecommended: boolean;
    primarySuggestion: string;
    optimalSummary: string;
  };
  referenceId?: string;
  date?: string;
  lang?: 'en' | 'ar';
}

export interface EinvoicingSummaryInput {
  score: number;
  tier: string;
  tierLabel: string;
  phase: string;
  aspDeadline: string;
  daysUntilAsp: number;
  goLiveDeadline: string;
  daysUntilGoLive: number;
  criticalGapsCount: number;
  highGapsCount: number;
  referenceId?: string;
  date?: string;
  lang?: 'en' | 'ar';
}

export interface SummaryResult {
  plain: string;
  whatsapp: string;
  whatsappUrl: string;
}

// ============================================================================
// 2. Constants & Helpers
// ============================================================================

const MANDATORY_FOOTER = [
  'Issued via Exvorta • Commercial Trade & Logistics Intelligence',
  'https://exvorta.com',
].join('\n');

const AR_TIER_LABELS: Record<string, string> = {
  compliant_ready: 'جاهز ومتوافق بالكامل',
  substantially_prepared: 'جاهز بشكل جوهري',
  developing: 'قيد التطوير والتحضير',
  critical_action: 'إجراءات تصحيحية فورية مطلوبة',
};

function formatNumber(val: number, decimals: number = 2): string {
  if (!Number.isFinite(val)) return '0';
  return val.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatDaysRemaining(days: number, lang: 'en' | 'ar'): string {
  if (lang === 'ar') {
    if (days > 0) return `متبقي ${days} يوم`;
    if (days === 0) return 'مستحق اليوم (0 يوم متبقي)';
    return `انتهى الموعد (متأخر ${Math.abs(days)} يوم)`;
  }
  if (days > 0) return `${days} days remaining`;
  if (days === 0) return 'Due today (0 days remaining)';
  return `Deadline passed (${Math.abs(days)} days overdue)`;
}

// ============================================================================
// 3. WhatsApp URL Generator
// ============================================================================

export function formatWhatsAppUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

// ============================================================================
// 4. Incoterms & CBM Summary Builder
// ============================================================================

export function buildIncotermCbmSummary(input: IncotermCbmSummaryInput): SummaryResult {
  const isAr = input.lang === 'ar';
  const pieces = Number.isFinite(input.totalPieces) ? Math.max(0, Math.round(input.totalPieces)) : 0;
  const piecesFormatted = pieces.toLocaleString('en-US');
  const cbmFormatted = formatNumber(input.totalCbm, 2);
  const grossFormatted = formatNumber(input.totalWeightKg, 2);
  const volFormatted = formatNumber(input.volumetricWeightKg, 2);
  const chgFormatted = formatNumber(input.chargeableWeightKg, 2);

  const basisLabel = input.chargeableBasis === 'volumetric'
    ? (isAr ? 'الوزن الحجمي' : 'Volumetric Weight')
    : (isAr ? 'الوزن الفعلي' : 'Actual Weight');

  const recMode = input.recommendation.isLclRecommended
    ? (isAr ? 'شحن جزئي (LCL)' : 'LCL (Less than Container Load)')
    : (isAr ? 'حاوية كاملة (FCL)' : 'FCL (Full Container Load)');

  let plain = '';
  let whatsapp = '';

  if (isAr) {
    // Arabic Plain Text
    const plainLines: string[] = [
      'EXVORTA // ملف الشحنة والإنكوتيرمز',
      '----------------------------------------',
    ];

    if (input.referenceId) {
      plainLines.push(`المرجع: ${input.referenceId}`);
    }
    if (input.date) {
      plainLines.push(`التاريخ: ${input.date}`);
    }

    plainLines.push(`شرط الشحن (Incoterm): ${input.incoterm} - ${input.incotermName}`);

    if (input.transportMode) {
      const modeText = input.transportMode === 'sea-waterway'
        ? 'النقل البحري والممرات المائية'
        : 'كافة وسائل النقل (متعدد الوسائط)';
      plainLines.push(`وسيلة النقل: ${modeText}`);
    }

    plainLines.push(
      '',
      'تفاصيل الشحنة والأوزان:',
      `- إجمالي الحجم: ${cbmFormatted} م³ (CBM)`,
      `- إجمالي القطع/الطرود: ${piecesFormatted}`,
      `- الوزن الإجمالي: ${grossFormatted} كغ`,
      `- الوزن الحجمي: ${volFormatted} كغ`,
      `- الوزن الخاضع للرسوم: ${chgFormatted} كغ`,
      `- أساس احتساب الوزن: ${basisLabel}`,
      '',
      'توصية الشحن والمعدات:',
      `- نوع الشحن: ${recMode}`,
      `- المقترح الأساسي: ${input.recommendation.primarySuggestion}`,
      `- توزيع الحاويات: ${input.recommendation.optimalSummary}`,
      '----------------------------------------',
      MANDATORY_FOOTER,
    );

    plain = plainLines.join('\n');

    // Arabic WhatsApp Text
    const waLines: string[] = [
      '*EXVORTA // ملف الشحنة والإنكوتيرمز*',
      '────────────────────────',
    ];

    if (input.referenceId) {
      waLines.push(`*المرجع:* ${input.referenceId}`);
    }
    if (input.date) {
      waLines.push(`*التاريخ:* ${input.date}`);
    }

    waLines.push(`*شرط الشحن (Incoterm):* ${input.incoterm} - ${input.incotermName}`);

    if (input.transportMode) {
      const modeText = input.transportMode === 'sea-waterway'
        ? 'النقل البحري والممرات المائية'
        : 'كافة وسائل النقل (متعدد الوسائط)';
      waLines.push(`*وسيلة النقل:* ${modeText}`);
    }

    waLines.push(
      '',
      '*تفاصيل الشحنة والأوزان:*',
      `• *إجمالي الحجم:* ${cbmFormatted} م³ (CBM)`,
      `• *إجمالي القطع/الطرود:* ${piecesFormatted}`,
      `• *الوزن الإجمالي:* ${grossFormatted} كغ`,
      `• *الوزن الحجمي:* ${volFormatted} كغ`,
      `• *الوزن الخاضع للرسوم:* ${chgFormatted} كغ`,
      `• *أساس احتساب الوزن:* ${basisLabel}`,
      '',
      '*توصية الشحن والمعدات:*',
      `• *نوع الشحن:* ${recMode}`,
      `• *المقترح الأساسي:* ${input.recommendation.primarySuggestion}`,
      `• *توزيع الحاويات:* ${input.recommendation.optimalSummary}`,
      '────────────────────────',
      MANDATORY_FOOTER,
    );

    whatsapp = waLines.join('\n');
  } else {
    // English Plain Text
    const plainLines: string[] = [
      'EXVORTA // CARGO & INCOTERMS DOSSIER',
      '----------------------------------------',
    ];

    if (input.referenceId) {
      plainLines.push(`Reference: ${input.referenceId}`);
    }
    if (input.date) {
      plainLines.push(`Date: ${input.date}`);
    }

    plainLines.push(`Incoterm: ${input.incoterm} - ${input.incotermName}`);

    if (input.transportMode) {
      const modeText = input.transportMode === 'sea-waterway'
        ? 'Sea & Inland Waterway'
        : 'Any Transport Mode (Multimodal)';
      plainLines.push(`Transport Mode: ${modeText}`);
    }

    plainLines.push(
      '',
      'Cargo Dimensions & Weight:',
      `- Total Volume: ${cbmFormatted} CBM (m³)`,
      `- Total Pieces: ${piecesFormatted}`,
      `- Gross Weight: ${grossFormatted} kg`,
      `- Volumetric Weight: ${volFormatted} kg`,
      `- Chargeable Weight: ${chgFormatted} kg`,
      `- Chargeable Basis: ${basisLabel}`,
      '',
      'Freight Recommendation:',
      `- Mode: ${recMode}`,
      `- Suggestion: ${input.recommendation.primarySuggestion}`,
      `- Container Allocation: ${input.recommendation.optimalSummary}`,
      '----------------------------------------',
      MANDATORY_FOOTER,
    );

    plain = plainLines.join('\n');

    // English WhatsApp Text
    const waLines: string[] = [
      '*EXVORTA // CARGO & INCOTERMS DOSSIER*',
      '────────────────────────',
    ];

    if (input.referenceId) {
      waLines.push(`*Reference:* ${input.referenceId}`);
    }
    if (input.date) {
      waLines.push(`*Date:* ${input.date}`);
    }

    waLines.push(`*Incoterm:* ${input.incoterm} - ${input.incotermName}`);

    if (input.transportMode) {
      const modeText = input.transportMode === 'sea-waterway'
        ? 'Sea & Inland Waterway'
        : 'Any Transport Mode (Multimodal)';
      waLines.push(`*Transport Mode:* ${modeText}`);
    }

    waLines.push(
      '',
      '*Cargo Dimensions & Weight:*',
      `• *Total Volume:* ${cbmFormatted} CBM (m³)`,
      `• *Total Pieces:* ${piecesFormatted}`,
      `• *Gross Weight:* ${grossFormatted} kg`,
      `• *Volumetric Weight:* ${volFormatted} kg`,
      `• *Chargeable Weight:* ${chgFormatted} kg`,
      `• *Chargeable Basis:* ${basisLabel}`,
      '',
      '*Freight Recommendation:*',
      `• *Mode:* ${recMode}`,
      `• *Suggestion:* ${input.recommendation.primarySuggestion}`,
      `• *Container Allocation:* ${input.recommendation.optimalSummary}`,
      '────────────────────────',
      MANDATORY_FOOTER,
    );

    whatsapp = waLines.join('\n');
  }

  return {
    plain,
    whatsapp,
    whatsappUrl: formatWhatsAppUrl(whatsapp),
  };
}

// ============================================================================
// 5. UAE E-Invoicing Assessment Summary Builder
// ============================================================================

export function buildEinvoicingSummary(input: EinvoicingSummaryInput): SummaryResult {
  const isAr = input.lang === 'ar';
  const tierDisplay = isAr
    ? (AR_TIER_LABELS[input.tier] || input.tierLabel)
    : input.tierLabel;

  const aspDaysText = formatDaysRemaining(input.daysUntilAsp, isAr ? 'ar' : 'en');
  const goLiveDaysText = formatDaysRemaining(input.daysUntilGoLive, isAr ? 'ar' : 'en');

  let plain = '';
  let whatsapp = '';

  if (isAr) {
    // Arabic Plain Text
    const plainLines: string[] = [
      'EXVORTA // تقييم الجاهزية للفوترة الإلكترونية في الإمارات',
      '----------------------------------------',
    ];

    if (input.referenceId) {
      plainLines.push(`المرجع: ${input.referenceId}`);
    }
    if (input.date) {
      plainLines.push(`التاريخ: ${input.date}`);
    }

    plainLines.push(
      `درجة الجاهزية: ${input.score}/100`,
      `مستوى الامتثال: ${tierDisplay}`,
      '',
      'المواعيد التنظيمية والإلزام:',
      `- مرحلة التطبيق: ${input.phase}`,
      `- الموعد النهائي لتعيين مزود الخدمة (ASP): ${input.aspDeadline} (${aspDaysText})`,
      `- الموعد النهائي للتشغيل الإلزامي: ${input.goLiveDeadline} (${goLiveDaysText})`,
      '',
      'تحليل الفجوات التنظيمية:',
      `- فجوات حرجة: ${input.criticalGapsCount}`,
      `- فجوات عالية الأهمية: ${input.highGapsCount}`,
      '----------------------------------------',
      MANDATORY_FOOTER,
    );

    plain = plainLines.join('\n');

    // Arabic WhatsApp Text
    const waLines: string[] = [
      '*EXVORTA // تقييم الجاهزية للفوترة الإلكترونية في الإمارات*',
      '────────────────────────',
    ];

    if (input.referenceId) {
      waLines.push(`*المرجع:* ${input.referenceId}`);
    }
    if (input.date) {
      waLines.push(`*التاريخ:* ${input.date}`);
    }

    waLines.push(
      `*درجة الجاهزية:* ${input.score}/100`,
      `*مستوى الامتثال:* ${tierDisplay}`,
      '',
      '*المواعيد التنظيمية والإلزام:*',
      `• *مرحلة التطبيق:* ${input.phase}`,
      `• *الموعد النهائي لتعيين مزود الخدمة (ASP):* ${input.aspDeadline} (${aspDaysText})`,
      `• *الموعد النهائي للتشغيل الإلزامي:* ${input.goLiveDeadline} (${goLiveDaysText})`,
      '',
      '*تحليل الفجوات التنظيمية:*',
      `• *فجوات حرجة:* ${input.criticalGapsCount}`,
      `• *فجوات عالية الأهمية:* ${input.highGapsCount}`,
      '────────────────────────',
      MANDATORY_FOOTER,
    );

    whatsapp = waLines.join('\n');
  } else {
    // English Plain Text
    const plainLines: string[] = [
      'EXVORTA // UAE E-INVOICING ASSESSMENT',
      '----------------------------------------',
    ];

    if (input.referenceId) {
      plainLines.push(`Reference: ${input.referenceId}`);
    }
    if (input.date) {
      plainLines.push(`Date: ${input.date}`);
    }

    plainLines.push(
      `Readiness Score: ${input.score}/100`,
      `Compliance Tier: ${tierDisplay}`,
      '',
      'Mandate Timeline & Deadlines:',
      `- Implementation Phase: ${input.phase}`,
      `- ASP Appointment Deadline: ${input.aspDeadline} (${aspDaysText})`,
      `- Mandatory Go-Live Deadline: ${input.goLiveDeadline} (${goLiveDaysText})`,
      '',
      'Gap Analysis:',
      `- Critical Gaps: ${input.criticalGapsCount}`,
      `- High Priority Gaps: ${input.highGapsCount}`,
      '----------------------------------------',
      MANDATORY_FOOTER,
    );

    plain = plainLines.join('\n');

    // English WhatsApp Text
    const waLines: string[] = [
      '*EXVORTA // UAE E-INVOICING ASSESSMENT*',
      '────────────────────────',
    ];

    if (input.referenceId) {
      waLines.push(`*Reference:* ${input.referenceId}`);
    }
    if (input.date) {
      waLines.push(`*Date:* ${input.date}`);
    }

    waLines.push(
      `*Readiness Score:* ${input.score}/100`,
      `*Compliance Tier:* ${tierDisplay}`,
      '',
      '*Mandate Timeline & Deadlines:*',
      `• *Implementation Phase:* ${input.phase}`,
      `• *ASP Appointment Deadline:* ${input.aspDeadline} (${aspDaysText})`,
      `• *Mandatory Go-Live Deadline:* ${input.goLiveDeadline} (${goLiveDaysText})`,
      '',
      '*Gap Analysis:*',
      `• *Critical Gaps:* ${input.criticalGapsCount}`,
      `• *High Priority Gaps:* ${input.highGapsCount}`,
      '────────────────────────',
      MANDATORY_FOOTER,
    );

    whatsapp = waLines.join('\n');
  }

  return {
    plain,
    whatsapp,
    whatsappUrl: formatWhatsAppUrl(whatsapp),
  };
}
