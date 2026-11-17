import { market } from "@/server/market";
export async function GET() {
  return Response.json(await market(), {
    headers: {
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
    },
  });
}
