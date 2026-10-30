export interface PartnerCategory {
  id: string
  code: string
  title: string
  subtitle: string
  description: string
  referralTriggers: readonly string[]
}

export interface CommissionTier {
  id: string
  code: string
  tier: string
  name: string
  projectValue: string
  partnerShare: string
  rate: string
  turnaround: string
  description: string
  scope: readonly string[]
}

export interface WorkflowStep {
  step: string
  code: string
  title: string
  duration: string
  actor: string
  description: string
  deliverables: readonly string[]
}

export interface PartnerBenefit {
  id: string
  code: string
  title: string
  highlight: string
  description: string
}

export interface PartnerFaq {
  question: string
  answer: string
}

export interface DirectPartnerContact {
  email: string
  conciergeSla: string
  desk: string
  channel: string
}

export interface CommissionHighlight {
  value: string
  label: string
  description?: string
}

export const PARTNER_CATEGORIES: readonly PartnerCategory[] = [
  {
    id: 'tax-consultants',
    code: '[ CATEGORY 01 ]',
    title: 'Tax Consultants & Corporate Tax Advisors',
    subtitle: 'Corporate Tax, VAT & Cross-Border Structuring',
    description:
      'Advisory firms guiding cross-border entities through UAE Corporate Tax, transfer pricing, and VAT compliance who require institutional export web architecture for commercial validation.',
    referralTriggers: [
      'Exporters establishing UAE mainland or free zone tax residency',
      'Entities preparing for foreign audit requiring verified digital presence',
      'Clients needing transparent commercial pricing and Incoterms structures',
    ],
  },
  {
    id: 'customs-brokers',
    code: '[ CATEGORY 02 ]',
    title: 'Clearing Agents & Customs Brokers',
    subtitle: 'Freight Forwarding, Customs Clearance & Port Logistics',
    description:
      'Logistics specialists and clearing houses handling trade documentation, HS code classifications, and port dispatch whose clients need automated CBM calculations and digital quoting.',
    referralTriggers: [
      'Traders transitioning from manual quote sheets to digital RFQ workflows',
      'Container shippers needing automated 20ft/40ft CBM volume estimation',
      'Importers/exporters needing HS code-mapped bilingual catalogs',
    ],
  },
  {
    id: 'freezone-agencies',
    code: '[ CATEGORY 03 ]',
    title: 'Free-Zone Setup & Company Formation Agencies',
    subtitle: 'Free-Zone Licensing & Mainland Commercial Formation',
    description:
      'Corporate service providers incorporating trading licenses and distribution entities across UAE and GCC free zones seeking turnkey digital infrastructure within 5–10 days of incorporation.',
    referralTriggers: [
      'Newly incorporated trade entities needing immediate operational presence',
      'Holders of commercial licenses requiring high-credibility buyer portals',
      'Founders expanding from domestic distribution to cross-border export markets',
    ],
  },
] as const

export const COMMISSION_TIERS: readonly CommissionTier[] = [
  {
    id: 'starter',
    code: '[ TIER 01 ]',
    tier: 'TIER 01',
    name: 'Starter Platform',
    projectValue: '$1,500',
    partnerShare: '$300',
    rate: '20%',
    turnaround: '5-day turnaround',
    description:
      'High-conversion digital trade foundation engineered for emerging exporters entering global wholesale markets with institutional velocity.',
    scope: [
      'Port 1:1 verified high-conversion layout',
      'Core Web Vitals guarantee (LCP < 2.0s, 95+ Mobile Score)',
      'Integrated RFQ lead capture engine with rate-limiting',
      'WhatsApp Business routing & direct inquiry dispatch',
    ],
  },
  {
    id: 'growth',
    code: '[ TIER 02 ]',
    tier: 'TIER 02',
    name: 'Growth Platform',
    projectValue: '$3,000',
    partnerShare: '$600',
    rate: '20%',
    turnaround: '10-day turnaround',
    description:
      'Complete bilingual export machine with automated trade calculation tooling, HS code catalog architecture, and native Arabic RTL execution.',
    scope: [
      'Everything in Starter Platform',
      'Full digital catalog with HS code mapping & specs',
      'Bilingual English + Arabic (native RTL layout)',
      'Automated CBM container calculator integration',
    ],
  },
  {
    id: 'enterprise-launchpad',
    code: '[ TIER 03 ]',
    tier: 'TIER 03',
    name: 'Custom Enterprise / Launchpad',
    projectValue: '$10,000+',
    partnerShare: '$2,000+',
    rate: '20%',
    turnaround: 'Milestone-based',
    description:
      'Turnkey dual-milestone deployment, multi-market enterprise portals, or bespoke ERP/CRM trade data synchronizations.',
    scope: [
      'Turnkey two-phase Digital Exporter Launchpad',
      'Multi-market distributor portals with localized currencies',
      'Custom ERP/CRM lead synchronization pipelines',
      'Dedicated SLA stewardship & executive onboarding',
    ],
  },
  {
    id: 'addons-retainers',
    code: '[ EXPANSION ]',
    tier: 'ADD-ONS & RETAINERS',
    name: 'Platform Add-ons & Retainers',
    projectValue: 'Variable',
    partnerShare: '20% on all initial modules',
    rate: '20%',
    turnaround: 'Scope-based SLA',
    description:
      '20% rev-share on all initial add-on modules (Arabic RTL, Container RFQ, etc.) and annual managed stewardship agreements.',
    scope: [
      'Arabic (AR) Localization & Native RTL Add-on',
      'Interactive Container-Load RFQ Quoting Engine',
      '12-Month Managed Growth SaaS Stewardship',
      'Bespoke trade compliance & customs validator modules',
    ],
  },
] as const

export const REFERRAL_WORKFLOW: readonly WorkflowStep[] = [
  {
    step: '01',
    code: '[ STEP 01 ]',
    title: 'Introduction',
    duration: '< 4 Business Hours',
    actor: 'Partner & Concierge',
    description:
      'Partner introduces prospective exporter via direct email to partners@exvorta.com or warm introduction. Partner attribution is locked in our registry immediately.',
    deliverables: [
      'Direct partner introduction to partners@exvorta.com',
      'Instant partner attribution tag registered',
      'Client profile & project context acknowledgment',
    ],
  },
  {
    step: '02',
    code: '[ STEP 02 ]',
    title: 'Architecture & Scoping',
    duration: '24–48 Hours',
    actor: 'Exvorta Solution Architects',
    description:
      'Exvorta technical architects conduct a discovery consultation with the client, mapping platform requirements, Incoterms workflows, and tier specifications.',
    deliverables: [
      'Bespoke technical specification & scope document',
      'Fixed-investment commercial proposal',
      'Commission schedule locked with partner confirmation',
    ],
  },
  {
    step: '03',
    code: '[ STEP 03 ]',
    title: 'Institutional Delivery',
    duration: '5–10 Business Days',
    actor: 'Exvorta Engineering',
    description:
      'Exvorta engineers the client platform under strict contractual SLAs, delivering zero-bloat architecture, RTL localization, and Core Web Vitals guarantees.',
    deliverables: [
      'Production deployment on edge infrastructure',
      'Performance verification (LCP < 2.0s, 95+ score)',
      'Formal client acceptance & sign-off signet',
    ],
  },
  {
    step: '04',
    code: '[ STEP 04 ]',
    title: 'Revenue Disbursement',
    duration: 'Net-15 Post-Settlement',
    actor: 'Exvorta Treasury',
    description:
      'Exvorta remits the 20% revenue share directly to partner bank account via SWIFT or UAE local IBAN wire, accompanied by complete remittance reconciliation.',
    deliverables: [
      'Electronic bank transfer in USD or AED',
      'Formal partner remittance breakdown statement',
      'Permanent client attribution recorded for lifetime expansion',
    ],
  },
] as const

export const PARTNER_BENEFITS: readonly PartnerBenefit[] = [
  {
    id: 'flat-revenue-share',
    code: '[ BENEFIT 01 ]',
    title: '20% Flat Revenue Share',
    highlight: '20% Uncapped Disbursement',
    description:
      'Earn an uncapped 20% commission on all completed project tier values and initial add-on platform modules referred by your firm.',
  },
  {
    id: 'delivery-sla',
    code: '[ BENEFIT 02 ]',
    title: '5-10 Day Delivery SLA',
    highlight: 'Guaranteed Turnaround',
    description:
      'Protect your professional standing with institutional delivery guarantees: 5 business days for Starter and 10 business days for Growth tiers.',
  },
  {
    id: 'partner-concierge',
    code: '[ BENEFIT 03 ]',
    title: 'Dedicated Partner Concierge',
    highlight: '< 4 Business Hours Response',
    description:
      'Direct liaison access to Exvorta solution architects via partners@exvorta.com for fast client scoping, proposal generation, and technical validation.',
  },
  {
    id: 'enablement-collateral',
    code: '[ BENEFIT 04 ]',
    title: 'Co-Branded Enablement Collateral',
    highlight: 'Turnkey Advisory Assets',
    description:
      'Receive white-label and co-branded trade readiness teardowns, PDF briefs, and digital export benchmarks tailored for your advisory client presentations.',
  },
  {
    id: 'lifetime-attribution',
    code: '[ BENEFIT 05 ]',
    title: 'Lifetime Account Attribution',
    highlight: 'Permanent Relationship Lock',
    description:
      'Referred client accounts remain permanently attributed to your partner ID. Earn 20% revenue share on subsequent expansion phases and platform add-ons.',
  },
] as const

export const PARTNER_FAQS: readonly PartnerFaq[] = [
  {
    question: 'What is the commission payout schedule?',
    answer:
      'Partner commissions are disbursed on a Net-15 schedule following cleared settlement of client invoices. For dual-milestone engagements (50% upfront deposit / 50% upon deployment), commissions are remitted proportionally or upon final project delivery per your partner agreement.',
  },
  {
    question: 'What payment methods and currencies are supported for commission disbursements?',
    answer:
      'Disbursements are remitted via SWIFT international wire, UAE local bank transfer (IBAN), or direct electronic fund transfer. Commissions are denominated in USD or AED with complete remittance advice and reconciliation statements issued upon transfer.',
  },
  {
    question: 'Who maintains ownership of the client relationship?',
    answer:
      'You maintain 100% ownership of your primary client advisory relationship. Exvorta operates strictly as the specialized technical execution arm for digital export infrastructure. We never solicit or compete for tax, legal, customs clearance, or corporate formation services.',
  },
  {
    question: 'How are client confidentiality and Non-Disclosure Agreements (NDAs) enforced?',
    answer:
      'Every engagement is safeguarded by strict mutual Non-Disclosure Agreements. Exvorta treats all client trade documentation, commercial specifications, and strategic roadmaps as privileged corporate assets, never disclosing partner referral arrangements without consent.',
  },
  {
    question: 'How are referrals tracked and attributed to our partner account?',
    answer:
      'Referrals are tracked through unique Partner Identification Codes and direct registration with our concierge desk at partners@exvorta.com. Once an introduction is recorded, lifetime attribution is locked into our partner registry prior to client contact.',
  },
  {
    question: 'What are the eligibility requirements to join the Exvorta Partner Program?',
    answer:
      'The Exvorta Partner Program is open to licensed professional advisory practices, including corporate tax and VAT consultancies, licensed clearing agents and customs brokers, free-zone setup specialists, and corporate service providers serving cross-border trade entities.',
  },
] as const

export const DIRECT_PARTNER_CONTACT: DirectPartnerContact = {
  email: 'partners@exvorta.com',
  conciergeSla: '< 4 business hours',
  desk: 'Exvorta Partner Desk',
  channel: 'Direct Partner Inquiries & Introductions',
} as const

export const COMMISSION_HIGHLIGHTS: readonly CommissionHighlight[] = [
  {
    value: '20%',
    label: 'Revenue Share',
    description: 'Uncapped rev-share on all project tiers and add-ons',
  },
  {
    value: '5-10 Days',
    label: 'Delivery SLA',
    description: 'Guaranteed turnaround for client deployment',
  },
  {
    value: '< 14 Days',
    label: 'Payout Velocity',
    description: 'Net-15 post-settlement electronic wire',
  },
  {
    value: 'Zero Risk',
    label: 'Execution Assured',
    description: 'Institutional delivery guarantee with zero partner liability',
  },
] as const
