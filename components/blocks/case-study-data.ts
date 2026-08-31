/**
 * Per-project case-study content, derived from a full teardown of each live
 * subdomain deployment (stonvi.exvorta.com, spicevo.exvorta.com, nutave.exvorta.com).
 *
 * The CMS Project doc overrides everything here when filled in — these are
 * authoritative fallbacks so the pages never render thin.
 */

export interface CaseStudyData {
  title: string
  domain: string
  url: string
  tagline: string
  category: string
  excerpt: string
  heroBg: string
  accent: string
  heroImage?: string
  stats: { label: string; value: string }[]
  certifications: string[]
  products: { name: string; description: string }[]
  metrics: { label: string; value: string }[]
  testimonial?: { quote: string; author: string; role: string }
}

export const CASE_STUDIES: Record<string, CaseStudyData> = {
  stonvi: {
    title: 'Stonvi',
    domain: 'stonvi.exvorta.com',
    url: 'https://stonvi.exvorta.com',
    tagline: 'Turkish Ceramics & Building Materials. Factory Direct. Project Ready.',
    category: 'Ceramics & Building Materials Export',
    excerpt:
      'Direct access to 12 premium manufacturing partners across the Turkish ceramic cluster. Complete technical compliance, zero-defect execution, and direct factory-to-project logistics.',
    heroBg: '#F4F6F7',
    accent: '#2C3E50',
    heroImage:
      'https://res.cloudinary.com/dqafwzu5l/image/upload/f_auto,q_auto,w_1600/v1785398954/stonvi/high_end_brutalist_architecture_large_scale_textured_concrete_slabs_and_glass.webp',
    stats: [
      { value: '28+', label: 'Global Markets' },
      { value: '2M', label: 'SQM Exported / Yr' },
      { value: '12', label: 'Factory Partners' },
    ],
    certifications: ['ISO 13006 — Ceramic Standards', 'CE MARKED — European Market Ready', 'LEED Compatible — Green Building'],
    products: [
      { name: 'Porcelain Slabs', description: 'Large-format slabs up to 120×260cm — lappato, matte and grip finishes for commercial interiors.' },
      { name: 'Floor & Wall Tiles', description: 'Full architectural ranges with documented slip ratings (R9–R11) and thickness specs.' },
      { name: 'Outdoor & Facade', description: '20mm structural cladding panels engineered for public and brutalist projects.' },
    ],
    metrics: [
      { label: 'INDUSTRY', value: 'Construction Materials' },
      { label: 'MODEL', value: 'Factory-Direct, Agent-Free' },
      { label: 'MOQ', value: "1×20' FCL" },
      { label: 'LEAD TIME', value: '15–25 Days' },
      { label: 'INCOTERMS', value: 'FOB / CFR / CIF' },
    ],
  },
  spicevo: {
    title: 'Spicevo',
    domain: 'spicevo.exvorta.com',
    url: 'https://spicevo.exvorta.com',
    tagline: 'Organic Herbs & Spices. From Turkish Farms to Your Container.',
    category: 'Organic Herbs & Spices Export',
    excerpt:
      'Spicevo exports 480+ metric tons of certified organic herbs and spices annually to 28 countries. EU Organic, USDA NOP, and ISO 22000 certified. Full traceability from farm to freight.',
    heroBg: '#E8DDD0',
    accent: '#8B3A0F',
    heroImage:
      'https://res.cloudinary.com/dqafwzu5l/image/upload/c_fill,g_auto,f_auto,q_auto,w_1600/spicevo/hero_oregano_flatlay_1784630117441.jpg',
    stats: [
      { value: '480+', label: 'MT Exported / Yr' },
      { value: '28', label: 'Countries Served' },
      { value: '40+', label: 'Certified SKUs' },
    ],
    certifications: ['EU Organic — EC 834/2007', 'USDA NOP — Certified Organic', 'ISO 22000 — Food Safety', 'HALAL — Certified'],
    products: [
      { name: 'Herbs (Whole & Rubbed)', description: 'Premium oregano, laurel leaves, and sage sourced directly from our network of organic farms.' },
      { name: 'Essential Oils', description: 'Pure steam-distilled oils from oregano, laurel, and sage for pharmaceutical and food applications.' },
      { name: 'Spices & Botanicals', description: 'High-purity cumin, anise, fennel, chamomile and licorice harvested at peak potency.' },
      { name: 'Custom Processing', description: 'Advanced cleaning, sorting, and milling services tailored to specific particle size requirements.' },
    ],
    metrics: [
      { label: 'INDUSTRY', value: 'Agriculture / Organic' },
      { label: 'ORIGIN', value: 'Aegean Region, Turkey' },
      { label: 'TRACEABILITY', value: '100% Farm-to-Container' },
      { label: 'AUDITS', value: 'Annual Third-Party' },
    ],
  },
  nutave: {
    title: 'Nutave',
    domain: 'nutave.exvorta.com',
    url: 'https://nutave.exvorta.com',
    tagline: 'Premium Dried Fruits & Nuts. BRC Grade A. Delivered Worldwide.',
    category: 'Dried Fruits & Nuts Export',
    excerpt:
      'Nutave exports 650+ metric tons of premium-grade dried fruits and nuts annually. BRC Grade A, ISO 22000, Halal, and Kosher certified. Trusted by retailers and food manufacturers in 40+ countries.',
    heroBg: '#FAF7F2',
    accent: '#C8922A',
    heroImage:
      'https://res.cloudinary.com/dqafwzu5l/image/upload/f_auto,q_auto,w_1600/v1785402989/nutave/jid6s2ca2lfjgbqgqv8n.webp',
    stats: [
      { value: '650+', label: 'MT Exported / Yr' },
      { value: '40+', label: 'Countries Served' },
      { value: 'BRC', label: 'Grade A Certified' },
    ],
    certifications: ['BRC — Grade A', 'ISO 22000 — Food Safety', 'HALAL & KOSHER — Certified'],
    products: [
      { name: 'Dried Fruits', description: 'Premium apricots, figs, and raisins with optical sorting for zero-defect runs.' },
      { name: 'Nuts', description: 'Industrial-grade hazelnuts and pistachios with documented aflatoxin controls.' },
      { name: 'Retail Packing', description: 'Private-label ready formats for supermarket chains and food manufacturers.' },
    ],
    metrics: [
      { label: 'INDUSTRY', value: 'Food / Dried Fruits' },
      { label: 'ESTABLISHED', value: '2011 — Izmir, Turkey' },
      { label: 'GRADE', value: 'BRC A — Audit-Free Onboarding' },
      { label: 'CERTS', value: 'Halal + Kosher Dual' },
    ],
    testimonial: {
      quote:
        'The BRC Grade A certification means our compliance team approves them without a site audit. It streamlines our procurement completely.',
      author: 'Director of Sourcing',
      role: 'Premium EU Supermarket Chain',
    },
  },
}

export function getCaseStudy(slug: string): CaseStudyData | null {
  const key = Object.keys(CASE_STUDIES).find(k => slug.toLowerCase().includes(k))
  return key ? CASE_STUDIES[key] : null
}
