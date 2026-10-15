'use client'

import React from 'react'
import Image from 'next/image'
import type { Media } from '@/payload-types'
import { AnimatedSection } from '@/components/ui/Reveal'
import { MonoLabel } from '@/components/ui/MonoLabel'
import { Marquee } from '@/components/ui/motion/Marquee'

interface LogoItem {
  logo: number | Media
  id?: string | null
}

export const MarqueeBlock: React.FC<{
  sectionTitle?: string | null
  logos?: LogoItem[] | null
  [key: string]: unknown
}> = ({ sectionTitle, logos }) => {
  const items = (logos || []).filter((l) => {
    const img = l.logo
    return typeof img === 'object' && img !== null && 'url' in img && Boolean(img.url)
  })

  if (items.length === 0) return null

  return (
    <AnimatedSection className="w-full overflow-hidden border-b border-rule px-6 py-20">
      {sectionTitle && (
        <div className="mb-12 text-center">
          <MonoLabel className="eyebrow">{sectionTitle}</MonoLabel>
        </div>
      )}
      <Marquee speed={40}>
        {items.map((item, i) => {
          const img = item.logo as Media
          if (!img.url) return null
          return (
            <div key={item.id ?? i} className="w-40 md:w-48 h-10 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity duration-500">
              <Image src={img.url} alt={img.alt || 'Client logo'} fill sizes="192px" className="object-contain" />
            </div>
          )
        })}
      </Marquee>
    </AnimatedSection>
  )
}

export default MarqueeBlock
