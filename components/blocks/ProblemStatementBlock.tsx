import React from 'react'
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/ui/Reveal'
import type { Page } from '@/payload-types'
import { unbracket } from '@/lib/text'

type ProblemStatementBlockProps = Extract<NonNullable<Page['layout']>[0], { blockType: 'problemStatement' }>;

const defaultLightStatements = [
  { title: 'Look like a $100M Player.', description: 'We strip away amateur templates and apply elite, bespoke UI/UX architecture. Your digital presence will instantly match the scale and ambition of your global operations.' },
  { title: 'Turn Traffic into Contracts.', description: "Beautiful isn't enough. We engineer optimized user flows and secure intake portals that guide high-tier enterprise leads directly into your sales pipeline." },
  { title: 'You Trade. We Handle the Tech.', description: 'Stop wrestling with broken plugins. We deploy secure, hyper-fast, maintenance-free infrastructures so your team can focus strictly on moving volume.' },
]

const defaultDarkStatements = [
  { title: 'FAILED DUE DILIGENCE', description: "International partners judge your reliability in 3 seconds. A slow, template-based website screams 'high risk' to tier-1 enterprise buyers." },
  { title: 'LOST ENTERPRISE LEADS', description: "Big buyers don't fill out broken forms on generic sites. They quietly leave, taking lucrative, multi-year contracts directly to your competitors." },
  { title: 'OUTDATED INFRASTRUCTURE', description: "You shouldn't be wasting hours fighting with cheap WordPress plugins or broken mobile layouts when you need to be closing global supply deals." },
]

/** CMS titles are authored as "01. FAILED DUE DILIGENCE"; the number becomes a chip. */
function splitNumber(title: string, fallback: number): { num: string; text: string } {
  const m = title.match(/^(\d+)\.\s*(.+)$/)
  return m ? { num: m[1], text: m[2] } : { num: String(fallback).padStart(2, '0'), text: title }
}

export const ProblemStatementBlock: React.FC<ProblemStatementBlockProps> = ({
  eyebrow,
  headline,
  description,
  statements,
  theme = 'dark',
}) => {
  if (theme === 'light') {
    const items = statements && statements.length > 0 ? statements : defaultLightStatements

    return (
      <AnimatedSection className="w-full border-b border-rule bg-surface py-24 md:py-32" id="problem">
        <div className="container-site">
          <p className="eyebrow mb-16">
            <span className="eyebrow-index" aria-hidden>
              <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
            </span>
            {unbracket(eyebrow) || 'THE EXVORTA SOLUTION'}
          </p>
          <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12 lg:gap-24">
            <div className="lg:sticky lg:top-32 lg:col-span-5">
              <h2
                className="mb-8 font-serif text-headline font-semibold text-obsidian"
                dangerouslySetInnerHTML={{ __html: headline || "We don't build brochures. We engineer digital assets." }}
              />
              <p
                className="text-lede font-light text-muted"
                dangerouslySetInnerHTML={{ __html: description || "Your website shouldn't be a cost center. It should be your most relentless sales executive—working 24/7 to project authority, filter unqualified noise, and close global deals." }}
              />
            </div>
            <StaggerContainer className="flex flex-col lg:col-span-7" staggerChildren={0.12} delayChildren={0.2}>
              {items.map((stmt, idx) => (
                <StaggerItem key={idx}>
                  <div className="group border-s border-rule-strong py-2 ps-8 transition-colors duration-300 hover:border-emerald [&:not(:last-child)]:mb-14">
                    <h3 className="mb-3 font-serif text-3xl font-semibold text-obsidian">{stmt.title}</h3>
                    <p className="max-w-xl text-base font-light leading-relaxed text-muted">{stmt.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </AnimatedSection>
    )
  }

  // Dark Theme
  const items = statements && statements.length > 0 ? statements : defaultDarkStatements

  return (
    <AnimatedSection className="on-dark relative isolate w-full overflow-hidden bg-obsidian py-24 text-white md:py-32" id="problem">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-aura-dark absolute inset-0 opacity-60" />
        <div className="bg-blueprint-grid-dark absolute inset-0" />
      </div>
      <div className="container-site">
        <div className="mx-auto mb-20 max-w-3xl text-center md:mb-24">
          <p className="eyebrow eyebrow-dark mb-6 justify-center">
            <span className="eyebrow-index" aria-hidden>
              <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
            </span>
            {unbracket(eyebrow) || 'THE CREDIBILITY GAP'}
          </p>
          <h2
            className="font-serif text-headline font-semibold text-white"
            dangerouslySetInnerHTML={{ __html: headline || 'Your business moves millions. Your website looks like a startup.' }}
          />
        </div>

        <StaggerContainer className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-14" staggerChildren={0.12} delayChildren={0.2}>
          {items.map((stmt, index) => {
            const { num, text } = splitNumber(stmt.title, index + 1)
            return (
              <StaggerItem key={index}>
                <div className="group border-t border-rule-dark pt-8 transition-colors duration-300 hover:border-success">
                  <p className="eyebrow eyebrow-dark mb-5">
                    <span className="eyebrow-index">{num}</span>
                  </p>
                  <h3 className="mb-4 font-mono text-sm font-medium uppercase tracking-[0.18em] text-white">{text}</h3>
                  <p className="text-base font-light leading-relaxed text-muted-dark">{stmt.description}</p>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </div>
    </AnimatedSection>
  )
}

export default ProblemStatementBlock
