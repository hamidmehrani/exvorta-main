"use client";
import React from 'react';
import { AnimatedSection, Reveal, EASE_OUT } from '@/components/ui/Reveal';
import { m } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { Button } from '@/components/ui/Button';
import { Hairline } from '@/components/ui/Hairline';
import { StaggerText } from '@/components/ui/motion';
import { Parallax } from '@/components/ui/motion';
// import Link from 'next/link';

import type {  Ecosystem  } from '@/payload-types';

export function EcosystemBlock({ data }: { data?: Ecosystem }) {
  const hero = data?.hero || {
    eyebrow: '[ THE EXVORTA SUITE ]',
    title: 'A Unifying Core',
    subtitle: 'for Global Trade.',
    description: 'One integrated operating system connecting your web presence, documents, logistics, and intelligence.',
    badge: 'SUITE'
  };
  const problem = data?.problem || {
    eyebrow: '[ THE FRAGMENTATION PROBLEM ]',
    title: 'Trade runs on scattered tools.',
    description: 'WhatsApp threads, Excel sheets, and email chains. Your operations deserve better infrastructure.'
  };
  const vision = data?.vision || {
    badge: '[ THE VISION ]',
    title: 'One trade OS.',
    subtitle: 'Every workflow.',
    description: 'The Exvorta Suite unifies every product into a single, seamless platform for global traders.'
  };
  const roadmap = data?.roadmap || {
    eyebrow: '[ ROADMAP ]',
    title: 'The Master Plan'
  };
  const cta = data?.cta || {
    eyebrow: '[ GET STARTED ]',
    title: 'Ready to upgrade your trade infrastructure?',
    subtitle: 'Two ways to begin.',
    description: 'Request a web proposal or join the waitlist for the Exvorta Suite.',
    primaryCtaText: '[ REQUEST PROPOSAL ]',
    primaryCtaLink: '/rfq',
    secondaryCtaText: '[ JOIN SOFTWARE WAITLIST ]',
    secondaryCtaLink: '/waitlist',
    disclaimer: '* Web proposals are subject to capacity constraints.'
  };

  return (
    <div className="pt-20">
      <AnimatedSection priority className="w-full bg-brand-obsidian min-h-[75vh] flex items-center justify-center relative px-4 sm:px-6 lg:px-8 py-40 overflow-hidden border-b border-white/20" id="ecosystem-hero">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_80%)] animate-pulse [animation-duration:12s]"></div>
        <Container className="max-w-6xl w-full flex flex-col items-center text-center relative z-10">
          <Reveal priority y={16}><MonoLabel className="text-[9px] md:text-[10px] font-mono tracking-[0.4em] text-white/55 uppercase mb-10 block">{hero.eyebrow}</MonoLabel></Reveal>
          <Reveal priority y={24} delay={0.1} className="w-full">
            <h1 className="text-4xl sm:text-5xl md:text-[5.5rem] lg:text-[6.5rem] font-serif font-bold text-white leading-[1.0] tracking-tight mb-8">
              <StaggerText
                as="span"
                text={hero.title || ''}
                unit="chars"
                stagger={0.024}
                duration={0.8}
              />
              <br />
              <span className="text-white/60">
                <StaggerText
                  as="span"
                  text={hero.subtitle || ''}
                  unit="chars"
                  stagger={0.024}
                  duration={0.8}
                />
              </span>
            </h1>
          </Reveal>
          <m.div aria-hidden initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 1.2, delay: 0.5, ease: EASE_OUT }} className="w-40 h-px bg-brand-emerald/60 origin-center mb-10" />
<Reveal y={16} delay={0.45}>
<p className="max-w-3xl mx-auto text-lg md:text-xl text-white/50 leading-relaxed font-sans">
      {hero.description}
    </p>
</Reveal>
<Reveal y={12} delay={0.55}><MonoLabel className="text-[9px] font-mono text-white/25 tracking-[0.2em] uppercase mt-16 z-10">{hero.badge}</MonoLabel></Reveal>
</Container>
</AnimatedSection>

<AnimatedSection className="w-full bg-brand-cream py-16 sm:py-24 md:py-32 lg:py-48 px-4 sm:px-6 lg:px-8 border-b border-brand-obsidian" id="ecosystem-problem"><Container className="max-w-5xl mx-auto flex flex-col items-center text-center"><MonoLabel className="text-[10px] font-mono tracking-[0.2em] text-black/40 uppercase mb-12 block relative"><div className="absolute -top-12 left-1/2 w-[1px] h-8 bg-black/10"></div> {problem.eyebrow} </MonoLabel><StaggerText as="h2" text={problem.title || ''} unit="words" stagger={0.09} duration={0.7} className="text-4xl md:text-5xl lg:text-6xl font-serif text-black leading-[1.1] tracking-tight mb-12" /><p className="text-xl md:text-2xl text-black/60 font-sans leading-relaxed max-w-4xl mx-auto font-light"> {problem.description} </p></Container></AnimatedSection>

<AnimatedSection className="w-full bg-brand-obsidian py-16 sm:py-24 md:py-32 lg:py-48 px-4 sm:px-6 lg:px-8 border-b border-white/20 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03)_0%,transparent_70%)]" id="product-web">
<Container className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

<div className="lg:col-span-5 flex flex-col justify-center">
<div className="flex items-center gap-4 mb-6">
<MonoLabel className="text-[10px] font-mono tracking-[0.2em] text-white/55 uppercase">[ MODULE 01 ]</MonoLabel>
<div className="px-2.5 py-1 border border-brand-emerald flex items-center gap-2 bg-brand-emerald/20">
<div className="w-1.5 h-1.5 animate-pulse bg-brand-emerald"></div>
<span className="text-[9px] font-mono tracking-[0.2em] uppercase font-bold text-brand-emerald">LIVE</span>
</div>
</div>
<h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Exvorta Web.</h2>
<p className="text-lg text-white/50 font-sans leading-relaxed mb-10">
                Bespoke digital architecture for global trading entities. We replace fragile templates with hardcoded, high-performance web infrastructure designed entirely for institutional authority and tier-one lead acquisition.
            </p>
<Button className="w-max max-w-full bg-white text-black px-6 sm:px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-mono hover:bg-gray-200 transition-all border border-white flex items-center gap-3" href="/web">
                [ VIEW ARCHITECTURE ]
            </Button>
</div>

<div className="lg:col-span-7">
<Parallax speed={24}>
<Reveal y={36} duration={0.9}>
<div className="bg-mockup-card border border-white/20 aspect-[4/3] overflow-hidden relative group shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)]">

<div className="h-10 bg-white/[0.03] border-b border-white/20 flex items-center px-4 justify-between">
<div className="flex gap-1.5">
<div className="w-2.5 h-2.5 bg-white/20"></div>
<div className="w-2.5 h-2.5 bg-white/20"></div>
<div className="w-2.5 h-2.5 bg-white/20"></div>
</div>
<div className="font-mono text-[9px] tracking-[0.3em] text-white/30">EXVORTA // RAD_VIEWPORT</div>
<div className="w-12"></div>
</div>

<div className="p-6 h-[calc(100%-2.5rem)] relative overflow-hidden grid-bg-brand-emerald opacity-20"></div>
<div className="absolute inset-0 p-4 sm:p-8 flex flex-col gap-2 sm:gap-6 overflow-x-auto">
<div className="mt-1 sm:mt-4 grid grid-cols-3 gap-2 sm:gap-4 sm:min-w-[500px]">
<div className="h-14 sm:h-20 overflow-hidden bg-mockup-card border border-white/20 p-2 sm:p-3 flex flex-col justify-between">
<div className="w-8 h-1 bg-white/20"></div>
<div className="w-16 max-w-full h-2 bg-brand-emerald/20"></div>
</div>
<div className="h-14 sm:h-20 overflow-hidden bg-mockup-card border border-white/20 p-2 sm:p-3 flex flex-col justify-between">
<div className="w-10 h-1 bg-white/20"></div>
<div className="w-12 max-w-full h-2 bg-white/5"></div>
</div>
<div className="h-14 sm:h-20 overflow-hidden bg-mockup-card border border-white/20 p-2 sm:p-3 flex flex-col justify-between">
<div className="w-6 h-1 bg-white/20"></div>
<div className="w-14 max-w-full h-2 bg-white/5"></div>
</div>
</div>

<div className="flex-1 bg-mockup-card border border-white/20 relative p-2 sm:p-6">
<div className="absolute inset-0 flex items-center justify-center">
<svg className="w-full h-14 sm:h-32 opacity-40" fill="none" preserveAspectRatio="none" viewBox="0 0 400 100">
<path d="M0 80 Q 50 20, 100 70 T 200 40 T 300 80 T 400 30" fill="none" stroke="var(--color-brand-emerald)" strokeDasharray="4 2" strokeWidth="1"></path>
<path d="M0 90 Q 70 40, 150 60 T 280 20 T 400 50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"></path>
</svg>
</div>
<div className="relative z-10 space-y-3 sm:min-w-[500px]">
<div className="w-1/3 h-1 bg-white/10"></div>
<div className="w-1/4 h-1 bg-white/5"></div>
</div>
</div>

<div className="flex gap-2 sm:gap-4">
<div className="flex-1 h-1 bg-white/5"></div>
<div className="flex-1 h-1 bg-white/5"></div>
<div className="flex-1 h-1 bg-white/5"></div>
</div>
</div>
</div>
</Reveal>
</Parallax>
</div>
</Container>
</AnimatedSection>

<AnimatedSection className="w-full bg-brand-cream py-16 sm:py-24 md:py-32 lg:py-48 px-4 sm:px-6 lg:px-8 border-b border-brand-obsidian" id="product-docs">
<Container className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

<div className="order-2 lg:order-1 lg:col-span-7">
<Parallax speed={24}>
<Reveal y={36} duration={0.9}>
<div className="bg-white border border-brand-obsidian md:aspect-[4/3] overflow-hidden relative group flex flex-col shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)]">

<div className="h-10 shrink-0 bg-brand-cream border-b border-brand-obsidian flex items-center gap-3 px-4 justify-between">
<div className="flex gap-1.5 shrink-0">
<div className="w-2.5 h-2.5 bg-black/10"></div>
<div className="w-2.5 h-2.5 bg-black/10"></div>
<div className="w-2.5 h-2.5 bg-black/10"></div>
</div>
<div className="font-mono text-[8px] sm:text-[9px] tracking-[0.12em] sm:tracking-[0.3em] text-black/50 uppercase truncate">docs.exvorta.com // ALPHA</div>
<div className="hidden sm:block w-12 shrink-0"></div>
</div>

<div className="flex flex-col md:h-[calc(100%-2.5rem)] bg-white">

<div className="flex flex-wrap sm:flex-nowrap border-b border-brand-obsidian px-4 sm:px-6 lg:px-8 pt-4 gap-3 sm:gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
<div className="shrink-0 whitespace-nowrap text-[8px] sm:text-[9px] font-mono tracking-widest text-brand-emerald border-b border-brand-emerald pb-2 uppercase">[ Commercial Invoice ]</div>
<div className="shrink-0 whitespace-nowrap text-[8px] sm:text-[9px] font-mono tracking-widest text-black/40 pb-2 uppercase">[ Packing List ]</div>
<div className="shrink-0 whitespace-nowrap text-[8px] sm:text-[9px] font-mono tracking-widest text-black/40 pb-2 uppercase">[ Certificate of Origin ]</div>
</div>

<div className="flex flex-col md:flex-row md:flex-1 p-4 sm:p-6 gap-5 sm:gap-8">

<div className="w-full md:w-1/2 min-w-0 flex flex-col justify-between gap-4 md:gap-0">
<div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
<div>
<div className="text-[8px] font-mono text-black/60 uppercase mb-1">Exporter</div>
<div className="h-8 border border-brand-obsidian bg-white flex items-center px-3">
<div className="w-1.5 h-3" style={{backgroundColor: "var(--color-brand-emerald)"}}></div>
</div>
</div>
<div>
<div className="text-[8px] font-mono text-black/60 uppercase mb-1">Consignee</div>
<div className="h-8 border border-brand-obsidian bg-white"></div>
</div>
<div>
<div className="text-[8px] font-mono text-black/60 uppercase mb-1">HS Code</div>
<div className="h-8 border border-brand-obsidian bg-white"></div>
</div>
<div>
<div className="text-[8px] font-mono text-black/60 uppercase mb-1">Declared Value</div>
<div className="h-8 border border-brand-obsidian bg-white"></div>
</div>
<div>
<div className="text-[8px] font-mono text-black/60 uppercase mb-1">Origin Country</div>
<div className="h-8 border border-brand-obsidian bg-white"></div>
</div>
</div>
<Button className="w-full bg-brand-obsidian text-white text-[9px] font-mono tracking-widest uppercase py-3 border border-brand-obsidian font-bold hover:bg-[#1a1a1a] transition-colors mt-4">
                        Generate Document
                    </Button>
</div>

<div className="w-full md:w-1/2 min-w-0 bg-brand-cream border border-brand-obsidian p-4 sm:p-6 min-h-[160px] relative overflow-hidden flex flex-col justify-center items-center">
<div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
<span className="font-serif text-3xl font-bold tracking-widest -rotate-45 text-black">EXVORTA</span>
</div>
<div className="w-full space-y-4 relative z-10">
<div className="w-3/4 h-2 bg-black/10"></div>
<div className="w-full h-2 bg-black/10"></div>
<div className="w-5/6 h-2 bg-black/10"></div>
<div className="w-2/3 h-2 bg-black/10"></div>
</div>

<div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
<div className="border border-brand-emerald text-brand-emerald font-mono text-3xl font-bold tracking-widest px-4 py-2 rotate-12 opacity-80 relative bg-white">
<span className="animated-stamp inline-block"></span>
</div>
</div>
</div>
</div>
</div>
</div>
</Reveal>
</Parallax>
</div>

<div className="order-1 lg:order-2 lg:col-span-5 flex flex-col justify-center">
<div className="flex items-center gap-4 mb-6">
<MonoLabel className="border border-black text-black text-[9px] font-mono font-bold px-3 py-1.5 tracking-widest uppercase">[ CLOSED BETA ]</MonoLabel>
</div>
<h2 className="text-4xl md:text-5xl font-serif text-black mb-6">Exvorta Docs.</h2>
<p className="text-lg text-black/60 font-sans leading-relaxed mb-4">
        Trade documents generated in seconds. Commercial invoices, packing lists, and certificates of origin — auto-built from a single data entry. No formatting errors. No customs delays.
    </p>
<p className="text-sm text-black/40 font-sans leading-relaxed mb-10 italic">
        Currently available exclusively to active Exvorta Web clients.
    </p>
<Button className="w-max max-w-full bg-transparent border border-brand-obsidian text-black px-6 sm:px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-mono hover:bg-brand-obsidian hover:text-white transition-all flex items-center gap-3" href="/waitlist">
        [ REQUEST BETA ACCESS ]
        <svg fill="none" height="12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="12">
<line x1="5" x2="19" y1="12" y2="12"></line>
<polyline points="12 5 19 12 12 19"></polyline>
</svg>
</Button>
</div>
</Container>
</AnimatedSection>

<AnimatedSection className="w-full bg-brand-obsidian py-16 sm:py-24 md:py-32 lg:py-48 px-4 sm:px-6 lg:px-8 border-b border-white/20" id="product-track">
<Container className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

<div className="lg:col-span-5 flex flex-col justify-center text-white">
<div className="flex items-center gap-3 mb-6">
<span className="opacity-0 px-3 py-1 border border-white/20 text-white/55 text-[10px] font-mono tracking-widest uppercase">[ COMING SOON ]</span>
<MonoLabel className="text-white/55 font-mono text-[10px] uppercase tracking-widest">Global Logistics Alpha</MonoLabel>
</div>
<h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Exvorta Track.</h2>
<p className="text-lg text-white/60 font-sans leading-relaxed mb-8 max-w-2xl">Real-time, verifiable visibility into your global trade pipeline. Exvorta Track moves asset tracking from static spreadsheets to a dynamic, hardened data ecosystem, connecting directly with major global carriers and freight forwarders.</p>
<Button className="w-max max-w-full bg-transparent border border-white text-white px-6 sm:px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-mono hover:bg-white hover:text-black transition-all flex items-center gap-3 group" href="/waitlist">
                [ REQUEST ALPHA ACCESS ]
                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
</Button>
</div>

<div className="lg:col-span-7">
<Parallax speed={24}>
<Reveal y={36} duration={0.9}>
<div className="relative w-full md:aspect-[4/3] bg-mockup-card border border-white/20 overflow-hidden flex flex-col shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)]">

<div className="w-full h-10 sm:h-12 shrink-0 border-b border-white/20 flex items-center px-4 sm:px-6 lg:px-8 gap-2 bg-mockup-sidebar">
<div className="w-2.5 h-2.5 shrink-0 bg-white/20"></div>
<div className="w-2.5 h-2.5 shrink-0 bg-white/20"></div>
<div className="w-2.5 h-2.5 shrink-0 bg-white/20"></div>
<div className="ml-auto min-w-0 truncate text-[8px] sm:text-[9px] font-mono text-white/55 uppercase tracking-widest">track.exvorta.com // VESSEL_TRACKER_V2</div>
</div>

<div className="p-4 sm:p-6 md:p-12 flex flex-col gap-4 sm:gap-8 md:flex-grow overflow-x-auto"><div className="flex flex-col gap-4 sm:gap-6 h-full font-mono text-[10px] text-white/70">
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
<div className="bg-mockup-card border border-white/20 p-4 flex flex-col gap-2">
<span className="text-white/55 tracking-widest">[ ACTIVE SHIPMENTS ]</span>
<span className="text-brand-emerald text-lg font-bold">12</span>
</div>
<div className="bg-mockup-card border border-white/20 p-4 flex flex-col gap-2">
<span className="text-white/55 tracking-widest">[ IN TRANSIT ]</span>
<span className="text-brand-emerald text-lg font-bold">8</span>
</div>
<div className="bg-mockup-card border border-white/20 p-4 flex flex-col gap-2">
<span className="text-white/55 tracking-widest">[ DELIVERED ]</span>
<span className="text-brand-emerald text-lg font-bold">47</span>
</div>
</div>
<div className="flex-1 bg-mockup-card border border-white/20 p-4 overflow-hidden">
<div className="flex flex-col divide-y divide-[white/20]">
<div className="py-3 flex items-center gap-4">
<div className="w-4 h-4 border border-brand-emerald flex items-center justify-center"><div className="w-1 h-1 bg-brand-emerald"></div></div>
<span className="flex-1 text-white/90">DUBAI → ROTTERDAM</span>
<span className="text-white/30">MAERSK</span>
<span className="px-2 py-0.5 border border-brand-emerald text-brand-emerald text-[8px] animate-pulse">IN TRANSIT</span>
</div>
<div className="py-3 flex items-center gap-4">
<div className="w-4 h-4 border border-white/20 flex items-center justify-center"><div className="w-1 h-1 bg-white/40"></div></div>
<span className="flex-1 text-white/90">SHANGHAI → JEBEL ALI</span>
<span className="text-white/30">MSC</span>
<span className="px-2 py-0.5 border border-warning-amber text-warning-amber text-[8px]">AT CUSTOMS</span>
</div>
<div className="py-3 flex items-center gap-4">
<div className="w-4 h-4 border border-white/20 flex items-center justify-center"><div className="w-1 h-1 bg-white/40"></div></div>
<span className="flex-1 text-white/90">HAMBURG → SINGAPORE</span>
<span className="text-white/30">DHL</span>
<span className="px-2 py-0.5 border border-outline text-outline text-[8px]">DELIVERED</span>
</div>
<div className="py-3 flex items-center gap-4">
<div className="w-4 h-4 border border-white/20 flex items-center justify-center"><div className="w-1 h-1 bg-white/40"></div></div>
<span className="flex-1 text-white/90">MUMBAI → NEW YORK</span>
<span className="text-white/30">FEDEX</span>
<span className="px-2 py-0.5 border border-info-blue text-info-blue text-[8px]">LOADING</span>
</div>
</div>
</div>
<div className="mt-auto pb-4">
<div className="flex justify-between items-center mb-3 text-[8px] text-white/30 tracking-widest">
<span className="">[ LOADED ]</span>
<span className="">[ SHIPPED ]</span>
<span className="text-brand-emerald/80">[ IN TRANSIT ]</span>
<span className="">[ DELIVERED ]</span>
</div>
<div className="relative h-px bg-white/10">
<div className="absolute top-1/2 left-0 w-2/3 h-px bg-brand-emerald -translate-y-1/2"></div>
<div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 bg-brand-emerald"></div>
<div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-2 h-2 bg-brand-emerald"></div>
<div className="absolute top-1/2 left-2/3 -translate-y-1/2 w-2 h-2 border border-brand-emerald bg-zinc-dark animate-pulse"></div>
<div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 border border-white/20 bg-zinc-dark"></div>
</div>
</div>
</div></div>
</div>
</Reveal>
</Parallax>
</div>
</Container>
</AnimatedSection>

<AnimatedSection className="w-full bg-brand-cream py-16 sm:py-24 md:py-32 lg:py-48 px-4 sm:px-6 lg:px-8 border-b border-brand-obsidian" id="product-crm">
<Container className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

<div className="lg:col-span-7">
<Parallax speed={24}>
<Reveal y={36} duration={0.9}>
<div className="bg-white border border-brand-obsidian md:aspect-[4/3] overflow-hidden relative group flex flex-col shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)]">

<div className="h-10 shrink-0 bg-brand-cream border-b border-brand-obsidian flex items-center gap-3 px-4 justify-between">
<div className="flex gap-1.5 shrink-0">
<div className="w-2.5 h-2.5 bg-black/10"></div>
<div className="w-2.5 h-2.5 bg-black/10"></div>
<div className="w-2.5 h-2.5 bg-black/10"></div>
</div>
<div className="font-mono text-[8px] sm:text-[9px] tracking-[0.12em] sm:tracking-[0.3em] text-black/50 uppercase truncate">crm.exvorta.com // RELATIONSHIP_ENGINE</div>
<div className="hidden sm:block w-12 shrink-0"></div>
</div>

<div className="flex-1 flex bg-brand-cream overflow-hidden">

<div className="w-48 border-r border-brand-obsidian hidden md:flex flex-col bg-brand-cream">
<div className="p-4 border-b border-brand-obsidian">
<div className="h-7 bg-white border border-brand-obsidian px-2 flex items-center gap-2">
<svg className="w-3 h-3 text-black/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
<div className="w-[1px] h-3 bg-brand-emerald animate-cursor-blink"></div>
</div>
</div>
<div className="flex-1 py-2 overflow-y-auto">
<div className="px-4 py-3 bg-white border-y border-brand-obsidian flex items-center gap-3">
<div className="w-8 h-8 border border-brand-obsidian flex items-center justify-center text-[10px] font-mono text-brand-emerald">NP</div>
<div className="flex-1">
<div className="text-[9px] font-mono font-bold uppercase">Nova Petrochem</div>
<div className="flex items-center gap-1.5">
<span className="text-[9px]">🇦🇪</span>
<div className="w-1.5 h-1.5 bg-brand-emerald"></div>
</div>
</div>
</div>
<div className="px-4 py-3 flex items-center gap-3 opacity-60">
<div className="w-8 h-8 border border-brand-obsidian flex items-center justify-center text-[10px] font-mono">GL</div>
<div className="flex-1">
<div className="text-[9px] font-mono uppercase">Gulf Logistics</div>
<div className="flex items-center gap-1.5">
<span className="text-[9px]">🇸🇦</span>
<div className="w-1.5 h-1.5 bg-brand-emerald"></div>
</div>
</div>
</div>
<div className="px-4 py-3 flex items-center gap-3 opacity-60">
<div className="w-8 h-8 border border-brand-obsidian flex items-center justify-center text-[10px] font-mono">AM</div>
<div className="flex-1">
<div className="text-[9px] font-mono uppercase">Armada Metals</div>
<div className="flex items-center gap-1.5">
<span className="text-[9px]">🇩🇪</span>
<div className="w-1.5 h-1.5 bg-black/20"></div>
</div>
</div>
</div>
<div className="px-4 py-3 flex items-center gap-3 opacity-60">
<div className="w-8 h-8 border border-brand-obsidian flex items-center justify-center text-[10px] font-mono">TS</div>
<div className="flex-1">
<div className="text-[9px] font-mono uppercase">TradeSource Co</div>
<div className="flex items-center gap-1.5">
<span className="text-[9px]">🇨🇳</span>
<div className="w-1.5 h-1.5 bg-brand-emerald"></div>
</div>
</div>
</div>
</div>
</div>

<div className="flex-1 flex flex-col bg-white">
<div className="p-6 border-b border-brand-obsidian">
<div className="text-[10px] font-mono text-black/60 uppercase tracking-[0.2em] mb-2">Nova Petrochem // UAE // Active Buyer</div>
<div className="flex gap-2">
<span className="text-[8px] font-mono border border-brand-obsidian px-2 py-0.5">PETROCHEMICAL</span>
<span className="text-[8px] font-mono border border-brand-obsidian px-2 py-0.5">VERIFIED</span>
</div>
</div>
<div className="flex-1 p-6">
<div className="flex items-center gap-1 mb-8">
<div className="flex-1 min-w-0 flex flex-col gap-2">
<div className="h-1 bg-brand-emerald"></div>
<div className="text-[7px] font-mono text-black/60 text-center uppercase break-words">INQUIRY</div>
</div>
<div className="w-2 shrink-0 border-t border-brand-obsidian"></div>
<div className="flex-1 min-w-0 flex flex-col gap-2">
<div className="h-1 bg-brand-emerald animate-pulse"></div>
<div className="text-[7px] font-mono text-brand-emerald font-bold text-center uppercase break-words">NEGOTIATION</div>

<div className="mt-4 p-3 min-w-0 bg-white border border-brand-obsidian border-l-2 border-l-emerald relative group">
<div className="text-[9px] font-mono font-bold mb-1 break-words">Crude Derivative Batch #4471</div>
<div className="text-[8px] font-mono text-black/60 break-words">$340,000 · Due: 14 Jun</div>
</div>
</div>
<div className="w-2 shrink-0 border-t border-brand-obsidian"></div>
<div className="flex-1 min-w-0 flex flex-col gap-2">
<div className="h-1 bg-black/10"></div>
<div className="text-[7px] font-mono text-black/60 text-center uppercase break-words">CONFIRMED</div>
</div>
<div className="w-2 shrink-0 border-t border-brand-obsidian"></div>
<div className="flex-1 min-w-0 flex flex-col gap-2">
<div className="h-1 bg-black/10"></div>
<div className="text-[7px] font-mono text-black/60 text-center uppercase break-words">SHIPPED</div>
</div>
<div className="w-2 shrink-0 border-t border-brand-obsidian"></div>
<div className="flex-1 min-w-0 flex flex-col gap-2">
<div className="h-1 bg-black/10"></div>
<div className="text-[7px] font-mono text-black/60 text-center uppercase break-words">PAID</div>
</div>
</div>
</div>

<div className="p-6 pt-0 flex flex-col md:flex-row gap-4 mt-auto">
<div className="flex-1 p-3 border border-brand-obsidian">
<div className="text-[7px] font-mono text-black/60 uppercase mb-1">4 Active Deals</div>
<div className="h-1 w-1/2 bg-black/20"></div>
</div>
<div className="flex-1 p-3 border border-brand-obsidian">
<div className="text-[7px] font-mono text-black/60 uppercase mb-1">$1.2M Pipeline</div>
<div className="h-1 w-2/3 bg-black/20"></div>
</div>
<div className="flex-1 p-3 border border-brand-obsidian">
<div className="text-[7px] font-mono text-black/60 uppercase mb-1">2 Docs Pending</div>
<div className="h-1 w-1/3 bg-brand-emerald/60"></div>
</div>
</div>
</div>
</div>
</div>
</Reveal>
</Parallax>
</div>

<div className="lg:col-span-5 flex flex-col justify-center">
<div className="flex items-center gap-4 mb-6">
<MonoLabel className="border border-brand-obsidian text-black text-[9px] font-mono font-bold px-3 py-1.5 tracking-widest uppercase">[ COMING SOON ]</MonoLabel>
</div>
<h2 className="text-4xl md:text-5xl font-serif text-black mb-6">Exvorta CRM.</h2>
<p className="text-lg text-black/60 font-sans leading-relaxed mb-10">Manage every buyer and supplier relationship in one place. Deal pipelines, document history, follow-up reminders — built specifically for how traders actually work.</p>
<Button className="w-max max-w-full bg-transparent border border-brand-obsidian text-black px-6 sm:px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-mono hover:bg-brand-obsidian hover:text-white transition-all flex items-center gap-3" href="/waitlist">
                [ JOIN THE WAITLIST ]
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 4 4-4 4" /><path d="M12 17h7" /></svg>
</Button>
</div>
</Container>
</AnimatedSection>

<AnimatedSection className="w-full bg-brand-obsidian py-16 sm:py-24 md:py-32 lg:py-48 px-4 sm:px-6 lg:px-8 border-b border-white/20" id="product-intel">
<Container className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

<div className="lg:col-span-5 flex flex-col justify-center text-white">
<div className="flex items-center gap-4 mb-6">
<MonoLabel className="text-[10px] font-mono tracking-[0.2em] text-white/55 uppercase">[ MODULE 05 ]</MonoLabel>
<div className="px-2.5 py-1 border border-white/20 flex items-center gap-2">
<div className="w-1.5 h-1.5 bg-white/30"></div>
<MonoLabel className="text-[9px] font-mono tracking-[0.2em] uppercase font-bold text-white/50">COMING SOON</MonoLabel>
</div>
</div>
<h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Exvorta Intel.</h2>
<p className="text-lg text-white/60 font-sans leading-relaxed mb-6">Intuition does not scale. Exvorta Intel processes millions of global trade data points into actionable, predictive commodity forecasting and supply chain risk analysis.</p>
<p className="text-md text-white/55 font-sans leading-relaxed mb-10">Monitor macro-economic shifts, track competitor vessel routes, and analyze real-time pricing arbitrage across global ports—all from a single executive terminal.</p>
<Button className="w-max max-w-full bg-transparent border border-white text-white px-6 sm:px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-mono hover:bg-white hover:text-black transition-all flex items-center gap-3" href="/waitlist">
                [ JOIN THE WAITLIST ]
            </Button>
</div>

<div className="lg:col-span-7">
<Parallax speed={24}>
<Reveal y={36} duration={0.9}>
<div className="relative w-full md:aspect-[4/3] bg-mockup-card border border-white/20 overflow-hidden flex flex-col shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)]">
<div className="w-full h-10 shrink-0 border-b border-white/20 flex items-center justify-between px-4 bg-mockup-card">
<div className="flex items-center gap-2">
<div className="w-1.5 h-1.5 bg-brand-emerald animate-pulse"></div>
<MonoLabel className="text-[8px] font-mono text-white/50 tracking-widest uppercase">[INTEL_ALPHA_ACCESS // LIVE NODE_03]</MonoLabel>
</div>
<div className="flex gap-1">
<div className="w-2 h-2 bg-white/20"></div>
<div className="w-2 h-2 bg-white/20"></div>
</div>
</div>

<div className="relative flex-grow bg-mockup-card overflow-x-auto">

<div className="relative z-10 p-4 sm:p-6 h-full flex flex-col justify-between">

<div className="h-1/2 relative border border-white/20 p-4 overflow-hidden">
<div className="text-[8px] font-mono text-white/55 uppercase mb-4 tracking-tighter">PREDICTIVE NEURAL FORECAST // COMMODITY_AGGREGATE</div>
<svg className="w-full h-32" preserveAspectRatio="none" viewBox="0 0 400 100">

<path d="M0,80 C50,75 80,40 150,50 S250,20 300,30" fill="none" stroke="var(--color-brand-emerald)" strokeWidth="2"></path>

<path d="M300,30 Q350,10 400,5" fill="none" stroke="var(--color-brand-emerald)" strokeDasharray="4 2" strokeWidth="1.5"></path>

<path d="M300,30 Q350,45 400,55" fill="none" stroke="rgba(255,255,255,0.2)" strokeDasharray="4 2" strokeWidth="1"></path>
</svg>
<div className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-emerald font-mono text-[10px] font-bold bg-mockup-card px-2 py-1 border border-white/20">+12.4% Est.</div>
</div>

<div className="flex gap-4 h-1/3 mt-4">

<div className="w-1/3 border border-white/20 p-3 flex flex-col">
<MonoLabel className="text-[7px] font-mono text-white/55 uppercase mb-2 tracking-widest">[ RISK CORRELATION MATRIX ]</MonoLabel>
<div className="grid grid-cols-2 grid-rows-2 gap-1.5 flex-grow">
<div className="bg-brand-emerald/20 border border-white/20 animate-pulse"></div>
<div className="border border-white/20"></div>
<div className="bg-red-500/20 border border-white/20"></div>
<div className="bg-brand-emerald/10 border border-white/20 animate-pulse [animation-delay:1s]"></div>
</div>
</div>

<div className="flex-1 grid grid-cols-3 gap-3">
<div className="border border-white/20 p-2.5 flex flex-col justify-between">
<div className="flex justify-between items-start">
<MonoLabel className="text-[7px] font-mono text-white/55 uppercase">CRUDE</MonoLabel>
<span className="text-brand-emerald font-mono text-[10px] font-bold">+2.4%</span>
</div>
<svg className="h-4 w-full opacity-60" viewBox="0 0 60 20"><path d="M0,15 L10,12 L20,16 L30,5 L40,10 L50,2 L60,8" fill="none" stroke="var(--color-brand-emerald)" strokeWidth="1"></path></svg>
</div>
<div className="border border-white/20 p-2.5 flex flex-col justify-between">
<div className="flex justify-between items-start">
<MonoLabel className="text-[7px] font-mono text-white/55 uppercase">COPPER</MonoLabel>
<span className="text-red-400 font-mono text-[10px] font-bold">-0.8%</span>
</div>
<svg className="h-4 w-full opacity-60" viewBox="0 0 60 20"><path d="M0,5 L10,8 L20,4 L30,12 L40,8 L50,18 L60,15" fill="none" stroke="#f87171" strokeWidth="1"></path></svg>
</div>
<div className="border border-white/20 p-2.5 flex flex-col justify-between">
<div className="flex justify-between items-start">
<MonoLabel className="text-[7px] font-mono text-white/55 uppercase">LNG</MonoLabel>
<span className="text-brand-emerald font-mono text-[10px] font-bold">+1.1%</span>
</div>
<svg className="h-4 w-full opacity-60" viewBox="0 0 60 20"><path d="M0,10 L10,15 L20,12 L30,8 L40,14 L50,5 L60,3" fill="none" stroke="var(--color-brand-emerald)" strokeWidth="1"></path></svg>
</div>
</div>
</div>

<div className="absolute bottom-2 right-4 flex gap-4 pointer-events-none">
<MonoLabel className="text-[6px] font-mono text-white/55 uppercase">[AI MODEL: ACTIVE // LATENCY &lt;5MS]</MonoLabel>
<MonoLabel className="text-[6px] font-mono text-white/55 uppercase animate-pulse">[SIGNAL_ACQUISITION_PULSE]</MonoLabel>
</div>
</div>
</div></div>
</Reveal>
</Parallax>
</div>
</Container>
</AnimatedSection>

<AnimatedSection className="w-full bg-brand-obsidian py-48 md:py-64 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col items-center justify-center text-center border-b border-white/20" id="ecosystem-vision">

<div className="relative z-10 flex flex-col items-center mb-10">
<div className="px-3 py-1 border border-white/20 flex items-center gap-2">
<div className="w-1.5 h-1.5 bg-white/40 animate-pulse"></div>
<MonoLabel className="text-[9px] font-mono tracking-[0.3em] uppercase font-bold text-white/60">{vision.badge}</MonoLabel>
</div>
</div>

            <h2 className="relative z-10 text-4xl sm:text-5xl md:text-[5.5rem] lg:text-[7rem] font-serif font-bold text-white leading-[1.0] tracking-tight mb-8">
              <StaggerText
                as="span"
                text={vision.title || ''}
                unit="chars"
                stagger={0.024}
                duration={0.8}
                mode="inView"
              />
              <br />
              <span className="text-white/40">
                <StaggerText
                  as="span"
                  text={vision.subtitle || ''}
                  unit="chars"
                  stagger={0.024}
                  duration={0.8}
                  mode="inView"
                />
              </span>
            </h2>

            <p className="relative z-10 max-w-3xl mx-auto text-lg md:text-xl text-white/50 leading-relaxed font-sans mb-16">
              {vision.description}
            </p>

            <div className="relative z-10 flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-[8px] font-mono tracking-widest text-white/55 uppercase">
              <span className="">WEB</span> <span className="w-2 sm:w-4 h-[1px] bg-white/20"></span>
              <span className="">DOCS</span> <span className="w-2 sm:w-4 h-[1px] bg-white/20"></span>
              <span className="">TRACK</span> <span className="w-2 sm:w-4 h-[1px] bg-white/20"></span>
              <span className="">CRM</span> <span className="w-2 sm:w-4 h-[1px] bg-white/20"></span>
              <span className="">INTEL</span>
            </div>
          </AnimatedSection>

          <AnimatedSection className="w-full bg-brand-cream py-16 sm:py-24 md:py-32 lg:py-48 px-4 sm:px-6 lg:px-8 border-b border-brand-obsidian" id="ecosystem-roadmap"><Container className="max-w-4xl mx-auto w-full flex flex-col"><MonoLabel className="text-[10px] font-mono tracking-[0.2em] text-black/40 uppercase mb-6 block">{roadmap.eyebrow}</MonoLabel><h2 className="text-4xl md:text-5xl font-serif text-black mb-20">{roadmap.title}</h2><div className="relative border-l border-brand-obsidian/20 ml-3 md:ml-4 flex flex-col gap-16 md:gap-24">
            <m.div aria-hidden initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 1.8, delay: 0.3, ease: EASE_OUT }} style={{ transformOrigin: 'top' }} className="absolute -left-px top-0 bottom-0 w-px bg-brand-obsidian pointer-events-none"></m.div><Reveal y={18} delay={0.12}><div className="relative pl-8 md:pl-12"><div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-brand-obsidian border border-brand-cream"></div><MonoLabel className="text-[10px] tracking-widest text-brand-obsidian uppercase mb-2">PHASE 0 // ACTIVE</MonoLabel><h3 className="text-2xl font-serif text-black mb-3">Exvorta Web</h3><p className="text-black/60 font-sans leading-relaxed">Foundation established. Deploying hardcoded, high-velocity digital architectures for tier-one trade entities globally.</p></div></Reveal><Reveal y={18} delay={0.24}><div className="relative pl-8 md:pl-12"><div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-brand-obsidian border border-brand-cream"></div><MonoLabel className="text-[10px] tracking-widest text-brand-obsidian uppercase mb-2">PHASE 1 // Q3 2026</MonoLabel><h3 className="text-2xl font-serif text-black mb-3">Docs &amp; Track Modules</h3><p className="text-black/60 font-sans leading-relaxed">Releasing the zero-trust document data room (Docs) and the real-time supply chain visibility dashboard (Track) to our existing infrastructure partners.</p></div></Reveal><Reveal y={18} delay={0.36}><div className="relative pl-8 md:pl-12"><div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-transparent border border-brand-obsidian"></div><MonoLabel className="text-[10px] tracking-widest text-black/60 uppercase mb-2">PHASE 2 // Q1 2027</MonoLabel><h3 className="text-2xl font-serif text-black mb-3">Exvorta CRM</h3><p className="text-black/60 font-sans leading-relaxed">Rolling out the first relationship architecture engineered explicitly for international trade desks, integrating KYC and broker networks.</p></div></Reveal><Reveal y={18} delay={0.48}><div className="relative pl-8 md:pl-12"><div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-transparent border border-brand-obsidian"></div><MonoLabel className="text-[10px] tracking-widest text-black/60 uppercase mb-2">PHASE 3 // Q3 2027</MonoLabel><h3 className="text-2xl font-serif text-black mb-3">Exvorta Intel</h3><p className="text-black/60 font-sans leading-relaxed">Deploying the institutional-grade market intelligence terminal for predictive commodity forecasting and risk correlation.</p></div></Reveal><Reveal y={18} delay={0.6}><div className="relative pl-8 md:pl-12"><div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-transparent border border-brand-obsidian"></div><MonoLabel className="text-[10px] tracking-widest text-black/60 uppercase mb-2">PHASE 4 // 2028</MonoLabel><h3 className="text-2xl font-serif text-black mb-3">The Exvorta Suite</h3><p className="text-black/60 font-sans leading-relaxed">Complete modular synthesis. All individual products seamlessly converge into the unified global trade operating system.</p></div></Reveal></div></Container></AnimatedSection>

          <AnimatedSection className="w-full bg-brand-obsidian py-40 px-4 sm:px-6 lg:px-8 border-b border-white/20 flex flex-col items-center text-center relative overflow-hidden" id="ecosystem-cta">

            <MonoLabel className="text-[10px] font-mono tracking-[0.3em] text-white/55 uppercase mb-8 block relative z-10">{cta.eyebrow}</MonoLabel>

            <h2 className="text-4xl md:text-6xl font-serif text-white mb-8 leading-tight tracking-tight max-w-4xl relative z-10">
              <StaggerText
                as="span"
                text={cta.title || ''}
                unit="words"
                stagger={0.08}
                duration={0.75}
                mode="inView"
              />
              <br />
              <span className="text-white/50">
                <StaggerText
                  as="span"
                  text={cta.subtitle || ''}
                  unit="words"
                  stagger={0.08}
                  duration={0.75}
                  mode="inView"
                />
              </span>
            </h2>

<p className="text-lg md:text-xl text-white/60 font-sans leading-relaxed max-w-3xl mb-16 relative z-10">
        {cta.description}
    </p>

<div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10 w-full sm:w-auto">

<Button className="w-full sm:w-auto bg-white text-black px-10 py-5 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-mono hover:bg-gray-200 transition-all border border-white flex items-center justify-center gap-3" href="/rfq">
            [ UPGRADE WEB ARCHITECTURE ]
        </Button>

<Button className="w-full sm:w-auto bg-transparent border border-white text-white px-10 py-5 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-mono hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3" href="/portfolio">
            [ SEE THE LIVE PROOF ]
        </Button>

<Button className="w-full sm:w-auto bg-transparent border border-white text-white px-10 py-5 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-mono hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3" href="/waitlist">
            [ JOIN SOFTWARE WAITLIST ]
        </Button>
</div>

<MonoLabel className="text-[9px] font-mono tracking-[0.2em] text-white/55 uppercase mt-12 block relative z-10">
        * Web proposals are subject to capacity constraints.
    </MonoLabel>
</AnimatedSection>

      </div>
  );
}

export default EcosystemBlock;
