'use client';

import React from 'react';
import type { Project } from '@/payload-types';
import { AnimatedSection } from '@/components/ui/Reveal';
import { CMSImage } from '@/components/ui/CMSImage';
import Link from 'next/link';

export function ProjectStonvi({ project }: { project?: Project }) {
  const heroImageUrl = project?.heroImage && typeof project.heroImage === 'object' && project.heroImage.url
    ? project.heroImage.url
    : 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1fBGp_Q-oYaZ_77-Dl_o0yav-sbdcaXdvuZurZ6Xw_cFmzia2dVyoWlkeHktMpOx-uPNV1RZh1higeAS7Cefvwm-QJaB6nIvs5wwou5LOSJFBWXQAJlgxKQ1VKjkvbDlgruwshK21vYvyIIdaaoE8_CRLUExVLK_itwzJbc0NpEk7ZQU-sGCu96gv237wss-RqkVV4dCDyf37XJ7-ZIY9MEd79b4aps2VhT9qwb6uym6ca-TBxbC6';

  return (
    <div className="bg-[#F4F6F7] text-[#2C3E50] font-sans antialiased">
      {/* Main Content Canvas */}
      <main className="flex-grow flex flex-col max-w-[1440px] mx-auto w-full border-x border-[#2C3E50]/20 pt-32 pb-0 min-h-[90vh]">
        {/* Top Bar: Back to Index */}
        <div className="w-full border-b border-[#2C3E50] px-6 py-4 flex items-center bg-[#F4F6F7]">
          <Link className="font-mono text-[12px] text-[#5C6E7A] uppercase flex items-center gap-2 hover:text-[#2C3E50] transition-colors tracking-widest" href="/portfolio">
            <span className="text-[16px]">←</span>
            BACK TO INDEX
          </Link>
        </div>
        
        {/* Hero Grid Section */}
        <div className="flex flex-col lg:flex-row w-full flex-grow border-b-2 border-[#2C3E50]">
          {/* Left Column: Content (40%) */}
          <div className="w-full lg:w-[40%] flex flex-col border-r border-[#2C3E50] lg:border-b-0 border-b">
            {/* Headline & Subtitle Area */}
            <AnimatedSection className="p-8 lg:p-12 flex-grow flex flex-col justify-center">
              <h1 className="font-serif text-[clamp(60px,8vw,120px)] leading-none text-[#2C3E50] mb-4 tracking-tighter">Stonvi</h1>
              <p className="font-sans text-[#2C3E50] text-xl font-light">Ceramic & Building Materials Exporter.</p>
            </AnimatedSection>
            
            {/* Technical Table (4 Rows) */}
            <AnimatedSection className="w-full border-t border-[#2C3E50] flex flex-col">
              {project?.metrics && project.metrics.length > 0 ? (
                project.metrics.map((metric, i) => (
                  <div key={i} className="flex border-b border-[#2C3E50] last:border-b-0">
                    <div className="w-1/3 border-r border-[#2C3E50] p-4 font-mono text-[12px] text-[#5C6E7A] flex items-center uppercase tracking-widest">{metric.label}</div>
                    <div className="w-2/3 p-4 font-mono text-[11px] text-[#2C3E50] flex items-center uppercase">{metric.value}</div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex border-b border-[#2C3E50]">
                    <div className="w-1/3 border-r border-[#2C3E50] p-4 font-mono text-[12px] text-[#5C6E7A] flex items-center uppercase tracking-widest">ESTABLISHED</div>
                    <div className="w-2/3 p-4 font-mono text-[11px] text-[#2C3E50] flex items-center uppercase">1998</div>
                  </div>
                  <div className="flex border-b border-[#2C3E50] bg-[#F4F6F7]/50">
                    <div className="w-1/3 border-r border-[#2C3E50] p-4 font-mono text-[12px] text-[#5C6E7A] flex items-center uppercase tracking-widest">VOLUME</div>
                    <div className="w-2/3 p-4 font-mono text-[11px] text-[#2C3E50] flex items-center uppercase">2.4M SQM/YR</div>
                  </div>
                  <div className="flex border-b border-[#2C3E50]">
                    <div className="w-1/3 border-r border-[#2C3E50] p-4 font-mono text-[12px] text-[#5C6E7A] flex items-center uppercase tracking-widest">CERTIFICATIONS</div>
                    <div className="w-2/3 p-4 font-mono text-[11px] text-[#2C3E50] flex items-center uppercase">ISO 9001, CE, LEED</div>
                  </div>
                  <div className="flex">
                    <div className="w-1/3 border-r border-[#2C3E50] p-4 font-mono text-[12px] text-[#5C6E7A] flex items-center uppercase tracking-widest">DELIVERABLES</div>
                    <div className="w-2/3 p-4 font-mono text-[11px] text-[#2C3E50] flex items-center uppercase">PROCUREMENT PLATFORM</div>
                  </div>
                </>
              )}
            </AnimatedSection>
          </div>
          
          {/* Right Column: Image (60%) */}
          <div className="w-full lg:w-[60%] h-[512px] lg:h-auto min-h-[500px] relative">
            {project?.heroImage ? (
               <CMSImage media={project.heroImage} className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 mix-blend-multiply opacity-80" />
            ) : (
              <div 
                className="absolute inset-0 bg-cover bg-center grayscale contrast-125 mix-blend-multiply opacity-80" 
                style={{ backgroundImage: `url('${heroImageUrl}')` }}
              ></div>
            )}
            
            {/* Crosshair overlay for architectural feel */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#2C3E50]/50"></div>
              <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#2C3E50]/50"></div>
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[#2C3E50]/50"></div>
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#2C3E50]/50"></div>
            </div>
          </div>
        </div>
      </main>

      <section className="w-full bg-[#F4F6F7] border-t border-[#2C3E50] py-[120px] px-6 relative" style={{ backgroundImage: 'radial-gradient(#2C3E50 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}>
        <div className="max-w-[1440px] mx-auto">
          {/* TOP PART: Positioning Statement */}
          <AnimatedSection className="mb-12 bg-[#F4F6F7]/80 backdrop-blur-sm p-8 inline-block">
            <div className="font-mono text-[12px] text-[#5C6E7A] uppercase tracking-widest mb-6">[ BRAND POSITIONING ]</div>
            <blockquote className="font-serif text-[48px] italic text-[#2C3E50] max-w-[800px] leading-tight mb-12">
              "The ceramic and building materials exporter that developers trust — because we understand a project timeline, not just a purchase order."
            </blockquote>
            <div className="w-full h-px bg-[#2C3E50]"></div>
          </AnimatedSection>

          {/* BOTTOM PART: 2-Column Grid */}
          <AnimatedSection className="grid grid-cols-1 lg:grid-cols-[60%_40%] border-t border-[#2C3E50] bg-[#F4F6F7]">
            {/* LEFT COLUMN: Material Palette */}
            <div className="p-8 lg:p-12 border-r border-[#2C3E50]">
              <div className="font-mono text-[12px] text-[#5C6E7A] uppercase tracking-widest mb-8">[ MATERIAL PALETTE ]</div>
              <div className="flex gap-4">
                <div className="flex-1 aspect-square border border-[#2C3E50] flex flex-col justify-end p-4 bg-[#F4F6F7]">
                  <span className="font-mono text-[10px] text-[#2C3E50] uppercase tracking-widest">CANVAS / BASE</span>
                </div>
                <div className="flex-1 aspect-square border border-[#2C3E50] flex flex-col justify-end p-4 bg-[#2C3E50]">
                  <span className="font-mono text-[10px] text-white uppercase tracking-widest">INK / PRIMARY</span>
                </div>
                <div className="flex-1 aspect-square border border-[#2C3E50] flex flex-col justify-end p-4 bg-[#5C6E7A]">
                  <span className="font-mono text-[10px] text-white uppercase tracking-widest">STEEL / ACCENT</span>
                </div>
              </div>
            </div>
            
            {/* RIGHT COLUMN: Typography Architecture */}
            <div className="p-8 lg:p-12">
              <div className="font-mono text-[12px] text-[#5C6E7A] uppercase tracking-widest mb-8">[ TYPOGRAPHY ]</div>
              <div className="space-y-8">
                <div>
                  <div className="font-serif text-4xl text-[#2C3E50] mb-1 font-semibold">Playfair Display</div>
                  <div className="font-mono text-[12px] text-[#5C6E7A] uppercase tracking-widest">Headings / Architectural Authority</div>
                </div>
                <div>
                  <div className="font-sans text-2xl text-[#2C3E50] mb-1 font-medium">Space Grotesk</div>
                  <div className="font-mono text-[12px] text-[#5C6E7A] uppercase tracking-widest">Metadata & Specs / Precision</div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="w-full bg-[#2C3E50] py-[120px] px-6 border-t border-[#F4F6F7]/20">
        <div className="max-w-[1440px] mx-auto">
          <AnimatedSection className="grid grid-cols-1 lg:grid-cols-[40%_60%] border border-[#F4F6F7]/20">
            {/* Left Column */}
            <div className="p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-[#F4F6F7]/20 flex flex-col gap-8 bg-[#2C3E50]">
              <div className="font-mono text-[12px] text-[#5C6E7A] uppercase tracking-widest">[ SYSTEM ARCHITECTURE ]</div>
              <div className="space-y-6">
                <h2 className="font-serif text-[64px] text-[#F4F6F7] leading-none tracking-tighter">Centralized PIM.</h2>
                <p className="font-sans text-lg text-[#F4F6F7]/80 font-light max-w-md">
                  Managing over 800 ceramic SKUs requires institutional-grade infrastructure. We deployed a headless Payload CMS architecture to dynamically control technical specifications, BIM files, and ISO certifications across 35 countries.
                </p>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="p-8 lg:p-12 bg-[#2C3E50] flex items-center justify-center">
              <div className="w-full border border-[#F4F6F7]/40 p-6 font-mono text-[#F4F6F7]">
                <div className="grid grid-cols-4 border-b border-[#F4F6F7]/40 pb-4 mb-4 text-[12px] tracking-widest opacity-60">
                  <div>SKU</div>
                  <div>PRODUCT</div>
                  <div>THICKNESS</div>
                  <div className="text-right">BIM FILE</div>
                </div>
                <div className="space-y-4 text-[13px] tracking-wider">
                  <div className="grid grid-cols-4 items-center border-b border-[#F4F6F7]/10 pb-4">
                    <div className="opacity-80">BG-800</div>
                    <div className="uppercase">BASALTINA GRIGIO</div>
                    <div>12.5 MM</div>
                    <div className="text-right text-[#5C6E7A]">[ READY ]</div>
                  </div>
                  <div className="grid grid-cols-4 items-center">
                    <div className="opacity-80">CB-120</div>
                    <div className="uppercase">CARRARA BIANCO</div>
                    <div>6.0 MM</div>
                    <div className="text-right text-[#5C6E7A]">[ READY ]</div>
                  </div>
                </div>
                
                {/* Structural Grid Lines */}
                <div className="mt-8 pt-4 border-t border-[#F4F6F7]/40 flex justify-between">
                  <div className="w-px h-4 bg-[#F4F6F7]/40"></div>
                  <div className="w-px h-4 bg-[#F4F6F7]/40"></div>
                  <div className="w-px h-4 bg-[#F4F6F7]/40"></div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="w-full bg-[#F4F6F7] border-t border-[#2C3E50] py-[120px] px-6 relative" style={{ backgroundImage: 'radial-gradient(#2C3E50 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}>
        <AnimatedSection className="max-w-[1440px] mx-auto text-center flex flex-col items-center bg-[#F4F6F7]/90 backdrop-blur-md p-16 inline-block">
          <div className="font-mono text-[12px] text-[#5C6E7A] uppercase tracking-widest mb-6">[ DIGITAL PRESENCE ]</div>
          <h2 className="font-serif text-[80px] text-[#2C3E50] leading-none mb-8 tracking-tighter">Specify with confidence.</h2>
          <p className="font-sans text-xl text-[#2C3E50] font-light mb-12 max-w-md">Experience the live Stonvi architectural specification platform.</p>
          <a className="bg-[#5C6E7A] text-white font-mono font-semibold uppercase px-12 py-6 transition-all hover:bg-[#2C3E50] tracking-widest text-[12px]" href="#">
            VIEW LIVE PROJECT ↗
          </a>
        </AnimatedSection>
      </section>
    </div>
  );
}

export default ProjectStonvi;
