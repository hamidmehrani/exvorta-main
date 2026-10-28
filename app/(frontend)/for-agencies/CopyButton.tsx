'use client'

import React, { useState, useCallback } from 'react'

export function CopyButton({
  text,
  label = 'Copy Code',
  className = '',
}: {
  text: string
  label?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Graceful fallback for non-secure or restricted contexts
      try {
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        // no-op
      }
    }
  }, [text])

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 border border-rule hover:border-obsidian bg-surface text-obsidian transition-colors cursor-pointer select-none ${className}`}
      aria-label={copied ? 'Copied to clipboard' : 'Copy snippet to clipboard'}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full transition-colors ${
          copied ? 'bg-emerald shadow-[0_0_6px_var(--color-emerald)]' : 'bg-muted'
        }`}
      />
      <span>{copied ? '[ Copied! ]' : `[ ${label} ]`}</span>
    </button>
  )
}
