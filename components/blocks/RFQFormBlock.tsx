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
                <h3 className="text-xs font-mono tracking-widest text-white/50 uppercase mb-8">What Happens Next</h3>
                <StaggerContainer delayChildren={0.35} staggerChildren={0.14} className="space-y-6 text-sm font-mono text-white/80">
                  {phases && phases.length > 0 ? (
                    phases?.map((phase, i) => (
                      <StaggerItem key={i}>
                        <li className="flex items-start gap-4 list-none">
                          <span className="text-brand-emerald/80">{phase.stepNumber}</span>
                          <span>{phase.stepName}</span>
                        </li>
                      </StaggerItem>
                    ))
                  ) : (
                    <>
                      <StaggerItem><li className="flex items-start gap-4 list-none"><span className="text-brand-emerald/80">01.</span><span>Discovery</span></li></StaggerItem>
                      <StaggerItem><li className="flex items-start gap-4 list-none"><span className="text-brand-emerald/80">02.</span><span>Scope Blueprint</span></li></StaggerItem>
                      <StaggerItem><li className="flex items-start gap-4 list-none"><span className="text-brand-emerald/80">03.</span><span>Execution</span></li></StaggerItem>
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
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default RFQFormBlock
