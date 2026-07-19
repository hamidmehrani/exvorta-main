'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'

export default function LivePreviewListener() {
  const router = useRouter()
  
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
  if (!serverUrl) {
    console.warn('WARNING: NEXT_PUBLIC_SERVER_URL is not set.')
  }

  return (
    <RefreshRouteOnSave
      refresh={() => router.refresh()}
      serverURL={serverUrl || ''}
    />
  )
}
