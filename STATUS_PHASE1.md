# STATUS_PHASE1.md — Exvorta.com Stabilization Source of Truth

**تاریخ:** 2026-09-26  
**نسخه:** 1.0.0 (Phase 1 Baseline)  
**نویسنده:** Senior Next.js / Payload CMS Engineer  

این سند تنها مرجع حقیقت (Source of Truth) وضعیت پایداری، رفع باگ‌ها، و امنیت وبسایت Exvorta.com است. تمامی گزارش‌های پیشین (`BUG_AUDIT_REPORT.md`, `PRODUCTION_READY.md`, `FINAL_IMPROVEMENTS_REPORT.md`) بررسی و وضعیت واقعی آن‌ها در کد زنده استخراج شده است. گزارش‌های قدیمی به پوشه `docs/archive/` منتقل شده‌اند.

---

## ۱. جدول وضعیت جامع و تحلیل ادعاهای گزارش‌های قبلی

| # | مشکل / ادعا | منبع گزارش | وضعیت واقعی در کد | اقدام انجام شده / برنامه فاز ۱ |
|---|---|---|---|---|
| **1** | تنظیمات نادرست ایمیل (`RESEND_API_KEY="your_resend_api_key"`) | `BUG_AUDIT_REPORT.md` #1 | **تأیید شد.** در `.env.local` خط ۱۱ مقدار placeholder وجود داشت که کلید معتبر در `.env` را override می‌کرد. | مقدار placeholder پاکسازی شد. سازوکار fail-safe افزوده شد تا در پروداکشن غیاب یا placeholder بودن کلید موجب توقف صریح شود. |
| **2** | کلیدهای Cloudinary در Git History | `BUG_AUDIT_REPORT.md` #2 | **ادعای غلط.** فایل‌های `.env*` هرگز در git کامیت نشده بودند و secret های Cloudinary در تاریخچه وجود نداشتند. اما پسورد Neon DB در کامیت‌های `f3456e1` و `544a25f` یافت شد. | عدم بازنویسی مخرب git history (طبق قانون ۴). موضوع برای چرخش کلید در Neon Dashboard فلگ شد. |
| **3** | غیاب Turnstile Secret Key و رفتار Silent Fail | `BUG_AUDIT_REPORT.md` #3 | **تأیید شد.** متغیر در صورت نبودن با fail-open بی‌صدا عمل می‌کرد و در dev/prod تفکیک نشده بود. | تفکیک رفتار: در dev هشدار واضح در لاگ؛ در production توقف و throw صریح در صورت نبود کلید معتبر. |
| **4** | شکست کامل فرم تماس به دلیل عدم ارسال `source` | `BUG_AUDIT_REPORT.md` #4 & Live Audit | **باگ مسدودکننده بحرانی.** اکشن `submitLead.ts` مقدار `source` را از `['Waitlist', 'RFQ']` اجباری کرده بود، اما `ContactForm.tsx` هیچ فیلد سورسی ارسال نمی‌کرد و همه پیام‌های تماس fail می‌شدند. | فیلد مخفی `source="RFQ"` به `ContactForm.tsx` افزوده شد. |
| **5** | خطای ایمیل admin پیش‌فرض (`admin@yourdomain.com`) | `BUG_AUDIT_REPORT.md` #5 | **تأیید شد.** در `sendLeadEmails.ts:28` و `sendRFQEmails.ts:33` فال‌بک هاردکد وجود داشت. | فال‌بک دامی حذف شد؛ الزام `ADMIN_EMAIL` و throw در پروداکشن در صورت فقدان. |
| **6** | ناهماهنگی Rate Limiter Window و Query خام | `BUG_AUDIT_REPORT.md` #6 & #8 | **تأیید شد.** مقدار ثابت ۳۰ دقیقه بود اما کوئری حذف به صورت هاردکد `interval '15 minutes'` و با SQL خام اجرا می‌شد. | همگام‌سازی پنجره زمانی و جایگزینی کوئری‌ها با Drizzle ORM پارامتریزه و schema امن. |
| **7** | نمره ۰/۰/۰/۰ لایت‌هاوس در `/insights` | `lighthouse_summary.md` | **تأیید شد.** صفحه `/insights` به صورت هاردکد دارای دستور `redirect('/')` بود که باعث خطای `NO_FCP` می‌شد. | بازگردانی کامپوننت `InsightsArchive` با داده‌های امن CMS و fallback بدون کرش. |
| **8** | نمره ۰/۰/۰/۰ لایت‌هاوس و کرش بیلد در `/` | Live Audit / TS1136 | **تأیید شد.** فایل `next.config.ts` دارای خطای نحوی (TS1136) در تنظیم هدرها بود، و دایرکتیو `upgrade-insecure-requests` در CSP باعث خطای SSL در محیط لوکال و عدم رندر می‌شد. | اصلاح خطای سینتکس `next.config.ts` و مشروط‌سازی `upgrade-insecure-requests` به محیط واقعی HTTPS. |
| **9** | فیلد Honeypot ناکارآمد در RFQ | `BUG_AUDIT_REPORT.md` #11 | **تأیید شد.** در `RFQForm.tsx` فیلد با نام اشتباه `honeypot-email` و به صورت `disabled` رندر شده بود درحالی‌که اکشن `bot-field` را می‌خواند. | تصحیح نام فیلد به `bot-field`، فعال‌سازی، مخفی‌سازی استاندار با CSS/sr-only و بررسی تایمینگ. |
| **10** | Error Handling ناقص در Layout | `BUG_AUDIT_REPORT.md` #9 | **تأیید شد.** خطاهای Global fetch صرفاً `console.warn` می‌شدند. | اتصال catch blockها به `lib/error-reporting.ts` (`reportWarning`). |
| **11** | نشت کامپوننت‌ها در Maintenance Mode | `BUG_AUDIT_REPORT.md` #10 | **تأیید شد.** کامپوننت‌هایی نظیر `SkipToContent` و schema خارج از گارد رندر می‌شدند. | ایزوله‌سازی کامل پوسته Maintenance mode بدون هیچ هدر، فوتر یا ویجت جانبی. |
| **12** | نحوه پارس کوکی Consent | `BUG_AUDIT_REPORT.md` #16 | **ادعای غلط.** کد از ابتدا از `cookies()` استاندارد Next.js استفاده می‌کرد. | بدون نیاز به تغییر؛ ساختار بهینه استاندارد حفظ شد. |
| **13** | فایل مفقود `security.txt` | `BUG_AUDIT_REPORT.md` #18 | **تأیید شد.** فایل به اشتباه به صورت متنی خام در `app/.well-known/security.txt` قرار گرفته بود که 404 می‌داد. | بازگردانی Route Handler استاندارد Next.js در `app/.well-known/security.txt/route.ts`. |
| **14** | لاگ‌های غیرضروری پروداکشن | `BUG_AUDIT_REPORT.md` #19 | **تأیید شد.** لاگ‌های ASCII Art در هوک‌های ایمیل در پروداکشن خروجی کنسول می‌دادند. | حذف یا هدایت به لاگر ساختاریافته با سطح دیباگ. |
| **15** | اعتبارسنجی متغیرهای محیطی در بیلد | `BUG_AUDIT_REPORT.md` #17 | **تأیید شد.** متغیرهای حیاتی تفکیک نشده بودند. | تفکیک متغیرهای اجباری و اختیاری در `next.config.ts` و `.env.example`. |

---

## ۳. اصلاحیه و شفاف‌سازی فاز ۴ (Phase 4 Addendum: Email Dispatch & Resend Error Swallowing)

**تاریخ ثبت اصلاحیه:** 2026-09-26  
**مرجع راستی‌آزمایی:** `verification/phase4/resend-emails-check.json` (نتیجه: ۰ ایمیل ارسال شده)

### توضیح شفاف عدم صحت ادعای ارسال ایمیل در فاز ۱:
در گزارش فاز ۱ ادعا شده بود که اتوماسیون ارسال ایمیل تأیید و تست شده است. این ادعا بر اساس شواهد زنده API معتبر نبوده و حاصل یک خطای پنهان در هوک‌های کد بوده است:
1. **بلعیدن بی‌صدای خطا در هوک‌های Payload**: متد `resend.emails.send(...)` در پکیج رسمی Resend در صورت بروز خطاهای اعتبارسنجی API (مانند عدم تأیید دامنه - ۴۰۳)، اکسپشن پرتاب نمی‌کند بلکه یک آبجکت `{ data, error }` برمی‌گرداند. هوک‌های `sendLeadEmails.ts` و `sendRFQEmails.ts` مقدار بازگشتی را چک نمی‌کردند و خطای API در بلوک `try/catch` گیر نمی‌افتاد. در نتیجه، هنگام ثبت لید یا فرم، عملیات دیتابیس موفقیت‌آمیز بود و رکورد برگردانده می‌شد، که باعث شد تست‌کننده فاز ۱ به اشتباه ارسال ایمیل را موفق قلمداد کند.
2. **وضعیت دامنه در Resend**: طبق بررسی مستقیم API در فازهای ۳ و ۴ (`GET https://api.resend.com/domains`)، دامنه `exvorta.com` روی اکانت Resend کانفیگ یا Verify نشده بود، لذا Resend اساساً اجازه ارسال از این دامنه را صادر نمی‌کرد.

### اقدامات اصلاحی قطعی در فاز ۴:
- تصحیح کامل مدیریت خطا در هر دو هوک (`sendLeadEmails.ts` و `sendRFQEmails.ts`) برای بررسی صریح `sendResult.error` و فراخوانی `reportError`.
- پیاده‌سازی تمپلیت‌های HTML ریسپانسیو و استاندارد برای ایمیل‌های کاربر و ادمین، ذخیره در `verification/phase4/emails/` و گرفتن اسکرین‌شات در ویوپورت موبایل.
- درج صریح نیاز به Verify دامنه `exvorta.com` در مستندات عملیاتی ادمین (`MANUAL_ACTION_REQUIRED.md`).

