import { configured, db, failure } from "@/server/db";
export async function GET(request: Request) {
  if (!configured())
    return Response.json({
      configured: false,
      posts: [],
      missions: [],
      rewards: [],
      ranks: [],
    });
  const u = new URL(request.url),
    period = u.searchParams.get("period") || "all",
    page = Math.max(0, Math.min(1000, Number(u.searchParams.get("page")) || 0));
  if (!["all", "today", "week"].includes(period))
    return failure(new Error("Invalid period"));
  try {
    const d = db();
    const [posts, missions, rewards, ranks] = await Promise.all([
      d
        .from("social_posts")
        .select("id,title,url,image_path,video_path,views,likes,published_at")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(50),
      d.from("missions").select("*").eq("active", true),
      d.from("rewards").select("*"),
      d.rpc("leaderboard", {
        p_period: period,
        p_offset: Math.floor(page) * 20,
        p_limit: 20,
      }),
    ]);
    for (const r of [posts, missions, rewards, ranks])
      if (r.error)
        throw new Error("Community data is temporarily unavailable.");
    return Response.json(
      {
        configured: true,
        posts: posts.data,
        missions: missions.data,
        rewards: rewards.data,
        ranks: ranks.data,
      },
      { headers: { "Cache-Control": "public, s-maxage=20" } },
    );
  } catch (e) {
    return failure(e, 503);
  }
}
