/**
 * Exvorta Arabic Locale Architecture & Internationalization Contracts
 *
 * Implements the static mirror pattern and bidirectional alternates contract
 * defined in docs/CONTRACTS.md (Section 4).
 */

export type SupportedLocale = 'en' | 'ar'

export interface LocaleAlternates {
  canonical: string
  languages: {
    en: string
    ar: string
    'x-default': string
  }
}

export interface LocaleRoutePair {
  en: string
  ar: string
}

/**
 * Static mirror route pairs formalized under PLAT-12 Phase 1
 */
export const ARABIC_MIRROR_PAIRS: readonly LocaleRoutePair[] = [
  { en: '/', ar: '/ar' },
  { en: '/tools', ar: '/tools/ar' },
  { en: '/pricing', ar: '/pricing/ar' },
  { en: '/tools/incoterm-cbm', ar: '/tools/incoterm-cbm/ar' },
] as const

/**
 * Normalizes an English path to a standard slash-prefixed pathname without trailing slashes.
 */
export function normalizeEnPath(path: string): string {
  const trimmed = path.trim()
  if (!trimmed || trimmed === '/') return '/'
  const stripped = trimmed.replace(/^\/+|\/+$/g, '')
  // If accidentally passed an Arabic mirror path, extract the base English route
  if (stripped.endsWith('/ar')) {
    const base = stripped.slice(0, -3)
    return base ? `/${base}` : '/'
  }
  if (stripped === 'ar') {
    return '/'
  }
  return `/${stripped}`
}

/**
 * Derives the corresponding Arabic mirror route path for a given English route path.
 */
export function getArPathForEnPath(enPath: string): string {
  const normalized = normalizeEnPath(enPath)
  return normalized === '/' ? '/ar' : `${normalized}/ar`
}

/**
 * Builds bidirectional hreflang alternates conforming to the contract in docs/CONTRACTS.md:
 *
 * alternates: {
 *   canonical: '<canonical-url>',
 *   languages: {
 *     en: '<en-url>',
 *     ar: '<ar-url>',
 *     'x-default': '<en-url>',
 *   },
 * }
 */
export function buildLocaleAlternates(
  enPath: string,
  currentLocale: SupportedLocale = 'en'
): LocaleAlternates {
  const normalizedEn = normalizeEnPath(enPath)
  const arPath = getArPathForEnPath(normalizedEn)

  return {
    canonical: currentLocale === 'ar' ? arPath : normalizedEn,
    languages: {
      en: normalizedEn,
      ar: arPath,
      'x-default': normalizedEn,
    },
  }
}

/**
 * Validates whether a metadata alternates object satisfies the bidirectional contract.
 */
export function validateLocaleAlternates(
  alternates: unknown,
  expected: { canonical: string; en: string; ar: string }
): boolean {
  if (!alternates || typeof alternates !== 'object') return false
  const a = alternates as Partial<LocaleAlternates>
  if (a.canonical !== expected.canonical) return false
  if (!a.languages || typeof a.languages !== 'object') return false
  return (
    a.languages.en === expected.en &&
    a.languages.ar === expected.ar &&
    a.languages['x-default'] === expected.en
  )
}
