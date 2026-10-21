import React from 'react'
import type { Metadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'
import Link from '@/components/ui/AppLink'
import { AnimatedSection, Reveal } from '@/components/ui/Reveal'

export const metadata: Metadata = {
  title: 'Legal | Exvorta',
  description: 'Privacy Policy and Terms of Service for Exvorta — the definitive digital infrastructure firm for elite global traders.',
}

const Section = ({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  children: React.ReactNode
}) => (
  <section id={id} className="border-b border-black/10 py-16 scroll-mt-24">
    <div className="max-w-3xl">
      <Reveal y={16}>
        <span className="text-[10px] font-mono tracking-[0.3em] text-black/65 uppercase block mb-4">
          {eyebrow}
        </span>
        <h2 className="text-2xl md:text-3xl font-serif font-semibold text-black mb-8">{title}</h2>
      </Reveal>
      <Reveal delay={0.1} y={16}>
        <div className="space-y-4 text-sm text-black/60 leading-relaxed font-light">
          {children}
        </div>
      </Reveal>
    </div>
  </section>
)

export default function LegalPage() {
  return (
    <div className="w-full bg-[#FAFAF8]">
      {/* Hero */}
      <AnimatedSection className="w-full bg-[#0A0A0A] pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="text-[10px] font-mono tracking-[0.4em] text-white/30 uppercase block mb-8">
            [ LEGAL FRAMEWORK ]
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-[1.05] tracking-tight mb-6 max-w-4xl">
            Privacy & Legal
          </h1>
          <p className="text-white/50 max-w-2xl text-base md:text-lg font-light leading-relaxed mb-12">
            We operate with institutional-grade transparency. These documents govern your relationship with Exvorta and how we handle your data.
          </p>
          {/* Jump links */}
          <Reveal delay={0.25} y={12}>
            <div className="flex flex-wrap gap-4">
              <a
                href="#privacy"
                className="px-5 py-2.5 border border-white/20 text-white/70 text-[10px] font-mono uppercase tracking-widest hover:border-white hover:text-white hover:bg-white/5 transition-all duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="#terms"
                className="px-5 py-2.5 border border-white/20 text-white/70 text-[10px] font-mono uppercase tracking-widest hover:border-white hover:text-white hover:bg-white/5 transition-all duration-300"
              >
                Terms of Service
              </a>
            </div>
          </Reveal>
        </div>
      </AnimatedSection>

      {/* Last Updated */}
      <div className="bg-black/[0.02] border-b border-black/5 px-6 py-4">
        <div className="max-w-7xl mx-auto text-[10px] font-mono tracking-widest text-black/65 uppercase">
          Last Updated: August 2026 &nbsp;·&nbsp; Jurisdiction: Dubai, UAE
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* ─── PRIVACY POLICY ─── */}
        <Reveal y={12}>
          <div className="mb-4">
            <div className="text-[10px] font-mono tracking-[0.3em] text-black/60 uppercase mb-16 flex items-center gap-4">
              <span className="h-px flex-1 bg-black/10" />
              SECTION I — PRIVACY POLICY
              <span className="h-px flex-1 bg-black/10" />
            </div>
          </div>
        </Reveal>

        <Section id="privacy" eyebrow="01 · Overview" title="Privacy Policy">
          <p>
            Exvorta ("we", "our", "us") is committed to protecting the privacy of our clients, prospects, and website visitors. This Privacy Policy explains what information we collect, how we use it, and what rights you have regarding your data.
          </p>
          <p>
            By accessing our website or engaging our services, you agree to the collection and use of information in accordance with this policy. We do not sell your personal data to third parties.
          </p>
        </Section>

        <Section id="privacy-data" eyebrow="02 · Data Collection" title="Information We Collect">
          <p>We may collect the following categories of personal information:</p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong className="text-black/80">Contact Information</strong> — Name, email address, phone number, and company name provided via the RFQ or contact form.</li>
            <li><strong className="text-black/80">Usage Data</strong> — Anonymous analytics about how you interact with our website (pages visited, session duration, browser type).</li>
            <li><strong className="text-black/80">Business Information</strong> — Details about your trading operations, shipment volumes, or infrastructure needs you choose to share during a consultation.</li>
          </ul>
        </Section>

        <Section id="privacy-use" eyebrow="03 · Data Use" title="How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Respond to proposal requests and client inquiries</li>
            <li>Deliver project deliverables and ongoing support</li>
            <li>Improve our website and services</li>
            <li>Send relevant industry insights (only with your consent)</li>
            <li>Meet legal obligations and enforce our agreements</li>
          </ul>
        </Section>

        <Section id="privacy-retention" eyebrow="04 · Retention & Security" title="Data Retention & Security">
          <p>
            We retain personal data only for as long as necessary to fulfil the purposes outlined above or as required by law. We implement industry-standard security measures to protect your data from unauthorised access, disclosure, or destruction.
          </p>
          <p>
            All client portal access is protected via encrypted authentication. Proposal submissions are transmitted over TLS-encrypted connections.
          </p>
        </Section>

        <Section id="privacy-rights" eyebrow="05 · Your Rights" title="Your Data Rights">
          <p>You have the right to:</p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Request access to the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data (right to be forgotten)</li>
            <li>Withdraw consent for communications at any time</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{' '}
            <a href="mailto:legal@exvorta.com" className="underline text-black/80 hover:text-black transition-colors">
              legal@exvorta.com
            </a>
            . We will respond within 30 days.
          </p>
        </Section>

        {/* ─── TERMS OF SERVICE ─── */}
        <Reveal y={12}>
          <div className="mt-16 mb-4">
            <div className="text-[10px] font-mono tracking-[0.3em] text-black/60 uppercase mb-16 flex items-center gap-4">
              <span className="h-px flex-1 bg-black/10" />
              SECTION II — TERMS OF SERVICE
              <span className="h-px flex-1 bg-black/10" />
            </div>
          </div>
        </Reveal>

        <Section id="terms" eyebrow="01 · Agreement" title="Terms of Service">
          <p>
            These Terms of Service govern your use of the Exvorta website and any services we provide. By engaging with Exvorta, you confirm you are authorised to enter into a binding agreement on behalf of yourself or your organisation.
          </p>
          <p>
            We reserve the right to update these terms. Continued use of our services after any changes constitutes your acceptance of the updated terms.
          </p>
        </Section>

        <Section id="terms-services" eyebrow="02 · Services" title="Scope of Services">
          <p>
            Exvorta provides digital infrastructure design, development, and consulting services for global trading companies. All deliverables, timelines, and specifications are defined in individual project agreements (SOW) executed between Exvorta and the client.
          </p>
          <p>
            Nothing on this website constitutes a binding offer of services. Engagement commences only upon execution of a signed project agreement.
          </p>
        </Section>

        <Section id="terms-ip" eyebrow="03 · Intellectual Property" title="Intellectual Property">
          <p>
            Unless otherwise agreed in a project agreement, all creative work, code, and assets produced by Exvorta become the property of the client upon full payment. Exvorta retains the right to showcase completed work in our portfolio unless the client requests confidentiality in writing.
          </p>
          <p>
            Exvorta&apos;s brand assets, website design, and proprietary frameworks remain the exclusive intellectual property of Exvorta.
          </p>
        </Section>

        <Section id="terms-liability" eyebrow="04 · Liability" title="Limitation of Liability">
          <p>
            To the maximum extent permitted by applicable law, Exvorta shall not be liable for any indirect, incidental, consequential, or punitive damages arising from the use of our services or website. Our total liability shall not exceed the fees paid by the client for the specific service giving rise to the claim.
          </p>
        </Section>

        <Section id="terms-governing" eyebrow="05 · Governing Law" title="Governing Law">
          <p>
            These Terms are governed by the laws of the Dubai International Financial Centre (DIFC), United Arab Emirates. Any disputes shall be resolved through the DIFC Courts or via mutually agreed arbitration.
          </p>
        </Section>

        {/* Contact CTA */}
        <section className="py-20 border-t border-black/10 mt-8">
          <Reveal y={16}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div>
                <h3 className="text-xl font-serif font-semibold text-black mb-2">Have a legal question?</h3>
                <p className="text-sm text-black/50">Our team responds within one business day.</p>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="mailto:legal@exvorta.com"
                  className="px-8 py-4 bg-black text-white text-[10px] font-mono uppercase tracking-[0.2em] hover:bg-gray-900 hover:-translate-y-0.5 transition-all duration-300"
                >
                  [ EMAIL US ]
                </a>
                <Link
                  href="/rfq"
                  className="px-8 py-4 border border-black text-black text-[10px] font-mono uppercase tracking-[0.2em] hover:bg-black hover:text-white hover:-translate-y-0.5 transition-all duration-300"
                >
                  [ REQUEST PROPOSAL ]
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  )
}
