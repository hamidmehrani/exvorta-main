/**
 * Pure TypeScript document generation engine for international trade documents:
 * - Commercial Invoice (الفاتورة التجارية)
 * - Packing List (قائمة التعبئة)
 * - CMR International Consignment Note (وثيقة النقل البري الدولي)
 *
 * Supports bilingual English (LTR) and Arabic (RTL) workflows with zero external runtime dependencies.
 */

// ============================================================================
// Types & Interfaces
// ============================================================================

export type DocType = 'commercial-invoice' | 'packing-list' | 'cmr';
export type DocLang = 'en' | 'ar';

export const INCOTERMS = [
  'FOB',
  'CIF',
  'EXW',
  'CFR',
  'DDP',
  'FCA',
  'CPT',
  'CIP',
  'DAP',
  'DPU',
] as const;

export type Incoterm = typeof INCOTERMS[number];

export const COMMON_UNITS = [
  'PCS',
  'KG',
  'BOX',
  'PALLET',
  'MT',
  'CTN',
] as const;

export const COMMON_CURRENCIES = [
  'USD',
  'EUR',
  'AED',
  'SAR',
  'GBP',
  'CNY',
  'TRY',
] as const;

export interface DocParty {
  name: string;
  address: string;
  taxId?: string;
  country: string;
  phone?: string;
  email?: string;
}

export interface DocCarrierParty {
  name?: string;
  address?: string;
  vehicleReg?: string;
  driverName?: string;
}

// Aliases for convenience
export type Party = DocParty;
export type CarrierParty = DocCarrierParty;
export type DocCarrier = DocCarrierParty;

export interface DocLogistics {
  origin: string;
  destination: string;
  vesselOrFlightOrVehicle?: string;
  blOrAwbOrConsignmentNo?: string;
  incoterm?: string;
  incotermLocation?: string;
}

export interface DocLineItem {
  id: string;
  description: string;
  hsCode?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  netWeightKg?: number;
  grossWeightKg?: number;
  packagesCount?: number;
  packageType?: string;
  volumeCbm?: number;
}

export interface DocTotalsOptions {
  taxRate?: number;
  shippingFee?: number;
  discount?: number;
}

export interface DocTotals {
  subtotal: number;
  discount: number;
  tax: number;
  shippingFee: number;
  grandTotal: number;
  totalQuantity: number;
  totalNetWeight: number;
  totalGrossWeight: number;
  totalPackages: number;
  totalVolumeCbm: number;
}

export interface ExportDocData {
  docType: DocType;
  docNumber: string;
  date: string;
  currency: string;
  incoterm: Incoterm | string;
  incotermLocation: string;
  seller: DocParty;
  buyer: DocParty;
  carrier?: DocCarrierParty;
  origin: string;
  destination: string;
  vesselOrFlightOrVehicle?: string;
  blOrAwbOrConsignmentNo?: string;
  paymentTerms?: string;
  notes?: string;
  items: DocLineItem[];
  options?: DocTotalsOptions;
}

export type DocData = ExportDocData;

export interface DocVisibleFields {
  // Pricing & Financials
  prices: boolean;
  lineTotals: boolean;
  subtotal: boolean;
  taxes: boolean;
  grandTotal: boolean;
  incoterms: boolean;
  paymentTerms: boolean;

  // Packing & Physicals
  packageCounts: boolean;
  packageTypes: boolean;
  netWeights: boolean;
  grossWeights: boolean;
  volumes: boolean;
  hsCodes: boolean;

  // Parties & Logistics
  seller: boolean;
  buyer: boolean;
  carrier: boolean;

  // CMR Consignment Note Convention Boxes
  cmrBoxes: boolean;
  senderBox1?: boolean;
  consigneeBox2?: boolean;
  deliveryPlaceBox3?: boolean;
  takingOverPlaceBox4?: boolean;
  attachedDocsBox5?: boolean;
  goodsMarksAndNumbersBox6to9?: boolean;
  grossWeightBox11?: boolean;
  volumeBox12?: boolean;
  carrierInstructionsBox13?: boolean;
  carrierDetailsBox16?: boolean;

  // Array of active field keys and checker helper
  fields: string[];
  hasField: (field: string) => boolean;
}

// ============================================================================
// Calculations & Formatting
// ============================================================================

/**
 * Rounds a number safely to 2 decimal places.
 */
function round2(val: number): number {
  return Math.round((val + 1e-9) * 100) / 100;
}

/**
 * Calculates line item total: quantity * unitPrice, rounded to 2 decimal places.
 * Negative inputs or invalid values are safely normalized to 0.
 */
export function calculateLineTotal(item: DocLineItem): number {
  if (!item) return 0;
  const qty = Math.max(0, Number(item.quantity) || 0);
  const price = Math.max(0, Number(item.unitPrice) || 0);
  return round2(qty * price);
}

/**
 * Calculates aggregated document totals, including subtotal, discount, tax,
 * shipping fee, grand total, and physical aggregates (weights, packages, volume).
 * Handles edge cases: negative inputs clamped to 0, undefined/empty values.
 */
export function calculateDocTotals(
  items: DocLineItem[] = [],
  options?: DocTotalsOptions,
): DocTotals {
  const safeItems = Array.isArray(items) ? items : [];

  let subtotal = 0;
  let totalQuantity = 0;
  let totalNetWeight = 0;
  let totalGrossWeight = 0;
  let totalPackages = 0;
  let totalVolumeCbm = 0;

  for (const item of safeItems) {
    if (!item) continue;
    const lineTotal = calculateLineTotal(item);
    subtotal += lineTotal;

    const qty = Math.max(0, Number(item.quantity) || 0);
    totalQuantity += qty;

    const net = Math.max(0, Number(item.netWeightKg) || 0);
    totalNetWeight += net;

    const gross = Math.max(0, Number(item.grossWeightKg) || 0);
    totalGrossWeight += gross;

    const pkgs = Math.max(0, Number(item.packagesCount) || 0);
    totalPackages += pkgs;

    const vol = Math.max(0, Number(item.volumeCbm) || 0);
    totalVolumeCbm += vol;
  }

  subtotal = round2(subtotal);
  totalQuantity = round2(totalQuantity);
  totalNetWeight = round2(totalNetWeight);
  totalGrossWeight = round2(totalGrossWeight);
  totalPackages = round2(totalPackages);
  totalVolumeCbm = Math.round((totalVolumeCbm + Number.EPSILON) * 1000) / 1000;

  const rawDiscount = Math.max(0, Number(options?.discount) || 0);
  const discount = round2(rawDiscount);

  // Taxable subtotal is subtotal after discount, clamped at 0
  const taxableSubtotal = Math.max(0, round2(subtotal - discount));

  // taxRate passed as a percentage (e.g. 5 for 5% or 15 for 15%)
  const taxRate = Math.max(0, Number(options?.taxRate) || 0);
  const tax = round2(taxableSubtotal * (taxRate / 100));

  const rawShipping = Math.max(0, Number(options?.shippingFee) || 0);
  const shippingFee = round2(rawShipping);

  // Grand total cannot be negative
  const grandTotal = Math.max(0, round2(taxableSubtotal + tax + shippingFee));

  return {
    subtotal,
    discount,
    tax,
    shippingFee,
    grandTotal,
    totalQuantity,
    totalNetWeight,
    totalGrossWeight,
    totalPackages,
    totalVolumeCbm,
  };
}

/**
 * Formats a currency amount with standard symbol/code and proper locale formatting.
 * Supports 'en' (LTR) and 'ar' (RTL).
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  lang: DocLang = 'en',
): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const currCode = (currency || 'USD').trim().toUpperCase();
  const locale = lang === 'ar' ? 'ar-AE' : 'en-US';

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(safeAmount);
  } catch {
    // Fallback for custom or unrecognized currency codes
    const formattedNum = Math.abs(safeAmount).toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const sign = safeAmount < 0 ? '-' : '';
    return lang === 'ar'
      ? `${sign}${formattedNum} ${currCode}`
      : `${sign}${currCode} ${formattedNum}`;
  }
}

/**
 * Formats weight in KG or converts to MT (Metric Tons, 1 MT = 1000 KG).
 */
export function formatWeight(kg: number, unit: 'kg' | 'mt' = 'kg'): string {
  const safeKg = Number.isFinite(kg) ? Math.max(0, kg) : 0;
  const isMt = unit?.toLowerCase() === 'mt';
  const val = isMt ? safeKg / 1000 : safeKg;
  const unitLabel = isMt ? 'MT' : 'KG';

  const formatted = val.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: isMt ? 3 : 2,
  });

  return `${formatted} ${unitLabel}`;
}

// ============================================================================
// Field Mapping & Per-Doc Rules
// ============================================================================

/**
 * Returns visibility rules and active fields for a given document type.
 * - Commercial Invoice: pricing, line totals, subtotal, taxes, grand total, incoterms, payment terms.
 * - Packing List: package counts, package types, net weights, gross weights, volumes, HS codes; pricing excluded.
 * - CMR Consignment Note: sender (Box 1), consignee (Box 2), delivery place (Box 3), taking over place/date (Box 4),
 *   attached docs (Box 5), marks/numbers (Box 6-9), gross weight (Box 11), volume (Box 12), carrier instructions (Box 13),
 *   carrier details (Box 16).
 */
export function getVisibleFields(docType: DocType): DocVisibleFields {
  switch (docType) {
    case 'commercial-invoice': {
      const fieldList = [
        'prices',
        'lineTotals',
        'subtotal',
        'taxes',
        'grandTotal',
        'incoterms',
        'paymentTerms',
        'seller',
        'buyer',
      ];
      return {
        prices: true,
        lineTotals: true,
        subtotal: true,
        taxes: true,
        grandTotal: true,
        incoterms: true,
        paymentTerms: true,
        packageCounts: false,
        packageTypes: false,
        netWeights: false,
        grossWeights: false,
        volumes: false,
        hsCodes: false,
        seller: true,
        buyer: true,
        carrier: false,
        cmrBoxes: false,
        fields: fieldList,
        hasField: (field: string) => fieldList.includes(field),
      };
    }

    case 'packing-list': {
      const fieldList = [
        'packageCounts',
        'packageTypes',
        'netWeights',
        'grossWeights',
        'volumes',
        'hsCodes',
        'incoterms',
        'seller',
        'buyer',
      ];
      return {
        prices: false,
        lineTotals: false,
        subtotal: false,
        taxes: false,
        grandTotal: false,
        incoterms: true,
        paymentTerms: false,
        packageCounts: true,
        packageTypes: true,
        netWeights: true,
        grossWeights: true,
        volumes: true,
        hsCodes: true,
        seller: true,
        buyer: true,
        carrier: false,
        cmrBoxes: false,
        fields: fieldList,
        hasField: (field: string) => fieldList.includes(field),
      };
    }

    case 'cmr': {
      const fieldList = [
        'cmrBoxes',
        'senderBox1',
        'consigneeBox2',
        'deliveryPlaceBox3',
        'takingOverPlaceBox4',
        'attachedDocsBox5',
        'goodsMarksAndNumbersBox6to9',
        'grossWeightBox11',
        'volumeBox12',
        'carrierInstructionsBox13',
        'carrierDetailsBox16',
        'packageCounts',
        'packageTypes',
        'grossWeights',
        'volumes',
        'seller',
        'buyer',
        'carrier',
      ];
      return {
        prices: false,
        lineTotals: false,
        subtotal: false,
        taxes: false,
        grandTotal: false,
        incoterms: false,
        paymentTerms: false,
        packageCounts: true,
        packageTypes: true,
        netWeights: false,
        grossWeights: true,
        volumes: true,
        hsCodes: false,
        seller: true,
        buyer: true,
        carrier: true,
        cmrBoxes: true,
        senderBox1: true,
        consigneeBox2: true,
        deliveryPlaceBox3: true,
        takingOverPlaceBox4: true,
        attachedDocsBox5: true,
        goodsMarksAndNumbersBox6to9: true,
        grossWeightBox11: true,
        volumeBox12: true,
        carrierInstructionsBox13: true,
        carrierDetailsBox16: true,
        fields: fieldList,
        hasField: (field: string) => fieldList.includes(field),
      };
    }
  }
}

/**
 * Fast helper to check if a specific field is visible on a document type.
 */
export function isFieldVisible(docType: DocType, field: string): boolean {
  const visible = getVisibleFields(docType);
  return visible.hasField(field) || Boolean((visible as unknown as Record<string, unknown>)[field]);
}

// ============================================================================
// Bilingual Dictionary (`DOC_TRANSLATIONS`)
// ============================================================================

export interface DocTranslationStrings {
  // Document titles and subtitles
  commercialInvoiceTitle: string;
  commercialInvoiceSubtitle: string;
  packingListTitle: string;
  packingListSubtitle: string;
  cmrTitle: string;
  cmrSubtitle: string;

  // Form & table headers
  description: string;
  hsCode: string;
  quantity: string;
  unit: string;
  unitPrice: string;
  lineTotal: string;
  packages: string;
  packageType: string;
  netWeight: string;
  grossWeight: string;
  volume: string;

  // Parties
  seller: string;
  sellerExporter: string;
  buyer: string;
  buyerConsignee: string;
  carrier: string;
  companyName: string;
  address: string;
  taxId: string;
  country: string;
  phone: string;
  email: string;
  vehicleReg: string;
  driverName: string;

  // Logistics & Metadata
  docNumber: string;
  invoiceNumber: string;
  date: string;
  origin: string;
  placeOfLoading: string;
  destination: string;
  placeOfDelivery: string;
  incoterm: string;
  incotermLocation: string;
  vesselOrFlightOrVehicle: string;
  vesselVehicle: string;
  blOrAwbOrConsignmentNo: string;
  consignmentNo: string;
  paymentTerms: string;
  currency: string;
  notes: string;
  remarks: string;

  // Totals labels
  subtotal: string;
  discount: string;
  tax: string;
  vat: string;
  shipping: string;
  shippingFee: string;
  grandTotal: string;
  totalQuantity: string;
  totalPackages: string;
  totalNetWeight: string;
  totalGrossWeight: string;
  totalVolume: string;

  // CMR Convention Specific Boxes
  cmrBox1: string;
  cmrBox2: string;
  cmrBox3: string;
  cmrBox4: string;
  cmrBox5: string;
  cmrBox6to9: string;
  cmrBox10: string;
  cmrBox11: string;
  cmrBox12: string;
  cmrBox13: string;
  cmrBox14: string;
  cmrBox15: string;
  cmrBox16: string;
  cmrBox17: string;
  cmrBox18: string;
  cmrBox19: string;
  cmrBox20: string;
  cmrBox21: string;
  cmrBox22: string;
  cmrBox23: string;
  cmrBox24: string;

  // Footer notice
  footerNotice: string;
  footerNoticeShort: string;

  // Incoterms
  incoterm_FOB: string;
  incoterm_CIF: string;
  incoterm_EXW: string;
  incoterm_CFR: string;
  incoterm_DDP: string;
  incoterm_FCA: string;
  incoterm_CPT: string;
  incoterm_CIP: string;
  incoterm_DAP: string;
  incoterm_DPU: string;

  // Units
  unit_PCS: string;
  unit_KG: string;
  unit_BOX: string;
  unit_PALLET: string;
  unit_MT: string;
  unit_CTN: string;
}

export const DOC_TRANSLATIONS: {
  en: DocTranslationStrings;
  ar: DocTranslationStrings;
} = {
  en: {
    // Document titles and subtitles
    commercialInvoiceTitle: 'Commercial Invoice',
    commercialInvoiceSubtitle: 'Official invoice for international trade and customs clearance',
    packingListTitle: 'Packing List',
    packingListSubtitle: 'Detailed inventory of packages, weights, and dimensions',
    cmrTitle: 'CMR International Consignment Note',
    cmrSubtitle: 'Convention on the Contract for the International Carriage of Goods by Road',

    // Form & table headers
    description: 'Description of Goods',
    hsCode: 'HS Code',
    quantity: 'Quantity',
    unit: 'Unit',
    unitPrice: 'Unit Price',
    lineTotal: 'Line Total',
    packages: 'Packages',
    packageType: 'Package Type',
    netWeight: 'Net Wt (kg)',
    grossWeight: 'Gross Wt (kg)',
    volume: 'Volume (CBM)',

    // Parties
    seller: 'Seller',
    sellerExporter: 'Seller / Exporter',
    buyer: 'Buyer',
    buyerConsignee: 'Buyer / Consignee',
    carrier: 'Carrier',
    companyName: 'Company Name / Name',
    address: 'Address',
    taxId: 'Tax ID / VAT No.',
    country: 'Country',
    phone: 'Phone',
    email: 'Email',
    vehicleReg: 'Vehicle Registration',
    driverName: 'Driver Name',

    // Logistics & Metadata
    docNumber: 'Document No.',
    invoiceNumber: 'Invoice No.',
    date: 'Date',
    origin: 'Place of Loading / Origin',
    placeOfLoading: 'Place of Loading',
    destination: 'Place of Delivery / Destination',
    placeOfDelivery: 'Place of Delivery',
    incoterm: 'Incoterm',
    incotermLocation: 'Incoterm Location',
    vesselOrFlightOrVehicle: 'Vessel / Flight / Vehicle',
    vesselVehicle: 'Vehicle / Transport Mode',
    blOrAwbOrConsignmentNo: 'B/L / AWB / Consignment No.',
    consignmentNo: 'Consignment No.',
    paymentTerms: 'Payment Terms',
    currency: 'Currency',
    notes: 'Notes',
    remarks: 'Remarks & Special Instructions',

    // Totals labels
    subtotal: 'Subtotal',
    discount: 'Discount',
    tax: 'Tax',
    vat: 'VAT',
    shipping: 'Shipping',
    shippingFee: 'Shipping Fee',
    grandTotal: 'Grand Total',
    totalQuantity: 'Total Quantity',
    totalPackages: 'Total Packages',
    totalNetWeight: 'Total Net Weight',
    totalGrossWeight: 'Total Gross Weight',
    totalVolume: 'Total Volume',

    // CMR Convention Specific Boxes
    cmrBox1: '1. Sender (Name, address, country)',
    cmrBox2: '2. Consignee (Name, address, country)',
    cmrBox3: '3. Place of delivery of goods',
    cmrBox4: '4. Place and date of taking over goods',
    cmrBox5: '5. Documents attached',
    cmrBox6to9: '6-9. Marks & Nos, Number of packages, Method of packing, Description of goods',
    cmrBox10: '10. Statistical number / HS Code',
    cmrBox11: '11. Gross weight in kg',
    cmrBox12: '12. Volume in m³',
    cmrBox13: "13. Sender's instructions",
    cmrBox14: '14. Cash on delivery',
    cmrBox15: '15. Instructions as to payment for carriage',
    cmrBox16: '16. Carrier (Name, address, country)',
    cmrBox17: '17. Successive carriers',
    cmrBox18: "18. Carrier's reservations and observations",
    cmrBox19: '19. Special agreements',
    cmrBox20: '20. To be paid by sender / consignee',
    cmrBox21: '21. Established in / on',
    cmrBox22: '22. Signature and stamp of sender',
    cmrBox23: '23. Signature and stamp of carrier',
    cmrBox24: '24. Goods received: Date & Signature of consignee',

    // Footer notice
    footerNotice: 'Issued via Exvorta - exvorta.com',
    footerNoticeShort: 'Issued via Exvorta',

    // Incoterms
    incoterm_FOB: 'FOB - Free on Board',
    incoterm_CIF: 'CIF - Cost, Insurance and Freight',
    incoterm_EXW: 'EXW - Ex Works',
    incoterm_CFR: 'CFR - Cost and Freight',
    incoterm_DDP: 'DDP - Delivered Duty Paid',
    incoterm_FCA: 'FCA - Free Carrier',
    incoterm_CPT: 'CPT - Carriage Paid To',
    incoterm_CIP: 'CIP - Carriage and Insurance Paid To',
    incoterm_DAP: 'DAP - Delivered at Place',
    incoterm_DPU: 'DPU - Delivered at Place Unloaded',

    // Units
    unit_PCS: 'Pieces (PCS)',
    unit_KG: 'Kilograms (KG)',
    unit_BOX: 'Boxes (BOX)',
    unit_PALLET: 'Pallets',
    unit_MT: 'Metric Tons (MT)',
    unit_CTN: 'Cartons (CTN)',
  },
  ar: {
    // Document titles and subtitles
    commercialInvoiceTitle: 'الفاتورة التجارية',
    commercialInvoiceSubtitle: 'فاتورة رسمية للتجارة الدولية والتخليص الجمركي',
    packingListTitle: 'قائمة التعبئة',
    packingListSubtitle: 'بيان تفصيلي بالطرود والأوزان والأبعاد',
    cmrTitle: 'وثيقة النقل البري الدولي (CMR)',
    cmrSubtitle: 'اتفاقية عقد النقل الدولي للبضائع عبر الطرق البرية',

    // Form & table headers
    description: 'بيان البضاعة',
    hsCode: 'الرمز المنسق (HS Code)',
    quantity: 'الكمية',
    unit: 'الوحدة',
    unitPrice: 'سعر الوحدة',
    lineTotal: 'الإجمالي',
    packages: 'عدد الطرود',
    packageType: 'نوع التعبئة',
    netWeight: 'الوزن الصافي (كغ)',
    grossWeight: 'الوزن الإجمالي (كغ)',
    volume: 'الحجم (CBM)',

    // Parties
    seller: 'البائع',
    sellerExporter: 'البائع / المصدر',
    buyer: 'المشتري',
    buyerConsignee: 'المشتري / المرسل إليه',
    carrier: 'الناقل',
    companyName: 'اسم الشركة / الاسم',
    address: 'العنوان',
    taxId: 'الرقم الضريبي',
    country: 'الدولة',
    phone: 'الهاتف',
    email: 'البريد الإلكتروني',
    vehicleReg: 'رقم لوحة المركبة',
    driverName: 'اسم السائق',

    // Logistics & Metadata
    docNumber: 'رقم المستند',
    invoiceNumber: 'رقم الفاتورة',
    date: 'التاريخ',
    origin: 'مكان التحميل / المنشأ',
    placeOfLoading: 'مكان التحميل',
    destination: 'مكان التسليم / الوجهة',
    placeOfDelivery: 'مكان التسليم',
    incoterm: 'شرط الشحن (Incoterm)',
    incotermLocation: 'موقع شرط الشحن',
    vesselOrFlightOrVehicle: 'السفينة / الرحلة / المركبة',
    vesselVehicle: 'وسيلة النقل / المركبة',
    blOrAwbOrConsignmentNo: 'رقم بوليصة الشحن',
    consignmentNo: 'رقم الإرسالية',
    paymentTerms: 'شروط الدفع',
    currency: 'العملة',
    notes: 'ملاحظات',
    remarks: 'ملاحظات وتعليمات خاصة',

    // Totals labels
    subtotal: 'المجموع الفرعي',
    discount: 'الخصم',
    tax: 'الضريبة',
    vat: 'ضريبة القيمة المضافة',
    shipping: 'الشحن',
    shippingFee: 'رسوم الشحن',
    grandTotal: 'الإجمالي الكلي',
    totalQuantity: 'إجمالي الكمية',
    totalPackages: 'إجمالي الطرود',
    totalNetWeight: 'إجمالي الوزن الصافي',
    totalGrossWeight: 'إجمالي الوزن الإجمالي',
    totalVolume: 'إجمالي الحجم',

    // CMR Convention Specific Boxes
    cmrBox1: '١. المرسل (الاسم، العنوان، البلد)',
    cmrBox2: '٢. المرسل إليه (الاسم، العنوان، البلد)',
    cmrBox3: '٣. مكان تسليم البضاعة (المكان، البلد)',
    cmrBox4: '٤. مكان وتاريخ استلام البضاعة',
    cmrBox5: '٥. المستندات المرفقة',
    cmrBox6to9: '٦-٩. العلامات والأرقام، عدد الطرود، طريقة التعبئة، بيان البضاعة',
    cmrBox10: '١٠. الرمز الإحصائي / المنسق',
    cmrBox11: '١١. الوزن الإجمالي بالكيلوغرام',
    cmrBox12: '١٢. الحجم بالمتر المكعب',
    cmrBox13: '١٣. تعليمات المرسل',
    cmrBox14: '١٤. الدفع عند التسليم',
    cmrBox15: '١٥. تعليمات دفع أجور النقل',
    cmrBox16: '١٦. الناقل (الاسم، العنوان، البلد)',
    cmrBox17: '١٧. الناقلون المتعاقبون',
    cmrBox18: '١٨. تحفظات وملاحظات الناقل',
    cmrBox19: '١٩. اتفاقيات خاصة',
    cmrBox20: '٢٠. المبلغ المطلوب دفعه',
    cmrBox21: '٢١. حرر في / بتاريخ',
    cmrBox22: '٢٢. توقيع وخاتم المرسل',
    cmrBox23: '٢٣. توقيع وخاتم الناقل',
    cmrBox24: '٢٤. استلام البضاعة: تاريخ وتوقيع وخاتم المرسل إليه',

    // Footer notice
    footerNotice: 'صادر عبر إكسبورتا - exvorta.com',
    footerNoticeShort: 'صادر عبر إكسبورتا - exvorta.com',

    // Incoterms
    incoterm_FOB: 'FOB - تسليم على ظهر السفينة',
    incoterm_CIF: 'CIF - التكلفة والتأمين وأجور الشحن',
    incoterm_EXW: 'EXW - تسليم أرض المصنع',
    incoterm_CFR: 'CFR - التكلفة وأجور الشحن',
    incoterm_DDP: 'DDP - تسليم مع دفع الرسوم',
    incoterm_FCA: 'FCA - تسليم إلى الناقل',
    incoterm_CPT: 'CPT - أجور النقل مدفوعة إلى',
    incoterm_CIP: 'CIP - أجور النقل والتأمين مدفوعة إلى',
    incoterm_DAP: 'DAP - تسليم في المكان المحدد',
    incoterm_DPU: 'DPU - تسليم في مكان التفريغ',

    // Units
    unit_PCS: 'قطع (PCS)',
    unit_KG: 'كيلوغرام (KG)',
    unit_BOX: 'صناديق (BOX)',
    unit_PALLET: 'منصات نقالة (Pallet)',
    unit_MT: 'طن متري (MT)',
    unit_CTN: 'كراتين (CTN)',
  },
};

export type DocTranslationKey = keyof DocTranslationStrings;

/**
 * Retrieves a translated string safely with English fallback.
 */
export function getTranslation(key: DocTranslationKey, lang: DocLang = 'en'): string {
  const dict = DOC_TRANSLATIONS[lang] || DOC_TRANSLATIONS.en;
  return dict[key] ?? DOC_TRANSLATIONS.en[key] ?? String(key);
}

// ============================================================================
// Factory Helpers
// ============================================================================

/**
 * Creates an empty line item with unique ID and default attributes.
 */
export function createEmptyLineItem(id?: string): DocLineItem {
  return {
    id: id || `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    description: '',
    hsCode: '',
    quantity: 1,
    unit: 'PCS',
    unitPrice: 0,
    netWeightKg: 0,
    grossWeightKg: 0,
    packagesCount: 1,
    packageType: 'CTN',
    volumeCbm: 0,
  };
}

/**
 * Creates a default document state for the generator UI or tests.
 */
export function createDefaultDoc(docType: DocType = 'commercial-invoice'): ExportDocData {
  return {
    docType,
    docNumber: '',
    date: new Date().toISOString().split('T')[0],
    currency: 'USD',
    incoterm: 'FOB',
    incotermLocation: '',
    seller: {
      name: '',
      address: '',
      country: '',
      taxId: '',
      phone: '',
      email: '',
    },
    buyer: {
      name: '',
      address: '',
      country: '',
      taxId: '',
      phone: '',
      email: '',
    },
    carrier: {
      name: '',
      address: '',
      vehicleReg: '',
      driverName: '',
    },
    origin: '',
    destination: '',
    vesselOrFlightOrVehicle: '',
    blOrAwbOrConsignmentNo: '',
    paymentTerms: '',
    notes: '',
    items: [createEmptyLineItem()],
    options: {
      taxRate: 0,
      shippingFee: 0,
      discount: 0,
    },
  };
}
