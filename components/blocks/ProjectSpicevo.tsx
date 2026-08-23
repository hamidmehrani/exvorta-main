'use client';

import React from 'react';
import type { Project } from '@/payload-types';
import { AnimatedSection } from '@/components/ui/Reveal';
import { CMSImage } from '@/components/ui/CMSImage';
import Link from 'next/link';

export function ProjectSpicevo({ project }: { project?: Project }) {
  const heroImageUrl = project?.heroImage && typeof project.heroImage === 'object' && project.heroImage.url
    ? project.heroImage.url
    : 'https://lh3.googleusercontent.com/aida/AP1WRLsluHrudtzDaG50aSD36NdRzN58w6vb8tMpFOdnfIZFgY1dBgREUPWYQlTjj9EbRdLgnplkZYewTF9sMmaeJSXAK3oto-ygLUZfgwWyy7yWx7KwCDhAFMeuV49Vhkho1reIvl0I9GKNryk-9aFBdjJS583MJmCtZCneN1ZtU54xdaArh6k8eLfsYFLn5M0d_X1KdW11WwN2Sz8g_rTEjmd88-HJHGcuK3mzWuDZmmpB05aQ3niGkBjgHbc';

  return (
    <div className="bg-[#0D0D0D] antialiased text-[#FAFAF8]">
      {/* Main Content: Case Study Hero */}
      <main className="min-h-screen pt-32 pb-24 px-6 md:px-12 flex flex-col justify-center border-b border-white/10">
        <div className="max-w-[1440px] mx-auto w-full relative z-10">
          <div className="mb-12">
            <Link className="inline-flex items-center gap-2 text-[#059669] font-mono text-[10px] uppercase hover:text-[#059669]/80 transition-colors" href="/portfolio">
              <span className="text-[14px]">←</span>
              BACK TO INDEX
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            <div className="col-span-1 lg:col-span-5 flex flex-col justify-end">
              <AnimatedSection>
                <h1 className="font-serif text-[48px] md:text-[84px] tracking-tighter leading-none mb-6 font-semibold">
                  Spicevo
                </h1>
                <p className="font-sans text-[18px] text-[#444846] max-w-md mb-12 font-light">
                  Organic Herbs & Spices Exporter.
                </p>
              </AnimatedSection>
              
              <AnimatedSection className="mt-auto">
                <table className="w-full border-collapse border border-white/10">
                  <tbody>
                    {project?.metrics && project.metrics.length > 0 ? (
                      project.metrics.map((metric, i) => (
                        <tr key={i} className="border-b border-white/10 last:border-b-0">
                          <td className="p-4 border-r border-white/10 font-mono text-[10px] text-[#059669]/80 w-1/3 uppercase">{metric.label}:</td>
                          <td className="p-4 font-mono text-[10px] text-[#FAFAF8] uppercase">{metric.value}</td>
                        </tr>
                      ))
                    ) : (
                      <>
                        <tr className="border-b border-white/10">
                          <td className="p-4 border-r border-white/10 font-mono text-[10px] text-[#059669]/80 w-1/3">ESTABLISHED:</td>
                          <td className="p-4 font-mono text-[10px] text-[#FAFAF8]">2014, Istanbul, Turkey</td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="p-4 border-r border-white/10 font-mono text-[10px] text-[#059669]/80">VOLUME:</td>
                          <td className="p-4 font-mono text-[10px] text-[#FAFAF8]">480+ MT/YEAR</td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="p-4 border-r border-white/10 font-mono text-[10px] text-[#059669]/80">CERTIFICATIONS:</td>
                          <td className="p-4 font-mono text-[10px] text-[#FAFAF8]">EU Organic, USDA NOP, ISO 22000</td>
                        </tr>
                        <tr>
                          <td className="p-4 border-r border-white/10 font-mono text-[10px] text-[#059669]/80">TECH STACK:</td>
                          <td className="p-4 font-mono text-[10px] text-[#FAFAF8]">Next.js 15, Payload CMS, Neon</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </AnimatedSection>
            </div>
            
            <div className="col-span-1 lg:col-span-7 relative h-[400px] lg:h-[600px] border border-white/10 bg-[#141414] p-2">
              {project?.heroImage ? (
                 <CMSImage media={project.heroImage} className="w-full h-full object-cover rounded-none grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700" />
              ) : (
                <img className="w-full h-full object-cover rounded-none grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700" src={heroImageUrl} alt="Spicevo Case Study" />
              )}
            </div>
          </div>
        </div>
      </main>

      <section className="bg-[#FAFAF8] text-[#0D0D0D] py-32 border-t border-[#0D0D0D]" id="brand-strategy">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          {/* Part 1: BRAND POSITIONING */}
          <AnimatedSection className="mb-24">
            <div className="font-mono text-[#059669] text-[10px] uppercase tracking-widest mb-8">[ BRAND POSITIONING ]</div>
            <blockquote className="font-serif text-[32px] md:text-[60px] italic max-w-[800px] mb-12 leading-tight font-semibold">
              "The organic herbs supplier that European and Gulf buyers trust — because every container ships with documentation as clean as the product itself."
            </blockquote>
            <div className="border-b border-[#0D0D0D]/10 w-full"></div>
          </AnimatedSection>

          {/* Part 2: DESIGN SYSTEM GRID */}
          <AnimatedSection className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            {/* Left Column (PALETTE) */}
            <div className="lg:col-span-7">
              <div className="font-mono text-[#059669] text-[10px] uppercase tracking-widest mb-8">[ PALETTE ]</div>
              <div className="grid grid-cols-3 gap-4">
                <div className="aspect-square bg-[#F7F2EC] border border-[#0D0D0D] flex flex-col justify-end p-4">
                  <span className="font-mono text-[10px] uppercase">WARM CREAM</span>
                </div>
                <div className="aspect-square bg-[#8B3A0F] border border-[#0D0D0D] flex flex-col justify-end p-4 text-white">
                  <span className="font-mono text-[10px] uppercase">DEEP RUST</span>
                </div>
                <div className="aspect-square bg-[#2D5A27] border border-[#0D0D0D] flex flex-col justify-end p-4 text-white">
                  <span className="font-mono text-[10px] uppercase">FOREST GREEN</span>
                </div>
              </div>
            </div>

            {/* Right Column (TYPOGRAPHY) */}
            <div className="lg:col-span-5">
              <div className="font-mono text-[#059669] text-[10px] uppercase tracking-widest mb-8">[ TYPOGRAPHY ]</div>
              <div className="space-y-12">
                <div>
                  <div className="font-serif text-6xl mb-2 font-semibold tracking-tighter">Playfair Display</div>
                  <div className="font-mono text-[10px] text-[#444846] uppercase">Primary Headings / Authoritative</div>
                </div>
                <div>
                  <div className="font-sans text-2xl font-light mb-2">Inter 300</div>
                  <div className="font-mono text-[10px] text-[#444846] uppercase">Body / Technical Clarity</div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-[#0D0D0D] py-32 border-t border-white/10" id="cms-infrastructure">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <AnimatedSection className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0">
            {/* Left Column */}
            <div className="lg:col-span-5 lg:pr-24 flex flex-col justify-center">
              <div className="font-mono text-[#059669] uppercase tracking-widest mb-8 text-[12px]">[ THE ENGINE ]</div>
              <h2 className="font-serif text-[48px] md:text-[60px] text-[#FAFAF8] tracking-tighter mb-8 leading-tight font-semibold">
                Payload CMS 3.0 Integration.
              </h2>
              <p className="font-sans text-[18px] text-[#444846] leading-relaxed font-light">
                Total operational control. The export team manages product specifications, EU Organic certifications, and RFQ lead data dynamically—without touching a single line of code.
              </p>
            </div>
            
            {/* Vertical Divider (Desktop) */}
            <div className="hidden lg:block w-px bg-white/10 h-full"></div>
            
            {/* Right Column */}
            <div className="lg:col-span-6 lg:pl-24 flex items-center">
              <div className="w-full border border-white/10 bg-[#141414] rounded-none overflow-hidden">
                {/* Mockup Header */}
                <div className="border-b border-white/10 px-4 py-2 flex justify-between items-center bg-[#0D0D0D]">
                  <span className="font-mono text-[10px] text-white/40">[ ADMIN_TERMINAL_V3.0 ]</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-white/10"></div>
                    <div className="w-2 h-2 rounded-full bg-white/10"></div>
                  </div>
                </div>
                <div className="flex">
                  {/* Sidebar Rail */}
                  <div className="w-12 border-r border-white/10 flex flex-col items-center py-4 gap-4 bg-[#0D0D0D]">
                    <span className="w-4 h-4 border border-white/20"></span>
                    <span className="w-4 h-4 bg-[#059669]"></span>
                    <span className="w-4 h-4 border border-white/20"></span>
                    <span className="w-4 h-4 border border-white/20"></span>
                  </div>
                  {/* Data Table */}
                  <div className="flex-1 p-4 overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="text-left border-b border-white/10">
                          <th className="font-mono text-[10px] text-white/40 pb-2 font-normal">ID</th>
                          <th className="font-mono text-[10px] text-white/40 pb-2 font-normal">PRODUCT</th>
                          <th className="font-mono text-[10px] text-white/40 pb-2 font-normal">CERTIFICATION</th>
                          <th className="font-mono text-[10px] text-white/40 pb-2 font-normal text-right">STATUS</th>
                        </tr>
                      </thead>
                      <tbody className="font-mono text-[11px]">
                        <tr className="border-b border-white/5">
                          <td className="py-3 text-white/60">SP-01</td>
                          <td className="py-3 text-[#FAFAF8]">DRIED OREGANO</td>
                          <td className="py-3 text-white/60">EU ORGANIC</td>
                          <td className="py-3 text-[#059669] text-right">[ ACTIVE ]</td>
                        </tr>
                        <tr>
                          <td className="py-3 text-white/60">SP-02</td>
                          <td className="py-3 text-[#FAFAF8]">THYME LEAVES</td>
                          <td className="py-3 text-white/60">USDA NOP</td>
                          <td className="py-3 text-[#059669] text-right">[ ACTIVE ]</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-[#FAFAF8] text-[#0D0D0D] py-32 border-t border-[#0D0D0D]" id="digital-infrastructure">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          {/* Section Header */}
          <AnimatedSection className="mb-24">
            <div className="font-mono text-[#059669] text-[10px] uppercase tracking-widest mb-8">[ DIGITAL INFRASTRUCTURE ]</div>
            <h2 className="font-serif text-6xl tracking-tighter mb-6 leading-tight font-semibold">Built for Borderless Trade.</h2>
            <p className="font-sans text-[18px] text-[#444846] max-w-md font-light">Fully localized routing and content delivery.</p>
          </AnimatedSection>

          {/* i18n Feature Block */}
          <AnimatedSection className="border border-[#0D0D0D] p-8 mb-24 flex flex-col md:flex-row gap-4 items-center">
            <span className="font-mono text-[#059669] font-bold text-[12px]">GLOBAL i18n ROUTING SUPPORTED:</span>
            <span className="font-mono text-[12px]">ENGLISH / SPANISH / TURKISH / ARABIC (RTL) / PERSIAN (RTL)</span>
          </AnimatedSection>
          
          <AnimatedSection className="py-16 flex justify-center items-center w-full">
            <a href="#" className="inline-flex items-center justify-center bg-[#059669] text-white font-mono text-[16px] tracking-widest px-16 py-8 rounded-none hover:bg-[#059669]/90 transition-all duration-300 w-full md:w-auto min-w-[400px] border border-[#059669]">
              VIEW LIVE PROJECT ↗
            </a>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

export default ProjectSpicevo;
