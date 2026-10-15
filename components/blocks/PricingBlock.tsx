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
          className="mb-16 md:mb-20"
        />

        <StaggerContainer className="frame grid w-full grid-cols-1 items-stretch border border-obsidian lg:grid-cols-3" staggerChildren={0.12} delayChildren={0.15}>
          {tiers.map((tier, index) => {
            const featured = index === 1
            const { num, name } = splitTierName(tier.tierName)

            return (
              <StaggerItem
                key={index}
                className={`flex flex-col p-10 lg:p-12 ${
                  featured ? 'on-dark bg-obsidian text-white' : 'bg-surface text-obsidian'
                } ${index < tiers.length - 1 ? 'border-b border-obsidian lg:border-b-0 lg:border-e' : ''}`}
              >
                {num && (
                  <p className={`eyebrow eyebrow-index mb-6 ${featured ? 'eyebrow-dark' : ''}`}>{num}</p>
                )}
                <h3 className="mb-4 font-serif text-3xl font-semibold leading-tight">{name}</h3>
                <p className={`mb-10 min-h-10 font-mono text-label uppercase !leading-relaxed ${featured ? 'text-muted-dark' : 'text-muted'}`}>
                  {tier.highlight}
                </p>
                <ul className="mb-12 flex flex-grow flex-col">
                  {tier.features?.map((f, i) => (
                    <li
                      key={i}
                      className={`flex items-start gap-3 border-t py-3.5 text-base font-light ${featured ? 'border-rule-dark text-white/85' : 'border-rule text-obsidian/85'}`}
                    >
                      <span className={`font-mono ${featured ? 'text-success' : 'text-emerald'}`} aria-hidden>+</span>
                      {f.feature}
                    </li>
                  ))}
                </ul>
                <p className={`mt-auto w-full border-t pt-4 text-center font-mono text-label uppercase ${featured ? 'border-rule-dark text-white/85' : 'border-rule text-obsidian/85'}`}>
                  {tier.price}
                </p>
              </StaggerItem>
            )
          })}
        </StaggerContainer>

        <Reveal y={14} delay={0.1}>
          <div className="mt-16 flex justify-center">
            <Link href={bottomCtaLink} className="btn-primary min-h-[52px] px-10 py-4">
              {bottomCtaText}
            </Link>
          </div>
        </Reveal>
      </div>
    </AnimatedSection>
  )
}

export default PricingBlock
