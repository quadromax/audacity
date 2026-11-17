import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const url = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return [
    "",
    "/dossier",
    "/cast",
    "/files",
    "/how-to-buy",
    "/markets",
    "/about",
  ].map((path) => ({
    url: `${url}${path}`,
    changeFrequency: "weekly",
    priority: path ? 0.7 : 1,
  }));
}
