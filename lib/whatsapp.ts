/**
 * Institutional WhatsApp Helpers & Deep-Link Utilities
 * -----------------------------------------------------
 * Purity Guarantee: Zero React imports, zero DOM references, zero network calls.
 * Provides normalized E.164-compatible phone formatting, contextual bilingual
 * prefilled inquiry messages, and clean wa.me deep links.
 */

export const DEFAULT_WHATSAPP_PHONE = '97148793000'
export const WHATSAPP_DISMISSED_STORAGE_KEY = 'exv_wa_dismissed'

/**
 * Normalizes phone number to digits only.
 * Defaults to Exvorta Trade Desk ('97148793000') if empty or invalid.
 */
export function formatWhatsAppPhone(phone?: string | null): string {
  if (!phone) {
    return DEFAULT_WHATSAPP_PHONE
  }
  const digits = phone.replace(/\D/g, '')
  return digits.length > 0 ? digits : DEFAULT_WHATSAPP_PHONE
}

export interface WhatsAppPrefillContext {
  type: 'general' | 'service' | 'pricing' | 'contact' | 'custom'
  name?: string
  tier?: string
  lang?: 'en' | 'ar'
  ref?: string
}

/**
 * Builds localized, contextual prefill messages for WhatsApp inquiries.
 */
export function buildWhatsAppPrefill(context: WhatsAppPrefillContext): string {
  const isAr = context.lang === 'ar'

  switch (context.type) {
    case 'general':
      return isAr
        ? 'مرحباً فريق إكسفورتا، أود الاستفسار عن خدمات التداول المؤسسية.'
        : 'Hello Exvorta team, I would like to inquire about your institutional trade services.'

    case 'service':
      return isAr
        ? `مرحباً فريق إكسفورتا، أود الاستفسار بخصوص خدمات ${context.name || 'التداول'}.`
        : `Hello Exvorta team, I would like to inquire regarding your ${context.name || 'trade'} services.`

    case 'pricing':
      return isAr
        ? `مرحباً فريق إكسفورتا، أود مناقشة التسعير المؤسسي لباقة ${context.tier || 'المخصصة'}.`
        : `Hello Exvorta team, I would like to discuss institutional pricing for the ${context.tier || 'Custom'} tier.`

    case 'contact':
      return isAr
        ? 'مرحباً بمكتب تداول إكسفورتا، أود التحدث مع ممثل تجاري.'
        : 'Hello Exvorta Trade Desk, I would like to speak with a representative.'

    case 'custom':
      return context.ref || ''

    default:
      return ''
  }
}

export interface BuildWhatsAppUrlOptions {
  phone?: string | null
  message?: string | null
  context?: Parameters<typeof buildWhatsAppPrefill>[0]
}

/**
 * Generates an institutional wa.me deep link with encoded query parameters.
 */
export function buildWhatsAppUrl(options: BuildWhatsAppUrlOptions = {}): string {
  const digits = formatWhatsAppPhone(options.phone)
  const text = options.message || (options.context ? buildWhatsAppPrefill(options.context) : '')

  if (text && text.trim().length > 0) {
    return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
  }

  return `https://wa.me/${digits}`
}
