import React from 'react'

export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-surface focus:text-accent focus:font-bold focus:rounded-md focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-accent transition-all"
    >
      Skip to main content
    </a>
  )
}
