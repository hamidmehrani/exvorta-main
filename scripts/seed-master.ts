import { loadEnvConfig } from '@next/env'
loadEnvConfig(process.cwd())
import { getPayload } from 'payload'
import configPromise from '../payload.config'

const pagesToSeed: any[] = [
  {
    slug: 'home',
    title: 'Home',
    _status: 'published',
    layout: [
      {
        blockType: 'hero',
        eyebrow: "[ ENGINE V1.0 LIVE ]",
        headline: "Digital Infrastructure\nfor Global Traders",
        subheadline: "The definitive digital foundation for elite importers and exporters. Precision-engineered web presence and automated compliance.",
        primaryCTA: { label: "[ REQUEST PROPOSAL ]", url: "#" },
        showDashboard: true
      },
      {
        blockType: 'featureGrid',
        sectionEyebrow: "Architecture Manifesto",
        sectionTitle: "Built for How Traders Actually Work",
        theme: "light",
        features: [
          { icon: '01', title: "Rapid Bespoke Deployment", description: "High-performance websites delivered in just 2–4 weeks. We leverage advanced coding frameworks and agile team structures to move at the speed of global trade, without ever compromising institutional prestige." },
          { icon: '02', title: "Headless Architecture", description: "Built on modern, scalable infrastructure (Next.js & Edge compute). API-ready designs ensuring your web presence is fast, secure, and globally accessible without legacy constraints." },
          { icon: '03', title: "Absolute Data Sovereignty", description: "Enterprise-grade security protocols standard in every build. We ensure your corporate presence and proprietary intelligence remain strictly confidential and protected." }
        ]
      },
      {
        blockType: 'cta',
        title: "Deals are won before the first meeting.",
        description: "Without a credible digital presence, you are losing deals before the first conversation. Exvorta fixes this.",
        buttonText: "[ GET STARTED ]",
        buttonUrl: "/contact",
      },
      {
        blockType: 'portfolioArchive',
        sectionLabel: "[ OUR INFRASTRUCTURE WORK ]",
        headline: "Proof of Execution.",
        projects: [
          {
            title: 'Spicevo',
            description: 'Certified organic herbs supply chain for European premium markets.',
            industry: 'ORGANIC HERBS',
            volume: '480 MT/YR',
            service: 'WEB DESIGN & CMS',
            linkLabel: 'VIEW CASE STUDY ↗',
            linkUrl: '#',
            imageUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLsluHrudtzDaG50aSD36NdRzN58w6vb8tMpFOdnfIZFgY1dBgREUPWYQlTjj9EbRdLgnplkZYewTF9sMmaeJSXAK3oto-ygLUZfgwWyy7yWx7KwCDhAFMeuV49Vhkho1reIvl0I9GKNryk-9aFBdjJS583MJmCtZCneN1ZtU54xdaArh6k8eLfsYFLn5M0d_X1KdW11WwN2Sz8g_rTEjmd88-HJHGcuK3mzWuDZmmpB05aQ3niGkBjgHbc'
          },
          {
            title: 'Nutave',
            description: 'Precision nut processing and distribution for global wholesale partners.',
            industry: 'PREMIUM NUTS',
            volume: '650 MT/YR',
            service: 'B2B WEB DEVELOPMENT',
            linkLabel: 'VIEW CASE STUDY ↗',
            linkUrl: '#',
            imageUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLu8-HNcmaGLnw2_KpZEj7jBld8fDlt0SdaiSex0wQyclFjJr3_pfzfGiS-UJwjSRGSqNl_XvglFmgNXkjVq7PbaYEfBg2fL6LPYB90N4aqXLpgb5ySkEzz9x0nGed182i___J7x-3lr4QbBY6YPjoZN5Llfc5QRBvPN7Xzt7ND8VcGxX7cmAEfda-xXA8TrxumBKPGKzSQ0LW1LKyfwkmcKjhHXelxyyoy6sPGbvGog1EtVoXTLmwkdW0c'
          },
          {
            title: 'Stonvi',
            description: 'High-end ceramic and stone materials for international architectural projects.',
            industry: 'CERAMICS',
            volume: '2.4M SQM/YR',
            service: 'CORPORATE WEBSITE & CMS',
            linkLabel: 'VIEW CASE STUDY ↗',
            linkUrl: '#',
            imageUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLu2S7JLA2CjBYFpiSTcthdBBImg8NlO3gtp4silpS9I1v5xotd5HAg8Ahc2NhLGqufRvXBAZ5pivolwV24QdbIQ-8hKG-kOVJFkvs3ob81hCSG0Wt1yZ_o1LIN_s0_i37HHWHnnV_z8Jwb82qyWOkodIAJa85QJB8NCmNnHegI9LeTFsAaQBSi7Zjh6PT1YR-kCYbMsx7wjTR5d2RZYF-ebc-TMhnaVA6nQy0ztdzS6II91HHsgpZYiuw8'
          }
        ]
      },
      {
        blockType: 'productShowcase',
        moduleNumber: "01",
        status: "live",
        statusLabel: "COMPLIANCE VERIFIED",
        productName: "Exvorta Docs Section",
        description: "Generate and manage shipping documents.",
        mockupType: "docs",
        theme: "light"
      },
      {
        blockType: 'roadmap',
        title: "The Master Plan: Exvorta Ecosystem",
        description: "We are actively building the definitive, unified operating system for global trade.",
        phases: [
          { label: "[ PHASE 1 ]", title: "Exvorta Track", description: "End-to-end multimodal logistics telemetry and predictive freight visibility." },
          { label: "[ PHASE 2 ]", title: "Exvorta CRM", description: "Trade-specific counterparty risk management and global vendor intelligence." },
          { label: "[ PHASE 3 ]", title: "Exvorta Intel", description: "Proprietary market data, trade flows, and real-time commodities pricing benchmarks." }
        ],
        vision: {
          label: "[ THE VISION ]",
          title: "Exvorta Suite",
          description: "The ultimate convergence. A singular, unified digital infrastructure seamlessly integrating your web presence, automated compliance, logistics, and intelligence into one trade OS."
        },
        buttonLabel: "[ REQUEST EARLY ACCESS ]"
      }
    ]
  },
  {
    slug: 'the-firm',
    title: 'The Firm',
    _status: 'published',
    layout: [
      {
        blockType: 'hero',
        theme: 'firm',
        eyebrow: "[ THE EXVORTA IDENTITY ]",
        headline: "We Engineer Digital Gravity.",
        subheadline: "Exvorta is a boutique digital architecture firm. We exist strictly to close the credibility gap between your monumental physical trading velocity and your online infrastructure.",
        scrollText: "[ DUBAI · GLOBAL REACH ]",
        hideDashboard: true
      },
      {
        blockType: 'thesis',
        eyebrow: "[ THE EXVORTA\nTHESIS ]",
        headline: "The era of the digital brochure is dead. A generic website signals operational weakness to global partners. We engineer assets with a balance sheet impact.",
        paragraphs: [
          { text: "In the high-stakes arena of global trade, your digital footprint is your most heavily scrutinized asset. Before a contract is signed, before a container is shipped, serious buyers verify your credibility online before they ever reach out." },
          { text: "We established Exvorta to provide elite trading firms with digital infrastructure that matches their physical scale. No templates. No shortcuts. Just pure, unadulterated performance architecture." }
        ]
      },
      {
        blockType: 'process',
        variant: 'dark-split',
        eyebrow: "[ HOW WE OPERATE ]",
        headline: "Methodical.\nRelentless.\n<span class=\"text-white/50\">Pure Execution.</span>",
        description: "We do not operate like a traditional agency. We function as an outsourced architectural wing for your trading operations. High velocity, zero friction.",
        steps: [
          { stepNumber: '01', title: "Architectural Precision", description: "We don't guess. We map your entire digital supply chain before writing a single line of code. Every interface is designed to capture tier-one enterprise leads and establish absolute market authority." },
          { stepNumber: '02', title: "Hardcoded Superiority", description: "We bypass bloated content management systems. Our engineers deploy pure, bespoke code directly to the global edge network. The result is elite security standards and sub-second load times on any device, anywhere." },
          { stepNumber: '03', title: "Dedicated Ongoing Support", description: "Deployment is a baseline, not a finish line. We handle your entire digital infrastructure maintenance, updates, and scaling, so you stay focused on your business, not your website." }
        ]
      },
      {
        blockType: 'founder',
        eyebrow: "[ 04. THE FOUNDER ]",
        name: "Hamid Mehrani",
        roleTitle: "HAMID MEHRANI",
        roleCompany: "PRINCIPAL ARCHITECT, EXVORTA",
        bio: "Based in Dubai. Background in digital engineering and international trade operations. Founded Exvorta to bridge the credibility gap facing global trading firms.",
        quote: "\"Architecture is not just visual; it is a balance sheet asset. We engineer digital gravity for the world's most demanding trade entities.\"",
        imageSrc: "/images/founder.jpg"
      },
      {
        blockType: 'featureGrid',
        theme: 'dark-principles',
        sectionEyebrow: "[ THE EXVORTA STANDARD ]",
        sectionTitle: "Our Operating Principles.",
        features: [
          { title: "Zero Bloat Architecture.", description: "We categorically reject templates and heavy content management systems. Every line of code is written specifically for your entity, ensuring strong security standards and fast load times on any device." },
          { title: "Institutional Authority.", description: "Design is not decoration; it is a mechanism for trust. We apply elite, bespoke UI/UX architecture so your digital presence instantly matches the scale of your global operations." },
          { title: "Absolute Discretion.", description: "We operate under strict Non-Disclosure Agreements. Your digital infrastructure, competitive data, and market strategies are treated as confidential business assets." },
          { title: "Dedicated Partnership", description: "Deployment is just the beginning. We remain available for updates, adjustments, and ongoing improvements as your business grows." }
        ]
      },
      {
        blockType: 'featureGrid',
        theme: 'light-columns',
        sectionEyebrow: "[ GLOBAL EDGE INFRASTRUCTURE ]",
        sectionTitle: "Built for Global Reach.",
        features: [
          { eyebrow: "[ MENA & Gulf ]", title: "MENA & Gulf", description: "Serving sovereign wealth funds and energy trade entities across the GCC." },
          { eyebrow: "[ Europe & UK ]", title: "Europe & UK", description: "Powering high-frequency trade desks in Mayfair, Geneva, and Frankfurt." },
          { eyebrow: "[ Asia Pacific ]", title: "Asia Pacific", description: "Connecting institutional commodities brokers in Singapore and Hong Kong." }
        ]
      },
      {
        blockType: 'ctaBanner',
        eyebrow: "[ INITIATE PARTNERSHIP ]",
        headline: "Align your digital infrastructure\nwith your operational scale.",
        description: "Stop allowing generic architecture to dilute your market authority. Engage our engineering team to map your optimal digital footprint.",
        primaryCTA: { label: "[ REQUEST A PROPOSAL ]", url: "#" },
        subtext: "[ Response within 24 hours ]"
      }
    ]
  },
  {
    slug: 'ecosystem',
    title: 'Ecosystem',
    _status: 'published',
    layout: [
      {
        blockType: 'hero',
        theme: 'ecosystem',
        eyebrow: "[ THE GLOBAL TRADE OPERATING SYSTEM ]",
        headline: "A Unifying Core. <br/><span class=\"text-white/60\">One OS for Global Trading Infrastructure.</span>",
        subheadline: "We do not build isolated products. We engineer an integrated digital command center. From bespoke Web architectures to automated documentation and trade tracking, Exvorta merges Web, Docs, Track, CRM, and Intel into a single, cohesive operating system for global traders.",
        bottomLabel: "[ WEB · DOCS · TRACK · CRM · INTEL · SUITE ]",
        showDashboard: false
      },
      {
        blockType: 'problemStatement',
        theme: 'light',
        eyebrow: "[ THE FRAGMENTATION PROBLEM ]",
        headline: "The modern trading entity is paralyzed by shattered software.",
        description: "You use one vendor for a public website, another for client portals, and legacy systems for tracking. This fragmentation creates data silos, wasted hours, and decisions made on incomplete information. To scale globally, you do not need more apps. You need a singular, unified nervous system."
      },
      {
        blockType: 'productShowcase',
        moduleNumber: '01',
        mockupType: 'web',
        theme: 'dark',
        statusLabel: 'LIVE',
        productName: 'Exvorta Web.',
        description: 'Bespoke digital architecture for global trading entities. We replace fragile templates with hardcoded, high-performance web infrastructure designed entirely for institutional authority and tier-one lead acquisition.',
        ctaLabel: 'VIEW ARCHITECTURE',
        ctaUrl: '#'
      },
      {
        blockType: 'productShowcase',
        mockupType: 'docs',
        theme: 'light',
        statusLabel: 'CLOSED BETA',
        productName: 'Exvorta Docs.',
        description: 'Trade documents generated in seconds. Commercial invoices, packing lists, and certificates of origin — auto-built from a single data entry. No formatting errors. No customs delays.',
        secondaryDescription: 'Currently available exclusively to active Exvorta Web clients.',
        ctaLabel: 'REQUEST BETA ACCESS',
        ctaUrl: '#'
      },
      {
        blockType: 'productShowcase',
        mockupType: 'track',
        theme: 'dark',
        statusLabel: 'Global Logistics Alpha',
        productName: 'Exvorta Track.',
        description: 'Real-time, verifiable visibility into your global trade pipeline. Exvorta Track moves asset tracking from static spreadsheets to a dynamic, hardened data ecosystem, connecting directly with major global carriers and freight forwarders.',
        ctaLabel: 'REQUEST ALPHA ACCESS',
        ctaUrl: '#'
      },
      {
        blockType: 'productShowcase',
        mockupType: 'crm',
        theme: 'light',
        statusLabel: 'COMING SOON',
        productName: 'Exvorta CRM.',
        description: 'Manage every buyer and supplier relationship in one place. Deal pipelines, document history, follow-up reminders — built specifically for how traders actually work.',
        ctaLabel: 'JOIN THE WAITLIST',
        ctaUrl: '#'
      },
      {
        blockType: 'productShowcase',
        moduleNumber: '05',
        mockupType: 'intel',
        theme: 'dark',
        statusLabel: 'COMING SOON',
        productName: 'Exvorta Intel.',
        description: 'Intuition does not scale. Exvorta Intel processes millions of global trade data points into actionable, predictive commodity forecasting and supply chain risk analysis.',
        secondaryDescription: 'Monitor macro-economic shifts, track competitor vessel routes, and analyze real-time pricing arbitrage across global ports—all from a single executive terminal.',
        ctaLabel: 'JOIN THE WAITLIST',
        ctaUrl: '#'
      },
      {
        blockType: 'vision',
        eyebrow: "THE ULTIMATE VISION",
        headline: "Total Synthesis. <br/><span class=\"text-white/40\">The Exvorta Suite.</span>",
        description: "When Web, Docs, Track, CRM, and Intel converge, they cease to be individual tools. They become a singular, unbreachable digital nervous system. This is the Exvorta Suite: the absolute apex of global trade infrastructure.",
        bottomLabels: [
          { label: 'WEB' },
          { label: 'DOCS' },
          { label: 'TRACK' },
          { label: 'CRM' },
          { label: 'INTEL' }
        ]
      },
      {
        blockType: 'roadmap',
        description: "[ DEPLOYMENT SCHEDULE ]",
        title: "The Infrastructure Roadmap.",
        phases: [
          { label: "PHASE 0 // ACTIVE", title: "Exvorta Web", description: "Foundation established. Deploying hardcoded, high-velocity digital architectures for tier-one trade entities globally." },
          { label: "PHASE 1 // Q3 2026", title: "Docs & Track Modules", description: "Releasing the zero-trust document data room (Docs) and the real-time supply chain visibility dashboard (Track) to our existing infrastructure partners." },
          { label: "PHASE 2 // Q1 2027", title: "Exvorta CRM", description: "Rolling out the first relationship architecture engineered explicitly for international trade desks, integrating KYC and broker networks." },
          { label: "PHASE 3 // Q3 2027", title: "Exvorta Intel", description: "Deploying the institutional-grade market intelligence terminal for predictive commodity forecasting and risk correlation." },
          { label: "PHASE 4 // 2028", title: "The Exvorta Suite", description: "Complete modular synthesis. All individual products seamlessly converge into the unified global trade operating system." }
        ]
      },
      {
        blockType: 'cta',
        eyebrow: "[ INITIATE PARTNERSHIP ]",
        title: "Secure your digital foundation.<br/><span class=\"text-white/50\">Unlock the ecosystem.</span>",
        description: "Alpha access to Exvorta Docs and Track is strictly prioritized for our active web architecture clients. Upgrade your public infrastructure today to guarantee your position in the future of global trade.",
        buttonText: "[ UPGRADE WEB ARCHITECTURE ]",
        buttonUrl: "/proposal",
        secondaryButtonText: "[ JOIN SOFTWARE WAITLIST ]",
        secondaryButtonUrl: "/waitlist",
        disclaimer: "* Web proposals are subject to capacity constraints."
      }
    ]
  },
  {
    slug: 'portfolio',
    title: 'Portfolio',
    _status: 'published',
    layout: [
      {
        blockType: 'hero',
        eyebrow: '[ OUR WORK ]',
        headline: 'Proof of Execution.',
        subheadline: 'Our recent deployments for elite trading institutions worldwide.',
        showDashboard: false
      }
    ]
  },
  {
    slug: 'insights',
    title: 'Insights',
    _status: 'published',
    layout: [
      {
        blockType: 'hero',
        eyebrow: '[ MARKET INTELLIGENCE ]',
        headline: 'Global Trade Perspectives.',
        subheadline: 'Strategic analysis on digital infrastructure for modern supply chains.',
        showDashboard: false
      }
    ]
  },
  {
    slug: 'blog',
    title: 'Blog',
    _status: 'published',
    layout: [
      {
        blockType: 'hero',
        eyebrow: '[ INSIGHTS & UPDATES ]',
        headline: 'Engineering the Future of Trade.',
        subheadline: 'News, product updates, and technical deep dives from the Exvorta team.',
        showDashboard: false
      }
    ]
  },
  {
    slug: 'waitlist',
    title: 'Waitlist',
    _status: 'published',
    layout: [
      {
        blockType: 'hero',
        eyebrow: '[ EXVORTA OS EARLY ACCESS ]',
        headline: 'The Operating System for Global Trade.',
        subheadline: 'Currently in closed beta. Enter your details to secure a deployment slot.',
        showDashboard: false
      }
    ]
  },
  {
    slug: 'rfq',
    title: 'RFQ',
    _status: 'published',
    layout: [
      {
        blockType: 'hero',
        eyebrow: '[ REQUEST FOR QUOTE ]',
        headline: 'Initiate Digital Transformation.',
        subheadline: 'Submit your requirements. Our architects will contact you within 24 hours.',
        showDashboard: false
      }
    ]
  },
  {
    slug: 'web',
    title: 'Web',
    _status: 'published',
    layout: [
      {
        blockType: 'hero',
        theme: 'web',
        eyebrow: "[ EXVORTA WEB ]",
        headline: "High-Performance Websites.\nFor Global Traders.",
        subheadline: "We build high-performance websites that make global trading companies look like the serious players they are.",
        primaryCTA: { label: "[ REQUEST PROPOSAL ]", url: "#" },
        secondaryCTA: { label: "[ VIEW RECENT PROJECTS ]", url: "#" },
        microcopy: [{ text: "[ ENGINEERED FOR SPEED ]" }, { text: "[ GLOBAL B2B READY ]" }, { text: "[ ON-TIME DELIVERY ]" }],
        showDashboard: false,
        hideDashboard: true
      },
      {
        blockType: 'featureGrid',
        eyebrow: "[ THE CREDIBILITY GAP ]",
        sectionTitle: "Your business moves millions. Your website looks like a startup.",
        theme: "dark",
        layout: "3-col",
        features: [
          { title: "01. FAILED DUE DILIGENCE", description: "International partners judge your reliability in 3 seconds. A slow, template-based website screams 'high risk' to tier-1 enterprise buyers.", icon: "failed" },
          { title: "02. LOST ENTERPRISE LEADS", description: "Big buyers don't fill out broken forms on generic sites. They quietly leave, taking lucrative, multi-year contracts directly to your competitors.", icon: "lost" },
          { title: "03. OUTDATED INFRASTRUCTURE", description: "You shouldn't be wasting hours fighting with cheap WordPress plugins or broken mobile layouts when you need to be closing global supply deals.", icon: "outdated" }
        ]
      },
      {
        blockType: 'featureShowcase',
        label: "[ THE EXVORTA SOLUTION ]",
        title: "We don't build brochures. We engineer digital assets.",
        description: "Your website shouldn't be a cost center. It should be your most relentless sales executive—working 24/7 to project authority, filter unqualified noise, and close global deals.",
        mediaPosition: 'left',
        features: [
          { title: "Look like a $100M Player.", description: "We strip away amateur templates and apply elite, bespoke UI/UX architecture. Your digital presence will instantly match the scale and ambition of your global operations." },
          { title: "Turn Traffic into Contracts.", description: "Beautiful isn't enough. We engineer optimized user flows and secure intake portals that guide high-tier enterprise leads directly into your sales pipeline." },
          { title: "You Trade. We Handle the Tech.", description: "Stop wrestling with broken plugins. We deploy secure, hyper-fast, maintenance-free infrastructures so your team can focus strictly on moving volume." }
        ]
      },
      {
        blockType: 'featureGrid',
        eyebrow: "[ ARCHITECTURAL SPECS ]",
        sectionTitle: "Pure Code. Flawless Aesthetics.",
        theme: "dark-cards",
        layout: "4-col",
        features: [
          { title: "Bespoke Art Direction. Refined Until Perfect.", description: "Custom visual identities designed from scratch. We refine every pixel until we achieve a shared, institutional masterpiece.", icon: "01" },
          { title: "100% Hardcoded.", description: "Built from scratch. No templates, no shortcuts. Elite code for unbreachable security and extreme speed.", icon: "02" },
          { title: "High-Performance UX.", description: "Fluid animations and instant interaction speeds designed for high-stakes, fast-moving global trade environments.", icon: "03" },
          { title: "Dedicated Ongoing Support.", description: "Professional infrastructure handling and unlimited layout updates so your team remains focused on moving trade volume.", icon: "04" }
        ]
      },
      {
        blockType: 'process',
        eyebrow: "[ THE DEPLOYMENT PIPELINE ]",
        headline: "Zero Friction. Infinite Precision.",
        steps: [
          { stepNumber: "WEEK 1", title: "Strategic Discovery", subtitle: "ARCHITECTURAL BLUEPRINTING", description: "We audit your current digital footprint and map out a bespoke strategy that aligns your technical infrastructure with your global market ambitions." },
          { stepNumber: "WEEKS 2-3", title: "The Iterative Canvas", subtitle: "BESPOKE VISUAL DESIGN", description: "Our art directors create your visual identity from scratch. No UI kits. No shortcuts. Just high-fidelity, institutional-grade aesthetics." },
          { stepNumber: "WEEKS 4-5", title: "Hardcoded Engineering", subtitle: "PURE CODE DEVELOPMENT", description: "Once design is approved, our engineers build the front-end using pure, lightweight code. We optimize for sub-second load times on the global trade floor." },
          { stepNumber: "ONGOING", title: "Handover & Concierge", subtitle: "Deployment & Dedicated Support", description: "We launch your asset to the global edge network. From there, we provide concierge-level support and maintenance for your evolving digital ecosystem." }
        ]
      },
      {
        blockType: 'portfolioShowcase',
        sectionLabel: "[ 06. PORTFOLIO SHOWCASE ]",
        sectionTitle: "Proof of Execution.",
        description: "Our recent deployments for elite trading institutions worldwide. Examine our track record of delivering uncompromised quality.",
        ctaText: "EXPLORE FULL PORTFOLIO ↗",
        ctaUrl: "#"
      },
      {
        blockType: 'pricing',
        eyebrow: "[ SCOPE OF INVESTMENT ]",
        sectionTitle: "Tailored Architectures.",
        sectionTitleSuffix: "Scoped to Your Scale.",
        sectionSubtitle: "We scope every engagement individually based on your operational complexity and market ambitions.",
        cta: { label: "[ REQUEST A CUSTOM SCOPE ]", url: "#" },
        tiers: [
          { tierName: "01. Foundation", tierSubtitle: "All packages include: Custom Design, Custom Development & Admin Panel", price: "Pricing Upon Proposal", highlight: false, features: [{feature: "+ SEO Foundation Setup"}, {feature: "+ Up to 5 Pages"}, {feature: "+ Mobile Responsive"}, {feature: "+ Contact Form Integration"}, {feature: "+ 30-Day Support"}], cta: { label: "[ REQUEST A CUSTOM SCOPE ]", url: "#" } },
          { tierName: "02. Professional", tierSubtitle: "All packages include: Custom Design, Custom Development & Admin Panel", price: "Pricing Upon Proposal", highlight: true, features: [{feature: "+ SEO & Performance Optimization"}, {feature: "+ Up to 10 Pages"}, {feature: "+ Brand Identity & Guidelines"}, {feature: "+ Advanced Animations"}, {feature: "+ Multilingual Ready"}, {feature: "+ 60-Day Support"}], cta: { label: "[ REQUEST A CUSTOM SCOPE ]", url: "#" } },
          { tierName: "03. Premium", tierSubtitle: "All packages include: Custom Design, Custom Development & Admin Panel", price: "Pricing Upon Proposal", highlight: false, features: [{feature: "+ Advanced SEO & Analytics Dashboard"}, {feature: "+ Unlimited Pages"}, {feature: "+ Full Brand System"}, {feature: "+ Admin Panel"}, {feature: "+ Priority Delivery"}, {feature: "+ 90-Day Support"}], cta: { label: "[ REQUEST A CUSTOM SCOPE ]", url: "#" } }
        ]
      },
      {
        blockType: 'testimonialBlock',
        eyebrow: "[ THE MARKET CONSENSUS ]",
        quote: "75% of people judge a company's credibility based on their website design alone.",
        quoteAuthor: "— Stanford Web Credibility Research, B.J. Fogg",
        guaranteeTitle: "The Zero-Risk Standard",
        guaranteeText: "Every engagement begins with a clear scope and mutual agreement. We deliver to standard or we iterate until we do. No ambiguity. No surprises.",
        guaranteeSignature: "The Exvorta Partners"
      },
      {
        blockType: 'faq',
        eyebrow: "[ EXECUTIVE BRIEFING ]",
        sectionTitle: "Clarity on Execution.",
        subtitle: "Addressing Common Friction.",
        questions: [
          { question: "How much of my team's time will this deployment require?", answer: "Virtually none. We require a single 60-minute strategic alignment call. From there, our architects and copywriters handle 100% of the heavy lifting. You simply review and approve the final institutional asset." },
          { question: "We move fast. Do we need internal developers to update the site?", answer: "No. Your focus should remain entirely on moving trade volume. Every engagement includes ongoing dedicated support. Any updates, new pages, or adjustments are handled by our team — so you stay focused on your business." },
          { question: "Why custom architecture instead of a premium WordPress setup?", answer: "WordPress is built for general use. We build specifically for your business — custom architecture, faster load times, and a codebase only you own. No shared templates, no plugin dependencies." }
        ]
      },
      {
        blockType: 'cta',
        eyebrow: "[ INITIATE DEPLOYMENT ]",
        title: "Secure Your Competitive Advantage in Global Trade.",
        description: "Your competitors are investing in their digital presence. This is your move.",
        buttonText: "[ REQUEST PROPOSAL ]",
        buttonUrl: "#",
        theme: "dark",
        disclaimer: "* Strict NDA enforcement. Proposals delivered within 48 hours."
      }
    ]
  },
  {
    slug: 'spicevo',
    title: 'Spicevo Case Study',
    _status: 'published',
    layout: [
      {
        blockType: 'hero',
        eyebrow: '[ CASE STUDY: SPICEVO ]',
        headline: 'Certified Organic Herbs Supply Chain.',
        subheadline: 'Digital infrastructure for European premium markets.',
        showDashboard: false
      }
    ]
  },
  {
    slug: 'nutave',
    title: 'Nutave Case Study',
    _status: 'published',
    layout: [
      {
        blockType: 'hero',
        eyebrow: '[ CASE STUDY: NUTAVE ]',
        headline: 'Precision Nut Processing.',
        subheadline: 'B2B web development for global wholesale partners.',
        showDashboard: false
      }
    ]
  },
  {
    slug: 'stonvi',
    title: 'Stonvi Case Study',
    _status: 'published',
    layout: [
      {
        blockType: 'hero',
        eyebrow: '[ CASE STUDY: STONVI ]',
        headline: 'High-End Ceramic & Stone.',
        subheadline: 'Corporate website and CMS for international architectural projects.',
        showDashboard: false
      }
    ]
  }
];

const productsToSeed = [
  {
    title: 'Spicevo',
    slug: 'spicevo',
    shortDescription: 'Certified organic herbs supply chain for European premium markets.',
    industry: 'ORGANIC HERBS',
    volume: '480 MT/YR',
    service: 'WEB DESIGN & CMS',
    caseStudyUrl: '/portfolio/spicevo',
  },
  {
    title: 'Nutave',
    slug: 'nutave',
    shortDescription: 'Precision nut processing and distribution for global wholesale partners.',
    industry: 'PREMIUM NUTS',
    volume: '650 MT/YR',
    service: 'B2B WEB DEVELOPMENT',
    caseStudyUrl: '/portfolio/nutave',
  },
  {
    title: 'Stonvi',
    slug: 'stonvi',
    shortDescription: 'High-end ceramic and stone materials for international architectural projects.',
    industry: 'CERAMICS',
    volume: '2.4M SQM/YR',
    service: 'CORPORATE WEBSITE & CMS',
    caseStudyUrl: '/portfolio/stonvi',
  }
];

async function seedMaster() {
  console.log('Seeding Master Pages via Local API...')
  // process.env.DATABASE_URI = process.env.DATABASE_URI_UNPOOLED || process.env.DATABASE_URI
  try {
    const payload = await getPayload({ config: configPromise })

    const seededProductIds: string[] = []

    for (const prod of productsToSeed) {
      console.log(`Seeding product: ${prod.slug}...`)
      const existing = await payload.find({
        collection: 'projects',
        where: { slug: { equals: prod.slug } },
        depth: 0
      });
      if (existing.docs.length > 0) {
        await payload.update({
          collection: 'projects',
          id: existing.docs[0].id,
          data: prod as any,
        });
        seededProductIds.push(existing.docs[0].id)
      } else {
        const created = await payload.create({
          collection: 'projects',
          data: prod as any,
        });
        seededProductIds.push(created.id)
      }
    }
    
    for (const page of pagesToSeed) {
      console.log(`Seeding page: ${page.slug}...`)

      if (page.slug === 'home') {
        // projects already seeded natively for phase 2 tests
      }

      const existing = await payload.find({
        collection: 'pages',
        where: { slug: { equals: page.slug } },
        depth: 0
      });

      if (existing.docs.length > 0) {
        console.log(`Updating existing ${page.slug}...`);
        await payload.update({
          collection: 'pages',
          id: existing.docs[0].id,
          data: page as any,
        });
      } else {
        console.log(`Creating new ${page.slug}...`);
        await payload.create({
          collection: 'pages',
          data: page as any,
        });
      }
    }
    
    console.log('Successfully seeded all pages.')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding pages:', error)
    process.exit(1)
  }
}

seedMaster()
