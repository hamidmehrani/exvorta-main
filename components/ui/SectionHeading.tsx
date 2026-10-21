import React from 'react'
import { Reveal } from './Reveal'

export interface SectionHeadingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode
  /** Blueprint label above the title. */
  eyebrow?: React.ReactNode
  /** Section number shown as an emerald chip before the eyebrow ("01"). */
  index?: string
  /** Lede paragraph under the title. */
  description?: React.ReactNode
  align?: 'start' | 'center'
  /** `dark` for obsidian sections. */
  tone?: 'light' | 'dark'
  /** Heading element — the visual size never changes with it. */
  as?: 'h1' | 'h2' | 'h3'
  /** Set when `title` is trusted/sanitised HTML (CMS headlines carry <br/>). */
  titleHtml?: string
}

/**
 * Shared section header: eyebrow → headline → lede, one scale everywhere
 * (DESIGN.md: headline-xl 60px → 36px). Server component; the entrance is
 * CSS-only via <Reveal>.
 */
export function SectionHeading({
  title,
  eyebrow,
  index,
  description,
  align = 'start',
  tone = 'light',
  as: Heading = 'h2',
  titleHtml,
  className = '',
  ...props
}: SectionHeadingProps) {
  const dark = tone === 'dark'
  const centered = align === 'center'

  return (
    <div className={`${centered ? 'mx-auto text-center' : ''} ${className}`} {...props}>
      {(eyebrow || index) && (
        <Reveal y={10} duration={0.5}>
          <p className={`eyebrow mb-6 ${dark ? 'eyebrow-dark' : ''} ${centered ? 'justify-center' : ''}`}>
            {index ? (
              <span className="eyebrow-index">{index}</span>
            ) : (
              <span className="eyebrow-index" aria-hidden>
                <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
              </span>
            )}
            {eyebrow}
          </p>
        </Reveal>
      )}
      <Reveal y={18} delay={0.06}>
        {titleHtml ? (
          <Heading
            className={`font-serif text-headline font-semibold ${dark ? 'text-white' : 'text-obsidian'} ${centered ? 'mx-auto max-w-4xl' : 'max-w-4xl'}`}
            dangerouslySetInnerHTML={{ __html: titleHtml }}
          />
        ) : (
          <Heading
            className={`font-serif text-headline font-semibold ${dark ? 'text-white' : 'text-obsidian'} ${centered ? 'mx-auto max-w-4xl' : 'max-w-4xl'}`}
          >
            {title}
          </Heading>
        )}
      </Reveal>
      {description && (
        <Reveal y={14} delay={0.14}>
          <p
            className={`mt-6 text-lede font-light ${dark ? 'text-muted-dark' : 'text-muted'} ${centered ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  )
}

export default SectionHeading
