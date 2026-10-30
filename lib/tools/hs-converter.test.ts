import { describe, it, expect } from 'vitest';
import {
  normalizeHsCode,
  formatHsCode,
  searchTariff,
  getTariffEntry,
  convert8to12,
  calculateDutyAndTaxes,
  serializeHsState,
  deserializeHsState,
  TARIFF_DATASET,
  TARIFF_DATASET_META,
} from './hs-converter';

describe('HS Code Normalization & Formatting', () => {
  it('strips dots, spaces, hyphens and non-numeric characters', () => {
    expect(normalizeHsCode('8471.30.00')).toBe('84713000');
    expect(normalizeHsCode('3901.10.10.0000')).toBe('390110100000');
    expect(normalizeHsCode(' 0904.11-00 ')).toBe('09041100');
    expect(normalizeHsCode('8471 30')).toBe('847130');
    expect(normalizeHsCode('')).toBe('');
    expect(normalizeHsCode(null as unknown as string)).toBe('');
  });

  it('formats 6-digit codes as XXXX.XX', () => {
    expect(formatHsCode('847130')).toBe('8471.30');
    expect(formatHsCode('8471.30')).toBe('8471.30');
    expect(formatHsCode('090411')).toBe('0904.11');
  });

  it('formats 8-digit codes as XXXX.XX.XX', () => {
    expect(formatHsCode('84713000')).toBe('8471.30.00');
    expect(formatHsCode('39011010')).toBe('3901.10.10');
    expect(formatHsCode('0904.11.00')).toBe('0904.11.00');
  });

  it('formats 12-digit codes as XXXX.XX.XX.XXXX', () => {
    expect(formatHsCode('390110100000')).toBe('3901.10.10.0000');
    expect(formatHsCode('847130000001')).toBe('8471.30.00.0001');
    expect(formatHsCode('0904.11.00.0000')).toBe('0904.11.00.0000');
  });

  it('handles short codes gracefully', () => {
    expect(formatHsCode('8471')).toBe('8471');
    expect(formatHsCode('09')).toBe('09');
    expect(formatHsCode('')).toBe('');
  });
});

describe('Tariff Search Engine', () => {
  it('searches by numeric code prefix', () => {
    const results = searchTariff('8471');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.hsCode.startsWith('8471'))).toBe(true);
  });

  it('searches by exact formatted code', () => {
    const results = searchTariff('8471.30.00');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].hsCode).toBe('84713000');
  });

  it('searches by English commodity keyword (case-insensitive)', () => {
    const laptops = searchTariff('laptop');
    expect(laptops.length).toBeGreaterThan(0);
    expect(laptops[0].descriptionEn.toLowerCase()).toContain('laptop');

    const polymers = searchTariff('polyethylene');
    expect(polymers.length).toBeGreaterThan(0);
    expect(polymers[0].hsCode).toBe('39011010');

    const gold = searchTariff('gold');
    expect(gold.length).toBeGreaterThan(0);
    expect(gold.some((r) => r.hsCode === '71081200')).toBe(true);
  });

  it('searches by Arabic commodity description', () => {
    const arabicLaptops = searchTariff('حاسوب');
    expect(arabicLaptops.length).toBeGreaterThan(0);
    expect(arabicLaptops[0].descriptionAr).toContain('حواسيب');

    const arabicSpices = searchTariff('فلفل');
    expect(arabicSpices.length).toBeGreaterThan(0);
    expect(arabicSpices[0].hsCode).toBe('09041100');

    const arabicGold = searchTariff('ذهب');
    expect(arabicGold.length).toBeGreaterThan(0);
    expect(arabicGold.some((r) => r.hsCode === '71081200')).toBe(true);
  });

  it('matches keywords located within national subdivisions', () => {
    const lldpe = searchTariff('LLDPE');
    expect(lldpe.length).toBeGreaterThan(0);
    expect(lldpe[0].hsCode).toBe('39011010');

    const shamsDubai = searchTariff('Shams Dubai');
    expect(shamsDubai.length).toBeGreaterThan(0);
    expect(shamsDubai[0].hsCode).toBe('85414300');
  });

  it('applies jurisdiction filtering and result limit', () => {
    const all = searchTariff('', { limit: 5 });
    expect(all.length).toBe(5);

    const gccOnly = searchTariff('', { jurisdiction: 'GCC', exactJurisdiction: true });
    expect(gccOnly.every((r) => r.jurisdiction === 'GCC')).toBe(true);
  });

  it('retrieves single entry via getTariffEntry', () => {
    const entry = getTariffEntry('84713000');
    expect(entry).toBeDefined();
    expect(entry?.formattedCode).toBe('8471.30.00');

    const nonExistent = getTariffEntry('00000000');
    expect(nonExistent).toBeUndefined();
  });
});

describe('8-to-12 Digit Correlation Converter', () => {
  it('expands 8-digit GCC line to 12-digit UAE lines', () => {
    const lines = convert8to12('84713000', 'AE');
    expect(lines).not.toBeNull();
    expect(Array.isArray(lines)).toBe(true);
    expect(lines!.length).toBeGreaterThan(0);

    const first = lines![0];
    expect(first.digits).toBe(12);
    expect(first.jurisdiction).toBe('AE');
    expect(first.hsCode).toBe('847130000000');
    expect(first.formattedCode).toBe('8471.30.00.0000');
    expect(first.dutyRate).toBe(0); // ITA exempt
    expect(first.vatRate).toBe(0.05); // UAE 5% VAT
    expect(first.sourceCitation).toContain('Dubai Customs Notice');
  });

  it('expands 8-digit GCC line to 12-digit Saudi Arabia lines', () => {
    const lines = convert8to12('84713000', 'SA');
    expect(lines).not.toBeNull();
    expect(lines!.length).toBeGreaterThan(0);

    const first = lines![0];
    expect(first.digits).toBe(12);
    expect(first.jurisdiction).toBe('SA');
    expect(first.hsCode).toBe('847130000001');
    expect(first.formattedCode).toBe('8471.30.00.0001');
    expect(first.dutyRate).toBe(0); // ITA exempt
    expect(first.vatRate).toBe(0.15); // KSA 15% VAT
    expect(first.sourceCitation).toContain('ZATCA');
  });

  it('converts plastics (Chapter 39) with national specifications', () => {
    const aePlastics = convert8to12('3901.10.10', 'AE');
    expect(aePlastics).not.toBeNull();
    expect(aePlastics![0].hsCode).toBe('390110100000');
    expect(aePlastics![0].vatRate).toBe(0.05);

    const saPlastics = convert8to12('3901.10.10', 'SA');
    expect(saPlastics).not.toBeNull();
    expect(saPlastics![0].hsCode).toBe('390110100001');
    expect(saPlastics![0].vatRate).toBe(0.15);
  });

  it('returns null for uncatalogued HS codes', () => {
    expect(convert8to12('99999999', 'AE')).toBeNull();
    expect(convert8to12('', 'SA')).toBeNull();
    expect(convert8to12('12', 'AE')).toBeNull();
  });
});

describe('Duty & Taxes Calculation Engine', () => {
  it('calculates standard 5% duty and 5% UAE VAT', () => {
    const result = calculateDutyAndTaxes({
      cifValue: 10000,
      dutyRate: 0.05,
      vatRate: 0.05,
    });

    expect(result.cifValue).toBe(10000);
    expect(result.dutyAmount).toBe(500); // 10000 * 0.05
    expect(result.exciseAmount).toBe(0);
    expect(result.vatBase).toBe(10500); // 10000 + 500
    expect(result.vatAmount).toBe(525); // 10500 * 0.05
    expect(result.totalDutiesAndTaxes).toBe(1025); // 500 + 525
    expect(result.totalLandedCost).toBe(11025); // 10000 + 1025
    expect(result.effectiveTotalRatePercent).toBe(10.25);
  });

  it('calculates duty-exempt (0%) goods with UAE VAT', () => {
    const result = calculateDutyAndTaxes({
      cifValue: 20000,
      currency: 'AED',
      dutyRate: 0,
      vatRate: 0.05,
    });

    expect(result.dutyAmount).toBe(0);
    expect(result.exciseAmount).toBe(0);
    expect(result.vatBase).toBe(20000);
    expect(result.vatAmount).toBe(1000);
    expect(result.totalDutiesAndTaxes).toBe(1000);
    expect(result.totalLandedCost).toBe(21000);
    expect(result.effectiveTotalRatePercent).toBe(5);
  });

  it('calculates standard duty with Saudi Arabia 15% VAT', () => {
    const result = calculateDutyAndTaxes({
      cifValue: 10000,
      currency: 'SAR',
      dutyRate: 0.05,
      vatRate: 0.15,
    });

    expect(result.dutyAmount).toBe(500);
    expect(result.vatBase).toBe(10500);
    expect(result.vatAmount).toBe(1575); // 10500 * 0.15
    expect(result.totalDutiesAndTaxes).toBe(2075);
    expect(result.totalLandedCost).toBe(12075);
    expect(result.effectiveTotalRatePercent).toBe(20.75);
  });

  it('calculates compound excise tax (100% on energy drinks) before VAT', () => {
    // Under GCC unified excise tax rules, excise applies on (CIF + Customs Duty)
    const result = calculateDutyAndTaxes({
      cifValue: 10000,
      dutyRate: 0.05,
      exciseRate: 1.00,
      vatRate: 0.05,
    });

    expect(result.dutyAmount).toBe(500);
    expect(result.exciseAmount).toBe(10500); // (10000 + 500) * 1.00
    expect(result.vatBase).toBe(21000); // 10000 + 500 + 10500
    expect(result.vatAmount).toBe(1050); // 21000 * 0.05
    expect(result.totalDutiesAndTaxes).toBe(12050); // 500 + 10500 + 1050
    expect(result.totalLandedCost).toBe(22050);
    expect(result.effectiveTotalRatePercent).toBe(120.5);
  });

  it('handles zero or negative CIF values gracefully', () => {
    const result = calculateDutyAndTaxes({
      cifValue: 0,
      dutyRate: 0.05,
      vatRate: 0.05,
    });

    expect(result.dutyAmount).toBe(0);
    expect(result.vatAmount).toBe(0);
    expect(result.totalDutiesAndTaxes).toBe(0);
    expect(result.totalLandedCost).toBe(0);
    expect(result.effectiveTotalRatePercent).toBe(0);
  });
});

describe('Dataset Metadata & Integrity', () => {
  it('exposes correct dataset metadata according to RES-03', () => {
    expect(TARIFF_DATASET_META.version).toBe('2026.1');
    expect(TARIFF_DATASET_META.updatedAt).toBe('2026-10-28');
    expect(TARIFF_DATASET_META.sources).toHaveLength(2);
    expect(TARIFF_DATASET_META.disclaimerEn).toBeTruthy();
    expect(TARIFF_DATASET_META.disclaimerAr).toBeTruthy();

    const uaeSource = TARIFF_DATASET_META.sources.find((s) => s.name.includes('UAE'));
    expect(uaeSource?.legalBasis).toContain('Notice No. 10/2025');

    const saSource = TARIFF_DATASET_META.sources.find((s) => s.name.includes('Saudi'));
    expect(saSource?.legalBasis).toContain('1447-88-5');
  });

  it('covers all mandated GCC trade chapters', () => {
    const chapters = new Set(TARIFF_DATASET.map((entry) => entry.hsCode.slice(0, 2)));

    // Chapter 09: Spices
    expect(chapters.has('09')).toBe(true);
    // Chapter 27: Mineral Fuels & Oils
    expect(chapters.has('27')).toBe(true);
    // Chapter 39: Plastics & Polymers
    expect(chapters.has('39')).toBe(true);
    // Chapter 71: Precious Metals & Jewellery
    expect(chapters.has('71')).toBe(true);
    // Chapter 72/73: Iron & Steel & Articles
    expect(chapters.has('72') || chapters.has('73')).toBe(true);
    // Chapter 84: Machinery & Mechanical Appliances
    expect(chapters.has('84')).toBe(true);
    // Chapter 85: Electrical Machinery & Electronics
    expect(chapters.has('85')).toBe(true);
    // Chapter 87: Motor Vehicles & Parts
    expect(chapters.has('87')).toBe(true);
  });

  it('contains no duplicate HS codes within the same jurisdiction', () => {
    const seen = new Set<string>();
    for (const entry of TARIFF_DATASET) {
      const key = `${entry.jurisdiction}:${entry.hsCode}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);

      // Check within nationalSubdivisions as well
      if (entry.nationalSubdivisions) {
        const subSeen = new Set<string>();
        for (const sub of entry.nationalSubdivisions) {
          const subKey = `${sub.jurisdiction}:${sub.code12}`;
          expect(subSeen.has(subKey)).toBe(false);
          subSeen.add(subKey);
        }
      }
    }
  });

  it('verifies all required fields on every dataset entry', () => {
    for (const entry of TARIFF_DATASET) {
      expect(entry.hsCode).toMatch(/^\d{6,12}$/);
      expect(entry.formattedCode).toBeTruthy();
      expect(['AE', 'SA', 'GCC']).toContain(entry.jurisdiction);
      expect([6, 8, 12]).toContain(entry.digits);
      expect(entry.descriptionEn.trim().length).toBeGreaterThan(0);
      expect(entry.descriptionAr.trim().length).toBeGreaterThan(0);
      expect(typeof entry.dutyRate).toBe('number');
      expect(['ad_valorem', 'exempt', 'specific', 'prohibited']).toContain(entry.dutyType);
      expect(typeof entry.vatRate).toBe('number');
      expect(typeof entry.restricted).toBe('boolean');
      expect(entry.effectiveDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(entry.sourceCitation.trim().length).toBeGreaterThan(0);

      if (entry.nationalSubdivisions) {
        for (const sub of entry.nationalSubdivisions) {
          expect(sub.code12).toMatch(/^\d{12}$/);
          expect(sub.formattedCode).toMatch(/^\d{4}\.\d{2}\.\d{2}\.\d{4}$/);
          expect(['AE', 'SA']).toContain(sub.jurisdiction);
          expect(sub.descriptionEn.trim().length).toBeGreaterThan(0);
          expect(sub.descriptionAr.trim().length).toBeGreaterThan(0);
          expect(typeof sub.dutyRate).toBe('number');
          expect(['ad_valorem', 'exempt', 'specific']).toContain(sub.dutyType);
          expect(typeof sub.vatRate).toBe('number');
        }
      }
    }
  });
});

describe('URL State Serialization & Deserialization', () => {
  it('serializes state into query string', () => {
    const qs = serializeHsState({
      query: 'laptop',
      jurisdiction: 'AE',
      cifValue: 5000,
      selectedCode: '8471.30.00',
    });

    expect(qs).toContain('q=laptop');
    expect(qs).toContain('jur=AE');
    expect(qs).toContain('cif=5000');
    expect(qs).toContain('code=84713000');
  });

  it('deserializes state from query string', () => {
    const state = deserializeHsState('?q=laptop&jur=SA&cif=12000&code=84713000');
    expect(state.query).toBe('laptop');
    expect(state.jurisdiction).toBe('SA');
    expect(state.cifValue).toBe(12000);
    expect(state.selectedCode).toBe('84713000');
  });

  it('performs roundtrip serialization-deserialization', () => {
    const original = {
      query: 'polyethylene',
      jurisdiction: 'AE' as const,
      cifValue: 25000,
      selectedCode: '39011010',
    };

    const serialized = serializeHsState(original);
    const deserialized = deserializeHsState(serialized);

    expect(deserialized.query).toBe(original.query);
    expect(deserialized.jurisdiction).toBe(original.jurisdiction);
    expect(deserialized.cifValue).toBe(original.cifValue);
    expect(deserialized.selectedCode).toBe(original.selectedCode);
  });

  it('handles empty or malformed inputs without throwing', () => {
    expect(deserializeHsState('')).toEqual({});
    expect(deserializeHsState(null)).toEqual({});
    expect(deserializeHsState('???&&&')).toEqual({});
    expect(deserializeHsState('?cif=invalid&jur=UNKNOWN')).toEqual({});
  });
});
