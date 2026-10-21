import React from 'react'
import Link from '@/components/ui/AppLink'
import { AnimatedSection, Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import MonitorFrame from '@/components/ui/MonitorFrame'
import { unbracket } from '@/lib/text'

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
  // CMS label carries brackets and a section number ("[ 06. PORTFOLIO SHOWCASE ]").
  const eyebrow = unbracket(props.label || 'PORTFOLIO SHOWCASE').replace(/^\d+\.\s*/, '')
  const title = props.title || 'Proof of Execution.'
  const description = props.description || 'Our recent deployments for elite trading institutions worldwide. Examine our track record of delivering uncompromised quality.'
  const ctaText = props.ctaText || 'EXPLORE FULL PORTFOLIO ↗'
  const ctaLink = props.ctaLink || '/portfolio'

  // Take the first project if available
  const firstProject = props.projects && props.projects.length > 0 ? props.projects[0] : null
  // We handle whether projects are populated (objects) or just IDs (strings)
  const projectData = firstProject && typeof firstProject === 'object' ? firstProject : null

  return (
    <AnimatedSection className="w-full border-b border-rule bg-surface py-24 md:py-32">
      <div className="container-site">
        <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-12 md:gap-20">
          {/* Left Column */}
          <div className="flex flex-col items-start md:col-span-5">
            <SectionHeading eyebrow={eyebrow} title={title} description={description} />
            <Reveal y={14} delay={0.2} className="mt-10">
              <Link href={ctaLink} className="btn-primary min-h-[52px] px-8 py-4">
                {ctaText}
              </Link>
            </Reveal>
          </div>

          {/* Right Column — professional monitor running the live site */}
          <div className="md:col-span-7">
            {projectData ? (
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
              <div className="on-dark frame flex aspect-[16/10] w-full flex-col items-center justify-center gap-3 border border-rule-strong bg-obsidian">
                <div className="flex h-10 w-14 items-center justify-center rounded-[2px] border border-rule-dark">
                  <div className="h-5 w-7 rounded-[1px] border border-white/20" />
                </div>
                <span className="eyebrow eyebrow-dark">[ DEPLOYMENT PREVIEW — {title} ]</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default PortfolioShowcaseBlock
