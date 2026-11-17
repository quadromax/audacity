# AUDACITY — eight launch refinements

Implemented in the existing project. No deployment was performed. The real token setting remains empty.

## Acceptance checklist

1. **Header:** removed prelaunch terminology, kept AUDACITY/Solana identity, moved legal and financial-risk text to accessible footer content. No affiliation claim was introduced.
2. **How to buy:** exact requested three-step copy, official phantom.com link, cream layout retained, metadata-aware Pump.fun CTA disabled until verification succeeds.
3. **CA/status:** one owner-editable mint; consistent address presentation in banner, hero, mobile controls, market, final section and footer. Explicit demo label, gently pulsing green LAUNCHING SOON indicator; reduced-motion override. Full actual address copying with COPIED feedback. Public Solana account verification and matching Pump metadata gate trading.
4. **About:** concise editorial introduction, no repetitive non-affiliation paragraph in the two-column body, footer legal link retained.
5. **Market:** redesigned dark terminal, actual metadata/price/cap/liquidity/volume/24h movement, selected pool information, refresh action, native candlestick chart, accessible history table, error/loading/unlisted states. Real hourly OHLCV only; no fictional chart or transactions.
6. **Wanted:** two-column composition, numeric level, progress track, five stars, mission cards and completion states. Real interaction tracking, local persistence and confirm/cancel reset. No rewards, allocation or leaderboard.
7. **Audio:** original 80 BPM ambient electronic Web Audio composition, stereo pads, bass, subtle percussion and delay. Seamless loop with wrapped effect tails. Navigation control, mute, gain fades, volume slider, saved preference, explicit opt-in, route continuity and context cleanup. No copyrighted recording or claimed third-party music license.
8. **Production:** AUDACITY metadata, local AU icon, Jason/Lucia social image, sitemap/robots, dev indicator disabled, obsolete dossier and migration script removed, package rebranded. Third-party license and audit history retained.

## Main source changes

| Area | Files |
| --- | --- |
| Shared contract/status | src/components/world/token-promotion.tsx; controls.tsx; src/lib/launch.ts; src/hooks/use-token.ts |
| Verification and feeds | src/server/mint.ts; market.ts; chart.ts; src/app/api/chart/route.ts; src/lib/types.ts; token-data.ts |
| Market and chart UI | src/components/world/exchange.tsx; price-chart.tsx |
| Missions and storage | src/components/world/after-hours.tsx; cast-gallery.tsx; src/components/providers.tsx |
| Audio | src/components/world/audio-widget.tsx; src/lib/soundtrack.ts |
| Navigation, buying, about | src/components/world/navigation.tsx; audacity.tsx; src/app/[slug]/page.tsx |
| Presentation/metadata | src/app/launch.css; audacity.css; layout.tsx; opengraph-image.tsx; sitemap.ts; src/components/motion.tsx; next.config.ts |
| Tests | tests/launch.test.ts; market.test.ts; e2e/site.spec.ts; launch-smoke.mjs; motion-smoke.mjs |
| Documentation/dependencies | README.md; docs/ASSETS.md; this file; package.json; package-lock.json; public/licenses/* |

The earlier AUDACITY transformation also added src/config/characters.ts, the full public/assets/audacity roster, CastGallery, AudacityHero and AudacityTakeover. This pass preserves that artwork and composition.

## Actual verification

- TypeScript, ESLint and production build passed.
- Vitest: **29 tests passed** across five files, including existing database/wallet validation and new mint/OHLCV checks.
- Production Playwright: **11 tests passed**. All primary routes/legacy redirects, all eight characters, both Dimez, keyboard and swipe, five missions, persistence/reset, downloads/share, demo state, audio opt-in/playback/volume/persistence/navigation, storage failure, location switcher and automated WCAG checks.
- Eight responsive widths: 320, 375, 390, 430, 768, 1024, 1440, 1920. No horizontal overflow.
- Launch smoke: exact clipboard at six locations; actual metadata ticker; derived Pump/QR/chart URLs; chart canvas and accessible table; unavailable OHLCV fallback; absent Pump listing; non-mint rejection; API outage. All launch data was explicitly intercepted QA fixture data. Original token setting restored.
- Normal-motion smoke passed: hero entrance, gallery transition, scroll reveal and client navigation, with no application or GSAP errors.
- Host caveat: local Kaspersky injects an external script which the application CSP blocks. The browser assertion excludes only that identified host-injection warning; security policy remains intact.
- Screenshots: docs/screenshots/launch/ contains full pages at eight widths, modified sections at desktop/mobile, standalone routes, Real Dimez, navigation and social preview.

## Service and deployment limits

Public Solana RPC, Pump.fun, DexScreener and GeckoTerminal can rate-limit or omit a listing. Failed verification keeps trading disabled. A verified mint is not proof of project ownership or safety. No real project mint was provided; public project-market activity and a purchase could not be validated.

Only TOKEN_MINT_ADDRESS in src/config/token.ts is token-specific. Rebuild/restart after changing it. For public hosting, set the normal deployment origin NEXT_PUBLIC_APP_URL so social and sitemap URLs use the actual domain.

Primary integration references: [Solana getAccountInfo](https://solana.com/docs/rpc/http/getaccountinfo), [GeckoTerminal API](https://api.geckoterminal.com/docs/index.html), [Lightweight Charts documentation](https://tradingview.github.io/lightweight-charts/docs).

Section-detail screenshots temporarily hide fixed header/mobile chrome during capture so it cannot obscure content taller than the viewport. Full-page and opening captures retain the actual controls.
Final visual follow-up: moved audio into navigation, confirmed the 320px volume popover fits, corrected mobile ensemble clipping and layering so all nine faces are visible, and rebuilt successfully. The eight-width responsive check was repeated after the crop change and passed.
