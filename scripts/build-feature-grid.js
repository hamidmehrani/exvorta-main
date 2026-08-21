const fs = require('fs');

const finalCode = `"use client";

import React from 'react';
import { AnimatedSection } from '@/components/ui/Reveal';
import { Container } from '@/components/ui/Container';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

export default function FeatureGridBlock(props: any) {
  const { sectionEyebrow, sectionTitle, features = [] } = props;

  return (
    <AnimatedSection className="py-24 border-t border-hairline-light bg-brand-cream" data-purpose="manifesto">
      <Container>
        <div className="text-center mb-16">
          <MonoLabel className="text-brand-obsidian/40 mb-4">
            {sectionEyebrow || "Architecture Manifesto"}
          </MonoLabel>
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-serif text-brand-obsidian font-semibold">
            {sectionTitle || "Built for How Traders Actually Work"}
          </motion.h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature: any, idx: number) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              className="bg-mockup-surface p-8 border border-hairline-light rounded-sm hover:shadow-soft transition-shadow relative border-t-2 border-t-transparent hover:border-t-brand-obsidian transition-all duration-300"
            >
              <span className="text-gray-200 text-4xl font-serif leading-none absolute top-6 right-8 opacity-50">
                {feature.icon || \`0\${idx + 1}\`}
              </span>
              <h3 className="text-lg font-serif mb-3 text-brand-obsidian font-semibold">
                {feature.title}
              </h3>
              <p className="text-sm text-brand-obsidian/60 leading-relaxed font-light">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </AnimatedSection>
  );
}
`;

fs.writeFileSync('/home/hamid/Desktop/Exvorta/Exvorta/components/blocks/FeatureGridBlock.tsx', finalCode);
console.log("FeatureGridBlock.tsx updated.");
