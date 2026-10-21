'use client'

import { useEffect, useState } from 'react'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { CONSENT_EVENT, readConsent, type Consent } from '@/lib/consent'

/**
 * Loads GA / GTM only after the visitor has explicitly accepted cookies.
 * Resolved on the client so the surrounding page can stay statically cached.
 */
export default function ConsentAnalytics({ gaId, gtmId }: { gaId?: string | null; gtmId?: string | null }) {
  const [consent, setConsent] = useState<Consent>(null)

  useEffect(() => {
    const sync = () => setConsent(readConsent())
    sync()
    window.addEventListener(CONSENT_EVENT, sync)
    return () => window.removeEventListener(CONSENT_EVENT, sync)
  }, [])

  if (consent !== 'accepted') return null

  return (
    <>
      {gaId && <GoogleAnalytics gaId={gaId} />}
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
    </>
  )
}
