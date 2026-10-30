export interface PricingPackage {
  id: string
  tier: string
  code: string
  name: string
  price: string
  priceDetail?: string
  currency: string
  turnaround: string
  featured: boolean
  badge?: string
  description: string
  deliverables: string[]
  cta: {
    label: string
    href: string
  }
}

export interface PricingAddOn {
  id: string
  code: string
  title: string
  description: string
  features: string[]
}

export interface LaunchpadMilestone {
  step: string
  title: string
  duration: string
  deliverables: string[]
}

export interface LaunchpadFeatureSpec {
  code: string
  badge: string
  title: string
  subtitle: string
  description: string
  milestones: LaunchpadMilestone[]
  cta: {
    label: string
    href: string
  }
}

export interface SaasModule {
  name: string
  role: string
}

export interface SaasTeaserSpec {
  badge: string
  title: string
  description: string
  modules: SaasModule[]
  cta: {
    label: string
    href: string
  }
}

export interface PricingFaq {
  question: string
  answer: string
}

export interface DirectChannel {
  index: string
  label: string
  value: string
}

export const PRICING_PACKAGES: readonly PricingPackage[] = [
  {
    id: 'starter',
    tier: 'TIER 01',
    code: '[ PACKAGE 01 ]',
    name: 'Starter',
    price: '$1,500',
    priceDetail: 'USD / Fixed Investment',
    currency: 'USD',
    turnaround: '5 business days',
    featured: false,
    description:
      'High-conversion digital trade foundation engineered for emerging exporters entering global wholesale markets with institutional velocity.',
    deliverables: [
      'Port 1:1 verified high-conversion layout',
      'Core Web Vitals guarantee (LCP < 2.0s, 95+ Mobile Score)',
      'Integrated RFQ lead capture engine with rate-limiting',
      'WhatsApp Business routing',
      'Institutional footer and compliance badges',
    ],
    cta: {
      label: '[ INITIATE RFQ ]',
      href: '/rfq',
    },
  },
  {
    id: 'growth',
    tier: 'TIER 02',
    code: '[ PACKAGE 02 ]',
    name: 'Growth',
    price: '$3,000',
    priceDetail: 'USD / Fixed Investment',
    currency: 'USD',
    turnaround: '10 business days',
    featured: true,
    badge: 'FEATURED',
    description:
      'Complete bilingual export machine with automated trade calculation tooling, HS code catalog architecture, and native Arabic RTL execution.',
    deliverables: [
      'Everything in Starter',
      'Full digital catalog with HS code mapping & downloadable specs',
      'Bilingual English + Arabic (native RTL)',
      'Verified case-study showcase',
      'Automated CBM container calculator integration',
    ],
    cta: {
      label: '[ INITIATE RFQ ]',
      href: '/rfq',
    },
  },
  {
    id: 'enterprise',
    tier: 'TIER 03',
    code: '[ PACKAGE 03 ]',
    name: 'Enterprise',
    price: 'Custom',
    priceDetail: 'Bespoke Engagement Scope',
    currency: 'USD',
    turnaround: 'Bespoke schedule',
    featured: false,
    badge: 'BESPOKE ARCHITECTURE',
    description:
      'Bespoke multi-market portals, enterprise ERP/CRM synchronizations, and dedicated compliance architectures for high-volume multinational exporters.',
    deliverables: [
      'Multi-market distributor portals',
      'Custom ERP/CRM sync',
      'Bespoke trade compliance engines',
      'Dedicated SLA',
    ],
    cta: {
      label: '[ DIRECT CONTACT ]',
      href: '/contact',
    },
  },
] as const

export const ADD_ONS: readonly PricingAddOn[] = [
  {
    id: 'arabic-rtl',
    code: '[ ADD-ON 01 ]',
    title: 'Arabic (AR) Localization & Native RTL',
    description:
      'Full linguistic and structural localization for GCC and MENA institutional buyers. Built with native right-to-left layout direction, self-hosted Vazirmatn typography, and culturally verified trade terminology.',
    features: [
      'Native right-to-left layout architecture & mirrored UI logic',
      'Self-hosted Vazirmatn variable typography with zero external CDNs',
      'Persian and Arabic dialect precision for cross-border buyer trust',
    ],
  },
  {
    id: 'container-rfq',
    code: '[ ADD-ON 02 ]',
    title: 'Interactive Container-Load RFQ Cart',
    description:
      'High-trust commercial quoting engine supporting 20ft/40ft/40ft HC container calculations, cubic meter (CBM) volume aggregation, and automated Incoterms (FOB, CIF, CFR) selection.',
    features: [
      'CBM volume & metric tonnage automated aggregation',
      'Incoterms 2020 selection logic with destination port inputs',
      'Direct sales desk payload dispatch with qualified lead metadata',
    ],
  },
  {
    id: 'managed-saas',
    code: '[ ADD-ON 03 ]',
    title: '12-Month Managed Growth SaaS Stewardship',
    description:
      'Dedicated cloud infrastructure management, continuous Core Web Vitals telemetry, zero-downtime security patching, and priority SLA support for your active export web operations.',
    features: [
      'Dedicated SLA monitoring & proactive uptime supervision',
      'Zero-downtime security patches and dependency upgrades',
      '< 24-hour engineering turnaround for catalog and scope updates',
    ],
  },
] as const

export const LAUNCHPAD_FEATURE: LaunchpadFeatureSpec = {
  code: '[ TURNKEY DUAL-MILESTONE ]',
  badge: 'LAUNCHPAD PROGRAM',
  title: 'Digital Exporter Launchpad',
  subtitle: 'The Complete Two-Milestone Trade Platform Deployment',
  description:
    'A unified turnkey program delivering a bespoke bilingual export platform, embedded container-load quoting engine, and a full year of managed SaaS stewardship.',
  milestones: [
    {
      step: 'MILESTONE 01',
      title: 'Bilingual Site & RFQ Cart Deployment',
      duration: 'Phase 1 — Launch & Verification',
      deliverables: [
        'Institutional bilingual EN/AR architecture and product catalog',
        'Container-load RFQ quoting engine with custom trade parameters',
        'Production deployment and cross-device RTL verification',
      ],
    },
    {
      step: 'MILESTONE 02',
      title: '12 Months Growth SaaS Onboarding',
      duration: 'Phase 2 — Annual Managed Growth',
      deliverables: [
        'Growth SaaS workspace onboarding and CRM/lead-routing activation',
        'Performance telemetry, security updates, and SLA stewardship',
        '12 months of fully managed cloud operations and technical support',
      ],
    },
  ],
  cta: {
    label: '[ VIEW FULL LAUNCHPAD DETAILS ]',
    href: '/launchpad',
  },
}

export const SAAS_TEASER: SaasTeaserSpec = {
  badge: '[ DOCS TIER — ROLLING OUT Q1 2027 ]',
  title: 'Exvorta Suite Exporter Operations Platform',
  description:
    'The dedicated operating system engineered for cross-border trade desks. Centralize your Trade File dossiers, generate institutional commercial documentation, track global container shipments, and synchronize buyer CRM pipelines.',
  modules: [
    { name: 'Trade File', role: 'Dossier & HS Code Repository' },
    { name: 'Docs Generation', role: 'Commercial Invoices & Packing Lists' },
    { name: 'Cargo Tracking', role: 'Real-time Container Milestones' },
    { name: 'Exporter CRM', role: 'B2B Wholesale Inquiries & Leads' },
  ],
  cta: {
    label: '[ RESERVE EARLY ACCESS ]',
    href: '/waitlist',
  },
}

export const PRICING_FAQS: readonly PricingFaq[] = [
  {
    question: 'What are the milestone payment terms?',
    answer:
      'We operate on a transparent 50/50 milestone basis: a 50% commencement deposit to initiate architecture and staging, and the remaining 50% upon verified deployment and acceptance.',
  },
  {
    question: 'What turnaround times are guaranteed?',
    answer:
      'Starter packages deploy within 5 business days. Growth packages deploy within 10 business days. Enterprise engagements follow a bespoke timeline established during initial discovery.',
  },
  {
    question: 'Who owns the intellectual property and code upon completion?',
    answer:
      'The client owns 100% of code upon completion. All source code, design systems, configurations, and assets are fully assigned to your firm with zero proprietary lock-ins or ongoing license fees.',
  },
  {
    question: 'What hosting and deployment flexibility is supported?',
    answer:
      'Platforms are deployed to modern edge architectures including Vercel, Cloudflare, or AWS edge infrastructure, optimized for low-latency delivery across your primary buyer regions.',
  },
  {
    question: 'How is lead routing security and data privacy maintained?',
    answer:
      'Lead routing security is paramount. Inquiries route strictly through authenticated server actions with zero third-party leak or tracking pixels, dispatching directly to your designated sales endpoints.',
  },
] as const

export const DIRECT_CHANNELS: readonly DirectChannel[] = [
  {
    index: '01.',
    label: 'Inquiries',
    value: 'hello@exvorta.com',
  },
  {
    index: '02.',
    label: 'Headquarters',
    value: 'Dubai, UAE — Global Reach',
  },
  {
    index: '03.',
    label: 'Response SLA',
    value: '< 24 Hours Guaranteed',
  },
] as const
