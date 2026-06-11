# BOILERPLATE.md — Exvorta Agency
# This file tells AI how to convert Stitch HTML output into production Next.js + Payload CMS pages.
# Paste alongside PROJECT.md + TECH.md (Section A) when converting any design.

---

## What Stitch Gives Us

- `screen.png` — visual reference of the full page
- `code.html` — static HTML with Tailwind CDN classes, inline styles, hardcoded content

## What We Need

A production Next.js 15 page with:
- JSX components (not raw HTML)
- Content editable via Payload CMS admin
- Shared Header/Footer (never duplicated)
- Proper TypeScript types
- No Tailwind CDN — uses project Tailwind config

---

## Conversion Rules (follow in order)

### Step 1 — Audit the HTML
Before writing any code, identify:
- How many distinct sections exist (Hero, Features, CTA, etc.)
- Which content is static (never changes) vs dynamic (editable in CMS)
- Which sections are shared across pages (Header, Footer → already in components)

### Step 2 — Map Content to Payload Collections
Decide what goes into Payload:

| Content Type | Payload Location |
|-------------|-----------------|
| Page hero (title, subtitle, CTA text) | Pages collection → `hero` field group |
| Repeating cards / feature lists | Pages collection → `blocks` (flexible content) |
| Blog posts | Posts collection |
| Portfolio items | Portfolio collection |
| Navigation links | Navigation global |
| Footer content | Footer global |
| SEO (title, description, OG) | Every collection → `meta` field group |
| Media / images | Media collection → Cloudinary |

### Step 3 — Build Shared Components First
If Header or Footer appear in the HTML, skip them.
They already exist at:
```
/components/layout/Header.tsx
/components/layout/Footer.tsx
```
Import them — never rebuild.

### Step 4 — Convert HTML → JSX Sections
For each section in the HTML:
1. Create `/components/[page]/[SectionName].tsx`
2. Replace hardcoded text with props typed from Payload data
3. Replace `<img>` tags with Next.js `<Image />` component
4. Replace `href="#"` with real routes or props
5. Remove any `style=""` attributes — use Tailwind classes only
6. Replace Tailwind CDN classes with identical classes (same syntax, project config handles it)

### Step 5 — Build the Page File
```tsx
// app/(frontend)/[page-slug]/page.tsx
import { getPayloadClient } from '@/lib/payload'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/[page]/HeroSection'
import FeatureSection from '@/components/[page]/FeatureSection'
// ... other sections

export default async function Page() {
  const payload = await getPayloadClient()
  const data = await payload.findGlobal({ slug: 'page-slug' })
  // or: await payload.find({ collection: 'pages', where: { slug: { equals: 'page-slug' } } })

  return (
    <>
      <Header />
      <main>
        <HeroSection data={data.hero} />
        <FeatureSection data={data.features} />
      </main>
      <Footer />
    </>
  )
}
```

### Step 6 — Create Payload Collection/Global
For each page, create or update the corresponding Payload collection:
```ts
// payload/collections/Pages.ts
import { CollectionConfig } from 'payload/types'

const Pages: CollectionConfig = {
  slug: 'pages',
  fields: [
    { name: 'slug', type: 'text', required: true },
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'headline', type: 'text' },
        { name: 'subheadline', type: 'textarea' },
        { name: 'ctaText', type: 'text' },
        { name: 'ctaUrl', type: 'text' },
      ]
    },
    // blocks for flexible sections
    {
      name: 'sections',
      type: 'blocks',
      blocks: [FeatureBlock, CTABlock, TestimonialBlock]
    },
    // SEO
    {
      name: 'meta',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ]
    }
  ]
}
```

---

## Skeleton Zones (Stitch placeholder sections)

Stitch marks unfinished sections like this in the HTML:
```html
<div class="border border-dashed border-black/20 ...">
  <span class="font-mono">[ 06. PORTFOLIO SHOWCASE ]</span>
</div>
```

When you see these:
- Do NOT fill them with fake content
- Create the JSX section shell with a `// TODO: [section name]` comment
- Add the Payload field to the collection but leave data empty
- Note them in CURRENT.md as pending sections

---

## File Naming Convention

```
/app/(frontend)/
  page.tsx                        → homepage
  exvorta-web/page.tsx            → service page
  portfolio/page.tsx              → portfolio
  ecosystem/page.tsx              → products overview
  the-firm/page.tsx               → about

/components/
  layout/
    Header.tsx                    ← never recreate
    Footer.tsx                    ← never recreate
  home/
    HeroSection.tsx
    PainSection.tsx
    SolutionSection.tsx
    FeaturesSection.tsx
    CTASection.tsx
  exvorta-web/
    HeroSection.tsx
    ProcessSection.tsx
    PricingSection.tsx
  shared/
    SectionLabel.tsx              ← [ LABEL ] component
    StatusPip.tsx                 ← green pulse dot

/payload/
  collections/
    Pages.ts
    Posts.ts
    Portfolio.ts
    Media.ts
  globals/
    Navigation.ts
    Footer.ts
    SiteSettings.ts
  blocks/
    FeatureBlock.ts
    CTABlock.ts
    TestimonialBlock.ts
```

---

## Design Tokens (from UI-UX-GUIDELINES.md — critical)

```
Never use hardcoded hex values. Map Stitch colors to Tailwind semantic tokens:

Stitch          → Tailwind token
#FCFAF8 / white → bg-text / text-text
#0A0A0A / black → bg-bg / text-bg
#1A1A1A         → bg-surface / bg-surface-2
#059669         → text-teal / bg-teal
#D4A843         → text-primary / bg-primary
rgba(0,0,0,0.X) → black/X  (keep as-is, Tailwind supports this)
rgba(255,255,255,0.X) → white/X (keep as-is)
```

Typography & Font Files are INTENTIONALLY excluded from this boilerplate. They must be injected into `/public/fonts` and mapped in `globals.css` on a per-project basis during deployment.

---

## Client Website Adaptation

When building a CLIENT website (not exvorta.com):
1. Same boilerplate, same stack
2. New Vercel project + new Neon DB + new Payload instance
3. Update `SiteSettings` global: client name, logo, colors, favicon
4. Keep Header/Footer but update navigation links and logo
5. Client gets their own Payload admin login
6. Cloudinary folder: `/clients/[client-slug]/`

---

## Quality Checklist Before Handoff

- [ ] All hardcoded text is editable in Payload admin
- [ ] All images go through Cloudinary (no /public images)
- [ ] Header and Footer imported from shared components
- [ ] Mobile responsive (test at sm: 640px and md: 768px)
- [ ] No Tailwind CDN script tag (removed from HTML)
- [ ] TypeScript — no `any` types
- [ ] Skeleton zones marked as TODO in code + noted in CURRENT.md
- [ ] SEO meta fields populated in Payload
- [ ] page.tsx uses async data fetching from Payload
- [ ] All `href="#"` replaced with real routes or CMS fields
