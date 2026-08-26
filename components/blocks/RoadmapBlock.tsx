"use client";

import { AnimatedSection, StaggerContainer, StaggerItem } from '../ui/Reveal';
import { Container } from '../ui/Container';

export function RoadmapBlock(props: any) {
  return (
    <AnimatedSection className="w-full">
      <section className="py-24 bg-brand-cream text-brand-obsidian border-t border-hairline-light" data-purpose="roadmap">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="text-center mb-16">
<h2 className="text-4xl md:text-5xl font-serif font-semibold text-brand-obsidian tracking-tight mb-4">The Master Plan: Exvorta Ecosystem</h2>
<p className="text-base md:text-lg text-brand-obsidian/60 max-w-2xl mx-auto font-light leading-relaxed">
        We are actively building the definitive, unified operating system for global trade.
      </p>
</div>
<StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16" staggerChildren={0.12} delayChildren={0.15}>
{/*  Phase 1: Track  */}
<StaggerItem className="h-full">
<div className="h-full bg-mockup-dashboard border border-hairline-dark rounded-2xl p-8 hover:border-hairline-dark/50 transition-all text-white relative overflow-hidden group shadow-[inset_0_0_30px_rgba(255,255,255,0.02)] hover:-translate-y-1">
<div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }}></div>
<div className="relative z-10 text-left">
<div className="text-[8px] font-bold uppercase tracking-[0.25em] text-white/40 mb-6">[ PHASE 1 ]</div>
<h3 className="text-xl font-serif mb-4 text-white">Exvorta Track</h3>
<p className="text-xs text-gray-400 leading-relaxed font-light">End-to-end multimodal logistics telemetry and predictive freight visibility.</p>
</div>
</div>
</StaggerItem>
{/*  Phase 2: CRM  */}
<StaggerItem className="h-full">
<div className="h-full bg-mockup-dashboard border border-hairline-dark rounded-2xl p-8 hover:border-hairline-dark/50 transition-all text-white relative overflow-hidden group shadow-[inset_0_0_30px_rgba(255,255,255,0.02)] hover:-translate-y-1">
<div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }}></div>
<div className="relative z-10 text-left">
<div className="text-[8px] font-bold uppercase tracking-[0.25em] text-white/40 mb-6">[ PHASE 2 ]</div>
<h3 className="text-xl font-serif mb-4 text-white">Exvorta CRM</h3>
<p className="text-xs text-gray-400 leading-relaxed font-light">Trade-specific counterparty risk management and global vendor intelligence.</p>
</div>
</div>
</StaggerItem>
{/*  Phase 3: Intel  */}
<StaggerItem className="h-full">
<div className="h-full bg-mockup-dashboard border border-hairline-dark rounded-2xl p-8 hover:border-hairline-dark/50 transition-all text-white relative overflow-hidden group shadow-[inset_0_0_30px_rgba(255,255,255,0.02)] hover:-translate-y-1">
<div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }}></div>
<div className="relative z-10 text-left">
<div className="text-[8px] font-bold uppercase tracking-[0.25em] text-white/40 mb-6">[ PHASE 3 ]</div>
<h3 className="text-xl font-serif mb-4 text-white">Exvorta Intel</h3>
<p className="text-xs text-gray-400 leading-relaxed font-light">Proprietary market data, trade flows, and real-time commodities pricing benchmarks.</p>
</div>
</div>
</StaggerItem>
{/*  The Vision: Suite  */}
<StaggerItem className="md:col-span-3">
<div className="bg-mockup-dashboard border border-hairline-dark rounded-2xl p-8 md:p-12 hover:border-hairline-dark/50 transition-all text-white relative overflow-hidden group shadow-[inset_0_0_30px_rgba(255,255,255,0.02)] hover:-translate-y-1">
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
<div className="relative w-48 h-48 flex items-center justify-center">
<div className="absolute w-full h-full border border-hairline-dark rounded-full animate-[spin_20s_linear_infinite]"></div>
<div className="absolute w-2/3 h-2/3 border border-hairline-dark rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
<div className="absolute inset-0 flex items-center justify-center">
<div className="w-4 h-4 bg-amber-400 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.6)] z-20"></div>
<div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/40 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)]"></div>
<div className="absolute bottom-1/4 right-0 w-2 h-2 bg-amber-500/60 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.3)]"></div>
<div className="absolute top-1/4 left-0 w-1.5 h-1.5 bg-white/30 rounded-full"></div>
<svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
<path d="M50 50 L50 0 M50 50 L100 75 M50 50 L0 75" fill="none" stroke="white" strokeDasharray="2,2" strokeWidth="0.5"></path>
</svg>
</div>
</div>
</div>
</div>
</div>
</StaggerItem>
</StaggerContainer>
{/*  Waitlist UI  */}
<div className="max-w-[115%] w-full max-w-xl mx-auto text-center">
<div className="flex flex-col sm:flex-row gap-4">
<input className="flex-1 bg-transparent border-t-0 border-x-0 border-b border-brand-obsidian/20 focus:ring-0 focus:border-brand-obsidian text-sm py-3 placeholder:text-brand-obsidian/50" placeholder="Enter official corporate email..." type="email"/>
<button className="px-10 py-4 bg-brand-obsidian text-white text-[11px] font-medium tracking-widest uppercase hover:bg-black/80 transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] whitespace-nowrap">
          [ REQUEST EARLY ACCESS ]
        </button>
</div>
</div>
</div>
</section>
    </AnimatedSection>
  );
}

export default RoadmapBlock;
