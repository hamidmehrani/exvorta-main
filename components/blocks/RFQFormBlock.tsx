import React from 'react'
import { AnimatedSection } from '@/components/ui/Reveal';
import type { RFQFormBlock as RFQFormBlockType } from '@/payload-types'
import RFQForm from '@/components/forms/RFQForm'

export const RFQFormBlock: React.FC<RFQFormBlockType> = (props) => {
  const { title, subtitle, phases } = props;
  
  return (
    <AnimatedSection className="w-full bg-[#FCFAF8] min-h-screen">
      <div className="w-full mx-auto flex flex-col md:flex-row min-h-[calc(100vh-5rem)] border-b border-[#E5E5E5]">
        {/* Left Column */}
        <div className="w-full md:w-[40%] bg-[#0D0D0D] p-8 md:p-16 lg:p-24 flex flex-col justify-center border-r border-[#E5E5E5] relative">
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold mb-6 leading-tight text-white">
              {title || 'Initiate Strategic Alignment.'}
            </h1>
            <p className="text-base text-gray-300 font-sans font-light mb-16 leading-relaxed">
              {subtitle || 'Submit your operational requirements. Our engineering directors review all RFQs within 24 hours to determine architectural fit.'}
            </p>
            <div className="space-y-6">
              <h3 className="text-xs font-mono tracking-widest text-white/50 uppercase mb-8">What Happens Next</h3>
              <ul className="space-y-6 text-sm font-mono text-white/80">
                {phases && phases.length > 0 ? (
                  phases?.map((phase, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="text-white/40">{phase.stepNumber}</span>
                      <span>{phase.stepName}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="flex items-start gap-4">
                      <span className="text-white/40">01.</span>
                      <span>Discovery</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="text-white/40">02.</span>
                      <span>Scope Blueprint</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="text-white/40">03.</span>
                      <span>Execution</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-[60%] bg-[#FCFAF8] p-8 md:p-16 lg:p-24 flex items-center">
          <div className="max-w-2xl mx-auto w-full">
            <RFQForm />
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default RFQFormBlock
