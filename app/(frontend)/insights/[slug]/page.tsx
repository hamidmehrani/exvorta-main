import React from 'react'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

// BLOG DRAFTED — see ../page.tsx note.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function SingleInsightPage() {
  redirect('/')
}
