import { describe, it, expect } from "vitest";
import {
  validMint,
  safeUrl,
  countdown,
  submissionSchema,
} from "../src/lib/validation";
import nacl from "tweetnacl";
import bs58 from "bs58";
describe("configuration and input validation", () => {
  it("rejects malformed mints and accepts generated Solana public keys", () => {
    expect(validMint("not-a-token")).toBeNull();
    expect(validMint("")).toBeNull();
    const key = bs58.encode(nacl.sign.keyPair().publicKey);
    expect(validMint(key)).toBe(key);
  });
  it("rejects malicious external destinations", () => {
    for (const url of [
      "javascript:alert(1)",
      "http://pump.fun",
      "https://pump.fun.evil.test",
      "https://evil.test@pump.fun",
    ])
      expect(safeUrl(url, ["pump.fun"])).toBeNull();
    expect(safeUrl("https://pump.fun/coin/test", ["pump.fun"])).toBe(
      "https://pump.fun/coin/test",
    );
  });
  it("validates evidence and strips untrusted point amounts", () => {
    const result = submissionSchema.parse({
      missionId: "1d331078-3bcb-4476-9e58-506ca2e0022f",
      evidence: "https://x.com/test/status/123",
      points: 100000,
    });
    expect(result).not.toHaveProperty("points");
    expect(
      submissionSchema.safeParse({
        missionId: "bad",
        evidence: "javascript:alert(1)",
      }).success,
    ).toBe(false);
  });
});
describe("countdown", () => {
  it("does not invent a date", () => {
    expect(countdown(null, 0)).toBeNull();
    expect(countdown("bad-date", 0)).toBeNull();
  });
  it("handles timezone offsets and exact completion", () => {
    const end = "2030-01-01T05:30:00+05:30";
    const start = Date.parse("2029-12-30T23:00:00Z");
    expect(countdown(end, start)).toEqual({
      days: 1,
      hours: 1,
      minutes: 0,
      seconds: 0,
      done: false,
    });
    expect(countdown(end, Date.parse("2030-01-01T00:00:00Z"))?.done).toBe(true);
    expect(countdown(end, Date.parse("2031-01-01T00:00:00Z"))?.days).toBe(0);
  });
});
