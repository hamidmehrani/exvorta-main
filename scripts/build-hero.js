const fs = require('fs');
let html = fs.readFileSync('/tmp/hero.jsx', 'utf8');

const dashStart = html.indexOf('{/*  Dashboard Header  */}');
// In hero.jsx, the dashboard ends with:
// </div>
// </div>
// </div>
// </div>
// </div></div>
// </div></section>
const dashEnd = html.indexOf('</div></div>\n</div></section>');
let dashHtml = html.substring(dashStart, dashEnd);
dashHtml = dashHtml.replace(/<svg([^>]*)\/>/g, '<svg$1>');
dashHtml = dashHtml.replace(/<path([^>]*)\/>/g, '<path$1 />');
dashHtml = dashHtml.replace(/<path([^>]*)\/ \/>/g, '<path$1 />');
dashHtml = dashHtml.replace(/<input([^>]*[^\/])>/g, '<input$1 />');

const finalCode = `import React from 'react';
import { AnimatedSection, AnimatedButton } from '@/components/ui/Reveal';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function HeroBlock(props: any) {
  const eyebrow = props.eyebrow || "[ ENGINE V1.0 LIVE ]";
  const headline = props.headline || "Digital Infrastructure\\nfor Global Traders";
  const subheadline = props.subheadline || "The definitive digital foundation for elite importers and exporters. Precision-engineered web presence and automated compliance.";
  const primaryCTALabel = props.primaryCTA?.label || "[ REQUEST PROPOSAL ]";
  const primaryCTAUrl = props.primaryCTA?.url || "#";

  return (
    <AnimatedSection className="relative pt-32 pb-40 overflow-hidden" data-purpose="hero-section">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center justify-center px-3 py-1 mb-8 rounded-full border border-black/10 bg-white/50 text-[10px] tracking-widest uppercase text-brand-obsidian/60">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span> {eyebrow}
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-[84px] leading-[1.1] font-serif font-semibold text-brand-obsidian mb-8 tracking-tight">
            {headline.split('\\n').map((line: string, i: number) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h1>
          <p className="text-base md:text-lg text-brand-obsidian/60 max-w-2xl mx-auto mb-12 font-light">
            {subheadline}
          </p>
          <Button variant="primary" href={primaryCTAUrl} className="inline-flex items-center justify-center px-8 py-4 bg-brand-obsidian text-white text-xs font-medium tracking-widest uppercase shadow-[0_0_15px_rgba(0,102,255,0.5)] hover:bg-black/80 transition-all rounded-none">
            {primaryCTALabel}
          </Button>
        </div>
        
        {props.showDashboard && (
          <div className="relative w-full max-w-[1400px] mx-auto rounded-xl shadow-2xl overflow-hidden bg-mockup-dashboard border border-hairline-dark flex flex-col mt-20" style={{height: '700px'}}>
             ${dashHtml}
             </div>
          </div>
        )}
      </div>
      <div className="py-12 flex justify-center" data-purpose="social-proof-anchor">
        <p className="text-[11px] font-sans text-brand-obsidian/40 uppercase tracking-[0.2em] text-center max-w-xl leading-relaxed">
          Elevating digital infrastructure for modern trading firms across the GCC and Europe.
        </p>
      </div>
    </AnimatedSection>
  );
}
`;
fs.writeFileSync('/home/hamid/Desktop/Exvorta/Exvorta/components/blocks/HeroBlock.tsx', finalCode);
