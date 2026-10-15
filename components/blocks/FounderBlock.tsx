import React from 'react'
import Image from 'next/image'
import { AnimatedSection, Reveal } from '@/components/ui/Reveal'
import { StaggerText } from '@/components/ui/motion'
import { CMSImage } from '@/components/ui/CMSImage'
import { unbracket } from '@/lib/text'

export interface FounderBlockProps {
  eyebrow?: string
  quote?: string
  name?: string
  bio?: string
  role?: string
  image?: any
  [key: string]: any
}

export const FounderBlock: React.FC<FounderBlockProps> = (props) => {
  // CMS eyebrow carries brackets and a section number ("[ 04. THE FOUNDER ]").
  const eyebrow = unbracket(props.eyebrow || 'THE FOUNDER').replace(/^\d+\.\s*/, '')
  const quote = (props.quote || `Architecture is not just visual; it is a balance sheet asset. We engineer digital gravity for the world's most demanding trade entities.`).replace(/^["“]|["”]$/g, '')
  const name = props.name || "Hamid Mehrani"
  const bio = props.bio || "Based in Dubai. Background in digital engineering and international trade operations. Founded Exvorta to bridge the credibility gap facing global trading firms."
  const role = props.role || "PRINCIPAL ARCHITECT, EXVORTA"

  // Default image URL from HTML if not provided from CMS
  const defaultImageUrl = "/founder-portrait.png"
  const hasCMSImage = props.image && typeof props.image === 'object' && props.image.url
  // Legacy rows: imageSrc as a plain URL string (pre-upload field)
  const legacyImageUrl = !hasCMSImage && typeof props.imageSrc === 'string' && props.imageSrc.trim() !== '' && props.imageSrc !== '#'
    ? props.imageSrc
    : null

  return (
    <AnimatedSection className="relative w-full overflow-hidden border-b border-rule bg-surface py-24 text-obsidian md:py-32" id="founder">
      <div className="container-site flex w-full flex-col">
        <p className="eyebrow">
          <span className="eyebrow-index" aria-hidden>
            <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
          </span>
          {eyebrow}
        </p>

        <div className="mt-16 grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Left Column: Editorial Quote & Signature */}
          <div className="flex flex-col lg:col-span-3">
            <span aria-hidden className="mb-4 block font-serif text-8xl font-semibold leading-none text-emerald">“</span>
            <blockquote>
              <StaggerText
                as="p"
                text={quote}
                unit="words"
                stagger={0.045}
                duration={0.7}
                mode="inView"
                className="mb-12 font-serif text-headline font-semibold text-obsidian"
              />
            </blockquote>

            <div className="border-t border-rule pt-8">
              <div className="mb-3 font-serif text-3xl font-semibold text-obsidian">{name}</div>
              <p className="mb-5 max-w-md text-base font-light leading-relaxed text-muted">{bio}</p>
              <p className="eyebrow !text-obsidian">{role}</p>
            </div>
          </div>

          {/* Right Column: Portrait */}
          <Reveal className="lg:col-span-2" y={40} duration={0.9}>
            <div className="frame">
              <div className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden border border-rule-strong bg-obsidian">
                {hasCMSImage ? (
                  <CMSImage
                    media={props.image}
                    className="h-full w-full rounded-none object-cover contrast-125 grayscale"
                  />
                ) : legacyImageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={legacyImageUrl} alt={`${name}, ${role}`} className="h-full w-full rounded-none object-cover contrast-125 grayscale" />
                ) : (
                  <div className="relative h-full w-full">
                    <Image
                      alt={`${name}, ${role}`}
                      src={defaultImageUrl}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="rounded-none object-cover contrast-125 grayscale"
                    />
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default FounderBlock
