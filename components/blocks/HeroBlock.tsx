import React from 'react'
import type {  Page  } from '@/payload-types'
import { AnimatedSection } from '@/components/ui/Reveal'

type HeroBlockProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'hero' }>

export const HeroBlock: React.FC<HeroBlockProps> = (props) => {
  const isAboutHero = props.headline?.includes('Gravity') || props.eyebrow?.includes('IDENTITY') || props.headline?.includes('Digital Gravity')

  if (isAboutHero) {
    return (
      <AnimatedSection className="w-full">
        <section className="w-full bg-[#0A0A0A] flex flex-col items-center justify-center text-center relative px-6 py-40 min-h-[75vh] overflow-hidden rounded-none" id="hero">
          <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
            <span className="text-[9px] md:text-[10px] font-mono tracking-[0.4em] text-white/40 uppercase mb-10 block">
              {props.eyebrow || "[ THE EXVORTA IDENTITY ]"}
            </span>
            <h1 
              className="text-5xl md:text-[5.5rem] font-serif font-bold text-white leading-[1.05] tracking-tight max-w-5xl mx-auto mb-10"
              dangerouslySetInnerHTML={{ __html: props.headline || "We Engineer Digital Gravity. <br/><span class=\"text-white/60\">For the World's Most Demanding Trade Entities.</span>" }}
            />
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/50 leading-relaxed font-sans mt-6">
              {props.subheadline || "Exvorta is a boutique digital architecture firm. We exist strictly to close the credibility gap between your monumental physical trading velocity and your online infrastructure."}
            </p>
            <div className="text-[9px] font-mono text-white/20 tracking-[0.2em] uppercase mt-16">[ DUBAI · GLOBAL REACH ]</div>
          </div>
        </section>
      </AnimatedSection>
    )
  }

  return (
    <AnimatedSection className="w-full">
      {/*  BEGIN: Hero Section  */}
<section className="relative pt-32 pb-40 overflow-hidden" data-purpose="hero-section">
<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
{/*  Hero Content  */}
<div className="text-center max-w-4xl mx-auto mb-20">
<div className="inline-flex items-center justify-center px-3 py-1 mb-8 rounded-full border border-black/10 bg-white/50 text-[10px] tracking-widest uppercase text-obsidian/60"><span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span> [ {props.eyebrow || "ENGINE V1.0 LIVE"} ]</div>
<h1 className="text-5xl md:text-7xl lg:text-[84px] leading-[1.1] font-serif font-semibold text-obsidian mb-8 tracking-tight" dangerouslySetInnerHTML={{ __html: props.headline || "Digital Infrastructure<br/>for Global Traders" }} />
<p className="text-base md:text-lg text-obsidian/60 max-w-2xl mx-auto mb-12 font-light">{props.subheadline || "The definitive digital foundation for elite importers and exporters. Precision-engineered web presence and automated compliance."}</p>
<a className="inline-flex items-center justify-center px-8 py-4 bg-obsidian text-white text-xs font-medium tracking-widest uppercase shadow-[0_0_15px_rgba(0,102,255,0.5)] hover:bg-black/80 transition-all" href={props.primaryCTA?.url || "#"}>{props.primaryCTA?.label || "[ REQUEST PROPOSAL ]"}</a>
</div>
{/*  Dashboard Preview  */}
<div className="relative w-full max-w-[1400px] mx-auto rounded-xl shadow-2xl overflow-hidden bg-dashboard border border-border-dark flex flex-col mt-20" style={{ height: "700px" }}>{/*  Dashboard Header  */}
<div className="h-12 border-b border-border-dark flex items-center px-4 justify-between bg-black/40">
<div className="flex items-center space-x-2 w-32">
<div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
<div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
<div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
</div>
<div className="text-[10px] text-white/40 tracking-widest uppercase">Exvorta OS</div>
<div className="w-32 flex justify-end">
<div className="text-[9px] text-success font-mono border border-success/20 bg-success/5 px-2 py-1 rounded">SYS_ONLINE</div>
</div>
</div>
{/*  Dashboard Body  */}
<div className="flex flex-1 overflow-hidden">
{/*  Sidebar Rail  */}
<div className="w-16 border-r border-border-dark bg-sidebar flex flex-col items-center py-6 space-y-6 shrink-0 relative z-10">
<div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-white mb-4 shadow-[0_0_10px_rgba(255,255,255,0.1)] cursor-pointer">
<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
</div>
<div className="w-8 h-8 rounded flex items-center justify-center text-white/20 hover:text-white/80 cursor-pointer transition-colors">
<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
</div>
<div className="w-8 h-8 rounded flex items-center justify-center text-white/20 hover:text-white/80 cursor-pointer transition-colors">
<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
</div>
<div className="w-8 h-8 rounded flex items-center justify-center text-white/20 hover:text-white/80 cursor-pointer transition-colors relative">
<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
<div className="absolute top-1 right-1 w-1.5 h-1.5 bg-info rounded-full"></div>
</div>
<div className="w-8 h-8 rounded flex items-center justify-center text-white/20 hover:text-white/80 cursor-pointer transition-colors">
<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
</div>
<div className="w-8 h-8 rounded flex items-center justify-center text-white/20 hover:text-white/80 cursor-pointer transition-colors mt-auto">
<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
</div>
</div>
{/*  Main Content Area  */}
<div className="flex-1 bg-dashboard text-white flex flex-col overflow-hidden relative">
{/*  Top Bar  */}
<div className="h-14 border-b border-border-dark flex items-center justify-between px-6 bg-black/20 shrink-0">
<div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-mono">
<span className="text-white/40">Workspace</span>
<span className="text-white/20">/</span>
<span className="text-white/40">Global Routing</span>
<span className="text-white/20">/</span>
<span className="text-white">Active</span>
</div>
<div className="flex items-center space-x-6">
<div className="relative">
<svg className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
<input className="bg-black/40 border border-white/5 rounded pl-9 pr-4 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/20 w-64 transition-colors" placeholder="Search BOL, Client, or Location..." type="text"/>
</div>
<div className="flex items-center space-x-3 border-l border-white/10 pl-6 cursor-pointer">
<div className="text-right">
<div className="text-xs font-medium">A. Mercer</div>
<div className="text-[9px] text-white/40 uppercase tracking-wider">Admin</div>
</div>
<div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center text-xs">AM</div>
</div>
</div>
</div>
<div className="flex-1 overflow-hidden flex">
{/*  Left Panel: Metrics & Table  */}
<div className="flex-1 p-6 overflow-y-auto flex flex-col">
{/*  Top Metrics  */}
<div className="grid grid-cols-3 gap-6 mb-6 shrink-0">
<div className="bg-card border border-border-dark p-6 rounded-lg">
<div className="text-[10px] text-white/40 tracking-widest uppercase mb-2">Total Volume (TEU)</div>
<div className="text-3xl font-light mb-4">34,290</div>
<div className="h-8 flex items-end space-x-1 opacity-50">
<div className="w-full bg-white/20 h-[30%] hover:bg-white/40 transition-colors"></div>
<div className="w-full bg-white/20 h-[50%] hover:bg-white/40 transition-colors"></div>
<div className="w-full bg-white/20 h-[40%] hover:bg-white/40 transition-colors"></div>
<div className="w-full bg-white/20 h-[70%] hover:bg-white/40 transition-colors"></div>
<div className="w-full bg-white/20 h-[60%] hover:bg-white/40 transition-colors"></div>
<div className="w-full bg-white/80 h-[90%] hover:bg-white transition-colors"></div>
<div className="w-full bg-white/40 h-[50%] hover:bg-white/60 transition-colors"></div>
</div>
</div>
<div className="bg-card border border-border-dark p-6 rounded-lg flex flex-col justify-between relative overflow-hidden">
<div className="absolute -right-4 -bottom-4 w-32 h-32 bg-[radial-gradient(circle,rgba(0,102,255,0.1)_0,transparent_70%)]"></div>
<div className="relative z-10">
<div className="text-[10px] text-white/40 tracking-widest uppercase mb-2">Active Clearances</div>
<div className="text-3xl font-light text-white">142</div>
<div className="text-[10px] text-white/40 mt-1 flex items-center"><span className="w-1.5 h-1.5 bg-info rounded-full mr-1.5"></span> ACROSS 14 JURISDICTIONS</div>
</div>
</div>
<div className="bg-card border border-border-dark p-6 rounded-lg">
<div className="text-[10px] text-white/40 tracking-widest uppercase mb-4">Compliance Health</div>
<div className="space-y-3">
<div className="flex justify-between items-center border-b border-white/5 pb-2">
<span className="text-xs text-white/60">Export Controls</span>
<span className="text-[10px] text-success bg-success-bg px-2 py-0.5 rounded border border-success/20">CLEAR</span>
</div>
<div className="flex justify-between items-center">
<span className="text-xs text-white/60">Sanctions Screen</span>
<span className="text-[10px] text-success bg-success-bg px-2 py-0.5 rounded border border-success/20">CLEAR</span>
</div>
</div>
</div>
</div>
{/*  Ledger Table  */}
<div className="flex-1 bg-card border border-border-dark rounded-lg flex flex-col overflow-hidden min-h-[300px]">
<div className="p-4 border-b border-border-dark flex justify-between items-center bg-black/20 shrink-0">
<div className="text-[10px] text-white/40 tracking-widest uppercase font-mono">LIVE CLEARANCE LEDGER</div>
<button className="text-[9px] text-white/60 hover:text-white uppercase tracking-widest border border-white/10 px-3 py-1 rounded transition-colors">Export CSV</button>
</div>
<div className="flex-1 overflow-auto">
<table className="w-full text-left text-xs whitespace-nowrap">
<thead className="text-[9px] text-white/30 uppercase tracking-widest bg-[#141414] sticky top-0 z-10">
<tr>
<th className="px-5 py-3 font-normal border-b border-white/5">BOL #</th>
<th className="px-5 py-3 font-normal border-b border-white/5">CONSIGNEE</th>
<th className="px-5 py-3 font-normal border-b border-white/5">HS CODE</th>
<th className="px-5 py-3 font-normal border-b border-white/5">ORIGIN</th>
<th className="px-5 py-3 font-normal border-b border-white/5">DESTINATION</th>
<th className="px-5 py-3 font-normal border-b border-white/5 text-right">EST. VALUE ($)</th>
<th className="px-5 py-3 font-normal border-b border-white/5 text-right">STATUS</th>
</tr>
</thead>
<tbody className="divide-y divide-white/5 text-white/70 font-mono text-[11px]">
<tr className="hover:bg-white/5 transition-colors group">
<td className="px-5 py-3.5 text-white">TRK-9821-X</td>
<td className="px-5 py-3.5">Atlas Mfg Corp.</td>
<td className="px-5 py-3.5 text-white/40">8411.82</td>
<td className="px-5 py-3.5">Rotterdam (NLRTM)</td>
<td className="px-5 py-3.5">Dubai (AEDXB)</td>
<td className="px-5 py-3.5 text-right">1,240,500</td>
<td className="px-5 py-3.5 text-right"><span className="text-[9px] text-success bg-success-bg px-2 py-1 rounded border border-success/20">CLEARED</span></td>
</tr>
<tr className="hover:bg-white/5 transition-colors group">
<td className="px-5 py-3.5 text-white">TRK-3302-B</td>
<td className="px-5 py-3.5">Zeta Logistics</td>
<td className="px-5 py-3.5 text-white/40">8544.49</td>
<td className="px-5 py-3.5">Shanghai (CNSHA)</td>
<td className="px-5 py-3.5">Hamburg (DEHAM)</td>
<td className="px-5 py-3.5 text-right">89,200</td>
<td className="px-5 py-3.5 text-right"><span className="text-[9px] text-info bg-info-bg px-2 py-1 rounded border border-info/20">IN TRANSIT</span></td>
</tr>
<tr className="hover:bg-white/5 transition-colors group">
<td className="px-5 py-3.5 text-white">TRK-4491-C</td>
<td className="px-5 py-3.5">Novus Energy</td>
<td className="px-5 py-3.5 text-white/40">2710.12</td>
<td className="px-5 py-3.5">Houston (USHOU)</td>
<td className="px-5 py-3.5">Singapore (SGSIN)</td>
<td className="px-5 py-3.5 text-right">4,500,000</td>
<td className="px-5 py-3.5 text-right"><span className="text-[9px] text-warning bg-warning-bg px-2 py-1 rounded border border-warning/20">PENDING KYC</span></td>
</tr>
<tr className="hover:bg-white/5 transition-colors group">
<td className="px-5 py-3.5 text-white">TRK-1005-D</td>
<td className="px-5 py-3.5">OmniTech Ltd.</td>
<td className="px-5 py-3.5 text-white/40">8542.31</td>
<td className="px-5 py-3.5">Taipei (TWTPE)</td>
<td className="px-5 py-3.5">London (GBHRW)</td>
<td className="px-5 py-3.5 text-right">2,150,000</td>
<td className="px-5 py-3.5 text-right"><span className="text-[9px] text-success bg-success-bg px-2 py-1 rounded border border-success/20">CLEARED</span></td>
</tr>
<tr className="hover:bg-white/5 transition-colors group">
<td className="px-5 py-3.5 text-white">TRK-9912-A</td>
<td className="px-5 py-3.5">Nexus Materials</td>
<td className="px-5 py-3.5 text-white/40">7208.39</td>
<td className="px-5 py-3.5">Mumbai (INBOM)</td>
<td className="px-5 py-3.5">Antwerp (BEANR)</td>
<td className="px-5 py-3.5 text-right">310,000</td>
<td className="px-5 py-3.5 text-right"><span className="text-[9px] text-info bg-info-bg px-2 py-1 rounded border border-info/20">CUSTOMS HOLD</span></td>
</tr>
<tr className="hover:bg-white/5 transition-colors group">
<td className="px-5 py-3.5 text-white">TRK-2044-F</td>
<td className="px-5 py-3.5">Aegis Trading</td>
<td className="px-5 py-3.5 text-white/40">8421.29</td>
<td className="px-5 py-3.5">Los Angeles (USLAX)</td>
<td className="px-5 py-3.5">Tokyo (JPTYO)</td>
<td className="px-5 py-3.5 text-right">545,000</td>
<td className="px-5 py-3.5 text-right"><span className="text-[9px] text-success bg-success-bg px-2 py-1 rounded border border-success/20">CLEARED</span></td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
{/*  Right Panel: Live Terminal Log  */}
<div className="w-80 border-l border-border-dark bg-[#111111] flex flex-col shrink-0">
<div className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-black/20 shrink-0">
<div className="text-[10px] text-white/40 tracking-widest uppercase font-mono flex items-center">
<span className="w-1.5 h-1.5 bg-success rounded-full mr-2 animate-pulse"></span>
                        Live Terminal Log
                    </div>
</div>
<div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-[10px]">
{/*  Log Entry  */}
<div className="border-l-2 border-success/30 pl-3">
<div className="text-white/30 mb-1">[14:02:11 UTC]</div>
<div className="text-white/80">Customs cleared at <span className="text-white">AE-DXB</span></div>
<div className="text-success/70 mt-0.5">REF: TRK-9821-X</div>
</div>
{/*  Log Entry  */}
<div className="border-l-2 border-info/30 pl-3">
<div className="text-white/30 mb-1">[13:58:44 UTC]</div>
<div className="text-white/80">Vessel arrived at berth <span className="text-white">BE-ANR</span></div>
<div className="text-info/70 mt-0.5">REF: TRK-9912-A</div>
</div>
{/*  Log Entry  */}
<div className="border-l-2 border-warning/30 pl-3">
<div className="text-white/30 mb-1">[13:45:09 UTC]</div>
<div className="text-white/80">KYC verification requested <span className="text-white">US-HOU</span></div>
<div className="text-warning/70 mt-0.5">REF: TRK-4491-C</div>
</div>
{/*  Log Entry  */}
<div className="border-l-2 border-white/10 pl-3">
<div className="text-white/30 mb-1">[13:12:30 UTC]</div>
<div className="text-white/60">Automated commercial invoice generated.</div>
<div className="text-white/40 mt-0.5">SYS_DOC_ENGINE</div>
</div>
{/*  Log Entry  */}
<div className="border-l-2 border-success/30 pl-3">
<div className="text-white/30 mb-1">[12:44:05 UTC]</div>
<div className="text-white/80">Sanctions screen passed <span className="text-white">GLOBAL</span></div>
<div className="text-success/70 mt-0.5">REF: TRK-1005-D</div>
</div>
{/*  Log Entry  */}
<div className="border-l-2 border-white/10 pl-3">
<div className="text-white/30 mb-1">[12:30:00 UTC]</div>
<div className="text-white/60">Daily route optimization complete.</div>
<div className="text-white/40 mt-0.5">SYS_ROUTE_ENGINE</div>
</div>
{/*  Log Entry  */}
<div className="border-l-2 border-info/30 pl-3 opacity-70">
<div className="text-white/30 mb-1">[11:15:22 UTC]</div>
<div className="text-white/80">Departed origin port <span className="text-white">CN-SHA</span></div>
<div className="text-info/70 mt-0.5">REF: TRK-3302-B</div>
</div>
</div>
</div>
</div>
</div>
</div></div>
</div></section><div className="py-12 flex justify-center" data-purpose="social-proof-anchor"><p className="text-[11px] font-sans text-obsidian/40 uppercase tracking-[0.2em] text-center max-w-xl leading-relaxed">Elevating digital infrastructure for modern trading firms across the GCC and Europe.</p></div>
{/*  END: Hero Section  */}

    </AnimatedSection>
  )
}

export default HeroBlock
