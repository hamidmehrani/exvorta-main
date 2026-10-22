import React from 'react'
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

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

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
            <span aria-hidden className="mb-4 block font-serif text-display font-semibold leading-none text-emerald">“</span>
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
              <div className="mb-3 font-serif text-title font-semibold text-obsidian">{name}</div>
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
                  /* No portrait uploaded yet: an on-brand monogram plate, never a
                     stock placeholder. Upload a portrait in the CMS to replace it. */
                  <div className="on-dark relative flex h-full w-full flex-col justify-between overflow-hidden p-8 text-white md:p-10">
                    <div aria-hidden className="bg-aura-dark absolute inset-0" />
                    <div aria-hidden className="bg-blueprint-grid-dark absolute inset-0" />
                    <p className="eyebrow eyebrow-dark relative">
                      <span className="eyebrow-index" aria-hidden>
                        <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
                      </span>
                      Dubai
                    </p>
                    <div
                      aria-hidden
                      className="relative flex h-44 w-44 select-none items-center justify-center self-center rounded-full border border-rule-dark bg-white/[0.03] md:h-52 md:w-52"
                    >
                      <span className="absolute inset-3 rounded-full border border-rule-dark" />
                      <span className="font-serif text-display font-semibold text-white">{initials}</span>
                    </div>
                    <div className="relative border-t border-rule-dark pt-5">
                      <p className="font-serif text-title font-semibold">{name}</p>
                      <p className="eyebrow eyebrow-dark mt-3">{role}</p>
                    </div>
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
