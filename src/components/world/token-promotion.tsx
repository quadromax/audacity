"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Copy, Check } from "lucide-react";
import { useToken } from "@/hooks/use-token";
import { displayedContract, launchLabel } from "@/lib/launch";
import { copyText } from "@/lib/clipboard";
import { useSite } from "../providers";
import { TokenLogo } from "./token-logo";
const TradingQR = dynamic(() => import("./trading-qr"));
export function LaunchStatus() {
  const { config, data, isError } = useToken();
  return (
    <span
      className={
        "launch-status " +
        (!config.mint && !config.invalidMint ? "is-soon" : "")
      }
    >
      <i aria-hidden="true" />
      {launchLabel(config.mint, config.invalidMint, data, isError)}
    </span>
  );
}
export function AddressDisplay() {
  const { config, data, isError } = useToken();
  return (
    <div className="address-display">
      <span className="address-label">
        Contract address
        {config.mint && data?.verification === "verified" && !isError && (
          <span className="demo-badge">LIVE</span>
        )}
      </span>
      <code>{displayedContract(config.mint)}</code>
    </div>
  );
}
export function CopyCA() {
  const config = useSite(),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const value = displayedContract(config.mint);
  const request = useRef({ generation: 0 });
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    const lifecycle = request.current;
    lifecycle.generation++;
    setMessage("");
    setBusy(false);
    return () => {
      lifecycle.generation++;
      clearTimeout(timer.current);
    };
  }, [value]);
  return (
    <div className="copy-action">
      <button
        className="copy-ca-button"
        aria-label="Copy contract address"
        aria-disabled={busy}
        aria-busy={busy}
        data-copy-state={
          message === "COPIED!" ? "success" : message ? "error" : "idle"
        }
        onClick={async () => {
          if (busy) return;
          const current = ++request.current.generation;
          clearTimeout(timer.current);
          setMessage("");
          setBusy(true);
          try {
            await copyText(value);
            if (current !== request.current.generation) return;
            setMessage("COPIED!");
            timer.current = setTimeout(() => setMessage(""), 2500);
          } catch {
            if (current === request.current.generation)
              setMessage("COPY FAILED — TRY AGAIN");
          } finally {
            if (current === request.current.generation) setBusy(false);
          }
        }}
      >
        {message === "COPIED!" ? <Check size={16} /> : <Copy size={16} />}
        {message === "COPIED!" ? "COPIED!" : busy ? "COPYING…" : "COPY CA"}
      </button>
      <span
        role="status"
        className={message === "COPIED!" ? "copy-announcement" : undefined}
      >
        {message}
      </span>
    </div>
  );
}
export function BuyAction({
  className = "buy-token",
  long = false,
}: {
  className?: string;
  long?: boolean;
}) {
  const { config, token } = useToken();
  return config.pump ? (
    <a
      className={className}
      href={config.pump}
      target="_blank"
      rel="noopener noreferrer"
    >
      BUY ${token.symbol}
      {long ? " ON PUMP.FUN" : ""}
      <ArrowUpRight size={16} />
    </a>
  ) : null;
}
export function TokenPanel({ final = false }: { final?: boolean }) {
  const { config, token, data } = useToken();
  return (
    <div
      className={"token-plate " + (final ? "closing-plate" : "")}
      id={final ? undefined : "contract"}
    >
      <div className="plate-header">
        <span className="mono">SOLANA / TOKEN EVIDENCE</span>
        <LaunchStatus />
      </div>
      <div className="plate-main">
        <div className="plate-details">
          <div className="plate-ticker">
            <strong className="token-name-with-logo">
              <TokenLogo />${token.symbol}
            </strong>
            <div className="plate-network">
              <Image
                className="solana-mark"
                src="/assets/branding/solana-logomark.svg"
                alt="Solana"
                width={101}
                height={88}
                unoptimized
              />
              <span>
                <small>NETWORK</small>
                <strong>Solana</strong>
              </span>
            </div>
          </div>
          {token.name !== "AUDACITY" && (
            <span className="metadata-ticker">{token.name}</span>
          )}
          <div className="plate-address">
            <AddressDisplay />
            <CopyCA />
          </div>
          {(config.pump || config.dex) && (
            <div className="plate-actions">
              <BuyAction />
              {config.dex && (
                <a
                  className="chart-token"
                  href={data?.pairUrl || config.dex}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View chart ↗
                </a>
              )}
            </div>
          )}
        </div>
        {config.pump ? (
          <a
            className="trade-qr"
            href={config.pump}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the verified mint on Pump.fun"
          >
            <TradingQR url={config.pump} />
            <span>SCAN TO PUMP.FUN ↗</span>
          </a>
        ) : null}
      </div>
      {config.mint && (
        <div className="plate-foot mono">
          <span>CHECK THE FULL CA BEFORE TRADING</span>
        </div>
      )}
    </div>
  );
}
export function ContractBanner() {
  return (
    <aside className="contract-banner" aria-label="Token contract">
      <span className="banner-brand">
        <strong>AUDACITY</strong>
        <small>
          <Image
            src="/assets/branding/solana-logomark.svg"
            alt=""
            width={16}
            height={14}
            unoptimized
          />
          SOLANA
        </small>
      </span>
      <div className="banner-address">
        <AddressDisplay />
      </div>
      <LaunchStatus />
      <CopyCA />
    </aside>
  );
}
export function MobileTradingBar() {
  const { config, token } = useToken();
  return (
    <aside className="mobile-trading" aria-label="Mobile trading controls">
      <div>
        <strong>${token.symbol}</strong>
        <Link href="/#contract">
          {config.mint ? "VIEW FULL CA ↗" : "DEMO CA — NOT LIVE ↗"}
        </Link>
      </div>
      <CopyCA />
      <BuyAction className="banner-buy" />
    </aside>
  );
}
