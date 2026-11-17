"use client";
import { useEffect, useRef } from "react";
import { Activity, RefreshCw } from "lucide-react";
import { useToken } from "@/hooks/use-token";
import { useWanted } from "../providers";
import { Contract } from "./controls";
import { BuyAction, LaunchStatus } from "./token-promotion";
import { PriceChart } from "./price-chart";
export function quote(value: number, price = false) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: price ? "standard" : "compact",
    maximumFractionDigits: price ? 12 : 2,
    minimumFractionDigits: price ? 2 : 0,
  }).format(value);
}
export function Exchange({ expanded = false }: { expanded?: boolean }) {
  const { config, data, token, isError, refetch, isFetching } = useToken();
  const { discover } = useWanted(),
    ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          discover("market");
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [discover]);
  const metrics = [
    ["MARKET CAP", data?.marketCap],
    ["LIQUIDITY", data?.liquidity],
    ["24H VOLUME", data?.volume],
  ] as const;
  return (
    <section className="exchange-scene terminal-upgrade" id="market" ref={ref}>
      <div className="scene-index mono">
        <span>03 / FOLLOW THE FREQUENCY</span>
        <span>LDX · LEONIDA EXCHANGE</span>
      </div>
      <div className="exchange-heading">
        <h2>
          MONEY TALKS.
          <br />
          <em>LISTEN CLOSELY.</em>
        </h2>
        <div>
          <LaunchStatus />
          <p>
            All eyes on the next move.
            <br />
            All quotes from the market.
          </p>
        </div>
      </div>
      <div className="world-terminal">
        <div className="terminal-chrome mono">
          <span>
            <Activity size={14} />
            AUDACITY / MARKET TERMINAL
          </span>
          <span>SOLANA MAINNET</span>
          {config.mint && (
            <button
              className="feed-refresh"
              aria-label="Refresh market data"
              disabled={isFetching}
              onClick={() => refetch()}
            >
              <RefreshCw size={13} />
              {isFetching ? "UPDATING" : "REFRESH"}
            </button>
          )}
        </div>
        <div className="terminal-grid">
          <div className="terminal-identity">
            <div>
              <p className="mono">{token.name} / SOLANA</p>
              <h3>${token.symbol}</h3>
              <div className="terminal-price">
                {data?.price != null ? quote(data.price, true) : "—"}
                {data?.change != null && (
                  <span className={data.change >= 0 ? "positive" : "negative"}>
                    {data.change > 0 ? "+" : ""}
                    {data.change.toFixed(2)}%<small>24H</small>
                  </span>
                )}
              </div>
            </div>
            <dl className="terminal-metrics">
              {metrics.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value != null ? quote(value) : "—"}</dd>
                </div>
              ))}
            </dl>
            <p className="terminal-note">
              {!config.mint
                ? "The stage is set. Trading opens after the mint is verified."
                : data?.verification === "not-mint"
                  ? "This address is not an initialized token mint. Trading is disabled."
                  : data?.verification !== "verified"
                    ? "Mint verification is pending or unavailable. Trading remains disabled."
                    : !config.pump
                      ? "Mint verified. Pump.fun availability has not been confirmed."
                      : data.status === "unlisted"
                        ? "Token verified. A supported public pool is not listed yet."
                        : isError
                          ? "The feed is unavailable. Displayed quotes may be stale."
                          : "Quotes refresh automatically. Check the full contract before trading."}
            </p>
            <Contract full />
            {(config.pump || config.dex) && (
              <div className="terminal-actions">
                <BuyAction long />
                {config.dex && (
                  <a
                    className="chart-token"
                    href={data?.pairUrl || config.dex}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    VIEW CHART ↗
                  </a>
                )}
              </div>
            )}
          </div>
          <PriceChart />
        </div>
        {expanded && data?.pairAddress && (
          <div className="pool-details mono">
            <span>POOL / {data.dexName || "SOLANA DEX"}</span>
            <code>{data.pairAddress}</code>
          </div>
        )}
        <div className="terminal-bottom mono">
          <span>
            {data?.updatedAt
              ? "OBSERVED " +
                new Date(data.updatedAt).toLocaleTimeString("en-GB", {
                  timeZone: "UTC",
                }) +
                " UTC"
              : "AWAITING VERIFIED MARKET DATA"}
          </span>
          <span>
            {isError
              ? "FEED UNAVAILABLE · RETRY AVAILABLE"
              : "DEXSCREENER / 45s · OHLCV / 60s"}
          </span>
        </div>
      </div>
    </section>
  );
}
