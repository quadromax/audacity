# AUDACITY

A cinematic GTA VI-inspired Solana token experience in the existing Next.js application. Jason and Lucia lead the opening; The Leonida Files covers eight entries and nine people. The character art, sunset palette, self-hosted typography, scene transitions, and downloadable environments are local assets.

## Run

Node.js 22 or newer:

```sh
npm ci
npm run dev
```

Production: `npm run build`, then `npm start`. No database, paid API, login, RPC credentials, or wallet connection is required for the core experience.

## The only token-specific setting

Edit `src/config/token.ts`:

```ts
export const TOKEN_MINT_ADDRESS: string = "";
```

Paste the actual token mint, then rebuild/restart. An empty setting shows a deliberately invalid, clearly marked **Demo · Not live** and **LAUNCHING**. The displayed demo can be copied in full; trading stays unavailable. The placeholder is never sent to a provider or used in a trading URL.

A syntactically valid address is displayed and can be copied in full. Trading is gated separately:
- Solana mainnet RPC must return an initialized mint owned by the SPL Token or Token-2022 program.
- Pump.fun must return matching mint metadata before its trading link and QR code activate.
- Missing accounts, wallets, token holding accounts, verification outages, and unsupported Pump listings do not activate trading.
- Verification is evidence of a token account type, not an endorsement, ownership check, liquidity guarantee, or investment assurance.

The server accepts only exact-mint Solana base-token pairs from DexScreener, selects the greatest reported liquidity, and caches for 45 seconds. Actual metadata supplies name, symbol and supported social links. Missing metrics remain absent; FDV is never substituted for market cap, and no holder count is invented.

The chart uses TradingView Lightweight Charts with GeckoTerminal hourly USD OHLCV. The pool and base token must match before history is accepted. It caches for 60 seconds, validates and sorts candles, and offers an accessible data table. Unsupported pools or feed outages show an unavailable state and, for a verified mint, an external chart link. No synthetic production series or transaction history exists.

## Experience

- `/`: opening, locations, complete cast, market, wanted missions, artwork sharing, buying instructions and final ensemble.
- `/cast`, `/files`, `/dossier`: all eight character entries, keyboard controls, touch swipes and expandable dossiers.
- `/markets`: the full market terminal.
- `/how-to-buy`: three steps and a verified Pump.fun action.
- `/about`: editorial introduction; independent-project and risk information is accessible in the footer.
- Legacy cred/wanted/missions/rewards routes remain redirects.
- Five device-local missions record opening a dossier, selecting another character, finding Real Dimez, viewing the market, and invoking sharing or successfully copying a share link. Downloading artwork alone does not award sharing progress. Reset requires confirmation.
- LEONIDA FM in the navigation is an original, locally synthesized Web Audio composition. It starts only after a click. Volume and preference persist; returning visitors must click to resume. Playback continues across internal navigation. On mobile, focusing the sound control reveals its volume slider.
- Storage failures do not break the experience. Progress and audio work for the current visit.

## Verification

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

Playwright uses installed Microsoft Edge and starts production on port 3147. Screenshots cover 320, 375, 390, 430, 768, 1024, 1440 and 1920px. See `docs/LAUNCH-CHANGES.md` and the latest targeted pass in `docs/CONTRACT-CORRECTIONS.md`.

With a dev server on port 3148, `node tests/launch-smoke.mjs` temporarily injects a random development-only address and intercepted API fixtures to verify exact copying, metadata, trading URLs, chart rendering, verification rejection and outages. It restores the original setting in a finally block. Do not run concurrently with builds or against a deployment. `node tests/motion-smoke.mjs` checks normal motion and captures standalone routes.

Public endpoints may throttle, omit new listings, or be unavailable. This intentionally disables unverified trading rather than treating an arbitrary address as a live token. No real project mint was supplied, so launch QA uses explicit fixtures; no project trade was executed.

The hosting origin for canonical social/sitemap URLs uses optional `NEXT_PUBLIC_APP_URL`; its local fallback is localhost. This is deployment configuration, not another token setting. Historical server-only database/auth modules remain, but are not part of the core UI or a launch prerequisite.

## Sources and notices

Original generated fan artwork is documented in `docs/ASSETS.md`. Character summaries reference [Rockstar’s profiles](https://www.rockstargames.com/VI/only-in-leonida). The project is independent of Rockstar Games and Take-Two Interactive.

Chart attribution and Apache-2.0 license are retained under `public/licenses/` and linked in the footer. Barlow Condensed and Inter retain SIL OFL licenses; Lucide retains ISC licensing. The audio uses no recordings, external samples, or GTA soundtrack material.


