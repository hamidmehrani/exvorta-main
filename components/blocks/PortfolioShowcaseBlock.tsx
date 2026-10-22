import React from 'react'
import Link from '@/components/ui/AppLink'
import { AnimatedSection, Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import MonitorFrame from '@/components/ui/MonitorFrame'
import { unbracket } from '@/lib/text'
import { getCaseStudy } from '@/components/blocks/case-study-data'

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
  const slug: string = projectData?.slug || 'nutave'
  const caseStudy = getCaseStudy(slug)
  const featuredImage: string | undefined =
    projectData && typeof projectData.featuredImage === 'object' ? projectData.featuredImage?.url : undefined

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

          {/* Right Column — the work itself: a CMS-picked project, else the flagship case study.
              Never an empty placeholder — a "proof" section must always show proof. */}
          <div className="md:col-span-7">
            <MonitorFrame
              url={projectData?.liveUrl || caseStudy?.url || `https://${slug}.exvorta.com`}
              title={projectData?.title || caseStudy?.title || 'Portfolio Project'}
              poster={featuredImage || caseStudy?.capture}
            />
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default PortfolioShowcaseBlock
