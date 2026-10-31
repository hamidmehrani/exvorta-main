/**
 * Pure Share Helpers for Exvorta Trade Tools
 * -------------------------------------------
 * Purity Guarantee: Zero React imports, zero DOM references, zero network calls.
 * Localized share text formatting and deep-link generation for GCC trade workflows.
 */

export interface IncotermShareParams {
  incoterm: string
  cbm?: number
  weightKg?: number
  containerFit?: string
  permalink: string
  lang?: 'en' | 'ar'
}

export interface DocGenShareParams {
  docType: string
  docNumber?: string
  permalink: string
  lang?: 'en' | 'ar'
}

export interface GenericToolShareParams {
  title: string
  summary?: string
  permalink: string
  lang?: 'en' | 'ar'
}

/**
 * Builds a WhatsApp deep-link click-to-chat URL without injecting PII or tracking parameters.
 */
export function buildWhatsAppShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

/**
 * Formats bilingual share text for Incoterm & CBM Calculator results.
 */
export function formatIncotermShareText(params: IncotermShareParams): string {
  const { incoterm, cbm, weightKg, containerFit, permalink, lang = 'en' } = params

  if (lang === 'ar') {
    return `حاسبة إكسفورتا للتجارة: إنكوتيرمز 2020 ${incoterm}${cbm ? ` | الحجم: ${cbm} م³` : ''}${weightKg ? ` | الوزن: ${weightKg} كجم` : ''}${containerFit ? ` | التعبئة: ${containerFit}` : ''} | الرابط: ${permalink}`
  }

  return `Exvorta Trade Calc: Incoterms 2020 ${incoterm}${cbm ? ` | Volume: ${cbm} CBM` : ''}${weightKg ? ` | Weight: ${weightKg} kg` : ''}${containerFit ? ` | Fit: ${containerFit}` : ''} | Link: ${permalink}`
}

/**
 * Formats bilingual share text for Document Generator trade documents.
 */
export function formatDocGenShareText(params: DocGenShareParams): string {
  const { docType, docNumber, permalink, lang = 'en' } = params

  if (lang === 'ar') {
    return `مولد وثائق إكسفورتا: ${docType}${docNumber ? ` رقم ${docNumber}` : ''} | الرابط: ${permalink}`
  }

  return `Exvorta DocGen: ${docType}${docNumber ? ` #${docNumber}` : ''} | Link: ${permalink}`
}

/**
 * Formats generic bilingual share text for Exvorta interactive trade tools.
 */
export function formatGenericToolShareText(params: GenericToolShareParams): string {
  const { title, summary, permalink, lang = 'en' } = params

  if (lang === 'ar') {
    return `إكسفورتا ${title}${summary ? `: ${summary}` : ''} | الرابط: ${permalink}`
  }

  return `Exvorta ${title}${summary ? `: ${summary}` : ''} | Link: ${permalink}`
}
