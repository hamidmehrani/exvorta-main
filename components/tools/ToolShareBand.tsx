'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { buildWhatsAppShareUrl } from '@/lib/tools/share'
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics'

export interface ToolShareBandProps {
  tool: string
  title: string
  shareText: string
  permalinkUrl?: string
  lang?: 'en' | 'ar'
  className?: string
}

export function ToolShareBand({
  tool,
  title,
  shareText,
  permalinkUrl,
  lang = 'en',
  className = '',
}: ToolShareBandProps) {
  const [copied, setCopied] = useState(false)
  const isAr = lang === 'ar'

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => {
      setCopied(false)
    }, 2500)
    return () => clearTimeout(timer)
  }, [copied])

  const handleCopyLink = useCallback(async () => {
    const targetUrl = permalinkUrl || (typeof window !== 'undefined' ? window.location.href : '')
    if (!targetUrl) return

    let success = false
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(targetUrl)
        success = true
      }
    } catch {
      // clipboard write fallback
    }

    if (!success && typeof document !== 'undefined') {
      try {
        const textArea = document.createElement('textarea')
        textArea.value = targetUrl
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        success = true
      } catch {
        // clipboard unavailable
      }
    }

    if (success) {
      trackEvent(ANALYTICS_EVENTS.TOOL_SHARE, { tool, method: 'copy_link' })
      setCopied(true)
    }
  }, [permalinkUrl, tool])

  const handleWhatsAppClick = useCallback(() => {
    trackEvent(ANALYTICS_EVENTS.TOOL_SHARE, { tool, method: 'whatsapp' })
  }, [tool])

  const whatsappUrl = buildWhatsAppShareUrl(shareText)
  const copyLabel = copied
    ? (isAr ? 'تم نسخ الرابط' : 'Link copied')
    : (isAr ? 'نسخ الرابط' : 'Copy Link')
  const waLabel = isAr ? 'مشاركة عبر واتساب' : 'Share via WhatsApp'

  return (
    <div
      className={`inline-flex flex-wrap items-center gap-2 ${className}`}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {title ? (
        <span className="font-mono text-xs uppercase tracking-wider text-muted select-none">
          {title}
        </span>
      ) : null}

      {/* Copy Link Button */}
      <button
        type="button"
        onClick={handleCopyLink}
        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider px-3.5 py-2 border border-rule bg-surface text-obsidian hover:bg-cream hover:border-obsidian focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-obsidian transition-colors rounded-[4px] cursor-pointer"
        aria-label={copyLabel}
        aria-live="polite"
      >
        <svg
          className={`w-3.5 h-3.5 shrink-0 ${copied ? 'text-emerald' : 'text-muted'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          {copied ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          )}
        </svg>
        <span>{copyLabel}</span>
      </button>

      {/* WhatsApp Link */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleWhatsAppClick}
        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider px-3.5 py-2 border border-rule bg-surface text-obsidian hover:bg-cream hover:border-obsidian focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-obsidian transition-colors rounded-[4px] cursor-pointer"
        aria-label={waLabel}
      >
        <svg
          className="w-3.5 h-3.5 fill-[#25D366] shrink-0"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.02c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.28z" />
        </svg>
        <span>{waLabel}</span>
      </a>
    </div>
  )
}
