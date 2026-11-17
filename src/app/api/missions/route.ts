import { db, userFrom, originGuard, rateLimit, failure } from "@/server/db";
import { submissionSchema } from "@/lib/validation";
export async function POST(request: Request) {
  try {
    originGuard(request);
    const user = await userFrom(request);
    await rateLimit(user.id, "submission", 5);
    const input = submissionSchema.parse(await request.json());
    const d = db();
    const { data: mission } = await d
      .from("missions")
      .select("id")
      .eq("id", input.missionId)
      .eq("active", true)
      .single();
    if (!mission) throw new Error("This mission is not active.");
    const { error } = await d.from("mission_submissions").insert({
      user_id: user.id,
      mission_id: input.missionId,
      evidence: input.evidence,
    });
    if (error)
      throw new Error(
        error.code === "23505"
          ? "You already submitted this mission."
          : "Submission could not be saved.",
      );
    return Response.json({
      message: "Evidence received. Points are awarded only after review.",
    });
  } catch (e) {
    return failure(e);
  }
}
