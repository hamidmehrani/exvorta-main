import React from 'react'
import Link from '@/components/ui/AppLink'
import { AnimatedSection, Reveal } from '@/components/ui/Reveal'

export interface CtaBandAction {
  label: string
  href: string
}

export interface CtaBandProps {
  /** Blueprint label above the headline. Pass without brackets. */
  eyebrow?: string
  /** Rendered inside an <h2>; already sanitised/animated by the caller. */
  headline: React.ReactNode
  description?: React.ReactNode
  primary?: CtaBandAction | null
  secondary?: CtaBandAction | null
  /** Mono microcopy under the buttons. */
  footnote?: string
  /** `dark` = obsidian band with aura + grid, `light` = white band with grid. */
  tone?: 'light' | 'dark'
  id?: string
}

/**
 * Closing statement band shared by CTA, CTA banner and the portfolio close.
 * One composition everywhere: crosshair frame, eyebrow, display headline,
 * lede, button pair. Server component; entrance is CSS via <Reveal>.
 */
export function CtaBand({
  eyebrow,
  headline,
  description,
  primary,
  secondary,
  footnote,
  tone = 'dark',
  id,
}: CtaBandProps) {
  const dark = tone === 'dark'

  return (
    <AnimatedSection
      id={id}
      className={`relative isolate w-full overflow-hidden ${
        dark ? 'on-dark bg-obsidian text-white' : 'border-y border-rule bg-surface text-obsidian'
      }`}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {dark && <div className="bg-aura-dark absolute inset-0" />}
        <div className={`absolute inset-0 ${dark ? 'bg-blueprint-grid-dark' : 'bg-blueprint-grid'}`} />
      </div>

      <div className="container-site py-24 md:py-32">
        <div className={`frame mx-auto max-w-5xl border px-6 py-16 text-center md:px-16 md:py-24 ${dark ? 'frame-dark border-rule-dark' : 'border-rule'}`}>
          {eyebrow && (
            <p className={`eyebrow mb-8 justify-center ${dark ? 'eyebrow-dark' : ''}`}>
              <span className="eyebrow-index" aria-hidden>
                <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
              </span>
              {eyebrow}
            </p>
          )}

          <h2 className={`mx-auto mb-8 max-w-4xl font-serif text-headline font-semibold ${dark ? 'text-white' : 'text-obsidian'}`}>
            {headline}
          </h2>

          {description && (
            <Reveal delay={0.2} y={14}>
              <p className={`mx-auto max-w-2xl text-lede font-light ${dark ? 'text-muted-dark' : 'text-muted'}`}>
                {description}
              </p>
            </Reveal>
          )}

          {(primary || secondary) && (
            <Reveal delay={0.3} y={14}>
              <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                {primary && (
                  <Link href={primary.href} className="btn-primary min-h-[52px] px-10 py-4">
                    {primary.label}
                  </Link>
                )}
                {secondary && (
                  <Link href={secondary.href} className="btn-ghost min-h-[52px] px-10 py-4">
                    {secondary.label}
                  </Link>
                )}
              </div>
            </Reveal>
          )}

          {footnote && (
            <p className={`eyebrow mt-10 justify-center ${dark ? 'eyebrow-dark' : ''}`}>{footnote}</p>
          )}
        </div>
      </div>
    </AnimatedSection>
  )
}

export default CtaBand
