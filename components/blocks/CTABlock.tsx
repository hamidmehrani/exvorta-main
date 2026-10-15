import React from 'react'
import Link from '@/components/ui/AppLink'
import { sanitizeHeadingHtml } from '@/utils/heading-sanitize'
import type { Page } from '@/payload-types'
import { AnimatedSection, Reveal } from '@/components/ui/Reveal'
import { StaggerText } from '@/components/ui/motion/StaggerText'
import { unbracket } from '@/lib/text'

type CTABlockProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'cta' }>

const isUsable = (url?: string | null): url is string => Boolean(url) && url !== '#'

/**
 * Closing statement + call to action.
 *
 * Honors every field the CMS block exposes — theme, eyebrow, both buttons and
 * the disclaimer. The previous version rendered only title and description,
 * so a CTA authored in the admin appeared with no button at all.
 */
export const CTABlock: React.FC<CTABlockProps> = (props) => {
  const dark = props.theme === 'dark'
  const headline = props.title || 'Deals are won before the first meeting.'
  const description =
    props.description ||
    'Without a credible digital presence, you are losing deals before the first conversation. Exvorta fixes this.'
  const eyebrow = unbracket(props.eyebrow)
  const hasHtml = /<[^>]+>/.test(headline) && !/^(?:[^<]|<br\s*\/?>)*$/i.test(headline)

  const primary = isUsable(props.buttonUrl) && props.buttonText ? { label: props.buttonText, href: props.buttonUrl } : null
  const secondary =
    isUsable(props.secondaryButtonUrl) && props.secondaryButtonText
      ? { label: props.secondaryButtonText, href: props.secondaryButtonUrl }
      : null

  const headingClass = `mb-8 font-serif text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl ${dark ? 'text-white' : 'text-obsidian'}`

  return (
    <AnimatedSection className={`w-full ${dark ? 'bg-obsidian' : ''}`}>
      <section className="py-32" data-purpose="the-pitch">
        <div className="mx-auto max-w-4xl px-4 text-center">
          {eyebrow && (
            <p className={`mb-8 font-mono text-[11px] uppercase tracking-[0.3em] ${dark ? 'text-white/60' : 'text-muted'}`}>
              [ {eyebrow} ]
            </p>
          )}

          {hasHtml ? (
            <h2 className={headingClass} dangerouslySetInnerHTML={{ __html: sanitizeHeadingHtml(headline) }} />
          ) : (
            <StaggerText as="h2" text={headline} unit="words" stagger={0.09} duration={0.7} mode="inView" className={headingClass} />
          )}

          <Reveal delay={0.25} y={14}>
            <p className={`mx-auto max-w-2xl text-center text-base font-light leading-relaxed md:text-lg ${dark ? 'text-white/70' : 'text-muted'}`}>
              {description}
            </p>
          </Reveal>

          {(primary || secondary) && (
            <Reveal delay={0.35} y={14}>
              <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                {primary && (
                  <Link
                    href={primary.href}
                    className={`min-h-[52px] px-10 py-4 font-semibold ${dark ? 'btn-primary bg-white text-obsidian hover:bg-cream' : 'btn-primary'}`}
                  >
                    {primary.label}
                  </Link>
                )}
                {secondary && (
                  <Link
                    href={secondary.href}
                    className={`min-h-[52px] px-10 py-4 font-semibold ${dark ? 'btn-ghost border-white text-white hover:bg-white hover:text-obsidian' : 'btn-ghost'}`}
                  >
                    {secondary.label}
                  </Link>
                )}
              </div>
            </Reveal>
          )}

          {props.disclaimer && (
            <p className={`mt-8 font-mono text-[11px] uppercase tracking-[0.2em] ${dark ? 'text-white/55' : 'text-muted'}`}>
              {props.disclaimer}
            </p>
          )}
        </div>
      </section>
    </AnimatedSection>
  )
}

export default CTABlock
