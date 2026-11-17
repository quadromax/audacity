import "server-only";
import { z } from "zod";
const responseSchema = z.object({
  result: z.object({
    value: z
      .object({
        executable: z.boolean(),
        owner: z.string(),
        data: z
          .object({
            parsed: z.object({
              type: z.string(),
              info: z.object({ isInitialized: z.boolean() }).passthrough(),
            }),
          })
          .passthrough(),
      })
      .nullable(),
  }),
});
const programs = new Set([
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
  "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
]);
export async function verifyMint(
  mint: string,
): Promise<"verified" | "not-mint" | "unavailable"> {
  try {
    const response = await fetch("https://api.mainnet-beta.solana.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getAccountInfo",
        params: [mint, { encoding: "jsonParsed", commitment: "confirmed" }],
      }),
      signal: AbortSignal.timeout(6000),
      redirect: "error",
    });
    if (!response.ok) return "unavailable";
    const json = await response.json();
    if (json.error || !json.result || !("value" in json.result))
      return "unavailable";
    // An ordinary wallet, token holding account, or absent account is not a mint.
    const parsed = responseSchema.safeParse(json);
    if (!parsed.success) return "not-mint";
    const account = parsed.data.result.value;
    return account &&
      !account.executable &&
      programs.has(account.owner) &&
      account.data.parsed.type === "mint" &&
      account.data.parsed.info.isInitialized
      ? "verified"
      : "not-mint";
  } catch {
    return "unavailable";
  }
}
