'use client'

import React, { useEffect, useState } from 'react'
import { Page } from '@/payload-types'
import { AnimatedSection, StaggerContainer, StaggerItem, EASE_OUT } from '@/components/ui/Reveal'
import { m } from 'framer-motion'
import { MagneticButton } from '@/components/ui/MagneticButton'
import Link from 'next/link'

type CTABlockProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'cta' }>

export const CTABlock: React.FC<CTABlockProps> = ({
  theme = 'dark',
  eyebrow,
  title,
  description,
  buttonText,
  buttonUrl,
  secondaryButtonText,
  secondaryButtonUrl,
  disclaimer
}) => {
  const isDark = theme === 'dark'
  const bgColor = isDark ? 'bg-bg' : 'bg-surface'
  const textColor = isDark ? 'text-text' : 'text-bg'
  const mutedColor = isDark ? 'text-muted' : 'text-bg/60'
  
  const [pulsePhase, setPulsePhase] = useState(0)

  useEffect(() => {
    // Pulse effect every 5s
    const interval = setInterval(() => {
      setPulsePhase(1)
      setTimeout(() => setPulsePhase(0), 1000)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatedSection className={`relative w-full py-32 px-6 md:px-12 flex flex-col items-center justify-center text-center overflow-hidden ${bgColor} border-y ${isDark ? 'border-border' : 'border-bg/20'}`}>
      
      {/* Subtle animated gradient background */}
      <m.div 
        className={`absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none`}
        animate={{
          background: isDark 
            ? ['radial-gradient(circle at 20% 50%, rgba(var(--primary), 0.15) 0%, transparent 50%)', 'radial-gradient(circle at 80% 80%, rgba(var(--primary), 0.15) 0%, transparent 50%)', 'radial-gradient(circle at 20% 50%, rgba(var(--primary), 0.15) 0%, transparent 50%)']
            : ['radial-gradient(circle at 20% 50%, rgba(var(--primary), 0.08) 0%, transparent 50%)', 'radial-gradient(circle at 80% 80%, rgba(var(--primary), 0.08) 0%, transparent 50%)', 'radial-gradient(circle at 20% 50%, rgba(var(--primary), 0.08) 0%, transparent 50%)']
        }}
        transition={{ duration: 8, ease: "linear", repeat: Infinity }}
      />
      
      {/* Floating decorative elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <m.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} 
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
          className={`absolute top-1/4 left-1/4 w-[1px] h-24 ${isDark ? 'bg-muted' : 'bg-bg/20'} opacity-30`}
        />
        <m.div 
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }} 
          transition={{ duration: 7, ease: "easeInOut", repeat: Infinity, delay: 1 }}
          className={`absolute bottom-1/4 right-1/4 w-[1px] h-32 ${isDark ? 'bg-muted' : 'bg-bg/20'} opacity-30`}
        />
        <m.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }} 
          transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
          className={`absolute top-1/2 right-1/3 w-2 h-2 rounded-full ${isDark ? 'bg-primary' : 'bg-primary/50'}`}
        />
      </div>

      <StaggerContainer delayChildren={0.2} staggerChildren={0.1} className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {eyebrow && (
          <StaggerItem>
            <span className={`block text-xs font-mono tracking-[0.2em] uppercase mb-8 ${mutedColor}`}>
              [ {eyebrow} ]
            </span>
          </StaggerItem>
        )}

        <StaggerItem>
          <h2 className={`text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tighter leading-[1.05] mb-8 ${textColor}`}>
            {title}
          </h2>
        </StaggerItem>

        {description && (
          <StaggerItem>
            <p className={`text-lg md:text-xl font-sans font-light leading-relaxed max-w-2xl mb-12 ${mutedColor}`}>
              {description}
            </p>
          </StaggerItem>
        )}

        <StaggerItem className="flex flex-wrap items-center justify-center gap-6">
          <m.div
            animate={pulsePhase === 1 ? { scale: 1.03 } : { scale: 1 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            <MagneticButton>
              <Link 
                href={buttonUrl || '#'} 
                className={`group relative flex items-center justify-center px-10 py-5 rounded-none overflow-hidden transition-all duration-500 border ${isDark ? 'bg-text text-bg border-text' : 'bg-surface text-text border-surface hover:border-text'} hover:shadow-[0_0_20px_rgba(var(--primary),0.3)]`}
              >
                <div className={`absolute inset-0 w-full h-full ${isDark ? 'bg-bg' : 'bg-text'} origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[0.65,0,0.35,1]`}></div>
                <span className={`relative z-10 text-xs font-mono font-bold tracking-widest uppercase transition-colors duration-500 ${isDark ? 'group-hover:text-text' : 'group-hover:text-bg'}`}>
                  {buttonText}
                </span>
              </Link>
            </MagneticButton>
          </m.div>

          {secondaryButtonText && (
            <MagneticButton>
              <Link 
                href={secondaryButtonUrl || '#'} 
                className={`px-8 py-5 rounded-none bg-transparent ${textColor} hover:${mutedColor} text-xs font-mono font-bold tracking-widest uppercase transition-colors duration-300 border border-current`}
              >
                {secondaryButtonText}
              </Link>
            </MagneticButton>
          )}
        </StaggerItem>

        {disclaimer && (
          <StaggerItem>
            <p className={`text-[10px] font-mono mt-12 ${mutedColor} opacity-70`}>
              * {disclaimer}
            </p>
          </StaggerItem>
        )}
      </StaggerContainer>
    </AnimatedSection>
  )
}

export default CTABlock
