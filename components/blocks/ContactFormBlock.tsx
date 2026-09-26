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
    <AnimatedSection className="w-full bg-[#FCFAF8] min-h-screen">
      <div className="w-full mx-auto flex flex-col md:flex-row min-h-[calc(100vh-5rem)] border-b border-[#E5E5E5]">
        {/* Left Column */}
        <div className="w-full md:w-[40%] bg-[#0D0D0D] p-8 md:p-16 lg:p-24 flex flex-col justify-center border-r border-[#E5E5E5] relative">
          <div className="max-w-md mx-auto w-full">
            <StaggerContainer delayChildren={0.1} staggerChildren={0.12}>
              <StaggerItem>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold mb-6 leading-tight text-white">
                  {title || 'Start the Conversation.'}
                </h1>
              </StaggerItem>
              <StaggerItem>
                <p className="text-base text-gray-300 font-sans font-light mb-16 leading-relaxed">
                  {subtitle || 'Questions about scope, timelines, or infrastructure? Our team responds within one business day.'}
                </p>
              </StaggerItem>
              <StaggerItem>
                <div className="space-y-6">
                  <h2 className="text-xs font-mono tracking-widest text-white/50 uppercase mb-8">Direct Channels</h2>
                  <ul className="space-y-6 text-sm font-mono text-white/80">
                    <li className="flex items-start gap-4">
                      <span className="text-white/40">01.</span>
                      <span>hello@exvorta.com</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="text-white/40">02.</span>
                      <span>Dubai, UAE — Global Reach</span>
                    </li>
                  </ul>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-[60%] bg-[#FCFAF8] p-8 md:p-16 lg:p-24 flex items-center">
          <Reveal delay={0.2} className="max-w-2xl mx-auto w-full">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default ContactFormBlock
