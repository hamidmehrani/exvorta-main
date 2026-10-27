import React from 'react'
import Link from '@/components/ui/AppLink'
import { AnimatedSection, Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { unbracket } from '@/lib/text'

export interface PricingTier {
  tierName: string
  price?: string
  highlight?: string
  features: { feature: string }[]
  ctaText?: string
  ctaLink?: string
}

export interface PricingBlockProps {
  eyebrow?: string
  sectionTitle?: string
  sectionSubtitle?: string
  description?: string
  tiers?: PricingTier[]
  bottomCtaText?: string
  bottomCtaLink?: string
  [key: string]: any
}

const defaultTiers: PricingTier[] = [
  {
    tierName: '01. Foundation',
    highlight: 'All packages include: Custom Design, Custom Development & Admin Panel',
    features: [
      { feature: 'SEO Foundation Setup' },
      { feature: 'Up to 5 Pages' },
      { feature: 'Mobile Responsive' },
      { feature: 'Contact Form Integration' },
      { feature: '30-Day Support' },
    ],
    price: 'Pricing Upon Proposal',
  },
  {
    tierName: '02. Professional',
    highlight: 'All packages include: Custom Design, Custom Development & Admin Panel',
    features: [
      { feature: 'SEO & Performance Optimization' },
      { feature: 'Up to 10 Pages' },
      { feature: 'Brand Identity & Guidelines' },
      { feature: 'Advanced Animations' },
      { feature: 'Multilingual Ready' },
      { feature: '60-Day Support' },
    ],
    price: 'Pricing Upon Proposal',
  },
  {
    tierName: '03. Premium',
    highlight: 'All packages include: Custom Design, Custom Development & Admin Panel',
    features: [
      { feature: 'Advanced SEO & Analytics Dashboard' },
      { feature: 'Unlimited Pages' },
      { feature: 'Full Brand System' },
      { feature: 'Admin Panel' },
      { feature: 'Priority Delivery' },
      { feature: '90-Day Support' },
    ],
    price: 'Pricing Upon Proposal',
  },
]

/** "01. Foundation" → { num: "01", name: "Foundation" }; plain names pass through. */
function splitTierName(raw: string): { num: string | null; name: string } {
  const m = raw.match(/^(\d+)\.\s*(.+)$/)
  return m ? { num: m[1], name: m[2] } : { num: null, name: raw }
}

export const PricingBlock: React.FC<PricingBlockProps> = (props) => {
  const eyebrow = unbracket(props.eyebrow) || 'SCOPE OF INVESTMENT'
  const sectionTitle = props.sectionTitle || 'Tailored Architectures.'
  const sectionSubtitle = props.sectionSubtitle || 'Scoped to Your Scale.'
  const description = props.description || 'We scope every engagement individually based on your operational complexity and market ambitions.'
  const bottomCtaText = props.bottomCtaText || '[ REQUEST A CUSTOM SCOPE ]'
  const bottomCtaLink = props.bottomCtaLink || '/rfq'
  const tiers: PricingTier[] = props.tiers && props.tiers.length > 0 ? props.tiers : defaultTiers

  // The CMS repeats the same "All packages include…" line on every tier. State it once, above the
  // ledger, and only keep a per-tier line when it differs.
  const first = tiers[0]?.highlight?.trim()
  const shared = first && tiers.every((t) => t.highlight?.trim() === first) ? first : null
  const sharedItems = shared
    ? shared
        .replace(/^all packages include:?\s*/i, '')
        .split(/\s*(?:,|&|\band\b)\s*/i)
        .map((x) => x.trim())
        .filter(Boolean)
    : []

  return (
    <AnimatedSection className="w-full border-b border-rule py-24 md:py-32">
      <div className="container-site">
        <SectionHeading
          align="center"
          eyebrow={eyebrow}
          title={
            <>
              {sectionTitle}
              <br />
              <span className="text-muted">{sectionSubtitle}</span>
            </>
          }
          description={description}
          className="mb-12 md:mb-14"
        />

        {sharedItems.length > 0 && (
          <Reveal y={12}>
            <div className="mb-10 flex flex-col items-center gap-4 md:mb-12">
              <p className="eyebrow">Included in every package</p>
              <ul className="flex flex-wrap justify-center gap-2.5">
                {sharedItems.map((item) => (
                  <li key={item} className="flex items-center gap-2 border border-rule-strong bg-surface px-3.5 py-2 font-mono text-label uppercase text-obsidian">
                    <span className="text-emerald" aria-hidden>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}

        <StaggerContainer className="frame grid w-full grid-cols-1 items-stretch border border-obsidian lg:grid-cols-3" staggerChildren={0.12} delayChildren={0.15}>
          {tiers.map((tier, index) => {
            const featured = index === 1
            const { num, name } = splitTierName(tier.tierName)
            const own = !shared && tier.highlight ? tier.highlight : null
            const tone = featured ? 'border-rule-dark text-white/85' : 'border-rule text-obsidian/85'

            return (
              <StaggerItem
                key={index}
                className={`group relative flex flex-col p-8 sm:p-10 lg:p-12 ${
                  featured ? 'on-dark bg-obsidian text-white' : 'bg-surface text-obsidian'
                } ${index < tiers.length - 1 ? 'border-b border-obsidian lg:border-b-0 lg:border-e' : ''}`}
              >
                <span
                  aria-hidden
                  className={`absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-500 ease-[var(--ease-cinematic)] group-hover:scale-x-100 ${featured ? 'bg-success' : 'bg-emerald'}`}
                />
                <div className="mb-6 flex min-h-8 items-center justify-between gap-3">
                  {num ? <p className={`eyebrow eyebrow-index ${featured ? 'eyebrow-dark' : ''}`}>{num}</p> : <span />}
                  {featured && (
                    <span className="border border-success/50 px-2.5 py-1.5 font-mono text-label uppercase text-success">Recommended</span>
                  )}
                </div>
                <h3 className="mb-3 font-serif text-3xl font-semibold leading-tight">{name}</h3>
                {own && (
                  <p className={`mb-4 font-mono text-label uppercase !leading-relaxed ${featured ? 'text-muted-dark' : 'text-muted'}`}>{own}</p>
                )}

                {/* The price slot: what it costs (or how it is quoted), then the next step — before the feature list. */}
                <div className={`mt-4 border-t pb-8 pt-6 ${tone}`}>
                  <p className="font-serif text-lede font-semibold">{tier.price || 'Pricing upon proposal'}</p>
                  <Link
                    href={tier.ctaLink || bottomCtaLink}
                    className={`mt-6 min-h-[48px] w-full px-5 py-3.5 ${featured ? 'btn-primary' : 'btn-ghost'}`}
                  >
                    {tier.ctaText || '[ REQUEST THIS SCOPE ]'}
                  </Link>
                </div>

                <ul className="flex flex-grow flex-col">
                  {tier.features?.map((f, i) => (
                    <li key={i} className={`flex items-start gap-3 border-t py-3.5 text-base font-light ${tone}`}>
                      <span className={`font-mono ${featured ? 'text-success' : 'text-emerald'}`} aria-hidden>+</span>
                      {f.feature}
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            )
          })}
        </StaggerContainer>

        {/* Not sure? Two clear next steps instead of one lonely button. */}
        <Reveal y={14} delay={0.1}>
          <div className="mx-auto mt-12 flex max-w-4xl flex-col items-center gap-6 border border-rule bg-surface px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-start md:px-10">
            <p className="max-w-sm text-base font-light text-muted">Not sure which package fits? Send a short brief and we will scope it with you.</p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link href={bottomCtaLink} className="btn-primary min-h-[48px] w-full whitespace-nowrap px-6 py-3.5 sm:w-auto">
                {bottomCtaText}
              </Link>
              <Link href="/portfolio" className="btn-ghost min-h-[48px] w-full whitespace-nowrap px-6 py-3.5 sm:w-auto">
                [ SEE THE WORK ]
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </AnimatedSection>
  )
}

export default PricingBlock
