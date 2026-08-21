const fs = require('fs');

const finalCode = `"use client";

import { AnimatedSection } from '../ui/Reveal';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

export default function CTABlock(props: any) {
  const headline = props.headline || "Deals are won before the first meeting.";
  const subheadline = props.subheadline || "Without a credible digital presence, you are losing deals before the first conversation. Exvorta fixes this.";
  const cta = props.cta;

  return (
    <AnimatedSection className="py-32" data-purpose="the-pitch">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-brand-obsidian mb-8 leading-tight">
          {headline}
        </h2>
        {subheadline && (
          <p className="text-base md:text-lg text-brand-obsidian/60 leading-relaxed font-light max-w-2xl mx-auto text-center">
            {subheadline}
          </p>
        )}
        {cta && cta.label && (
          <div className="mt-12">
            <Button variant="primary" href={cta.url || "#"} className="inline-flex items-center justify-center px-8 py-4 bg-brand-obsidian text-white text-xs font-medium tracking-widest uppercase shadow-[0_0_15px_rgba(0,102,255,0.5)] hover:bg-black/80 transition-all rounded-none">
              {cta.label}
            </Button>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
`;

fs.writeFileSync('/home/hamid/Desktop/Exvorta/Exvorta/components/blocks/CTABlock.tsx', finalCode);
console.log("CTABlock.tsx updated.");
