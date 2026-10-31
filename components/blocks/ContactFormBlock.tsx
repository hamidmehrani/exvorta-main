'use client'

import React from 'react'
import { AnimatedSection, Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal'
import ContactForm from '@/components/forms/ContactForm'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics'

export interface ContactFormBlockProps {
  blockType?: string
  title?: string
  subtitle?: string
  enableWhatsApp?: boolean | null
  contactPhone?: string | null
}

export const ContactFormBlock: React.FC<ContactFormBlockProps> = ({
  title,
  subtitle,
  enableWhatsApp = true,
  contactPhone,
}) => {
  const whatsappUrl = buildWhatsAppUrl({
    phone: contactPhone,
    context: { type: 'contact' },
  })

  return (
    <AnimatedSection className="w-full bg-cream pt-[var(--header-h)]">
      <div className="mx-auto flex min-h-[calc(100vh-var(--header-h))] w-full flex-col border-b border-rule md:flex-row">
        {/* Left Column (Institutional Elite Dark - Intake Narrative & Channels) */}
        <div className="on-dark relative isolate flex w-full flex-col justify-between overflow-hidden bg-obsidian p-8 md:w-[40%] md:p-14 lg:p-20 border-b md:border-b-0 md:border-e border-rule-dark">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="bg-aura-dark absolute inset-0 opacity-70" />
            <div className="bg-blueprint-grid-dark absolute inset-0" />
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <StaggerContainer delayChildren={0.1} staggerChildren={0.12}>
              <StaggerItem>
                <p className="eyebrow eyebrow-dark mb-8">
                  <span className="eyebrow-index" aria-hidden>
                    <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
                  </span>
                  Commercial Intake // Protocol
                </p>
              </StaggerItem>
              <StaggerItem>
                <h1 className="mb-6 font-serif text-headline font-semibold text-white">
                  {title || 'Start the Conversation.'}
                </h1>
              </StaggerItem>
              <StaggerItem>
                <p className="mb-12 text-lede font-light text-muted-dark leading-relaxed">
                  {subtitle || 'Submit your operational parameters. Engineering leadership evaluates all incoming briefs directly with zero sales intermediaries.'}
                </p>
              </StaggerItem>
              <StaggerItem>
                <div className="mb-10">
                  <h2 className="eyebrow eyebrow-dark mb-4">Direct Channels & Presence</h2>
                  <ul className="border-t border-rule-dark font-mono text-xs text-white/80">
                    <li className="flex items-start gap-4 border-b border-rule-dark py-3.5">
                      <span className="text-success font-semibold">01.</span>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-white font-medium">hello@exvorta.com</span>
                        <span className="text-[11px] text-muted-dark">Direct systems architecture triage within 24h</span>
                      </div>
                    </li>
                    {enableWhatsApp !== false && (
                      <li className="flex items-start gap-4 border-b border-rule-dark py-3.5">
                        <span className="text-success font-semibold">02.</span>
                        <div className="flex flex-col gap-0.5">
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() =>
                              trackEvent(ANALYTICS_EVENTS.WHATSAPP_CLICKED, { location: 'contact_page' })
                            }
                            className="group inline-flex items-center gap-1.5 text-white font-medium hover:text-success transition-colors"
                          >
                            <span>WhatsApp Trade Desk</span>
                            <span className="font-mono text-[10px] text-success transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true">↗</span>
                          </a>
                          <span className="text-[11px] text-muted-dark">Direct desk inquiry with senior engineering lead</span>
                        </div>
                      </li>
                    )}
                    <li className="flex items-start gap-4 border-b border-rule-dark py-3.5">
                      <span className="text-success font-semibold">03.</span>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-white font-medium">Dubai, UAE — Global Reach</span>
                        <span className="text-[11px] text-muted-dark">Operating across UAE, EU, and global trade corridors</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 border-b border-rule-dark py-3.5">
                      <span className="text-success font-semibold">04.</span>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-white font-medium">Zero-Intermediary Guarantee</span>
                        <span className="text-[11px] text-muted-dark">All scopes evaluated directly by senior engineers</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>

          {/* Bottom Protocol Note */}
          <div className="relative mx-auto w-full max-w-md pt-8">
            <div className="rounded-[4px] border-s-2 border-emerald bg-white/[0.04] p-4 text-xs font-mono text-muted-dark">
              <span className="font-semibold text-white uppercase tracking-wider block mb-1">
                Security & Data Integrity
              </span>
              All submissions are encrypted in transit via TLS 1.3. We enforce strict data confidentiality with zero third-party brokering.
            </div>
          </div>
        </div>

        {/* Right Column (Intake Form & Post-Submission Confirmation) */}
        <div className="flex w-full items-center bg-cream p-6 sm:p-10 md:w-[60%] md:p-14 lg:p-20">
          <Reveal delay={0.2} className="mx-auto w-full max-w-3xl">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default ContactFormBlock
