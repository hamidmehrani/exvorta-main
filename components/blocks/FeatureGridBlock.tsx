import React from 'react'
import { Page } from '@/payload-types'
import { AnimatedSection } from '@/components/ui/Reveal'

type FeatureGridBlockProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'featureGrid' }>

export const FeatureGridBlock: React.FC<FeatureGridBlockProps> = ({
  sectionEyebrow,
  eyebrow,
  sectionTitle,
  theme = 'dark',
  layout = '4-col',
  features
}) => {
  const isDark = theme?.includes('dark')
  const isCards = theme === 'dark-cards'
  const isPrinciples = theme === 'dark-principles'

  const bgColor = isDark ? 'bg-bg' : 'bg-surface'
  const textColor = isDark ? 'text-text' : 'text-bg'
  const mutedColor = isDark ? 'text-muted' : 'text-bg/60'
  const borderColor = isDark ? 'border-border' : 'border-bg/20'

  const gridCols = layout === '3-col' 
    ? 'grid-cols-1 md:grid-cols-3' 
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'

  return (
    <AnimatedSection className={`w-full py-24 md:py-32 px-6 ${bgColor} ${borderColor} border-y relative overflow-hidden`}>
      {isDark && (
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none"></div>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        {(sectionEyebrow ?? eyebrow) && (
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-8 h-[1px] ${isDark ? 'bg-primary' : 'bg-bg/40'}`}></div>
            <span className={`text-[10px] font-mono tracking-[0.2em] uppercase font-bold ${isDark ? 'text-primary' : 'text-bg/60'}`}>
              {sectionEyebrow ?? eyebrow}
            </span>
          </div>
        )}

        {sectionTitle && (
          <h2 className={`text-3xl md:text-5xl font-serif font-bold mb-16 max-w-3xl leading-[1.1] ${textColor}`}>
            {sectionTitle}
          </h2>
        )}

        {features && features.length > 0 && (
          <div className={`grid ${gridCols} gap-8 md:gap-x-12 md:gap-y-16`}>
            {features.map((feature, idx) => (
              <div 
                key={feature.id || idx} 
                className={`flex flex-col group ${isCards ? `p-8 border ${borderColor} bg-surface hover:bg-surface-2 transition-colors` : ''} animate-fade-in-up opacity-0 [animation-fill-mode:forwards]`}
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                {isPrinciples && (
                  <div className={`text-[10px] font-mono tracking-[0.2em] uppercase mb-6 ${mutedColor}`}>
                    [{String(idx + 1).padStart(2, '0')}]
                  </div>
                )}

                {feature.icon && !isPrinciples && (
                  <div className={`w-10 h-10 mb-6 flex items-center justify-center border ${borderColor} rounded-sm ${isDark ? 'text-primary bg-bg' : 'text-bg/80 bg-surface'}`}>
                    {/* Render lucide icon dynamically in real app, fallback to a generic square for now */}
                    <div className="w-3 h-3 border border-current opacity-70 group-hover:scale-125 transition-transform"></div>
                  </div>
                )}

                <h3 className={`text-lg md:text-xl font-bold mb-3 ${textColor}`}>
                  {feature.title}
                </h3>

                <p className={`text-sm md:text-base font-sans font-light leading-relaxed ${mutedColor}`}>
                  {feature.description}
                </p>

                {isCards && (
                  <div className="mt-8 pt-4 border-t border-border/50 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-mono text-primary uppercase tracking-widest">Explore</span>
                    <span className="text-primary material-symbols-outlined text-sm">arrow_forward</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AnimatedSection>
  )
}

export default FeatureGridBlock
