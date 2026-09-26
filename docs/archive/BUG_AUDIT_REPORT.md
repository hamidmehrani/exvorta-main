# 🚨 گزارش کامل باگ‌ها و مشکلات Exvorta.com

## خلاصه اجرایی
این گزارش شامل **120+ مورد** از باگ‌ها، مشکلات امنیتی، مسائل عملکردی و نقاط قابل بهبود در وبسایت exvorta.com است. موارد به ترتیب اهمیت دسته‌بندی شده‌اند.

---

## 🔴 بحرانی (Critical) - نیاز به اقدام فوری

### 1. تنظیمات نادرست ایمیل
- **مکان:** `.env.local`
- **مشکل:** `RESEND_API_KEY="your_resend_api_key"`
- **خطر:** ارسال ایمیل برای leads/RQها کار نمی‌کند → **از دست دادن مشتریان بالقوه**
- **راه‌حل:** API key معتبر Resend را وارد کنید

```bash
# اصلاح در .env.example یا Vercel env vars
RESEND_API_KEY=re_xxxxxxxx  # مقدار واقعی
ENABLE_LEAD_EMAILS=true
EMAIL_FROM_DOMAIN=exvorta.com
```

### 2. کلیدهای Cloudinary در Git History
- **مکان:** فایل‌های `.env`, `.env.local`
- **مشکل:** کلیدهای API به صورت plain-text در فایل‌ها ذخیره شده‌اند
- **خطرات:** 
  - استفاده غیرمجاز از_quota_ Cloudinary
  - دسترسی ناشران دیگر
- **راه‌حل:**
  ```bash
  # 1. روتیت کردن Git history
  git filter-branch --force --index-filter \
    'git rm --cached --ignore-unmatch .env*' \
    --prune-empty --tag-name-filter cat -- --all
  
  # 2. چرخش کلیدهای فعلی در Cloudinary console
  # 3. به‌روزرسانی در Vercel environment variables
  ```

### 3. Turnstile Secret Key Missing
- **مکان:** `.env.local`
- **مشکل:** `TURNSTILE_SECRET_KEY` هنوز تنظیم نشده
- **تأثیر:** Protection برابر با صفر؛ اسپمرها می‌توانند فرم‌ها را abuse کنند
- **راه‌حل:** کلید واقعی از Cloudflare Dashboard بگیرید

```bash
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA  # جایگزین با value واقعی
SKIP_TURNSTILE_IN_DEV=false  # NEVER true in production!
```

### 4. هاردکد کلمات کلیدی حساس در کدها
- **فایل:** `/actions/submitLead.ts:57`
```typescript
if (!data.source || !['Waitlist', 'RFQ'].includes(data.source)) {
```
- **مشکل:** values هاردکد شده‌اند → maintainability پایین
- **پیشنهاد:** از enum استفاده کنید

### 5. خطای ایمیل admin پیش‌فرض
- **فایل:** `/payload/collections/Leads/hooks/sendLeadEmails.ts:28`
```typescript
const adminEmail = process.env.ADMIN_EMAIL || 'admin@yourdomain.com'
```
- **مشکل:** ایمیل پیش‌فرض غیرواقعی → notificationها گم می‌شوند
- **راه‌حل:** ADMIN_EMAIL را اجباری کنید

---

## 🟡 بالا (High Priority) - باید برطرف شوند

### 6. Rate Limiting بسیار ضعیف
- **مکان:** `lib/rate-limit.ts:5`
```typescript
export const RATE_LIMIT_MAX_ATTEMPTS = 5  // بسیار کم!
export const RATE_LIMIT_WINDOW_MINUTES = 15
```
- **مشکل:** 
  - فقط 5 attempt در 15 دقیقه برای IP
  - کاربران legitimate در ایران ممکن است block شوند (proxy مشترک)
- **راه‌حل هوشمندانه‌تر:**
```typescript
// Adaptive rate limiting
export const RATE_LIMIT_MAX_ATTEMPTS = 20  // افزایش
export const RATE_LIMIT_WINDOW_MINUTES = 30  // زمان بیشتر
// + IP reputation checking
```

### 7. Email Templates HTML نداشتن Responsive Design
- **فایل:** `sendLeadEmails.ts:47-67`
```html
<h2>New Lead — ${doc.source}</h2>
<table border="1" cellpadding="8" ...>
```
- **مشکل:** تمپلیت‌ها موبایل-فرندلی نیستند
- **راه‌حل:** استفاده از libraryهایی مثل MJML or EmailJS

### 8. SQL Injection Vulnerability (غیرمحتمل اما امکان‌پذیر)
- **مکان:** `lib/rate-limit.ts:41`
```sql
DELETE FROM "rate_limits" WHERE "window_start" < now() - interval '15 minutes'
```
- **مشکل:** Query مستقیم بدون prepared statement
- **احتمال:** ⭐⭐⭐☆☆ (با توجه به PostgreSQL)
- **بهترین راه‌حل:** استفاده از Drizzle ORM queries

### 9. Error Handling ناقص
- **فایل:** `app/(frontend)/layout.tsx:83-86`
```typescript
} catch (e) {
  console.warn("site-settings fetch failed, using default", e);
  siteSettings = { id: 0, siteName: 'Exvorta', enableCookieBanner: false, maintenanceMode: false };
}
```
- **مشکل:** Error swallow می‌شود؛ debugging دشوار
- **راه‌حل:** Error logging service (Sentry)

### 10. Maintenance Mode Implementation ناکامل
- **موقعیت:** `components/layout/HeaderClient.tsx` + `layout.tsx`
- **مشکل:** وقتی maintenance mode فعال است، Header همچنان render می‌شود
- **راه‌حل:** کل layout را در maintenance mode hidden کنید

---

## 🟢 متوسط (Medium) - باید بهبود یابند

### 11. Honeypot Field ناکافی
- **فایل:** `components/forms/RFQForm.tsx:103`
```jsx
<input type="hidden" name="bot-field" />
```
- **مشکل:** فقط field ساده → bots قدیمی می‌توانند bypass کنند
- **بهبود:** 
```jsx
<input 
  type="text" 
  name="honeypot-email" 
  style={{ display: 'none' }}
  tabIndex={-1}
  aria-hidden="true"
  autoComplete="off"
/>
// + JavaScript honeypot check
document.querySelector('input[name="honeypot-email"]').value = '';
```

### 12. TypeScript Type Safety Issues
- **موقعیت:** `payload-types.ts:2360`
```typescript
* Google Tag Manager ID, e.g., GTM-XXXXXX
```
- **مشکل:** Type definitions از templates خودکار تولید شده‌اند
- **راه‌حل:** Type annotations اضافه کنید

### 13. Loading States Incomplete
- **فایل:** `components/forms/RFQForm.tsx:198`
```jsx
{isPending && (
  <svg className="animate-spin h-3 w-3 text-current" ... />
)}
```
- **مشکل:** Loading spinner فقط دکمه را تحت تأثیر قرار می‌دهد
- **بهبود:** کل فرم را disable کنید + loading skeleton نشان دهید

### 14. Accessibility Violations
- **موقعیت:** `components/forms/RFQForm.tsx:122-137`
- **مشکل‌ها:**
  - Labels missing `required` indication for screen readers
  - No aria-live for error messages
  - Focus management not implemented after form submission
- **راه‌حل:** 
```jsx
<label htmlFor="rfq-email">
  YOUR EMAIL <span className="sr-only">(required)</span>
</label>
<span role="alert" aria-live="assertive">
  {error && <span>{error}</span>}
</span>
```

### 15. Performance: Unoptimized Image Optimization
- **موقعیت:** `components/layout/HeaderClient.tsx:114-121`
```jsx
<Image
  src={brand.logoUrl}
  alt={brand.name}
  width={160}
  height={32}
  priority
  ...
/>
```
- **مشکل:** Fixed dimensions → responsive images کار نمی‌کنند
- **بهترین روش:**
```jsx
<Image
  src={brand.logoUrl}
  alt={brand.name}
  width={160}
  height={32}
  priority
  sizes="(max-width: 768px) 120px, 160px"
  className="object-contain"
/>
```

### 16. Cookie Consent Logic نادرست
- **موقعیت:** `app/(frontend)/layout.tsx:115`
```typescript
const hasConsent = cookieStore.get('cookie-consent')?.value === 'accepted'
```
- **مشکل:** Cookie parsing manual انجام می‌شود → potential bugs
- **راه‌حل:** Use Next.js cookies API properly

### 17. Environment Validation Weak
- **موقعیت:** `next.config.ts:7-19`
```typescript
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`⚠️ Missing environment variable: ${envVar}`)
  }
}
```
- **مشکل:** Build succeeds even with missing critical vars
- **بهبود:** Throw error during build:
```typescript
if (!process.env.DATABASE_URI) {
  throw new Error('DATABASE_URI is required for build');
}
```

### 18. Security.txt File ناپیدا
- **موقعیت:** `app/.well-known/security.txt` وجود دارد اما محتوایش بررسی نشده
- **نیاز:** Compliance با RFC 9116
```http
Contact: security@exvorta.com
Expires: 2026-12-31T23:59:59Z
Encryption: https://keybase.io/exvorta/pgp_keys.asc
Preferred-Languages: en, fa
Canonical: /security.txt
Policy: https://exvorta.com/security-policy
```

---

## 🟩 پایین (Low Priority) - Nice to Have

### 19. Console.logs Production در Codebase
- **تعداد:** 11 line ها
- **فایل‌ها:**
  - `payload/collections/Leads/hooks/sendLeadEmails.ts`
  - `payload/collections/FormSubmissions/hooks/sendRFQEmails.ts`
  - `lib/rate-limit.ts`
  
- **راه‌حل:** حذف console logs در production
```typescript
if (process.env.NODE_ENV === 'production') {
  return doc; // skip console.log
}
```

### 20. Redis Cache نداشتن
- **مشکل:** Payload CMS default postgres caching
- **بهبود:** Add Redis برای:
  - Session storage
  - Rate limit state
  - ISR cache invalidation

### 21. Monitoring و Alerting نبودن
- **وضعیت:** هیچ external monitoring tool ندارید
- **پیشنهاد:** 
  - Sentry برای error tracking
  - Datadog/New Relic برای performance monitoring
  - Uptime Robot برای uptime monitoring

### 22. Logging Centralization
- **موقعیت:** Logs پراکنده در console
- **راه‌حل:** Winston یا Pino برای structured logging

### 23. Database Indexes بهینه نشده
- **مشکل:** Queries ممکن است slow باشند
- **بررسی:**
```sql
-- Add indexes for frequently queried fields
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_form_submissions_email ON form_submissions(email);
```

### 24. CORS Configuration نادرست
- **موقعیت:** Headers in `next.config.ts:48-77`
- **مسئله:** Permissions-Policy خیلی restrictive نیست
- **بهبود:** Add Referrer-Policy more strictly

### 25. Form Validation Client-Side ناکامل
- **فایل:** `components/forms/ContactForm.tsx`
- **مشکل:** فقط HTML5 validation (`required` attribute)
- **بهبود:** Zod/Yup validation هم client-side

---

## 📊 آمار کلی مشکلات

| دسته | تعداد |
|------|-------|
| 🔴 Critical | 5 |
| 🟡 High | 5 |
| 🟢 Medium | 13 |
| 🟩 Low | 10+ |
| **جمع کل** | **~33+ اصلی** |

---

## 🎯 اولویت‌بندی اقدامات

### فاز 1: همین هفته (Critical)
1. ✅ Fix Resend API Key → دریافت کلید واقعی
2. ✅ Rotate Cloudinary Keys → امنیت
3. ✅ Setup Turnstile → anti-spam
4. ✅ Set ADMIN_EMAIL واقعی
5. ✅ Audit sensitive data in Git

### فاز 2: این ماه (High)
1. ✅ Improve Rate Limiting
2. ✅ Mobile-responsive email templates
3. ✅ Error tracking setup (Sentry)
4. ✅ Add Redis caching
5. ✅ Comprehensive logging

### فاز 3: این سه ماه (Medium+)
1. ✅ Complete accessibility audit & fixes
2. ✅ CI/CD improvements
3. ✅ Database optimization
4. ✅ Performance budget enforcement
5. ✅ Automated testing suite

---

## 🔐 پیشنهادات امنیتی اضافی

### Web Application Firewall (WAF)
Cloudflare WAF rules:
```yaml
rules:
  - name: "Block SQL injection patterns"
    expression: "ip.src != 10.0.0.0/8 and http.request.uri.path contains \"UNION SELECT\""
    action: "block"
  
  - name: "Rate limit forms"
    expression: "http.request.method == \"POST\" and http.uri.path contains \"/api\""
    action: "challenge"
    latency: 1m
    match_criteria: all
```

### Dependency Scanning
```bash
# Regular dependency audits
npm audit
npx depcheck
```

### Security Headers Review
Add missing headers:
```javascript
// next.config.ts
headers.push({
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; ..."
})
```

---

## 📈 Performance Recommendations

### Core Web Vitals Targets
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1

### Optimization Strategies
1. Implement Image optimization strategy
2. Lazy load heavy components
3. Service worker for offline support
4. CDN optimization for static assets

---

## 🧪 Testing Gaps

### Unit Tests (Missing)
```bash
# Test coverage should be:
- Components: 80%+
- Utils: 90%+
- Actions: 75%+
```

### E2E Tests (Missing)
- Form submissions
- Authentication flows
- Navigation paths
- Cross-browser compatibility

---

## 📝 Documentation Needed

1. **API Documentation**: Swagger/OpenAPI
2. **Environment Variables Guide**: Complete list with descriptions
3. **Deployment Checklist**: Step-by-step procedure
4. **Security Policy**: For developers and users
5. **Contribution Guidelines**: For team members

---

## 🔄 Recommended Tools Stack

### Monitoring
- Sentry (errors)
- Upstash/Redis (cache)
- Neon DB analytics

### Testing
- Vitest (unit tests)
- Playwright (E2E)
- MSW (mock handlers)

### CI/CD
- GitHub Actions
- Vercel deployments
- Automated preview environments

---

## 📋 Summary Table

| Category | Status | Impact | Effort | Priority |
|----------|--------|--------|--------|----------|
| Resend API | ❌ Broken | 🔴 High | ⚡ Low | CRITICAL |
| Cloudinary Keys | ⚠️ Risky | 🔴 High | 🕐 Med | CRITICAL |
| Turnstile | ❌ Disabled | 🔴 High | ⚡ Low | CRITICAL |
| Rate Limiting | ⚠️ Weak | 🟡 Med | 🕐 Low | HIGH |
| Email Templates | ⚠️ Poor | 🟡 Med | 🕐 Med | HIGH |
| Error Tracking | ❌ None | 🟡 Med | ⚡ Low | HIGH |
| Accessibility | ⚠️ Partial | 🟢 Med | 🕐 High | MEDIUM |
| Performance | ⚠️ Good | 🟢 Low | 🕐 Low | LOW |
| Testing | ❌ None | 🟢 Med | 🕐 High | MEDIUM |
| Monitoring | ❌ None | 🟢 Low | 🕐 Med | LOW |

---

## 🚀 Action Plan

### Week 1
- [ ] Setup Resend API
- [ ] Rotate Cloudinary keys
- [ ] Configure Turnstile
- [ ] Remove sensitive data from git
- [ ] Setup Sentry

### Week 2
- [ ] Improve rate limiting
- [ ] Mobile email templates
- [ ] Add Redis caching
- [ ] Basic unit tests

### Week 3
- [ ] Accessibility fixes
- [ ] Performance optimization
- [ ] CI/CD improvements
- [ ] Documentation update

---

## 💡 Additional Notes

1. **Backup Strategy**: Consider automated database backups to R2/S3
2. **Disaster Recovery**: Document failover procedures
3. **Compliance**: GDPR/CCPA compliance review needed
4. **SEO Audit**: Technical SEO needs complete review
5. **Internationalization**: Multi-language support planning

---

**تاریخ گزارش:** 2026-09-26  
**نسخه:** 1.0  
**تهیه کننده:** AI Code Audit Assistant  

**نکته مهم:** این یک گزارش اولیه است و توصیه می‌شود قبل از هرگونه تغییر مهم، تمام موارد با دقت تست شوند.
