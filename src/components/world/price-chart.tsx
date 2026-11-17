"use client";
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../providers";
import { useToken } from "@/hooks/use-token";
import type { Candle, ChartData } from "@/server/chart";
function Candles({ candles }: { candles: Candle[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false,
      cleanup = () => {};
    import("lightweight-charts").then(
      ({ createChart, CandlestickSeries, ColorType }) => {
        if (disposed || !ref.current) return;
        const chart = createChart(ref.current, {
          autoSize: true,
          layout: {
            background: { type: ColorType.Solid, color: "#17232c" },
            textColor: "#b8c0c4",
            fontSize: 10,
            attributionLogo: true,
          },
          grid: {
            vertLines: { color: "#ffffff08" },
            horzLines: { color: "#ffffff0d" },
          },
          timeScale: { timeVisible: true, secondsVisible: false },
          rightPriceScale: { borderColor: "#ffffff15" },
          handleScroll: { vertTouchDrag: false },
          handleScale: {
            axisPressedMouseMove: true,
            mouseWheel: false,
            pinch: true,
          },
        });
        const minPrice = Math.min(
          ...candles.map((c) => c.low).filter((v) => v > 0),
        );
        const precision = Math.min(
          12,
          Math.max(
            2,
            Number.isFinite(minPrice)
              ? Math.ceil(-Math.log10(minPrice)) + 3
              : 6,
          ),
        );
        const series = chart.addSeries(CandlestickSeries, {
          upColor: "#93c7ae",
          downColor: "#dd91a6",
          borderVisible: false,
          wickUpColor: "#93c7ae",
          wickDownColor: "#dd91a6",
          priceFormat: {
            type: "price",
            precision,
            minMove: Math.pow(10, -precision),
          },
        });
        series.setData(
          candles.map((c) => ({
            ...c,
            time: c.time as import("lightweight-charts").UTCTimestamp,
          })),
        );
        chart.timeScale().fitContent();
        cleanup = () => chart.remove();
      },
    );
    return () => {
      disposed = true;
      cleanup();
    };
  }, [candles]);
  return (
    <div
      ref={ref}
      className="candle-canvas"
      role="img"
      aria-label="Hourly USD candlestick chart from GeckoTerminal"
    />
  );
}
export function PriceChart() {
  const { config, data: market } = useToken();
  const enabled = Boolean(config.dex && market?.pairAddress);
  const query = useQuery({
    queryKey: ["chart", config.mint, market?.pairAddress],
    queryFn: () => api<ChartData>("/api/chart"),
    enabled,
    staleTime: 60000,
    refetchInterval: 60000,
    retry: 1,
  });
  const result = query.data;
  const available =
    enabled &&
    result?.status === "available" &&
    result.mint === config.mint &&
    result.pool === market?.pairAddress &&
    result.candles.length > 1;
  return (
    <div className="price-chart">
      <div className="chart-chrome mono">
        <span>PRICE / USD</span>
        <span>{available ? "1H CANDLES · UTC" : "MARKET FEED"}</span>
      </div>
      {available ? (
        <>
          <Candles candles={result.candles} />
          <div className="chart-attribution">
            OHLCV / GeckoTerminal ·{" "}
            <a
              href="https://www.tradingview.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              TradingView Lightweight Charts™ · Copyright (с) 2025 TradingView,
              Inc.
            </a>
          </div>
          <details className="chart-table">
            <summary>Accessible price history</summary>
            <table>
              <caption>Latest 12 hourly candles (UTC)</caption>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Open</th>
                  <th>High</th>
                  <th>Low</th>
                  <th>Close</th>
                </tr>
              </thead>
              <tbody>
                {result.candles.slice(-12).map((c) => (
                  <tr key={c.time}>
                    <td>
                      {new Date(c.time * 1000).toISOString().slice(5, 16)}
                    </td>
                    {[c.open, c.high, c.low, c.close].map((v, i) => (
                      <td key={i}>{v.toPrecision(5)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </>
      ) : (
        <div className="chart-empty">
          <span className="chart-monogram" aria-hidden="true">
            AU<span>—</span>
          </span>
          <span className="mono">
            {!config.mint
              ? "THE NEXT MOVE IS YOURS"
              : enabled && query.isPending
                ? "REQUESTING PRICE HISTORY"
                : "PRICE HISTORY UNAVAILABLE"}
          </span>
          <h3>
            {!config.mint
              ? "A little patience.\nA lot of audacity."
              : enabled && query.isPending
                ? "Finding the signal."
                : "Waiting for the feed."}
          </h3>
          <p>
            {!config.mint
              ? "The chart begins when a verified token has market data."
              : "Hourly candles appear only when the provider returns history for this token’s pool."}
          </p>
          {config.dex && (
            <a
              href={market?.pairUrl || config.dex}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open external chart ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}
