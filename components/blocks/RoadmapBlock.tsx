"use client";

import React, { useState } from 'react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../ui/Reveal';
import { Container } from '../ui/Container';
import { m as motion } from 'framer-motion';
import { easings, useReducedMotion } from '@/lib/animations';
import { submitLead } from '@/actions/submitLead';

export function RoadmapBlock(props: any) {
  const prefersReducedMotion = useReducedMotion();
  const [email, setEmail] = useState('');
  const [waitlistState, setWaitlistState] = useState<'idle' | 'pending' | 'done' | 'error'>('idle');
  const [waitlistError, setWaitlistError] = useState<string | null>(null);

  const handleWaitlistSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWaitlistState('pending');
    setWaitlistError(null);
    const res = await submitLead({
      source: 'Waitlist',
      email,
      botField: undefined,
      collection: 'waitlist',
    });
    if (res.success) {
      setWaitlistState('done');
      setEmail('');
    } else {
      setWaitlistState('error');
      setWaitlistError(res.error || 'Submission failed');
    }
  };

  const heading = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: easings.cinematic } },
  };

  return (
    <AnimatedSection className="w-full">
      <motion.section
        className="py-24 bg-brand-cream text-brand-obsidian border-t border-hairline-light"
        data-purpose="roadmap"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } } }}
      >
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<motion.div className="text-center mb-16" variants={heading}>
<h2 className="text-4xl md:text-5xl font-serif font-semibold text-brand-obsidian tracking-tight mb-4">The Master Plan: Exvorta Ecosystem</h2>
<p className="text-base md:text-lg text-brand-obsidian/60 max-w-2xl mx-auto font-light leading-relaxed">
        We are actively building the definitive, unified operating system for global trade.
      </p>
</motion.div>
<StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16" staggerChildren={0.14} delayChildren={0.15}>
{/*  Phase 1: Track  */}
<StaggerItem className="h-full">
<motion.div
  className="h-full bg-mockup-dashboard border border-hairline-dark rounded-2xl p-8 hover:border-hairline-dark/50 transition-all text-white relative overflow-hidden group shadow-[inset_0_0_30px_rgba(255,255,255,0.02)]"
  whileHover={prefersReducedMotion ? undefined : { y: -6 }}
  transition={{ duration: 0.3, ease: easings.cinematic }}
>
<div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }}></div>
<div className="relative z-10 text-left">
<div className="text-[8px] font-bold uppercase tracking-[0.25em] text-white/40 mb-6">[ PHASE 1 ]</div>
<h3 className="text-xl font-serif mb-4 text-white">Exvorta Track</h3>
<p className="text-xs text-gray-400 leading-relaxed font-light">End-to-end multimodal logistics telemetry and predictive freight visibility.</p>
</div>
</motion.div>
</StaggerItem>
{/*  Phase 2: CRM  */}
<StaggerItem className="h-full">
<motion.div
  className="h-full bg-mockup-dashboard border border-hairline-dark rounded-2xl p-8 hover:border-hairline-dark/50 transition-all text-white relative overflow-hidden group shadow-[inset_0_0_30px_rgba(255,255,255,0.02)]"
  whileHover={prefersReducedMotion ? undefined : { y: -6 }}
  transition={{ duration: 0.3, ease: easings.cinematic }}
>
<div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }}></div>
<div className="relative z-10 text-left">
<div className="text-[8px] font-bold uppercase tracking-[0.25em] text-white/40 mb-6">[ PHASE 2 ]</div>
<h3 className="text-xl font-serif mb-4 text-white">Exvorta CRM</h3>
<p className="text-xs text-gray-400 leading-relaxed font-light">Trade-specific counterparty risk management and global vendor intelligence.</p>
</div>
</motion.div>
</StaggerItem>
{/*  Phase 3: Intel  */}
<StaggerItem className="h-full">
<motion.div
  className="h-full bg-mockup-dashboard border border-hairline-dark rounded-2xl p-8 hover:border-hairline-dark/50 transition-all text-white relative overflow-hidden group shadow-[inset_0_0_30px_rgba(255,255,255,0.02)]"
  whileHover={prefersReducedMotion ? undefined : { y: -6 }}
  transition={{ duration: 0.3, ease: easings.cinematic }}
>
<div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }}></div>
<div className="relative z-10 text-left">
<div className="text-[8px] font-bold uppercase tracking-[0.25em] text-white/40 mb-6">[ PHASE 3 ]</div>
<h3 className="text-xl font-serif mb-4 text-white">Exvorta Intel</h3>
<p className="text-xs text-gray-400 leading-relaxed font-light">Proprietary market data, trade flows, and real-time commodities pricing benchmarks.</p>
</div>
</motion.div>
</StaggerItem>
{/*  The Vision: Suite  */}
<StaggerItem className="md:col-span-3">
<motion.div
  className="bg-mockup-dashboard border border-hairline-dark rounded-2xl p-8 md:p-12 hover:border-hairline-dark/50 transition-all text-white relative overflow-hidden group shadow-[inset_0_0_30px_rgba(255,255,255,0.02)]"
  whileHover={prefersReducedMotion ? undefined : { y: -4 }}
  transition={{ duration: 0.3, ease: easings.cinematic }}
>
<div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }}></div>
<div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
<div className="w-full md:w-2/3 text-left">
<div className="text-[8px] font-bold uppercase tracking-[0.25em] text-white/40 mb-6">[ THE VISION ]</div>
<h3 className="text-xl md:text-3xl font-serif mb-6 text-white">Exvorta Suite</h3>
<p className="text-xs md:text-sm text-gray-400 leading-relaxed font-light">
              The ultimate convergence. A singular, unified digital infrastructure seamlessly integrating your web presence, automated compliance, logistics, and intelligence into one trade OS.
            </p>
</div>
<div className="w-full md:w-1/3 flex items-center justify-center">
<div className="relative w-48 h-48 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
<motion.div className="absolute w-full h-full border border-hairline-dark rounded-full" animate={prefersReducedMotion ? undefined : { rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}></motion.div>
<motion.div className="absolute w-2/3 h-2/3 border border-hairline-dark rounded-full" animate={prefersReducedMotion ? undefined : { rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}></motion.div>
<div className="absolute inset-0 flex items-center justify-center">
<motion.div className="w-4 h-4 bg-amber-400 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.6)] z-20" animate={prefersReducedMotion ? undefined : { scale: [1, 1.18, 1], opacity: [1, 0.85, 1] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}></motion.div>
<motion.div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/40 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)]" animate={prefersReducedMotion ? undefined : { opacity: [0.4, 1, 0.4] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}></motion.div>
<motion.div className="absolute bottom-1/4 right-0 w-2 h-2 bg-amber-500/60 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.3)]" animate={prefersReducedMotion ? undefined : { opacity: [1, 0.4, 1] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}></motion.div>
<div className="absolute top-1/4 left-0 w-1.5 h-1.5 bg-white/30 rounded-full"></div>
<svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
<path d="M50 50 L50 0 M50 50 L100 75 M50 50 L0 75" fill="none" stroke="white" strokeDasharray="2,2" strokeWidth="0.5"></path>
</svg>
</div>
</div>
</div>
</div>
</motion.div>
</StaggerItem>
</StaggerContainer>
{/*  Waitlist UI  */}
<motion.div
  className="max-w-[115%] w-full max-w-xl mx-auto text-center"
  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
  whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-60px' }}
  transition={{ duration: 0.7, delay: 0.2, ease: easings.cinematic }}
>
{waitlistState === 'done' ? (
<div className="text-center py-3 border border-brand-obsidian/20 bg-brand-obsidian/5">
<span className="text-sm font-mono tracking-widest uppercase text-brand-obsidian">[ YOU ARE ON THE LIST — CHECK YOUR INBOX ]</span>
</div>
) : (
<form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-4">
<input
  className="flex-1 bg-transparent border-t-0 border-x-0 border-b border-brand-obsidian/20 focus:ring-0 focus:border-brand-obsidian text-sm py-3 placeholder:text-brand-obsidian/50"
  placeholder="Enter official corporate email..."
  type="email"
  required
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  disabled={waitlistState === 'pending'}
/>
<button type="submit" disabled={waitlistState === 'pending'} className="px-10 py-4 bg-brand-obsidian text-white text-[11px] font-medium tracking-widest uppercase hover:bg-black/80 transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] whitespace-nowrap disabled:opacity-60">
          {waitlistState === 'pending' ? '[ SUBMITTING... ]' : '[ REQUEST EARLY ACCESS ]'}
        </button>
</form>
)}
{waitlistError && (
<p className="mt-3 text-center text-sm text-red-600 font-mono">{waitlistError}</p>
)}
</motion.div>
</div>
</motion.section>
    </AnimatedSection>
  );
}

export default RoadmapBlock;
