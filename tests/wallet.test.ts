import { vi, it, expect, beforeEach } from "vitest";
import nacl from "tweetnacl";
import bs58 from "bs58";
const state = vi.hoisted(() => ({
  challenge: {
    message: "test domain / user / nonce",
    nonce: "abc",
    expires_at: "",
  },
  consume: true,
  rpc: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("../src/server/db", () => ({
  originGuard: () => {},
  userFrom: async () => ({ id: "user" }),
  rateLimit: async () => {},
  failure: (e: Error) => Response.json({ error: e.message }, { status: 400 }),
  db: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({ single: async () => ({ data: state.challenge }) }),
      }),
    }),
    rpc: async (...args: unknown[]) => {
      state.rpc(...args);
      return { data: state.consume, error: null };
    },
  }),
}));
import { POST } from "../src/app/api/wallet/verify/route";
beforeEach(() => {
  state.challenge.expires_at = new Date(Date.now() + 300000).toISOString();
  state.consume = true;
  state.rpc.mockClear();
});
function request(signature: string, address: string) {
  return new Request("https://test.local/api/wallet/verify", {
    method: "POST",
    body: JSON.stringify({ signature, address }),
  });
}
it("verifies an actual Ed25519 signature before atomic association", async () => {
  const key = nacl.sign.keyPair(),
    signature = nacl.sign.detached(
      new TextEncoder().encode(state.challenge.message),
      key.secretKey,
    );
  const res = await POST(
    request(bs58.encode(signature), bs58.encode(key.publicKey)),
  );
  expect(res.status).toBe(200);
  expect(state.rpc).toHaveBeenCalledWith("link_wallet", {
    p_user: "user",
    p_nonce: "abc",
    p_address: bs58.encode(key.publicKey),
  });
});
it("rejects signatures from a different key without consuming nonce", async () => {
  const key = nacl.sign.keyPair(),
    other = nacl.sign.keyPair(),
    signature = nacl.sign.detached(
      new TextEncoder().encode(state.challenge.message),
      other.secretKey,
    );
  expect(
    (await POST(request(bs58.encode(signature), bs58.encode(key.publicKey))))
      .status,
  ).toBe(400);
  expect(state.rpc).not.toHaveBeenCalled();
});
it("rejects expired signed challenges", async () => {
  state.challenge.expires_at = new Date(0).toISOString();
  const key = nacl.sign.keyPair(),
    sig = nacl.sign.detached(
      new TextEncoder().encode(state.challenge.message),
      key.secretKey,
    );
  expect(
    (await POST(request(bs58.encode(sig), bs58.encode(key.publicKey)))).status,
  ).toBe(400);
  expect(state.rpc).not.toHaveBeenCalled();
});
it("rejects a valid signature if atomic nonce consumption fails", async () => {
  state.consume = false;
  const key = nacl.sign.keyPair(),
    sig = nacl.sign.detached(
      new TextEncoder().encode(state.challenge.message),
      key.secretKey,
    );
  expect(
    (await POST(request(bs58.encode(sig), bs58.encode(key.publicKey)))).status,
  ).toBe(400);
});
