import React from 'react'

export interface ExvortaLogoProps {
  /** Rendered box size in px (mark height; wordmark scales with it) */
  size?: number
  /** Show the "exvorta" wordmark beside the mark (default true) */
  wordmark?: boolean
  /** Wordmark color — adapts to background */
  tone?: 'light' | 'dark'
  /** Enable entrance + loop animations (default true) */
  animated?: boolean
  className?: string
}

type DelayStyle = React.CSSProperties & { '--bl-delay'?: string }

/**
 * Exvorta brand lockup — diamond mark + "exvorta" wordmark.
 *
 * Motion: the mark pops in, the green accent dot lands with a delayed pop and
 * then keeps a slow breathe; the wordmark settles in. All CSS (see `.exv-brand`
 * in globals.css), so it renders and animates at first paint with no client
 * JS, and is switched off by prefers-reduced-motion.
 *
 * Public-site only. The Payload admin has its own static mark
 * (components/admin/AdminBrandMark.tsx) — sharing this module would pull the
 * admin bundle into public pages.
 */
export const ExvortaLogo: React.FC<ExvortaLogoProps> = ({
  size = 28,
  wordmark = true,
  tone = 'light',
  animated = true,
  className = '',
}) => {
  const wmSize = Math.max(11, Math.round(size * 0.72))
  const delay = (value: string): DelayStyle => ({ '--bl-delay': value })

  return (
    <span
      className={`exv-brand ${className}`}
      data-animated={animated ? '' : undefined}
      data-tone={tone}
      style={{ display: 'inline-flex', alignItems: 'center', gap: Math.max(6, Math.round(size * 0.3)) }}
    >
      <svg
        viewBox="0 0 1000 1000"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Exvorta"
      >
        {/* Main diamond frame with center diamond cut */}
        <path
          className="bl-in"
          style={delay('0s')}
          fill="#141414"
          fillRule="evenodd"
          d="M 0 0 H 225 L 500 275 L 775 0 H 1000 V 225 L 725 500 L 1000 775 V 1000 H 775 L 500 725 L 225 1000 H 0 V 775 L 275 500 L 0 225 Z M 500 330 L 670 500 L 500 670 L 330 500 Z"
        />
        {/* White ring */}
        <circle className="bl-pop" style={delay('0.18s')} cx="780" cy="780" r="100" fill="#FFFFFF" />
        {/* Green inner dot — pop, then a gentle infinite pulse */}
        <circle className="bl-pop-pulse" style={delay('0.34s')} cx="780" cy="780" r="76" fill="#00966B" />
      </svg>

      {wordmark && (
        <span
          aria-hidden="true"
          className="exv-wordmark bl-in"
          style={{ ...delay('0.22s'), fontSize: wmSize }}
        >
          exvorta
        </span>
      )}
    </span>
  )
}

export default ExvortaLogo
