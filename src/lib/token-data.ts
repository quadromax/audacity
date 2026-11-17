import { z } from "zod";
import { safeUrl } from "./validation";
export type TokenMetadata = {
  name: string;
  symbol: string;
  description: string | null;
  socials: {
    x: string | null;
    telegram: string | null;
    discord: string | null;
  };
  source: "DexScreener" | "Pump.fun" | null;
};
export const defaultMetadata = (): TokenMetadata => ({
  name: "AUDACITY",
  symbol: "AUDACITY",
  description: null,
  socials: { x: null, telegram: null, discord: null },
  source: null,
});
const numeric = z.number().finite().nonnegative().nullish();
export const pairSchema = z.object({
  dexId: z.string().max(80).optional(),
  chainId: z.string(),
  baseToken: z.object({
    address: z.string(),
    name: z.string().max(150).optional(),
    symbol: z.string().max(30).optional(),
  }),
  pairAddress: z.string().regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/),
  priceUsd: z.string().nullish(),
  marketCap: numeric,
  liquidity: z.object({ usd: numeric }).nullish(),
  volume: z.object({ h24: numeric }).nullish(),
  priceChange: z.object({ h24: z.number().finite().nullish() }).nullish(),
  info: z
    .object({
      socials: z
        .array(
          z.object({
            type: z.string().optional(),
            url: z.string().optional(),
            platform: z.string().optional(),
            handle: z.string().optional(),
          }),
        )
        .nullish(),
    })
    .nullish(),
});
export type TokenPair = z.infer<typeof pairSchema>;
export function parsePairs(input: unknown, mint: string) {
  if (!Array.isArray(input)) throw new Error("Invalid provider response");
  return input
    .flatMap((value) => {
      const result = pairSchema.safeParse(value);
      return result.success &&
        result.data.chainId === "solana" &&
        result.data.baseToken.address === mint
        ? [result.data]
        : [];
    })
    .sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0));
}
export function socialUrls(
  entries: {
    type?: string;
    url?: string;
    platform?: string;
    handle?: string;
  }[] = [],
): TokenMetadata["socials"] {
  const result = defaultMetadata().socials;
  for (const e of entries) {
    const type = (e.type || e.platform || "").toLowerCase();
    let value = e.url;
    if (!value && e.handle) {
      const handle = e.handle.replace(/^@/, "");
      if (/^[a-zA-Z0-9_]{1,30}$/.test(handle)) {
        if (["x", "twitter"].includes(type)) value = `https://x.com/${handle}`;
        if (type === "telegram") value = `https://t.me/${handle}`;
      }
    }
    if (["x", "twitter"].includes(type))
      result.x = safeUrl(value, ["x.com", "twitter.com"]);
    if (type === "telegram") result.telegram = safeUrl(value, ["t.me"]);
    if (type === "discord")
      result.discord = safeUrl(value, ["discord.gg", "discord.com"]);
  }
  return result;
}
export function metadataFromPair(p: TokenPair): TokenMetadata {
  return {
    name: p.baseToken.name?.trim() || "AUDACITY",
    symbol: p.baseToken.symbol?.trim() || "AUDACITY",
    description: null,
    socials: socialUrls(p.info?.socials ?? []),
    source: "DexScreener",
  };
}
export const pumpSchema = z.object({
  mint: z.string(),
  name: z.string().max(150),
  symbol: z.string().max(30),
  description: z.string().max(6000).nullish(),
  twitter: z.string().nullish(),
  telegram: z.string().nullish(),
});
