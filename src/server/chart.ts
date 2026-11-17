import "server-only";
import { unstable_cache } from "next/cache";
import { z } from "zod";
import { market } from "./market";
export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};
export type ChartData = {
  status: "available" | "unavailable";
  candles: Candle[];
  interval: "1H";
  source: "GeckoTerminal";
  mint: string | null;
  pool: string | null;
};
const candleSchema = z.tuple([
  z.number().int().positive(),
  z.number().finite().nonnegative(),
  z.number().finite().nonnegative(),
  z.number().finite().nonnegative(),
  z.number().finite().nonnegative(),
  z.number().finite().nonnegative(),
]);
export function parseCandles(value: unknown): Candle[] {
  const rows = z.array(candleSchema).safeParse(value);
  if (!rows.success) return [];
  const unique = new Map<number, Candle>();
  for (const [time, open, high, low, close, volume] of rows.data) {
    if (
      high < Math.max(open, close) ||
      low > Math.min(open, close) ||
      low > high ||
      time > Date.now() / 1000 + 300
    )
      continue;
    unique.set(time, { time, open, high, low, close, volume });
  }
  return [...unique.values()].sort((a, b) => a.time - b.time);
}
async function json(url: string) {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(7000),
    headers: { Accept: "application/json" },
    redirect: "error",
  });
  if (!res.ok) throw Error("Chart feed unavailable");
  return res.json();
}
export async function fetchChart(
  mint: string,
  pool: string,
): Promise<ChartData> {
  const empty: ChartData = {
    status: "unavailable",
    candles: [],
    interval: "1H",
    source: "GeckoTerminal",
    mint,
    pool,
  };
  try {
    const base =
      "https://api.geckoterminal.com/api/v2/networks/solana/pools/" +
      encodeURIComponent(pool);
    const details = await json(base);
    // Verify the pool and base token before requesting any price history.
    if (
      details.data?.id !== "solana_" + pool ||
      details.data?.relationships?.base_token?.data?.id !== "solana_" + mint
    )
      return empty;
    const data = await json(
      base + "/ohlcv/hour?aggregate=1&limit=168&currency=usd&token=base",
    );
    const candles = parseCandles(data.data?.attributes?.ohlcv_list);
    return candles.length > 1
      ? { ...empty, status: "available", candles }
      : empty;
  } catch {
    return empty;
  }
}
const cachedChart = unstable_cache(fetchChart, ["audacity-ohlcv-v1"], {
  revalidate: 60,
});
export async function chart() {
  const data = await market();
  if (data.verification !== "verified" || !data.mint || !data.pairAddress)
    return {
      status: "unavailable",
      candles: [],
      interval: "1H",
      source: "GeckoTerminal",
      mint: data.mint,
      pool: null,
    } satisfies ChartData;
  return cachedChart(data.mint, data.pairAddress);
}
