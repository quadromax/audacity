# Redesign verification — 17 November 2026

## Completed implementation

Replaced the prior repeated cards and credential-dependent public UI with seven art-directed scenes. Added an original transparent character and tropical environment, layered display typography, independent mobile composition, GSAP entrance and desktop parallax, Motion dossier transitions, paper archive, analog exchange, cosmetic discoveries, original downloads, sharing and a closing scene. Removed obsolete visual components and Lenis.

The sole token setting is src/config/launch.ts. It is restored to an empty string. No test mint or fixture market value remains in production configuration.

## Executed checks

- npm run lint: passed.
- npm run typecheck: passed.
- npm test: 22 tests passed across public market parsing/fallbacks, validation, signed wallet verification and retained database rules.
- npm run build: passed, including TypeScript and static generation.
- npm run test:e2e: 7 production-browser tests passed on the second art-direction build (26.3 seconds), including eight-width overflow checks, title/trading-control spacing, and switching all three location scenes.
- npm uninstall lenis audit: 0 vulnerabilities reported.
- node tests/launch-smoke.mjs: passed configured mint links, fetched symbol, exact clipboard contents, chart activation, omitted unavailable holders, metadata social links and sharing clipboard fallback. Uses intercepted fixtures, restores configuration in finally.
- node tests/motion-smoke.mjs: passed normal-motion entrance, scroll reveal, dossier transition and client navigation without browser or GSAP errors.

Browser suite checks primary routes plus legacy redirects, loaded artwork, browser exceptions, empty links, eight responsive widths (320/375/390/430/768/1024/1440/1920), mobile dialog Escape/focus restoration/navigation, dossier keyboard controls, evidence/map actions, all five discoveries, local persistence/reset, real download, prelaunch API, unauthorized profile access, keyboard entry and automated axe WCAG A/AA checks across all four primary routes.

## Visual review

Before and after screenshots are in docs/screenshots/before and docs/screenshots/after. Desktop and mobile opening/full-page compositions were inspected. Additional after captures cover dossier, market, about, and mobile navigation.

Corrections found through visual and accessibility QA: mobile hero's clipped overflow container could be horizontally shifted by image focus/scrolling; changed it to overflow:clip. Increased closing-art source resolution for tall mobile crops. Darkened low-contrast paper labels. Made the expanded market briefing visible on initial render. Constrained desktop title size by viewport height to avoid text collision on wide, short screens.

## Limits

No actual project mint was provided. Real trading, the project's actual metadata, market liquidity and third-party chart availability cannot be confirmed before that mint exists. Launch control tests use clearly isolated fixtures, not real quotes. No transaction was signed or submitted.

Holder count is omitted. Missing metadata socials and market fields are omitted. Public upstream failures show unavailable status and recover on revalidation. Pump.fun metadata is a best-effort public endpoint, not a guaranteed service.

Automated accessibility checks supplement visual and keyboard inspection; they are not a formal audit. No field Core Web Vitals measurements or real-device lab performance certification were performed. No deployment was made. The workspace has no Git repository, so no commit was created.


## Second art-direction pass

Rebuilt the opening as a central character poster with layered title typography and an independently composed mobile version. Added a three-location interactive gallery, new causeway and night-drive artwork, an angled archive spread, a teal exchange, a burgundy wanted scene, revised poster composition and a night-drive closing. New generated assets and prompt directions are recorded in ASSETS.md.

Latest executed checks: lint, typecheck, production build, all 22 unit tests and all 7 browser tests passed. Normal-motion entrance, scroll, dossier transitions and client navigation also passed without browser or GSAP errors. Desktop and mobile hero screenshots and complete pages were visually inspected again. The screenshot loader now eagerly decodes current main-content images before capture rather than retaining stale image indices during rendering.

## Contract-marketing correction

The current configuration is src/config/token.ts; launch.ts has been removed. Contract recognition is now primary: sticky full-address banner, hero evidence plate with local QR and copy/buy/chart links, mobile safe-area trading bar, and GET $JASON closing panel. Social art includes the ticker and published mint or exact prelaunch message.

Validation: final production build including Open Graph generation passed; lint passed; 22 unit tests and 7 browser tests passed. The separate development-only random-address check passed all four copy/buy entry points, exact clipboard contents, chart/QR destinations, mobile navigation and no overflow at 1440/390. The original empty mint was restored and final prelaunch captured. Exact files and screenshots: PROMOTION-CHANGES.md.
