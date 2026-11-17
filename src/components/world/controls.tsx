"use client";
import { ArrowUpRight, Star } from "lucide-react";
import { AddressDisplay, CopyCA } from "./token-promotion";
import { useToken } from "@/hooks/use-token";
import { useWanted } from "../providers";
export function WantedStars({ large = false }: { large?: boolean }) {
  const { found } = useWanted();
  return (
    <span
      className={`wanted-stars ${large ? "large" : ""}`}
      role="img"
      aria-label={`${found.length} of 5 cosmetic wanted stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={i < found.length ? "lit" : ""}
          fill={i < found.length ? "currentColor" : "none"}
        />
      ))}
    </span>
  );
}
export function TradeButton({
  label,
  secondary = false,
}: {
  label?: string;
  secondary?: boolean;
}) {
  const { config, token } = useToken();
  return config.pump ? (
    <a
      className={`world-button ${secondary ? "outline" : ""}`}
      href={config.pump}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label || `Buy $${token.symbol}`}
      <ArrowUpRight size={17} />
    </a>
  ) : (
    <a className={`world-button ${secondary ? "outline" : ""}`} href="#market">
      Explore the market
      <ArrowUpRight size={17} />
    </a>
  );
}
export function Contract({ full = false }: { full?: boolean }) {
  return (
    <div className={"contract " + (full ? "full" : "")}>
      <AddressDisplay />
      <CopyCA />
    </div>
  );
}
