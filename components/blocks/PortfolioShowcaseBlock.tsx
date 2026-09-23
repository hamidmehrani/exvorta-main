'use client'

import React from 'react'
import Link from 'next/link'
import { AnimatedSection } from '@/components/ui/Reveal'
import MonitorFrame from '@/components/ui/MonitorFrame'

export interface PortfolioShowcaseBlockProps {
  label?: string
  title?: string
  description?: string
  ctaText?: string
  ctaLink?: string
  projects?: any[] // Relationship to portfolio items
  [key: string]: any
}

export const PortfolioShowcaseBlock: React.FC<PortfolioShowcaseBlockProps> = (props) => {
  try {
  const eyebrow = props.label || "[ 06. PORTFOLIO SHOWCASE ]"
  const title = props.title || "Proof of Execution."
  const description = props.description || "Our recent deployments for elite trading institutions worldwide. Examine our track record of delivering uncompromised quality."
  const ctaText = props.ctaText || "EXPLORE FULL PORTFOLIO ↗"
  const ctaLink = props.ctaLink || "/portfolio"

  // Take the first project if available
  const firstProject = (props.projects && props.projects.length > 0) ? props.projects[0] : null
  // We handle whether projects are populated (objects) or just IDs (strings)
  const projectData = (firstProject && typeof firstProject === 'object') ? firstProject : null
  
  const hasValidProject = !!projectData

  return (
    <AnimatedSection className="w-full py-16 sm:py-24 lg:py-32 bg-white border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-8 lg:gap-x-16 items-center">
          
          {/* Left Column */}
          <div className="md:col-span-5 flex flex-col items-start">
            <span className="text-xs font-mono tracking-widest text-black/40 uppercase mb-6">
              {eyebrow}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-black leading-tight mb-6">
              {title}
            </h2>
            <p className="text-lg text-black/60 mb-10 max-w-md">
              {description}
            </p>
            <Link 
              href={ctaLink}
              className="bg-[#0D0D0D] text-white px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-mono hover:bg-black transition-colors rounded-none"
            >
              {ctaText}
            </Link>
          </div>
          
          {/* Right Column — professional monitor running the live site */}
          <div className="md:col-span-7">
            {hasValidProject ? (
              <MonitorFrame
                url={projectData.liveUrl || (projectData.slug ? `https://${projectData.slug}.exvorta.com` : 'https://spicevo.exvorta.com')}
                title={projectData.title || 'Portfolio Project'}
                poster={
                  typeof projectData.featuredImage === 'object'
                    ? projectData.featuredImage?.url
                    : undefined
                }
              />
            ) : (
              <div className="w-full aspect-[16/10] border border-black/15 bg-[#0D0D0D] flex flex-col items-center justify-center gap-3 px-4">
                <div className="w-14 h-10 border border-white/10 rounded-[2px] flex items-center justify-center">
                  <div className="w-7 h-5 border border-white/20 rounded-[1px]" />
                </div>
                <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.12em] sm:tracking-[0.3em] text-white/30 uppercase text-center break-words">
                  [ DEPLOYMENT PREVIEW — {title} ]
                </span>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </AnimatedSection>
  )
  } catch (error) {
    console.error('[PortfolioShowcaseBlock] render error:', error)
    if (process.env.NODE_ENV !== 'production') {
      return <div style={{ padding: 20, color: 'red', border: '1px solid red' }}>Error in PortfolioShowcaseBlock</div>
    }
    return null
  }
}

export default PortfolioShowcaseBlock
