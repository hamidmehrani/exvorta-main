const fs = require('fs');

const finalCode = `"use client";

import { AnimatedSection } from '../ui/Reveal';
import { Container } from '../ui/Container';
import { MonoLabel } from '../ui/MonoLabel';
import { Button } from '../ui/Button';

export function PortfolioArchiveBlock(props: any) {
  const sectionLabel = props.sectionLabel || "[ OUR INFRASTRUCTURE WORK ]";
  const headline = props.headline || "Proof of Execution.";
  const ctaLabel = props.ctaLabel || "EXPLORE FULL PORTFOLIO ↗";
  const ctaUrl = props.ctaUrl || "#";

  // Use props.projects if available, otherwise fallback
  const projects = props.projects && props.projects.length > 0 ? props.projects : [
    {
      title: "Spicevo",
      description: "Certified organic herbs supply chain for European premium markets.",
      industry: "ORGANIC HERBS",
      volume: "480 MT/YR",
      service: "WEB DESIGN & CMS",
      linkLabel: "VIEW CASE STUDY ↗",
      linkUrl: "#",
      imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLsluHrudtzDaG50aSD36NdRzN58w6vb8tMpFOdnfIZFgY1dBgREUPWYQlTjj9EbRdLgnplkZYewTF9sMmaeJSXAK3oto-ygLUZfgwWyy7yWx7KwCDhAFMeuV49Vhkho1reIvl0I9GKNryk-9aFBdjJS583MJmCtZCneN1ZtU54xdaArh6k8eLfsYFLn5M0d_X1KdW11WwN2Sz8g_rTEjmd88-HJHGcuK3mzWuDZmmpB05aQ3niGkBjgHbc"
    },
    {
      title: "Nutave",
      description: "Precision nut processing and distribution for global wholesale partners.",
      industry: "PREMIUM NUTS",
      volume: "650 MT/YR",
      service: "B2B WEB DEVELOPMENT",
      linkLabel: "VIEW CASE STUDY ↗",
      linkUrl: "#",
      imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLu8-HNcmaGLnw2_KpZEj7jBld8fDlt0SdaiSex0wQyclFjJr3_pfzfGiS-UJwjSRGSqNl_XvglFmgNXkjVq7PbaYEfBg2fL6LPYB90N4aqXLpgb5ySkEzz9x0nGed182i___J7x-3lr4QbBY6YPjoZN5Llfc5QRBvPN7Xzt7ND8VcGxX7cmAEfda-xXA8TrxumBKPGKzSQ0LW1LKyfwkmcKjhHXelxyyoy6sPGbvGog1EtVoXTLmwkdW0c"
    },
    {
      title: "Stonvi",
      description: "High-end ceramic and stone materials for international architectural projects.",
      industry: "CERAMICS",
      volume: "2.4M SQM/YR",
      service: "CORPORATE WEBSITE & CMS",
      linkLabel: "VIEW CASE STUDY ↗",
      linkUrl: "#",
      imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLu2S7JLA2CjBYFpiSTcthdBBImg8NlO3gtp4silpS9I1v5xotd5HAg8Ahc2NhLGqufRvXBAZ5pivolwV24QdbIQ-8hKG-kOVJFkvs3ob81hCSG0Wt1yZ_o1LIN_s0_i37HHWHnnV_z8Jwb82qyWOkodIAJa85QJB8NCmNnHegI9LeTFsAaQBSi7Zjh6PT1YR-kCYbMsx7wjTR5d2RZYF-ebc-TMhnaVA6nQy0ztdzS6II91HHsgpZYiuw8"
    }
  ];

  return (
    <AnimatedSection className="py-32 bg-brand-cream border-t border-hairline-light" data-purpose="portfolio-index">
      <Container>
        {/* Section Header */}
        <div className="mb-20">
          <MonoLabel className="text-brand-obsidian/40 mb-4">
            {sectionLabel}
          </MonoLabel>
          <h2 className="text-7xl md:text-8xl lg:text-[120px] font-serif text-brand-obsidian tracking-tighter leading-none mb-8">
            {headline}
          </h2>
          <div className="w-full h-[1px] bg-brand-obsidian"></div>
        </div>

        {/* Project Rows */}
        <div className="flex flex-col">
          {projects.map((project: any, idx: number) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-[45%_55%] gap-20 py-24 border-b border-brand-obsidian items-center">
              <div className="flex flex-col">
                <h3 className="text-6xl md:text-7xl lg:text-8xl font-serif text-brand-obsidian mb-6">{project.title}</h3>
                <p className="text-lg font-light text-brand-obsidian/60 leading-relaxed mb-10">{project.description}</p>
                <div className="space-y-4 font-mono text-[10px] uppercase tracking-widest mb-12">
                  <div className="flex justify-between border-b border-hairline-light pb-2">
                    <span className="text-brand-obsidian/40">INDUSTRY</span>
                    <span className="text-brand-obsidian font-medium">{project.industry}</span>
                  </div>
                  <div className="flex justify-between border-b border-hairline-light pb-2">
                    <span className="text-brand-obsidian/40">VOLUME</span>
                    <span className="text-brand-obsidian font-medium">{project.volume}</span>
                  </div>
                  <div className="flex justify-between border-b border-hairline-light pb-2">
                    <span className="text-brand-obsidian/40">SERVICE</span>
                    <span className="text-brand-obsidian font-medium">{project.service}</span>
                  </div>
                </div>
                <Button variant="ghost" href={project.linkUrl || "#"} className="inline-block border border-brand-obsidian rounded-none px-8 py-4 text-[10px] font-mono text-center hover:bg-brand-obsidian hover:text-white transition-colors w-fit">
                  {project.linkLabel || "VIEW CASE STUDY ↗"}
                </Button>
              </div>
              <div className="aspect-video overflow-hidden rounded-none">
                <img alt={project.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" src={project.imageUrl || 'https://via.placeholder.com/800'} />
              </div>
            </div>
          ))}
        </div>

        {/* Section Footer */}
        <div className="py-32 flex justify-center">
          <Button variant="primary" href={ctaUrl} className="bg-brand-obsidian text-white px-16 py-6 text-sm font-medium tracking-[0.2em] uppercase rounded-none hover:bg-black transition-all">
            {ctaLabel}
          </Button>
        </div>
      </Container>
    </AnimatedSection>
  );
}

export default PortfolioArchiveBlock;
`;

fs.writeFileSync('/home/hamid/Desktop/Exvorta/Exvorta/components/blocks/PortfolioArchiveBlock.tsx', finalCode);
console.log("PortfolioArchiveBlock.tsx updated.");
