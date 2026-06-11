import React from 'react'
import Image from 'next/image'
import type { Media } from '@/payload-types'

interface CMSImageProps {
  media: Media | string | null | undefined
  className?: string
  priority?: boolean
}

export default function CMSImage({ media, className = '', priority = false }: CMSImageProps) {
  if (!media || typeof media === 'string') {
    return null
  }

  const { url, alt, width, height } = media

  if (!url) return null

  return (
    <Image
      src={url}
      alt={alt || 'CMS Image'}
      width={width || 800}
      height={height || 600}
      className={className}
      priority={priority}
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  )
}
