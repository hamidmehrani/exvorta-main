'use client'
import React from 'react'
import { AnimatedSection } from '@/components/ui/Reveal';
import type { Page } from '@/payload-types'

type ProblemStatementBlockProps = Extract<NonNullable<Page['layout']>[0], { blockType: 'problemStatement' }>;

export const ProblemStatementBlock: React.FC<ProblemStatementBlockProps> = ({
  eyebrow,
  headline,
  description,
  statements,
  theme = 'dark',
}) => {
  try {
  const isLight = theme === 'light'
  
  if (isLight) {
    const defaultLightStatements = [
      { title: "Look like a $100M Player.", description: "We strip away amateur templates and apply elite, bespoke UI/UX architecture. Your digital presence will instantly match the scale and ambition of your global operations." },
      { title: "Turn Traffic into Contracts.", description: "Beautiful isn't enough. We engineer optimized user flows and secure intake portals that guide high-tier enterprise leads directly into your sales pipeline." },
      { title: "You Trade. We Handle the Tech.", description: "Stop wrestling with broken plugins. We deploy secure, hyper-fast, maintenance-free infrastructures so your team can focus strictly on moving volume." }
    ]
    const renderStatements = (statements && statements.length > 0) ? statements : defaultLightStatements;

    return (
      <AnimatedSection className="w-full bg-white py-32 px-6 border-b border-[#E5E5E5]" id="problem">
        <div className="max-w-7xl mx-auto w-full">
          <span className="text-[10px] font-mono tracking-[0.2em] text-black/40 uppercase mb-16 block">
            {eyebrow || '[ THE EXVORTA SOLUTION ]'}
          </span>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            <div className="lg:col-span-5 sticky top-32">
              <h2 className="text-5xl md:text-6xl font-serif font-bold leading-tight tracking-tight mb-8 text-black" dangerouslySetInnerHTML={{ __html: headline || "We don't build brochures. We engineer digital assets." }} />
              <p className="text-lg text-black/60 leading-relaxed font-sans" dangerouslySetInnerHTML={{ __html: description || "Your website shouldn't be a cost center. It should be your most relentless sales executive—working 24/7 to project authority, filter unqualified noise, and close global deals." }} />
            </div>
            <div className="lg:col-span-7 flex flex-col gap-12">
              {renderStatements?.map((stmt, idx) => (
                <div key={idx} className="border-l border-black/20 pl-8">
                  <h3 className="text-2xl font-serif text-black mb-3">{stmt.title}</h3>
                  <p className="text-black/60 leading-relaxed">{stmt.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>
    )
  }

  // Dark Theme
  const defaultDarkStatements = [
    { title: "01. FAILED DUE DILIGENCE", description: "International partners judge your reliability in 3 seconds. A slow, template-based website screams 'high risk' to tier-1 enterprise buyers." },
    { title: "02. LOST ENTERPRISE LEADS", description: "Big buyers don't fill out broken forms on generic sites. They quietly leave, taking lucrative, multi-year contracts directly to your competitors." },
    { title: "03. OUTDATED INFRASTRUCTURE", description: "You shouldn't be wasting hours fighting with cheap WordPress plugins or broken mobile layouts when you need to be closing global supply deals." }
  ]
  const renderDarkStatements = (statements && statements.length > 0) ? statements : defaultDarkStatements;

  return (
    <AnimatedSection className="w-full border-t border-b border-[#0D0D0D] py-32 bg-[#0A0A0A]" id="problem">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-3xl mx-auto text-center mb-24">
          <span className="block text-[10px] tracking-[0.3em] uppercase text-white/40 mb-6 font-mono">
            {eyebrow || '[ THE CREDIBILITY GAP ]'}
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-white tracking-tight leading-tight" dangerouslySetInnerHTML={{ __html: headline || "Your business moves millions. Your website looks like a startup." }} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {renderDarkStatements?.map((stmt, index) => (
            <div key={index} className="border-t border-white/20 pt-8">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
                {stmt.title}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed font-light">
                {stmt.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
  } catch (error) {
    return <div style={{padding: 20, color: 'red', border: '1px solid red'}}>Error in ProblemStatementBlock</div>
  }
}

export default ProblemStatementBlock;
