'use client';
import React from 'react';
import { AnimatedSection } from '@/components/ui/Reveal';
import { Container } from '@/components/ui/Container';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { Stat } from '@/components/ui/Stat';
import type { Project } from '@/payload-types';
import { RichText } from '@payloadcms/richtext-lexical/react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAnimationLevel } from '@/lib/animations';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { MagneticButton } from '@/components/ui/MagneticButton';
import Image from 'next/image';

// Project Specific Content Mapping
interface ProjectSpecifics {
  quote: string;
  typo: {
    serif: string;
    sans: string;
  };
  system: {
    title: string;
    desc: string;
    stats: { label: string; value: string; trend?: string }[] | null;
  };
  mockup: {
    title: string;
    headers: string[];
    rows: string[][];
    footer: string | null;
  };
  digitalPresence: string;
}

const projectSpecifics: Record<string, ProjectSpecifics> = {
  nutave: {
    quote: '"The Turkish dried fruit and nut exporter that premium retailers rely on — because quality is not a promise, it is a specification."',
    typo: {
      serif: 'Editorial Headings / Luxury Heritage',
      sans: 'Data & Specs / Industrial Authority'
    },
    system: {
      title: 'Dynamic Quality Control.',
      desc: "Nutave's BRC Grade A status requires rigorous traceability. We engineered a headless Payload CMS architecture that allows their QC team to instantly attach lab results, sensory profiles, and batch numbers to every shipment without touching code.",
      stats: [
        { label: 'Lot Traceability', value: '100%', trend: 'Verified' },
        { label: 'Report Generation', value: '< 2s', trend: 'Optimized' }
      ]
    },
    mockup: {
      title: 'SYSTEM_TRACEABILITY_ACTIVE',
      headers: ['LOT NO.', 'PRODUCT', 'GRADE', 'LAB REPORT'],
      rows: [
        ['L-49201', 'MEDJOOL DATES', 'EXTRA', '[ VERIFIED ]'],
        ['L-49202', 'ALMONDS, NONPAREIL', 'GRADE A', '[ VERIFIED ]']
      ],
      footer: 'SECURE_HASH: 8f2e...91a0 | PAYLOAD_CMS_V3.0'
    },
    digitalPresence: 'Built for Premium Retail.'
  },
  spicevo: {
    quote: '"The organic herbs supplier that European and Gulf buyers trust — because every container ships with documentation as clean as the product itself."',
    typo: {
      serif: 'Primary Headings / Authoritative',
      sans: 'Body / Technical Clarity'
    },
    system: {
      title: 'Payload CMS 3.0 Integration.',
      desc: 'Total operational control. The export team manages product specifications, EU Organic certifications, and RFQ lead data dynamically—without touching a single line of code.',
      stats: null
    },
    mockup: {
      title: 'ADMIN_TERMINAL_V3.0',
      headers: ['ID', 'PRODUCT', 'CERTIFICATION', 'STATUS'],
      rows: [
        ['SP-01', 'DRIED OREGANO', 'EU ORGANIC', '[ ACTIVE ]'],
        ['SP-02', 'THYME LEAVES', 'USDA NOP', '[ ACTIVE ]']
      ],
      footer: null
    },
    digitalPresence: 'Built for Borderless Trade.'
  },
  stonvi: {
    quote: '"The ceramic and building materials exporter that developers trust — because we understand a project timeline, not just a purchase order."',
    typo: {
      serif: 'Headings / Architectural Authority',
      sans: 'Metadata & Specs / Precision'
    },
    system: {
      title: 'Centralized PIM.',
      desc: 'Managing over 800 ceramic SKUs requires institutional-grade infrastructure. We deployed a headless Payload CMS architecture to dynamically control technical specifications, BIM files, and ISO certifications across 35 countries.',
      stats: null
    },
    mockup: {
      title: 'PIM_DASHBOARD_V2',
      headers: ['SKU', 'PRODUCT', 'THICKNESS', 'BIM FILE'],
      rows: [
        ['BG-800', 'BASALTINA GRIGIO', '12.5 MM', '[ READY ]'],
        ['CB-120', 'CARRARA BIANCO', '6.0 MM', '[ READY ]']
      ],
      footer: null
    },
    digitalPresence: 'Specify with confidence.'
  }
};

export function ProjectSingleLayout({ project }: { project?: Project }) {
  const title = project?.title || 'Nutave';
  const slug = project?.slug || 'nutave';
  const clientName = project?.clientName || 'Premium Dried Fruits & Nuts Exporter.';
  const heroImageUrl = project?.heroImage && typeof project.heroImage === 'object' && project.heroImage.url 
    ? project.heroImage.url 
    : '';

  const specifics: ProjectSpecifics = projectSpecifics[slug] || projectSpecifics['nutave'];
  
  const heroImageContainerRef = React.useRef<HTMLDivElement>(null);
  const heroImageRef = React.useRef<HTMLImageElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const animationLevel = useAnimationLevel();

  React.useEffect(() => {
    if (animationLevel === 'none' || !heroImageContainerRef.current || !heroImageRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.registerPlugin(ScrollTrigger);

          gsap.fromTo(heroImageContainerRef.current,
            { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' },
            { 
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', 
              duration: 1.2, 
              ease: 'expo.out',
              delay: 0.2 
            }
          );

          gsap.fromTo(heroImageRef.current,
            { scale: 1.2 },
            { scale: 1, duration: 1.2, ease: 'expo.out', delay: 0.2 }
          );
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    );
    if (heroImageContainerRef.current) observer.observe(heroImageContainerRef.current);
    
    return () => observer.disconnect();
  }, [animationLevel]);

  React.useEffect(() => {
    if (animationLevel === 'none' || !containerRef.current) return;
    const el = containerRef.current;
    
    const updateCursor = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty('--cursor-x', `${x}px`);
      el.style.setProperty('--cursor-y', `${y}px`);
    };
    
    el.addEventListener('mousemove', updateCursor);
    return () => el.removeEventListener('mousemove', updateCursor);
  }, [animationLevel]);

  return (
    <div 
      ref={containerRef}
      className="bg-brand-obsidian text-brand-cream font-sans font-light selection:bg-brand-emerald selection:text-brand-cream relative"
      style={{
        backgroundImage: animationLevel === 'none' ? 'none' : 'radial-gradient(600px circle at var(--cursor-x, -1000px) var(--cursor-y, -1000px), rgba(5,150,105,0.08), transparent 40%)'
      }}
    >
      <ScrollProgress />
      {/* 1. Hero */}
      <main className="pt-32 pb-16 min-h-screen flex flex-col justify-center border-b border-hairline-dark">
        <Container className="w-full relative">
          {/* Back Link */}
          <Link className="inline-flex items-center gap-2 font-mono text-label-caps uppercase tracking-widest mb-12 hover:opacity-80 transition-opacity" href="/portfolio">
            <span>←</span> BACK TO INDEX
          </Link>
          
          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
            {/* Left Column (40%) */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <AnimatedSection>
                <h1 className="font-serif text-display-mobile md:text-[clamp(60px,8vw,120px)] leading-none mb-6 font-medium">{title}</h1>
                <p className="text-body-lg text-brand-cream/80 max-w-md">
                  {clientName}
                </p>
              </AnimatedSection>
              
              {/* 6. Project Details (Specs Table) */}
              <AnimatedSection className="mt-16 border-t border-hairline-dark font-mono text-mono-data">
                {project?.metrics && project.metrics.length > 0 ? (
                  project.metrics.map((metric, index) => (
                    <div key={metric.id || index} className="py-4 border-b border-hairline-dark grid grid-cols-3">
                      <div className="col-span-1 text-brand-cream/60 uppercase">{metric.label}</div>
                      <div className="col-span-2">{metric.value}</div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="py-4 border-b border-hairline-dark grid grid-cols-3">
                      <div className="col-span-1 text-brand-cream/60">ESTABLISHED</div>
                      <div className="col-span-2">2011, Izmir, Turkey</div>
                    </div>
                    <div className="py-4 border-b border-hairline-dark grid grid-cols-3">
                      <div className="col-span-1 text-brand-cream/60">VOLUME</div>
                      <div className="col-span-2">650+ MT/YEAR</div>
                    </div>
                    <div className="py-4 border-b border-hairline-dark grid grid-cols-3">
                      <div className="col-span-1 text-brand-cream/60">CERTIFICATIONS</div>
                      <div className="col-span-2">BRC Grade A, FSSC 22000</div>
                    </div>
                    <div className="py-4 border-b border-hairline-dark grid grid-cols-3">
                      <div className="col-span-1 text-brand-cream/60">TECH STACK</div>
                      <div className="col-span-2">Next.js 15, Payload CMS</div>
                    </div>
                  </>
                )}
              </AnimatedSection>
            </div>
            
            {/* Right Column (60%) */}
            <div ref={heroImageContainerRef} className="lg:col-span-7 h-[60vh] lg:h-auto min-h-[500px] relative overflow-hidden">
              <Image ref={heroImageRef} alt={title} className="object-cover absolute inset-0 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700" src={heroImageUrl} fill priority />
            </div>
          </div>
        </Container>
      </main>

      {/* 2. Positioning Quote */}
      <section className="py-32 border-b border-hairline-dark">
        <Container>
          <AnimatedSection className="mb-24">
            <MonoLabel className="text-brand-emerald mb-8">[ BRAND POSITIONING ]</MonoLabel>
            <blockquote className="font-serif italic text-display-mobile md:text-headline-xl max-w-[800px] leading-tight mb-16 font-medium">
              {specifics.quote}
            </blockquote>
            <div className="w-full hairline"></div>
          </AnimatedSection>

          {/* 3. Palette & 4. Typography */}
          <AnimatedSection className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-7">
              <MonoLabel className="text-brand-emerald mb-8">[ PALETTE ]</MonoLabel>
              <div className="flex flex-wrap gap-4">
                <div className="w-32 h-32 border border-brand-cream/20 bg-brand-cream flex items-end p-3">
                  <span className="font-mono text-mono-terminal text-brand-obsidian font-bold">CANVAS (#FAFAF8)</span>
                </div>
                <div className="w-32 h-32 border border-brand-cream/20 bg-brand-obsidian flex items-end p-3">
                  <span className="font-mono text-mono-terminal text-brand-cream font-bold">INK (#0D0D0D)</span>
                </div>
                <div className="w-32 h-32 border border-brand-cream/20 bg-brand-emerald flex items-end p-3">
                  <span className="font-mono text-mono-terminal text-brand-cream font-bold">EMERALD (#059669)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <MonoLabel className="text-brand-emerald mb-8">[ TYPOGRAPHY ]</MonoLabel>
              <div className="space-y-12">
                <div>
                  <div className="font-serif text-headline-xl mb-2">Playfair Display</div>
                  <div className="font-mono text-mono-data uppercase tracking-wider opacity-60">{specifics.typo.serif}</div>
                </div>
                <div>
                  <div className="font-sans text-headline-lg font-medium mb-2">Inter</div>
                  <div className="font-mono text-mono-data uppercase tracking-wider opacity-60">{specifics.typo.sans}</div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* 5. System Highlights & 8. Compliance */}
      <section className="bg-mockup-sidebar py-[120px] border-b border-hairline-dark">
        <Container>
          <AnimatedSection className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0">
            <div className="lg:col-span-5 lg:pr-16 flex flex-col justify-center">
              <MonoLabel className="text-brand-emerald mb-8">[ COMPLIANCE ENGINE ]</MonoLabel>
              <h2 className="font-serif text-brand-cream text-display-mobile md:text-headline-xl mb-8 leading-tight">{specifics.system.title}</h2>
              <p className="text-body-lg text-brand-cream/80 font-light mb-12">
                {specifics.system.desc}
              </p>
              
              {specifics.system.stats && (
                <div className="grid grid-cols-2 gap-8 mt-auto">
                  {specifics.system.stats.map((stat: { label: string; value: string; trend?: string }, idx: number) => (
                    <Stat key={idx} label={stat.label} value={stat.value} trend={stat.trend} />
                  ))}
                </div>
              )}
            </div>
            
            <div className="lg:col-span-7 lg:pl-16 flex items-center">
              <div className="w-full border border-hairline-dark bg-mockup-dashboard rounded-none overflow-hidden">
                <div className="border-b border-hairline-dark px-4 py-2 flex justify-between items-center bg-brand-obsidian">
                  <span className="font-mono text-mono-terminal text-brand-cream/40">[{specifics.mockup.title}]</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-brand-cream/10"></div>
                    <div className="w-2 h-2 rounded-full bg-brand-cream/10"></div>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-12 border-r border-hairline-dark flex flex-col items-center py-4 gap-4 bg-brand-obsidian hidden sm:flex">
                    <div className="w-4 h-4 border border-brand-cream/20"></div>
                    <div className="w-4 h-4 bg-brand-emerald"></div>
                    <div className="w-4 h-4 border border-brand-cream/20"></div>
                    <div className="w-4 h-4 border border-brand-cream/20"></div>
                  </div>
                  <div className="flex-1 p-4 overflow-x-auto">
                    <table className="w-full font-mono text-mono-data uppercase tracking-wider text-brand-cream/80 whitespace-nowrap">
                      <thead className="border-b border-hairline-dark">
                        <tr>
                          {specifics.mockup.headers.map((h: string, i: number) => (
                            <th key={i} className={`py-3 font-medium text-brand-cream/40 ${i === specifics.mockup.headers.length - 1 ? 'text-right' : 'text-left'}`}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-hairline-dark">
                        {specifics.mockup.rows.map((row: string[], rowIdx: number) => (
                          <tr key={rowIdx}>
                            {row.map((cell: string, cellIdx: number) => (
                              <td key={cellIdx} className={`py-4 ${cellIdx === row.length - 1 ? 'text-right text-mockup-success' : ''}`}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {specifics.mockup.footer && (
                      <div className="mt-6 pt-6 border-t border-hairline-dark font-mono text-mono-terminal text-brand-cream/30">
                        {specifics.mockup.footer}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* 7. Gallery */}
      {project?.gallery && project.gallery.length > 0 && (
        <section className="py-[120px] border-b border-hairline-dark">
          <Container>
            <AnimatedSection>
              <MonoLabel className="text-brand-emerald mb-12">[ GALLERY ]</MonoLabel>
            </AnimatedSection>
            <div className="space-y-12">
              {project.gallery.map((item, index) => {
                const imgUrl = typeof item.image === 'object' && item.image?.url ? item.image.url : null;
                if (!imgUrl) return null;
                return (
                  <AnimatedSection key={item.id || index} className="w-full relative">
                    <Image src={imgUrl} alt={`Gallery image ${index + 1}`} width={1200} height={800} className="w-full h-auto object-cover border border-hairline-dark grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700" />
                  </AnimatedSection>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* Rich Text Body (If any) */}
      {project?.body && (
        <AnimatedSection className="py-24 border-b border-hairline-dark">
          <Container>
            <div className="prose prose-invert prose-lg max-w-4xl mx-auto prose-headings:font-serif prose-p:font-sans prose-a:text-brand-emerald">
              <RichText data={project.body} />
            </div>
          </Container>
        </AnimatedSection>
      )}
      
      {/* Digital Presence / CTA */}
      <section className="bg-brand-obsidian py-[120px] border-b border-hairline-dark">
        <AnimatedSection className="text-center flex flex-col items-center">
          <Container>
            <MonoLabel className="text-brand-emerald mb-8">[ DIGITAL PRESENCE ]</MonoLabel>
            <h2 className="font-serif text-display-mobile md:text-[80px] leading-tight mb-8 font-semibold">{specifics.digitalPresence}</h2>
            <p className="font-sans text-body-lg text-brand-cream/80 font-light max-w-[600px] mb-12 mx-auto">Experience the live {title} digital infrastructure.</p>
            <MagneticButton>
              <a className="btn-primary" href="#">
                VIEW LIVE PROJECT ↗
              </a>
            </MagneticButton>
          </Container>
        </AnimatedSection>
      </section>
    </div>
  );
}
