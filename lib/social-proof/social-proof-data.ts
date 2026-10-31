/**
 * Social proof data structures, institutional defaults, and Schema.org Review JSON-LD generators.
 * Adheres strictly to visual honesty: default items are explicit placeholder slots
 * and never fabricate real client endorsements or registered trademarks.
 */

export interface ClientLogoItem {
  id: string
  name: string
  industry: string
  tier?: 'enterprise' | 'growth' | 'partner'
  placeholder: boolean
  placeholderLabel: string
  logoUrl?: string
  websiteUrl?: string
}

export interface MetricCounterItem {
  id: string
  value: number
  prefix?: string
  suffix?: string
  label: string
  description?: string
  placeholder: boolean
  placeholderLabel?: string
}

export interface TestimonialItem {
  id: string
  quote: string
  authorName: string
  authorRole: string
  companyName: string
  companySector: string
  countryOrRegion: string
  ratingValue: number
  bestRating?: number
  verifiedTradeVolume?: string
  placeholder: boolean
  placeholderLabel?: string
}

export interface SocialProofConfig {
  logos: ClientLogoItem[]
  counters: MetricCounterItem[]
  testimonials: TestimonialItem[]
}

/**
 * Institutional placeholder configuration.
 * All default entries are marked `placeholder: true` with prominent specimen notices.
 */
export const defaultSocialProofConfig: SocialProofConfig = {
  logos: [
    {
      id: 'slot-agri',
      name: 'GCC Agribusiness Consortium',
      industry: 'Bulk Grain & Fertilizer',
      tier: 'enterprise',
      placeholder: true,
      placeholderLabel: 'SLOT 01 // RESERVED: AGRIBUSINESS',
    },
    {
      id: 'slot-metal',
      name: 'Eurasian Steelworks',
      industry: 'Industrial Metallurgy',
      tier: 'enterprise',
      placeholder: true,
      placeholderLabel: 'SLOT 02 // RESERVED: METALLURGY',
    },
    {
      id: 'slot-energy',
      name: 'MENA Energy Logistics',
      industry: 'Hydrocarbons & Bunkering',
      tier: 'growth',
      placeholder: true,
      placeholderLabel: 'SLOT 03 // RESERVED: ENERGY LOGISTICS',
    },
    {
      id: 'slot-pharma',
      name: 'Levant Cold-Chain Pharma',
      industry: 'Temperature-Controlled Exports',
      tier: 'enterprise',
      placeholder: true,
      placeholderLabel: 'SLOT 04 // RESERVED: PHARMACEUTICALS',
    },
    {
      id: 'slot-fmcg',
      name: 'East Africa FMCG Gateway',
      industry: 'Consumer Goods Distribution',
      tier: 'growth',
      placeholder: true,
      placeholderLabel: 'SLOT 05 // RESERVED: FMCG & RETAIL',
    },
    {
      id: 'slot-chem',
      name: 'Gulf Petrochemical Synthetics',
      industry: 'Specialty Polymers & Resins',
      tier: 'partner',
      placeholder: true,
      placeholderLabel: 'SLOT 06 // RESERVED: CHEMICALS',
    },
  ],
  counters: [
    {
      id: 'metric-volume',
      value: 142000000,
      prefix: '$',
      suffix: '+',
      label: 'Target Trade Volume Facilitated',
      description: 'Simulated multi-corridor annual transaction throughput capacity',
      placeholder: true,
      placeholderLabel: 'BENCHMARK / TARGET',
    },
    {
      id: 'metric-clearance',
      value: 48,
      suffix: ' hrs',
      label: 'Border Clearance Speed',
      description: 'Target processing SLA across customs checkpoints',
      placeholder: true,
      placeholderLabel: 'TARGET SLA',
    },
    {
      id: 'metric-corridors',
      value: 12,
      suffix: '+',
      label: 'Active Cross-Border Corridors',
      description: 'Interconnected trade lanes modeled across MENA & Eurasia',
      placeholder: true,
      placeholderLabel: 'NETWORK CAPACITY',
    },
    {
      id: 'metric-compliance',
      value: 100,
      suffix: '%',
      label: 'PINT-AE Regulatory Compliance',
      description: 'UAE e-invoicing and Peppol standard validation readiness',
      placeholder: true,
      placeholderLabel: 'STANDARD READY',
    },
  ],
  testimonials: [
    {
      id: 'specimen-agri',
      quote:
        'The digital export manifest architecture and automated Incoterm risk allocation significantly reduce customs clearance hold times for multi-container bulk shipments.',
      authorName: 'Trade Operations Lead (Specimen)',
      authorRole: 'Head of Supply Chain Execution',
      companyName: 'GCC Agribusiness Consortium',
      companySector: 'Bulk Agricultural Commodities',
      countryOrRegion: 'United Arab Emirates',
      ratingValue: 5,
      bestRating: 5,
      verifiedTradeVolume: '$24M annual cross-border volume',
      placeholder: true,
      placeholderLabel: 'SAMPLE SPECIMEN // PENDING CLIENT SIGN-OFF',
    },
    {
      id: 'specimen-metal',
      quote:
        'Autonomous Incoterm risk allocation and automated CMR consignment notes replace days of manual documentation processing across cross-border freight routes.',
      authorName: 'Logistics Director (Specimen)',
      authorRole: 'VP International Trade Operations',
      companyName: 'Eurasian Steelworks',
      companySector: 'Industrial Metallurgy',
      countryOrRegion: 'Eurasian Trade Corridor',
      ratingValue: 5,
      bestRating: 5,
      verifiedTradeVolume: '$60M modeled export volume',
      placeholder: true,
      placeholderLabel: 'SAMPLE SPECIMEN // PENDING CLIENT SIGN-OFF',
    },
    {
      id: 'specimen-fmcg',
      quote:
        'Having real-time container volumetric packing calculators coupled directly with commercial invoices and declarations transformed our export quote precision.',
      authorName: 'Commercial Export Manager (Specimen)',
      authorRole: 'Regional Export Director',
      companyName: 'East Africa FMCG Gateway',
      companySector: 'Packaged Consumer Goods',
      countryOrRegion: 'East Africa / GCC',
      ratingValue: 5,
      bestRating: 5,
      verifiedTradeVolume: '$18M freight pipeline',
      placeholder: true,
      placeholderLabel: 'SAMPLE SPECIMEN // PENDING CLIENT SIGN-OFF',
    },
  ],
}

/**
 * Builds a Schema.org Review structured data object for a testimonial item.
 * Gracefully returns null if the input is missing or malformed.
 */
export function buildTestimonialJsonLd(
  item?: TestimonialItem | null,
  siteUrl?: string,
): Record<string, unknown> | null {
  if (!item || typeof item !== 'object') {
    return null
  }

  if (!item.quote || !item.authorName) {
    return null
  }

  const ratingVal = typeof item.ratingValue === 'number' && !Number.isNaN(item.ratingValue)
    ? item.ratingValue
    : 5
  const bestRatingVal = typeof item.bestRating === 'number' && !Number.isNaN(item.bestRating)
    ? item.bestRating
    : 5

  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Organization',
      name: 'Exvorta',
      url: siteUrl || 'https://exvorta.com',
    },
    author: {
      '@type': 'Person',
      name: item.authorName,
      ...(item.authorRole ? { jobTitle: item.authorRole } : {}),
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: ratingVal,
      bestRating: bestRatingVal,
    },
    reviewBody: item.quote,
    publisher: {
      '@type': 'Organization',
      name: 'Exvorta',
    },
  }
}

/**
 * Builds a Schema.org AggregateRating structured data object for a collection of testimonials.
 * Gracefully returns null if no valid reviews with numeric ratings are available.
 */
export function buildAggregateRatingJsonLd(
  testimonials?: TestimonialItem[] | null,
  siteUrl?: string,
): Record<string, unknown> | null {
  if (!testimonials || !Array.isArray(testimonials) || testimonials.length === 0) {
    return null
  }

  const validItems = testimonials.filter(
    (t) => t && typeof t.ratingValue === 'number' && !Number.isNaN(t.ratingValue),
  )

  if (validItems.length === 0) {
    return null
  }

  const total = validItems.reduce((acc, t) => acc + t.ratingValue, 0)
  const avg = Math.round((total / validItems.length) * 10) / 10

  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    itemReviewed: {
      '@type': 'Organization',
      name: 'Exvorta',
      url: siteUrl || 'https://exvorta.com',
    },
    ratingValue: avg,
    bestRating: 5,
    worstRating: 1,
    ratingCount: validItems.length,
    reviewCount: validItems.length,
  }
}
