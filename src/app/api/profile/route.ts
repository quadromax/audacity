import { db, userFrom, failure } from "@/server/db";
export async function GET(request: Request) {
  try {
    const user = await userFrom(request),
      d = db();
    const [profile, wallet, points, submissions, rank] = await Promise.all([
      d.from("profiles").select("*").eq("id", user.id).single(),
      d
        .from("wallet_links")
        .select("address")
        .eq("user_id", user.id)
        .maybeSingle(),
      d
        .from("point_transactions")
        .select("amount,created_at,mission_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      d
        .from("mission_submissions")
        .select("id,mission_id,status,created_at")
        .eq("user_id", user.id),
      d.rpc("profile_rank", { p_user: user.id }),
    ]);
    for (const r of [profile, wallet, points, submissions, rank])
      if (r.error) throw new Error("Unable to load profile.");
    return Response.json(
      {
        profile: profile.data,
        wallet: wallet.data,
        points: points.data,
        submissions: submissions.data,
        rank: rank.data,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return failure(e, 401);
  }
}
