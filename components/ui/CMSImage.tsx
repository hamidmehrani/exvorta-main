/* eslint-disable */
import React from 'react'
import type { Media } from '@/payload-types'

interface CMSImageProps {
  media: Media | string | null | undefined
  className?: string
  priority?: boolean
}

export function CMSImage({ media, className = '', priority = false }: CMSImageProps) {
  if (!media || typeof media === 'string') {
    return null
  }

  const { url, alt, width, height } = media

  if (!url) return null

  // Auto-inject Cloudinary smart cropping and optimization if applicable
  let finalUrl = url;
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    // Only inject if it doesn't already have transformations like c_fill or q_auto
    if (!url.includes('/upload/c_') && !url.includes('/upload/q_')) {
      finalUrl = url.replace('/upload/', '/upload/c_fill,g_auto,f_auto,q_auto/');
    }
  }

  return (
    <img
      src={finalUrl}
      alt={alt || 'CMS Image'}
      width={width || 800}
      height={height || 600}
      className={className || "w-full h-full object-cover"}
      loading={priority ? 'eager' : 'lazy'}
      {...(priority ? { fetchPriority: 'high' } : {})}
    />
  )
}

export default CMSImage;
