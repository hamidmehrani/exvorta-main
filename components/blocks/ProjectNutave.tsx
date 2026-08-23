'use client';

import React from 'react';
import type { Project } from '@/payload-types';
import { AnimatedSection } from '@/components/ui/Reveal';
import { CMSImage } from '@/components/ui/CMSImage';
import Link from 'next/link';

export function ProjectNutave({ project }: { project?: Project }) {
  const heroImageUrl = project?.heroImage && typeof project.heroImage === 'object' && project.heroImage.url
    ? project.heroImage.url
    : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTcX8iFlHKFQvFN8bJQfOGg-_nzLQXMhBlL202Kmrc73fYxYhLKeFJWoMmZcXKwAtP3M0VlUY3zIeyjilaLKZQ9ArHT75i9gZKSBA_HnCIwE6IINE61ZOlhaXC2qYS880W7rWArYRukR8buTNfzLK6N-4I6FRbjkL5MSw8Cx19KQSo7DxjgWq3uZ1DCBTsKKX5xrVIiytGpYkGJ_rA5hYotAwpH8xIvVrdnKjibZ9X1yW7lSnishAJ';

  return (
    <div className="bg-[#3B2314] text-[#FAF7F2] font-sans antialiased">
      {/* Main Content */}
      <main className="pt-32 pb-16 min-h-screen flex flex-col justify-center">
        <div className="max-w-[1280px] mx-auto px-6 w-full relative">
          {/* Back Link */}
          <Link className="inline-flex items-center gap-2 font-mono text-[#C8922A] uppercase tracking-widest text-sm mb-12 hover:opacity-80 transition-opacity" href="/portfolio">
            <span>←</span> BACK TO INDEX
          </Link>
          
          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
            {/* Left Column (40%) */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <AnimatedSection>
                <h1 className="font-serif text-[clamp(60px,8vw,120px)] leading-none mb-6">Nutave</h1>
                <p className="font-sans text-[18px] text-[#FAF7F2]/80 font-light max-w-md">
                  Premium Dried Fruits & Nuts Exporter.
                </p>
              </AnimatedSection>
              
              {/* Specs Table */}
              <AnimatedSection className="mt-16 border-t border-[#50443f] font-mono text-sm">
                {project?.metrics && project.metrics.length > 0 ? (
                  project.metrics.map((metric, i) => (
                    <div key={i} className="py-4 border-b border-[#50443f] grid grid-cols-3">
                      <div className="col-span-1 text-[#FAF7F2]/60 uppercase">{metric.label}</div>
                      <div className="col-span-2">{metric.value}</div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="py-4 border-b border-[#50443f] grid grid-cols-3">
                      <div className="col-span-1 text-[#FAF7F2]/60">ESTABLISHED</div>
                      <div className="col-span-2">2011, Izmir, Turkey</div>
                    </div>
                    <div className="py-4 border-b border-[#50443f] grid grid-cols-3">
                      <div className="col-span-1 text-[#FAF7F2]/60">VOLUME</div>
                      <div className="col-span-2">650+ MT/YEAR</div>
                    </div>
                    <div className="py-4 border-b border-[#50443f] grid grid-cols-3">
                      <div className="col-span-1 text-[#FAF7F2]/60">CERTIFICATIONS</div>
                      <div className="col-span-2">BRC Grade A, FSSC 22000</div>
                    </div>
                    <div className="py-4 border-b border-[#50443f] grid grid-cols-3">
                      <div className="col-span-1 text-[#FAF7F2]/60">TECH STACK</div>
                      <div className="col-span-2">Next.js 15, Payload CMS</div>
                    </div>
                  </>
                )}
              </AnimatedSection>
            </div>
            
            {/* Right Column (60%) */}
            <div className="lg:col-span-7 h-[60vh] lg:h-auto min-h-[500px] relative">
              {project?.heroImage ? (
                 <CMSImage media={project.heroImage} className="w-full h-full object-cover absolute inset-0" />
              ) : (
                <img alt="Nutave Case Study" className="w-full h-full object-cover absolute inset-0" src={heroImageUrl} />
              )}
            </div>
          </div>
          
          {/* Bottom Line */}
          <div className="w-full h-px bg-[#50443f]"></div>
        </div>
      </main>

      <section className="bg-[#FAF7F2] text-[#3B2314] py-32 border-t border-[#EAE5D9]">
        <div className="max-w-[1280px] mx-auto px-6">
          {/* Top Section: Positioning Statement */}
          <AnimatedSection className="mb-24">
            <div className="font-mono text-[#C8922A] text-sm tracking-widest uppercase mb-8">[ BRAND POSITIONING ]</div>
            <blockquote className="font-serif italic text-4xl md:text-6xl max-w-[800px] leading-tight mb-16">
              "The Turkish dried fruit and nut exporter that premium retailers rely on — because quality is not a promise, it is a specification."
            </blockquote>
            <div className="w-full h-px bg-[#EAE5D9]"></div>
          </AnimatedSection>

          {/* Bottom Section: Design System Grid */}
          <AnimatedSection className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left Column: Palette (60%) */}
            <div className="lg:col-span-7">
              <div className="font-mono text-[#C8922A] text-sm tracking-widest uppercase mb-8">[ PALETTE ]</div>
              <div className="flex flex-wrap gap-4">
                <div className="w-32 h-32 border border-[#3B2314] bg-[#FAF7F2] flex items-end p-3">
                  <span className="font-mono text-[10px] text-[#3B2314] font-bold">CANVAS</span>
                </div>
                <div className="w-32 h-32 border border-[#3B2314] bg-[#3B2314] flex items-end p-3">
                  <span className="font-mono text-[10px] text-[#FAF7F2] font-bold">INK</span>
                </div>
                <div className="w-32 h-32 border border-[#3B2314] bg-[#C8922A] flex items-end p-3">
                  <span className="font-mono text-[10px] text-[#3B2314] font-bold">GOLD ACCENT</span>
                </div>
              </div>
            </div>
            
            {/* Right Column: Typography (40%) */}
            <div className="lg:col-span-5">
              <div className="font-mono text-[#C8922A] text-sm tracking-widest uppercase mb-8">[ TYPOGRAPHY ]</div>
              <div className="space-y-12">
                <div>
                  <div className="font-serif text-5xl mb-2">Playfair Display</div>
                  <div className="font-mono text-xs uppercase tracking-wider opacity-60">Editorial Headings / Luxury Heritage</div>
                </div>
                <div>
                  <div className="font-sans text-2xl font-medium mb-2">Space Grotesk</div>
                  <div className="font-mono text-xs uppercase tracking-wider opacity-60">Data & Specs / Industrial Authority</div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-[#141512] py-[120px] border-t border-[#292926]">
        <div className="max-w-[1280px] mx-auto px-6">
          <AnimatedSection className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0">
            <div className="lg:col-span-5 lg:pr-16">
              <div className="font-mono text-[#C8922A] text-[12px] tracking-widest uppercase mb-8">[ COMPLIANCE ENGINE ]</div>
              <h2 className="font-serif text-[#FAF7F2] text-5xl md:text-6xl mb-8 leading-tight">Dynamic Quality Control.</h2>
              <p className="font-sans text-[#EAE5D9] font-light text-[18px]">
                Nutave's BRC Grade A status requires rigorous traceability. We engineered a headless Payload CMS architecture that allows their QC team to instantly attach lab results, sensory profiles, and batch numbers to every shipment without touching code.
              </p>
            </div>
            
            <div className="lg:col-span-7 lg:pl-16 lg:border-l border-[#292926]">
              <div className="border border-[#50443f] bg-[#0D0D0D] p-6">
                <div className="font-mono text-[11px] uppercase tracking-widest text-[#EAE5D9]/40 mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#059669] rounded-full"></span> SYSTEM_TRACEABILITY_ACTIVE
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full font-mono text-[11px] uppercase tracking-wider text-[#EAE5D9]">
                    <thead className="border-b border-[#292926]">
                      <tr>
                        <th className="text-left py-3 font-medium">LOT NO.</th>
                        <th className="text-left py-3 font-medium">PRODUCT</th>
                        <th className="text-left py-3 font-medium">GRADE</th>
                        <th className="text-right py-3 font-medium">LAB REPORT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#292926]">
                      <tr>
                        <td className="py-4">L-49201</td>
                        <td className="py-4">MEDJOOL DATES</td>
                        <td className="py-4">EXTRA</td>
                        <td className="py-4 text-right text-[#C8922A]">[ VERIFIED ]</td>
                      </tr>
                      <tr>
                        <td className="py-4">L-49202</td>
                        <td className="py-4">ALMONDS, NONPAREIL</td>
                        <td className="py-4">GRADE A</td>
                        <td className="py-4 text-right text-[#C8922A]">[ VERIFIED ]</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 pt-6 border-t border-[#292926] font-mono text-[10px] text-[#EAE5D9]/30">
                  SECURE_HASH: 8f2e...91a0 | PAYLOAD_CMS_V3.0
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-[#FAF7F2] py-[120px] border-t border-[#EAE5D9]">
        <AnimatedSection className="max-w-[1280px] mx-auto px-6 text-center flex flex-col items-center">
          <div className="font-mono text-[#C8922A] text-[12px] tracking-widest uppercase mb-8">[ DIGITAL PRESENCE ]</div>
          <h2 className="font-serif text-[#3B2314] text-5xl md:text-[80px] leading-tight mb-8 font-semibold">Built for Premium Retail.</h2>
          <p className="font-sans text-[18px] text-[#3B2314] font-light max-w-[600px] mb-12">Experience the live Nutave digital infrastructure.</p>
          <a className="bg-[#C8922A] text-[#3B2314] font-mono font-medium py-6 px-12 uppercase tracking-widest transition-all hover:opacity-90" href="#">
            VIEW LIVE PROJECT ↗
          </a>
        </AnimatedSection>
      </section>
    </div>
  );
}

export default ProjectNutave;
