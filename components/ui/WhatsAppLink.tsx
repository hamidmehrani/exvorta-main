'use client'

import React from 'react'
import {
  buildWhatsAppUrl,
  type WhatsAppPrefillContext,
} from '@/lib/whatsapp'
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics'

export interface WhatsAppLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  phone?: string | null
  message?: string | null
  context?: WhatsAppPrefillContext
  location?: string
  children?: React.ReactNode
}

/**
 * Accessible inline WhatsApp deep-link component with Umami conversion tracking.
 */
export const WhatsAppLink: React.FC<WhatsAppLinkProps> = ({
  phone,
  message,
  context,
  location = 'inline',
  href: customHref,
  onClick,
  children,
  target = '_blank',
  rel = 'noopener noreferrer',
  ...rest
}) => {
  const url = customHref || buildWhatsAppUrl({ phone, message, context })

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackEvent(ANALYTICS_EVENTS.WHATSAPP_CLICKED, {
      location,
      page: typeof window !== 'undefined' ? window.location.pathname : '',
    })
    onClick?.(e)
  }

  return (
    <a href={url} target={target} rel={rel} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}

export default WhatsAppLink
