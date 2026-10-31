/**
 * Pure TypeScript calculation engine for CONV-09: Export Documents Checklist Lead Magnet.
 *
 * Grounded strictly in docs/research/regulatory-facts.md (Card FACTS-0, date 2026-10-27):
 * - GCC 12-Digit Integrated Customs Tariff Framework (GCC-CUA, ZATCA Res. 1447-88-5, Dubai Customs Notice 02/2026)
 * - Egypt Advance Cargo Information (ACI) System (Decree No. 38/2021 & Jan 2026 Air Mandate)
 * - KSA SABER Platform Pre-Shipment Certification (SASO SALEEM Program & FASAH Integration)
 * - UAE E-Invoicing Regime (PINT-AE / Peppol 5-Corner DCTCE, MD 243/244 2025, MR 66/2026)
 * - EU CBAM Definitive Regime (Regulation (EU) 2023/956, Regulation (EU) 2025/2083, 50-tonne de minimis rule)
 *
 * 100% Pure TypeScript: zero React imports, zero DOM references, zero network calls, zero side effects.
 */

// ============================================================================
// 1. Types & Interfaces
// ============================================================================

export type CorridorId =
  | 'intra-gcc'
  | 'ksa-inbound'
  | 'egypt-inbound'
  | 'uae-inbound'
  | 'eu-cbam';

export type DocumentCategory =
  | 'customs'
  | 'conformity'
  | 'commercial'
  | 'transport'
  | 'sustainability';

export type RegulatoryClassification = 'VERIFIED' | 'UNVERIFIED' | 'ASSUMPTION';

export interface TradeCorridor {
  id: CorridorId;
  name: string;
  title: string;
  description: string;
  governingAuthority: string;
  legalBasis: string;
  classification: RegulatoryClassification;
  verifiedDate: '2026-10-27';
}

export interface ExportDocument {
  id: string;
  corridorId: CorridorId;
  name: string;
  title: string;
  category: DocumentCategory;
  classification: RegulatoryClassification;
  verifiedDate: '2026-10-27';
  governingAuthority: string;
  legalBasis: string;
  mandatory: boolean;
  criticalTiming: string;
  nonComplianceRisk: string;
  requiredDataFields: string[];
  disclaimer?: string;
  notes?: string;
}

export type ExportChecklistItem = ExportDocument;
export type Corridor = TradeCorridor;

export interface DocumentFilters {
  corridorId?: CorridorId;
  category?: DocumentCategory;
  mandatoryOnly?: boolean;
}

export interface CorridorStats {
  total: number;
  mandatory: number;
  optional: number;
}

export interface ChecklistStats {
  totalDocuments: number;
  mandatoryDocuments: number;
  optionalDocuments: number;
  corridorsCount: number;
  byCorridor: Record<CorridorId, CorridorStats>;
  byCategory: Record<DocumentCategory, number>;
  byClassification: Record<RegulatoryClassification, number>;
  verifiedDate: '2026-10-27';
}

export interface AcidValidationResult {
  isValidFormat: boolean;
  isVerifiedSpec: false;
  disclaimer: string;
  message: string;
}

export interface CbamThresholdResult {
  netMassTonnes: number;
  thresholdTonnes: number;
  isExempt: boolean;
  requiresReporting: boolean;
  classification: RegulatoryClassification;
  verifiedDate: '2026-10-27';
  legalBasis: string;
  message: string;
}

// ============================================================================
// 2. Constants & Regulatory Disclaimers
// ============================================================================

export const EGYPT_ACID_DISCLAIMER =
  '*Not verified: Exact 19-digit syntax and checksum structure of Egypt ACID number (awaiting Egyptian forwarder / MTS technical confirmer).*';

export const CBAM_DE_MINIMIS_MASS_TONNES = 50;

// ============================================================================
// 3. Trade Corridors Definition
// ============================================================================

export const CORRIDORS: readonly TradeCorridor[] = [
  {
    id: 'intra-gcc',
    name: 'Intra-GCC / UAE-KSA Regional Trade',
    title: 'Intra-GCC / UAE-KSA Regional Trade',
    description:
      'Cross-border regional trade within the GCC Customs Union, governed by unified customs procedures and the 12-digit integrated tariff framework.',
    governingAuthority: 'GCC Customs Union Authority (GCC-CUA) / ZATCA / Dubai Customs',
    legalBasis: 'GCC Unified Customs Law & Unified 12-Digit Integrated Customs Tariff Framework (effective 1 Jan 2026)',
    classification: 'VERIFIED',
    verifiedDate: '2026-10-27',
  },
  {
    id: 'ksa-inbound',
    name: 'Saudi Arabia Inbound Trade',
    title: 'Saudi Arabia Inbound Trade',
    description:
      'Commercial import clearance into the Kingdom of Saudi Arabia requiring SASO SABER conformity certification and ZATCA 12-digit HS customs declaration.',
    governingAuthority:
      'Zakat, Tax and Customs Authority (ZATCA) / Saudi Standards, Metrology and Quality Organization (SASO)',
    legalBasis:
      'SALEEM Saudi Product Safety Program; SASO Technical Regulations; ZATCA Ministerial Resolution No. (1447-88-5)',
    classification: 'VERIFIED',
    verifiedDate: '2026-10-27',
  },
  {
    id: 'egypt-inbound',
    name: 'Egypt Inbound Trade',
    title: 'Egypt Inbound Trade',
    description:
      'Mandatory pre-shipment Advance Cargo Information (ACI) filing via MTS Nafeza single-window and CargoX blockchain document transfer for sea and air freight.',
    governingAuthority:
      'Egyptian Customs Authority / Ministry of Finance / Misr Technology Services (MTS Nafeza) / CargoX',
    legalBasis:
      'Egyptian Ministry of Finance Decree No. 38/2021 (Sea Freight) & Minister Media Statement (Air Freight mandatory 1 Jan 2026)',
    classification: 'VERIFIED',
    verifiedDate: '2026-10-27',
  },
  {
    id: 'uae-inbound',
    name: 'UAE Inbound & Compliance',
    title: 'UAE Inbound & Compliance',
    description:
      'Import clearance into mainland and free zones of the UAE, incorporating Dubai Customs 12-digit tariff roadmap and Federal Tax Authority PINT-AE e-invoicing compliance.',
    governingAuthority:
      'UAE Ministry of Finance (MoF) / Federal Tax Authority (FTA) / Dubai Customs',
    legalBasis:
      'Federal Decree-Law No. 16 & 17 of 2024; Cabinet Decision No. 106/2025; MD 243 & 244/2025; MR 66/2026; Dubai Customs Notice No. 02/2026',
    classification: 'VERIFIED',
    verifiedDate: '2026-10-27',
  },
  {
    id: 'eu-cbam',
    name: 'EU Export Corridor',
    title: 'EU Export Corridor',
    description:
      'Industrial goods exports (aluminium, steel, fertilisers, cement) from MENA producers to the European Union under the definitive Carbon Border Adjustment Mechanism.',
    governingAuthority:
      'European Commission Directorate-General for Taxation and Customs Union (DG TAXUD) / EU Member State Competent Authorities',
    legalBasis:
      'Regulation (EU) 2023/956 amended by Regulation (EU) 2025/2083; DG TAXUD Implementing Guidance No. 3 (August 2026)',
    classification: 'VERIFIED',
    verifiedDate: '2026-10-27',
  },
] as const;

// ============================================================================
// 4. Pre-Shipment Export Document Matrix (25 documents across 5 corridors)
// ============================================================================

export const EXPORT_DOCUMENTS: readonly ExportDocument[] = [
  // --------------------------------------------------------------------------
  // Corridor 1: Intra-GCC / UAE-KSA Regional Trade (intra-gcc)
  // --------------------------------------------------------------------------
  {
    id: 'intra-gcc-coo',
    corridorId: 'intra-gcc',
    name: 'GCC Unified Certificate of Origin',
    title: 'GCC Unified Certificate of Origin (شهادة المنشأ الخليجية الموحدة)',
    category: 'commercial',
    classification: 'VERIFIED',
    verifiedDate: '2026-10-27',
    governingAuthority: 'GCC Chambers of Commerce / UAE Ministry of Economy / GCC-CUA',
    legalBasis: 'Unified Economic Agreement between GCC States (Article 3) & Unified Rules of Origin',
    mandatory: true,
    criticalTiming: 'Issued pre-departure by accredited Chamber of Commerce; presented at border post for tariff exemption',
    nonComplianceRisk: 'Loss of 0% GCC customs exemption; imposition of external duty (5%–15%) and border transit holds',
    requiredDataFields: [
      'Origin criterion (minimum 40% local GCC value addition)',
      '12-digit Integrated GCC HS code',
      'Exporter Chamber of Commerce registration number',
      'Consignee commercial registration (CR / TRN)',
      'Invoice serial number and consignment value',
      'Authorized Chamber stamp and QR verification seal',
    ],
    notes: 'Required for preferential zero-duty customs treatment across all GCC member borders.',
  },
  {
    id: 'intra-gcc-invoice',
    corridorId: 'intra-gcc',
    name: 'Commercial Invoice with 12-Digit GCC HS Codes',
    title: 'Commercial Invoice with 12-Digit GCC HS Codes (الفاتورة التجارية برمز النظام المنسق)',
    category: 'commercial',
    classification: 'VERIFIED',
    verifiedDate: '2026-10-27',
    governingAuthority: 'GCC Customs Union Authority / ZATCA / Dubai Customs',
    legalBasis: 'GCC Unified 12-Digit Integrated Tariff Resolution (1 Jan 2026); ZATCA Res. 1447-88-5; Dubai Customs Notice 02/2026',
    mandatory: true,
    criticalTiming: 'Issued at time of cargo dispatch; electronically uploaded to customs declaration portal',
    nonComplianceRisk: 'Automated rejection of customs declaration, tariff reclassification fines, and cargo detention',
    requiredDataFields: [
      '12-digit GCC integrated tariff code per line item',
      'Harmonized item description in Arabic and English',
      'Unit price, quantity, and currency (AED / SAR / USD)',
      'Total transaction value and Incoterm 2020 delivery rule',
      'Supplier and Buyer Tax Registration Numbers (TRN)',
      'Country of manufacture per line item',
    ],
  },
  {
    id: 'intra-gcc-packing-list',
    corridorId: 'intra-gcc',
    name: 'Consignment Detailed Packing List',
    title: 'Consignment Detailed Packing List (قائمة التعبئة والتغليف التفصيلية)',
    category: 'commercial',
    classification: 'VERIFIED',
    verifiedDate: '2026-10-27',
    governingAuthority: 'GCC Customs Union Authority',
    legalBasis: 'GCC Unified Customs Procedures Manual (Customs Inspection & Verification Standards)',
    mandatory: true,
    criticalTiming: 'Finalized at container / truck loading; accompanying physical cargo manifest',
    nonComplianceRisk: 'Secondary physical inspection bay redirection, container de-stuffing fee, and clearance delays',
    requiredDataFields: [
      'Total package count and packaging type (pallets, cartons, crates)',
      'Gross weight (kg) and net weight (kg) per pallet / package',
      'Total volume in cubic meters (CBM)',
      'Container / trailer number and security seal identifiers',
      'Cross-reference to commercial invoice serial numbers',
    ],
  },
  {
    id: 'intra-gcc-bayan-declaration',
    corridorId: 'intra-gcc',
    name: 'Unified GCC Customs Statistical Declaration',
    title: 'Unified GCC Customs Statistical Declaration (البيان الجمركي الإحصائي الموحد)',
    category: 'customs',
    classification: 'VERIFIED',
    verifiedDate: '2026-10-27',
    governingAuthority: 'Dubai Customs / ZATCA / GCC Customs Union Authority',
    legalBasis: 'GCC Common Customs Law (Articles 14–22)',
    mandatory: true,
    criticalTiming: 'Pre-arrival electronic submission via national single window (Dubai Trade / FASAH)',
    nonComplianceRisk: 'Denial of border transit, administrative fines for undeclared consignments, demurrage accrual',
    requiredDataFields: [
      'Customs declaration transaction number',
      '12-digit Integrated Tariff Classification',
      'Customs valuation base (CIF / FOB)',
      'Designated land border post of entry/exit (e.g., Al Ghuwaifat / Batha)',
      'Carrier commercial transport license number',
    ],
  },
  {
    id: 'intra-gcc-cmr-consignment',
    corridorId: 'intra-gcc',
    name: 'Cross-Border Land Transport Consignment Note / Bayan Waybill',
    title: 'Cross-Border Land Transport Waybill (وثيقة النقل البري الموحدة / بيان النقل)',
    category: 'transport',
    classification: 'VERIFIED',
    verifiedDate: '2026-10-27',
    governingAuthority: 'Transport General Authority (TGA - KSA) / UAE Ministry of Energy & Infrastructure',
    legalBasis: 'Unified GCC Land Transport Regulations & Transit Agreement',
    mandatory: true,
    criticalTiming: 'Issued prior to road freight dispatch; validated at land border customs checkpoints',
    nonComplianceRisk: 'Truck turnaround at border crossing, carrier operating license suspension, and demurrage penalties',
    requiredDataFields: [
      'Vehicle tractor and trailer plate registration',
      'Driver passport / national ID and commercial driving permit',
      'Electronic waybill tracking number (TGA Bayan platform)',
      'Point of origin, transit route, and final delivery address',
      'Consignor and consignee verified contact details',
    ],
  },

  // --------------------------------------------------------------------------
  // Corridor 2: Saudi Arabia Inbound Trade (ksa-inbound)
  // --------------------------------------------------------------------------
  {
    id: 'ksa-saber-scoc',
    corridorId: 'ksa-inbound',
    name: 'SABER Shipment Certificate of Conformity (SCoC)',
    title: 'SABER Shipment Certificate of Conformity - SCoC (شهادة مطابقة الإرسالية عبر منصة سابر)',
    category: 'conformity',
    classification: 'VERIFIED',
    verifiedDate: '2026-10-27',
    governingAuthority: 'Saudi Standards, Metrology and Quality Organization (SASO) / ZATCA',
    legalBasis: 'SASO / ZATCA FASAH Integration Mandate & SALEEM Saudi Product Safety Program',
    mandatory: true,
    criticalTiming: 'Issued per consignment via SABER prior to shipment loading; synchronized electronically to FASAH gateway',
    nonComplianceRisk: 'Consignment cannot be cleared under any circumstance; mandatory shipment rejection and re-export at shipper expense',
    requiredDataFields: [
      'SABER SCoC electronic certificate number',
      'Linked commercial invoice number and issue date',
      'Product Certificate (PCoC) reference for regulated items or SDoC declaration number',
      'Itemized quantity matching invoice and packing list',
      'Manufacturer and importer commercial registration numbers',
    ],
    notes: 'Mandatory for 100% of commercial shipments entering Saudi Arabia, whether goods are regulated or non-regulated.',
  },
  {
    id: 'ksa-saber-pcoc',
    corridorId: 'ksa-inbound',
    name: 'SABER Product Certificate of Conformity (PCoC)',
    title: 'SABER Product Certificate of Conformity - PCoC (شهادة مطابقة المنتج سابر للمنتجات الخاضعة للوائح)',
    category: 'conformity',
    classification: 'VERIFIED',
    verifiedDate: '2026-10-27',
    governingAuthority: 'SASO / Accredited Conformity Assessment Bodies (CABs)',
    legalBasis: 'SASO Conformity System Regulations (SALEEM Program Technical Regulations)',
    mandatory: true,
    criticalTiming: 'Obtained prior to commercial export dispatch; certificate remains valid for 1 calendar year from issuance',
    nonComplianceRisk: 'Inability to issue mandatory SABER SCoC; immediate block on customs declaration creation in FASAH',
    requiredDataFields: [
      'Accredited CAB issuance identifier (e.g. TÜV, SGS, Intertek)',
      'ISO/IEC 17025 accredited laboratory test report reference',
      'Product trademark, model number, and technical specifications',
      'Applicable SASO Technical Regulation reference',
      'Factory audit report (for Type 3 / 5 high-risk product categories)',
    ],
    notes: 'Mandatory for all regulated products under SASO technical regulations. Non-regulated goods require electronic SDoC on SABER.',
  },
  {
    id: 'ksa-fasah-customs-declaration',
    corridorId: 'ksa-inbound',
    name: 'ZATCA FASAH 12-Digit Import Customs Declaration',
    title: 'ZATCA FASAH 12-Digit Import Declaration (بيان الاستيراد الجمركي عبر منصة فسح)',
    category: 'customs',
    classification: 'VERIFIED',
    verifiedDate: '2026-10-27',
    governingAuthority: 'Zakat, Tax and Customs Authority (ZATCA)',
    legalBasis: 'ZATCA Ministerial Resolution No. (1447-88-5) enforcing 12-digit integrated tariff since 1 Jan 2025',
    mandatory: true,
    criticalTiming: 'Pre-arrival electronic filing via FASAH portal at least 24 hours prior to port arrival',
    nonComplianceRisk: 'Customs clearance suspension, automated declaration rejection, tariff misclassification penalties',
    requiredDataFields: [
      '12-digit Saudi national tariff classification code',
      'Importer Saudi Commercial Registration (CR) and VAT TRN',
      'Verified SABER SCoC certificate number',
      'Declared customs value (CIF basis in SAR)',
      'Master Bill of Lading / Air Waybill manifest tracking reference',
    ],
  },
  {
    id: 'ksa-commercial-invoice',
    corridorId: 'ksa-inbound',
    name: 'Electronic Commercial Invoice with ZATCA Attestation',
    title: 'Electronic Commercial Invoice (الفاتورة التجارية المصدقة إلكترونياً)',
    category: 'commercial',
    classification: 'VERIFIED',
    verifiedDate: '2026-10-27',
    governingAuthority: 'ZATCA / Saudi Ministry of Commerce',
    legalBasis: 'ZATCA Customs Clearance Directives & Ministry of Commerce Regulations',
    mandatory: true,
    criticalTiming: 'Issued upon cargo packing; uploaded into FASAH portal',
    nonComplianceRisk: 'Rejection of customs value declaration, arbitrary customs valuation uplift, clearance audit delay',
    requiredDataFields: [
      'Sequential invoice serial number and date',
      'Detailed commercial description of goods with 12-digit HS code',
      'Unit price, line total, currency, and Incoterm 2020',
      'Seller name, tax address, and commercial registration',
      'Importer registered corporate name, CR, and VAT registration number',
      'Country of origin declaration per line item',
    ],
  },
  {
    id: 'ksa-bill-of-lading',
    corridorId: 'ksa-inbound',
    name: 'Ocean Bill of Lading / Air Waybill',
    title: 'Ocean Bill of Lading / Air Waybill (بوليصة الشحن البحري / الجوي)',
    category: 'transport',
    classification: 'VERIFIED',
    verifiedDate: '2026-10-27',
    governingAuthority: 'ZATCA / Saudi Ports Authority (MAWANI) / GACA',
    legalBasis: 'Saudi Commercial Maritime Law & General Authority of Civil Aviation Directives',
    mandatory: true,
    criticalTiming: 'Lodged electronically into FASAH by carrier manifest agent at least 48 hours (sea) or 2 hours (air) prior to arrival',
    nonComplianceRisk: 'Manifest mismatch, inability to issue delivery order, terminal demurrage and storage penalties',
    requiredDataFields: [
      'Master and House Bill of Lading / Air Waybill numbers',
      'Container numbers and customs tamper-evident seal numbers',
      'Port of loading and designated Saudi port of discharge (Jeddah, Dammam, Riyadh Dry Port)',
      'Consignee entity details strictly matching FASAH importer record',
      'Cargo gross weight, net weight, and piece count',
    ],
  },

  // --------------------------------------------------------------------------
  // Corridor 3: Egypt Inbound Trade (egypt-inbound)
  // --------------------------------------------------------------------------
  {
    id: 'egypt-acid-cargo-x',
    corridorId: 'egypt-inbound',
    name: 'Nafeza Advance Cargo Information Declaration (ACID Number)',
    title: 'Nafeza Advance Cargo Information - ACID (الرقم التعريفي المسبق للشحنة نافذة)',
    category: 'customs',
    classification: 'UNVERIFIED',
    verifiedDate: '2026-10-27',
    governingAuthority: 'Ministry of Finance / Egyptian Customs Authority / MTS Nafeza / CargoX',
    legalBasis: 'Egyptian Ministry of Finance Decree No. 38/2021 (Sea) & Minister Media Statement (Air mandatory 1 Jan 2026)',
    mandatory: true,
    criticalTiming: 'Requested by importer on Nafeza before dispatch; exporter uploads envelope to CargoX >= 48h before vessel sailing or >= 4h before aircraft departure',
    nonComplianceRisk: 'Carrier is legally prohibited from loading cargo; unverified cargo arriving at Egyptian ports is returned immediately at carrier/shipper expense',
    requiredDataFields: [
      '19-digit provisional ACID identification number',
      'Egyptian importer 9-digit tax card registration number',
      'Foreign exporter verified CargoX account ID',
      '10-digit Egyptian integrated HS tariff code',
      'Invoice total value and currency',
      'GS1 item barcode or manufacturer part numbers',
    ],
    disclaimer: EGYPT_ACID_DISCLAIMER,
    notes: 'Air freight enforcement became strictly mandatory on 1 January 2026. Ocean freight enforced since 1 October 2021.',
  },
  {
    id: 'egypt-cargox-verified-account',
    corridorId: 'egypt-inbound',
    name: 'CargoX Verified Exporter Blockchain Account',
    title: 'CargoX Verified Exporter Blockchain Account (حساب المصدر المعتمد على منصة كارجو إكس)',
    category: 'customs',
    classification: 'VERIFIED',
    verifiedDate: '2026-10-27',
    governingAuthority: 'Misr Technology Services (MTS Nafeza) / CargoX Platform',
    legalBasis: 'Egyptian Customs Authority ACI Operational Regulations & Decree No. 38/2021',
    mandatory: true,
    criticalTiming: 'Completed prior to initiating export orders; third-party verification takes 3–5 business days',
    nonComplianceRisk: 'Foreign exporter unable to create digital envelope or transfer title/shipping documents to Egyptian Customs',
    requiredDataFields: [
      'CargoX blockchain wallet identity address',
      'Corporate trade license / commercial registry verification',
      'Signatory identity validation credentials',
      'Company Legal Entity Identifier (LEI) or Dun & Bradstreet DUNS number',
    ],
  },
  {
    id: 'egypt-commercial-invoice-acid',
    corridorId: 'egypt-inbound',
    name: 'Commercial Invoice with Embedded ACID Number',
    title: 'Commercial Invoice with Embedded ACID Number (الفاتورة التجارية المتضمنة رقم نافذة)',
    category: 'commercial',
    classification: 'VERIFIED',
    verifiedDate: '2026-10-27',
    governingAuthority: 'Egyptian Customs Authority',
    legalBasis: 'Egyptian Customs Law No. 207/2020 & Decree No. 38/2021',
    mandatory: true,
    criticalTiming: 'Uploaded to CargoX envelope prior to departure manifest generation',
    nonComplianceRisk: 'Rejection of electronic document envelope by Nafeza; discrepancies trigger customs audit holds',
    requiredDataFields: [
      '19-digit ACID number printed prominently in invoice body',
      'Egyptian importer tax identification number (9 digits)',
      'Foreign supplier CargoX registration identifier',
      'Detailed item breakdown with unit values and 10-digit HS codes',
      'Agreed Incoterm 2020 and payment terms',
    ],
  },
  {
    id: 'egypt-bill-of-lading-acid',
    corridorId: 'egypt-inbound',
    name: 'Transport Document with ACID and Importer Tax ID',
    title: 'Bill of Lading / Air Waybill with Embedded ACID (بوليصة الشحن المتضمنة بيانات التسجيل)',
    category: 'transport',
    classification: 'VERIFIED',
    verifiedDate: '2026-10-27',
    governingAuthority: 'Egyptian Customs Authority / Ministry of Transport',
    legalBasis: 'Decree No. 38/2021 & CargoX Air/Sea Freight Carrier Mandate',
    mandatory: true,
    criticalTiming: 'Issued by ocean carrier or airline; ACID embedded in goods description field; filed in manifest >=4h (air) or >=48h (sea)',
    nonComplianceRisk: 'Carrier fines, discharge denial at Alexandria / Port Said / Cairo Airport, mandatory cargo return',
    requiredDataFields: [
      'ACID number printed in cargo description field',
      'Egyptian Importer Tax Registration Number',
      'Foreign Exporter Registration Code',
      'Container / seal numbers (sea) or ULD numbers (air)',
      'Gross weight and vessel / flight voyage number',
    ],
  },
  {
    id: 'egypt-certificate-of-origin',
    corridorId: 'egypt-inbound',
    name: 'Legalized Certificate of Origin',
    title: 'Legalized Certificate of Origin (شهادة المنشأ المعتمدة رسمياً)',
    category: 'commercial',
    classification: 'VERIFIED',
    verifiedDate: '2026-10-27',
    governingAuthority: 'Chamber of Commerce / Egyptian Customs Authority',
    legalBasis: 'Egyptian Customs Law No. 207/2020 Executive Regulations',
    mandatory: true,
    criticalTiming: 'Certified by Chamber of Commerce and uploaded electronically to CargoX',
    nonComplianceRisk: 'Disqualification of preferential customs tariffs under regional trade treaties (e.g. GAFTA); duty surcharge',
    requiredDataFields: [
      'Country of manufacture and origin criterion',
      'Certified Chamber of Commerce seal and signature',
      'Exporter and consignee company names and addresses',
      'Associated invoice serial number and date',
    ],
  },

  // --------------------------------------------------------------------------
  // Corridor 4: UAE Inbound & Compliance (uae-inbound)
  // --------------------------------------------------------------------------
  {
    id: 'uae-e-invoice-pint-ae',
    corridorId: 'uae-inbound',
    name: 'UAE Peppol 5-Corner E-Invoice (PINT-AE)',
    title: 'UAE Peppol 5-Corner E-Invoice - PINT-AE (الفاتورة الإلكترونية المعتمدة بنظام بينت)',
    category: 'commercial',
    classification: 'VERIFIED',
    verifiedDate: '2026-10-27',
    governingAuthority: 'UAE Ministry of Finance (MoF) / Federal Tax Authority (FTA)',
    legalBasis: 'Federal Decree-Law No. 16/2024; Cabinet Decision No. 106/2025; MD 243 & 244/2025; MR 66/2026',
    mandatory: true,
    criticalTiming: 'ASP contracted by 30 Oct 2026 (Phase 1) or 31 Mar 2027 (Phase 2); Real-time transaction validation at invoice issuance',
    nonComplianceRisk: 'FTA administrative fines up to AED 50,000 under Cabinet Decision No. 106/2025; loss of VAT input deduction rights',
    requiredDataFields: [
      'PINT-AE UBL XML schema compliance',
      'Supplier UAE TRN and Peppol Endpoint ID',
      'Buyer UAE TRN and Peppol Endpoint ID',
      'Cryptographic hash and Accredited Service Provider (ASP) transmission token',
      'FTA Corner 5 tax authority reporting payload',
      'Standardized tax classification codes (Standard, Zero, Exempt, Out of Scope)',
    ],
    notes: 'Phase 1 (Revenue >= AED 50M) mandatory 1 Jan 2027; Phase 2 (SMEs) mandatory 1 July 2027.',
  },
  {
    id: 'uae-dubai-customs-declaration',
    corridorId: 'uae-inbound',
    name: 'Dubai Customs 12-Digit Import Declaration',
    title: 'Dubai Customs 12-Digit Import Declaration (بيان الاستيراد بجمارك دبي بالرمز المكون من 12 رقماً)',
    category: 'customs',
    classification: 'VERIFIED',
    verifiedDate: '2026-10-27',
    governingAuthority: 'Dubai Customs / Federal Authority for Identity, Citizenship, Customs and Port Security (ICP)',
    legalBasis: 'Dubai Customs Notice No. 02/2026 (12-Digit Integrated Tariff Phased Roadmap)',
    mandatory: true,
    criticalTiming: 'Submitted pre-arrival or on arrival via Mirsal 2 / Dubai Trade gateway',
    nonComplianceRisk: 'Declaration clearance suspension, automated validation failure, port demurrage fees',
    requiredDataFields: [
      '12-digit Integrated Tariff Code',
      'Importer Customs Business Code',
      'Ocean / Air Bill of Lading reference',
      'Invoice valuation declared in AED (CIF basis)',
      'Country of origin code per line item',
    ],
    notes: 'Phase 2 (Feb 2026) applied to Free Zones to mainland; Phase 3 (Aug 2026 - Jan 2027) expands to all mainland RoW imports.',
  },
  {
    id: 'uae-delivery-order',
    corridorId: 'uae-inbound',
    name: 'Electronic Delivery Order (E-DO)',
    title: 'Electronic Delivery Order - E-DO (إذن التسليم الإلكتروني عبر بوابة دبي التجارية)',
    category: 'transport',
    classification: 'VERIFIED',
    verifiedDate: '2026-10-27',
    governingAuthority: 'Dubai Customs / Dubai Trade / DP World',
    legalBasis: 'Dubai Ports Authority and Customs Clearance Regulations',
    mandatory: true,
    criticalTiming: 'Requested from shipping line / airline upon carrier arrival; required prior to container gate exit',
    nonComplianceRisk: 'Physical container block at Jebel Ali / airport gates, cumulative daily detention charges',
    requiredDataFields: [
      'Delivery Order serial number',
      'Consignee entity name matching customs code',
      'Vessel name, voyage number, and call sign',
      'Container numbers, size/type, and seal numbers',
      'Container release validity cutoff date',
    ],
  },
  {
    id: 'uae-commercial-invoice',
    corridorId: 'uae-inbound',
    name: 'Supplier Commercial Invoice with Customs Value Attestation',
    title: 'Supplier Commercial Invoice (الفاتورة التجارية المعتمدة للاستيراد)',
    category: 'commercial',
    classification: 'VERIFIED',
    verifiedDate: '2026-10-27',
    governingAuthority: 'Dubai Customs / UAE Ministry of Finance',
    legalBasis: 'UAE Common Customs Law & Cabinet Decision on Customs Valuation Standards',
    mandatory: true,
    criticalTiming: 'Attached to Mirsal 2 customs import declaration',
    nonComplianceRisk: 'Customs valuation uplift, requirement for refundable cash guarantee, clearance delays',
    requiredDataFields: [
      'Invoice serial number and issue date',
      'Supplier name, commercial address, and contact details',
      'Buyer name, address, and UAE TRN',
      'Itemized goods description with 12-digit HS classification',
      'Currency, unit price, and Incoterms 2020 delivery rule',
    ],
  },
  {
    id: 'uae-packing-list',
    corridorId: 'uae-inbound',
    name: 'Consignment Detailed Packing List',
    title: 'Consignment Detailed Packing List (قائمة التعبئة الجمركية التفصيلية)',
    category: 'commercial',
    classification: 'VERIFIED',
    verifiedDate: '2026-10-27',
    governingAuthority: 'Dubai Customs',
    legalBasis: 'UAE Common Customs Law (Inspection & Examination Directives)',
    mandatory: true,
    criticalTiming: 'Lodged concurrently with commercial invoice in Mirsal 2',
    nonComplianceRisk: 'Redirection to physical examination inspection bay, manual inspection charges',
    requiredDataFields: [
      'Total package count and packaging description',
      'Gross weight and net weight in kilograms',
      'Consignment cubic measurement (CBM)',
      'Marks, container numbers, and seal identifiers',
    ],
  },

  // --------------------------------------------------------------------------
  // Corridor 5: EU Export Corridor (eu-cbam)
  // --------------------------------------------------------------------------
  {
    id: 'eu-cbam-emissions-report',
    corridorId: 'eu-cbam',
    name: 'CBAM Installation-Level Embedded Emissions Communication Sheet',
    title: 'CBAM Installation-Level Embedded Emissions Report (تقرير الانبعاثات الكربونية المضمنة للمنشأة)',
    category: 'sustainability',
    classification: 'VERIFIED',
    verifiedDate: '2026-10-27',
    governingAuthority: 'European Commission DG TAXUD / EU Member State Competent Authorities',
    legalBasis: 'Regulation (EU) 2023/956 Articles 6, 7 & 8; Regulation (EU) 2025/2083; DG TAXUD Guidance No. 3',
    mandatory: true,
    criticalTiming: 'Completed pre-shipment; definitive regime in force since 1 Jan 2026; transmitted to EU Authorised CBAM Declarant',
    nonComplianceRisk: 'EU border customs clearance denial, punitive default emissions markup applied, penalties up to €100/tonne CO2 on EU importer, loss of European buyer accounts',
    requiredDataFields: [
      'Production installation UN/LOCODE and geographical coordinates',
      'Direct specific embedded emissions (tCO2e / metric tonne of product)',
      'Indirect emissions from electricity consumption (MWh / tonne & grid/PPA emissions factor)',
      'Precursor material embedded emissions breakdown',
      'Effective carbon price paid in country of origin (if any, in SAR / AED / USD)',
    ],
    notes: 'Mandatory for covered goods (Aluminium, Iron & Steel, Fertilisers, Cement) exceeding the 50-tonne annual threshold.',
  },
  {
    id: 'eu-cbam-verifier-declaration',
    corridorId: 'eu-cbam',
    name: 'Accredited Independent Verification Body Declaration',
    title: 'Accredited Verification Body Statement (بيان جهة التحقق المستقلة المعتمدة لانبعاثات الكربون)',
    category: 'sustainability',
    classification: 'VERIFIED',
    verifiedDate: '2026-10-27',
    governingAuthority: 'DG TAXUD / National Accreditation Bodies (under ISO 14065 & EU ETS standards)',
    legalBasis: 'Regulation (EU) 2023/956 Article 8 & Implementing Regulation (EU) 2025/2083',
    mandatory: true,
    criticalTiming: 'Audited annually or per production cycle; verification statement accompanying CBAM communications dossier',
    nonComplianceRisk: 'Disqualification of actual plant emissions data; mandatory fallback to punitive EU default benchmarks with penalty surcharge',
    requiredDataFields: [
      'Accredited verification body corporate legal name and accreditation certificate number',
      'Lead verifier credentials and ISO 14065 accreditation scope',
      'Site audit date and methodology verification protocol',
      'Formal verification opinion (unmodified, modified, or adverse)',
      'Materiality threshold confirmation (under 5% deviation)',
    ],
  },
  {
    id: 'eu-customs-declaration-ens',
    corridorId: 'eu-cbam',
    name: 'EU Entry Summary Declaration (ENS / ICS2)',
    title: 'EU Entry Summary Declaration - ENS / ICS2 (بيان الدخول الجمركي المسبق للاتحاد الأوروبي)',
    category: 'customs',
    classification: 'VERIFIED',
    verifiedDate: '2026-10-27',
    governingAuthority: 'EU Member State Customs Administrations / DG TAXUD',
    legalBasis: 'Union Customs Code (UCC) - Regulation (EU) No 952/2013 & ICS2 Directives',
    mandatory: true,
    criticalTiming: 'Advance security filing lodged via ICS2 prior to vessel loading or 4 hours prior to aircraft arrival',
    nonComplianceRisk: '"Do Not Load" (DNL) instruction issued by EU customs, container impoundment at EU port of entry',
    requiredDataFields: [
      '8-digit Combined Nomenclature (CN) or 10-digit TARIC code',
      'EU Importer Economic Operators Registration and Identification (EORI) number',
      'Authorised CBAM Declarant registration ID',
      'Invoice valuation declared in EUR',
      'Detailed transport itinerary and conveyance identification',
    ],
  },
  {
    id: 'eu-commercial-invoice',
    corridorId: 'eu-cbam',
    name: 'Export Commercial Invoice with EU CN / TARIC Codes',
    title: 'Export Commercial Invoice (الفاتورة التجارية التصديرية بترميز التعريفة الأوروبية)',
    category: 'commercial',
    classification: 'VERIFIED',
    verifiedDate: '2026-10-27',
    governingAuthority: 'EU Customs Authorities',
    legalBasis: 'Union Customs Code (UCC) - Regulation (EU) No 952/2013',
    mandatory: true,
    criticalTiming: 'Issued upon cargo dispatch; included in EU customs clearance dossier',
    nonComplianceRisk: 'Customs audit, valuation adjustment, tariff misclassification fines',
    requiredDataFields: [
      'Accurate 8-digit EU CN code (e.g. 7601 unwrought aluminium, 7208 flat-rolled steel, 3102 mineral fertilisers)',
      'Net mass in metric tonnes (critical for CBAM de minimis evaluation)',
      'Itemized unit price, total value, and agreed Incoterm 2020',
      'Exporter and importer corporate legal names, addresses, and EORI / VAT numbers',
    ],
  },
  {
    id: 'eu-eur1-movement-cert',
    corridorId: 'eu-cbam',
    name: 'EUR.1 Preferential Movement Certificate / Origin Declaration',
    title: 'Preferential Movement Certificate EUR.1 (شهادة حركة البضائع التفضيلية أو إقرار المنشأ)',
    category: 'commercial',
    classification: 'VERIFIED',
    verifiedDate: '2026-10-27',
    governingAuthority: 'Ministry of Economy / Customs Administration of exporting country',
    legalBasis: 'Relevant EU Bilateral Free Trade / Association Agreements',
    mandatory: false,
    criticalTiming: 'Endorsed prior to export dispatch; submitted at EU customs clearance',
    nonComplianceRisk: 'Forfeiture of preferential reduced or 0% customs duty; payment of full third-country MFN tariffs',
    requiredDataFields: [
      'Origin criterion conforming to bilateral protocol',
      'Customs authority endorsement stamp and signature',
      'Commercial invoice cross-reference number',
      'Consignor and consignee verified designations',
    ],
    notes: 'Mandatory only when claiming preferential customs duty treatment under eligible trade agreements.',
  },
] as const;

// ============================================================================
// 5. Pure Calculation & Retrieval Engine Functions
// ============================================================================

/**
 * Returns the complete list of supported trade corridors.
 */
export function getAllCorridors(): TradeCorridor[] {
  return [...CORRIDORS];
}

/**
 * Retrieves a single trade corridor by its unique ID.
 */
export function getCorridorById(id: CorridorId): TradeCorridor | undefined {
  return CORRIDORS.find((corridor) => corridor.id === id);
}

/**
 * Returns all export documents across all corridors.
 */
export function getAllDocuments(): ExportDocument[] {
  return [...EXPORT_DOCUMENTS];
}

/**
 * Returns all documents associated with a specific corridor.
 */
export function getDocumentsByCorridor(corridorId: CorridorId): ExportDocument[] {
  return EXPORT_DOCUMENTS.filter((doc) => doc.corridorId === corridorId);
}

/**
 * Returns mandatory documents, optionally filtered by corridor.
 */
export function getMandatoryDocuments(corridorId?: CorridorId): ExportDocument[] {
  if (corridorId) {
    return EXPORT_DOCUMENTS.filter((doc) => doc.corridorId === corridorId && doc.mandatory);
  }
  return EXPORT_DOCUMENTS.filter((doc) => doc.mandatory);
}

/**
 * Filters the document matrix by corridor ID, category, and/or mandatory status.
 */
export function filterDocuments(filters?: DocumentFilters): ExportDocument[] {
  if (!filters) {
    return getAllDocuments();
  }

  return EXPORT_DOCUMENTS.filter((doc) => {
    if (filters.corridorId && doc.corridorId !== filters.corridorId) {
      return false;
    }
    if (filters.category && doc.category !== filters.category) {
      return false;
    }
    if (filters.mandatoryOnly && !doc.mandatory) {
      return false;
    }
    return true;
  });
}

/**
 * Computes high-level checklist metrics across corridors, categories, and verification status.
 */
export function calculateChecklistStats(): ChecklistStats {
  const documents = getAllDocuments();
  const corridors = getAllCorridors();

  const byCorridor: Record<CorridorId, CorridorStats> = {
    'intra-gcc': { total: 0, mandatory: 0, optional: 0 },
    'ksa-inbound': { total: 0, mandatory: 0, optional: 0 },
    'egypt-inbound': { total: 0, mandatory: 0, optional: 0 },
    'uae-inbound': { total: 0, mandatory: 0, optional: 0 },
    'eu-cbam': { total: 0, mandatory: 0, optional: 0 },
  };

  const byCategory: Record<DocumentCategory, number> = {
    customs: 0,
    conformity: 0,
    commercial: 0,
    transport: 0,
    sustainability: 0,
  };

  const byClassification: Record<RegulatoryClassification, number> = {
    VERIFIED: 0,
    UNVERIFIED: 0,
    ASSUMPTION: 0,
  };

  let mandatoryCount = 0;
  let optionalCount = 0;

  for (const doc of documents) {
    if (doc.mandatory) {
      mandatoryCount++;
      byCorridor[doc.corridorId].mandatory++;
    } else {
      optionalCount++;
      byCorridor[doc.corridorId].optional++;
    }
    byCorridor[doc.corridorId].total++;

    if (byCategory[doc.category] !== undefined) {
      byCategory[doc.category]++;
    }

    if (byClassification[doc.classification] !== undefined) {
      byClassification[doc.classification]++;
    }
  }

  return {
    totalDocuments: documents.length,
    mandatoryDocuments: mandatoryCount,
    optionalDocuments: optionalCount,
    corridorsCount: corridors.length,
    byCorridor,
    byCategory,
    byClassification,
    verifiedDate: '2026-10-27',
  };
}

/**
 * Validates the provisional 19-digit numerical format for Egypt ACID numbers.
 * Always flags specification as unverified per Card FACTS-0.
 */
export function validateAcidSyntax(acidNumber: string): AcidValidationResult {
  const trimmed = typeof acidNumber === 'string' ? acidNumber.trim() : '';
  const isValidFormat = /^\d{19}$/.test(trimmed);

  return {
    isValidFormat,
    isVerifiedSpec: false,
    disclaimer: EGYPT_ACID_DISCLAIMER,
    message: isValidFormat
      ? 'Number matches provisional 19-digit numerical format. Note: specification remains unverified pending Egyptian forwarder / MTS technical confirmation.'
      : `Invalid ACID format: expected exactly 19 numerical digits (found: ${trimmed.length} characters).`,
  };
}

/**
 * Evaluates exporter consignments against the EU CBAM 50-tonne mass de minimis exemption rule.
 * Grounded in Regulation (EU) 2023/956 & DG TAXUD Guidance No. 3 (Card FACTS-0 Section 4.5).
 */
export function checkCbamThreshold(netMassTonnes: number): CbamThresholdResult {
  const safeMass = Number.isFinite(netMassTonnes) ? Math.max(0, netMassTonnes) : 0;
  const isExempt = safeMass <= CBAM_DE_MINIMIS_MASS_TONNES;
  const requiresReporting = !isExempt;

  return {
    netMassTonnes: safeMass,
    thresholdTonnes: CBAM_DE_MINIMIS_MASS_TONNES,
    isExempt,
    requiresReporting,
    classification: 'VERIFIED',
    verifiedDate: '2026-10-27',
    legalBasis:
      'Regulation (EU) 2023/956, amended by Regulation (EU) 2025/2083; DG TAXUD Implementing Guidance No. 3 (Card FACTS-0 Section 4.5)',
    message: isExempt
      ? `Net mass (${safeMass.toFixed(2)}t) is within the de minimis threshold (<= ${CBAM_DE_MINIMIS_MASS_TONNES}t/year). Consignment is exempt from CBAM certificate surrender and embedded emissions verification.`
      : `Net mass (${safeMass.toFixed(2)}t) exceeds the de minimis threshold (> ${CBAM_DE_MINIMIS_MASS_TONNES}t/year). Full installation-level verified embedded emissions reporting and Authorised CBAM Declarant filing are mandatory.`,
  };
}
