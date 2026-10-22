import React from 'react'
import type { Metadata } from 'next'
import Link from '@/components/ui/AppLink'
import { AnimatedSection, Reveal } from '@/components/ui/Reveal'

export const metadata: Metadata = {
  title: 'Legal | Exvorta',
  description: 'Privacy Policy and Terms of Service for Exvorta — the definitive digital infrastructure firm for elite global traders.',
}

interface LegalSection {
  id: string
  /** Blueprint label above the section title ("Overview", "Data Collection"…). */
  label: string
  title: string
  body: React.ReactNode
}

interface LegalDocument {
  id: string
  numeral: string
  name: string
  sections: LegalSection[]
}

const strong = 'font-medium text-obsidian'
const link =
  'text-obsidian underline decoration-rule-strong underline-offset-4 transition-colors hover:decoration-obsidian'

const DOCUMENTS: LegalDocument[] = [
  {
    id: 'privacy',
    numeral: 'I',
    name: 'Privacy Policy',
    sections: [
      {
        id: 'privacy-overview',
        label: 'Overview',
        title: 'Privacy Policy',
        body: (
          <>
            <p>
              Exvorta (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting the privacy of our clients, prospects, and website visitors. This Privacy Policy explains what information we collect, how we use it, and what rights you have regarding your data.
            </p>
            <p>
              By accessing our website or engaging our services, you agree to the collection and use of information in accordance with this policy. We do not sell your personal data to third parties.
            </p>
          </>
        ),
      },
      {
        id: 'privacy-data',
        label: 'Data Collection',
        title: 'Information We Collect',
        body: (
          <>
            <p>We may collect the following categories of personal information:</p>
            <ul>
              <li><strong className={strong}>Contact Information</strong> — Name, email address, phone number, and company name provided via the RFQ or contact form.</li>
              <li><strong className={strong}>Usage Data</strong> — Anonymous analytics about how you interact with our website (pages visited, session duration, browser type).</li>
              <li><strong className={strong}>Business Information</strong> — Details about your trading operations, shipment volumes, or infrastructure needs you choose to share during a consultation.</li>
            </ul>
          </>
        ),
      },
      {
        id: 'privacy-use',
        label: 'Data Use',
        title: 'How We Use Your Information',
        body: (
          <>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Respond to proposal requests and client inquiries</li>
              <li>Deliver project deliverables and ongoing support</li>
              <li>Improve our website and services</li>
              <li>Send relevant industry insights (only with your consent)</li>
              <li>Meet legal obligations and enforce our agreements</li>
            </ul>
          </>
        ),
      },
      {
        id: 'privacy-retention',
        label: 'Retention & Security',
        title: 'Data Retention & Security',
        body: (
          <>
            <p>
              We retain personal data only for as long as necessary to fulfil the purposes outlined above or as required by law. We implement industry-standard security measures to protect your data from unauthorised access, disclosure, or destruction.
            </p>
            <p>
              All client portal access is protected via encrypted authentication. Proposal submissions are transmitted over TLS-encrypted connections.
            </p>
          </>
        ),
      },
      {
        id: 'privacy-rights',
        label: 'Your Rights',
        title: 'Your Data Rights',
        body: (
          <>
            <p>You have the right to:</p>
            <ul>
              <li>Request access to the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data (right to be forgotten)</li>
              <li>Withdraw consent for communications at any time</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at{' '}
              <a href="mailto:legal@exvorta.com" className={link}>
                legal@exvorta.com
              </a>
              . We will respond within 30 days.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: 'terms',
    numeral: 'II',
    name: 'Terms of Service',
    sections: [
      {
        id: 'terms-agreement',
        label: 'Agreement',
        title: 'Terms of Service',
        body: (
          <>
            <p>
              These Terms of Service govern your use of the Exvorta website and any services we provide. By engaging with Exvorta, you confirm you are authorised to enter into a binding agreement on behalf of yourself or your organisation.
            </p>
            <p>
              We reserve the right to update these terms. Continued use of our services after any changes constitutes your acceptance of the updated terms.
            </p>
          </>
        ),
      },
      {
        id: 'terms-services',
        label: 'Services',
        title: 'Scope of Services',
        body: (
          <>
            <p>
              Exvorta provides digital infrastructure design, development, and consulting services for global trading companies. All deliverables, timelines, and specifications are defined in individual project agreements (SOW) executed between Exvorta and the client.
            </p>
            <p>
              Nothing on this website constitutes a binding offer of services. Engagement commences only upon execution of a signed project agreement.
            </p>
          </>
        ),
      },
      {
        id: 'terms-ip',
        label: 'Intellectual Property',
        title: 'Intellectual Property',
        body: (
          <>
            <p>
              Unless otherwise agreed in a project agreement, all creative work, code, and assets produced by Exvorta become the property of the client upon full payment. Exvorta retains the right to showcase completed work in our portfolio unless the client requests confidentiality in writing.
            </p>
            <p>
              Exvorta&apos;s brand assets, website design, and proprietary frameworks remain the exclusive intellectual property of Exvorta.
            </p>
          </>
        ),
      },
      {
        id: 'terms-liability',
        label: 'Liability',
        title: 'Limitation of Liability',
        body: (
          <p>
            To the maximum extent permitted by applicable law, Exvorta shall not be liable for any indirect, incidental, consequential, or punitive damages arising from the use of our services or website. Our total liability shall not exceed the fees paid by the client for the specific service giving rise to the claim.
          </p>
        ),
      },
      {
        id: 'terms-governing',
        label: 'Governing Law',
        title: 'Governing Law',
        body: (
          <p>
            These Terms are governed by the laws of the Dubai International Financial Centre (DIFC), United Arab Emirates. Any disputes shall be resolved through the DIFC Courts or via mutually agreed arbitration.
          </p>
        ),
      },
    ],
  },
]

const pad = (n: number) => String(n).padStart(2, '0')

export default function LegalPage() {
  return (
    <div className="w-full bg-cream">
      {/* Hero */}
      <AnimatedSection className="on-dark relative isolate w-full overflow-hidden bg-obsidian pb-20 pt-36 md:pb-24 md:pt-44">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-aura-dark absolute inset-0" />
          <div className="bg-blueprint-grid-dark absolute inset-0" />
        </div>
        <div className="container-site">
          <p className="eyebrow eyebrow-dark rise mb-8">
            <span className="eyebrow-index" aria-hidden>
              <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
            </span>
            Legal framework
          </p>
          <h1 className="rise mb-6 max-w-4xl font-serif text-display font-semibold text-white" style={{ '--i': 1 } as React.CSSProperties}>
            Privacy &amp; Legal
          </h1>
          <p className="rise mb-12 max-w-2xl text-lede font-light text-muted-dark" style={{ '--i': 2 } as React.CSSProperties}>
            We operate with institutional-grade transparency. These documents govern your relationship with Exvorta and how we handle your data.
          </p>
          <Reveal delay={0.25} y={12}>
            <div className="flex flex-wrap gap-3">
              {DOCUMENTS.map((doc) => (
                <a key={doc.id} href={`#${doc.id}`} className="btn-mono">
                  {doc.name}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </AnimatedSection>

      {/* Document ledger strip */}
      <div className="border-b border-rule bg-surface">
        <div className="container-site flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-4">
          <p className="eyebrow">Last updated: August 2026</p>
          <p className="eyebrow">Jurisdiction: Dubai, UAE</p>
        </div>
      </div>

      <div className="container-site grid grid-cols-1 gap-x-16 py-16 md:py-24 lg:grid-cols-[15rem_minmax(0,1fr)]">
        {/* Sticky index — desktop only; the jump links above cover mobile */}
        <aside className="hidden lg:block" aria-label="On this page">
          <nav className="sticky top-28 space-y-10">
            {DOCUMENTS.map((doc) => (
              <div key={doc.id}>
                <a href={`#${doc.id}`} className="eyebrow mb-4 transition-colors hover:text-obsidian">
                  <span className="eyebrow-index">{doc.numeral}</span>
                  {doc.name}
                </a>
                <ol className="border-s border-rule">
                  {doc.sections.map((section, i) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="-ms-px flex items-baseline gap-3 border-s border-transparent py-2 ps-4 text-sm text-muted transition-colors hover:border-obsidian hover:text-obsidian"
                      >
                        <span className="font-mono text-label text-emerald">{pad(i + 1)}</span>
                        {section.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 max-w-2xl">
          {DOCUMENTS.map((doc, docIndex) => (
            <div key={doc.id} id={doc.id} className={`scroll-mt-28 ${docIndex > 0 ? 'mt-20 md:mt-28' : ''}`}>
              <Reveal y={12}>
                <p className="eyebrow mb-2 flex items-center gap-4">
                  <span className="eyebrow-index">{doc.numeral}</span>
                  Document — {doc.name}
                  <span aria-hidden className="h-px flex-1 bg-rule" />
                </p>
              </Reveal>

              {doc.sections.map((section, i) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28 border-b border-rule py-12 last:border-b-0"
                >
                  <Reveal y={16}>
                    <p className="eyebrow mb-4">
                      <span className="text-emerald">{pad(i + 1)}</span>
                      {section.label}
                    </p>
                    <h2 className="mb-6 font-serif text-title font-semibold text-obsidian">{section.title}</h2>
                  </Reveal>
                  <Reveal delay={0.1} y={16}>
                    <div className="space-y-4 text-base font-light leading-relaxed text-muted [&_li]:ps-1 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:ps-6 [&_ul]:marker:text-emerald">
                      {section.body}
                    </div>
                  </Reveal>
                </section>
              ))}
            </div>
          ))}

          {/* Contact */}
          <section className="mt-8 border-t border-rule pt-14">
            <Reveal y={16}>
              <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
                <div>
                  <h3 className="mb-2 font-serif text-title font-semibold text-obsidian">Have a legal question?</h3>
                  <p className="text-base font-light text-muted">Our team responds within one business day.</p>
                </div>
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  <a href="mailto:legal@exvorta.com" className="btn-primary min-h-[52px] px-8 py-4">
                    [ EMAIL US ]
                  </a>
                  <Link href="/rfq" className="btn-ghost min-h-[52px] px-8 py-4">
                    [ REQUEST PROPOSAL ]
                  </Link>
                </div>
              </div>
            </Reveal>
          </section>
        </div>
      </div>
    </div>
  )
}
