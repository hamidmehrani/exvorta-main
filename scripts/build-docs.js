const fs = require('fs');
let html = fs.readFileSync('/tmp/docs.html', 'utf8');

// The section starts at <section class="py-32 bg-[#FAFAF8] ...">
// It ends at </section>
const startIdx = html.indexOf('<section');
const endIdx = html.indexOf('</section>') + '</section>'.length;
html = html.substring(startIdx, endIdx);

// Basic JSX fixes
html = html.replace(/class=/g, 'className=');
html = html.replace(/<!--(.*?)-->/g, '{/* $1 */}');
html = html.replace(/<br>/g, '<br/>');

// Fix self-closing svg/path
html = html.replace(/<svg([^>]*)\/>/g, '<svg$1>');
html = html.replace(/<path([^>]*)\/>/g, '<path$1 />');
html = html.replace(/<path([^>]*)\/ \/>/g, '<path$1 />');

// Remove hardcoded hex for brand tokens
const replacements = {
  'bg-[#FAFAF8]': 'bg-brand-cream',
  'bg-[#0D0D0D]': 'bg-mockup-dashboard',
  'bg-[#111111]': 'bg-mockup-sidebar',
  'bg-[#1a1a1a]': 'bg-mockup-card',
  'text-[#0D0D0D]': 'text-brand-obsidian',
  'text-black': 'text-brand-obsidian',
  'border-black': 'border-brand-obsidian',
  'bg-black': 'bg-brand-obsidian',
  'border-black/5': 'border-hairline-light',
  'border-white/10': 'border-hairline-dark',
  'border-white/5': 'border-hairline-dark'
};
for (const [k, v] of Object.entries(replacements)) {
  html = html.split(k).join(v);
}

const finalCode = `"use client";

import React from 'react';
import { AnimatedSection } from '../ui/Reveal';
import { Container } from '../ui/Container';
import { MonoLabel } from '../ui/MonoLabel';

export default function ProductShowcaseBlock(props: any) {
  return (
    <AnimatedSection className="w-full" data-purpose="product-showcase">
      ${html}
    </AnimatedSection>
  );
}
`;

fs.writeFileSync('/home/hamid/Desktop/Exvorta/Exvorta/components/blocks/ProductShowcaseBlock.tsx', finalCode);
console.log("ProductShowcaseBlock.tsx updated.");
