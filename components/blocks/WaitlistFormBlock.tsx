import React from 'react'
import { AnimatedSection } from '@/components/ui/Reveal';
import type { WaitlistFormBlock as WaitlistFormBlockType } from '@/payload-types'
import WaitlistClientForm from './WaitlistClientForm'

export const WaitlistFormBlock: React.FC<WaitlistFormBlockType> = ({
  placeholder,
  buttonText,
  source,
}) => {
  return (
    <AnimatedSection className="w-full bg-brand-obsidian flex flex-col items-center justify-center relative px-6 py-32 flex-grow overflow-hidden rounded-none border-t border-white/10">
      {/* Background effect */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_50%)] rounded-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.1 }}></div>
      {/* Global Noise Overlay for Institutional Feel inside the dark section */}
      <div className="absolute inset-0 z-0 bg-noise mix-blend-overlay rounded-none pointer-events-none" style={{ opacity: 0.03 }}></div>
      
      {/* Content Container */}
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center relative z-10">

        {/* Typography Block */}
        <div className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase mb-8">
          [ EXVORTA ECOSYSTEM ]
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-semibold text-white mb-6 leading-tight">
          Request Alpha Access.
        </h1>

        <p className="text-base md:text-lg text-white/50 font-light leading-relaxed mb-12 max-w-lg mx-auto">
          The Exvorta Suite (Docs, Track, CRM, Intel) is currently in closed beta. Enter your corporate email to join the waitlist.
          <br /><br />
          <span className="text-white/30 text-sm italic font-mono">* Note: Active Exvorta Web architectural clients bypass the waitlist automatically.</span>
        </p>

        <WaitlistClientForm
          placeholder={placeholder || ''}
          buttonText={buttonText || ''}
          source={source || ''}
        />

        {/* Security Micro-copy */}
        <div className="mt-8 flex items-center gap-3 opacity-30">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald"></div>
          <div className="text-[8px] font-mono tracking-widest text-white/80 uppercase">
            End-to-End Encrypted Data Transmission
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default WaitlistFormBlock
