import { randomBytes } from "node:crypto";
import { db, userFrom, originGuard, rateLimit, failure } from "@/server/db";
export async function POST(request: Request) {
  try {
    originGuard(request);
    const user = await userFrom(request);
    await rateLimit(user.id, "wallet-challenge", 5);
    const nonce = randomBytes(32).toString("hex"),
      expires = new Date(Date.now() + 300000).toISOString();
    const domain = new URL(
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    ).host;
    const message = `${domain} requests a wallet association.\nUser: ${user.id}\nNonce: ${nonce}\nExpires: ${expires}\nThis signature links your wallet. It does not authorize a transaction.`;
    const { error } = await db()
      .from("wallet_challenges")
      .upsert({ user_id: user.id, nonce, message, expires_at: expires });
    if (error) throw new Error("Could not create wallet challenge.");
    return Response.json(
      { message },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return failure(e);
  }
}
