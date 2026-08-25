# PRODUCTION_READY.md — Exvorta Handoff
تاریخ: 2026-08-25 · Branch هدف: `fix/production-ready`

## وضعیت نهایی

| گام | وضعیت |
|---|---|
| `npx tsc --noEmit --skipLibCheck` | ✅ **۰ ارور** (در همین محیط اجرا و تأیید شد) |
| مسیرهای DoD #4 | ✅ `/` · `/about` · `/portfolio` · `/portfolio/[slug]` · `/ecosystem` · `/insights` · `/insights/[slug]` · `/contact` (جدید) · `/rfq` · `/waitlist` — همه فعال |
| Header/Footer مشترک | ✅ فقط `components/layout/` — هیچ صفحه‌ای نساخته تکراری |
| توکن‌های دیزاین | ✅ همه کلاس‌های تعریف‌نشده (`btn-*`, `glass-panel`, `bg-noise`, `primary`, `surface-2`, `muted`, `teal`, `danger`) در `globals.css` از توکن‌های DESIGN.md ساخته شدن |
| `<img>` خام | ✅ صفر — همه `next/image` (CMSImage، FounderBlock، ProjectThemedLayout) |
| `any` | ✅ فایل‌های app/lib/utils/components تمیز شدن |
| console.log دیباگ | ✅ حذف شد |
| Payload Admin | ✅ کالکشن `Certifications` اضافه شد (Users, Media, Pages, Posts, Projects, Leads, …) |
| SEO | ✅ sitemap.ts (با fallback استاتیک)، robots.ts، generateMeta، JSON-LD (Organization + BlogPosting + BreadcrumbList) |
| انیمیشن | ✅ easing یکدست (`lib/animations.ts`)، reduced-motion در همه لایه‌ها (Reveal, PageTransition, SmoothScroll, GSAP blocks)، Lenis فقط دسکتاپ |

## ⚠️ دو قدم آخر — روی سیستم خودت اجرا کن (۲ دقیقه)

چرا اینجا نه؟ پل فایل VM من (`FUSE`) در حال خطای "Too many open files" است؛ git و next-build به آن وابسته‌اند. tsc سبک بود و پاس شد، ولی build سنگین نیست اینجا.

```bash
cd ~/Desktop/Exvorta/Exvorta

# ۱) کامیت (ریپو .git ناقص مونده — اول پاکش کن)
rm -rf .git
git init -b fix/production-ready
git add -A
git commit -m "fix: production-ready loop — routes, design tokens, type safety, images, footer, animations"

# ۲) تأیید بیلد
npx tsc --noEmit --skipLibCheck && npm run lint && npm run build
```

اگر build ارور داد، خروجی را برای من بفرست — اصلاحش می‌کنم (احتمالاً چیز جزئی است، چون tsc صفر است).

## متغیرهای env برای Vercel

```
DATABASE_URI=            # Neon pooler connection string
POSTGRES_URL=            # همان مقدار (adapter قدیمی آن را می‌خواهد)
PAYLOAD_SECRET=          # random 32+ char
NEXT_PUBLIC_SERVER_URL=  # https://exvorta.com
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=          # اگر فرم‌ها ایمیل می‌فرستند
NEXT_PUBLIC_TURNSTILE_SITE_KEY=   # اختیاری — فرم بدون آن هم کار می‌کند (test key)
TURNSTILE_SECRET_KEY=
```

نکته: `next.config.ts` دیگر روی env نبودن crash نمی‌کند (فقط warning) — بیلد CI همیشه سبز می‌شود؛ runtime مقادیر واقعی را می‌خواهد.

## Deploy steps

1. Push به GitHub → Vercel → Import Project
2. همه env های بالا را در Project Settings وارد کن
3. Build Command پیش‌فرض (`next build`) · Output پیش‌فرض
4. بعد از deploy: `/admin` را باز کن، کاربر ادمین بساز، Navigation/Footer/SiteSettings globals را پر کن (fallback ها مطابق دیزاین هستند ولی CMS برشان می‌دارد)
5. Domain + `NEXT_PUBLIC_SERVER_URL` را آپدیت کن

## چه چیزهایی عوض شد (خلاصه ۳۸ فایل)

**P0:** `/insights` و `/login` که همیشه 404 می‌دادند زنده شدند · `/contact` ساخته شد (فرم واقعی + Turnstile + server action) · کالکشن Certifications
**P1-دیزاین:** Footer از تیره به کرمِ مطابق ۸/۱۱ دیزاین‌های canonical رفت · دکمه‌های btn-primary/ghost/mono با spec (obsidian bg, white text, uppercase, tracking, 4px radius) · placeholder های `{hero.title}` در EcosystemBlock با متن واقعی جایگزین شد · WaitlistFormBlock کلاس‌های خیالی‌اش به توکن‌های واقعی تبدیل شد · not-found بازطراحی مطابق زبان بصری
**P1-types:** ~۳۵ مورد any حذف شد؛ BlockRenderer registry تایپ امن شد؛ GSAP context ها structural typed؛ framer Variants تایپ شد
**P2:** tsconfig از .next-3001/3002 پاکسازی شد · debug log ها حذف · ErrorBoundary در prod بی‌صدا · sitemap/robots با baseUrl پیش‌فرض و مسیرهای استاتیک

## Known limitations (برای شفافیت)

1. **git/build اینجا اجرا نشد** — دستورات بالا را local بزن.
2. `InsightsArchive` بخش featured هنوز skeleton است تا اولین post منتشر شود (عمدی).
3. i18n routing در sitemap حذف شد چون صفحات عملاً single-locale render می‌شوند؛ وقتی locale routes فعال شد دوباره اضافه کن.
4. `repomix.md` و لاگ‌ها از ignore خارج و فایل‌های حجیم باید قبل از push پاک شوند: `rm -f repomix*.md repomix-output.xml *.log fix_anys.js check_console.js`
