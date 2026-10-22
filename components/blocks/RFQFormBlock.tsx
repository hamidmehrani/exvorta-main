import React from 'react'
import { AnimatedSection, Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import type { RFQFormBlock as RFQFormBlockType } from '@/payload-types'
import RFQForm from '@/components/forms/RFQForm'

const GUARANTEES = [
  ['NO OBLIGATION', 'A quote costs nothing and commits you to nothing.'],
  ['24H RESPONSE', 'An engineering director reviews every RFQ personally.'],
  ['YOUR DATA STAYS YOURS', 'Encrypted, never sold, never shared. GDPR-grade.'],
]

export const RFQFormBlock: React.FC<RFQFormBlockType> = (props) => {
  const { title, subtitle, phases } = props;

  return (
    <AnimatedSection className="w-full bg-cream pt-[var(--header-h)]">
      <div className="mx-auto flex min-h-[calc(100vh-var(--header-h))] w-full flex-col border-b border-rule md:flex-row">
        {/* Left Column */}
        <div className="on-dark relative isolate flex w-full flex-col justify-center overflow-hidden bg-obsidian p-8 md:w-[40%] md:p-16 lg:p-24">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="bg-aura-dark absolute inset-0 opacity-70" />
            <div className="bg-blueprint-grid-dark absolute inset-0" />
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <Reveal y={10} duration={0.5}>
              <p className="eyebrow eyebrow-dark mb-8">
                <span className="eyebrow-index" aria-hidden>
                  <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
                </span>
                Request for proposal
              </p>
            </Reveal>
            <Reveal y={20}>
              <h1 className="mb-6 font-serif text-headline font-semibold text-white">
                {title || 'Initiate Strategic Alignment.'}
              </h1>
            </Reveal>
            <Reveal y={16} delay={0.12}>
              <p className="mb-16 text-lede font-light text-muted-dark">
                {subtitle || 'Submit your operational requirements. Our engineering directors review all RFQs within 24 hours to determine architectural fit.'}
              </p>
            </Reveal>
            <Reveal y={16} delay={0.22}>
              <div>
                <h2 className="eyebrow eyebrow-dark mb-6">What Happens Next</h2>
                <StaggerContainer as="ul" delayChildren={0.35} staggerChildren={0.14} className="border-t border-rule-dark font-mono text-sm text-white/80">
                  {phases && phases.length > 0 ? (
                    phases?.map((phase, i) => (
                      <StaggerItem as="li" key={i} className="flex items-start gap-4 border-b border-rule-dark py-4">
                        <span className="text-success">{phase.stepNumber}</span>
                        <span>{phase.stepName}</span>
                      </StaggerItem>
                    ))
                  ) : (
                    <>
                      <StaggerItem as="li" className="flex items-start gap-4 border-b border-rule-dark py-4"><span className="text-success">01.</span><span><span className="text-white">Discovery call</span> <span className="text-muted-dark">— 30 min, this week</span></span></StaggerItem>
                      <StaggerItem as="li" className="flex items-start gap-4 border-b border-rule-dark py-4"><span className="text-success">02.</span><span><span className="text-white">Scope blueprint &amp; fixed quote</span> <span className="text-muted-dark">— within 48h</span></span></StaggerItem>
                      <StaggerItem as="li" className="flex items-start gap-4 border-b border-rule-dark py-4"><span className="text-success">03.</span><span><span className="text-white">Build kickoff</span> <span className="text-muted-dark">— no obligation until you approve</span></span></StaggerItem>
                    </>
                  )}
                </StaggerContainer>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex w-full items-center bg-cream p-8 md:w-[60%] md:p-16 lg:p-24">
          <div className="mx-auto w-full max-w-2xl">
            <Reveal y={24} delay={0.15}>
              <RFQForm />
            </Reveal>
            <Reveal y={16} delay={0.3}>
              <div className="mt-14 grid grid-cols-1 gap-6 border-t border-rule pt-8 sm:grid-cols-3">
                {GUARANTEES.map(([t, d]) => (
                  <div key={t} className="flex flex-col gap-2">
                    {/* Wide label tracking wrapped "YOUR DATA STAYS YOURS" onto two lines and
                        pushed its copy out of line with the other columns. */}
                    <span className="flex items-center gap-2 whitespace-nowrap font-mono text-label font-medium uppercase tracking-widest text-emerald">
                      <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 13l4 4L19 7" /></svg>
                      {t}
                    </span>
                    <span className="text-sm font-light leading-relaxed text-muted">{d}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default RFQFormBlock
