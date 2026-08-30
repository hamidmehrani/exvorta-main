'use client';

import React from 'react';
import type { Project } from '@/payload-types';
import { AnimatedSection } from '@/components/ui/Reveal';
import { CMSImage } from '@/components/ui/CMSImage';
import Image from 'next/image';
import Link from 'next/link';

export function ProjectThemedLayout({ project }: { project?: Project }) {
  const slug = project?.slug || 'spicevo';
  const heroImageUrl = project?.heroImage && typeof project.heroImage === 'object' && project.heroImage.url
    ? project.heroImage.url
    : `/portfolio-${slug}.png`;
  
  // Default fallbacks based on slug
  const bgColors: Record<string, string> = { spicevo: '#FAFAF8', nutave: '#3B2314', stonvi: '#F4F6F7' };
  const accentColors: Record<string, string> = { spicevo: '#059669', nutave: '#C8922A', stonvi: '#2C3E50' };
  
  const paletteThemes: Record<string, {names: string[], colors: string[]}> = {
    spicevo: { names: ['WARM CREAM', 'DEEP RUST', 'FOREST GREEN'], colors: ['#F7F2EC', '#8B3A0F', '#2D5A27'] },
    nutave: { names: ['CANVAS', 'INK', 'GOLD'], colors: ['#FAFAF8', '#0D0D0D', '#C8922A'] },
    stonvi: { names: ['CANVAS', 'INK', 'STEEL'], colors: ['#FAFAF8', '#0D0D0D', '#2C3E50'] },
  };

  const bgColor = project?.heroBgColor || bgColors[slug] || '#141414';
  const accentColor = project?.accentColor || accentColors[slug] || '#059669';
  const palette = paletteThemes[slug] || paletteThemes['spicevo'];

  const excerpt = project?.excerpt || 'Premium Case Study';

  return (
    <div className="bg-[#0D0D0D] antialiased text-[#FAFAF8]">
      {/* Main Content: Case Study Hero */}
      <main className="min-h-screen pt-32 pb-24 px-6 md:px-12 flex flex-col justify-center border-b border-white/10" style={{ backgroundColor: '#0D0D0D' }}>
        <div className="max-w-[1440px] mx-auto w-full relative z-10">
          <div className="mb-12">
            <Link className="inline-flex items-center gap-2 font-mono text-[10px] uppercase transition-colors" style={{ color: accentColor }} href="/portfolio">
              <span className="text-[14px]">←</span>
              BACK TO INDEX
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            <div className="col-span-1 lg:col-span-5 flex flex-col justify-end">
              <AnimatedSection>
                <h1 className="font-serif text-[48px] md:text-[84px] tracking-tighter leading-none mb-6 font-semibold">
                  {project?.title || 'Project'}
                </h1>
                <p className="font-sans text-[18px] text-[#444846] max-w-md mb-12 font-light">
                  {excerpt}
                </p>
              </AnimatedSection>
              
              <AnimatedSection className="mt-auto">
                <table className="w-full border-collapse border border-white/10">
                  <tbody>
                    {project?.metrics && project.metrics.length > 0 ? (
                      project.metrics?.map((metric, i) => (
                        <tr key={i} className="border-b border-white/10 last:border-b-0">
                          <td className="p-4 border-r border-white/10 font-mono text-[10px] w-1/3 uppercase" style={{ color: accentColor }}>{metric.label}:</td>
                          <td className="p-4 font-mono text-[10px] text-[#FAFAF8] uppercase">{metric.value}</td>
                        </tr>
                      ))
                    ) : (
                      <>
                        <tr className="border-b border-white/10">
                          <td className="p-4 border-r border-white/10 font-mono text-[10px] w-1/3" style={{ color: accentColor }}>ESTABLISHED:</td>
                          <td className="p-4 font-mono text-[10px] text-[#FAFAF8]">2014, Istanbul, Turkey</td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="p-4 border-r border-white/10 font-mono text-[10px]" style={{ color: accentColor }}>VOLUME:</td>
                          <td className="p-4 font-mono text-[10px] text-[#FAFAF8]">480+ MT/YEAR</td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="p-4 border-r border-white/10 font-mono text-[10px]" style={{ color: accentColor }}>CERTIFICATIONS:</td>
                          <td className="p-4 font-mono text-[10px] text-[#FAFAF8]">EU Organic, USDA NOP, ISO 22000</td>
                        </tr>
                        <tr>
                          <td className="p-4 border-r border-white/10 font-mono text-[10px]" style={{ color: accentColor }}>TECH STACK:</td>
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
                <Image
                  className="w-full h-full object-cover rounded-none grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                  src={heroImageUrl}
                  alt={project?.title || 'Case Study'}
                  width={1200}
                  height={800}
                  unoptimized
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <section className="text-[#0D0D0D] py-32 border-t border-[#0D0D0D]" style={{ backgroundColor: bgColor }} id="brand-strategy">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          {/* Part 1: BRAND POSITIONING */}
          <AnimatedSection className="mb-24">
            <div className="font-mono text-[10px] uppercase tracking-widest mb-8" style={{ color: accentColor }}>[ BRAND POSITIONING ]</div>
            <blockquote className="font-serif text-[32px] md:text-[60px] italic max-w-[800px] mb-12 leading-tight font-semibold">
              "Providing transparency and scale to a borderless market."
            </blockquote>
            <div className="border-b border-[#0D0D0D]/10 w-full"></div>
          </AnimatedSection>

          {/* Part 2: DESIGN SYSTEM GRID */}
          <AnimatedSection className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            {/* Left Column (PALETTE) */}
            <div className="lg:col-span-7">
              <div className="font-mono text-[10px] uppercase tracking-widest mb-8" style={{ color: accentColor }}>[ PALETTE ]</div>
              <div className="grid grid-cols-3 gap-4">
                {palette.colors?.map((color, idx) => (
                  <div key={idx} className="aspect-square border border-[#0D0D0D] flex flex-col justify-end p-4" style={{ backgroundColor: color }}>
                    <span className={`font-mono text-[10px] uppercase ${idx > 0 ? 'text-white' : ''}`}>{palette.names[idx]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column (TYPOGRAPHY) */}
            <div className="lg:col-span-5">
              <div className="font-mono text-[10px] uppercase tracking-widest mb-8" style={{ color: accentColor }}>[ TYPOGRAPHY ]</div>
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
              <div className="font-mono uppercase tracking-widest mb-8 text-[12px]" style={{ color: accentColor }}>[ THE ENGINE ]</div>
              <h2 className="font-serif text-[48px] md:text-[60px] text-[#FAFAF8] tracking-tighter mb-8 leading-tight font-semibold">
                Payload CMS 3.0 Integration.
              </h2>
              <p className="font-sans text-[18px] text-[#444846] leading-relaxed font-light">
                Total operational control. The export team manages product specifications and certifications dynamically.
              </p>
            </div>
            
            {/* Vertical Divider (Desktop) */}
            <div className="hidden lg:block w-px bg-white/10 h-full"></div>
            
            {/* Right Column */}
            <div className="lg:col-span-6 lg:pl-24 flex items-center">
              <div className="w-full border border-white/10 bg-[#141414] rounded-none overflow-hidden">
                <div className="border-b border-white/10 px-4 py-2 flex justify-between items-center bg-[#0D0D0D]">
                  <span className="font-mono text-[10px] text-white/40">[ ADMIN_TERMINAL_V3.0 ]</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-white/10"></div>
                    <div className="w-2 h-2 rounded-full bg-white/10"></div>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-12 border-r border-white/10 flex flex-col items-center py-4 gap-4 bg-[#0D0D0D]">
                    <span className="w-4 h-4 border border-white/20"></span>
                    <span className="w-4 h-4" style={{ backgroundColor: accentColor }}></span>
                    <span className="w-4 h-4 border border-white/20"></span>
                    <span className="w-4 h-4 border border-white/20"></span>
                  </div>
                  <div className="flex-1 p-4 overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="text-left border-b border-white/10">
                          <th className="font-mono text-[10px] text-white/40 pb-2 font-normal">ID</th>
                          <th className="font-mono text-[10px] text-white/40 pb-2 font-normal">PRODUCT</th>
                          <th className="font-mono text-[10px] text-white/40 pb-2 font-normal">STATUS</th>
                        </tr>
                      </thead>
                      <tbody className="font-mono text-[11px]">
                        <tr className="border-b border-white/5">
                          <td className="py-3 text-white/60">PR-01</td>
                          <td className="py-3 text-[#FAFAF8]">PREMIUM BATCH</td>
                          <td className="py-3 text-right" style={{ color: accentColor }}>[ ACTIVE ]</td>
                        </tr>
                        <tr>
                          <td className="py-3 text-white/60">PR-02</td>
                          <td className="py-3 text-[#FAFAF8]">STANDARD BATCH</td>
                          <td className="py-3 text-right" style={{ color: accentColor }}>[ ACTIVE ]</td>
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

      <section className="py-32 border-t border-[#0D0D0D]" style={{ backgroundColor: bgColor }} id="digital-infrastructure">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 text-[#0D0D0D]">
          <AnimatedSection className="mb-24">
            <div className="font-mono text-[10px] uppercase tracking-widest mb-8" style={{ color: accentColor }}>[ DIGITAL INFRASTRUCTURE ]</div>
            <h2 className="font-serif text-6xl tracking-tighter mb-6 leading-tight font-semibold">Built for Borderless Trade.</h2>
            <p className="font-sans text-[18px] text-[#444846] max-w-md font-light">Fully localized routing and content delivery.</p>
          </AnimatedSection>
          
          {project?.liveUrl ? (
            <AnimatedSection className="py-16 flex justify-center items-center w-full">
              <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center text-white font-mono text-[16px] tracking-widest px-16 py-8 rounded-none hover:opacity-90 transition-all duration-300 w-full md:w-auto min-w-[400px] border border-transparent" style={{ backgroundColor: accentColor }}>
                VIEW LIVE PROJECT ↗
              </Link>
            </AnimatedSection>
          ) : (
            <AnimatedSection className="py-16 flex justify-center items-center w-full">
              <Link href="/rfq" className="inline-flex items-center justify-center text-white font-mono text-[16px] tracking-widest px-16 py-8 rounded-none hover:opacity-90 transition-all duration-300 w-full md:w-auto min-w-[400px] border border-transparent" style={{ backgroundColor: accentColor }}>
                [ REQUEST A SIMILAR BUILD ] ↗
              </Link>
            </AnimatedSection>
          )}
        </div>
      </section>
    </div>
  );
}

export default ProjectThemedLayout;
