/**
 * Harmonized System (HS) Tariff Engine & 8-to-12 Digit Converter
 *
 * Grounded in RES-03 research:
 * - Dubai Customs Notice No. 10/2025 & Cabinet Resolution No. (119) of 2024 (UAE 12-digit)
 * - ZATCA Ministerial Resolution No. (1447-88-5) & Decision No. (1447-88-7) (Saudi 12-digit)
 * - GCC Unified Customs Tariff (Common External Tariff, 8-digit)
 *
 * 100% Pure TypeScript: zero React imports, zero DOM globals,
 * zero network calls, zero side effects. Deterministic pure functions only.
 */

// ---------------------------------------------------------------------------
// 1. Types & Interfaces
// ---------------------------------------------------------------------------

export type Jurisdiction = 'AE' | 'SA' | 'GCC';
export type DutyType = 'ad_valorem' | 'exempt' | 'specific' | 'prohibited';

export interface NationalSubdivision {
  code12: string;
  formattedCode: string;
  jurisdiction: 'AE' | 'SA';
  descriptionEn: string;
  descriptionAr: string;
  dutyRate: number;
  dutyType: 'ad_valorem' | 'exempt' | 'specific';
  vatRate: number;
  controllingAuthority?: string;
}

export interface TariffEntry {
  hsCode: string;          // 6, 8, or 12 digits (normalized numeric string without dots)
  formattedCode: string;   // e.g. "3901.10.10.0000" or "8471.30.00"
  jurisdiction: 'AE' | 'SA' | 'GCC';
  digits: 6 | 8 | 12;
  descriptionEn: string;
  descriptionAr: string;
  dutyRate: number;        // e.g. 0.05 for standard 5%, 0 for exempt
  dutyType: DutyType;
  vatRate: number;         // 0.05 for UAE, 0.15 for KSA
  exciseRate?: number;     // e.g. 0.50 or 1.00 if applicable
  restricted: boolean;
  controllingAuthority?: string; // e.g. 'MoIAT', 'ESMA', 'SFDA', 'ZATCA', 'TDRA'
  effectiveDate: string;   // ISO date, e.g. '2025-08-01' or '2025-01-01'
  sourceCitation: string;  // Statutory notice citation
  notes?: string;
  nationalSubdivisions?: NationalSubdivision[];
}

export interface DutyCalculationParams {
  cifValue: number;
  currency?: string;
  dutyRate: number;
  vatRate: number;
  exciseRate?: number;
}

export interface DutyCalculationResult {
  cifValue: number;
  currency: string;
  dutyRate: number;
  dutyAmount: number;
  exciseRate: number;
  exciseAmount: number;
  vatBase: number;
  vatRate: number;
  vatAmount: number;
  totalDutiesAndTaxes: number;
  totalLandedCost: number;
  effectiveTotalRatePercent: number;
}

export interface HsToolState {
  query?: string;
  jurisdiction?: Jurisdiction;
  cifValue?: number;
  selectedCode?: string;
}

// ---------------------------------------------------------------------------
// 2. Dataset Metadata
// ---------------------------------------------------------------------------

export const TARIFF_DATASET_META = {
  version: '2026.1',
  updatedAt: '2026-10-28',
  sources: [
    {
      name: 'UAE Integrated Customs Tariff (12-Digit)',
      authority: 'Federal Authority for Identity, Citizenship, Customs and Port Security & Dubai Customs',
      legalBasis: 'Customs Notice No. 10/2025 & Cabinet Resolution No. (119) of 2024',
      effectiveDate: '2025-08-01',
    },
    {
      name: 'Saudi Arabia Integrated Customs Tariff (12-Digit)',
      authority: 'Zakat, Tax and Customs Authority (ZATCA)',
      legalBasis: 'Ministerial Resolution No. (1447-88-5) & Decision No. (1447-88-7)',
      effectiveDate: '2025-01-01',
    },
  ],
  disclaimerEn: 'Informational estimate only. HS classification and statutory duty liabilities must be verified with a licensed customs broker or designated authority prior to declaration filing.',
  disclaimerAr: 'تقدير استرشادي فقط. يجب التحقق من البند الجمركي والرسوم المقررة لدى مخلص جمركي مرخص أو الهيئة المختصة قبل تقديم الإقرار.',
};

// ---------------------------------------------------------------------------
// 3. Static Curated Tariff Dataset (Key GCC Trade Chapters)
// ---------------------------------------------------------------------------

export const TARIFF_DATASET: TariffEntry[] = [
  // -------------------------------------------------------------------------
  // Chapter 09: Spices
  // -------------------------------------------------------------------------
  {
    hsCode: '09041100',
    formattedCode: '0904.11.00',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Pepper of the genus Piper; neither crushed nor ground',
    descriptionAr: 'فلفل من جنس بايبر؛ غير مجروش وغير مطحون',
    dutyRate: 0.05,
    dutyType: 'ad_valorem',
    vatRate: 0.05,
    restricted: false,
    controllingAuthority: 'MoIAT / SFDA',
    effectiveDate: '2025-01-01',
    sourceCitation: 'GCC Unified Customs Tariff 2022 & Dubai Customs Notice 10/2025',
    notes: 'Phytosanitary certificate and food safety inspection required at port of entry.',
    nationalSubdivisions: [
      {
        code12: '090411000000',
        formattedCode: '0904.11.00.0000',
        jurisdiction: 'AE',
        descriptionEn: 'Black pepper of the genus Piper, neither crushed nor ground, in retail packaging or bulk',
        descriptionAr: 'فلفل أسود من جنس بايبر، غير مجروش وغير مطحون، في عبوات تجزئة أو سائب',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.05,
        controllingAuthority: 'Dubai Municipality / MoIAT',
      },
      {
        code12: '090411000001',
        formattedCode: '0904.11.00.0001',
        jurisdiction: 'SA',
        descriptionEn: 'Black pepper of the genus Piper, whole berries, neither crushed nor ground',
        descriptionAr: 'فلفل أسود من جنس بايبر، حبوب كاملة، غير مجروش وغير مطحون',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.15,
        controllingAuthority: 'SFDA / ZATCA',
      },
    ],
  },
  {
    hsCode: '09061100',
    formattedCode: '0906.11.00',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Cinnamon (Cinnamomum zeylanicum Blume), neither crushed nor ground',
    descriptionAr: 'قرفة (سيناموموم زيلانيكوم بلوم)، غير مجروشة وغير مطحونة',
    dutyRate: 0.05,
    dutyType: 'ad_valorem',
    vatRate: 0.05,
    restricted: false,
    controllingAuthority: 'MoIAT / SFDA',
    effectiveDate: '2025-01-01',
    sourceCitation: 'GCC Unified Customs Tariff 2022 & Dubai Customs Notice 10/2025',
    nationalSubdivisions: [
      {
        code12: '090611000000',
        formattedCode: '0906.11.00.0000',
        jurisdiction: 'AE',
        descriptionEn: 'Ceylon cinnamon quills and bark, whole',
        descriptionAr: 'قرفة سيلانية عيدان ولحاء، كاملة',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.05,
        controllingAuthority: 'MoIAT',
      },
      {
        code12: '090611000001',
        formattedCode: '0906.11.00.0001',
        jurisdiction: 'SA',
        descriptionEn: 'Cinnamon sticks, whole, conforming to SFDA standards',
        descriptionAr: 'عيدان قرفة، كاملة، مطابقة لمعايير هيئة الغذاء والدواء',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.15,
        controllingAuthority: 'SFDA',
      },
    ],
  },
  {
    hsCode: '09071000',
    formattedCode: '0907.10.00',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Cloves (whole fruit, cloves and stems), neither crushed nor ground',
    descriptionAr: 'قرنفل (ثمار كاملة ومسامير وعيدان)، غير مجروش وغير مطحون',
    dutyRate: 0.05,
    dutyType: 'ad_valorem',
    vatRate: 0.05,
    restricted: false,
    controllingAuthority: 'MoIAT / SFDA',
    effectiveDate: '2025-01-01',
    sourceCitation: 'GCC Unified Customs Tariff 2022',
    nationalSubdivisions: [
      {
        code12: '090710000000',
        formattedCode: '0907.10.00.0000',
        jurisdiction: 'AE',
        descriptionEn: 'Cloves, whole cloves and stems, for culinary or pharmaceutical preparation',
        descriptionAr: 'قرنفل، مسامير كاملة وعيدان، للاستعمال الغذائي أو الصيدلاني',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.05,
        controllingAuthority: 'MoIAT',
      },
      {
        code12: '090710000001',
        formattedCode: '0907.10.00.0001',
        jurisdiction: 'SA',
        descriptionEn: 'Whole cloves and stems, dried',
        descriptionAr: 'قرنفل كامل وعيدان مجففة',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.15,
        controllingAuthority: 'SFDA',
      },
    ],
  },
  {
    hsCode: '09083100',
    formattedCode: '0908.31.00',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Cardamoms, neither crushed nor ground',
    descriptionAr: 'هيل (حب الهان)، غير مجروش وغير مطحون',
    dutyRate: 0.05,
    dutyType: 'ad_valorem',
    vatRate: 0.05,
    restricted: false,
    controllingAuthority: 'MoIAT / SFDA',
    effectiveDate: '2025-01-01',
    sourceCitation: 'GCC Unified Customs Tariff 2022',
    nationalSubdivisions: [
      {
        code12: '090831000000',
        formattedCode: '0908.31.00.0000',
        jurisdiction: 'AE',
        descriptionEn: 'Green cardamom pods, whole, grade extra fancy or standard',
        descriptionAr: 'حبوب هيل أخضر، كاملة، درجة ممتازة أو قياسية',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.05,
        controllingAuthority: 'MoIAT',
      },
      {
        code12: '090831000001',
        formattedCode: '0908.31.00.0001',
        jurisdiction: 'SA',
        descriptionEn: 'Green and black cardamoms, whole pods, neither crushed nor ground',
        descriptionAr: 'هيل أخضر وأسود، قرون كاملة، غير مجروش وغير مطحون',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.15,
        controllingAuthority: 'SFDA',
      },
    ],
  },
  {
    hsCode: '09101100',
    formattedCode: '0910.11.00',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Ginger, neither crushed nor ground',
    descriptionAr: 'زنجبيل، غير مجروش وغير مطحون',
    dutyRate: 0.05,
    dutyType: 'ad_valorem',
    vatRate: 0.05,
    restricted: false,
    controllingAuthority: 'MoIAT / SFDA',
    effectiveDate: '2025-01-01',
    sourceCitation: 'GCC Unified Customs Tariff 2022',
    nationalSubdivisions: [
      {
        code12: '091011000000',
        formattedCode: '0910.11.00.0000',
        jurisdiction: 'AE',
        descriptionEn: 'Fresh or dried ginger rhizomes, neither crushed nor ground',
        descriptionAr: 'جذامير زنجبيل طازجة أو مجففة، غير مجروشة وغير مطحونة',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.05,
        controllingAuthority: 'MoIAT',
      },
      {
        code12: '091011000001',
        formattedCode: '0910.11.00.0001',
        jurisdiction: 'SA',
        descriptionEn: 'Ginger roots, dried or unbleached',
        descriptionAr: 'جذور زنجبيل، مجففة أو غير مبيضة',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.15,
        controllingAuthority: 'SFDA',
      },
    ],
  },
  {
    hsCode: '09102000',
    formattedCode: '0910.20.00',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Saffron (stigmas and styles)',
    descriptionAr: 'زعفران (مياسم وأقلام)',
    dutyRate: 0.05,
    dutyType: 'ad_valorem',
    vatRate: 0.05,
    restricted: false,
    controllingAuthority: 'MoIAT / SFDA',
    effectiveDate: '2025-01-01',
    sourceCitation: 'GCC Unified Customs Tariff 2022',
    nationalSubdivisions: [
      {
        code12: '091020000000',
        formattedCode: '0910.20.00.0000',
        jurisdiction: 'AE',
        descriptionEn: 'Pure saffron filaments in bulk or retail packaging',
        descriptionAr: 'خيوط زعفران نقية سائبة أو في عبوات تجزئة',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.05,
        controllingAuthority: 'MoIAT',
      },
      {
        code12: '091020000001',
        formattedCode: '0910.20.00.0001',
        jurisdiction: 'SA',
        descriptionEn: 'Natural saffron threads, ISO 3632 certified grade',
        descriptionAr: 'خيوط زعفران طبيعي، مطابقة لمعايير آيزو 3632',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.15,
        controllingAuthority: 'SFDA',
      },
    ],
  },
  {
    hsCode: '09103000',
    formattedCode: '0910.30.00',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Turmeric (curcuma), neither crushed nor ground',
    descriptionAr: 'كركم، غير مجروش وغير مطحون',
    dutyRate: 0.05,
    dutyType: 'ad_valorem',
    vatRate: 0.05,
    restricted: false,
    controllingAuthority: 'MoIAT / SFDA',
    effectiveDate: '2025-01-01',
    sourceCitation: 'GCC Unified Customs Tariff 2022',
    nationalSubdivisions: [
      {
        code12: '091030000000',
        formattedCode: '0910.30.00.0000',
        jurisdiction: 'AE',
        descriptionEn: 'Turmeric rhizomes (curcuma longa), dried, whole',
        descriptionAr: 'جذامير كركم مجففة كاملة',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.05,
        controllingAuthority: 'MoIAT',
      },
      {
        code12: '091030000001',
        formattedCode: '0910.30.00.0001',
        jurisdiction: 'SA',
        descriptionEn: 'Whole dried turmeric fingers and bulbs',
        descriptionAr: 'أصابع وبصيلات كركم مجففة كاملة',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.15,
        controllingAuthority: 'SFDA',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Chapter 27: Mineral Fuels & Oils
  // -------------------------------------------------------------------------
  {
    hsCode: '27090000',
    formattedCode: '2709.00.00',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Petroleum oils and oils obtained from bituminous minerals, crude',
    descriptionAr: 'زيوت نفط وزيوت متحصل عليها من مواد معدنية قارية، خام',
    dutyRate: 0,
    dutyType: 'exempt',
    vatRate: 0.05,
    restricted: true,
    controllingAuthority: 'Ministry of Energy',
    effectiveDate: '2025-01-01',
    sourceCitation: 'GCC Unified Customs Tariff & National Energy Regulations',
    notes: 'Strategic energy commodity; requires export/import concession permit.',
    nationalSubdivisions: [
      {
        code12: '270900000000',
        formattedCode: '2709.00.00.0000',
        jurisdiction: 'AE',
        descriptionEn: 'Crude petroleum oil, Murban / Upper Zakum / Das blend',
        descriptionAr: 'نفط خام، مزيج مربان / زاكوم العلوي / داس',
        dutyRate: 0,
        dutyType: 'exempt',
        vatRate: 0.05,
        controllingAuthority: 'Ministry of Energy and Infrastructure',
      },
      {
        code12: '270900000001',
        formattedCode: '2709.00.00.0001',
        jurisdiction: 'SA',
        descriptionEn: 'Crude petroleum, Arabian Light / Heavy blends',
        descriptionAr: 'نفط خام، مزيج عربي خفيف / ثقيل',
        dutyRate: 0,
        dutyType: 'exempt',
        vatRate: 0.15,
        controllingAuthority: 'Ministry of Energy / ZATCA',
      },
    ],
  },
  {
    hsCode: '27111100',
    formattedCode: '2711.11.00',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Natural gas, liquefied (LNG)',
    descriptionAr: 'غاز طبيعي، مسيل',
    dutyRate: 0,
    dutyType: 'exempt',
    vatRate: 0.05,
    restricted: true,
    controllingAuthority: 'Ministry of Energy',
    effectiveDate: '2025-01-01',
    sourceCitation: 'GCC Unified Customs Tariff 2022',
    nationalSubdivisions: [
      {
        code12: '271111000000',
        formattedCode: '2711.11.00.0000',
        jurisdiction: 'AE',
        descriptionEn: 'Liquefied natural gas (LNG) in specialized cryogenic bulk carriers',
        descriptionAr: 'غاز طبيعي مسيل في ناقلات مبردة متخصصة',
        dutyRate: 0,
        dutyType: 'exempt',
        vatRate: 0.05,
        controllingAuthority: 'Ministry of Energy and Infrastructure',
      },
      {
        code12: '271111000001',
        formattedCode: '2711.11.00.0001',
        jurisdiction: 'SA',
        descriptionEn: 'Liquefied natural gas, methane grade',
        descriptionAr: 'غاز طبيعي مسيل، درجة ميثان',
        dutyRate: 0,
        dutyType: 'exempt',
        vatRate: 0.15,
        controllingAuthority: 'Ministry of Energy',
      },
    ],
  },
  {
    hsCode: '27101910',
    formattedCode: '2710.19.10',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Lubricating oils for automotive engines and industrial machinery',
    descriptionAr: 'زيوت تزييت لمحركات السيارات والآلات الصناعية',
    dutyRate: 0.05,
    dutyType: 'ad_valorem',
    vatRate: 0.05,
    restricted: false,
    controllingAuthority: 'MoIAT / SASO',
    effectiveDate: '2025-01-01',
    sourceCitation: 'Dubai Customs Notice 10/2025 & ZATCA Tariff Schedule',
    nationalSubdivisions: [
      {
        code12: '271019100000',
        formattedCode: '2710.19.10.0000',
        jurisdiction: 'AE',
        descriptionEn: 'Synthetic and mineral lubricating engine oils, SAE graded',
        descriptionAr: 'زيوت تزييت محركات تخليقية ومعدنية، بتصنيف SAE',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.05,
        controllingAuthority: 'MoIAT',
      },
      {
        code12: '271019100001',
        formattedCode: '2710.19.10.0001',
        jurisdiction: 'SA',
        descriptionEn: 'Engine oils and industrial lubricants with SASO conformity certificate',
        descriptionAr: 'زيوت محركات ومزلقات صناعية مع شهادة مطابقة ساسو',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.15,
        controllingAuthority: 'SASO / ZATCA',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Chapter 39: Plastics & Polymers
  // -------------------------------------------------------------------------
  {
    hsCode: '39011010',
    formattedCode: '3901.10.10',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Polyethylene having a specific gravity of less than 0.94, in granules (LDPE / LLDPE)',
    descriptionAr: 'بولي إيثيلين بكثافة نوعية أقل من 0.94، على شكل حبيبات (بولي إيثيلين منخفض الكثافة)',
    dutyRate: 0.05,
    dutyType: 'ad_valorem',
    vatRate: 0.05,
    restricted: false,
    controllingAuthority: 'MoIAT / ZATCA',
    effectiveDate: '2025-01-01',
    sourceCitation: 'Dubai Customs Integrated Tariff & ZATCA Res 1447-88-5',
    notes: 'Major GCC petrochemical export line; duty exemption eligible for approved domestic manufacturing inputs.',
    nationalSubdivisions: [
      {
        code12: '390110100000',
        formattedCode: '3901.10.10.0000',
        jurisdiction: 'AE',
        descriptionEn: 'Linear low-density polyethylene (LLDPE) granules for film extrusion',
        descriptionAr: 'حبيبات بولي إيثيلين خطي منخفض الكثافة لبثق الرقائق',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.05,
        controllingAuthority: 'MoIAT',
      },
      {
        code12: '390110100001',
        formattedCode: '3901.10.10.0001',
        jurisdiction: 'SA',
        descriptionEn: 'Virgin low-density polyethylene pellets (LDPE) for industrial molding',
        descriptionAr: 'حبيبات بولي إيثيلين خام منخفض الكثافة للقولبة الصناعية',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.15,
        controllingAuthority: 'ZATCA',
      },
    ],
  },
  {
    hsCode: '39021000',
    formattedCode: '3902.10.00',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Polypropylene, in primary forms',
    descriptionAr: 'بولي بروبيلين، بأشكاله الأولية',
    dutyRate: 0.05,
    dutyType: 'ad_valorem',
    vatRate: 0.05,
    restricted: false,
    controllingAuthority: 'MoIAT / ZATCA',
    effectiveDate: '2025-01-01',
    sourceCitation: 'GCC Unified Customs Tariff 2022',
    nationalSubdivisions: [
      {
        code12: '390210000000',
        formattedCode: '3902.10.00.0000',
        jurisdiction: 'AE',
        descriptionEn: 'Polypropylene homopolymer pellets in primary forms',
        descriptionAr: 'حبيبات بولي بروبيلين متجانس البلمرة بأشكاله الأولية',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.05,
        controllingAuthority: 'MoIAT',
      },
      {
        code12: '390210000001',
        formattedCode: '3902.10.00.0001',
        jurisdiction: 'SA',
        descriptionEn: 'Polypropylene copolymer granules for injection and blow molding',
        descriptionAr: 'حبيبات بوليمر مشترك من بولي بروبيلين للحقن والنفخ',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.15,
        controllingAuthority: 'ZATCA',
      },
    ],
  },
  {
    hsCode: '39041000',
    formattedCode: '3904.10.00',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Poly(vinyl chloride), not mixed with any other substances, in primary forms (PVC)',
    descriptionAr: 'بولي (كلوريد الفينيل)، غير مخلوط بأي مواد أخرى، بأشكاله الأولية',
    dutyRate: 0.05,
    dutyType: 'ad_valorem',
    vatRate: 0.05,
    restricted: false,
    controllingAuthority: 'MoIAT / ZATCA',
    effectiveDate: '2025-01-01',
    sourceCitation: 'GCC Unified Customs Tariff 2022',
    nationalSubdivisions: [
      {
        code12: '390410000000',
        formattedCode: '3904.10.00.0000',
        jurisdiction: 'AE',
        descriptionEn: 'Suspension grade PVC resin powder, unplasticized',
        descriptionAr: 'مسحوق راتنج بي في سي معلق، غير ملدن',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.05,
        controllingAuthority: 'MoIAT',
      },
      {
        code12: '390410000001',
        formattedCode: '3904.10.00.0001',
        jurisdiction: 'SA',
        descriptionEn: 'Polyvinyl chloride resin for rigid pipe manufacturing',
        descriptionAr: 'راتنج كلوريد البوليفينيل لصناعة الأنابيب الصلبة',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.15,
        controllingAuthority: 'ZATCA / SASO',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Chapter 71: Precious Metals & Jewellery
  // -------------------------------------------------------------------------
  {
    hsCode: '71081200',
    formattedCode: '7108.12.00',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Gold, non-monetary, unwrought (bullion bars and ingots of purity 99.5%+)',
    descriptionAr: 'ذهب، لغير الغايات النقدية، غير مشغول (سبائك ذهبية بنقاوة 99.5% فأكثر)',
    dutyRate: 0,
    dutyType: 'exempt',
    vatRate: 0.05,
    restricted: true,
    controllingAuthority: 'Central Bank / MoIAT / ZATCA',
    effectiveDate: '2025-01-01',
    sourceCitation: 'Dubai Customs Notice 10/2025 & Cabinet Resolution 119/2024',
    notes: 'Exempt from customs duty across GCC for investment grade bullion; subject to reverse charge / zero-rating rules.',
    nationalSubdivisions: [
      {
        code12: '710812000000',
        formattedCode: '7108.12.00.0000',
        jurisdiction: 'AE',
        descriptionEn: 'Investment gold bars (995+ purity) meeting Dubai Good Delivery standard',
        descriptionAr: 'سبائك ذهب استثماري (نقاوة 995+) مطابقة لمعيار دبي لتسليم البضائع',
        dutyRate: 0,
        dutyType: 'exempt',
        vatRate: 0.05,
        controllingAuthority: 'Dubai Multi Commodities Centre (DMCC) / MoIAT',
      },
      {
        code12: '710812000001',
        formattedCode: '7108.12.00.0001',
        jurisdiction: 'SA',
        descriptionEn: 'Unwrought gold bullion bars for banking and institutional reserves',
        descriptionAr: 'سبائك ذهب خام للعمليات المصرفية والاحتياطيات المؤسسية',
        dutyRate: 0,
        dutyType: 'exempt',
        vatRate: 0.15,
        controllingAuthority: 'Saudi Central Bank (SAMA) / ZATCA',
      },
    ],
  },
  {
    hsCode: '71069100',
    formattedCode: '7106.91.00',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Silver, unwrought (bullion bars, grains)',
    descriptionAr: 'فضة، غير مشغولة (سبائك، حبيبات)',
    dutyRate: 0,
    dutyType: 'exempt',
    vatRate: 0.05,
    restricted: false,
    controllingAuthority: 'MoIAT / ZATCA',
    effectiveDate: '2025-01-01',
    sourceCitation: 'GCC Unified Customs Tariff 2022',
    nationalSubdivisions: [
      {
        code12: '710691000000',
        formattedCode: '7106.91.00.0000',
        jurisdiction: 'AE',
        descriptionEn: 'Investment silver bullion bars of fineness 999/1000',
        descriptionAr: 'سبائك فضة استثمارية بنقاوة 999 بالألف',
        dutyRate: 0,
        dutyType: 'exempt',
        vatRate: 0.05,
        controllingAuthority: 'DMCC / MoIAT',
      },
      {
        code12: '710691000001',
        formattedCode: '7106.91.00.0001',
        jurisdiction: 'SA',
        descriptionEn: 'Unwrought silver ingots and cast bars',
        descriptionAr: 'سبائك فضة غير مشغولة وقضبان مصبوبة',
        dutyRate: 0,
        dutyType: 'exempt',
        vatRate: 0.15,
        controllingAuthority: 'ZATCA',
      },
    ],
  },
  {
    hsCode: '71131900',
    formattedCode: '7113.19.00',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Articles of jewellery and parts thereof, of precious metal other than silver (gold jewellery)',
    descriptionAr: 'حلي ومجوهرات وأجزاؤها، من معادن ثمينة أخر غير الفضة (مجوهرات ذهبية)',
    dutyRate: 0.05,
    dutyType: 'ad_valorem',
    vatRate: 0.05,
    restricted: true,
    controllingAuthority: 'MoIAT / Ministry of Commerce',
    effectiveDate: '2025-01-01',
    sourceCitation: 'GCC Unified Customs Tariff 2022 & Dubai Customs Notice 10/2025',
    notes: 'Hallmarking and precious metal purity verification mandatory upon import.',
    nationalSubdivisions: [
      {
        code12: '711319000000',
        formattedCode: '7113.19.00.0000',
        jurisdiction: 'AE',
        descriptionEn: 'Finished 18K/21K/22K gold jewellery, with or without precious stones',
        descriptionAr: 'مجوهرات ذهب مصوغة عيار 18/21/22 قيراط، بأحجار كريمة أو بدونها',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.05,
        controllingAuthority: 'Dubai Central Laboratory (DCL) / MoIAT',
      },
      {
        code12: '711319000001',
        formattedCode: '7113.19.00.0001',
        jurisdiction: 'SA',
        descriptionEn: 'Gold jewellery and ornaments stamped with official hallmark',
        descriptionAr: 'حلي ومجوهرات ذهبية مدموغة بالعلامة الرسمية',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.15,
        controllingAuthority: 'Ministry of Commerce / ZATCA',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Chapter 72/73: Iron and Steel & Articles
  // -------------------------------------------------------------------------
  {
    hsCode: '72081000',
    formattedCode: '7208.10.00',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Flat-rolled products of iron or non-alloy steel, hot-rolled, in coils',
    descriptionAr: 'منتجات مدرفلة مسطحة من حديد أو صلب غير سبائكي، مدرفلة على الساخن، في لفات',
    dutyRate: 0.05,
    dutyType: 'ad_valorem',
    vatRate: 0.05,
    restricted: false,
    controllingAuthority: 'MoIAT / SASO',
    effectiveDate: '2025-01-01',
    sourceCitation: 'GCC Unified Customs Tariff 2022',
    nationalSubdivisions: [
      {
        code12: '720810000000',
        formattedCode: '7208.10.00.0000',
        jurisdiction: 'AE',
        descriptionEn: 'Hot-rolled steel coils, width 600 mm or more, thickness 3 mm to 10 mm',
        descriptionAr: 'لفات صلب مدرفلة على الساخن، بعرض 600 مم فأكثر، وبسمك 3 مم إلى 10 مم',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.05,
        controllingAuthority: 'MoIAT',
      },
      {
        code12: '720810000001',
        formattedCode: '7208.10.00.0001',
        jurisdiction: 'SA',
        descriptionEn: 'Hot-rolled carbon steel coils for pipe fabrication and construction',
        descriptionAr: 'لفات صلب كربوني مدرفلة على الساخن لتصنيع الأنابيب والإنشاءات',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.15,
        controllingAuthority: 'SASO / ZATCA',
      },
    ],
  },
  {
    hsCode: '72142000',
    formattedCode: '7214.20.00',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Bars and rods of iron or non-alloy steel, containing indentations, ribs, grooves (rebar)',
    descriptionAr: 'قضبان وعيدان من حديد أو صلب غير سبائكي، ذات نتوءات أو حزوز (حديد تسليح)',
    dutyRate: 0.05,
    dutyType: 'ad_valorem',
    vatRate: 0.05,
    restricted: false,
    controllingAuthority: 'MoIAT / SASO',
    effectiveDate: '2025-01-01',
    sourceCitation: 'GCC Unified Customs Tariff 2022',
    notes: 'Subject to GCC anti-dumping / safeguard duties depending on origin country.',
    nationalSubdivisions: [
      {
        code12: '721420000000',
        formattedCode: '7214.20.00.0000',
        jurisdiction: 'AE',
        descriptionEn: 'Deformed concrete reinforcing steel bars (rebar), ASTM A615 / BS 4449 compliant',
        descriptionAr: 'قضبان حديد تسليح مشوهة للخرسانة، مطابقة للمواصفات البريطانية والأمريكية',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.05,
        controllingAuthority: 'MoIAT',
      },
      {
        code12: '721420000001',
        formattedCode: '7214.20.00.0001',
        jurisdiction: 'SA',
        descriptionEn: 'High-strength steel rebars for infrastructure projects with SASO Quality Mark',
        descriptionAr: 'حديد تسليح عالي المقاومة لمشاريع البنية التحتية مع علامة الجودة ساسو',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.15,
        controllingAuthority: 'SASO / ZATCA',
      },
    ],
  },
  {
    hsCode: '73041100',
    formattedCode: '7304.11.00',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Line pipe of a kind used for oil or gas pipelines, seamless, of stainless steel',
    descriptionAr: 'أنابيب ومواسير لخطوط أنابيب النفط أو الغاز، بدون لحام، من صلب لا يصدأ',
    dutyRate: 0.05,
    dutyType: 'ad_valorem',
    vatRate: 0.05,
    restricted: false,
    controllingAuthority: 'MoIAT / SASO',
    effectiveDate: '2025-01-01',
    sourceCitation: 'GCC Unified Customs Tariff 2022',
    nationalSubdivisions: [
      {
        code12: '730411000000',
        formattedCode: '7304.11.00.0000',
        jurisdiction: 'AE',
        descriptionEn: 'Seamless stainless steel line pipe, API 5L specification, for offshore oil/gas',
        descriptionAr: 'أنابيب غير ملحومة من صلب مقاوم للصدأ، بمواصفات معهد البترول الأمريكي API 5L',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.05,
        controllingAuthority: 'MoIAT',
      },
      {
        code12: '730411000001',
        formattedCode: '7304.11.00.0001',
        jurisdiction: 'SA',
        descriptionEn: 'Seamless oil and gas pipeline pipes certified to Saudi Aramco standards',
        descriptionAr: 'أنابيب خطوط نفط وغاز بدون درز معتمدة بمواصفات أرامكو السعودية',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.15,
        controllingAuthority: 'SASO / ZATCA',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Chapter 84: Machinery & Mechanical Appliances
  // -------------------------------------------------------------------------
  {
    hsCode: '84713000',
    formattedCode: '8471.30.00',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Portable automatic data processing machines, weighing not more than 10 kg (laptops, notebooks, tablets)',
    descriptionAr: 'آلات معالجة بيانات آلية محمولة لا يزيد وزنها عن 10 كغ (حاسوب محمول، حواسيب محمولة، أجهزة لوحية)',
    dutyRate: 0,
    dutyType: 'exempt',
    vatRate: 0.05,
    restricted: false,
    controllingAuthority: 'TDRA / CITC',
    effectiveDate: '2025-01-01',
    sourceCitation: 'GCC Unified Customs Tariff 2022 & WTO ITA Schedule',
    notes: 'Exempt from customs duty across GCC under WTO Information Technology Agreement (ITA). Telecommunication approvals apply.',
    nationalSubdivisions: [
      {
        code12: '847130000000',
        formattedCode: '8471.30.00.0000',
        jurisdiction: 'AE',
        descriptionEn: 'Laptops, notebooks, and tablet computers with TDRA telecommunications type approval',
        descriptionAr: 'حواسيب محمولة وأجهزة لوحية حاصلة على اعتماد النوع من هيئة تنظيم الاتصالات والحكومة الرقمية',
        dutyRate: 0,
        dutyType: 'exempt',
        vatRate: 0.05,
        controllingAuthority: 'TDRA / MoIAT',
      },
      {
        code12: '847130000001',
        formattedCode: '8471.30.00.0001',
        jurisdiction: 'SA',
        descriptionEn: 'Laptops, convertible notebooks, and portable computers registered on SABER / CST',
        descriptionAr: 'حواسيب محمولة ومتحولة مسجلة في منصة سابر وهيئة الاتصالات والفضاء والتقنية',
        dutyRate: 0,
        dutyType: 'exempt',
        vatRate: 0.15,
        controllingAuthority: 'CST / ZATCA',
      },
    ],
  },
  {
    hsCode: '84151000',
    formattedCode: '8415.10.00',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Window or wall air conditioning machines, self-contained or split-system',
    descriptionAr: 'آلات تكييف هواء جدارية أو للنافذة، من نوع الوحدات المدمجة أو المنفصلة (سبليت)',
    dutyRate: 0.05,
    dutyType: 'ad_valorem',
    vatRate: 0.05,
    restricted: true,
    controllingAuthority: 'MoIAT / SASO',
    effectiveDate: '2025-01-01',
    sourceCitation: 'GCC Unified Customs Tariff 2022 & ESMA Energy Efficiency Mandates',
    notes: 'Mandatory energy efficiency rating label (EER/SEER) and refrigerant GWP verification required.',
    nationalSubdivisions: [
      {
        code12: '841510000000',
        formattedCode: '8415.10.00.0000',
        jurisdiction: 'AE',
        descriptionEn: 'Split-system inverter air conditioners with ESMA / MoIAT 5-star energy rating',
        descriptionAr: 'مكيفات هواء بنظام سبليت موفر للطاقة ببطاقة كفاءة 5 نجوم من وزارة الصناعة',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.05,
        controllingAuthority: 'MoIAT',
      },
      {
        code12: '841510000001',
        formattedCode: '8415.10.00.0001',
        jurisdiction: 'SA',
        descriptionEn: 'Residential and commercial split air conditioning units with SASO energy efficiency certificate',
        descriptionAr: 'وحدات تكييف منفصلة سكنية وتجارية بشهادة كفاءة الطاقة من ساسو',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.15,
        controllingAuthority: 'SASO / ZATCA',
      },
    ],
  },
  {
    hsCode: '84137000',
    formattedCode: '8413.70.00',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Centrifugal pumps for liquids',
    descriptionAr: 'مضخات طرد مركزي للسوائل',
    dutyRate: 0.05,
    dutyType: 'ad_valorem',
    vatRate: 0.05,
    restricted: false,
    controllingAuthority: 'MoIAT / SASO',
    effectiveDate: '2025-01-01',
    sourceCitation: 'GCC Unified Customs Tariff 2022',
    nationalSubdivisions: [
      {
        code12: '841370000000',
        formattedCode: '8413.70.00.0000',
        jurisdiction: 'AE',
        descriptionEn: 'Submersible and surface centrifugal water pumps for commercial irrigation and building services',
        descriptionAr: 'مضخات مياه غاطسة وسطحية بالطرد المركزي للري التجاري وخدمات المباني',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.05,
        controllingAuthority: 'MoIAT',
      },
      {
        code12: '841370000001',
        formattedCode: '8413.70.00.0001',
        jurisdiction: 'SA',
        descriptionEn: 'Heavy-duty industrial centrifugal pumps for petroleum refineries and water treatment',
        descriptionAr: 'مضخات طرد مركزي صناعية ثقيلة لمصافي النفط ومعالجة المياه',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.15,
        controllingAuthority: 'SASO / ZATCA',
      },
    ],
  },
  {
    hsCode: '84818000',
    formattedCode: '8481.80.00',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Taps, cocks, valves and similar appliances for pipes, boiler shells, tanks',
    descriptionAr: 'صنابير وحنفيات وصمامات وأدوات مماثلة للأنابيب أو المراجل أو الخزانات',
    dutyRate: 0.05,
    dutyType: 'ad_valorem',
    vatRate: 0.05,
    restricted: false,
    controllingAuthority: 'MoIAT / SASO',
    effectiveDate: '2025-01-01',
    sourceCitation: 'GCC Unified Customs Tariff 2022',
    nationalSubdivisions: [
      {
        code12: '848180000000',
        formattedCode: '8481.80.00.0000',
        jurisdiction: 'AE',
        descriptionEn: 'Industrial ball, butterfly, and check valves for water and gas distribution',
        descriptionAr: 'صمامات كروية وفراشية وصمامات عدم رجوع صناعية لشبكات المياه والغاز',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.05,
        controllingAuthority: 'MoIAT',
      },
      {
        code12: '848180000001',
        formattedCode: '8481.80.00.0001',
        jurisdiction: 'SA',
        descriptionEn: 'High-pressure control and safety relief valves conforming to SABER requirements',
        descriptionAr: 'صمامات تحكم وتنفيس أمان للضغط العالي مطابقة لمتطلبات منصة سابر',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.15,
        controllingAuthority: 'SASO / ZATCA',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Chapter 85: Electrical Machinery & Electronics
  // -------------------------------------------------------------------------
  {
    hsCode: '85171300',
    formattedCode: '8517.13.00',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Smartphones for cellular networks or other wireless networks',
    descriptionAr: 'هواتف ذكية للشبكات الخلوية أو شبكات لاسلكية أخرى',
    dutyRate: 0,
    dutyType: 'exempt',
    vatRate: 0.05,
    restricted: true,
    controllingAuthority: 'TDRA / CST',
    effectiveDate: '2025-01-01',
    sourceCitation: 'GCC Unified Customs Tariff 2022 & WTO ITA Schedule',
    notes: 'Exempt from customs duty under ITA agreement. Mandatory telecom type approval (TDRA in UAE, CST in Saudi Arabia).',
    nationalSubdivisions: [
      {
        code12: '851713000000',
        formattedCode: '8517.13.00.0000',
        jurisdiction: 'AE',
        descriptionEn: '5G / 4G LTE cellular smartphones with UAE TDRA telecommunications approval',
        descriptionAr: 'هواتف ذكية خلوية تدعم الجيل الخامس والرابع معتمدة من هيئة تنظيم الاتصالات والحكومة الرقمية',
        dutyRate: 0,
        dutyType: 'exempt',
        vatRate: 0.05,
        controllingAuthority: 'TDRA',
      },
      {
        code12: '851713000001',
        formattedCode: '8517.13.00.0001',
        jurisdiction: 'SA',
        descriptionEn: 'Smartphones with CST certificate of conformity and CITC IMEI registry compliance',
        descriptionAr: 'هواتف ذكية حاصلة على شهادة مطابقة من هيئة الاتصالات والفضاء ومسجلة في نظام الهوية الدولية',
        dutyRate: 0,
        dutyType: 'exempt',
        vatRate: 0.15,
        controllingAuthority: 'CST / ZATCA',
      },
    ],
  },
  {
    hsCode: '85042100',
    formattedCode: '8504.21.00',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Liquid dielectric transformers having a power handling capacity not exceeding 650 kVA',
    descriptionAr: 'محولات كهربائية ذات عازل سائل بطاقة لا تتجاوز 650 كيلو فولت أمبير',
    dutyRate: 0.05,
    dutyType: 'ad_valorem',
    vatRate: 0.05,
    restricted: false,
    controllingAuthority: 'MoIAT / SASO',
    effectiveDate: '2025-01-01',
    sourceCitation: 'GCC Unified Customs Tariff 2022',
    nationalSubdivisions: [
      {
        code12: '850421000000',
        formattedCode: '8504.21.00.0000',
        jurisdiction: 'AE',
        descriptionEn: 'Oil-immersed distribution transformers for DEWA / SEWA / FEWA power grids',
        descriptionAr: 'محولات توزيع مغمورة بالزيت لشبكات هيئات الكهرباء والمياه بالدولة',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.05,
        controllingAuthority: 'MoIAT',
      },
      {
        code12: '850421000001',
        formattedCode: '8504.21.00.0001',
        jurisdiction: 'SA',
        descriptionEn: 'Step-down distribution transformers complying with Saudi Electricity Company (SEC) standards',
        descriptionAr: 'محولات توزيع خافضة للجهد مطابقة لمواصفات الشركة السعودية للكهرباء',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.15,
        controllingAuthority: 'SASO / ZATCA',
      },
    ],
  },
  {
    hsCode: '85044000',
    formattedCode: '8504.40.00',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Static converters (inverters, rectifiers, power supplies)',
    descriptionAr: 'محولات ساكنة (عاكسات تيار، مقومات، مزودات طاقة)',
    dutyRate: 0.05,
    dutyType: 'ad_valorem',
    vatRate: 0.05,
    restricted: false,
    controllingAuthority: 'MoIAT / SASO',
    effectiveDate: '2025-01-01',
    sourceCitation: 'GCC Unified Customs Tariff 2022',
    nationalSubdivisions: [
      {
        code12: '850440000000',
        formattedCode: '8504.40.00.0000',
        jurisdiction: 'AE',
        descriptionEn: 'Solar photovoltaic grid-tie and hybrid inverters, single and three phase',
        descriptionAr: 'عاكسات تيار كهروضوئية هجينة ومربوطة بالشبكة، أحادية وثلاثية الأطوار',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.05,
        controllingAuthority: 'MoIAT',
      },
      {
        code12: '850440000001',
        formattedCode: '8504.40.00.0001',
        jurisdiction: 'SA',
        descriptionEn: 'Industrial frequency inverters and DC/AC power conversion units',
        descriptionAr: 'مغيرات تردد صناعية ووحدات تحويل طاقة تيار مستمر إلى متردد',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.15,
        controllingAuthority: 'SASO / ZATCA',
      },
    ],
  },
  {
    hsCode: '85414300',
    formattedCode: '8541.43.00',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Photovoltaic cells assembled in modules or made up into panels (solar photovoltaic panels)',
    descriptionAr: 'خلايا ضوئية مجمعة في وحدات أو مصنوعة في ألواح (ألواح شمسية كهروضوئية)',
    dutyRate: 0,
    dutyType: 'exempt',
    vatRate: 0.05,
    restricted: false,
    controllingAuthority: 'Ministry of Energy / MoIAT',
    effectiveDate: '2025-01-01',
    sourceCitation: 'GCC Unified Customs Tariff 2022 & National Clean Energy Incentives',
    notes: 'Exempt from customs duties to incentivize regional solar installations and carbon reduction programs.',
    nationalSubdivisions: [
      {
        code12: '854143000000',
        formattedCode: '8541.43.00.0000',
        jurisdiction: 'AE',
        descriptionEn: 'Monocrystalline and bifacial solar PV panels certified under Shams Dubai scheme',
        descriptionAr: 'ألواح طاقة شمسية أحادية التبلور وثنائية الوجه معتمدة ضمن مبادرة شمس دبي',
        dutyRate: 0,
        dutyType: 'exempt',
        vatRate: 0.05,
        controllingAuthority: 'MoIAT / DEWA',
      },
      {
        code12: '854143000001',
        formattedCode: '8541.43.00.0001',
        jurisdiction: 'SA',
        descriptionEn: 'High-efficiency solar photovoltaic modules for National Renewable Energy Program',
        descriptionAr: 'وحدات كهروضوئية عالية الكفاءة لمشاريع البرنامج الوطني للطاقة المتجددة',
        dutyRate: 0,
        dutyType: 'exempt',
        vatRate: 0.15,
        controllingAuthority: 'ZATCA / SASO',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Chapter 87: Motor Vehicles & Parts
  // -------------------------------------------------------------------------
  {
    hsCode: '87042100',
    formattedCode: '8704.21.00',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Motor vehicles for transport of goods, diesel engine, g.v.w. not exceeding 5 tonnes (commercial vans, pick-ups, light trucks)',
    descriptionAr: 'سيارات لنقل البضائع، بمحرك ديزل، بوزن إجمالي لا يتجاوز 5 أطنان (شاحنات خفيفة، حافلات نقل بضائع)',
    dutyRate: 0.05,
    dutyType: 'ad_valorem',
    vatRate: 0.05,
    restricted: true,
    controllingAuthority: 'ESMA / SASO',
    effectiveDate: '2025-01-01',
    sourceCitation: 'GCC Unified Customs Tariff 2022',
    notes: 'Vehicle age restrictions (maximum 5 years for passenger/light vehicles) and GSO vehicle conformity certificates apply.',
    nationalSubdivisions: [
      {
        code12: '870421000000',
        formattedCode: '8704.21.00.0000',
        jurisdiction: 'AE',
        descriptionEn: 'Light commercial transport vehicles and pickup trucks with GCC conformity certificate',
        descriptionAr: 'مركبات نقل تجارية خفيفة وشاحنات بيك آب مع شهادة مطابقة خليجية',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.05,
        controllingAuthority: 'MoIAT / Roads and Transport Authority (RTA)',
      },
      {
        code12: '870421000001',
        formattedCode: '8704.21.00.0001',
        jurisdiction: 'SA',
        descriptionEn: 'Goods transport motor vehicles meeting SASO technical regulations and fuel economy standards',
        descriptionAr: 'مركبات نقل بضائع مطابقة للوائح الفنية لهيئة ساسو ومعايير اقتصاد الوقود',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.15,
        controllingAuthority: 'SASO / ZATCA',
      },
    ],
  },
  {
    hsCode: '87032300',
    formattedCode: '8703.23.00',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Passenger motor cars, spark-ignition engine capacity between 1,500 cc and 3,000 cc (sedans, SUVs)',
    descriptionAr: 'سيارات ركوب سياحية، بمحرك بنزين سعة بين 1500 و3000 سم مكعب (سيارات صالون وسيارات دفع رباعي)',
    dutyRate: 0.05,
    dutyType: 'ad_valorem',
    vatRate: 0.05,
    restricted: true,
    controllingAuthority: 'ESMA / SASO',
    effectiveDate: '2025-01-01',
    sourceCitation: 'GCC Unified Customs Tariff 2022',
    nationalSubdivisions: [
      {
        code12: '870323000000',
        formattedCode: '8703.23.00.0000',
        jurisdiction: 'AE',
        descriptionEn: 'Passenger sedans and compact/mid-size SUVs with ESMA GSO certification',
        descriptionAr: 'سيارات صالون وسيارات رياضية متعددة الاستخدامات معتمدة بمواصفات هيئة التقييس الخليجية',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.05,
        controllingAuthority: 'MoIAT / RTA',
      },
      {
        code12: '870323000001',
        formattedCode: '8703.23.00.0001',
        jurisdiction: 'SA',
        descriptionEn: 'Passenger motor vehicles certified on SL&G (Saudi Label & Green) fuel efficiency standard',
        descriptionAr: 'سيارات ركوب سياحية معتمدة وفق بطاقة كفاءة الطاقة لاقتصاد الوقود السعودية',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.15,
        controllingAuthority: 'SASO / ZATCA',
      },
    ],
  },
  {
    hsCode: '87082900',
    formattedCode: '8708.29.00',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Other parts and accessories of bodies (including cabs) for motor vehicles',
    descriptionAr: 'أجزاء ولوازم أخر لهياكل سيارات نقل الركاب والبضائع',
    dutyRate: 0.05,
    dutyType: 'ad_valorem',
    vatRate: 0.05,
    restricted: false,
    controllingAuthority: 'MoIAT / SASO',
    effectiveDate: '2025-01-01',
    sourceCitation: 'GCC Unified Customs Tariff 2022',
    nationalSubdivisions: [
      {
        code12: '870829000000',
        formattedCode: '8708.29.00.0000',
        jurisdiction: 'AE',
        descriptionEn: 'Replacement automotive body panels, bumpers, fenders, and trim components',
        descriptionAr: 'ألواح هياكل سيارات بديلة ومصدات ورفارف وأجزاء تجميلية',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.05,
        controllingAuthority: 'MoIAT',
      },
      {
        code12: '870829000001',
        formattedCode: '8708.29.00.0001',
        jurisdiction: 'SA',
        descriptionEn: 'Automotive replacement parts certified through SABER platform',
        descriptionAr: 'قطع غيار وهياكل سيارات معتمدة عبر منصة سابر',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.15,
        controllingAuthority: 'SASO / ZATCA',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Chapter 22: Beverages (Excise Tax Goods Showcase)
  // -------------------------------------------------------------------------
  {
    hsCode: '22029910',
    formattedCode: '2202.99.10',
    jurisdiction: 'GCC',
    digits: 8,
    descriptionEn: 'Energy drinks containing caffeine, taurine or stimulant substances',
    descriptionAr: 'مشروبات الطاقة المحتوية على الكافيين أو التورين أو مواد منبهة',
    dutyRate: 0.05,
    dutyType: 'ad_valorem',
    vatRate: 0.05,
    exciseRate: 1.00, // 100% GCC unified excise tax
    restricted: true,
    controllingAuthority: 'FTA / ZATCA / SFDA',
    effectiveDate: '2025-01-01',
    sourceCitation: 'GCC Unified Excise Tax Agreement & Cabinet Decision No. 52/2019',
    notes: 'Subject to 100% excise tax across all GCC member states prior to VAT calculation.',
    nationalSubdivisions: [
      {
        code12: '220299100000',
        formattedCode: '2202.99.10.0000',
        jurisdiction: 'AE',
        descriptionEn: 'Energy drinks registered with UAE Federal Tax Authority (FTA) Digital Tax Stamps',
        descriptionAr: 'مشروبات طاقة مسجلة لدى الهيئة الاتحادية للضرائب مع علامات رقمية مميزة',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.05,
        controllingAuthority: 'FTA / MoIAT',
      },
      {
        code12: '220299100001',
        formattedCode: '2202.99.10.0001',
        jurisdiction: 'SA',
        descriptionEn: 'Energy drinks complying with SFDA technical regulation GSO 1926 and ZATCA excise stamps',
        descriptionAr: 'مشروبات طاقة مطابقة للائحة الفنية لهيئة الغذاء والدواء وأختام زاتكا الضريبية',
        dutyRate: 0.05,
        dutyType: 'ad_valorem',
        vatRate: 0.15,
        controllingAuthority: 'SFDA / ZATCA',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// 4. Utility Functions (Normalization & Formatting)
// ---------------------------------------------------------------------------

/**
 * Strips all non-numeric characters (dots, spaces, dashes) from an HS code string.
 */
export function normalizeHsCode(code: string): string {
  if (!code || typeof code !== 'string') return '';
  return code.replace(/\D/g, '');
}

/**
 * Formats an HS code string with standard dot notation:
 * - 6 digits:  XXXX.XX
 * - 8 digits:  XXXX.XX.XX
 * - 12 digits: XXXX.XX.XX.XXXX
 */
export function formatHsCode(code: string): string {
  const digits = normalizeHsCode(code);
  if (!digits) return '';

  if (digits.length <= 4) {
    return digits;
  }
  if (digits.length <= 6) {
    return `${digits.slice(0, 4)}.${digits.slice(4)}`;
  }
  if (digits.length <= 8) {
    return `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6)}`;
  }
  if (digits.length <= 12) {
    return `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6, 8)}.${digits.slice(8)}`;
  }
  // Fallback for codes longer than 12 digits
  return `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6, 8)}.${digits.slice(8, 12)}.${digits.slice(12)}`;
}

// ---------------------------------------------------------------------------
// 5. Search Engine
// ---------------------------------------------------------------------------

export interface SearchTariffOptions {
  jurisdiction?: Jurisdiction;
  limit?: number;
  exactJurisdiction?: boolean;
}

/**
 * Searches the tariff dataset by code prefix, exact code, English text, or Arabic text.
 */
export function searchTariff(
  query: string,
  options?: SearchTariffOptions
): TariffEntry[] {
  const trimmed = (query || '').trim();
  const normQuery = normalizeHsCode(trimmed);
  const lowerQuery = trimmed.toLowerCase();

  const filtered = TARIFF_DATASET.filter((entry) => {
    // Jurisdiction filter
    if (options?.jurisdiction) {
      if (options.exactJurisdiction) {
        if (entry.jurisdiction !== options.jurisdiction) return false;
      } else {
        // GCC items apply region-wide to both AE and SA
        if (entry.jurisdiction !== options.jurisdiction && entry.jurisdiction !== 'GCC') {
          return false;
        }
      }
    }

    // If query is empty, match all entries passing jurisdiction filter
    if (!trimmed) {
      return true;
    }

    // 1. Match code prefix or exact code on main line
    if (normQuery.length > 0) {
      if (entry.hsCode.startsWith(normQuery) || normQuery.startsWith(entry.hsCode)) {
        return true;
      }
      if (entry.formattedCode.replace(/\./g, '').startsWith(normQuery)) {
        return true;
      }
      // Check national subdivisions code
      if (
        entry.nationalSubdivisions?.some(
          (sub) => sub.code12.startsWith(normQuery) || normQuery.startsWith(sub.code12)
        )
      ) {
        return true;
      }
    }

    // 2. Case-insensitive English description & keywords
    if (entry.descriptionEn.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    // 3. Arabic description
    if (entry.descriptionAr.includes(trimmed)) {
      return true;
    }

    // 4. Notes & controlling authority
    if (entry.notes?.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    if (entry.controllingAuthority?.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    // 5. Match within national subdivisions
    if (
      entry.nationalSubdivisions?.some(
        (sub) =>
          sub.descriptionEn.toLowerCase().includes(lowerQuery) ||
          sub.descriptionAr.includes(trimmed) ||
          sub.controllingAuthority?.toLowerCase().includes(lowerQuery)
      )
    ) {
      return true;
    }

    return false;
  });

  const limit = options?.limit ?? 50;
  return limit > 0 ? filtered.slice(0, limit) : filtered;
}

/**
 * Direct lookup of a single tariff entry by exact normalized or formatted code.
 */
export function getTariffEntry(code: string): TariffEntry | undefined {
  const norm = normalizeHsCode(code);
  if (!norm) return undefined;
  return TARIFF_DATASET.find((entry) => entry.hsCode === norm || entry.hsCode.startsWith(norm));
}

// ---------------------------------------------------------------------------
// 6. 8-to-12 Digit Correlation Converter
// ---------------------------------------------------------------------------

/**
 * Expands an 8-digit GCC line to its 12-digit national lines for UAE ('AE') or Saudi Arabia ('SA').
 * Returns an array of TariffEntry lines, or null if the base 8-digit code is not found.
 */
export function convert8to12(
  code8: string,
  targetJurisdiction: 'AE' | 'SA'
): TariffEntry[] | null {
  const norm = normalizeHsCode(code8);
  if (!norm || norm.length < 6) return null;

  // Find matching base entry in the dataset
  const baseEntry = TARIFF_DATASET.find(
    (e) => e.digits === 8 && (e.hsCode === norm || e.hsCode.startsWith(norm) || norm.startsWith(e.hsCode))
  );

  if (!baseEntry) {
    return null;
  }

  // Filter national subdivisions for target jurisdiction
  const subs = (baseEntry.nationalSubdivisions || []).filter(
    (s) => s.jurisdiction === targetJurisdiction
  );

  if (subs.length > 0) {
    return subs.map((sub) => ({
      hsCode: sub.code12,
      formattedCode: sub.formattedCode,
      jurisdiction: sub.jurisdiction,
      digits: 12 as const,
      descriptionEn: sub.descriptionEn,
      descriptionAr: sub.descriptionAr,
      dutyRate: sub.dutyRate,
      dutyType: sub.dutyType,
      vatRate: sub.vatRate,
      exciseRate: baseEntry.exciseRate,
      restricted: baseEntry.restricted,
      controllingAuthority: sub.controllingAuthority || baseEntry.controllingAuthority,
      effectiveDate:
        targetJurisdiction === 'AE' ? '2025-08-01' : '2025-01-01',
      sourceCitation:
        targetJurisdiction === 'AE'
          ? 'Dubai Customs Notice No. 10/2025 & Cabinet Res 119/2024'
          : 'ZATCA Ministerial Res No. 1447-88-5 & Decision 1447-88-7',
      notes: baseEntry.notes,
    }));
  }

  // If no explicit subdivision exists, synthesize the zero-extended default 12-digit national line
  // (per Dubai Customs Notice 10/2025 and ZATCA 12-digit unchanged lines rule)
  const code12 = norm.padEnd(12, '0');
  const vatRate = targetJurisdiction === 'AE' ? 0.05 : 0.15;

  return [
    {
      hsCode: code12,
      formattedCode: formatHsCode(code12),
      jurisdiction: targetJurisdiction,
      digits: 12 as const,
      descriptionEn: baseEntry.descriptionEn,
      descriptionAr: baseEntry.descriptionAr,
      dutyRate: baseEntry.dutyRate,
      dutyType: baseEntry.dutyType,
      vatRate,
      exciseRate: baseEntry.exciseRate,
      restricted: baseEntry.restricted,
      controllingAuthority: baseEntry.controllingAuthority,
      effectiveDate: targetJurisdiction === 'AE' ? '2025-08-01' : '2025-01-01',
      sourceCitation:
        targetJurisdiction === 'AE'
          ? 'Dubai Customs Notice No. 10/2025 (Zero-extension)'
          : 'ZATCA Integrated Customs Tariff (Zero-extension)',
      notes: baseEntry.notes,
    },
  ];
}

// ---------------------------------------------------------------------------
// 7. Duty & Tax Calculation Engine
// ---------------------------------------------------------------------------

function round2(val: number): number {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

/**
 * Calculates duty, excise tax, VAT, total duties and landed cost.
 * Grounded in GCC statutory customs valuation formulas:
 * - dutyAmount = cifValue * dutyRate
 * - exciseAmount = (cifValue + dutyAmount) * exciseRate
 * - vatBase = cifValue + dutyAmount + exciseAmount
 * - vatAmount = vatBase * vatRate
 * - totalDutiesAndTaxes = dutyAmount + exciseAmount + vatAmount
 * - totalLandedCost = cifValue + totalDutiesAndTaxes
 * - effectiveTotalRatePercent = (totalDutiesAndTaxes / cifValue) * 100
 */
export function calculateDutyAndTaxes(params: DutyCalculationParams): DutyCalculationResult {
  const cifValue = Math.max(0, Number(params.cifValue) || 0);
  const currency = (params.currency || 'AED').toUpperCase().trim();
  const dutyRate = Math.max(0, Number(params.dutyRate) || 0);
  const vatRate = Math.max(0, Number(params.vatRate) || 0);
  const exciseRate = Math.max(0, Number(params.exciseRate) || 0);

  const dutyAmount = round2(cifValue * dutyRate);
  const exciseAmount = round2((cifValue + dutyAmount) * exciseRate);
  const vatBase = round2(cifValue + dutyAmount + exciseAmount);
  const vatAmount = round2(vatBase * vatRate);

  const totalDutiesAndTaxes = round2(dutyAmount + exciseAmount + vatAmount);
  const totalLandedCost = round2(cifValue + totalDutiesAndTaxes);
  const effectiveTotalRatePercent =
    cifValue > 0 ? round2((totalDutiesAndTaxes / cifValue) * 100) : 0;

  return {
    cifValue,
    currency,
    dutyRate,
    dutyAmount,
    exciseRate,
    exciseAmount,
    vatBase,
    vatRate,
    vatAmount,
    totalDutiesAndTaxes,
    totalLandedCost,
    effectiveTotalRatePercent,
  };
}

// ---------------------------------------------------------------------------
// 8. URL Query Params Serialization & Deserialization
// ---------------------------------------------------------------------------

/**
 * Serializes HS converter state to URL query parameters string.
 */
export function serializeHsState(state: HsToolState): string {
  const params = new URLSearchParams();

  if (state.query && state.query.trim()) {
    params.set('q', state.query.trim());
  }
  if (state.jurisdiction) {
    params.set('jur', state.jurisdiction);
  }
  if (state.cifValue !== undefined && !isNaN(state.cifValue) && state.cifValue > 0) {
    params.set('cif', String(state.cifValue));
  }
  if (state.selectedCode && state.selectedCode.trim()) {
    params.set('code', normalizeHsCode(state.selectedCode));
  }

  return params.toString();
}

/**
 * Deserializes HS converter state from URL query parameters string or URLSearchParams.
 */
export function deserializeHsState(
  queryString?: string | URLSearchParams | null
): HsToolState {
  const result: HsToolState = {};
  if (!queryString) return result;

  let params: URLSearchParams;
  if (typeof queryString === 'string') {
    const raw = queryString.startsWith('?') ? queryString.slice(1) : queryString;
    try {
      params = new URLSearchParams(raw);
    } catch {
      return result;
    }
  } else {
    params = queryString;
  }

  const q = params.get('q') || params.get('query');
  if (q && q.trim()) {
    result.query = q.trim();
  }

  const jur = params.get('jur') || params.get('jurisdiction');
  if (jur === 'AE' || jur === 'SA' || jur === 'GCC') {
    result.jurisdiction = jur as Jurisdiction;
  }

  const cif = params.get('cif') || params.get('cifValue');
  if (cif && !isNaN(Number(cif))) {
    const num = Number(cif);
    if (num >= 0) {
      result.cifValue = num;
    }
  }

  const code = params.get('code') || params.get('selectedCode') || params.get('hsCode');
  if (code && code.trim()) {
    result.selectedCode = normalizeHsCode(code);
  }

  return result;
}
