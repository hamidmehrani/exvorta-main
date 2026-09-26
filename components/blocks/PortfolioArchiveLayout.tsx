"use client";

import React from 'react';
import { AnimatedSection } from '@/components/ui/Reveal';
import type { Project } from '@/payload-types';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { Button } from '@/components/ui/Button';
import { m as motion, type Variants } from "framer-motion";
import { easings } from "@/lib/animations";

const cinematicEasing = easings.cinematic;

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item: Variants = {
  hidden: { y: 40, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: cinematicEasing }
  }
};

export function PortfolioArchiveLayout({ projects }: { projects?: Project[] }) {
  const hasProjects = projects && projects.length > 0;

  return (
    <div className="w-full bg-brand-cream min-h-screen">
      {/* Hero Section */}
      <AnimatedSection className="w-full pt-32 pb-24">
        <Container>
          <div className="max-w-5xl">
            <div className="font-mono text-[10px] text-brand-emerald mb-6 tracking-widest uppercase">[ SELECTED WORKS ]</div>
            <h1 className="font-serif text-[84px] text-brand-obsidian mb-8 leading-none font-semibold">Latest Web Design Works.</h1>
            <p className="font-sans text-[18px] text-brand-obsidian/60 max-w-2xl font-light">Premium websites and CMS platforms engineered for global exporters.</p>
          </div>
        </Container>
      </AnimatedSection>
      
      <div className="w-full border-b-2 border-brand-obsidian"></div>
      
      {/* Project Blocks */}
      <motion.section 
        variants={container} 
        initial="hidden" 
        whileInView="show" 
        viewport={{ once: true, margin: "-50px" }}
        className="w-full flex flex-col bg-brand-cream"
      >
        {hasProjects ? (
          projects?.map((project, index) => {
            const heroImageUrl =
              project.heroImage && typeof project.heroImage === 'object'
                ? project.heroImage.url
                : '';
            
            const industry = project.metrics?.find(m => m.label?.toLowerCase() === 'industry')?.value || 'Various';
            const stack = project.metrics?.find(m => m.label?.toLowerCase() === 'tech stack' || m.label?.toLowerCase() === 'stack')?.value || 'Next.js 15, Payload CMS';
            const liveUrl = project.metrics?.find(m => m.label?.toLowerCase() === 'live url' || m.label?.toLowerCase() === 'website')?.value;
            
            return (
              <motion.article key={project.id || index} variants={item} className="w-full border-b border-brand-obsidian py-14 sm:py-20 lg:py-24">
                <Container>
                  <div className="grid grid-cols-1 lg:grid-cols-10 gap-12 lg:gap-8 items-center">
                    <div className="lg:col-span-4 flex flex-col space-y-12">
                      <div>
                        <h2 className="font-serif text-[80px] text-brand-obsidian mb-4 font-semibold leading-none">{project.title}</h2>
                        <MonoLabel className="text-brand-obsidian/60">
                          INDUSTRY: {industry} | STACK: {stack}
                        </MonoLabel>
                      </div>
                      <div>
                        <div className="flex flex-row gap-4">
                          <Button variant="primary" href={`/portfolio/${project.slug}`}>
                            READ CASE STUDY <span className="ml-2">→</span>
                          </Button>
                          {liveUrl && (
                            <Button variant="ghost" href={liveUrl} target="_blank" rel="noopener noreferrer">
                              VIEW LIVE PROJECT <span className="ml-2">↗</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="lg:col-span-6 w-full aspect-[16/9] bg-brand-obsidian/5 overflow-hidden relative">
                      {heroImageUrl ? (
                        <Image alt={project.title} className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out" src={heroImageUrl} fill />
                      ) : (
                        <div className="w-full h-full bg-brand-obsidian/5" />
                      )}
                    </div>
                  </div>
                </Container>
              </motion.article>
            );
          })
        ) : (
          <div className="py-16 sm:py-24 lg:py-32 text-center text-brand-obsidian/40 font-mono text-[10px] uppercase tracking-widest">
            No projects found.
          </div>
        )}
      </motion.section>
    </div>
  );
}


export default PortfolioArchiveLayout;
