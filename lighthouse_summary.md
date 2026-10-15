Local production build (`next build && next start`), Lighthouse 12, simulated throttling.
Mobile = default mobile preset; desktop = `--preset=desktop`. 2026-10-15.

| Route | Mobile perf | Desktop perf | Accessibility | Best Practices | SEO |
|---|---|---|---|---|---|
| / | 95 (was 48) | 100 (was 92) | 100 (was 88) | 100 | 100 |
| /portfolio | 92 | 99 | 96 | 100 | 100 |
| /portfolio/nutave | 89 | – | 96 | 96¹ | 100 |
| /portfolio/spicevo | 91 | – | 100 | 96¹ | 100 |
| /ecosystem | 89 | – | 100 | 100 | 100 |
| /rfq | 92 | 100 | 98 | 100 | 100 |
| /waitlist | 93 | – | 100 | 100 | 100 |
| /contact | 93 | – | 98 | 100 | 100 |
| /legal | 91 | – | 96 | 100 | 100 |
| /about | 91 | – | 100 | 100 | 100 |
| /web | 90 | – | 96 | 100 | 100 |

¹ Cloudinary hero images can't be fetched from the sandbox (console 500 from `/_next/image`); not a site defect.
/login scores 66 on SEO by design (`noindex`).

Home page before → after: LCP 7.6 s → observed 0.45 s (Lighthouse-simulated 2.7 s), TBT 1,420 ms → 140 ms,
CLS 0.057 → 0, JS transferred ≈ 1 MB → ≈ 320 KB, TTFB 275 ms → 37 ms (static ISR, CDN-cacheable).
