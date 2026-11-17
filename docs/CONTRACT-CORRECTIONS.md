# Targeted contract correction pass

The existing artwork, character positions, gallery, music, missions, market feeds and chart implementation were preserved. This pass changes the shared contract presentation and copy behavior only.

## Root cause and fix

The old CopyCA component had `disabled={!config.mint}`. With the real mint empty, every demo copy button was deliberately disabled. Its handler copied only `config.mint` and called the async Clipboard API without a fallback. The mobile banner also hid its copy control.

AddressDisplay and CopyCA now both use `displayedContract(config.mint)` from src/lib/launch.ts. This selects the exact same full real mint or centrally defined demo string. The sample is visibly labeled **Demo · Not live**, contains an intentionally invalid base58 character, and never enters trading URLs or provider requests.

The shared copyText utility first awaits navigator.clipboard.writeText. If unavailable or rejected, it attempts a temporary, selectable readonly textarea with the browser's native copy command. The temporary field is removed and focus/selection restored. Success requires a resolved async write or a true native-copy result. Total failure shows **COPY FAILED — TRY AGAIN**. Successful buttons show **COPIED!**, announce it accessibly, and reset after 2.5 seconds. Keeping the pending control focusable avoids losing keyboard focus during asynchronous fallback.

## Four areas verified

| Area | Result |
| --- | --- |
| Top sticky banner | AUDACITY, full underlying CA with visual truncation on narrow screens, subtle demo badge, LAUNCHING indicator, working 44px copy target; redundant action removed |
| Hero evidence card | Shared copy/display/status, paper styling, clearer hierarchy, official Solana SVG; dummy action and custom AU emblem removed |
| Repeated final card | Same TokenPanel implementation, identical CA and logo, independent successful copy control |
| Market terminal | Shared exact-copy utility, improved address typography, no empty trading-action wrapper; statistics/chart/feed logic retained |

Demo status is exactly **LAUNCHING**. The green pulse becomes static under reduced motion. Configured addresses still require on-chain mint verification; verified/missing-mint/unavailable states remain truthful. Pump.fun links still require matching public Pump metadata. The removed banner buy action is not replaced by a dummy button. Shared BuyAction renders no action while trading is unavailable, removing LAUNCHING SOON buttons everywhere it is reused.

## Exact changed files

Application:

- src/components/world/token-promotion.tsx
- src/components/world/exchange.tsx (only conditional trading-controls wrapper)
- src/lib/clipboard.ts (new)
- src/lib/launch.ts
- src/app/contract.css (new; scoped contract styles)
- src/app/layout.tsx (imports contract.css)

Asset and provenance:

- public/assets/branding/solana-logomark.svg (official, unchanged)
- public/assets/branding/SOURCE.md

Tests and handoff:

- tests/e2e/contract.spec.ts (new)
- tests/e2e/site.spec.ts (updated demo-state assertions)
- tests/launch-smoke.mjs (updated actions/feedback and added invalid-address check)
- README.md
- docs/CONTRACT-CORRECTIONS.md

New visual evidence is under docs/screenshots/contract-pass/. The actual token configuration file was restored byte-for-byte after isolated launch testing; it is still empty.

## Tests actually run

- TypeScript: passed.
- ESLint: passed with no errors or warnings.
- Production build: passed.
- Vitest: 29 tests passed, including Solana syntax, initialized-mint verification, wrong account types, provider errors and chart validation.
- Production Playwright: 17 tests passed. The new tests independently copied from all four requested areas at **320, 375, 390, 430, 768, 1024, 1440 and 1920px**, read the actual browser clipboard, and matched it to the full displayed value.
- Native clipboard fallback passed both with missing async write support and with an async permission denial. Focus restoration and temporary-element cleanup were checked.
- Total clipboard failure showed the error and never success. Retry recovered. Keyboard Enter and success-label timeout passed.
- No unwanted LAUNCHING SOON buttons, foreign trading links or horizontal overflow in demo mode. Authentic local SVGs loaded in both cards and retained the 101:88 source aspect ratio.
- Status animation/reduced-motion behavior passed. Automated WCAG checks passed on primary routes.
- Existing navigation, eight characters, touch/keyboard gallery, missions, persistence/reset, music/volume, storage failures, artwork downloads and location switching passed regression tests.
- Launch smoke used an explicitly isolated random QA address and intercepted verified-mint/market fixtures. Full real-address copying, metadata symbol, generated URLs/QR, chart fallback, missing Pump listing, non-mint rejection and outage states passed. An invalid configured string returned invalid status, no trading links, and copy matching the displayed demo. The original real-mint setting was restored in finally.

The host's Kaspersky-injected external script is blocked by the existing CSP; the existing test excludes only that identified host warning. No application security policy was weakened.

## Real launch setting and limits

Edit **src/config/token.ts**, set **TOKEN_MINT_ADDRESS**, then rebuild/restart. No second token-specific setting is required.

No real project mint was supplied, so configured launch UI was verified with clearly isolated fixtures; no trade was performed. Public Solana/Pump/DexScreener/GeckoTerminal availability and listing coverage can still limit verified trading or market information. Browser security restrictions can deny both clipboard methods; in that case the full address remains selectable and an honest error appears.

Solana logo source: https://github.com/solana-foundation/solana-com/blob/main/apps/web/public/src/img/branding/solanaLogoMark.svg. Brand guidance: https://solana.com/branding. The original gradient and geometry are unmodified; no Foundation affiliation is claimed.
Final visual refinement: success is shown on the button with a screen-reader announcement, avoiding a duplicate toast over the paper-card footer. After this refinement, all six contract browser tests and the WCAG route check were repeated and passed; the production build, typecheck and lint also passed again. Final production preview: http://127.0.0.1:3149.
