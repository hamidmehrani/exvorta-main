/**
 * 24-Hour Concierge Export Audit Framework Engine.
 *
 * Implements the 100-Point Export Index across 4 institutional pillars
 * and 24-hour turnaround calculation per docs/runbooks/concierge-24h-audit.md.
 *
 * 100% Pure TypeScript: zero React dependencies, zero network calls, zero credentials.
 */

// ============================================================================
// 1. Types & Interfaces
// ============================================================================

export type AuditPillarId =
  | 'technical_infrastructure'
  | 'trade_architecture'
  | 'institutional_trust'
  | 'commercial_conversion';

export interface AuditCriterion {
  id: string;
  name: string;
  title: string;
  maxPoints: number;
  description: string;
  benchmark?: string;
}

export interface AuditPillarDefinition {
  id: AuditPillarId;
  romanId: 'Pillar I' | 'Pillar II' | 'Pillar III' | 'Pillar IV';
  name: string;
  title: string;
  maxScore: number;
  criteria: readonly AuditCriterion[];
}

export interface AuditPillarScore {
  pillarId: AuditPillarId;
  score: number;
  maxScore: number;
  criteriaScores?: Record<string, number>;
  notes?: string[];
}

export interface ConciergeDocumentChecklist {
  commercialInvoice: boolean;
  packingList: boolean;
  billOfLading: boolean;
}

export interface ConciergeIntakePayload {
  name: string;
  email: string;
  companyName: string;
  businessType: 'exporter' | 'importer' | 'trading_company';
  mainMarkets: string;
  budget?: '$800–1.5k' | '$1.5–3k' | '$3k+' | string;
  message?: string;
  tradeLane?: string;
  monthlyVolume?: string;
  preferredChannel?: 'email' | 'whatsapp';
  documents?: ConciergeDocumentChecklist;
  submittedAt?: Date | string;
}

export type AuditGrade = 'Critical Risk' | 'Needs Hardening' | 'Institutional Grade';

export interface AuditGradeResult {
  grade: AuditGrade;
  description: string;
}

export interface ExportIndexAudit {
  id: string;
  companyName: string;
  intakeDate: Date;
  deadlineDate: Date;
  formattedGST: string;
  overallScore: number;
  grade: AuditGrade;
  gradeDescription: string;
  pillarScores: Record<AuditPillarId, number>;
  pillars: AuditPillarScore[];
  topFrictions?: string[];
  recommendedPackage?: 'Launchpad' | 'Global Trade Infrastructure';
  documentChecklist?: ConciergeDocumentChecklist;
}

// ============================================================================
// 2. Constants
// ============================================================================

export const SLA_HOURS = 24;

export const AUDIT_PILLAR_IDS: readonly AuditPillarId[] = [
  'technical_infrastructure',
  'trade_architecture',
  'institutional_trust',
  'commercial_conversion',
] as const;

const PILLAR_DEFINITIONS: readonly AuditPillarDefinition[] = [
  {
    id: 'technical_infrastructure',
    romanId: 'Pillar I',
    name: 'Technical Infrastructure & Core Web Vitals',
    title: 'Technical Infrastructure & Core Web Vitals',
    maxScore: 25,
    criteria: [
      {
        id: 'edge_latency',
        name: 'GCC & Global Edge Latency',
        title: 'GCC & Global Edge Latency',
        maxPoints: 8,
        description:
          'Time to First Byte (TTFB) and Largest Contentful Paint (LCP) from Riyadh, Dubai, and Frankfurt nodes.',
        benchmark: 'LCP < 2.5s on mobile',
      },
      {
        id: 'mobile_optimization',
        name: 'Mobile Optimization & Layout Stability',
        title: 'Mobile Optimization & Layout Stability',
        maxPoints: 7,
        description:
          'Responsive layout performance on modern mobile viewports (iOS Safari / Chromium Android).',
        benchmark: 'CLS < 0.05',
      },
      {
        id: 'security_transport',
        name: 'Security & Transport Layer',
        title: 'Security & Transport Layer',
        maxPoints: 5,
        description: 'Valid TLS 1.3 certificate, strict HSTS, SPF/DKIM/DMARC domain email records.',
        benchmark: 'Valid TLS 1.3, Strict HSTS',
      },
      {
        id: 'asset_delivery',
        name: 'Asset Delivery & Media Optimization',
        title: 'Asset Delivery & Media Optimization',
        maxPoints: 5,
        description:
          'AVIF/WebP image compression, modern CDN delivery, no uncompressed multi-megabyte hero banners.',
        benchmark: 'Modern formats & CDN delivery',
      },
    ],
  },
  {
    id: 'trade_architecture',
    romanId: 'Pillar II',
    name: 'Trade Information Architecture & Catalog Clarity',
    title: 'Trade Information Architecture & Catalog Clarity',
    maxScore: 25,
    criteria: [
      {
        id: 'incoterms_explicitness',
        name: 'Incoterms 2020 Explicitness',
        title: 'Incoterms 2020 Explicitness',
        maxPoints: 7,
        description:
          'Clear declaration of shipping terms (FOB Izmir, CIF Jebel Ali, CFR Rotterdam). Elimination of ambiguous contact us notices.',
        benchmark: 'Incoterms 2020 named places declared',
      },
      {
        id: 'hs_classification',
        name: 'Harmonized System (HS) Classification',
        title: 'Harmonized System (HS) Classification',
        maxPoints: 6,
        description:
          'Proper 6-digit HS subheadings provided for primary product lines on product pages.',
        benchmark: '6-digit HS subheadings declared',
      },
      {
        id: 'packaging_specs',
        name: 'Packaging, Volume & Palletization Specs',
        title: 'Packaging, Volume & Palletization Specs',
        maxPoints: 6,
        description:
          'Granular data on CBM, container loading capacity (20ft / 40ft HC), gross/net weight, and Minimum Order Quantity (MOQ).',
        benchmark: 'CBM, container capacity, MOQ stated',
      },
      {
        id: 'production_capacity',
        name: 'Production Capacity & Lead Times',
        title: 'Production Capacity & Lead Times',
        maxPoints: 6,
        description: 'Stated monthly/annual factory throughput and production schedules.',
        benchmark: 'Stated throughput & lead times',
      },
    ],
  },
  {
    id: 'institutional_trust',
    romanId: 'Pillar III',
    name: 'Institutional Trust & Regulatory Compliance',
    title: 'Institutional Trust & Regulatory Compliance',
    maxScore: 25,
    criteria: [
      {
        id: 'origin_facility_proof',
        name: 'Origin & Facility Proof',
        title: 'Origin & Facility Proof',
        maxPoints: 7,
        description:
          'Verifiable factory location, industrial registration number, physical address, and high-fidelity facility documentation.',
        benchmark: 'Industrial registration and facility verification',
      },
      {
        id: 'regulatory_certifications',
        name: 'Regulatory Certifications',
        title: 'Regulatory Certifications',
        maxPoints: 7,
        description:
          'Primary documentation for target markets (ISO 9001/22000, Halal, CE, GSO, FDA registration where applicable).',
        benchmark: 'Verified target-market certificates',
      },
      {
        id: 'export_track_record',
        name: 'Export Track Record & Verification',
        title: 'Export Track Record & Verification',
        maxPoints: 6,
        description:
          'Documented export history, trade references, and institutional case evidence.',
        benchmark: 'Published export history & destinations',
      },
      {
        id: 'corporate_governance',
        name: 'Corporate Governance & Terms',
        title: 'Corporate Governance & Terms',
        maxPoints: 5,
        description:
          'Transparent export terms of sale, arbitration clauses (e.g. DIAC / ICC), and warranty standards.',
        benchmark: 'Explicit terms of sale & arbitration seat',
      },
    ],
  },
  {
    id: 'commercial_conversion',
    romanId: 'Pillar IV',
    name: 'Commercial Conversion & Inquiry Mechanics',
    title: 'Commercial Conversion & Inquiry Mechanics',
    maxScore: 25,
    criteria: [
      {
        id: 'rfq_channels',
        name: 'Direct Digital RFQ Channels',
        title: 'Direct Digital RFQ Channels',
        maxPoints: 8,
        description:
          'Seamless, structured request-for-quote forms capturing trade volume and specifications without forcing external email navigation.',
        benchmark: 'Embedded structured RFQ capture',
      },
      {
        id: 'whatsapp_integration',
        name: 'Direct WhatsApp Business Integration',
        title: 'Direct WhatsApp Business Integration',
        maxPoints: 7,
        description:
          'Instant 1-click access to the export sales desk configured with pre-filled trade parameter prompts.',
        benchmark: 'Configured WhatsApp trade desk action',
      },
      {
        id: 'multilingual_localization',
        name: 'Multilingual Localization',
        title: 'Multilingual Localization',
        maxPoints: 5,
        description:
          'Professional localization for target corridors (English primary, Arabic for GCC buyers).',
        benchmark: 'Bilingual English/Arabic readiness',
      },
      {
        id: 'response_commitment',
        name: 'Commercial Response Commitment',
        title: 'Commercial Response Commitment',
        maxPoints: 5,
        description:
          'Explicit turnaround guarantee for RFQ responses (e.g., "Formal quotation delivered within 24 business hours").',
        benchmark: '<= 24h quotation SLA published',
      },
    ],
  },
];

export const AUDIT_PILLARS: readonly AuditPillarDefinition[] & Record<AuditPillarId, AuditPillarDefinition> =
  Object.assign([...PILLAR_DEFINITIONS], {
    technical_infrastructure: PILLAR_DEFINITIONS[0],
    trade_architecture: PILLAR_DEFINITIONS[1],
    institutional_trust: PILLAR_DEFINITIONS[2],
    commercial_conversion: PILLAR_DEFINITIONS[3],
  });

// ============================================================================
// 3. Pure Utility Functions
// ============================================================================

export function calculateOverallScore(
  pillarScores: Partial<Record<AuditPillarId, number>> | Record<AuditPillarId, number>
): number {
  if (!pillarScores || typeof pillarScores !== 'object') {
    return 0;
  }
  let sum = 0;
  for (const id of AUDIT_PILLAR_IDS) {
    const val = pillarScores[id];
    if (typeof val === 'number' && !Number.isNaN(val)) {
      sum += val;
    }
  }
  if (sum < 0) return 0;
  if (sum > 100) return 100;
  return Math.round(sum);
}

export function getAuditGrade(score: number): {
  grade: 'Critical Risk' | 'Needs Hardening' | 'Institutional Grade';
  description: string;
} {
  if (score < 50) {
    return {
      grade: 'Critical Risk',
      description:
        'Severe trade architecture or technical deficiencies compromising international buyer conversion and compliance.',
    };
  }
  if (score < 80) {
    return {
      grade: 'Needs Hardening',
      description:
        'Foundational export capabilities present but lacking institutional clarity, Core Web Vitals compliance, or trade signposting.',
    };
  }
  return {
    grade: 'Institutional Grade',
    description:
      'Exemplary digital trade infrastructure meeting Tier-1 GCC and global institutional procurement standards.',
  };
}

export function calculate24hDeadline(
  intakeDate: Date,
  referenceDate?: Date
): {
  deadlineDate: Date;
  formattedGST: string;
  hoursRemaining: number;
} {
  const deadlineDate = new Date(intakeDate.getTime() + SLA_HOURS * 60 * 60 * 1000);

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Dubai',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const formattedGST = `${formatter.format(deadlineDate)} GST`;

  const ref = referenceDate ?? new Date();
  const diffMs = deadlineDate.getTime() - ref.getTime();
  const hoursRemaining = Math.max(0, Math.round(diffMs / (1000 * 60 * 60)));

  return {
    deadlineDate,
    formattedGST,
    hoursRemaining,
  };
}

export function validateDocumentChecklist(
  docs?: Partial<ConciergeDocumentChecklist> | null
): {
  valid: boolean;
  missing: string[];
  completenessPercentage: number;
} {
  const missing: string[] = [];
  if (!docs?.commercialInvoice) missing.push('commercialInvoice');
  if (!docs?.packingList) missing.push('packingList');
  if (!docs?.billOfLading) missing.push('billOfLading');

  const total = 3;
  const present = total - missing.length;
  const completenessPercentage = Math.round((present / total) * 100);

  return {
    valid: missing.length === 0,
    missing,
    completenessPercentage,
  };
}
