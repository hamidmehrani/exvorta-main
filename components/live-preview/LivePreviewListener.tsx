'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'

export default function LivePreviewListener() {
  const router = useRouter()

  // Fall back to the current origin so a missing NEXT_PUBLIC_SERVER_URL can
  // never hand postMessage an empty target origin (which throws and takes the
  // whole route down to the error boundary).
  const serverUrl =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '')

  return (
    <RefreshRouteOnSave
      refresh={() => router.refresh()}
      serverURL={serverUrl}
    />
  )
}
