import React from 'react'
import { AnimatedSection, Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal'
import ContactForm from '@/components/forms/ContactForm'

export interface ContactFormBlockProps {
  blockType?: string
  title?: string
  subtitle?: string
}

export const ContactFormBlock: React.FC<ContactFormBlockProps> = ({ title, subtitle }) => {
  return (
    <AnimatedSection className="w-full bg-cream pt-[var(--header-h)]">
      <div className="mx-auto flex min-h-[calc(100vh-var(--header-h))] w-full flex-col border-b border-rule md:flex-row">
        {/* Left Column */}
        <div className="on-dark relative isolate flex w-full flex-col justify-center overflow-hidden bg-obsidian p-8 md:w-[40%] md:p-16 lg:p-24">
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
                  Contact
                </p>
              </StaggerItem>
              <StaggerItem>
                <h1 className="mb-6 font-serif text-headline font-semibold text-white">
                  {title || 'Start the Conversation.'}
                </h1>
              </StaggerItem>
              <StaggerItem>
                <p className="mb-16 text-lede font-light text-muted-dark">
                  {subtitle || 'Questions about scope, timelines, or infrastructure? Our team responds within one business day.'}
                </p>
              </StaggerItem>
              <StaggerItem>
                <div>
                  <h2 className="eyebrow eyebrow-dark mb-6">Direct Channels</h2>
                  <ul className="border-t border-rule-dark font-mono text-sm text-white/80">
                    <li className="flex items-start gap-4 border-b border-rule-dark py-4">
                      <span className="text-success">01.</span>
                      <span>hello@exvorta.com</span>
                    </li>
                    <li className="flex items-start gap-4 border-b border-rule-dark py-4">
                      <span className="text-success">02.</span>
                      <span>Dubai, UAE — Global Reach</span>
                    </li>
                  </ul>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex w-full items-center bg-cream p-8 md:w-[60%] md:p-16 lg:p-24">
          <Reveal delay={0.2} className="mx-auto w-full max-w-2xl">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default ContactFormBlock
