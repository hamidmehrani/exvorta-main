const fs = require('fs');
let html = fs.readFileSync('/tmp/roadmap.html', 'utf8');

const startIdx = html.indexOf('<section class="py-24');
const endIdx = html.indexOf('</section>', startIdx) + '</section>'.length;
html = html.substring(startIdx, endIdx);

html = html.replace(/class=/g, 'className=');
html = html.replace(/<!--(.*?)-->/g, '{/* $1 */}');
html = html.replace(/<br>/g, '<br/>');
html = html.replace(/<input([^>]*[^\/])>/g, '<input$1 />');

html = html.replace(/<svg([^>]*)\/>/g, '<svg$1>');
html = html.replace(/<path([^>]*)\/>/g, '<path$1 />');
html = html.replace(/<path([^>]*)\/ \/>/g, '<path$1 />');

const replacements = {
  'bg-[#FAFAF8]': 'bg-brand-cream',
  'bg-[#0A0A0A]': 'bg-mockup-dashboard',
  'bg-[#0D0D0D]': 'bg-brand-obsidian',
  'text-black': 'text-brand-obsidian',
  'border-black/5': 'border-hairline-light',
  'border-white/10': 'border-hairline-dark',
  'border-white/20': 'border-hairline-dark/50',
  'border-white/5': 'border-hairline-dark',
  'border-black/20': 'border-brand-obsidian/20',
  'border-black': 'border-brand-obsidian',
  'text-obsidian': 'text-brand-obsidian'
};

for (const [k, v] of Object.entries(replacements)) {
  html = html.split(k).join(v);
}

const finalCode = `"use client";

import { AnimatedSection } from '../ui/Reveal';
import { Container } from '../ui/Container';

export default function RoadmapBlock(props: any) {
  return (
    <AnimatedSection className="w-full">
      ${html}
    </AnimatedSection>
  );
}
`;

fs.writeFileSync('/home/hamid/Desktop/Exvorta/Exvorta/components/blocks/RoadmapBlock.tsx', finalCode);
console.log("RoadmapBlock.tsx updated.");
