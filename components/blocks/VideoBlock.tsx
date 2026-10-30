'use client'

import React, { useState } from 'react'
import type { Media } from '@/payload-types'
import Image from 'next/image'
import { AnimatedSection } from '@/components/ui/Reveal'
import { m } from 'framer-motion'
import { useReducedMotion } from '@/lib/animations'

function parseVideoId(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/)
  if (yt) return yt[1]
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return vimeo[1]
  return null
}

function VideoEmbed({ url, poster }: { url: string; poster?: Media }) {
  const [started, setStarted] = useState(false)
  const reducedMotion = useReducedMotion()
  const id = parseVideoId(url)
  const showIframe = id !== null && (started || reducedMotion)

  return (
    <div className="relative w-full aspect-video bg-black overflow-hidden border border-black/10">
      {showIframe ? (
        url.includes('vimeo.com') ? (
          <iframe
            src={`https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0`}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Video"
          />
        ) : (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Video"
          />
        )
      ) : (
        <button type="button" onClick={() => setStarted(true)} className="absolute inset-0 w-full h-full cursor-pointer group">
          {poster && typeof poster === 'object' && poster.url ? (
            <Image src={poster.url} alt={poster.alt || 'Video cover'} fill priority sizes="(min-width: 1152px) 1152px, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
          ) : (
            <div className="absolute inset-0 bg-[#0A0A0A]" />
          )}
          <span className="absolute inset-0 bg-black/30 transition-colors duration-500 group-hover:bg-black/20" />
          <m.span
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-white/60 rounded-full flex items-center justify-center group-hover:border-white transition-colors duration-300"
          >
            <span className="w-0 h-0 border-y-[10px] border-y-transparent border-l-[16px] border-l-white ml-1" />
          </m.span>
        </button>
      )}
    </div>
  )
}

export const VideoBlock: React.FC<{
  url: string
  coverImage?: (number | null) | Media
  [key: string]: unknown
}> = ({ url, coverImage }) => {
  const poster = typeof coverImage === 'object' && coverImage ? coverImage : undefined

  return (
    <AnimatedSection className="w-full py-16 sm:py-24 lg:py-32 px-6">
      <div className="max-w-6xl mx-auto w-full">
        <VideoEmbed url={url} poster={poster} />
      </div>
    </AnimatedSection>
  )
}

export default VideoBlock
