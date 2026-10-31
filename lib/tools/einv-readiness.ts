/**
 * Pure TypeScript calculation engine for TOOL-6: UAE E-Invoicing (PINT-AE) Readiness Assessment.
 *
 * Grounded strictly in docs/research/regulatory-facts.md (Section 2 & 4.4):
 * - Federal Decree-Law No. 16 of 2024 (VAT) & No. 17 of 2024 (Tax Procedures)
 * - Cabinet Decision No. 106 of 2025 (Administrative Penalties up to AED 50,000)
 * - Ministerial Decisions No. 243 & 244 of 2025 (Phases, ASP obligations & PINT-AE data models)
 * - Ministerial Resolution No. 66 of 2026 (Amending MD 244/2025: ASP accreditation & certification framework)
 *
 * 100% Pure TypeScript: zero React imports, zero DOM references, zero network calls, zero side effects.
 */

// ============================================================================
// 1. Types & Interfaces
// ============================================================================

export type EntityType = 'enterprise_large' | 'sme' | 'government' | 'micro_nonresident';

export type ErpSystem =
  | 'sap_s4'
  | 'oracle_cloud'
  | 'ms_dynamics'
  | 'zoho_books'
  | 'quickbooks'
  | 'xero'
  | 'tally'
  | 'custom_legacy'
  | 'manual_excel';

export type MonthlyVolume = 'under_100' | '100_to_1000' | '1000_to_10000' | 'over_10000';

export type AspStatus = 'integrated' | 'contracted' | 'shortlisting' | 'not_started';

export interface DataHygiene {
  hasValidTrn: boolean;
  customerTrnVerified: boolean;
  peppolIdReady: boolean;
  pintTaxCategoryMapped: boolean;
  uaeDataResidencyConfirmed: boolean;
}

export interface TransactionScope {
  b2bDomestic: boolean;
  b2gGovernment: boolean;
  b2cRetail: boolean;
  crossBorderExport: boolean;
}

export interface ReadinessAssessmentInput {
  entityType: EntityType;
  erpSystem: ErpSystem;
  monthlyVolume: MonthlyVolume;
  aspStatus: AspStatus;
  dataHygiene: DataHygiene;
  transactionScope: TransactionScope;
}

export type ReadinessTier = 'compliant_ready' | 'substantially_prepared' | 'developing' | 'critical_action';
export type PhaseName = 'Phase 1' | 'Phase 2' | 'Phase 3' | 'Pilot / Exempt';

export interface ScoreCategory {
  score: number;
  maxScore: number;
  notes: string;
}

export interface CriticalGap {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  actionRequired: string;
  regulatoryCitation: string;
}

export interface AspChecklistItem {
  id: string;
  requirement: string;
  description: string;
  mandatory: boolean;
  cornerCapability: 'Corner 2/3 (ASP)' | 'Corner 5 (FTA Reporting)' | 'UBL 2.1 PINT-AE' | 'Data Residency';
}

export interface RegulatoryReference {
  code: string;
  title: string;
  effectiveDate: string;
  source: string;
  lastVerified: string;
}

export interface ReadinessAssessmentResult {
  score: number;
  tier: ReadinessTier;
  tierLabel: string;
  phase: PhaseName;
  aspDeadline: string;
  goLiveDeadline: string;
  daysUntilAspDeadline: number;
  daysUntilGoLive: number;
  aspDeadlinePassed: boolean;
  goLivePassed: boolean;
  scoreCategories: {
    erpReadiness: ScoreCategory;
    aspProcurement: ScoreCategory;
    masterDataHygiene: ScoreCategory;
    governanceArchitecture: ScoreCategory;
  };
  criticalGaps: CriticalGap[];
  aspSelectionChecklist: AspChecklistItem[];
  regulatoryReferences: RegulatoryReference[];
}

// ============================================================================
// 2. Regulatory Statutes & Reference Data
// ============================================================================

export const REGULATORY_STATUTES: Record<string, RegulatoryReference> = {
  FDL_16_2024: {
    code: 'FDL-16-2024',
    title: 'Federal Decree-Law No. 16 of 2024 (Amending VAT Decree-Law No. 8 of 2017)',
    effectiveDate: '2024-10-15',
    source: 'UAE Ministry of Finance / Federal Tax Authority',
    lastVerified: '2026-10-27',
  },
  FDL_17_2024: {
    code: 'FDL-17-2024',
    title: 'Federal Decree-Law No. 17 of 2024 (Amending Tax Procedures Decree-Law No. 28 of 2022)',
    effectiveDate: '2024-10-15',
    source: 'UAE Ministry of Finance',
    lastVerified: '2026-10-27',
  },
  CAB_DEC_106_2025: {
    code: 'CAB-DEC-106-2025',
    title: 'Cabinet Decision No. 106 of 2025 (Administrative Penalties for E-Invoicing Non-Compliance)',
    effectiveDate: '2025-05-01',
    source: 'UAE Cabinet / Ministry of Finance',
    lastVerified: '2026-10-27',
  },
  MD_243_2025: {
    code: 'MD-243-2025',
    title: 'Ministerial Decision No. 243 of 2025 (Mandatory Phases & ASP Obligations)',
    effectiveDate: '2025-09-01',
    source: 'UAE Ministry of Finance',
    lastVerified: '2026-10-27',
  },
  MD_244_2025: {
    code: 'MD-244-2025',
    title: 'Ministerial Decision No. 244 of 2025 (Technical Specifications & PINT-AE Data Models)',
    effectiveDate: '2025-09-01',
    source: 'UAE Ministry of Finance',
    lastVerified: '2026-10-27',
  },
  MR_66_2026: {
    code: 'MR-66-2026',
    title: 'Ministerial Resolution No. 66 of 2026 (Amending MD 244/2025: ASP Accreditation & Certification Framework)',
    effectiveDate: '2026-06-15',
    source: 'UAE Ministry of Finance',
    lastVerified: '2026-10-27',
  },
};

// ============================================================================
// 3. Default Assessment Input
// ============================================================================

export const DEFAULT_ASSESSMENT_INPUT: ReadinessAssessmentInput = {
  entityType: 'enterprise_large',
  erpSystem: 'sap_s4',
  monthlyVolume: '1000_to_10000',
  aspStatus: 'shortlisting',
  dataHygiene: {
    hasValidTrn: true,
    customerTrnVerified: false,
    peppolIdReady: false,
    pintTaxCategoryMapped: false,
    uaeDataResidencyConfirmed: true,
  },
  transactionScope: {
    b2bDomestic: true,
    b2gGovernment: false,
    b2cRetail: false,
    crossBorderExport: false,
  },
};

// Statutory phase metadata mapping
const PHASE_METADATA: Record<
  EntityType,
  {
    phase: PhaseName;
    aspDeadline: string;
    goLiveDeadline: string;
    aspDateUtc: number; // UTC midnight timestamp
    goLiveDateUtc: number; // UTC midnight timestamp
  }
> = {
  enterprise_large: {
    phase: 'Phase 1',
    aspDeadline: '30 October 2026',
    goLiveDeadline: '1 January 2027',
    aspDateUtc: Date.UTC(2026, 9, 30),
    goLiveDateUtc: Date.UTC(2027, 0, 1),
  },
  sme: {
    phase: 'Phase 2',
    aspDeadline: '31 March 2027',
    goLiveDeadline: '1 July 2027',
    aspDateUtc: Date.UTC(2027, 2, 31),
    goLiveDateUtc: Date.UTC(2027, 6, 1),
  },
  government: {
    phase: 'Phase 3',
    aspDeadline: '31 March 2027',
    goLiveDeadline: '1 October 2027',
    aspDateUtc: Date.UTC(2027, 2, 31),
    goLiveDateUtc: Date.UTC(2027, 9, 1),
  },
  micro_nonresident: {
    phase: 'Pilot / Exempt',
    aspDeadline: '31 March 2027',
    goLiveDeadline: '1 July 2027',
    aspDateUtc: Date.UTC(2027, 2, 31),
    goLiveDateUtc: Date.UTC(2027, 6, 1),
  },
};

// ERP readiness score mapping (max 25)
const ERP_SCORES: Record<ErpSystem, { score: number; notes: string }> = {
  sap_s4: {
    score: 25,
    notes: 'SAP S/4HANA: Native Peppol / PINT-AE e-invoicing architecture and certified integration frameworks.',
  },
  oracle_cloud: {
    score: 25,
    notes: 'Oracle Cloud / NetSuite: Enterprise cloud architecture with established Peppol DCTCE integration hooks.',
  },
  ms_dynamics: {
    score: 22,
    notes: 'Microsoft Dynamics 365: Modern cloud ERP supporting electronic document exchange and ASP API bridges.',
  },
  zoho_books: {
    score: 20,
    notes: 'Zoho Books: UAE FTA-accredited VAT software with automated cloud Peppol and ASP roadmap.',
  },
  quickbooks: {
    score: 16,
    notes: 'QuickBooks: Standard accounting requiring third-party ASP connector middleware for PINT-AE UBL 2.1.',
  },
  xero: {
    score: 16,
    notes: 'Xero: International cloud platform requiring UAE ASP API gateway for real-time DCTCE reporting.',
  },
  tally: {
    score: 15,
    notes: 'TallyPrime: Dominant GCC on-premise accounting; requires external ASP connector bridge for real-time dispatch.',
  },
  custom_legacy: {
    score: 8,
    notes: 'Custom / Legacy ERP: Proprietary system; requires custom REST API mapping to UBL 2.1 PINT-AE schema.',
  },
  manual_excel: {
    score: 0,
    notes: 'Manual / Spreadsheets: Zero automated API capability; incompatible with UAE DCTCE real-time transmission.',
  },
};

// ASP procurement score mapping (max 30)
const ASP_SCORES: Record<AspStatus, { score: number; notes: string }> = {
  integrated: {
    score: 30,
    notes: 'MoF-accredited ASP fully integrated; active end-to-end sandbox testing or live Corner 2/3 exchange in place.',
  },
  contracted: {
    score: 20,
    notes: 'Accredited ASP contracted under formal agreement; system integration and API onboarding underway.',
  },
  shortlisting: {
    score: 10,
    notes: 'ASP vendor evaluation/RFP underway; contract execution required before statutory appointment cutoff.',
  },
  not_started: {
    score: 0,
    notes: 'No accredited ASP engaged. ASP appointment is mandatory under Ministerial Decision No. 243/2025.',
  },
};

// Standard ASP selection checklist items grounded in Peppol 5-Corner DCTCE
const ASP_CHECKLIST: AspChecklistItem[] = [
  {
    id: 'asp-mof-accreditation',
    requirement: 'MoF Official ASP Accreditation',
    description: 'Provider holds active accreditation issued by the UAE Ministry of Finance under Ministerial Resolution No. 66 of 2026.',
    mandatory: true,
    cornerCapability: 'Corner 2/3 (ASP)',
  },
  {
    id: 'peppol-corner-exchange',
    requirement: 'Peppol 5-Corner DCTCE Exchange',
    description: 'Full capability to operate as Corner 2 (Seller ASP) and Corner 3 (Buyer ASP) over the secure Peppol network.',
    mandatory: true,
    cornerCapability: 'Corner 2/3 (ASP)',
  },
  {
    id: 'corner-5-reporting',
    requirement: 'Real-Time Corner 5 FTA Platform Reporting',
    description: 'Simultaneous, automated transmission of validated tax invoice data to the Federal Tax Authority (Corner 5).',
    mandatory: true,
    cornerCapability: 'Corner 5 (FTA Reporting)',
  },
  {
    id: 'ubl-pint-ae-validation',
    requirement: 'PINT-AE XML Schema (UBL 2.1) Validation',
    description: 'Native schema validation and translation into Peppol International (PINT) UAE extension specifications.',
    mandatory: true,
    cornerCapability: 'UBL 2.1 PINT-AE',
  },
  {
    id: 'peppol-id-resolution',
    requirement: 'Participant ID Directory Resolution (0237:<TRN>)',
    description: 'Automated Peppol SMP/SML participant lookup and routing using ISO 6523 ICD scheme 0237 prefix.',
    mandatory: true,
    cornerCapability: 'UBL 2.1 PINT-AE',
  },
  {
    id: 'uae-data-residency',
    requirement: 'In-Country UAE Sovereign Data Residency',
    description: 'Primary databases, transmission caches, and 5-year statutory archives hosted strictly within UAE territory.',
    mandatory: true,
    cornerCapability: 'Data Residency',
  },
  {
    id: 'tax-code-mapping-support',
    requirement: 'PINT Line-Item VAT Classification Engine',
    description: 'Automated validation for standard UAE VAT codes (S: Standard 5%, Z: Zero-rated, E: Exempt, O: Out of scope).',
    mandatory: true,
    cornerCapability: 'UBL 2.1 PINT-AE',
  },
  {
    id: 'erp-connector-availability',
    requirement: 'Native ERP Connector or Secure REST/SOAP API',
    description: 'Pre-built connectors for major ERPs or robust REST webhooks for custom in-house enterprise integration.',
    mandatory: false,
    cornerCapability: 'Corner 2/3 (ASP)',
  },
];

// ============================================================================
// 4. Pure Calculation Engine
// ============================================================================

/**
 * Calculates UAE e-invoicing readiness assessment score, tier, deadlines, gaps, and checklists.
 */
export function calculateReadiness(
  input: ReadinessAssessmentInput,
  referenceDate?: Date | string
): ReadinessAssessmentResult {
  const meta = PHASE_METADATA[input.entityType] || PHASE_METADATA.enterprise_large;

  // Normalize reference date to UTC midnight for deterministic calculations
  const ref = referenceDate
    ? typeof referenceDate === 'string'
      ? new Date(referenceDate)
      : new Date(referenceDate.getTime())
    : new Date();

  const refUtc = Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), ref.getUTCDate());
  const msPerDay = 1000 * 60 * 60 * 24;

  const diffAspDays = Math.round((meta.aspDateUtc - refUtc) / msPerDay);
  const diffGoLiveDays = Math.round((meta.goLiveDateUtc - refUtc) / msPerDay);

  const aspDeadlinePassed = diffAspDays < 0;
  const goLivePassed = diffGoLiveDays < 0;

  const daysUntilAspDeadline = Math.max(0, diffAspDays);
  const daysUntilGoLive = Math.max(0, diffGoLiveDays);

  // 1. ERP Readiness (max 25)
  const erpInfo = ERP_SCORES[input.erpSystem] || ERP_SCORES.custom_legacy;
  const erpReadiness: ScoreCategory = {
    score: erpInfo.score,
    maxScore: 25,
    notes: erpInfo.notes,
  };

  // 2. ASP Procurement (max 30)
  const aspInfo = ASP_SCORES[input.aspStatus] || ASP_SCORES.not_started;
  const aspProcurement: ScoreCategory = {
    score: aspInfo.score,
    maxScore: 30,
    notes: aspInfo.notes,
  };

  // 3. Master Data Hygiene (max 25: 5 flags * 5 pts)
  let hygienePoints = 0;
  const missingHygiene: string[] = [];

  if (input.dataHygiene.hasValidTrn) hygienePoints += 5;
  else missingHygiene.push('Valid FTA TRN');

  if (input.dataHygiene.customerTrnVerified) hygienePoints += 5;
  else missingHygiene.push('Customer TRN verification');

  if (input.dataHygiene.peppolIdReady) hygienePoints += 5;
  else missingHygiene.push('Peppol ID 0237:<TRN> format');

  if (input.dataHygiene.pintTaxCategoryMapped) hygienePoints += 5;
  else missingHygiene.push('PINT-AE VAT tax category mapping');

  if (input.dataHygiene.uaeDataResidencyConfirmed) hygienePoints += 5;
  else missingHygiene.push('UAE sovereign data residency');

  const masterDataHygiene: ScoreCategory = {
    score: hygienePoints,
    maxScore: 25,
    notes:
      missingHygiene.length === 0
        ? 'All 5 critical master data hygiene prerequisites met.'
        : `Deficits identified (${5 - missingHygiene.length}/5 met): ${missingHygiene.join(', ')}.`,
  };

  // 4. Governance & Architecture (max 20)
  let governancePoints = 0;
  const governanceNotes: string[] = [];

  // Transaction scope defined (5 pts)
  const hasAnyScope =
    input.transactionScope.b2bDomestic ||
    input.transactionScope.b2gGovernment ||
    input.transactionScope.b2cRetail ||
    input.transactionScope.crossBorderExport;
  if (hasAnyScope) {
    governancePoints += 5;
    governanceNotes.push('Transaction scope classified');
  } else {
    governanceNotes.push('No transaction scope selected');
  }

  // Core mandatory transaction scope coverage (5 pts)
  if (input.transactionScope.b2bDomestic || input.transactionScope.b2gGovernment) {
    governancePoints += 5;
    governanceNotes.push('Core DCTCE streams mapped');
  }

  // System auditability & transaction architecture (5 pts)
  if (input.erpSystem !== 'manual_excel') {
    governancePoints += 5;
    governanceNotes.push('Automated transaction audit trail supported');
  } else {
    governanceNotes.push('Spreadsheets lack statutory compliance audit trails');
  }

  // Compliance governance & sovereign residency baseline (5 pts)
  if (input.dataHygiene.uaeDataResidencyConfirmed && input.dataHygiene.hasValidTrn) {
    governancePoints += 5;
    governanceNotes.push('Statutory tax identity & data sovereignty established');
  }

  const governanceArchitecture: ScoreCategory = {
    score: governancePoints,
    maxScore: 20,
    notes: governanceNotes.join('; ') + '.',
  };

  // Total Score (0 - 100)
  const totalScore = Math.min(
    100,
    Math.max(0, erpReadiness.score + aspProcurement.score + masterDataHygiene.score + governanceArchitecture.score)
  );

  // Tier classification
  let tier: ReadinessTier;
  let tierLabel: string;
  if (totalScore >= 90) {
    tier = 'compliant_ready';
    tierLabel = 'Compliant & Ready';
  } else if (totalScore >= 70) {
    tier = 'substantially_prepared';
    tierLabel = 'Substantially Prepared';
  } else if (totalScore >= 45) {
    tier = 'developing';
    tierLabel = 'Developing Readiness';
  } else {
    tier = 'critical_action';
    tierLabel = 'Critical Action Required';
  }

  // Critical Gaps detection
  const criticalGaps: CriticalGap[] = [];

  // Gap 1: Manual Excel
  if (input.erpSystem === 'manual_excel') {
    criticalGaps.push({
      id: 'gap-manual-excel',
      severity: 'critical',
      title: 'Manual Spreadsheet Invoicing Incompatible with DCTCE',
      description: 'Generating invoices manually or using spreadsheets cannot support automated XML schema generation or real-time ASP API dispatch.',
      impact: 'Statutory non-compliance penalty up to AED 50,000 per Cabinet Decision No. 106 of 2025; rejected invoices.',
      actionRequired: 'Migrate billing workflows to an accredited accounting software or ERP with automated ASP connector.',
      regulatoryCitation: 'Ministerial Decision No. 244 of 2025; Cabinet Decision No. 106 of 2025',
    });
  }

  // Gap 2: Phase 1 Enterprise missing ASP appointment
  if (input.entityType === 'enterprise_large' && (input.aspStatus === 'not_started' || input.aspStatus === 'shortlisting')) {
    criticalGaps.push({
      id: 'gap-phase1-asp-unappointed',
      severity: 'critical',
      title: 'Urgent ASP Contract Required for Phase 1 Enterprise',
      description: 'Large enterprises (turnover >= AED 50M) must appoint a MoF-accredited ASP by 30 October 2026 to prepare for mandatory 1 January 2027 go-live.',
      impact: 'Statutory breach of Ministerial Resolution No. 66 of 2026; exposure to administrative penalties up to AED 50,000.',
      actionRequired: 'Execute service contract with accredited ASP immediately to commence sandbox testing and Peppol SMP onboarding.',
      regulatoryCitation: 'Ministerial Resolution No. 66 of 2026; Cabinet Decision No. 106 of 2025',
    });
  }

  // Gap 3: Missing valid TRN
  if (!input.dataHygiene.hasValidTrn) {
    criticalGaps.push({
      id: 'gap-missing-trn',
      severity: 'critical',
      title: 'Missing or Unregistered Tax Registration Number (TRN)',
      description: 'Entity lacks a validated 15-digit Tax Registration Number registered with the Federal Tax Authority (FTA).',
      impact: 'Inability to register on the UAE Peppol network or issue legally valid tax invoices.',
      actionRequired: 'Complete FTA tax registration to obtain a valid 15-digit TRN.',
      regulatoryCitation: 'Federal Decree-Law No. 16 of 2024; Ministerial Decision No. 244 of 2025',
    });
  }

  // Gap 4: UAE Data Residency unconfirmed
  if (!input.dataHygiene.uaeDataResidencyConfirmed) {
    criticalGaps.push({
      id: 'gap-data-residency',
      severity: 'critical',
      title: 'UAE Sovereign Data Residency Non-Compliance',
      description: 'Billing and invoice archive systems do not guarantee that electronic invoice data resides exclusively within UAE territory.',
      impact: 'Direct violation of UAE sovereign data residency mandates and Cabinet Decision No. 106 of 2025.',
      actionRequired: 'Audit cloud hosting and ASP contracts to ensure all database instances and backup archives are hosted in UAE data centers.',
      regulatoryCitation: 'Cabinet Decision No. 106 of 2025; Federal Decree-Law No. 17 of 2024',
    });
  }

  // Gap 5: Phase 2/3 ASP not started
  if ((input.entityType === 'sme' || input.entityType === 'government') && input.aspStatus === 'not_started') {
    criticalGaps.push({
      id: 'gap-phase23-asp-not-started',
      severity: 'high',
      title: 'ASP Procurement Not Started',
      description: 'Accredited Service Provider procurement has not been initiated ahead of the 31 March 2027 statutory appointment deadline.',
      impact: 'Implementation bottleneck and insufficient testing window ahead of mandatory go-live.',
      actionRequired: 'Initiate ASP RFP and vendor evaluation from the MoF accredited provider roster.',
      regulatoryCitation: 'Ministerial Decision No. 243 of 2025; Ministerial Resolution No. 66 of 2026',
    });
  }

  // Gap 6: Custom legacy ERP without integrated ASP
  if (input.erpSystem === 'custom_legacy' && input.aspStatus !== 'integrated') {
    criticalGaps.push({
      id: 'gap-custom-erp-integration',
      severity: 'high',
      title: 'Custom ERP Requires Custom PINT-AE Connector',
      description: 'In-house legacy ERP systems require dedicated API integration and UBL 2.1 PINT-AE schema translation to communicate with Corner 2 ASP.',
      impact: 'Extended development lead time (typically 3-6 months); risk of missing statutory go-live deadline.',
      actionRequired: 'Engage accredited ASP API developer team to implement PINT-AE XML mapping and webhook handling.',
      regulatoryCitation: 'Ministerial Decision No. 244 of 2025 (PINT-AE Data Dictionary)',
    });
  }

  // Gap 7: Peppol Participant ID format not ready
  if (!input.dataHygiene.peppolIdReady) {
    criticalGaps.push({
      id: 'gap-peppol-id-unready',
      severity: 'high',
      title: 'Peppol Participant ID (0237:<TRN>) Not Configured',
      description: "Participant identifier format '0237:<TRN>' is not configured in billing system or ERP directory.",
      impact: 'Inability to route or receive electronic invoices across the Peppol 5-Corner network.',
      actionRequired: 'Configure ERP and billing endpoints to format Participant IDs using ISO 6523 ICD prefix 0237 followed by the 15-digit TRN.',
      regulatoryCitation: 'Ministerial Decision No. 244 of 2025; Peppol International (PINT) UAE Extension',
    });
  }

  // Gap 8: Tax category mapping missing
  if (!input.dataHygiene.pintTaxCategoryMapped) {
    criticalGaps.push({
      id: 'gap-tax-category-mapping',
      severity: 'high',
      title: 'PINT-AE Tax Categories (S, Z, E, O) Not Mapped',
      description: 'Line items lack standardized tax category codes (Standard 5% [S], Zero-rated [Z], Exempt [E], Outside scope [O]).',
      impact: 'XML validation errors during Corner 2 / Corner 5 schema validation; rejected invoice transmissions.',
      actionRequired: 'Map ERP product tax categories to standard PINT-AE codes (S: Standard 5%, Z: Zero-rated, E: Exempt, O: Out of scope).',
      regulatoryCitation: 'Ministerial Decision No. 244 of 2025 (PINT-AE Specification)',
    });
  }

  // Gap 9: Customer TRN verification missing
  if (!input.dataHygiene.customerTrnVerified) {
    criticalGaps.push({
      id: 'gap-customer-trn-unverified',
      severity: 'medium',
      title: 'Unverified Customer Tax Registration Numbers',
      description: 'Customer master records lack verified 15-digit UAE TRNs for B2B transaction partners.',
      impact: 'Inability to validate buyer Peppol IDs on Corner 3 / Corner 5 lookup, risking invoice transmission failures.',
      actionRequired: 'Run a customer master data validation campaign to collect and verify TRNs via the FTA verification portal.',
      regulatoryCitation: 'Federal Decree-Law No. 16 of 2024; Ministerial Decision No. 244 of 2025',
    });
  }

  // Gap 10: High volume on unsupported/legacy infrastructure
  if (
    (input.monthlyVolume === '1000_to_10000' || input.monthlyVolume === 'over_10000') &&
    (input.erpSystem === 'manual_excel' || input.erpSystem === 'custom_legacy')
  ) {
    criticalGaps.push({
      id: 'gap-high-volume-fragility',
      severity: 'critical',
      title: 'High Transaction Volume on Fragile Infrastructure',
      description: 'Processing over 1,000 monthly invoices on spreadsheets or legacy ERP creates critical compliance bottleneck and failure risk.',
      impact: 'System downtime, delayed tax reporting to Corner 5 FTA portal, and compounding daily statutory penalties.',
      actionRequired: 'Deploy an enterprise-grade middleware or upgrade to a modern cloud ERP integrated with accredited ASP.',
      regulatoryCitation: 'Cabinet Decision No. 106 of 2025; Ministerial Decision No. 243 of 2025',
    });
  }

  // Gap 11: B2G without ASP
  if (input.transactionScope.b2gGovernment && input.aspStatus === 'not_started') {
    criticalGaps.push({
      id: 'gap-b2g-without-asp',
      severity: 'high',
      title: 'B2G Contracting Blocked Without Accredited ASP',
      description: 'Entity supplies government authorities but has not engaged an accredited ASP for federal procurement integration.',
      impact: 'Government procurement portals will reject non-compliant invoices, resulting in blocked payments.',
      actionRequired: 'Contract an ASP certified for federal entity Corner 5 routing and Phase 3 mandates.',
      regulatoryCitation: 'Ministerial Decision No. 243 of 2025 (Phase 3 Government Mandate)',
    });
  }

  return {
    score: totalScore,
    tier,
    tierLabel,
    phase: meta.phase,
    aspDeadline: meta.aspDeadline,
    goLiveDeadline: meta.goLiveDeadline,
    daysUntilAspDeadline,
    daysUntilGoLive,
    aspDeadlinePassed,
    goLivePassed,
    scoreCategories: {
      erpReadiness,
      aspProcurement,
      masterDataHygiene,
      governanceArchitecture,
    },
    criticalGaps,
    aspSelectionChecklist: ASP_CHECKLIST,
    regulatoryReferences: Object.values(REGULATORY_STATUTES),
  };
}

// ============================================================================
// 5. URL Serialization & Deserialization
// ============================================================================

const VALID_ENTITIES = new Set<EntityType>(['enterprise_large', 'sme', 'government', 'micro_nonresident']);
const VALID_ERPS = new Set<ErpSystem>([
  'sap_s4',
  'oracle_cloud',
  'ms_dynamics',
  'zoho_books',
  'quickbooks',
  'xero',
  'tally',
  'custom_legacy',
  'manual_excel',
]);
const VALID_VOLUMES = new Set<MonthlyVolume>(['under_100', '100_to_1000', '1000_to_10000', 'over_10000']);
const VALID_ASPS = new Set<AspStatus>(['integrated', 'contracted', 'shortlisting', 'not_started']);

/**
 * Serializes partial or complete readiness input into URL query parameters string.
 */
export function serializeAssessmentInput(input: Partial<ReadinessAssessmentInput>): string {
  const params = new URLSearchParams();

  if (input.entityType) params.set('entityType', input.entityType);
  if (input.erpSystem) params.set('erpSystem', input.erpSystem);
  if (input.monthlyVolume) params.set('monthlyVolume', input.monthlyVolume);
  if (input.aspStatus) params.set('aspStatus', input.aspStatus);

  if (input.dataHygiene) {
    if (input.dataHygiene.hasValidTrn !== undefined) {
      params.set('hasValidTrn', input.dataHygiene.hasValidTrn ? '1' : '0');
    }
    if (input.dataHygiene.customerTrnVerified !== undefined) {
      params.set('customerTrnVerified', input.dataHygiene.customerTrnVerified ? '1' : '0');
    }
    if (input.dataHygiene.peppolIdReady !== undefined) {
      params.set('peppolIdReady', input.dataHygiene.peppolIdReady ? '1' : '0');
    }
    if (input.dataHygiene.pintTaxCategoryMapped !== undefined) {
      params.set('pintTaxCategoryMapped', input.dataHygiene.pintTaxCategoryMapped ? '1' : '0');
    }
    if (input.dataHygiene.uaeDataResidencyConfirmed !== undefined) {
      params.set('uaeDataResidencyConfirmed', input.dataHygiene.uaeDataResidencyConfirmed ? '1' : '0');
    }
  }

  if (input.transactionScope) {
    if (input.transactionScope.b2bDomestic !== undefined) {
      params.set('b2bDomestic', input.transactionScope.b2bDomestic ? '1' : '0');
    }
    if (input.transactionScope.b2gGovernment !== undefined) {
      params.set('b2gGovernment', input.transactionScope.b2gGovernment ? '1' : '0');
    }
    if (input.transactionScope.b2cRetail !== undefined) {
      params.set('b2cRetail', input.transactionScope.b2cRetail ? '1' : '0');
    }
    if (input.transactionScope.crossBorderExport !== undefined) {
      params.set('crossBorderExport', input.transactionScope.crossBorderExport ? '1' : '0');
    }
  }

  return params.toString();
}

function parseBool(val: string | null): boolean | undefined {
  if (val === null) return undefined;
  const s = val.trim().toLowerCase();
  if (s === '1' || s === 'true' || s === 'yes') return true;
  if (s === '0' || s === 'false' || s === 'no') return false;
  return undefined;
}

/**
 * Deserializes URL query parameters or string into a partial ReadinessAssessmentInput.
 */
export function deserializeAssessmentInput(
  queryOrParams: string | URLSearchParams | null | undefined
): Partial<ReadinessAssessmentInput> {
  if (!queryOrParams) return {};

  let params: URLSearchParams;
  if (typeof queryOrParams === 'string') {
    try {
      const cleaned = queryOrParams.includes('?') ? queryOrParams.split('?')[1] : queryOrParams;
      params = new URLSearchParams(cleaned);
    } catch {
      return {};
    }
  } else {
    params = queryOrParams;
  }

  const result: Partial<ReadinessAssessmentInput> = {};

  // Entity Type
  const rawEntity = (params.get('entityType') || params.get('entity')) as EntityType | null;
  if (rawEntity && VALID_ENTITIES.has(rawEntity)) {
    result.entityType = rawEntity;
  }

  // ERP System
  const rawErp = (params.get('erpSystem') || params.get('erp')) as ErpSystem | null;
  if (rawErp && VALID_ERPS.has(rawErp)) {
    result.erpSystem = rawErp;
  }

  // Monthly Volume
  const rawVolume = (params.get('monthlyVolume') || params.get('volume')) as MonthlyVolume | null;
  if (rawVolume && VALID_VOLUMES.has(rawVolume)) {
    result.monthlyVolume = rawVolume;
  }

  // ASP Status
  const rawAsp = (params.get('aspStatus') || params.get('asp')) as AspStatus | null;
  if (rawAsp && VALID_ASPS.has(rawAsp)) {
    result.aspStatus = rawAsp;
  }

  // Data Hygiene
  const hasValidTrn = parseBool(params.get('hasValidTrn') || params.get('trn'));
  const customerTrnVerified = parseBool(params.get('customerTrnVerified') || params.get('custTrn'));
  const peppolIdReady = parseBool(params.get('peppolIdReady') || params.get('peppol'));
  const pintTaxCategoryMapped = parseBool(params.get('pintTaxCategoryMapped') || params.get('pintTax'));
  const uaeDataResidencyConfirmed = parseBool(params.get('uaeDataResidencyConfirmed') || params.get('residency'));

  if (
    hasValidTrn !== undefined ||
    customerTrnVerified !== undefined ||
    peppolIdReady !== undefined ||
    pintTaxCategoryMapped !== undefined ||
    uaeDataResidencyConfirmed !== undefined
  ) {
    result.dataHygiene = {
      hasValidTrn: hasValidTrn ?? DEFAULT_ASSESSMENT_INPUT.dataHygiene.hasValidTrn,
      customerTrnVerified: customerTrnVerified ?? DEFAULT_ASSESSMENT_INPUT.dataHygiene.customerTrnVerified,
      peppolIdReady: peppolIdReady ?? DEFAULT_ASSESSMENT_INPUT.dataHygiene.peppolIdReady,
      pintTaxCategoryMapped: pintTaxCategoryMapped ?? DEFAULT_ASSESSMENT_INPUT.dataHygiene.pintTaxCategoryMapped,
      uaeDataResidencyConfirmed:
        uaeDataResidencyConfirmed ?? DEFAULT_ASSESSMENT_INPUT.dataHygiene.uaeDataResidencyConfirmed,
    };
  }

  // Transaction Scope
  const b2bDomestic = parseBool(params.get('b2bDomestic') || params.get('b2b'));
  const b2gGovernment = parseBool(params.get('b2gGovernment') || params.get('b2g'));
  const b2cRetail = parseBool(params.get('b2cRetail') || params.get('b2c'));
  const crossBorderExport = parseBool(params.get('crossBorderExport') || params.get('export'));

  if (
    b2bDomestic !== undefined ||
    b2gGovernment !== undefined ||
    b2cRetail !== undefined ||
    crossBorderExport !== undefined
  ) {
    result.transactionScope = {
      b2bDomestic: b2bDomestic ?? DEFAULT_ASSESSMENT_INPUT.transactionScope.b2bDomestic,
      b2gGovernment: b2gGovernment ?? DEFAULT_ASSESSMENT_INPUT.transactionScope.b2gGovernment,
      b2cRetail: b2cRetail ?? DEFAULT_ASSESSMENT_INPUT.transactionScope.b2cRetail,
      crossBorderExport: crossBorderExport ?? DEFAULT_ASSESSMENT_INPUT.transactionScope.crossBorderExport,
    };
  }

  return result;
}
