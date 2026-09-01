'use client'

import React from 'react'

export type DocTemplateIconName = 'sailing' | 'workspace_premium' | 'verified_user' | 'auto_awesome' | 'diamond'

interface Props {
  name: DocTemplateIconName
  className?: string
}

/**
 * Inline SVG icons for the Document Engine template selector.
 * Replaces Material Symbols (font was never loaded → names rendered as raw
 * text). Stroke inherits currentColor.
 */
const PATHS: Record<DocTemplateIconName, React.ReactNode> = {
  // ship
  sailing: (
    <>
      <path d="M4 18.5c1.5 1.2 3 1.5 4.5.8 1.6-.8 3.4-.8 5 0 1.5.7 3 .4 4.5-.8" />
      <path d="M5 16 12 4l7 12" />
      <path d="M5 16h14" />
      <path d="M12 4v3" />
    </>
  ),
  // certificate/medal
  workspace_premium: (
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="M9.5 8.5 11 10l3-3" />
      <path d="M8.5 13 7 21l5-2.5L17 21l-1.5-8" />
    </>
  ),
  // shield check
  verified_user: (
    <>
      <path d="M12 2.8 5 5.5v5.2c0 4.6 3 8.4 7 10.5 4-2.1 7-5.9 7-10.5V5.5L12 2.8Z" />
      <path d="M9.2 11.8 11 13.6l4-4" />
    </>
  ),
  // sparkles
  auto_awesome: (
    <>
      <path d="M12 3.5 13.8 8.2 18.5 10 13.8 11.8 12 16.5 10.2 11.8 5.5 10 10.2 8.2 12 3.5Z" />
      <path d="M18.5 15.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1Z" />
    </>
  ),
  // diamond
  diamond: (
    <>
      <path d="M7 3.5h10L21 9l-9 11.5L3 9l4-5.5Z" />
      <path d="M3 9h18" />
      <path d="M9.5 3.5 12 9l2.5-5.5" />
      <path d="M12 9v11.5" />
    </>
  ),
}

export function DocTemplateIcon({ name, className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {PATHS[name]}
    </svg>
  )
}

export default DocTemplateIcon
