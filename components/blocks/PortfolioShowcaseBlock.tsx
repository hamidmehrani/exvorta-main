'use client'

import React from 'react'
import Link from 'next/link'
import { AnimatedSection } from '@/components/ui/Reveal'
import LiveWebsiteFrame from '@/components/ui/LiveWebsiteFrame'

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
    <AnimatedSection className="w-full py-32 bg-white border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
          
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
          
          {/* Right Column */}
          <div className="md:col-span-7">
            {hasValidProject ? (
              <LiveWebsiteFrame
                title={projectData.title || "Portfolio Project"}
                imageUrl={
                  typeof projectData.featuredImage === 'object' 
                    ? projectData.featuredImage?.url 
                    : undefined
                }
                liveUrl={projectData.liveUrl}
                industry={projectData.clientInfo?.industry || "ENTERPRISE"}
                volume={projectData.clientInfo?.volume || "N/A"}
                service={projectData.clientInfo?.service || "DIGITAL INFRASTRUCTURE"}
                slug={projectData.slug}
              />
            ) : (
              <div className="w-full aspect-[4/3] border border-black bg-[#E5E5E5] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/5 mix-blend-multiply"></div>
                <span className="text-xs font-mono text-black/30 tracking-widest uppercase relative z-10">
                  [ CINEMATIC B&W IMAGE PLACEHOLDER ]
                </span>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </AnimatedSection>
  )
}

export default PortfolioShowcaseBlock
