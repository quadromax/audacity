import type { Market } from "./types";
// Presentation-only sample. The final zero intentionally makes it invalid base58.
// Never send this value to a provider or use it to generate a trading URL.
export const DEMO_CA = "AudacityDemo7mQ4vR9xK2pN6sT8uW3yZ5cH1fG0";
export function displayedContract(mint: string | null) {
  return mint || DEMO_CA;
}
export function launchLabel(
  mint: string | null,
  invalid: boolean,
  data?: Market,
  error = false,
) {
  if (invalid) return "CHECK CONFIGURED ADDRESS";
  if (!mint) return "LAUNCHING";
  if (error || !data || data.verification !== "verified") return "LAUNCHING";
  return data.status === "live" ? "MARKET AVAILABLE" : "MINT VERIFIED";
}
