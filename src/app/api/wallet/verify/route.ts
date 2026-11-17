import nacl from "tweetnacl";
import bs58 from "bs58";

import { walletSchema } from "@/lib/validation";
import { db, userFrom, originGuard, rateLimit, failure } from "@/server/db";
export async function POST(request: Request) {
  try {
    originGuard(request);
    const user = await userFrom(request);
    await rateLimit(user.id, "wallet-verify", 5);
    const input = walletSchema.parse(await request.json()),
      d = db();
    const { data: c } = await d
      .from("wallet_challenges")
      .select("*")
      .eq("user_id", user.id)
      .single();
    if (!c || Date.parse(c.expires_at) < Date.now())
      throw new Error("Challenge expired. Please reconnect.");
    if (
      !nacl.sign.detached.verify(
        new TextEncoder().encode(c.message),
        bs58.decode(input.signature),
        bs58.decode(input.address),
      )
    )
      throw new Error("Wallet signature is invalid.");
    const { data, error } = await d.rpc("link_wallet", {
      p_user: user.id,
      p_nonce: c.nonce,
      p_address: input.address,
    });
    if (error || !data)
      throw new Error("Challenge already used or wallet already linked.");
    return Response.json({ message: "Wallet ownership verified." });
  } catch (e) {
    return failure(e);
  }
}
