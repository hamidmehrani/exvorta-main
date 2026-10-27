'use client'

import { useRef } from 'react'

/**
 * Closing signature: the oversized wordmark, cropped by the page edge. On
 * fine pointers an emerald spotlight follows the cursor across the letters
 * (CSS variables only — no React renders on pointer move). Touch devices and
 * reduced-motion users get the static faint wordmark. Pure decoration: the text
 * is painted from `data-wordmark` so it is never read or contrast-audited.
 */
export default function FooterWordmark({ name }: { name: string }) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  const onLeave = () => {
    ref.current?.style.removeProperty('--mx')
    ref.current?.style.removeProperty('--my')
  }

  return (
    <div className="-mb-[0.08em] [mask-image:linear-gradient(to_bottom,black_45%,transparent)]" onPointerMove={onMove} onPointerLeave={onLeave}>
      <div
        ref={ref}
        aria-hidden
        data-wordmark={name}
        className="wordmark-spot select-none overflow-hidden whitespace-nowrap text-center font-sans text-mega font-bold uppercase"
      />
    </div>
  )
}
