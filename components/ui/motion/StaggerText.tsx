import React from 'react'

type RevealStyle = React.CSSProperties & Record<`--${string}`, string | number | undefined>

interface StaggerTextProps {
  /**
   * Plain text. `<br/>` and `<span class="…">…</span>` are split-animated;
   * any other markup falls back to a single fade-up of the whole headline.
   */
  text: string
  className?: string
  /** Seconds between each unit ("words" or "chars"). */
  stagger?: number
  delay?: number
  duration?: number
  /** Rendered element. */
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  unit?: 'chars' | 'words'
  /** "animate" = on first paint (hero), "inView" = when scrolled into view. */
  mode?: 'animate' | 'inView'
  /** Kept for API compatibility — every unit rises out of its own mask. */
  fromMarks?: boolean
}

type Token =
  | { kind: 'word'; value: string; className?: string }
  | { kind: 'br' }

const TAG_RE = /<(\/?)(br|span)((?:\s+class="[^"]*")?)\s*\/?>/gi

/** Words + <br> + class-carrying <span> wrappers. Returns null for anything else. */
function tokenize(text: string): Token[] | null {
  // Reject any tag we don't understand (a bare `<` followed by a letter or slash).
  const stripped = text.replace(TAG_RE, '')
  if (/<[a-z/]/i.test(stripped)) return null

  const tokens: Token[] = []
  const spanStack: string[] = []
  let cursor = 0
  let match: RegExpExecArray | null
  TAG_RE.lastIndex = 0

  const pushText = (chunk: string) => {
    const className = spanStack[spanStack.length - 1]
    for (const word of chunk.split(/\s+/)) {
      if (word) tokens.push({ kind: 'word', value: word, className })
    }
  }

  while ((match = TAG_RE.exec(text)) !== null) {
    pushText(text.slice(cursor, match.index))
    const [, closing, name, attrs] = match
    if (name.toLowerCase() === 'br') {
      tokens.push({ kind: 'br' })
    } else if (closing) {
      spanStack.pop()
    } else {
      spanStack.push(/class="([^"]*)"/.exec(attrs)?.[1] ?? '')
    }
    cursor = match.index + match[0].length
  }
  pushText(text.slice(cursor))
  return tokens
}

/**
 * Headline that rises word-by-word (design system: "Hero h1 staggers
 * word-by-word"). Pure CSS — the markup is complete in the server HTML, the
 * animation starts at first paint and nothing waits on hydration, so a hero
 * headline can never be the reason LCP is late. Reduced motion is handled in
 * globals.css.
 */
export function StaggerText({
  text,
  className = '',
  stagger = 0.06,
  delay = 0,
  duration = 0.75,
  as: Tag = 'h1',
  unit = 'words',
  mode = 'animate',
}: StaggerTextProps) {
  const style: RevealStyle = {
    '--sx-stagger': `${stagger}s`,
    '--sx-delay': `${delay}s`,
    '--sx-dur': `${duration}s`,
  }
  const inView = mode === 'inView' ? '' : undefined
  const tokens = tokenize(text)

  if (!tokens) {
    return (
      <Tag
        className={`rise ${className}`}
        style={{ '--rise-delay': `${delay}s` } as RevealStyle}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    )
  }

  let unitIndex = 0
  const nodes: React.ReactNode[] = []
  tokens.forEach((token, i) => {
    if (token.kind === 'br') {
      nodes.push(<br key={`br-${i}`} />)
      return
    }
    const prev = tokens[i - 1]
    if (prev && prev.kind === 'word') nodes.push(' ')
    const wrapClass = token.className || undefined
    if (unit === 'chars') {
      nodes.push(
        <span key={`w-${i}`} className={`inline-block whitespace-nowrap ${wrapClass ?? ''}`}>
          {Array.from(token.value).map((ch, c) => (
            <span key={c} className="sx-word">
              <span className="sx-unit" style={{ '--i': unitIndex++ } as RevealStyle}>
                {ch}
              </span>
            </span>
          ))}
        </span>,
      )
    } else {
      nodes.push(
        <span key={`w-${i}`} className={`sx-word ${wrapClass ?? ''}`}>
          <span className="sx-unit" style={{ '--i': unitIndex++ } as RevealStyle}>
            {token.value}
          </span>
        </span>,
      )
    }
  })

  const plain = tokens
    .map((t) => (t.kind === 'word' ? t.value : ' '))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()

  return (
    <Tag
      className={className}
      style={style}
      data-sx-inview={inView}
      suppressHydrationWarning
      {...(unit === 'chars' ? { 'aria-label': plain } : {})}
    >
      {unit === 'chars' ? <span aria-hidden="true">{nodes}</span> : nodes}
    </Tag>
  )
}

export default StaggerText
