import { chart } from "@/server/chart";
export async function GET() {
  return Response.json(await chart(), {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=60",
    },
  });
}
