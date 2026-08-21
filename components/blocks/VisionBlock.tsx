import React from 'react'
import { AnimatedSection } from '@/components/ui/Reveal';
import type { Page } from '@/payload-types'

type VisionBlockProps = Extract<NonNullable<Page['layout']>[0], { blockType: 'vision' }>;

export const VisionBlock: React.FC<VisionBlockProps> = (props) => {
  if (props.variant === 'principles') {
    return (
      <AnimatedSection className="w-full bg-[#0A0A0A] py-32 md:py-48 px-6" id="values">
        <div className="max-w-7xl mx-auto w-full">
          {props.eyebrow && <span className="text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase mb-6 block text-center">{props.eyebrow}</span>}
          {props.headline && <h2 className="text-4xl md:text-5xl font-serif text-white text-center mb-24">{props.headline}</h2>}
          <div className="grid grid-cols-1 md:grid-cols-2 w-full border-t border-l border-[#333]">
            {props.principles && props.principles.map((p: any, i: number) => (
              <div key={i} className="bg-transparent border-r border-b border-[#333] p-12 lg:p-16 rounded-none flex flex-col h-full">
                <div className="font-mono text-xs text-white/30 tracking-widest mb-10 uppercase">{p.number} — {p.title}</div>
                <h3 className="text-2xl font-serif text-white mb-4">{p.subtitle}</h3>
                <p className="text-white/50 leading-relaxed font-sans">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    )
  }

  // Hardcoded Ecosystem Vision Block (PHASE 1)
  return (
    <AnimatedSection className="w-full bg-[#0A0A0A] py-48 md:py-64 px-6 relative overflow-hidden flex flex-col items-center justify-center text-center border-b border-[#333]" id="ecosystem-vision">
      {/* Vision Badge */}
      <div className="relative z-10 flex flex-col items-center mb-10">
        <div className="px-3 py-1 border border-[#333] flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-white/40 animate-pulse"></div>
          {props.eyebrow && <span className="text-[9px] font-mono tracking-[0.3em] uppercase font-bold text-white/60">{props.eyebrow}</span>}
        </div>
      </div>
      
      {/* Monumental Headline */}
      <h2 
        className="relative z-10 text-5xl md:text-[5.5rem] lg:text-[7rem] font-serif font-bold text-white leading-[1.0] tracking-tight mb-8"
        dangerouslySetInnerHTML={{ __html: props.headline || '' }}
      />
      
      {/* Philosophical Subtext */}
      {props.description && (
        <p className="relative z-10 max-w-3xl mx-auto text-lg md:text-xl text-white/50 leading-relaxed font-sans mb-16">
          {props.description}
        </p>
      )}
      
      {/* Abstract Module Connector */}
      {props.bottomLabels && props.bottomLabels.length > 0 && (
        <div className="relative z-10 flex items-center gap-4 text-[8px] font-mono tracking-widest text-white/40 uppercase flex-wrap justify-center">
          {props.bottomLabels.map((item, idx) => (
            <React.Fragment key={idx}>
              <span>{item.label}</span>
              {idx < props.bottomLabels!.length - 1 && <span className="w-4 h-[1px] bg-[#333]"></span>}
            </React.Fragment>
          ))}
        </div>
      )}
    </AnimatedSection>
  )
}

export default VisionBlock;