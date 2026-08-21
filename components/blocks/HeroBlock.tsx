import React from 'react'
import { Page } from '@/payload-types'
import { AnimatedSection } from '@/components/ui/Reveal'
import { AnimatedHeadline } from '@/components/ui/AnimatedHeadline'
import { MagneticButton } from '@/components/ui/MagneticButton'

type HeroBlockProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'hero' }>

export const HeroBlock: React.FC<HeroBlockProps> = ({
  theme = 'dark',
  eyebrow,
  headline,
  subheadline,
  primaryCTA,
  secondaryCTA
}) => {
  const isDark = theme === 'dark'
  const textColor = isDark ? 'text-text' : 'text-surface'
  const mutedColor = isDark ? 'text-muted' : 'text-surface/70'
  const bgColor = isDark ? 'bg-bg' : 'bg-text'
  
  return (
    <AnimatedSection 
      className={`relative w-full min-h-[90vh] flex flex-col justify-center items-center overflow-hidden ${bgColor}`}
    >
      {/* Background ambient effect */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${isDark ? 'bg-primary/5' : 'bg-primary/10'} rounded-full blur-[120px] mix-blend-screen`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${isDark ? 'bg-accent/5' : 'bg-accent/10'} rounded-full blur-[120px] mix-blend-screen`}></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-6xl w-full px-6 md:px-12 mx-auto flex flex-col items-center text-center gap-8">
        {eyebrow && (
          <div className="overflow-hidden">
            <span className={`block text-xs font-mono tracking-[0.2em] uppercase ${mutedColor} animate-fade-in-up [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]`}>
              [ {eyebrow} ]
            </span>
          </div>
        )}
        
        <AnimatedHeadline 
          as="h1"
          text={headline || 'Elevate Your Digital Presence'}
          className={`text-5xl sm:text-6xl md:text-8xl font-serif font-bold tracking-tighter leading-[1.05] ${textColor}`}
          delay={0.3}
        />
        
        {subheadline && (
          <div className="overflow-hidden max-w-3xl">
            <p className={`text-lg md:text-xl font-sans font-light leading-relaxed ${mutedColor} animate-fade-in-up [animation-delay:600ms] opacity-0 [animation-fill-mode:forwards]`}>
              {subheadline}
            </p>
          </div>
        )}

        {(primaryCTA?.label || secondaryCTA?.label) && (
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 animate-fade-in-up [animation-delay:800ms] opacity-0 [animation-fill-mode:forwards]">
            {primaryCTA?.label && (
              <MagneticButton>
                <a href={primaryCTA.url || '#'} className={`px-8 py-4 rounded-none ${isDark ? 'bg-text text-bg hover:bg-muted' : 'bg-surface text-text hover:bg-surface-2'} text-xs font-mono font-bold tracking-widest uppercase transition-colors duration-300 border ${isDark ? 'border-text' : 'border-surface'}`}>
                  {primaryCTA.label}
                </a>
              </MagneticButton>
            )}
            
            {secondaryCTA?.label && (
              <MagneticButton>
                <a href={secondaryCTA.url || '#'} className={`px-8 py-4 rounded-none bg-transparent ${textColor} hover:${mutedColor} text-xs font-mono font-bold tracking-widest uppercase transition-colors duration-300 border border-current`}>
                  {secondaryCTA.label}
                </a>
              </MagneticButton>
            )}
          </div>
        )}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-fade-in-up [animation-delay:1200ms] opacity-0 [animation-fill-mode:forwards]">
        <span className={`text-[10px] font-mono tracking-[0.2em] uppercase ${mutedColor}`}>Scroll</span>
        <div className={`w-[1px] h-12 ${isDark ? 'bg-muted/30' : 'bg-surface/30'} relative overflow-hidden`}>
          <div className={`absolute top-0 left-0 w-full h-1/2 ${isDark ? 'bg-text' : 'bg-surface'} animate-scroll-down`}></div>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default HeroBlock
