import React from 'react'

export interface ServiceOffer {
  price?: string | number
  priceCurrency?: string
  url?: string
  [key: string]: unknown
}

export interface ServiceSchemaProps {
  name: string
  description: string
  providerName?: string
  serviceType?: string
  url?: string
  offers?: ServiceOffer | ServiceOffer[] | Record<string, unknown> | Array<Record<string, unknown>>
  type?: 'Service' | 'ProfessionalService'
}

export function buildServiceJsonLd({
  name,
  description,
  providerName = 'Exvorta',
  serviceType,
  url,
  offers,
  type = 'Service',
}: ServiceSchemaProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    description,
  }

  if (providerName) {
    schema.provider = {
      '@type': 'Organization',
      name: providerName,
    }
  }

  if (serviceType) {
    schema.serviceType = serviceType
  }

  if (url) {
    schema.url = url
  }

  if (offers) {
    if (Array.isArray(offers)) {
      schema.offers = offers.map((offer) => ({
        '@type': 'Offer',
        ...offer,
      }))
    } else {
      schema.offers = {
        '@type': 'Offer',
        ...offers,
      }
    }
  }

  return schema
}

/**
 * Service / ProfessionalService structured data for rich-result eligible offerings.
 * Rendered server-side for agency offerings and trade platform engineering pages.
 */
const ServiceSchema: React.FC<ServiceSchemaProps> = (props) => {
  if (!props.name || !props.description) return null

  const schema = buildServiceJsonLd(props)

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default ServiceSchema
