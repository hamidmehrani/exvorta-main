'use client'

import React from 'react'
import AnimatedBrandLogo from '@/components/brand/AnimatedBrandLogo'

export interface ExvortaLogoProps {
  /** Rendered box size in px (square) */
  size?: number
  animated?: boolean
  className?: string
}

/**
 * Exvorta brand mark — black diamond frame with cut-through center diamond,
 * white ring + green accent dot at the bottom-right.
 * Faithful animated port of /logos/exvorta/exvorta-logo.svg (viewBox 0 0 1000 1000).
 */
export const ExvortaLogo: React.FC<ExvortaLogoProps> = ({
  size = 28,
  animated = true,
  className = '',
}) => (
  <AnimatedBrandLogo size={size} animated={animated} className={className}>
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
)

export default ExvortaLogo
