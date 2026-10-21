import React from 'react'
import { sanitizeHeadingHtml } from '@/utils/heading-sanitize'
import type { Page } from '@/payload-types'
import { CtaBand } from '@/components/ui/CtaBand'
import { StaggerText } from '@/components/ui/motion/StaggerText'
import { unbracket } from '@/lib/text'

type CTABlockProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'cta' }>

const isUsable = (url?: string | null): url is string => Boolean(url) && url !== '#'

/**
 * Closing statement + call to action.
 *
 * Honors every field the CMS block exposes — theme, eyebrow, both buttons and
 * the disclaimer. The previous version rendered only title and description,
 * so a CTA authored in the admin appeared with no button at all.
 */
export const CTABlock: React.FC<CTABlockProps> = (props) => {
  const dark = props.theme === 'dark'
  const headline = props.title || 'Deals are won before the first meeting.'
  const description =
    props.description ||
    'Without a credible digital presence, you are losing deals before the first conversation. Exvorta fixes this.'
  const hasHtml = /<[^>]+>/.test(headline) && !/^(?:[^<]|<br\s*\/?>)*$/i.test(headline)

  const primary = isUsable(props.buttonUrl) && props.buttonText ? { label: props.buttonText, href: props.buttonUrl } : null
  const secondary =
    isUsable(props.secondaryButtonUrl) && props.secondaryButtonText
      ? { label: props.secondaryButtonText, href: props.secondaryButtonUrl }
      : null

  return (
    <CtaBand
      tone={dark ? 'dark' : 'light'}
      eyebrow={unbracket(props.eyebrow) || undefined}
      headline={
        hasHtml ? (
          <span dangerouslySetInnerHTML={{ __html: sanitizeHeadingHtml(headline, { onDark: dark }) }} />
        ) : (
          <StaggerText as="span" text={headline} unit="words" stagger={0.09} duration={0.7} mode="inView" />
        )
      }
      description={description}
      primary={primary}
      secondary={secondary}
      footnote={props.disclaimer || undefined}
    />
  )
}

export default CTABlock
