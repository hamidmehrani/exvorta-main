import React from 'react'
import { AnimatedSection, Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import type { WaitlistFormBlock as WaitlistFormBlockType } from '@/payload-types'
import WaitlistClientForm from './WaitlistClientForm'

const PERKS = [
  { title: 'Docs', desc: 'Zero-trust document data room with AI classification.', phase: 'Q3 2026' },
  { title: 'Track', desc: 'Real-time multimodal shipment visibility dashboard.', phase: 'Q3 2026' },
  { title: 'CRM', desc: 'Counterparty risk management built for trade desks.', phase: 'Q1 2027' },
  { title: 'Intel', desc: 'Predictive commodity forecasting & risk analysis.', phase: 'Q3 2027' },
]

export const WaitlistFormBlock: React.FC<WaitlistFormBlockType> = ({
  placeholder,
  buttonText,
  source,
}) => {
  return (
    <AnimatedSection className="w-full bg-brand-obsidian flex flex-col items-center justify-center relative px-6 py-32 flex-grow overflow-hidden rounded-none border-t border-white/10">
      {/* Background effect */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_50%)] rounded-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.1 }}></div>
      {/* Emerald aura */}
      <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[380px] rounded-full bg-brand-emerald/10 blur-[130px]" />
      {/* Global Noise Overlay for Institutional Feel inside the dark section */}
      <div className="absolute inset-0 z-0 bg-noise mix-blend-overlay rounded-none pointer-events-none" style={{ opacity: 0.03 }}></div>

      {/* Content Container */}
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center relative z-10">

        {/* Typography Block */}
        <Reveal y={14}>
          <div className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase mb-8">
            [ EXVORTA ECOSYSTEM ]
          </div>
        </Reveal>

        <Reveal y={22}>
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-white mb-6 leading-tight">
            Request Alpha Access.
          </h1>
        </Reveal>

        <Reveal y={16} delay={0.12}>
          <p className="text-base md:text-lg text-white/50 font-light leading-relaxed mb-10 max-w-lg mx-auto">
            The Exvorta Suite is in closed beta. Enter your corporate email to
            reserve your position — early partners shape the roadmap.
          </p>
        </Reveal>

        <Reveal y={20} delay={0.2} className="w-full max-w-2xl mx-auto">
          <WaitlistClientForm
            placeholder={placeholder || ''}
            buttonText={buttonText || ''}
            source={source || ''}
          />
        </Reveal>

        {/* What you get — module grid */}
        <Reveal y={20} delay={0.3} className="w-full mt-16">
          <StaggerContainer delayChildren={0.15} staggerChildren={0.1} className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 border border-white/10 text-start max-w-2xl mx-auto w-full">
            {PERKS.map((p) => (
              <StaggerItem key={p.title} className="h-full">
                <div className="bg-brand-obsidian p-5 flex flex-col gap-1.5 hover:bg-white/[0.04] transition-colors h-full">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-white font-medium tracking-wide">{p.title}</span>
                    <span className="font-mono text-[8px] tracking-[0.15em] text-brand-emerald/80 uppercase">{p.phase}</span>
                  </div>
                  <span className="text-xs text-white/45 font-light leading-relaxed">{p.desc}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Reveal>

        {/* Security Micro-copy */}
        <Reveal y={12} delay={0.4}>
          <div className="mt-8 flex flex-col items-center gap-2">
            <div className="flex items-center gap-3 opacity-40">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              <div className="text-[8px] font-mono tracking-widest text-white/80 uppercase">
                End-to-End Encrypted Data Transmission
              </div>
            </div>
            <div className="text-[9px] font-mono text-white/25 tracking-[0.15em] uppercase">
              * Active Exvorta Web clients bypass the waitlist automatically
            </div>
          </div>
        </Reveal>
      </div>
    </AnimatedSection>
  )
}

export default WaitlistFormBlock
