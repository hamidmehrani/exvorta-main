'use client'

import React, { useState, useEffect } from 'react'
import {
  buildWhatsAppUrl,
  WHATSAPP_DISMISSED_STORAGE_KEY,
} from '@/lib/whatsapp'
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics'

export interface WhatsAppFloatProps {
  phoneNumber?: string | null
  message?: string | null
  lang?: 'en' | 'ar'
  className?: string
}

export const WhatsAppFloat: React.FC<WhatsAppFloatProps> = ({
  phoneNumber,
  message,
  lang = 'en',
  className = '',
}) => {
  const [mounted, setMounted] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      if (typeof window !== 'undefined' && localStorage.getItem(WHATSAPP_DISMISSED_STORAGE_KEY) === 'true') {
        setIsDismissed(true)
      }
    } catch {
      // Safe fallback if localStorage is disabled or throws
    }
  }, [])

  if (!mounted || isDismissed) {
    return null
  }

  const isAr = lang === 'ar'
  const statusLabel = isAr ? 'مكتب التداول نشط' : 'Trade Desk Active'
  const ariaLabel = isAr ? 'محادثة عبر واتساب - مكتب التداول نشط' : 'Chat on WhatsApp - Trade Desk Active'
  const tooltipTitle = isAr ? 'محادثة فورية مع مكتب التداول' : 'Direct trade desk chat on WhatsApp'

  const href = buildWhatsAppUrl({
    phone: phoneNumber,
    message: message || undefined,
    context: message ? undefined : { type: 'general', lang },
  })

  const handleChatClick = () => {
    trackEvent(ANALYTICS_EVENTS.WHATSAPP_CLICKED, {
      location: 'floating_widget',
      page: typeof window !== 'undefined' ? window.location.pathname : '',
    })
  }

  const handleDismiss = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDismissed(true)
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(WHATSAPP_DISMISSED_STORAGE_KEY, 'true')
      }
    } catch {
      // Safe fallback
    }
  }

  return (
    <aside
      aria-label={isAr ? 'أداة واتساب للمحادثة' : 'WhatsApp Support Widget'}
      className={`fixed bottom-6 end-6 z-40 flex items-center rounded-full border border-rule-dark bg-obsidian/95 p-1.5 shadow-2xl backdrop-blur-sm transition-all hover:border-white/20 ${className}`}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleChatClick}
        aria-label={ariaLabel}
        title={tooltipTitle}
        className="group/link flex items-center gap-2.5 px-3 py-1 text-cream no-underline transition-opacity hover:opacity-95"
      >
        {/* Crisp WhatsApp SVG Icon */}
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm transition-transform duration-200 group-hover/link:scale-105">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.02c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.28z" />
          </svg>
        </span>

        {/* Live Indicator Dot + Status Text */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-mono text-xs font-medium tracking-wider text-cream transition-colors group-hover/link:text-white">
            {statusLabel}
          </span>
        </div>
      </a>

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss WhatsApp widget"
        className="me-1.5 flex h-6 w-6 items-center justify-center rounded-full text-muted-dark transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
      >
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </aside>
  )
}

export default WhatsAppFloat
export { WhatsAppLink } from './WhatsAppLink'

