# AUDACITY performance pass — 17 November 2026

The existing site was optimized in place. No artwork, content, layout, palette, typeface, music, trading behavior, or interaction was replaced. Original source assets remain intact.

## Production Lighthouse results

Baseline is one clean run per device before implementation. After values are medians of three final runs; the three individual HTML and JSON reports are retained. Do not interpret a single local lab comparison as field Core Web Vitals.

| Metric | Mobile before | Mobile after | Desktop before | Desktop after |
| --- | ---: | ---: | ---: | ---: |
| Performance | 65 | **77** (72–78) | 68 | **97** (97–98) |
| First contentful paint | 1.69 s | 1.69 s | 0.45 s | 0.44 s |
| Largest contentful paint | 6.31 s | 5.40 s | 1.46 s | 1.16 s |
| Total blocking time | 433 ms | 160 ms | 505 ms | 0 ms |
| Cumulative layout shift | 0.0023 | 0 | 0.1388 | 0 |
| Initial transferred bytes | 1,302,747 | 679,397 | 1,836,150 | 789,185 |
| Initial image bytes | 726,412 | 101,727 | 1,239,499 | 190,359 |
| Initial JavaScript bytes | 309,736 | 305,312 | 318,235 | 313,969 |

Total transfer fell **47.8% mobile / 57.0% desktop**. Initial image transfer fell **86.0% / 84.6%**. JavaScript savings are modest; most transfer savings come from responsive image encoding and postponing offscreen artwork. Deferred images are still downloaded when a visitor reaches them.

Desktop exceeded 90. **Mobile did not reach 90**: its remaining LCP is approximately 5.4 seconds under slow-4G/4× CPU simulation. No animation was disabled to inflate the score. INP and real mid-range phone FPS were not measured; TBT is a lab responsiveness proxy, not INP.

### Conditions and reproducibility

- Lighthouse 13.6.0; installed Microsoft Edge headless; production `next build` / `next start`, `http://127.0.0.1:3149/`.
- Default simulated throttling, mobile 412×823, DPR 1.75, CPU multiplier 4, RTT 150 ms, throughput 1638.4 Kbps. Desktop uses Lighthouse's desktop preset.
- Browser storage/cache reset by Lighthouse; production image transformation cache warm. Default motion enabled throughout audits.
- The Windows host injects a Kaspersky script into HTTP responses. All comparison runs block **only** `*kaspersky-labs.com*`; no application resource is blocked. Initial unfiltered diagnostic reports are separate from the comparison baseline. Host rewriting also produces a document-compression warning; deployment/CDN compression should be checked on the actual origin.
- Final audits ran sequentially, without builds, lint, tests, or screenshots competing for CPU. Earlier experimental runs are not the reported final results.
- Local testing does not include production hosting latency, CDN behavior, or field visitors. Token configuration remains empty, so actual provider traffic was tested separately with explicitly mocked launch fixtures.

PowerShell reproduction (run each command to completion):

```powershell
npm run build
npm run start -- --port 3149
# In another terminal:
$env:CHROME_PATH='C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
npx --yes lighthouse@13.6.0 http://127.0.0.1:3149 --only-categories=performance --blocked-url-patterns='*kaspersky-labs.com*' --output=json --output=html --output-path=docs/performance/check-mobile --chrome-flags='--headless --no-sandbox' --quiet
npx --yes lighthouse@13.6.0 http://127.0.0.1:3149 --preset=desktop --only-categories=performance --blocked-url-patterns='*kaspersky-labs.com*' --output=json --output=html --output-path=docs/performance/check-desktop --chrome-flags='--headless --no-sandbox' --quiet
```

## Confirmed bottlenecks and changes

1. **Premature image downloads:** the offscreen cast portrait was preloaded, and a CSS gallery background requested the full original WebP at startup. Removed the portrait preload, replaced the same background with a responsive image at identical cover position/opacity/blend, and added a shared 300px viewport loader for offscreen location/gallery/ensemble artwork. Image boxes and alt text stay present; a noscript fallback retains artwork without JavaScript.
2. **Large image transfer:** enabled Next.js AVIF negotiation with WebP fallback and a one-day transformed-image cache TTL. Kept existing quality settings, dimensions, original files, and image composition. Hero resources have explicit high fetch priority.
3. **Homepage loading shift:** the root loading boundary initially rendered a short skeleton and footer before streaming the full static homepage. Scoped that existing loading screen to secondary routes. The home page now arrives directly in the HTML; secondary-route loading feedback remains.
4. **Late hero entrance:** GSAP started the entrance after hydration/imports and hid already-painted hero content. Moved that entrance to compositor CSS using the same distances, durations, delays/stagger, and a finely sampled equivalent of GSAP `power3.out`. Individual scale/translate properties avoid conflicts with the existing GSAP desktop parallax. Reduced-motion behavior remains static. Other GSAP scroll reveals/parallax and Motion gallery/menu transitions remain.
5. **JavaScript delivery:** use Motion's lightweight `m` components with asynchronous animation features; dynamically import soundtrack composition on opt-in and QR generation when a verified trading URL exists. The chart library already loaded dynamically and was preserved.
6. **Font loading:** use `next/font/local` with the exact existing Latin WOFF2 typefaces and weights, preloading and metric-adjusted fallbacks. No remote font request or typeface change.
7. **Redundant requests/subscriptions:** do not query/poll market data with no configured mint; copy buttons read stable site configuration directly instead of subscribing to market polling. Verified-mint request/caching and failure behavior remain intact.

## Validation

- Final production build, TypeScript, and lint passed.
- 29 unit tests passed.
- 19 production Playwright tests passed: eight responsive widths; exact clipboard plus unavailable/denied/failure fallbacks; audio opt-in/playback/volume/mute/persistence/navigation; gallery keyboard/swipe; mission persistence/reset; mobile menu/focus; route/metadata/artwork checks; WCAG checks; new viewport-loading and normal-motion entrance/GSAP checks.
- Mocked launch smoke passed: exact mint copying at six locations, verified Pump links, dynamically generated QR SVG, candlestick rendering/accessibility table, missing chart/Pump listing, invalid mint and API failure. The temporary QA mint was restored to the original empty setting in `finally`.
- Before/after full-page screenshots at 390px and 1440px: identical dimensions (390×10020 and 1440×8786). Mission progress was reset to match baseline state after scrolling to load artwork. Mean absolute RGB-channel difference is 0.421 mobile / 0.523 desktop on a 0–255 scale; fewer than 0.04% of channels differ by more than 20. The remaining differences are in re-encoded artwork. See `visual-comparison.json` and the PNGs.

## Reports

- [Mobile baseline](baseline-mobile.report.html) / [Desktop baseline](baseline-desktop.report.html)
- [Mobile final run 1](after-mobile-1.report.html), [run 2](after-mobile-2.report.html), [run 3](after-mobile-3.report.html)
- [Desktop final run 1](after-desktop-1.report.html), [run 2](after-desktop-2.report.html), [run 3](after-desktop-3.report.html)
