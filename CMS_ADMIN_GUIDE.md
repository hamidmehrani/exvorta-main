# Exvorta — CMS Admin Guide

> **For content editors managing the Exvorta platform.**
> No coding required — this guide covers everything you need to know to manage content through the admin panel.

---

## Accessing the Admin Panel

**URL:** `https://exvorta.com/admin`

**Credentials:** Contact your system administrator for login details. Use the **Users** collection to manage editor accounts.

---

## Homepage Management

The homepage is a CMS-driven page assembled from **blocks**. You control every section.

### To edit the homepage:
1. Go to **Admin → Collections → Pages**
2. Find the page with slug `home`
3. Click to open it
4. Edit blocks in the **Layout** field
5. Click **Save** or **Publish**

### Available Homepage Blocks

| Block | What it does |
|-------|-------------|
| **Hero** | Full-bleed hero with headline, subheading, and CTA buttons |
| **Stats** | 3–4 animated statistics |
| **Feature Grid** | Grid of feature cards with icons |
| **Feature Showcase** | Side-by-side feature highlight |
| **CTA** / **CTA Banner** | Call-to-action section with button |
| **Portfolio Showcase** | Curated portfolio preview |
| **Testimonial** | Client testimonials |
| **Process** | Step-by-step process visualisation |
| **Rich Text** | Free-form formatted text |
| **Video** | Embedded video section |

---

## Portfolio / Case Studies

Portfolio entries are managed via **Projects** collection.

### Creating a Case Study

1. Go to **Admin → Collections → Projects**
2. Click **Create New**
3. Fill in:
   - **Title** — e.g., "Nutave Export Platform"
   - **Slug** — URL-friendly identifier (auto-generated from title)
   - **Status** — `published` to make it live
   - **Hero Image** — Upload or select from Media
   - **Summary** — One-line description for archive listing
   - **Industry** / **Tags** — For filtering
   - **Layout blocks** — Build the case study page using blocks
4. Click **Save**

### The case study will appear at: `/portfolio/<slug>`

---

## Blog / Insights

Blog posts are managed via **Posts** collection.

### Creating a Post

1. Go to **Admin → Collections → Posts**
2. Click **Create New**
3. Fill in:
   - **Title**
   - **Slug** (auto-suggested from title)
   - **Category** / **Tags**
   - **Featured Image**
   - **Excerpt** — For SEO meta description and card previews
   - **Content** — Rich text body (supports headings, images, quotes)
   - **Published At** — Set the publish date
   - **Status** — `published` to go live
4. **Save**

The post will appear at: `/insights/<slug>`

---

## SEO Metadata

Every page, post, and project has an **SEO** tab.

### Per-page SEO fields:
- **Meta Title** — Browser tab + Google title (60 chars max)
- **Meta Description** — Google snippet (155 chars max)
- **OG Image** — Social media preview image (1200×630px)

### Global SEO Defaults

Set fallback SEO at: **Admin → Globals → SEO Defaults**

These apply when a page hasn't set its own SEO fields.

---

## Navigation

Manage the main navigation at: **Admin → Globals → Navigation**

- Add/remove top-level links
- Set dropdown items
- Links support both internal paths (`/portfolio`) and external URLs

---

## Footer

Manage footer content at: **Admin → Globals → Footer**

- Multi-column link layout
- Social media links are managed separately in **Social Links** global

---

## Site Settings

**Admin → Globals → Site Settings** controls:

| Setting | Effect |
|---------|--------|
| **Maintenance Mode** | Shows "Under Maintenance" page to all visitors |
| **Cookie Banner** | Enable/disable GDPR cookie notice |
| **Cookie Policy URL** | Link in the cookie notice |
| **Umami Website ID** | Analytics tracking ID |
| **Umami Script URL** | Analytics script URL |

---

## Image Upload Best Practices

All images go through **Cloudinary** for automatic optimisation.

### Guidelines:

| Type | Recommended Size | Format |
|------|-----------------|--------|
| Hero / OG Image | 1920×1080px | JPG / WebP |
| Portfolio Hero | 1920×1080px | JPG / WebP |
| Team / Founder | 800×800px | JPG / WebP |
| Logo / Icon | SVG preferred | SVG or PNG |
| Blog Featured | 1200×630px | JPG / WebP |

### Tips:
- **Compress before upload** — target < 500 KB per image
- Use **descriptive filenames** — `nutave-hero-platform.jpg` not `IMG_1234.jpg`
- Cloudinary applies further optimisation and serves WebP automatically

---

## Managing Leads (Form Submissions)

All contact form, RFQ, and waitlist submissions are stored in:
- **Admin → Collections → Leads** — Contact and RFQ forms
- **Admin → Collections → Waitlist** — Waitlist signups
- **Admin → Collections → Form Submissions** — Generic form data

**These records are read-only in the admin.** They are immutable audit logs.

To export leads: Use the Neon database dashboard to run a SQL query or contact your developer.

---

## WhatsApp Float Widget

Configure the floating WhatsApp button at: **Admin → Globals → WhatsApp Config**

- **Phone Number** — Include country code, no spaces: `971501234567`
- **Default Message** — Pre-filled message when button is clicked
- **Enable Widget** — Toggle on/off

---

## Analytics Configuration

Manage Google Analytics and Google Tag Manager IDs at: **Admin → Globals → Analytics**

- **GA ID** — e.g., `G-XXXXXXXXXX`
- **GTM ID** — e.g., `GTM-XXXXXXX`

> Note: Analytics only fires after visitors accept the cookie consent banner.

---

## Publishing Workflow

1. **Draft** (default) — Visible only in admin preview
2. **Published** — Live on the site immediately (subject to ISR cache — up to 5 min delay)

### To force-refresh a page:
Ask your developer to trigger the revalidation webhook, which clears the cache immediately.

---

## Live Preview

While editing a **Page** or **Post**, click the **Preview** button to see a real-time preview of your changes before publishing.

The preview reflects exactly what visitors will see.

---

## Frequently Asked Questions

**Q: I saved a page but the website looks the same.**
A: The site uses a 5-minute cache. Changes appear within 5 minutes, or your developer can trigger an immediate refresh.

**Q: How do I create a new standalone page (not from a template)?**
A: Go to Pages → Create New → add blocks from the Layout field → set a slug → Publish.

**Q: Can I reorder blocks on a page?**
A: Yes — each block has drag handles on the left side.

**Q: How do I delete a block?**
A: Each block has a **Remove** button. Be careful — there is no undo.

**Q: The rich text editor isn't showing my formatting.**
A: Use the toolbar buttons — bold, italic, headings, lists, links. Pasting from Word may strip formatting; paste as plain text first.
