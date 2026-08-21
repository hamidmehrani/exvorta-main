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
  const isLight = theme === 'light'
  
  return (
    <AnimatedSection className={`w-full py-32 md:py-48 px-6 border-b border-[#0D0D0D] ${isLight ? 'bg-[#FCFAF8]' : 'bg-[#0A0A0A] border-t'}`} id="problem">
      <div className={`${isLight ? 'max-w-5xl' : 'max-w-7xl'} mx-auto ${!isLight ? 'px-6' : ''} w-full flex flex-col items-center`}>
        <div className={`${isLight ? '' : 'max-w-3xl'} mx-auto text-center mb-24`}>
          {eyebrow && (
            <span className={`block text-[10px] tracking-[0.3em] uppercase ${isLight ? 'text-black/40 mb-12 relative' : 'text-white/40 mb-6'} font-mono`}>
              {isLight && <div className="absolute -top-12 left-1/2 w-[1px] h-8 bg-black/10"></div>}
              {eyebrow.includes('[') ? eyebrow : `[ ${eyebrow} ]`}
            </span>
          )}
          {headline && (
            <h2 className={`${isLight ? 'text-4xl md:text-5xl lg:text-6xl text-black leading-[1.1] mb-12' : 'text-4xl md:text-5xl text-white leading-tight'} font-serif tracking-tight`}>
              {headline}
            </h2>
          )}
          {description && (
            <p className={`${isLight ? 'text-xl md:text-2xl text-black/60 font-light max-w-4xl' : 'mt-6 text-lg text-white/60'} font-sans leading-relaxed mx-auto`}>{description}</p>
          )}
        </div>
        
        {statements && statements.length > 0 && !isLight && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {statements.map((stmt, index) => (
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
        )}
      </div>
    </AnimatedSection>
  )
}

export default ProblemStatementBlock;
