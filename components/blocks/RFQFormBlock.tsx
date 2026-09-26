import React from 'react'
import { AnimatedSection, Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import type { RFQFormBlock as RFQFormBlockType } from '@/payload-types'
import RFQForm from '@/components/forms/RFQForm'

export const RFQFormBlock: React.FC<RFQFormBlockType> = (props) => {
  const { title, subtitle, phases } = props;

  return (
    <AnimatedSection className="w-full bg-[#FCFAF8] min-h-screen">
      <div className="w-full mx-auto flex flex-col md:flex-row min-h-[calc(100vh-5rem)] border-b border-[#E5E5E5]">
        {/* Left Column */}
        <div className="w-full md:w-[40%] bg-[#0D0D0D] p-8 md:p-16 lg:p-24 flex flex-col justify-center border-r border-[#E5E5E5] relative overflow-hidden">
          {/* ambient glow */}
          <div aria-hidden className="pointer-events-none absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full bg-brand-emerald/10 blur-[120px]" />
          <div className="max-w-md mx-auto w-full relative">
            <Reveal y={20}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold mb-6 leading-tight text-white">
                {title || 'Initiate Strategic Alignment.'}
              </h1>
            </Reveal>
            <Reveal y={16} delay={0.12}>
              <p className="text-base text-gray-300 font-sans font-light mb-16 leading-relaxed">
                {subtitle || 'Submit your operational requirements. Our engineering directors review all RFQs within 24 hours to determine architectural fit.'}
              </p>
            </Reveal>
            <Reveal y={16} delay={0.22}>
              <div className="space-y-6">
                <h2 className="text-xs font-mono tracking-widest text-white/50 uppercase mb-8">What Happens Next</h2>
                <StaggerContainer delayChildren={0.35} staggerChildren={0.14} className="space-y-6 text-sm font-mono text-white/80">
                  {phases && phases.length > 0 ? (
                    phases?.map((phase, i) => (
                      <StaggerItem key={i}>
                        <div className="flex items-start gap-4">
                          <span className="text-brand-emerald/80">{phase.stepNumber}</span>
                          <span>{phase.stepName}</span>
                        </div>
                      </StaggerItem>
                    ))
                  ) : (
                    <>
                      <StaggerItem><div className="flex items-start gap-4"><span className="text-brand-emerald/80">01.</span><span><span className="text-white">Discovery call</span> <span className="text-white/40">— 30 min, this week</span></span></div></StaggerItem>
                      <StaggerItem><div className="flex items-start gap-4"><span className="text-brand-emerald/80">02.</span><span><span className="text-white">Scope blueprint &amp; fixed quote</span> <span className="text-white/40">— within 48h</span></span></div></StaggerItem>
                      <StaggerItem><div className="flex items-start gap-4"><span className="text-brand-emerald/80">03.</span><span><span className="text-white">Build kickoff</span> <span className="text-white/40">— no obligation until you approve</span></span></div></StaggerItem>
                    </>
                  )}
                </StaggerContainer>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-[60%] bg-[#FCFAF8] p-8 md:p-16 lg:p-24 flex items-center">
          <div className="max-w-2xl mx-auto w-full">
            <Reveal y={24} delay={0.15}>
              <RFQForm />
            </Reveal>
            <Reveal y={16} delay={0.3}>
              <div className="mt-14 pt-8 border-t border-[#E5E5E5] grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  ['NO OBLIGATION', 'A quote costs nothing and commits you to nothing.'],
                  ['24H RESPONSE', 'An engineering director reviews every RFQ personally.'],
                  ['YOUR DATA STAYS YOURS', 'Encrypted, never sold, never shared. GDPR-grade.'],
                ].map(([t, d]) => (
                  <div key={t} className="flex flex-col gap-1.5">
                    <span className="flex items-center gap-2 text-[9px] font-mono tracking-[0.2em] text-brand-emerald uppercase font-bold">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                      {t}
                    </span>
                    <span className="text-xs text-black/45 font-light leading-relaxed">{d}</span>
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
