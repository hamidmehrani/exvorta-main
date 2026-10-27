import { describe, it, expect } from 'vitest';
import {
  calculateLineTotal,
  calculateDocTotals,
  formatCurrency,
  formatWeight,
  getVisibleFields,
  isFieldVisible,
  DOC_TRANSLATIONS,
  getTranslation,
  createEmptyLineItem,
  createDefaultDoc,
  type DocLineItem,
  type DocType,
} from './docgen';

describe('docgen: calculateLineTotal', () => {
  it('calculates standard integer multiplication', () => {
    const item: DocLineItem = {
      id: '1',
      description: 'Test Item',
      quantity: 5,
      unit: 'PCS',
      unitPrice: 20,
    };
    expect(calculateLineTotal(item)).toBe(100);
  });

  it('calculates decimal quantities and prices accurately', () => {
    const item: DocLineItem = {
      id: '2',
      description: 'Grain Bags',
      quantity: 2.5,
      unit: 'MT',
      unitPrice: 19.99,
    };
    // 2.5 * 19.99 = 49.975 -> 49.98
    expect(calculateLineTotal(item)).toBe(49.98);
  });

  it('handles zero quantity', () => {
    const item: DocLineItem = {
      id: '3',
      description: 'Zero Qty',
      quantity: 0,
      unit: 'PCS',
      unitPrice: 150,
    };
    expect(calculateLineTotal(item)).toBe(0);
  });

  it('handles zero unit price', () => {
    const item: DocLineItem = {
      id: '4',
      description: 'Sample Free Item',
      quantity: 10,
      unit: 'PCS',
      unitPrice: 0,
    };
    expect(calculateLineTotal(item)).toBe(0);
  });

  it('safely handles negative inputs by clamping to 0', () => {
    const itemNegativeQty: DocLineItem = {
      id: '5',
      description: 'Negative Qty',
      quantity: -5,
      unit: 'PCS',
      unitPrice: 20,
    };
    expect(calculateLineTotal(itemNegativeQty)).toBe(0);

    const itemNegativePrice: DocLineItem = {
      id: '6',
      description: 'Negative Price',
      quantity: 5,
      unit: 'PCS',
      unitPrice: -20,
    };
    expect(calculateLineTotal(itemNegativePrice)).toBe(0);
  });

  it('safely handles null/undefined inputs', () => {
    expect(calculateLineTotal(undefined as unknown as DocLineItem)).toBe(0);
    expect(calculateLineTotal({} as unknown as DocLineItem)).toBe(0);
  });
});

describe('docgen: calculateDocTotals', () => {
  it('returns zero totals when items array is empty or undefined', () => {
    const emptyTotals = calculateDocTotals([]);
    expect(emptyTotals).toEqual({
      subtotal: 0,
      discount: 0,
      tax: 0,
      shippingFee: 0,
      grandTotal: 0,
      totalQuantity: 0,
      totalNetWeight: 0,
      totalGrossWeight: 0,
      totalPackages: 0,
      totalVolumeCbm: 0,
    });

    const undefinedTotals = calculateDocTotals(undefined as unknown as DocLineItem[]);
    expect(undefinedTotals.grandTotal).toBe(0);
  });

  it('calculates totals for a single item without extra options', () => {
    const items: DocLineItem[] = [
      {
        id: '1',
        description: 'Industrial Valve',
        quantity: 4,
        unit: 'PCS',
        unitPrice: 50,
        netWeightKg: 20,
        grossWeightKg: 25,
        packagesCount: 2,
        volumeCbm: 0.15,
      },
    ];

    const totals = calculateDocTotals(items);
    expect(totals.subtotal).toBe(200);
    expect(totals.discount).toBe(0);
    expect(totals.tax).toBe(0);
    expect(totals.shippingFee).toBe(0);
    expect(totals.grandTotal).toBe(200);
    expect(totals.totalQuantity).toBe(4);
    expect(totals.totalNetWeight).toBe(20);
    expect(totals.totalGrossWeight).toBe(25);
    expect(totals.totalPackages).toBe(2);
    expect(totals.totalVolumeCbm).toBe(0.15);
  });

  it('calculates totals for multiple items with discounts, taxes, and shipping fee', () => {
    const items: DocLineItem[] = [
      {
        id: '1',
        description: 'Item A',
        quantity: 10,
        unit: 'PCS',
        unitPrice: 20, // 200
        netWeightKg: 50,
        grossWeightKg: 60,
        packagesCount: 5,
        volumeCbm: 0.5,
      },
      {
        id: '2',
        description: 'Item B',
        quantity: 5,
        unit: 'PCS',
        unitPrice: 15.5, // 77.5
        netWeightKg: 25,
        grossWeightKg: 30,
        packagesCount: 3,
        volumeCbm: 0.3,
      },
    ];

    // Subtotal: 200 + 77.5 = 277.50
    // Discount: 27.50
    // Taxable Subtotal: 277.50 - 27.50 = 250.00
    // Tax (10% VAT): 250.00 * 0.10 = 25.00
    // Shipping: 50.00
    // Grand Total: 250.00 + 25.00 + 50.00 = 325.00
    const totals = calculateDocTotals(items, {
      discount: 27.5,
      taxRate: 10,
      shippingFee: 50,
    });

    expect(totals.subtotal).toBe(277.5);
    expect(totals.discount).toBe(27.5);
    expect(totals.tax).toBe(25);
    expect(totals.shippingFee).toBe(50);
    expect(totals.grandTotal).toBe(325);
    expect(totals.totalQuantity).toBe(15);
    expect(totals.totalNetWeight).toBe(75);
    expect(totals.totalGrossWeight).toBe(90);
    expect(totals.totalPackages).toBe(8);
    expect(totals.totalVolumeCbm).toBe(0.8);
  });

  it('handles discount exceeding subtotal gracefully', () => {
    const items: DocLineItem[] = [
      {
        id: '1',
        description: 'Promo item',
        quantity: 1,
        unit: 'PCS',
        unitPrice: 50,
      },
    ];

    const totals = calculateDocTotals(items, {
      discount: 100, // exceeds subtotal 50
      taxRate: 15,
      shippingFee: 20,
    });

    expect(totals.subtotal).toBe(50);
    expect(totals.discount).toBe(100);
    expect(totals.tax).toBe(0); // taxable subtotal is 0
    expect(totals.shippingFee).toBe(20);
    expect(totals.grandTotal).toBe(20); // 0 taxable + 0 tax + 20 shipping
  });

  it('safely handles negative options by clamping them to 0', () => {
    const items: DocLineItem[] = [
      {
        id: '1',
        description: 'Test item',
        quantity: 2,
        unit: 'PCS',
        unitPrice: 50,
      },
    ];

    const totals = calculateDocTotals(items, {
      discount: -10,
      taxRate: -5,
      shippingFee: -20,
    });

    expect(totals.subtotal).toBe(100);
    expect(totals.discount).toBe(0);
    expect(totals.tax).toBe(0);
    expect(totals.shippingFee).toBe(0);
    expect(totals.grandTotal).toBe(100);
  });
});

describe('docgen: physical aggregations and formatWeight', () => {
  it('aggregates physical metrics across items with missing/undefined fields', () => {
    const items: DocLineItem[] = [
      {
        id: '1',
        description: 'Item with weight',
        quantity: 2,
        unit: 'BOX',
        unitPrice: 10,
        netWeightKg: 100,
        grossWeightKg: 110,
        packagesCount: 2,
        volumeCbm: 0.4,
      },
      {
        id: '2',
        description: 'Item with partial data',
        quantity: 3,
        unit: 'BOX',
        unitPrice: 10,
        // no netWeightKg, no volumeCbm
        grossWeightKg: 150,
        packagesCount: 3,
      },
    ];

    const totals = calculateDocTotals(items);
    expect(totals.totalNetWeight).toBe(100);
    expect(totals.totalGrossWeight).toBe(260);
    expect(totals.totalPackages).toBe(5);
    expect(totals.totalVolumeCbm).toBe(0.4);
  });

  it('formats weight in kilograms (KG)', () => {
    expect(formatWeight(1500)).toBe('1,500.00 KG');
    expect(formatWeight(1500, 'kg')).toBe('1,500.00 KG');
    expect(formatWeight(0)).toBe('0.00 KG');
  });

  it('formats weight in metric tons (MT)', () => {
    expect(formatWeight(1000, 'mt')).toBe('1.00 MT');
    expect(formatWeight(2500, 'mt')).toBe('2.50 MT');
    expect(formatWeight(1234.5, 'mt')).toBe('1.235 MT');
  });

  it('handles negative or invalid weight gracefully', () => {
    expect(formatWeight(-100)).toBe('0.00 KG');
    expect(formatWeight(Number.NaN)).toBe('0.00 KG');
  });
});

describe('docgen: formatCurrency', () => {
  it('formats currency in English (LTR)', () => {
    const usd = formatCurrency(1234.5, 'USD', 'en');
    expect(usd).toContain('1,234.50');
    expect(usd).toMatch(/\$|USD/);

    const eur = formatCurrency(2500, 'EUR', 'en');
    expect(eur).toContain('2,500.00');
    expect(eur).toMatch(/€|EUR/);

    const aed = formatCurrency(500, 'AED', 'en');
    expect(aed).toContain('500.00');
    expect(aed).toContain('AED');
  });

  it('formats currency in Arabic (RTL)', () => {
    const aed = formatCurrency(1234.5, 'AED', 'ar');
    expect(aed).toContain('1,234.50');
    // Arabic formatted AED will include UAE dirham symbol د.إ or AED
    expect(aed).toMatch(/د\.إ|AED/);

    const sar = formatCurrency(750, 'SAR', 'ar');
    expect(sar).toContain('750.00');
    expect(sar).toMatch(/ر\.س|SAR/);
  });

  it('formats custom or unrecognized currency codes without throwing', () => {
    const customEn = formatCurrency(100, 'CUSTOM', 'en');
    expect(customEn).toBe('CUSTOM 100.00');

    const customAr = formatCurrency(100, 'CUSTOM', 'ar');
    expect(customAr).toBe('100.00 CUSTOM');
  });

  it('formats negative amounts and zero safely', () => {
    const zero = formatCurrency(0, 'USD', 'en');
    expect(zero).toContain('0.00');

    const negative = formatCurrency(-50, 'USD', 'en');
    expect(negative).toContain('50.00');
    expect(negative).toContain('-');
  });
});

describe('docgen: getVisibleFields and per-document rules', () => {
  it('enforces rules for Commercial Invoice', () => {
    const visible = getVisibleFields('commercial-invoice');

    // Pricing & payment are visible
    expect(visible.prices).toBe(true);
    expect(visible.lineTotals).toBe(true);
    expect(visible.subtotal).toBe(true);
    expect(visible.taxes).toBe(true);
    expect(visible.grandTotal).toBe(true);
    expect(visible.incoterms).toBe(true);
    expect(visible.paymentTerms).toBe(true);

    // Packing details are not primarily displayed
    expect(visible.packageCounts).toBe(false);
    expect(visible.netWeights).toBe(false);
    expect(visible.grossWeights).toBe(false);
    expect(visible.volumes).toBe(false);

    // CMR boxes are false
    expect(visible.cmrBoxes).toBe(false);

    // helper functions match
    expect(visible.hasField('prices')).toBe(true);
    expect(isFieldVisible('commercial-invoice', 'prices')).toBe(true);
    expect(isFieldVisible('commercial-invoice', 'grossWeights')).toBe(false);
  });

  it('enforces rules for Packing List', () => {
    const visible = getVisibleFields('packing-list');

    // Pricing is excluded
    expect(visible.prices).toBe(false);
    expect(visible.lineTotals).toBe(false);
    expect(visible.subtotal).toBe(false);
    expect(visible.taxes).toBe(false);
    expect(visible.grandTotal).toBe(false);
    expect(visible.paymentTerms).toBe(false);

    // Physical and package attributes are visible
    expect(visible.packageCounts).toBe(true);
    expect(visible.packageTypes).toBe(true);
    expect(visible.netWeights).toBe(true);
    expect(visible.grossWeights).toBe(true);
    expect(visible.volumes).toBe(true);
    expect(visible.hsCodes).toBe(true);

    // CMR boxes are false
    expect(visible.cmrBoxes).toBe(false);

    expect(isFieldVisible('packing-list', 'packageCounts')).toBe(true);
    expect(isFieldVisible('packing-list', 'prices')).toBe(false);
  });

  it('enforces rules for CMR Consignment Note', () => {
    const visible = getVisibleFields('cmr');

    // CMR Convention boxes are visible
    expect(visible.cmrBoxes).toBe(true);
    expect(visible.senderBox1).toBe(true);
    expect(visible.consigneeBox2).toBe(true);
    expect(visible.deliveryPlaceBox3).toBe(true);
    expect(visible.takingOverPlaceBox4).toBe(true);
    expect(visible.attachedDocsBox5).toBe(true);
    expect(visible.goodsMarksAndNumbersBox6to9).toBe(true);
    expect(visible.grossWeightBox11).toBe(true);
    expect(visible.volumeBox12).toBe(true);
    expect(visible.carrierInstructionsBox13).toBe(true);
    expect(visible.carrierDetailsBox16).toBe(true);

    // Pricing is excluded on standard CMR
    expect(visible.prices).toBe(false);
    expect(visible.grandTotal).toBe(false);

    expect(isFieldVisible('cmr', 'senderBox1')).toBe(true);
    expect(isFieldVisible('cmr', 'carrierDetailsBox16')).toBe(true);
    expect(isFieldVisible('cmr', 'prices')).toBe(false);
  });
});

describe('docgen: Bilingual Dictionary completeness and translations', () => {
  it('ensures all keys in English dictionary exist in Arabic dictionary with non-empty strings', () => {
    const enKeys = Object.keys(DOC_TRANSLATIONS.en) as Array<keyof typeof DOC_TRANSLATIONS.en>;
    const arKeys = Object.keys(DOC_TRANSLATIONS.ar) as Array<keyof typeof DOC_TRANSLATIONS.ar>;

    expect(arKeys.sort()).toEqual(enKeys.sort());

    for (const key of enKeys) {
      const enVal = DOC_TRANSLATIONS.en[key];
      const arVal = DOC_TRANSLATIONS.ar[key];

      expect(typeof enVal).toBe('string');
      expect(enVal.trim().length).toBeGreaterThan(0);

      expect(typeof arVal).toBe('string');
      expect(arVal.trim().length).toBeGreaterThan(0);
    }
  });

  it('translates document titles correctly', () => {
    expect(getTranslation('commercialInvoiceTitle', 'en')).toBe('Commercial Invoice');
    expect(getTranslation('commercialInvoiceTitle', 'ar')).toBe('الفاتورة التجارية');

    expect(getTranslation('packingListTitle', 'en')).toBe('Packing List');
    expect(getTranslation('packingListTitle', 'ar')).toBe('قائمة التعبئة');

    expect(getTranslation('cmrTitle', 'en')).toBe('CMR International Consignment Note');
    expect(getTranslation('cmrTitle', 'ar')).toBe('وثيقة النقل البري الدولي (CMR)');
  });

  it('contains the specified footer notice branding', () => {
    expect(DOC_TRANSLATIONS.en.footerNoticeShort).toBe('Issued via Exvorta');
    expect(DOC_TRANSLATIONS.ar.footerNotice).toBe('صادر عبر إكسبورتا - exvorta.com');
  });

  it('translates table headers, parties, and totals properly', () => {
    expect(getTranslation('description', 'ar')).toBe('بيان البضاعة');
    expect(getTranslation('hsCode', 'ar')).toBe('الرمز المنسق (HS Code)');
    expect(getTranslation('sellerExporter', 'ar')).toBe('البائع / المصدر');
    expect(getTranslation('buyerConsignee', 'ar')).toBe('المشتري / المرسل إليه');
    expect(getTranslation('grandTotal', 'ar')).toBe('الإجمالي الكلي');
    expect(getTranslation('subtotal', 'ar')).toBe('المجموع الفرعي');
  });
});

describe('docgen: Factory helpers and structural validation', () => {
  it('creates an empty line item with valid defaults and unique IDs', () => {
    const item1 = createEmptyLineItem();
    const item2 = createEmptyLineItem();

    expect(item1.id).toBeDefined();
    expect(item2.id).toBeDefined();
    expect(item1.id).not.toBe(item2.id);
    expect(item1.quantity).toBe(1);
    expect(item1.unit).toBe('PCS');
    expect(item1.unitPrice).toBe(0);
  });

  it('creates default documents for all three supported document types', () => {
    const types: DocType[] = ['commercial-invoice', 'packing-list', 'cmr'];

    for (const docType of types) {
      const doc = createDefaultDoc(docType);
      expect(doc.docType).toBe(docType);
      expect(doc.currency).toBe('USD');
      expect(doc.items.length).toBe(1);
      expect(doc.seller).toBeDefined();
      expect(doc.buyer).toBeDefined();
      expect(doc.carrier).toBeDefined();
    }
  });
});
