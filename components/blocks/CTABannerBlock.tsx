import React from 'react'
import type { Page } from '@/payload-types'
import { CtaBand } from '@/components/ui/CtaBand'
import { unbracket } from '@/lib/text'

type CTABannerProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'ctaBanner' }>

export function CTABannerBlock(props: CTABannerProps) {
  const label = unbracket(props.label) || 'INITIATE PARTNERSHIP'
  const headline = props.headline || 'Align your digital infrastructure<br/>with your operational scale.'
  const description =
    props.description ||
    'Stop allowing generic architecture to dilute your market authority. Engage our engineering team to map your optimal digital footprint.'
  const primaryCTA = props.primaryCTA || { label: '[ REQUEST A PROPOSAL ]', url: '/rfq' }

  return (
    <CtaBand
      id="cta"
      tone="dark"
      eyebrow={label}
      headline={<span dangerouslySetInnerHTML={{ __html: headline }} />}
      description={description}
      primary={{
        label: primaryCTA.label || '[ REQUEST A PROPOSAL ]',
        href: !primaryCTA.url || primaryCTA.url === '#' ? '/rfq' : primaryCTA.url,
      }}
      footnote="[ Response within 24 hours ]"
    />
  )
}

export default CTABannerBlock
