'use client'

import React, { useEffect, useState } from 'react'
import a from 'next/link'
import { setCookieConsent } from '@/actions/setCookieConsent'

interface CookieBannerProps {
  enable?: boolean | null
  text?: string | null
  policyUrl?: string | null
  hasResponded?: boolean
}

export default function CookieBanner({ config }: { config: CookieBannerProps }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (config.enable === false) return
    if (!config.hasResponded) {
      setShow(true)
    }
  }, [config])

  const accept = async () => {
    await setCookieConsent('accepted')
    setShow(false)
  }

  const decline = async () => {
    await setCookieConsent('declined')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 inset-x-0 p-4 bg-surface-2 border-t border-border z-50 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
      <p className="text-sm text-text flex-1">
        {config.text || 'We use cookies to ensure you get the best experience on our website.'}
        {config.policyUrl && (
          <a href={config.policyUrl} className="ms-2 font-medium text-accent hover:underline">
            Learn more
          </a>
        )}
      </p>
      <div className="flex items-center gap-3">
        <button onClick={decline} className="px-4 py-2 text-sm text-muted hover:text-text font-medium transition-colors">
          Decline
        </button>
        <button onClick={accept} className="px-4 py-2 text-sm bg-primary text-bg rounded font-semibold hover:bg-primary/90 transition-colors">
          Accept
        </button>
      </div>
    </div>
  )
}
