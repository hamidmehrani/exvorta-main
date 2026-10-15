import React from 'react'
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { unbracket } from '@/lib/text'

export interface LocationInfo {
  region: string
  description: string
}

export interface GlobalPresenceBlockProps {
  eyebrow?: string
  title?: string
  description?: string
  locations?: LocationInfo[]
  [key: string]: any
}

const defaultLocations: LocationInfo[] = [
  {
    region: 'MENA & Gulf',
    description: 'Serving sovereign wealth funds and energy trade entities across the GCC.',
  },
  {
    region: 'Europe & UK',
    description: 'Powering high-frequency trade desks in Mayfair, Geneva, and Frankfurt.',
  },
  {
    region: 'Asia Pacific',
    description: 'Connecting institutional commodities brokers in Singapore and Hong Kong.',
  },
]

export const GlobalPresenceBlock: React.FC<GlobalPresenceBlockProps> = (props) => {
  const eyebrow = unbracket(props.eyebrow) || 'GLOBAL EDGE INFRASTRUCTURE'
  const title = props.title || 'Built for Global Reach.'
  const description = props.description || 'Your buyers are everywhere. Your website should perform everywhere — on any device, in any market, at any hour.'
  const locations = props.locations && props.locations.length > 0 ? props.locations : defaultLocations
  const columns = locations.length === 2 ? 'md:grid-cols-2' : locations.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'

  return (
    <AnimatedSection className="w-full border-y border-rule py-24 md:py-32" id="global-presence">
      <div className="container-site">
        <SectionHeading align="center" eyebrow={eyebrow} title={title} description={description} className="mb-16 md:mb-20" />

        <StaggerContainer className={`frame grid w-full grid-cols-1 border border-rule bg-surface ${columns}`} staggerChildren={0.12} delayChildren={0.15}>
          {locations.map((loc: LocationInfo, index: number) => (
            <StaggerItem
              key={index}
              className="group relative flex h-full flex-col border-b border-rule p-10 transition-colors duration-300 last:border-b-0 hover:bg-surface-2 md:border-b-0 md:border-e md:last:border-e-0 md:p-12"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-emerald transition-transform duration-500 ease-[var(--ease-cinematic)] group-hover:scale-x-100"
              />
              <p className="eyebrow mb-8 !text-obsidian">
                <span className="h-1 w-1 rotate-45 bg-emerald" aria-hidden />
                {loc.region}
              </p>
              <p className="font-serif text-2xl font-semibold leading-snug text-obsidian">{loc.description}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </AnimatedSection>
  )
}

export default GlobalPresenceBlock
