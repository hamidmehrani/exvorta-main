import React from 'react'
import Image from 'next/image'
import { AnimatedSection } from '@/components/ui/Reveal';
import type { Page, Media } from '@/payload-types'

type Props = Extract<NonNullable<Page['layout']>[0], { blockType: 'teamShowcase' }>

export const TeamShowcaseBlock: React.FC<Props> = (props) => {
  const { sectionEyebrow, members } = props

  return (
    <AnimatedSection className="w-full py-16 sm:py-24 lg:py-32 relative overflow-hidden bg-white text-black" id="founder">
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col min-h-[40vh] bg-transparent">
        {sectionEyebrow && (
          <span className="text-xs font-mono tracking-widest text-black/40 uppercase">
            {sectionEyebrow}
          </span>
        )}
        {members?.map((member, idx) => {
          const image = member.image as Media | undefined
          return (
            <div key={idx} className="mt-16 grid grid-cols-1 lg:grid-cols-5 w-full items-center">
              <div className="lg:col-span-3 flex flex-col pr-16">
                {member.quote && (
                  <blockquote className="text-3xl md:text-4xl lg:text-5xl font-serif text-black leading-tight mb-12 italic">
                    {member.quote}
                  </blockquote>
                )}
                <div className="mt-4">
                  <div className="font-serif italic text-3xl text-black mb-4">{member.name}</div>
                  <div className="flex flex-col gap-1">
                    {member.bio && (
                      <p className="text-[11px] font-sans leading-relaxed text-black/60 mb-3 max-w-md">
                        {member.bio}
                      </p>
                    )}
                    {member.company && (
                      <span className="text-[10px] font-mono tracking-[0.3em] text-black/60 uppercase">
                        {member.company}
                      </span>
                    )}
                    {member.role && (
                      <span className="text-[10px] font-mono tracking-[0.3em] text-black/40 uppercase">
                        {member.role}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2 mt-12 lg:mt-0">
                <div className="relative aspect-[3/4] w-full overflow-hidden border border-black/10 rounded-none shadow-none">
                  {image?.url ? (
                    <Image
                      src={image.url}
                      alt={image.alt || member.name || 'Team member'}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover grayscale contrast-125 rounded-none"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </AnimatedSection>
  )
}

export default TeamShowcaseBlock