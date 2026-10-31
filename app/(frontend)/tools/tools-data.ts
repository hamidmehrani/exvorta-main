export interface ToolItem {
  id: string
  name: string
  url: string
  altUrl?: string
  altUrlLabel?: string
  category: string
  status: 'live' | 'roadmap'
  statusLabel: string
  description: string
  actionLabel: string
  applicationCategory: string
  operatingSystem: string
  tags?: readonly string[]
}

export const TOOLS_CATALOG: readonly ToolItem[] = [
  {
    id: 'incoterm-cbm',
    name: 'Incoterm & CBM Logistics Calculator',
    url: '/tools/incoterm-cbm',
    altUrl: '/tools/incoterm-cbm/ar',
    altUrlLabel: 'Arabic (العربية)',
    category: 'LOGISTICS & FREIGHT',
    status: 'live',
    statusLabel: '[ LIVE TOOL ]',
    description:
      'Multi-cargo container load optimization, volumetric CBM calculations, and ICC Incoterms 2020 risk transfer matrix.',
    actionLabel: '[ LAUNCH CALCULATOR -> ]',
    applicationCategory: 'LogisticsApplication',
    operatingSystem: 'All',
    tags: ['Incoterms 2020', 'CBM Volume', 'Container Load', 'Chargeable Weight'],
  },
  {
    id: 'docs-generator',
    name: 'Commercial Export Documentation Generator',
    url: '/tools/docs-generator',
    category: 'TRADE COMPLIANCE',
    status: 'live',
    statusLabel: '[ LIVE TOOL ]',
    description:
      'Generate bilingual Commercial Invoices, Packing Lists, and CMR Consignment Notes with instant browser PDF preview and print formatting.',
    actionLabel: '[ LAUNCH GENERATOR -> ]',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    tags: ['Commercial Invoice', 'Packing List', 'CMR Consignment', 'Browser PDF'],
  },
  {
    id: 'rfq-builder',
    name: 'RFQ Cart & Spec Builder',
    url: '/rfq',
    category: 'COMMERCIAL SPEC',
    status: 'live',
    statusLabel: '[ LIVE TOOL ]',
    description:
      'Interactive procurement specification builder and RFQ compilation engine for enterprise export tenders.',
    actionLabel: '[ OPEN SPEC BUILDER -> ]',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    tags: ['Procurement Cart', 'Spec Compilation', 'B2B Tenders', 'Instant Export'],
  },
  {
    id: 'hs-converter',
    name: 'GCC HS 8→12-Digit Tariff Converter',
    url: '/waitlist?tool=hs-converter',
    category: 'CUSTOMS & TARIFFS',
    status: 'roadmap',
    statusLabel: '[ ROADMAP ]',
    description:
      'Cross-reference Harmonized System codes against GCC Unified Customs Tariff matrices and duty rates.',
    actionLabel: '[ NOTIFY ON LAUNCH -> ]',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    tags: ['GCC 12-Digit HS', 'Tariff Schedules', 'Duty Calculator', 'Customs Clearance'],
  },
  {
    id: 'readiness-checker',
    name: 'Egypt ACI & KSA SABER Readiness Checker',
    url: '/waitlist?tool=readiness-checker',
    category: 'REGULATORY CLEARANCE',
    status: 'roadmap',
    statusLabel: '[ ROADMAP ]',
    description:
      'Pre-shipment audit checklist for ACID generation and SABER conformity certificate compliance.',
    actionLabel: '[ NOTIFY ON LAUNCH -> ]',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    tags: ['Egypt ACID', 'KSA SABER', 'Pre-Shipment Audit', 'Regulatory Checklist'],
  },
  {
    id: 'einvoicing',
    name: 'UAE E-Invoicing (PINT-AE) Assessment',
    url: '/waitlist?tool=einvoicing',
    category: 'DIGITAL INVOICING',
    status: 'roadmap',
    statusLabel: '[ ROADMAP ]',
    description:
      'Technical readiness evaluation for Peppol PINT-AE cross-border e-invoicing mandate compliance.',
    actionLabel: '[ NOTIFY ON LAUNCH -> ]',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    tags: ['UAE PINT-AE', 'Peppol Matrix', 'B2B Compliance', 'Mandate 2026'],
  },
] as const

export const LIVE_TOOLS = TOOLS_CATALOG.filter((t) => t.status === 'live')
export const ROADMAP_TOOLS = TOOLS_CATALOG.filter((t) => t.status === 'roadmap')

export const TRUST_RIBBON_ITEMS = [
  '[ ZERO PAYWALLS ]',
  '[ 100% UNRESTRICTED ]',
  '[ AUDIT-READY MATH ]',
  '[ ENTERPRISE SCHEMAS ]',
] as const

export const WHY_FREE_PILLARS = [
  {
    index: '01',
    title: 'Mathematical Transparency',
    description:
      'No black-box calculations. Critical trade logistics demand auditable formulas and deterministic results.',
  },
  {
    index: '02',
    title: 'Zero-Friction Evaluation',
    description:
      'Enterprise supply chains require verifiable capabilities before entering commercial platform engagements.',
  },
  {
    index: '03',
    title: 'Regulatory Standardization',
    description:
      'Accelerating regional trade efficiency across GCC, MENA, and European corridors.',
  },
] as const

export interface WebApplicationSchemaItem {
  '@type': 'WebApplication'
  name: string
  description: string
  url: string
  applicationCategory: string
  operatingSystem: string
  offers: {
    '@type': 'Offer'
    price: string
    priceCurrency: string
  }
}

export interface ToolsItemListSchema {
  '@context': 'https://schema.org'
  '@type': 'ItemList'
  name: string
  itemListElement: WebApplicationSchemaItem[]
}

/**
 * Generates an ItemList JSON-LD schema for all public trade tools.
 */
export function buildToolsItemListJsonLd(
  tools: readonly ToolItem[] = TOOLS_CATALOG
): ToolsItemListSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Exvorta Trade Utilities & Export Engineering Tools',
    itemListElement: tools.map((tool) => ({
      '@type': 'WebApplication',
      name: tool.name,
      description: tool.description,
      url: tool.url,
      applicationCategory: tool.applicationCategory,
      operatingSystem: tool.operatingSystem,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    })),
  }
}
