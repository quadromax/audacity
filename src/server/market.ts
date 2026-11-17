import "server-only";
import { unstable_cache } from "next/cache";
import { getSiteConfig } from "@/config/site";
import {
  parsePairs,
  metadataFromPair,
  defaultMetadata,
  pumpSchema,
  socialUrls,
} from "@/lib/token-data";
import type { Market } from "@/lib/types";
import { verifyMint } from "./mint";
async function publicJson(url: string, timeout = 6000) {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(timeout),
    headers: { Accept: "application/json" },
    redirect: "error",
  });
  if (!res.ok) throw new Error(`Public feed ${res.status}`);
  return res.json();
}
/** Fixed upstream origins only: metadata never causes arbitrary URI fetching. */
export async function fetchMarket(
  mint: string | null,
  invalid = false,
): Promise<Market> {
  const empty: Market = {
    mint,
    verification: "pending",
    pumpAvailable: false,
    pairAddress: null,
    dexName: null,
    status: invalid ? "invalid" : mint ? "unavailable" : "prelaunch",
    price: null,
    marketCap: null,
    change: null,
    volume: null,
    liquidity: null,
    holders: null,
    network: "unavailable",
    updatedAt: null,
    pairUrl: null,
    metadata: defaultMetadata(),
  };
  if (!mint) return empty;
  const [dex, pump, verificationResult] = await Promise.allSettled([
    publicJson(`https://api.dexscreener.com/token-pairs/v1/solana/${mint}`),
    publicJson(`https://frontend-api-v3.pump.fun/coins/${mint}`, 4000),
    verifyMint(mint),
  ]);
  const verification =
    verificationResult.status === "fulfilled"
      ? verificationResult.value
      : "unavailable";
  empty.verification = verification;
  if (verification !== "verified") return { ...empty, status: "unverified" };
  let metadata = defaultMetadata();
  if (pump.status === "fulfilled") {
    const result = pumpSchema.safeParse(pump.value);
    if (result.success && result.data.mint === mint) {
      empty.pumpAvailable = true;
      const p = result.data;
      metadata = {
        name: p.name || metadata.name,
        symbol: p.symbol || metadata.symbol,
        description: p.description?.trim().slice(0, 1200) || null,
        source: "Pump.fun",
        socials: socialUrls([
          { type: "twitter", url: p.twitter || undefined },
          { type: "telegram", url: p.telegram || undefined },
        ]),
      };
    }
  }
  if (dex.status === "rejected") return { ...empty, metadata };
  try {
    const pairs = parsePairs(dex.value, mint),
      p = pairs[0];
    if (!p) return { ...empty, status: "unlisted", metadata };
    const dexMeta = metadataFromPair(p);
    metadata = {
      ...dexMeta,
      description: metadata.description,
      socials: {
        x: dexMeta.socials.x || metadata.socials.x,
        telegram: dexMeta.socials.telegram || metadata.socials.telegram,
        discord: dexMeta.socials.discord || metadata.socials.discord,
      },
    };
    const price = p.priceUsd ? Number(p.priceUsd) : NaN;
    return {
      ...empty,
      status: "live",
      price: Number.isFinite(price) && price >= 0 ? price : null,
      marketCap: p.marketCap ?? null,
      change: p.priceChange?.h24 ?? null,
      volume: p.volume?.h24 ?? null,
      liquidity: p.liquidity?.usd ?? null,
      updatedAt: new Date().toISOString(),
      pairUrl: `https://dexscreener.com/solana/${p.pairAddress}`,
      pairAddress: p.pairAddress,
      dexName: p.dexId || null,
      network: "online",
      metadata,
    };
  } catch {
    return { ...empty, metadata };
  }
}
const cached = unstable_cache(fetchMarket, ["public-token-v4-verified"], {
  revalidate: 45,
});
export async function market() {
  const { mint, invalidMint } = getSiteConfig();
  return cached(mint, invalidMint);
}
