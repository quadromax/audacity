import { PGlite } from "@electric-sql/pglite";
import { beforeAll, afterAll, it, expect } from "vitest";
import { readFile } from "node:fs/promises";
let db: PGlite;
const user = "11111111-1111-4111-8111-111111111111",
  other = "22222222-2222-4222-8222-222222222222",
  mission = "33333333-3333-4333-8333-333333333333",
  submission = "44444444-4444-4444-8444-444444444444";
beforeAll(async () => {
  db = new PGlite();
  await db.exec(
    `create role anon;create role authenticated;create role service_role;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;grant usage on schema auth to authenticated;grant execute on function auth.uid() to authenticated;`,
  );
  const sql = (
    await readFile("supabase/migrations/001_community.sql", "utf8")
  ).replace("create extension if not exists pgcrypto;", "");
  await db.exec(sql);
  await db.exec(
    `insert into auth.users values('${user}'),('${other}');insert into missions(id,title,description,points,active) values('${mission}','Verified contribution','Manual review',100,true);insert into mission_submissions(id,user_id,mission_id,evidence) values('${submission}','${user}','${mission}','https://example.com/proof');`,
  );
}, 30000);
afterAll(async () => {
  await db.close();
});
it("awards points atomically and idempotently from the mission definition", async () => {
  await db.query("select approve_submission($1)", [submission]);
  await db.query("select approve_submission($1)", [submission]);
  const result = await db.query<{ amount: number }>(
    "select amount from point_transactions",
  );
  expect(result.rows).toEqual([{ amount: 100 }]);
  expect(
    (await db.query("select * from mission_completions")).rows,
  ).toHaveLength(1);
});
it("denies authenticated point writes and privileged approval RPC", async () => {
  await db.exec(`set role authenticated;set request.jwt.claim.sub='${other}';`);
  expect(
    (await db.query("select * from point_transactions")).rows,
  ).toHaveLength(0);
  await expect(
    db.query(
      `insert into point_transactions(user_id,mission_id,amount) values($1,$2,99999)`,
      [other, mission],
    ),
  ).rejects.toThrow(/permission denied/);
  await expect(
    db.query("select approve_submission($1)", [submission]),
  ).rejects.toThrow(/permission denied/);
  await db.exec("reset role");
});
it("wallet challenges are one-use and expire", async () => {
  await db.query(
    `insert into wallet_challenges(user_id,nonce,message,expires_at) values($1,'nonce','message',now()+interval '5 minutes')`,
    [user],
  );
  expect(
    (
      await db.query<{ ok: boolean }>("select link_wallet($1,$2,$3) ok", [
        user,
        "nonce",
        "address",
      ])
    ).rows[0].ok,
  ).toBe(true);
  expect(
    (
      await db.query<{ ok: boolean }>("select link_wallet($1,$2,$3) ok", [
        user,
        "nonce",
        "different",
      ])
    ).rows[0].ok,
  ).toBe(false);
  await db.query(
    `insert into wallet_challenges(user_id,nonce,message,expires_at) values($1,'expired','message',now()-interval '1 minute')`,
    [user],
  );
  expect(
    (
      await db.query<{ ok: boolean }>("select link_wallet($1,$2,$3) ok", [
        user,
        "expired",
        "different",
      ])
    ).rows[0].ok,
  ).toBe(false);
});
it("enforces shared rate limits", async () => {
  for (let i = 0; i < 3; i++)
    expect(
      (
        await db.query<{ ok: boolean }>(
          "select consume_rate_limit('test',3) ok",
        )
      ).rows[0].ok,
    ).toBe(true);
  expect(
    (await db.query<{ ok: boolean }>("select consume_rate_limit('test',3) ok"))
      .rows[0].ok,
  ).toBe(false);
});
it("leaderboard reflects only verified point transactions", async () => {
  const result = await db.query<{ user_id: string; score: number }>(
    "select * from leaderboard($1,$2,$3)",
    ["all", 0, 20],
  );
  expect(result.rows).toHaveLength(1);
  expect(result.rows[0].user_id).toBe(user);
  expect(Number(result.rows[0].score)).toBe(100);
});
