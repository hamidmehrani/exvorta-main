"use client";

import React from 'react';
import Link from 'next/link';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../ui/Reveal';
import { Container } from '../ui/Container';
import { MonoLabel } from '../ui/MonoLabel';
import { TiltCard } from '../ui/motion/TiltCard';
import { m as motion } from 'framer-motion';
import { easings, useReducedMotion } from '@/lib/animations';
import { DocTemplateIcon, type DocTemplateIconName } from '@/components/ui/DocTemplateIcon';

const DOC_TEMPLATES = [
  {
    id: 'bol',
    tagline: 'Core shipping contract',
    name: 'Bill of Lading',
    icon: 'sailing',
    incoterms: 'CIF (Cost, Insurance & Freight)',
    hs: '2901.21.00',
    port: 'AE JEA (JEBEL ALI)',
    shipper: 'Global Petrochem LLC\nJafza One, Dubai, UAE',
    consignee: 'Vanguard Resources\nBotlek, Rotterdam, Netherlands',
    vessel: 'MSC Isabella',
    voyage: 'V-092A',
    pol: 'AE JEA',
    pod: 'NL RTM',
    desc: 'Petrochemical Raw Materials in ISO Tank Containers.',
    weight: '24,500.00 KGS',
    hs2: '2901.21.00',
    ref: 'EXV-8829-DXB',
  },
  {
    id: 'co',
    tagline: 'Customs clearance proof',
    name: 'Certificate of Origin',
    icon: 'workspace_premium',
    incoterms: 'FOB (Free On Board)',
    hs: '0904.11.00',
    port: 'TR IZM (IZMIR)',
    shipper: 'Aegean Organic Export Co.\nIzmir Organize Sanayi, Türkiye',
    consignee: 'Meridian Foods GmbH\nHafenstraße 12, Hamburg, Germany',
    vessel: 'APL Sentosa',
    voyage: 'V-0143W',
    pol: 'TR IZM',
    pod: 'DE HAM',
    desc: 'Certified Organic Oregano, Whole Leaf — EU/USDA NOP Organic.',
    weight: '18,200.00 KGS',
    hs2: '0904.11.00',
    ref: 'EXV-4471-IZM',
  },
  {
    id: 'insurance',
    tagline: 'All-risks cargo cover',
    name: 'Insurance Certificate',
    icon: 'verified_user',
    incoterms: 'CIP (Carriage & Insurance Paid)',
    hs: '9999.00.00',
    port: 'AE DXB (JEBEL ALI)',
    shipper: 'Exvorta Trade Services\nDMCC, Dubai, UAE',
    consignee: 'Novus Energy Pte.\nSingapore 049483',
    vessel: 'MV Sentinel',
    voyage: 'V-2201S',
    pol: 'AE DXB',
    pod: 'SG SIN',
    desc: 'Marine Cargo Insurance — All Risks (A) covering 4,500,000 USD shipment value.',
    weight: 'COVER: 4,500,000 USD',
    hs2: 'POLICY: MRN-88210',
    ref: 'EXV-9912-SIN',
  },
  {
    id: 'ai-packing',
    tagline: 'AI-classified · self-validating',
    name: 'AI Packing List',
    icon: 'auto_awesome',
    incoterms: 'DAP (Delivered At Place)',
    hs: '8542.31.00',
    port: 'TW TPE (TAIPEI)',
    shipper: 'OmniTech Manufacturing\nHsinchu Science Park, Taiwan',
    consignee: 'Corvus Distribution Ltd.\nLondon E14, United Kingdom',
    vessel: 'MV Helios',
    voyage: 'V-7712H',
    pol: 'TW TPE',
    pod: 'GB LHR',
    desc: 'AI-CLASSIFIED: Semiconductor Components — HS auto-matched 99.2% confidence, dual-use screened.',
    weight: 'AI: 9,850.00 KGS (est.)',
    hs2: 'AI MATCH: 8542.31',
    ref: 'EXV-1005-LHR',
  },
  {
    id: 'premium',
    tagline: 'Executive 6-document suite',
    name: 'Premium Dossier Pack',
    icon: 'diamond',
    incoterms: 'MULTI — Full Contract Suite',
    hs: 'COMPOSITE',
    port: 'GLOBAL ROUTING',
    shipper: 'Enterprise Client\nWhite-Glove Onboarding',
    consignee: 'All Counterparties\nSingle Source of Truth',
    vessel: 'MULTI-VESSEL',
    voyage: 'CONSOLIDATED',
    pol: 'MULTI-POL',
    pod: 'MULTI-POD',
    desc: 'Executive-grade bundle: B/L + CO + Insurance + Packing List, cross-validated, one signature — our most complete product.',
    weight: 'SUITE: 6 DOCUMENTS',
    hs2: 'STATUS: ALL CLEAR',
    ref: 'EXV-SUITE-001',
  },
] as const;

export function ProductShowcaseBlock(props: any) {
  const prefersReducedMotion = useReducedMotion();
  const [activeDoc, setActiveDoc] = React.useState(0);
  const doc = DOC_TEMPLATES[activeDoc];

  const column = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 40, filter: 'blur(6px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.85, ease: easings.cinematic },
    },
  };

  return (
    <AnimatedSection className="w-full" data-purpose="product-showcase">
      <motion.section
        className="py-32 bg-brand-cream border-t border-brand-obsidian/5 relative overflow-hidden"
        data-purpose="exvorta-docs"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18, delayChildren: 0.1 } } }}
      ><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
<div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
{/*  Left Column: SaaS UI  */}
<motion.div className="order-2 lg:order-1" variants={column}>
<TiltCard maxTilt={4} glow={false}>
<div className="bg-mockup-dashboard rounded-2xl shadow-2xl border border-hairline-dark overflow-hidden flex flex-col h-[640px]">
{/*  UI Header  */}
<div className="h-10 border-b border-hairline-dark bg-white/5 flex items-center px-4 shrink-0">
<div className="flex space-x-1.5">
<div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
<div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
<div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
</div>
<div className="mx-auto flex items-center gap-2">
<span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse"></span>
<span className="text-[9px] text-white/60 tracking-[0.25em] font-mono uppercase font-medium">Document Engine</span>
<span className="text-[8px] text-white/25 font-mono px-1.5 py-0.5 border border-white/10 rounded-sm">AI</span>
</div>
</div>
{/*  Pipeline stages strip  */}
<div className="flex items-center gap-0 px-4 py-2.5 border-b border-hairline-dark bg-white/[0.02] text-[7px] font-mono uppercase tracking-[0.15em]">
{['Select', 'Prefill', 'Validate', 'Stamp', 'Deliver'].map((stage, i, arr) => (
  <React.Fragment key={stage}>
    <div className="flex items-center gap-1.5">
      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[6px] font-bold ${i < 3 ? 'bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/50' : 'bg-white/5 text-white/30 border border-white/10'}`}>{i < 3 ? '✓' : i + 1}</span>
      <span className={i < 3 ? 'text-white/70' : 'text-white/30'}>{stage}</span>
    </div>
    {i < arr.length - 1 && <div className={`flex-1 h-px mx-2 ${i < 2 ? 'bg-brand-emerald/40' : 'bg-white/10'}`} />}
  </React.Fragment>
))}
</div>
<div className="flex flex-1 overflow-hidden">
{/*  UI Sidebar  */}
<div className="w-[30%] border-r border-hairline-dark bg-mockup-sidebar p-6 flex flex-col">
<div className="mb-8">
<label className="text-[9px] text-white/40 uppercase tracking-widest block mb-2">Select Template</label>
<div className="space-y-1">
{DOC_TEMPLATES.map((t, i) => (
  <button
    key={t.id}
    type="button"
    onClick={() => setActiveDoc(i)}
    className={`w-full flex items-center justify-between px-3 py-2 rounded text-[10px] font-mono text-start transition-all duration-200 border ${
      i === activeDoc
        ? 'bg-brand-emerald/15 border-brand-emerald/50 text-white'
        : 'bg-white/[0.03] border-hairline-dark text-white/60 hover:text-white hover:bg-white/5'
    }`}
  >
    <span className="flex items-start gap-2.5 min-w-0">
      <DocTemplateIcon name={t.icon as DocTemplateIconName} className={`w-4 h-4 shrink-0 mt-px transition-colors ${i === activeDoc ? 'text-brand-emerald' : 'text-white/35'}`} />
      <span className="min-w-0">
        <span className="block leading-tight">{t.name}</span>
        <span className={`block text-[8px] font-sans tracking-wide leading-tight mt-0.5 ${i === activeDoc ? 'text-white/50' : 'text-white/25'}`}>{t.tagline}</span>
      </span>
    </span>
    {i === activeDoc && <span className="text-brand-emerald text-[9px] leading-none">●</span>}
  </button>
))}
</div>
</div>
<div className="space-y-4 mb-auto"><div className="space-y-4">
<div className="space-y-1.5">
<label className="text-[8px] text-white/40 uppercase tracking-widest block">INCOTERMS</label>
<div className="bg-white/5 border border-hairline-dark rounded px-2 py-1.5 text-[10px] text-white/60">{doc.incoterms}</div>
</div>
<div className="space-y-1.5">
<label className="text-[8px] text-white/40 uppercase tracking-widest block">HS CODE</label>
<div className="bg-white/5 border border-hairline-dark rounded px-2 py-1.5 text-[10px] text-white/60">{doc.hs}</div>
</div>
<div className="space-y-1.5">
<label className="text-[8px] text-white/40 uppercase tracking-widest block">PORT OF ORIGIN</label>
<div className="bg-white/5 border border-hairline-dark rounded px-2 py-1.5 text-[10px] text-white/60">{doc.port}</div>
</div>
</div></div>
<Link href="/rfq" className="block mt-8 w-full text-center bg-brand-obsidian border border-gray-700 py-3 rounded text-[10px] font-bold text-white uppercase tracking-widest shadow-[0_0_15px_rgba(5,150,105,0.2)] hover:border-emerald-500/50 transition-all">Generate Document</Link>
</div>
{/*  UI Preview Area  */}
<div className="flex-1 bg-mockup-card p-8 flex items-center justify-center relative overflow-hidden">
<div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(white 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}></div>
<motion.div
  className="relative bg-white w-full h-full shadow-2xl p-6 flex flex-col origin-top"
  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, rotateX: -18, y: 24 }}
  whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, rotateX: 0, y: 0 }}
  viewport={{ once: true, margin: '-80px' }}
  transition={{ duration: 0.9, delay: 0.35, ease: easings.cinematic }}
  style={{ transformPerspective: 1200 }}
>{/*  Header  */}
<div className="flex justify-between items-start mb-4 pb-2 border-b border-brand-obsidian/10">
<div className="flex gap-[1px] h-6 items-end">
<div className="w-[1px] h-full bg-brand-obsidian"></div><div className="w-[2px] h-full bg-brand-obsidian"></div><div className="w-[1px] h-full bg-brand-obsidian"></div><div className="w-[1px] h-full bg-brand-obsidian"></div><div className="w-[3px] h-full bg-brand-obsidian"></div><div className="w-[1px] h-full bg-brand-obsidian"></div><div className="w-[2px] h-full bg-brand-obsidian"></div><div className="w-[1px] h-full bg-brand-obsidian"></div><div className="w-[1px] h-full bg-brand-obsidian"></div><div className="w-[3px] h-full bg-brand-obsidian"></div><div className="w-[1px] h-full bg-brand-obsidian"></div><div className="w-[2px] h-full bg-brand-obsidian"></div><div className="w-[1px] h-full bg-brand-obsidian"></div><div className="w-[1px] h-full bg-brand-obsidian"></div><div className="w-[2px] h-full bg-brand-obsidian"></div><div className="w-[1px] h-full bg-brand-obsidian"></div><div className="w-[1px] h-full bg-brand-obsidian"></div><div className="w-[3px] h-full bg-brand-obsidian"></div><div className="w-[1px] h-full bg-brand-obsidian"></div><div className="w-[2px] h-full bg-brand-obsidian"></div>
</div>
<div className="text-right">
<div className="text-[6px] text-gray-500 uppercase tracking-[0.15em] font-medium">Document Reference</div>
<div className="text-[9px] font-normal font-mono text-brand-obsidian">REF: {doc.ref}</div>
</div>
</div>
{/*  Grid Row 1: Partners  */}
<div className="grid grid-cols-2 border-b border-gray-300">
<div className="border-r p-1.5 border-gray-300">
<div className="text-[6px] text-gray-500 uppercase tracking-[0.15em] font-medium mb-0.5">1. SHIPPER</div>
<div className="text-[9px] text-brand-obsidian leading-tight font-light">
      {doc.shipper.split('\n')[0]}<br/>
      {doc.shipper.split('\n')[1]}
    </div>
</div>
<div className="p-1.5">
<div className="text-[6px] text-gray-500 uppercase tracking-[0.15em] font-medium mb-0.5">2. CONSIGNEE</div>
<div className="text-[9px] text-brand-obsidian leading-tight font-light">
      {doc.consignee.split('\n')[0]}<br/>
      {doc.consignee.split('\n')[1]}
    </div>
</div>
</div>
{/*  Grid Row 2: Logistics Info  */}
<div className="grid grid-cols-2 sm:grid-cols-4 border-b bg-gray-50/50 border-gray-300">
<div className="p-1.5 border-r border-gray-300">
<div className="text-[6px] text-gray-500 uppercase tracking-[0.15em] font-medium">VESSEL</div>
<div className="text-[9px] font-normal">{doc.vessel}</div>
</div>
<div className="p-1.5 border-r border-gray-300">
<div className="text-[6px] text-gray-500 uppercase tracking-[0.15em] font-medium">VOYAGE</div>
<div className="text-[9px] font-normal">{doc.voyage}</div>
</div>
<div className="p-1.5 border-r border-gray-300">
<div className="text-[6px] text-gray-500 uppercase tracking-[0.15em] font-medium">POL</div>
<div className="text-[9px] font-normal">{doc.pol}</div>
</div>
<div className="p-1.5">
<div className="text-[6px] text-gray-500 uppercase tracking-[0.15em] font-medium">POD</div>
<div className="text-[9px] font-normal">{doc.pod}</div>
</div>
</div>
{/*  Main Data: Description  */}
<div className="pt-3 mb-auto">
<div className="text-[6px] text-gray-500 uppercase tracking-[0.15em] font-medium mb-1.5">7. DESCRIPTION OF GOODS AND SERVICES</div>
<div className="space-y-2">
<p className="text-[10px] text-brand-obsidian leading-relaxed font-light">{doc.desc}</p>
<div className="grid grid-cols-2 gap-2 text-[9px] text-gray-600 border-t border-brand-obsidian/5 pt-1.5">
<div className="font-light">TOTAL GROSS WEIGHT: <span className="text-brand-obsidian font-normal">{doc.weight}</span></div>
<div className="font-light text-right">HS CODE: <span className="text-brand-obsidian font-normal">{doc.hs2}</span></div>
</div>
</div>
</div>
{/*  Footer: Signature  */}
<div className="flex justify-between items-end mt-6 border-t border-brand-obsidian/10 pt-3">
<div className="w-10 h-10 border border-brand-obsidian/5 p-0.5">
<div className="grid grid-cols-6 gap-[1px] w-6 h-6 bg-white">
<div className="bg-brand-obsidian"></div><div className="bg-white"></div><div className="bg-brand-obsidian"></div><div className="bg-brand-obsidian"></div><div className="bg-white"></div><div className="bg-brand-obsidian"></div>
<div className="bg-brand-obsidian"></div><div className="bg-brand-obsidian"></div><div className="bg-white"></div><div className="bg-white"></div><div className="bg-brand-obsidian"></div><div className="bg-brand-obsidian"></div>
<div className="bg-white"></div><div className="bg-brand-obsidian"></div><div className="bg-brand-obsidian"></div><div className="bg-brand-obsidian"></div><div className="bg-white"></div><div className="bg-white"></div>
<div className="bg-brand-obsidian"></div><div className="bg-white"></div><div className="bg-white"></div><div className="bg-brand-obsidian"></div><div className="bg-brand-obsidian"></div><div className="bg-brand-obsidian"></div>
<div className="bg-brand-obsidian"></div><div className="bg-brand-obsidian"></div><div className="bg-brand-obsidian"></div><div className="bg-white"></div><div className="bg-white"></div><div className="bg-brand-obsidian"></div>
<div className="bg-white"></div><div className="bg-brand-obsidian"></div><div className="bg-white"></div><div className="bg-brand-obsidian"></div><div className="bg-brand-obsidian"></div><div className="bg-brand-obsidian"></div>
</div>
</div>
<div className="text-right min-w-[100px]">
<div className="text-[6px] text-gray-500 uppercase tracking-[0.15em] font-medium mb-0.5">Digital Signature</div>
<div className="font-serif italic text-blue-900/90 text-sm font-semibold transform -rotate-2 origin-right leading-none">Alex Mercer</div>
</div>
</div>
{/*  Trust Badge  */}
<motion.div
  className="absolute -bottom-2 -right-2 bg-[#059669] text-white text-[8px] uppercase tracking-widest font-bold px-3 py-1.5 shadow-xl rounded-sm border border-emerald-400/50 z-10"
  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
  whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
  viewport={{ once: true, margin: '-80px' }}
  transition={{ duration: 0.45, delay: 1.05, ease: easings.cinematic }}
>
    ✓ COMPLIANCE VERIFIED
</motion.div></motion.div>
</div>
</div>
</div>
</TiltCard>
</motion.div>

{/*  Right Column: Marketing  */}
<motion.div className="order-1 lg:order-2" variants={column}>
<div className="text-[10px] tracking-widest uppercase text-obsidian/40 mb-6">Document Automation</div>
<h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-obsidian mb-8 leading-[1.1]">Trade Documents,<br/>Automated &amp; Perfected.</h2>
<p className="text-base md:text-lg text-obsidian/60 mb-10 font-light leading-relaxed">Stop wasting hours on manual paperwork. Instantly generate, digitally sign, and manage strictly compliant global trade documents from official templates.</p>
<StaggerContainer className="space-y-6" staggerChildren={0.1} delayChildren={0.2}>
<StaggerItem>
<li className="flex items-center space-x-4 list-none">
<span className="text-[#059669]">✓</span>
<span className="text-sm text-obsidian font-medium tracking-tight">Intelligent Template Memory</span>
</li>
</StaggerItem>
<StaggerItem>
<li className="flex items-center space-x-4 list-none">
<span className="text-[#059669]">✓</span>
<span className="text-sm text-obsidian font-medium tracking-tight">Digital Signatures</span>
</li>
</StaggerItem>
<StaggerItem>
<li className="flex items-center space-x-4 list-none">
<span className="text-[#059669]">✓</span>
<span className="text-sm text-obsidian font-medium tracking-tight">Bank-Grade Compliance &amp; API Ready</span>
</li>
</StaggerItem>
</StaggerContainer><div className="mt-8"><Link className="inline-flex items-center text-[11px] font-bold tracking-widest uppercase border-b border-brand-obsidian pb-1 hover:text-emerald-700 hover:border-emerald-700 transition-colors duration-300" href="/rfq">Request Exvorta Docs Access <span className="ms-2">→</span></Link></div>
</motion.div>
</div>
</div></motion.section>
    </AnimatedSection>
  );
}

export default ProductShowcaseBlock;
