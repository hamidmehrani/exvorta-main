'use client'

import React, { useEffect, useState } from 'react'

export default function CookieBanner({ config }: { config: any }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!config?.enable) return
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) setShow(true)
  }, [config])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setShow(false)
  }

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface-2 border-t border-border z-[100] flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_-4px_24px_rgba(0,0,0,0.5)]">
      <p className="text-sm text-text flex-1 font-medium">{config?.message || 'We use cookies to ensure you get the best experience on our website.'}</p>
      <div className="flex items-center gap-3">
        <button onClick={decline} className="px-4 py-2 text-sm text-muted hover:text-text transition-colors font-semibold">
          {config?.declineLabel || 'Decline'}
        </button>
        <button onClick={accept} className="px-4 py-2 text-sm bg-primary text-bg rounded font-semibold hover:bg-primary/90 transition-colors">
          {config?.acceptLabel || 'Accept'}
        </button>
      </div>
    </div>
  )
}
