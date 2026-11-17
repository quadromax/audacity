import { vi, it, expect, afterEach } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));
import { fetchMarket } from "../src/server/market";
import { socialUrls, parsePairs } from "../src/lib/token-data";
const mint = "So11111111111111111111111111111111111111112";
const pair = {
  chainId: "solana",
  baseToken: { address: mint, name: "Jason Test", symbol: "TEST" },
  pairAddress: mint,
  priceUsd: "0.01",
  fdv: 999999,
  volume: { h24: 5555 },
  liquidity: { usd: 12000 },
};
afterEach(() => vi.unstubAllGlobals());
function feeds(dex: unknown, pump: unknown = {}) {
  vi.stubGlobal(
    "fetch",
    vi.fn(
      async (url: string) =>
        new Response(
          JSON.stringify(
            url.includes("dexscreener")
              ? dex
              : url.includes("mainnet-beta")
                ? {
                    result: {
                      value: {
                        owner: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                        executable: false,
                        data: {
                          parsed: {
                            type: "mint",
                            info: { isInitialized: true },
                          },
                        },
                      },
                    },
                  }
                : pump,
          ),
        ),
    ),
  );
}
it("prelaunch and invalid configurations never fetch or fabricate metrics", async () => {
  const fetch = vi.fn();
  vi.stubGlobal("fetch", fetch);
  expect(await fetchMarket(null)).toMatchObject({
    status: "prelaunch",
    price: null,
    marketCap: null,
    holders: null,
  });
  expect((await fetchMarket(null, true)).status).toBe("invalid");
  expect(fetch).not.toHaveBeenCalled();
});
it("uses exact token metadata and never substitutes FDV for market cap", async () => {
  feeds([pair]);
  expect(await fetchMarket(mint)).toMatchObject({
    status: "live",
    price: 0.01,
    marketCap: null,
    volume: 5555,
    holders: null,
    metadata: { name: "Jason Test", symbol: "TEST" },
  });
});
it("chooses highest liquidity exact Solana base token", () => {
  expect(
    parsePairs(
      [
        {
          ...pair,
          baseToken: { address: "wrong" },
          liquidity: { usd: 999999 },
        },
        { ...pair, chainId: "ethereum" },
        pair,
        { ...pair, liquidity: { usd: 20000 } },
      ],
      mint,
    ),
  ).toHaveLength(2);
  expect(
    parsePairs([pair, { ...pair, liquidity: { usd: 20000 } }], mint)[0]
      .liquidity?.usd,
  ).toBe(20000);
});
it("uses matching Pump metadata before a pair is listed", async () => {
  feeds([], {
    mint,
    name: "Jason",
    symbol: "JD",
    description: "Story",
    twitter: "https://x.com/jason",
  });
  expect(await fetchMarket(mint)).toMatchObject({
    status: "unlisted",
    price: null,
    metadata: {
      symbol: "JD",
      description: "Story",
      socials: { x: "https://x.com/jason" },
    },
  });
});
it("rejects mismatched Pump metadata", async () => {
  feeds([], { mint: "other", name: "Wrong", symbol: "BAD" });
  expect((await fetchMarket(mint)).metadata.source).toBeNull();
});
it("handles malformed and rate limited responses honestly", async () => {
  feeds({ bad: true });
  expect((await fetchMarket(mint)).status).toBe("unavailable");
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response("{}", { status: 429 })),
  );
  expect((await fetchMarket(mint)).status).toBe("unverified");
});
it("handles outages without manufacturing values", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => {
      throw Error("offline");
    }),
  );
  expect(await fetchMarket(mint)).toMatchObject({
    status: "unverified",
    price: null,
    volume: null,
  });
});
it("sanitizes social links from external metadata", () => {
  expect(
    socialUrls([
      { type: "twitter", url: "https://evil.example/x" },
      { type: "telegram", url: "javascript:alert(1)" },
      { platform: "discord", url: "https://discord.gg/test" },
    ]),
  ).toEqual({ x: null, telegram: null, discord: "https://discord.gg/test" });
});
