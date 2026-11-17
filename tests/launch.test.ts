import { vi, it, expect, afterEach } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));
import { verifyMint } from "../src/server/mint";
import { fetchChart, parseCandles } from "../src/server/chart";
import { DEMO_CA } from "../src/lib/launch";
import { validMint } from "../src/lib/validation";
import { fetchMarket } from "../src/server/market";
const mint = "So11111111111111111111111111111111111111112";
afterEach(() => vi.unstubAllGlobals());
it("demo presentation cannot validate as an address", () =>
  expect(validMint(DEMO_CA)).toBeNull());
it("rejects absent accounts, wallets, holding accounts, wrong owners and uninitialized mints", async () => {
  const values = [
    null,
    {
      owner: "11111111111111111111111111111111",
      executable: false,
      data: ["", "base64"],
    },
    ...[
      { owner: "wrong", type: "mint", initialized: true },
      {
        owner: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        type: "account",
        initialized: true,
      },
      {
        owner: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        type: "mint",
        initialized: false,
      },
    ].map((v) => ({
      owner: v.owner,
      executable: false,
      data: {
        parsed: { type: v.type, info: { isInitialized: v.initialized } },
      },
    })),
  ];
  for (const value of values) {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ result: { value } })),
    );
    expect(await verifyMint(mint)).toBe("not-mint");
  }
});
it("verifies both initialized SPL token programs", async () => {
  for (const owner of [
    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
  ]) {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({
          result: {
            value: {
              owner,
              executable: false,
              data: { parsed: { type: "mint", info: { isInitialized: true } } },
            },
          },
        }),
      ),
    );
    expect(await verifyMint(mint)).toBe("verified");
  }
});
it("RPC failure never activates trading even when metadata claims a token", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) =>
      url.includes("mainnet-beta")
        ? Response.json({ error: { code: -32005 } })
        : Response.json({ mint, name: "Claim", symbol: "CLAIM" }),
    ),
  );
  expect(await fetchMarket(mint)).toMatchObject({
    verification: "unavailable",
    pumpAvailable: false,
    status: "unverified",
  });
});
it("validates and orders real OHLCV, rejecting invalid price bounds", () => {
  expect(
    parseCandles([
      [200, 2, 3, 1, 2, 10],
      [100, 1, 2, 0.5, 1.5, 4],
      [300, 3, 1, 2, 3, 5],
    ]),
  ).toEqual([
    { time: 100, open: 1, high: 2, low: 0.5, close: 1.5, volume: 4 },
    { time: 200, open: 2, high: 3, low: 1, close: 2, volume: 10 },
  ]);
  expect(parseCandles([[100, "bad", 2, 1, 1, 3]])).toEqual([]);
});
it("chart refuses a mismatched base token and does not request its candles", async () => {
  const fetch = vi.fn(async () =>
    Response.json({
      data: {
        id: "solana_" + mint,
        relationships: { base_token: { data: { id: "solana_wrong" } } },
      },
    }),
  );
  vi.stubGlobal("fetch", fetch);
  expect((await fetchChart(mint, mint)).status).toBe("unavailable");
  expect(fetch).toHaveBeenCalledTimes(1);
});
it("chart renders only provider candles for the verified pool and handles rate limits", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) =>
      Response.json(
        url.includes("ohlcv")
          ? {
              data: {
                attributes: {
                  ohlcv_list: [
                    [100, 1, 2, 0.5, 1.5, 4],
                    [200, 2, 3, 1, 2, 10],
                  ],
                },
              },
            }
          : {
              data: {
                id: "solana_" + mint,
                relationships: {
                  base_token: { data: { id: "solana_" + mint } },
                },
              },
            },
      ),
    ),
  );
  expect(await fetchChart(mint, mint)).toMatchObject({
    status: "available",
    mint,
    pool: mint,
    candles: expect.any(Array),
  });
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response("", { status: 429 })),
  );
  expect(await fetchChart(mint, mint)).toMatchObject({
    status: "unavailable",
    candles: [],
  });
});
