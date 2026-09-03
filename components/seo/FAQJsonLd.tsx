import React from 'react'

interface FAQJsonLdProps {
  questions: Array<{ question: string; answer: string }>
}

/**
 * FAQPage structured data — rich-result eligible Q&A markup.
 * Rendered server-side next to the FAQ block.
 */
const FAQJsonLd: React.FC<FAQJsonLdProps> = ({ questions }) => {
  if (!questions || questions.length === 0) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.answer },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default FAQJsonLd
