import React from 'react'
import { AnimatedSection, Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import type { RFQFormBlock as RFQFormBlockType } from '@/payload-types'
import RFQForm from '@/components/forms/RFQForm'

export const RFQFormBlock: React.FC<RFQFormBlockType> = (props) => {
  const { title, subtitle, phases } = props;

  return (
    <AnimatedSection className="w-full bg-cream pt-[var(--header-h)]">
      <div className="w-full mx-auto flex flex-col md:flex-row min-h-[calc(100vh-var(--header-h))] border-b border-obsidian/10">
        {/* Left Column */}
        <div className="w-full md:w-[40%] bg-obsidian p-8 md:p-16 lg:p-24 flex flex-col justify-center relative overflow-hidden">
          {/* ambient glow */}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,color-mix(in_oklab,var(--color-emerald)_14%,transparent),transparent_55%)]" />
          <div className="max-w-md mx-auto w-full relative">
            <Reveal y={20}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold mb-6 leading-tight text-white">
                {title || 'Initiate Strategic Alignment.'}
              </h1>
            </Reveal>
            <Reveal y={16} delay={0.12}>
              <p className="text-base text-white/75 font-sans font-light mb-16 leading-relaxed">
                {subtitle || 'Submit your operational requirements. Our engineering directors review all RFQs within 24 hours to determine architectural fit.'}
              </p>
            </Reveal>
            <Reveal y={16} delay={0.22}>
              <div className="space-y-6">
                <h2 className="text-xs font-mono tracking-widest text-white/60 uppercase mb-8">What Happens Next</h2>
                <StaggerContainer as="ul" delayChildren={0.35} staggerChildren={0.14} className="space-y-6 text-sm font-mono text-white/80">
                  {phases && phases.length > 0 ? (
                    phases?.map((phase, i) => (
                      <StaggerItem as="li" key={i} className="flex items-start gap-4">
                        <span className="text-emerald">{phase.stepNumber}</span>
                        <span>{phase.stepName}</span>
                      </StaggerItem>
                    ))
                  ) : (
                    <>
                      <StaggerItem as="li" className="flex items-start gap-4"><span className="text-emerald">01.</span><span><span className="text-white">Discovery call</span> <span className="text-white/60">— 30 min, this week</span></span></StaggerItem>
                      <StaggerItem as="li" className="flex items-start gap-4"><span className="text-emerald">02.</span><span><span className="text-white">Scope blueprint &amp; fixed quote</span> <span className="text-white/60">— within 48h</span></span></StaggerItem>
                      <StaggerItem as="li" className="flex items-start gap-4"><span className="text-emerald">03.</span><span><span className="text-white">Build kickoff</span> <span className="text-white/60">— no obligation until you approve</span></span></StaggerItem>
                    </>
                  )}
                </StaggerContainer>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-[60%] bg-cream p-8 md:p-16 lg:p-24 flex items-center">
          <div className="max-w-2xl mx-auto w-full">
            <Reveal y={24} delay={0.15}>
              <RFQForm />
            </Reveal>
            <Reveal y={16} delay={0.3}>
              <div className="mt-14 pt-8 border-t border-obsidian/10 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  ['NO OBLIGATION', 'A quote costs nothing and commits you to nothing.'],
                  ['24H RESPONSE', 'An engineering director reviews every RFQ personally.'],
                  ['YOUR DATA STAYS YOURS', 'Encrypted, never sold, never shared. GDPR-grade.'],
                ].map(([t, d]) => (
                  <div key={t} className="flex flex-col gap-1.5">
                    <span className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] text-emerald uppercase font-bold">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                      {t}
                    </span>
                    <span className="text-xs text-muted font-light leading-relaxed">{d}</span>
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
