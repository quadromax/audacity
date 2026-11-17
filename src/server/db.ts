import "server-only";
import { createClient } from "@supabase/supabase-js";
export function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key)
    throw new Error("Community services are not configured yet.");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
export function configured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}
export async function userFrom(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer /, "");
  if (!token) throw new Error("Sign in to continue.");
  const { data, error } = await db().auth.getUser(token);
  if (error || !data.user)
    throw new Error("Your session expired. Sign in again.");
  return data.user;
}
export function originGuard(request: Request) {
  const expected = new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ).origin;
  if (request.headers.get("origin") !== expected)
    throw new Error("Request origin is not allowed.");
}
export async function rateLimit(userId: string, action: string, limit = 10) {
  const { data, error } = await db().rpc("consume_rate_limit", {
    p_key: `${userId}:${action}`,
    p_limit: limit,
  });
  if (error || !data)
    throw new Error("Too many requests. Please try again in a minute.");
}
export function failure(error: unknown, status = 400) {
  return Response.json(
    {
      error:
        error instanceof Error ? error.message : "Unable to complete request.",
    },
    { status },
  );
}
