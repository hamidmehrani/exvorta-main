import React from 'react'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

// BLOG DRAFTED: insights archive is intentionally offline until content is
// ready. All old links 301 to home. To relaunch, restore from git history
// (this file previously rendered <InsightsArchive posts={posts} />).
export const metadata: Metadata = {
  title: 'Insights | Exvorta',
  robots: { index: false, follow: false },
}

export default function InsightsDraftPage() {
  redirect('/')
}
