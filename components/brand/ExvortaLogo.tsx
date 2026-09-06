'use client'

import React from 'react'
import AnimatedBrandLogo from '@/components/brand/AnimatedBrandLogo'

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

/**
 * Exvorta brand lockup — animated diamond mark + "exvorta" wordmark.
 *
 * Motion: the mark pops in with a spring, the green accent dot lands with a
 * delayed pop then keeps a slow breathe; the wordmark fades/settles in with
 * the shared keyframes. All CSS (transform/opacity), gated by
 * IntersectionObserver + prefers-reduced-motion via the shared wrapper.
 */
export const ExvortaLogo: React.FC<ExvortaLogoProps> = ({
  size = 28,
  wordmark = true,
  tone = 'light',
  animated = true,
  className = '',
}) => {
  const color = tone === 'dark' ? '#FFFFFF' : '#141414'
  const wmSize = Math.max(11, Math.round(size * 0.72))

  return (
    <span
      className={`exv-brand ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: Math.max(6, Math.round(size * 0.3)) }}
    >
      <AnimatedBrandLogo size={size} animated={animated}>
        <svg
          viewBox="0 0 1000 1000"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Exvorta"
        >
          {/* Main black diamond frame with center diamond cut */}
          <path
            className="bl-in"
            style={{ ['--bl-delay' as never]: '0s' }}
            fill="#141414"
            fillRule="evenodd"
            d="M 0 0 H 225 L 500 275 L 775 0 H 1000 V 225 L 725 500 L 1000 775 V 1000 H 775 L 500 725 L 225 1000 H 0 V 775 L 275 500 L 0 225 Z M 500 330 L 670 500 L 500 670 L 330 500 Z"
          />
          {/* White ring */}
          <circle
            className="bl-pop"
            style={{ ['--bl-delay' as never]: '0.18s' }}
            cx="780"
            cy="780"
            r="100"
            fill="#FFFFFF"
          />
          {/* Green inner dot — pop then gentle infinite pulse */}
          <circle
            className="bl-pop-pulse"
            style={{ ['--bl-delay' as never]: '0.34s' }}
            cx="780"
            cy="780"
            r="76"
            fill="#00966B"
          />
        </svg>
      </AnimatedBrandLogo>

      {wordmark && (
        <span
          aria-hidden="true"
          className={animated ? 'bl-in' : undefined}
          style={{
            ['--bl-delay' as never]: '0.22s',
            fontSize: wmSize,
            fontWeight: 700,
            letterSpacing: '0.06em',
            color,
            fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
            lineHeight: 1,
            transform: 'translateY(-0.04em)',
            whiteSpace: 'nowrap',
          }}
        >
          exvorta
        </span>
      )}
    </span>
  )
}

export default ExvortaLogo
