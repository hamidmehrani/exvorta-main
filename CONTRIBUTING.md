# Exvorta — Contributing Guide

## Getting Started

1. Clone the repo: `git clone <url> && cd exvorta`
2. Install: `npm install --legacy-peer-deps`
3. Copy env: `cp .env.example .env` and fill in values
4. Start DB: `npm run db:up` (Docker) or configure Neon branch
5. Run migrations: `NODE_OPTIONS="--require ./scripts/next-env-shim.cjs" npx tsx scripts/run-migration.ts run`
6. Start dev: `npm run dev`

---

## Git Workflow

```
main        ← production (auto-deploys to Vercel)
  └── feature/short-description    ← your branch
  └── fix/bug-description
  └── chore/maintenance-task
```

### Branch naming
- `feature/<slug>` — new feature
- `fix/<slug>` — bug fix
- `chore/<slug>` — maintenance (deps, config, docs)
- `hotfix/<slug>` — emergency production fix

### Commit convention (Conventional Commits)

```
feat: add waitlist email confirmation
fix: correct RFQ form validation
chore: update Cloudinary plugin to v2.3
docs: add contributing guide
style: fix header spacing on mobile
refactor: extract CMSImage from ProjectSingleLayout
perf: lazy-load EcosystemBlock SVG assets
```

### Pull Request Process

1. Branch from `main`
2. Open PR with a clear description of **what** and **why**
3. All CI checks must pass
4. One approval required before merge
5. Squash-merge to keep `main` history clean

---

## Coding Standards

### TypeScript

- **Strict mode** is enforced (`tsconfig.json: "strict": true`)
- No `any` types — use `unknown` and narrow, or use generated `payload-types.ts` types
- All server functions must be explicitly typed (return types + parameters)
- Use `type` for object shapes, `interface` for extension-intended contracts

```typescript
// ✅ Good
async function getProject(slug: string): Promise<Project | null> { ... }

// ❌ Bad
async function getProject(slug: any) { ... }
```

### Components

- **Server Components by default** — only add `'use client'` when you need browser APIs, event handlers, or hooks
- Keep client components thin — data fetching happens in Server Components
- One component per file
- Use named exports, not default exports for utilities

```typescript
// ✅ Good — Server Component (no directive)
export default async function PortfolioPage() {
  const projects = await getCachedProjects()
  return <PortfolioGrid projects={projects} />
}

// ✅ Good — Client Component (only for interactivity)
'use client'
export function MagneticButton({ children, href }: Props) { ... }
```

### Styling

- **Tailwind CSS v4** only — no inline styles, no raw CSS classes outside `globals.css`
- Use **logical properties**: `ms-` (margin-start) not `ml-`, `pe-` (padding-end) not `pr-`
- Use **design tokens**: `text-text`, `bg-bg`, `bg-surface`, `text-muted` — not hardcoded hex
- Never add raw hex colors to components — add a token to `globals.css` first

```tsx
// ✅ Good
<div className="ms-4 pe-6 text-text bg-surface">

// ❌ Bad
<div style={{ marginLeft: '16px' }} className="text-[#1a1a1a]">
```

### Animations

- **Scroll animations**: use `<Reveal>` or `<SectionReveal>` components
- **Animated text**: use `<AnimatedHeadline>`
- **Complex timelines**: use GSAP presets from `lib/animations.ts`
- **Micro-interactions**: use Framer Motion `motion.div` with variants
- Do **NOT** write raw `gsap.to()` calls inside block components
- Do **NOT** use regex/patch scripts for animation logic

### Forms

- All forms must use **Cloudflare Turnstile** + **honeypot** field
- Validate on the server with explicit checks (not `any`)
- Never expose raw error messages to the client — log server-side, return generic message

### API Routes

- Authenticate every mutation with a secret header or session
- Return typed responses (`NextResponse.json<{ success: boolean }>`)
- Always handle errors — never let uncaught exceptions leak stack traces

---

## Adding a New CMS Block

1. **Define the schema** in `payload/blocks/YourBlock.ts`:
   ```typescript
   import type { Block } from 'payload'
   export const YourBlock: Block = {
     slug: 'yourBlock',
     fields: [ ... ],
   }
   ```

2. **Add to Pages collection** in `payload/collections/Pages.ts` blocks array

3. **Create the renderer** in `components/blocks/YourBlock.tsx`:
   ```typescript
   import type { Page } from '@/payload-types'
   type Props = Extract<NonNullable<Page['layout']>[number], { blockType: 'yourBlock' }>
   export default function YourBlock(props: Props) { ... }
   ```

4. **Register in BlockRenderer** in `components/blocks/BlockRenderer.tsx`

5. **Regenerate types**: `npx tsx scripts/generate-types.ts` (or manually patch `payload-types.ts`)

---

## Adding New Environment Variables

1. Add to `.env.example` with a descriptive placeholder and comment
2. Add to `DEPLOYMENT.md` variables table
3. If required at build time, add to `requiredEnvVars` in `next.config.ts`
4. Never commit real values to git

---

## File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| React components | PascalCase | `FeatureGridBlock.tsx` |
| Utilities | camelCase | `payload-cache.ts` |
| Payload collections | PascalCase | `Projects.ts` |
| Scripts | kebab-case | `verify-deployment.sh` |
| Route files | Next.js conventions | `page.tsx`, `layout.tsx`, `route.ts` |

---

## Testing

Currently, testing is done via:
- **Playwright** screenshots (`scripts/take-screenshots.js`) — visual regression
- **Lighthouse CI** (`scripts/lighthouse-ci.sh`) — performance regression

Before merging:
1. Run screenshots and compare against `screen.png` acceptance tests
2. Verify Lighthouse scores haven't regressed below 90

---

## Documentation

Update docs when you:
- Add a new environment variable → update `.env.example` and `DEPLOYMENT.md`
- Add a new block → update `ARCHITECTURE.md` block catalog
- Change deployment process → update `DEPLOYMENT.md`
- Add a new script → add to the scripts table in `README.md`

---

## Do Not

- ❌ Run `npm audit fix --force` — it will break Payload's Next.js peer dep
- ❌ Upgrade `next` beyond `15.4.x` until Payload lifts the restriction
- ❌ Add `console.log` in production code paths (stripped by compiler, but avoid anyway)
- ❌ Hardcode domain URLs (`exvorta.com`) — use `process.env.NEXT_PUBLIC_SERVER_URL`
- ❌ Modify `payload-generated-schema.ts` — it's auto-generated
- ❌ Commit `.env` files — they are gitignored
- ❌ Use `push: true` in `payload.config.ts` in production
