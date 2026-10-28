import React from 'react'
import type { Metadata } from 'next'
import Link from '@/components/ui/AppLink'
import { CopyButton } from './CopyButton'
import { LiveEmbedPreview } from './LiveEmbedPreview'

export const metadata: Metadata = {
  title: 'Agency Deliverable: Embeddable RFQ Widget | Exvorta',
  description:
    'Integration guide and documentation for agency partners deploying Exvorta embeddable export RFQ cart widgets on client websites.',
}

const CATALOG_JSON_EXAMPLE = `{
  "slug": "example",
  "name": "Standard Export Catalog",
  "products": [
    {
      "id": "prod-1",
      "name": "Refined Sunflower Oil",
      "unit": "MT",
      "moq": 20
    },
    {
      "id": "prod-2",
      "name": "Organic Wheat Flour",
      "unit": "MT",
      "moq": 50
    },
    {
      "id": "prod-3",
      "name": "White Cane Sugar ICUMSA 45",
      "unit": "MT",
      "moq": 100
    }
  ]
}`

const IFRAME_SNIPPET = `<iframe src="https://exvorta.com/rfq/embed?catalog=<slug>" width="100%" frameborder="0" id="exvorta-rfq-cart" style="border:none;width:100%;min-height:500px;overflow:hidden;"></iframe>`

const RESIZE_SCRIPT_SNIPPET = `window.addEventListener('message', (event) => {
  if (event.data?.type === 'rfq-embed-resize' && typeof event.data.height === 'number') {
    const iframe = document.getElementById('exvorta-rfq-cart');
    if (iframe) iframe.style.height = \`\${event.data.height}px\`;
  }
});`

const COMPLETE_INTEGRATION_SNIPPET = `<!-- Exvorta RFQ Cart Widget Embed -->
<iframe
  src="https://exvorta.com/rfq/embed?catalog=example"
  width="100%"
  frameborder="0"
  id="exvorta-rfq-cart"
  style="border:none;width:100%;min-height:500px;overflow:hidden;"
></iframe>

<script>
  window.addEventListener('message', function (event) {
    if (event.data && event.data.type === 'rfq-embed-resize' && typeof event.data.height === 'number') {
      var iframe = document.getElementById('exvorta-rfq-cart');
      if (iframe) {
        iframe.style.height = event.data.height + 'px';
      }
    }
  });
</script>`

export default function ForAgenciesPage() {
  return (
    <div className="w-full bg-cream text-obsidian min-h-screen">
      {/* ─── Hero Section ──────────────────────────────────────────────────────── */}
      <section className="relative w-full border-b border-rule pt-[calc(var(--header-h)+2.5rem)] pb-16 md:pb-24 overflow-hidden">
        {/* Subtle grid pattern background */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-blueprint-grid opacity-60" />

        <div className="container-site">
          <div className="max-w-4xl text-start">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted border border-rule px-3 py-1 bg-surface mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald" />
              <span>Agency Partner Documentation</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-semibold text-obsidian tracking-tight leading-[1.1] mb-6">
              The Standard Agency Deliverable
            </h1>

            <p className="font-sans text-lg sm:text-xl text-obsidian/85 font-medium leading-relaxed mb-6">
              Deliver a high-converting, export-grade RFQ cart widget to your clients in minutes.
            </p>

            <p className="font-sans text-sm sm:text-base text-muted leading-relaxed max-w-3xl">
              Web development, digital marketing, and trade consultancy agencies can now deploy a fully managed export
              catalog and RFQ capture system without provisioning databases, building custom checkout flows, or maintaining
              complex backend infrastructure. Client websites receive a lightweight, responsive cart that channels verified,
              institutional trade leads straight into Exvorta&apos;s trade pipeline.
            </p>

            {/* Spec Bar */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-rule font-mono text-[11px] text-muted">
              <div>
                <span className="block text-obsidian font-semibold uppercase tracking-wider">Format</span>
                <span>Zero-Dependency Iframe</span>
              </div>
              <div>
                <span className="block text-obsidian font-semibold uppercase tracking-wider">Setup Time</span>
                <span>&lt; 15 Minutes</span>
              </div>
              <div>
                <span className="block text-obsidian font-semibold uppercase tracking-wider">Height Sync</span>
                <span>postMessage API</span>
              </div>
              <div>
                <span className="block text-obsidian font-semibold uppercase tracking-wider">Bot Defense</span>
                <span>Cloudflare Turnstile</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Feature Overview: What the Client Gets ───────────────────────────── */}
      <section className="py-16 md:py-24 border-b border-rule">
        <div className="container-site">
          <div className="text-start mb-12">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted mb-2">
              <span className="eyebrow-index">01</span>
              <span>Deliverable Scope</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-semibold text-obsidian">
              What the Client Gets
            </h2>
            <p className="font-sans text-sm sm:text-base text-muted mt-2 max-w-2xl">
              Everything your export clients require to capture serious international buyers without technical overhead.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="bg-surface border border-rule p-6 sm:p-8 space-y-4 hover:border-rule-strong transition-colors text-start">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-widest text-emerald font-semibold">
                  [ 01.1 / CART ENGINE ]
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald/60" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-obsidian">
                Standalone Embeddable Cart &amp; MOQ Enforcement
              </h3>
              <p className="font-sans text-sm text-muted leading-relaxed">
                Interactive itemized quantity pickers with strict Minimum Order Quantity (MOQ) enforcement and live item
                counters. Protects client sales reps from low-volume, unqualified retail inquiries by ensuring only commercial-scale
                volume requests pass through.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-surface border border-rule p-6 sm:p-8 space-y-4 hover:border-rule-strong transition-colors text-start">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-widest text-emerald font-semibold">
                  [ 01.2 / TRADE TERMS ]
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald/60" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-obsidian">
                Built-in International Trade Terms
              </h3>
              <p className="font-sans text-sm text-muted leading-relaxed">
                Full Incoterms selector (FOB, CIF, CFR, EXW, DAP, DDP, CIP, FCA) coupled with destination port and discharge
                terminal capture. Gathers all operational freight parameters on initial inquiry, cutting weeks of back-and-forth email clarification.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-surface border border-rule p-6 sm:p-8 space-y-4 hover:border-rule-strong transition-colors text-start">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-widest text-emerald font-semibold">
                  [ 01.3 / VERIFIED INGESTION ]
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald/60" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-obsidian">
                Automatic Lead Routing &amp; Verification
              </h3>
              <p className="font-sans text-sm text-muted leading-relaxed">
                Submissions route directly into Exvorta&apos;s verified lead management pipeline. Every inquiry is verified through
                Cloudflare Turnstile token validation and honeypot traps, timestamped, and immediately channeled to designated trade logistics officers.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-surface border border-rule p-6 sm:p-8 space-y-4 hover:border-rule-strong transition-colors text-start">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-widest text-emerald font-semibold">
                  [ 01.4 / DESIGN HARMONY ]
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald/60" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-obsidian">
                Zero-Maintenance Institutional Styling
              </h3>
              <p className="font-sans text-sm text-muted leading-relaxed">
                Engineered exclusively with Exvorta&apos;s &ldquo;Institutional Elite&rdquo; design tokens: Swiss-minimalist typography,
                warm cream background, crisp obsidian elements, and subtle hairlines. Elevates client brand authority across Webflow,
                WordPress, Shopify, or static HTML.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Step 1: Catalog Schema Specification ─────────────────────────────── */}
      <section className="py-16 md:py-24 border-b border-rule">
        <div className="container-site">
          <div className="max-w-4xl text-start">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted mb-2">
              <span className="eyebrow-index">02</span>
              <span>Step 1: Catalog Definition</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-semibold text-obsidian">
              Catalog Schema Specification
            </h2>
            <p className="font-sans text-sm sm:text-base text-muted mt-2 mb-8">
              Each client catalog is defined as a lightweight JSON document hosted at{' '}
              <code className="font-mono text-xs px-2 py-0.5 bg-surface border border-rule text-obsidian">
                public/rfq-catalogs/&lt;slug&gt;.json
              </code>
              . The widget fetches this file dynamically using the <code className="font-mono text-xs px-1.5 py-0.5 bg-surface border border-rule">?catalog=&lt;slug&gt;</code> query parameter.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Code Snippet Box */}
            <div className="lg:col-span-7 bg-surface border border-rule overflow-hidden">
              <div className="px-4 py-3 bg-surface-2 border-b border-rule flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs text-obsidian font-medium">
                  <span className="text-emerald">●</span>
                  <span>public/rfq-catalogs/example.json</span>
                </div>
                <CopyButton text={CATALOG_JSON_EXAMPLE} label="Copy JSON" />
              </div>

              <div dir="ltr" className="p-4 sm:p-6 bg-surface overflow-x-auto text-start">
                <pre className="font-mono text-xs leading-relaxed text-obsidian">
                  <code>{CATALOG_JSON_EXAMPLE}</code>
                </pre>
              </div>
            </div>

            {/* Field Breakdown & Constraints */}
            <div className="lg:col-span-5 space-y-4 text-start">
              <div className="bg-surface border border-rule p-5 sm:p-6 space-y-3">
                <h3 className="font-mono text-xs uppercase tracking-widest font-semibold text-obsidian border-b border-rule pb-2">
                  Schema Fields &amp; Constraints
                </h3>
                <dl className="space-y-4 text-xs font-sans">
                  <div>
                    <dt className="font-mono font-semibold text-obsidian">
                      slug <span className="text-muted font-normal">(string, required)</span>
                    </dt>
                    <dd className="text-muted mt-0.5">
                      Unique alphanumeric identifier matching the filename without extension (e.g. <code className="font-mono text-[11px]">&quot;example&quot;</code> for <code className="font-mono text-[11px]">example.json</code>).
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono font-semibold text-obsidian">
                      name <span className="text-muted font-normal">(string, required)</span>
                    </dt>
                    <dd className="text-muted mt-0.5">
                      Display title rendered prominently in the RFQ widget header (e.g. <code className="font-mono text-[11px]">&quot;Standard Export Catalog&quot;</code>).
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono font-semibold text-obsidian">
                      products <span className="text-muted font-normal">(array, required)</span>
                    </dt>
                    <dd className="text-muted mt-0.5">
                      List of product items. Each item must specify:
                      <ul className="list-disc list-inside mt-1.5 space-y-1 text-muted">
                        <li><code className="font-mono text-[11px]">id</code>: SKU or line item code.</li>
                        <li><code className="font-mono text-[11px]">name</code>: Commercial product name.</li>
                        <li><code className="font-mono text-[11px]">unit</code>: Measurement unit code.</li>
                        <li><code className="font-mono text-[11px]">moq</code>: Minimum order quantity.</li>
                      </ul>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Validation Notes */}
              <div className="bg-surface border border-rule p-5 sm:p-6 space-y-2">
                <span className="font-mono text-[11px] uppercase tracking-widest text-emerald font-semibold block">
                  [ Enforcement Rules ]
                </span>
                <p className="font-sans text-xs text-muted leading-relaxed">
                  <strong>MOQ Enforcement:</strong> When a user starts incrementing from 0, the stepper automatically jumps to the defined <code className="font-mono text-[11px]">moq</code>. Form submission blocks any selected product quantity strictly below its MOQ threshold.
                </p>
                <p className="font-sans text-xs text-muted leading-relaxed pt-1">
                  <strong>Standard Unit Codes:</strong> Recommended commercial units include <code className="font-mono text-[11px]">MT</code> (Metric Ton), <code className="font-mono text-[11px]">KG</code> (Kilogram), <code className="font-mono text-[11px]">BBL</code> (Barrel), <code className="font-mono text-[11px]">DRUM</code>, or <code className="font-mono text-[11px]">FCL</code>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Step 2: Embed Code & Iframe Integration ──────────────────────────── */}
      <section className="py-16 md:py-24 border-b border-rule">
        <div className="container-site">
          <div className="max-w-4xl text-start">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted mb-2">
              <span className="eyebrow-index">03</span>
              <span>Step 2: Integration</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-semibold text-obsidian">
              Embed Code &amp; Iframe Integration
            </h2>
            <p className="font-sans text-sm sm:text-base text-muted mt-2 mb-8">
              Agencies can place the RFQ widget into any client CMS or website builder using a standard iframe tag.
              Replace <code className="font-mono text-xs px-1.5 py-0.5 bg-surface border border-rule text-obsidian">&lt;slug&gt;</code> with your client&apos;s catalog identifier (e.g., <code className="font-mono text-xs text-obsidian">?catalog=agro-export</code>).
            </p>
          </div>

          <div className="space-y-6">
            {/* Standard Iframe Snippet */}
            <div className="bg-surface border border-rule overflow-hidden">
              <div className="px-4 py-3 bg-surface-2 border-b border-rule flex items-center justify-between">
                <span className="font-mono text-xs text-obsidian font-medium">Standard Iframe Snippet</span>
                <CopyButton text={IFRAME_SNIPPET} label="Copy Iframe" />
              </div>
              <div dir="ltr" className="p-4 sm:p-6 bg-surface overflow-x-auto text-start">
                <pre className="font-mono text-xs leading-relaxed text-obsidian whitespace-pre-wrap break-all">
                  <code>{IFRAME_SNIPPET}</code>
                </pre>
              </div>
            </div>

            {/* CMS Deployment Quick Reference */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-start">
              <div className="p-4 bg-surface border border-rule space-y-2">
                <span className="font-mono text-[10px] text-muted uppercase tracking-widest block">[ Webflow ]</span>
                <h4 className="font-serif text-sm font-semibold text-obsidian">Custom Code Embed</h4>
                <p className="text-xs text-muted leading-relaxed">
                  Drag an Embed element onto the page and paste the iframe snippet and resize script inside.
                </p>
              </div>

              <div className="p-4 bg-surface border border-rule space-y-2">
                <span className="font-mono text-[10px] text-muted uppercase tracking-widest block">[ WordPress ]</span>
                <h4 className="font-serif text-sm font-semibold text-obsidian">Custom HTML Block</h4>
                <p className="text-xs text-muted leading-relaxed">
                  Insert a Custom HTML block in Gutenberg or Elementor to render the cart directly into wholesale landing pages.
                </p>
              </div>

              <div className="p-4 bg-surface border border-rule space-y-2">
                <span className="font-mono text-[10px] text-muted uppercase tracking-widest block">[ Shopify ]</span>
                <h4 className="font-serif text-sm font-semibold text-obsidian">Liquid Section</h4>
                <p className="text-xs text-muted leading-relaxed">
                  Drop into a custom Liquid section on B2B or wholesale catalog pages without impacting storefront assets.
                </p>
              </div>

              <div className="p-4 bg-surface border border-rule space-y-2">
                <span className="font-mono text-[10px] text-muted uppercase tracking-widest block">[ React / Next.js ]</span>
                <h4 className="font-serif text-sm font-semibold text-obsidian">Component Embed</h4>
                <p className="text-xs text-muted leading-relaxed">
                  Render via standard <code className="font-mono text-[11px]">&lt;iframe&gt;</code> element with an attached window event listener in a <code className="font-mono text-[11px]">useEffect</code>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Step 3: Responsive Height Adjustment (postMessage API) ───────────── */}
      <section className="py-16 md:py-24 border-b border-rule">
        <div className="container-site">
          <div className="max-w-4xl text-start">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted mb-2">
              <span className="eyebrow-index">04</span>
              <span>Step 3: Responsive Protocol</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-semibold text-obsidian">
              Responsive Height Adjustment (postMessage API)
            </h2>
            <p className="font-sans text-sm sm:text-base text-muted mt-2 mb-8">
              To eliminate ugly double scrollbars and maintain clean responsive flow on mobile viewports, the embedded widget communicates its active rendered height to the host website via HTML5 <code className="font-mono text-xs px-1.5 py-0.5 bg-surface border border-rule text-obsidian">postMessage</code>.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Script Box */}
            <div className="lg:col-span-7 bg-surface border border-rule overflow-hidden">
              <div className="px-4 py-3 bg-surface-2 border-b border-rule flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs text-obsidian font-medium">
                  <span className="text-emerald">●</span>
                  <span>Host Page Resize Script (Vanilla JS)</span>
                </div>
                <CopyButton text={RESIZE_SCRIPT_SNIPPET} label="Copy Script" />
              </div>

              <div dir="ltr" className="p-4 sm:p-6 bg-surface overflow-x-auto text-start">
                <pre className="font-mono text-xs leading-relaxed text-obsidian">
                  <code>{RESIZE_SCRIPT_SNIPPET}</code>
                </pre>
              </div>
            </div>

            {/* Protocol Explanation */}
            <div className="lg:col-span-5 bg-surface border border-rule p-6 space-y-4 text-start">
              <span className="font-mono text-[11px] uppercase tracking-widest text-emerald font-semibold block">
                [ Protocol Specification ]
              </span>
              <h3 className="font-serif text-lg font-semibold text-obsidian">
                How It Works
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Whenever the widget mounts, completes catalog retrieval, updates quantity values, expands validation errors, or transitions to the success confirmation state, it invokes:
              </p>
              <div dir="ltr" className="p-3 bg-surface-2 border border-rule font-mono text-[11px] text-obsidian">
                window.parent.postMessage(&#123; type: &apos;rfq-embed-resize&apos;, height: document.documentElement.scrollHeight &#125;, &apos;*&apos;)
              </div>
              <ul className="text-xs text-muted space-y-2 list-disc list-inside">
                <li>Matches target iframe via <code className="font-mono text-[11px]">id=&quot;exvorta-rfq-cart&quot;</code>.</li>
                <li>Updates iframe pixel height instantaneously without lag.</li>
                <li>Zero dependencies required on the host page.</li>
              </ul>
            </div>
          </div>

          {/* Complete All-in-One Snippet */}
          <div className="mt-8 bg-surface border border-rule overflow-hidden">
            <div className="px-4 py-3 bg-surface-2 border-b border-rule flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs text-obsidian font-medium">
                <span>All-in-One Integration Snippet (Iframe + Script)</span>
              </div>
              <CopyButton text={COMPLETE_INTEGRATION_SNIPPET} label="Copy Complete Snippet" />
            </div>
            <div dir="ltr" className="p-4 sm:p-6 bg-surface overflow-x-auto text-start">
              <pre className="font-mono text-xs leading-relaxed text-obsidian">
                <code>{COMPLETE_INTEGRATION_SNIPPET}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Step 4: Quality & Hand-off Checklist ──────────────────────────────── */}
      <section className="py-16 md:py-24 border-b border-rule">
        <div className="container-site">
          <div className="max-w-4xl text-start">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted mb-2">
              <span className="eyebrow-index">05</span>
              <span>Step 4: Verification</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-semibold text-obsidian">
              Quality &amp; Hand-off Checklist
            </h2>
            <p className="font-sans text-sm sm:text-base text-muted mt-2 mb-8">
              Verify these four operational checkpoints before handing over the widget deliverable to your client.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-start">
            {/* Check 1 */}
            <div className="bg-surface border border-rule p-6 space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-obsidian font-semibold">
                <span className="w-5 h-5 rounded-full border border-emerald/50 bg-emerald/10 text-emerald flex items-center justify-center text-[10px]">
                  ✓
                </span>
                <span>1. Verify Catalog JSON Endpoint</span>
              </div>
              <p className="text-xs text-muted leading-relaxed ps-7">
                Ensure the JSON file is accessible and properly formatted at{' '}
                <code className="font-mono text-[11px] text-obsidian bg-surface-2 px-1.5 py-0.5 border border-rule">
                  /rfq-catalogs/&lt;slug&gt;.json
                </code>
                . Inspect response status 200, valid JSON syntax, and correct product IDs and MOQ values.
              </p>
            </div>

            {/* Check 2 */}
            <div className="bg-surface border border-rule p-6 space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-obsidian font-semibold">
                <span className="w-5 h-5 rounded-full border border-emerald/50 bg-emerald/10 text-emerald flex items-center justify-center text-[10px]">
                  ✓
                </span>
                <span>2. Test Embed Rendering</span>
              </div>
              <p className="text-xs text-muted leading-relaxed ps-7">
                Load{' '}
                <code className="font-mono text-[11px] text-obsidian bg-surface-2 px-1.5 py-0.5 border border-rule">
                  /rfq/embed?catalog=&lt;slug&gt;
                </code>{' '}
                in a fresh browser tab. Confirm that catalog name, items, unit badges, and Incoterm options render without console errors.
              </p>
            </div>

            {/* Check 3 */}
            <div className="bg-surface border border-rule p-6 space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-obsidian font-semibold">
                <span className="w-5 h-5 rounded-full border border-emerald/50 bg-emerald/10 text-emerald flex items-center justify-center text-[10px]">
                  ✓
                </span>
                <span>3. Verify postMessage Auto-Resize</span>
              </div>
              <p className="text-xs text-muted leading-relaxed ps-7">
                Confirm host website dynamically resizes the iframe as items are selected. Ensure there are zero nested scrollbars on mobile (375px) and desktop (1280px+) screens.
              </p>
            </div>

            {/* Check 4 */}
            <div className="bg-surface border border-rule p-6 space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-obsidian font-semibold">
                <span className="w-5 h-5 rounded-full border border-emerald/50 bg-emerald/10 text-emerald flex items-center justify-center text-[10px]">
                  ✓
                </span>
                <span>4. Submit Test RFQ &amp; Confirm Receipt</span>
              </div>
              <p className="text-xs text-muted leading-relaxed ps-7">
                Execute a test quotation request with sample commercial terms. Confirm the UI renders the{' '}
                <code className="font-mono text-[11px] text-emerald bg-emerald/5 px-1 border border-emerald/20">
                  [ RFQ SUBMISSION CONFIRMED ]
                </code>{' '}
                state and verifies pipeline reception.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Live Test Bench / Preview ────────────────────────────────────────── */}
      <section className="py-16 md:py-24 border-b border-rule bg-surface-2/40">
        <div className="container-site">
          <div className="max-w-4xl text-start mb-8">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted mb-2">
              <span className="eyebrow-index">06</span>
              <span>Interactive Verification Bench</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-semibold text-obsidian">
              Live Widget Test Bench
            </h2>
            <p className="font-sans text-sm sm:text-base text-muted mt-2">
              The live container below is running directly in this page using the exact postMessage height sync script documented above. Test incrementing quantities, selecting Incoterms, and observing the real-time height adaptation.
            </p>
          </div>

          <LiveEmbedPreview />
        </div>
      </section>

      {/* ─── Support & Partner CTA ────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-cream">
        <div className="container-site">
          <div className="bg-surface border border-rule p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8 text-start">
            <div className="space-y-3 max-w-xl">
              <span className="font-mono text-xs uppercase tracking-widest text-emerald font-semibold block">
                [ Agency Technical Support ]
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-obsidian">
                Need custom catalogs or dedicated webhook routing?
              </h3>
              <p className="font-sans text-sm text-muted leading-relaxed">
                Exvorta provides agency partners with dedicated catalog deployment assistance, CRM webhooks, and private white-label routing. Connect with our engineering director.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/contact"
                className="btn-primary px-8 py-3.5 text-center font-mono text-xs uppercase tracking-widest font-bold"
              >
                [ Contact Support ]
              </Link>
              <Link
                href="/rfq"
                className="px-6 py-3.5 border border-rule hover:border-obsidian bg-surface text-obsidian text-center font-mono text-xs uppercase tracking-widest transition-colors"
              >
                [ Request RFQ Platform ]
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
