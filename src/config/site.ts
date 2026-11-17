import "server-only";
import { TOKEN_MINT_ADDRESS } from "./token";
import { validMint } from "@/lib/validation";
export function getSiteConfig() {
  const mint = validMint(TOKEN_MINT_ADDRESS.trim());
  return {
    name: "AUDACITY",
    symbol: "AUDACITY",
    mint,
    invalidMint: Boolean(TOKEN_MINT_ADDRESS.trim() && !mint),
    pump: mint ? `https://pump.fun/coin/${mint}` : null,
    dex: mint ? `https://dexscreener.com/solana/${mint}` : null,
    release: null,
    announcement: null,
    socials: { x: null, telegram: null, discord: null },
    authEnabled: false,
  };
}
export type SiteConfig = ReturnType<typeof getSiteConfig>;
