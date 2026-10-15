import React from 'react'

/**
 * Static Exvorta mark for the Payload admin (logo, favicon, welcome widget).
 *
 * Deliberately NOT the animated site logo: the admin and the public site must
 * not share a client module, otherwise webpack attaches the admin's chunk
 * group to the public page (see components/ui/AppLink.tsx). Hex values are
 * inline because the admin renders outside the site's Tailwind theme.
 */
export function AdminBrandMark({
  size = 28,
  wordmark = true,
  tone = 'light',
}: {
  size?: number
  wordmark?: boolean
  tone?: 'light' | 'dark'
}) {
  const color = tone === 'dark' ? '#FFFFFF' : '#141414'
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: Math.max(6, Math.round(size * 0.3)) }}>
      <svg
        viewBox="0 0 1000 1000"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Exvorta"
      >
        <path
          fill="#141414"
          fillRule="evenodd"
          d="M 0 0 H 225 L 500 275 L 775 0 H 1000 V 225 L 725 500 L 1000 775 V 1000 H 775 L 500 725 L 225 1000 H 0 V 775 L 275 500 L 0 225 Z M 500 330 L 670 500 L 500 670 L 330 500 Z"
        />
        <circle cx="780" cy="780" r="100" fill="#FFFFFF" />
        <circle cx="780" cy="780" r="76" fill="#00966B" />
      </svg>
      {wordmark && (
        <span
          aria-hidden="true"
          style={{
            fontSize: Math.max(11, Math.round(size * 0.72)),
            fontWeight: 700,
            letterSpacing: '0.06em',
            color,
            fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          exvorta
        </span>
      )}
    </span>
  )
}

export default AdminBrandMark
