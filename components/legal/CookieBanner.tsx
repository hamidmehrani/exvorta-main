'use client'

import React, { useEffect, useState } from 'react'
import { readConsent, writeConsent } from '@/lib/consent'

interface CookieBannerProps {
  enable?: boolean | null
  text?: string | null
  policyUrl?: string | null
}

export default function CookieBanner({ config }: { config: CookieBannerProps }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (config.enable === false) return
    if (!readConsent()) setShow(true)
  }, [config])

  const respond = (value: 'accepted' | 'declined') => {
    writeConsent(value)
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed inset-x-4 bottom-4 z-50 border border-obsidian/10 bg-surface p-6 shadow-soft md:inset-x-auto md:start-6 md:bottom-6 md:max-w-md"
    >
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">[ Cookies ]</p>
      <p className="mb-6 text-sm leading-relaxed text-obsidian/80">
        {config.text || 'We use cookies to ensure you get the best experience on our website.'}
        {config.policyUrl && (
          <a href={config.policyUrl} className="ms-2 font-medium text-obsidian underline underline-offset-4 hover:text-emerald">
            Learn more
          </a>
        )}
      </p>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => respond('accepted')} className="btn-primary min-h-[44px]">
          [ Accept ]
        </button>
        <button type="button" onClick={() => respond('declined')} className="btn-ghost min-h-[44px]">
          Decline
        </button>
      </div>
    </div>
  )
}
