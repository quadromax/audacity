# Contract marketing implementation — exact changed files

## Application
- Added src/config/token.ts — sole editable token mint.
- Removed src/config/launch.ts — superseded, no duplicate setting.
- Updated src/config/site.ts — validates and derives URLs from token.ts.
- Added src/components/world/token-promotion.tsx — shared full-address panels, copy confirmation, QR, sticky banner and mobile bar.
- Updated src/components/world/opening.tsx — contract-led hero composition.
- Updated src/components/world/after-hours.tsx — GET $JASON closing and full contract panel.
- Updated src/components/world/controls.tsx — unified prelaunch and copy messages.
- Updated src/app/layout.tsx — global contract promotion and token-focused metadata.
- Added src/app/promotion.css — desktop/mobile composition, safe-area trading controls, lighting and panel styles.
- Added src/app/opengraph-image.tsx — generated social preview reflecting configured mint or prelaunch.

## Dependencies and checks
- Updated package.json and package-lock.json — qrcode-generator.
- Updated tests/launch-smoke.mjs — generated random development-only address, all four copy/buy entry points, chart/QR URLs, mobile menu, errors and screenshots; always restores original config.
- Updated tests/e2e/site.spec.ts — title spacing against the new contract panel.
- Added tests/promotion-capture.mjs — verifies empty-mint prelaunch and captures screenshots.

## Documentation
- Updated README.md, .env.example and docs/ADMIN.md to point at token.ts.
- Updated docs/VERIFICATION.md.
- Added docs/PROMOTION-CHANGES.md (this file).
- Added docs/screenshots/promotion/development-1440.png, development-390.png, prelaunch-1440.png, prelaunch-390.png, full-1440.png, full-390.png, social-preview.png.
- Refreshed browser-suite screenshots under docs/screenshots/after.

## Actual validation
Lint passed. Final production build passed including TypeScript and social-image generation. All 22 unit tests and all 7 browser tests passed; responsive coverage includes 320, 375, 390, 430, 768, 1024, 1440 and 1920 pixels. The separate configured-mint smoke test passed all four copy entry points with exact clipboard comparison, Pump.fun and chart URLs, QR destination, mobile navigation, no page errors and no overflow at 1440/390. Empty-mint capture passed after restoration.

The development screenshot addresses are random 32-byte test addresses, clearly labeled, and not real unrelated project contracts. They are not retained in token.ts or the final production build. No trade was executed. Actual token listings, provider data and third-party chart availability depend on the owner's future mint.

QR is generated locally from the derived Pump.fun URL; no external QR service or credential is needed. Missing statistics remain omitted. Configured address format validation is not a claim that a token is verified by Pump.fun or another authority.
