import React from 'react'

export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:start-4 focus:z-50 focus:p-4 focus:bg-surface focus:text-obsidian focus:font-bold focus:rounded-md focus:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 transition-all"
    >
      Skip to main content
    </a>
  )
}
