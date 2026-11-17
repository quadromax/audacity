import { isAddress } from "@solana/addresses";
import { z } from "zod";
export function validMint(value?: string): string | null {
  try {
    return value && isAddress(value) ? value : null;
  } catch {
    return null;
  }
}
export function safeUrl(
  value?: string | null,
  hosts?: string[],
): string | null {
  try {
    const u = new URL(value || "");
    if (
      u.protocol !== "https:" ||
      u.username ||
      u.password ||
      (hosts && !hosts.includes(u.hostname))
    )
      return null;
    return u.href;
  } catch {
    return null;
  }
}
export function countdown(target: string | null, now: number) {
  const end = target ? Date.parse(target) : NaN;
  if (!Number.isFinite(end)) return null;
  const s = Math.max(0, Math.floor((end - now) / 1000));
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor(s / 3600) % 24,
    minutes: Math.floor(s / 60) % 60,
    seconds: s % 60,
    done: s === 0,
  };
}
export const submissionSchema = z.object({
  missionId: z.uuid(),
  evidence: z
    .url()
    .max(1000)
    .refine((v) => Boolean(safeUrl(v)), "Use an HTTPS evidence link"),
});
export const walletSchema = z.object({
  address: z.string().refine((v) => Boolean(validMint(v))),
  signature: z.string().max(200),
});
