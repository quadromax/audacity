import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Exchange } from "@/components/world/exchange";
import { CastGallery } from "@/components/world/cast-gallery";
import { HowToBuy } from "@/components/world/audacity";
import Link from "next/link";
const legacy: Record<string, string> = {
  cred: "/#dossier",
  wanted: "/#wanted",
  missions: "/#wanted",
  rewards: "/#transmissions",
};
export function generateStaticParams() {
  return [
    "markets",
    "about",
    "dossier",
    "cast",
    "files",
    "how-to-buy",
    ...Object.keys(legacy),
  ].map((slug) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title:
      slug === "markets"
        ? "Leonida Exchange"
        : ["dossier", "files", "cast"].includes(slug)
          ? "The Leonida Files"
          : slug === "how-to-buy"
            ? "How to Buy"
            : "Behind the Story",
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (legacy[slug]) redirect(legacy[slug]);
  if (slug === "markets")
    return (
      <div className="world-subpage">
        <Exchange expanded />
      </div>
    );
  if (slug === "how-to-buy")
    return (
      <div className="world-subpage">
        <HowToBuy />
      </div>
    );
  if (["dossier", "cast", "files"].includes(slug))
    return (
      <div className="world-subpage">
        <CastGallery />
      </div>
    );
  if (slug !== "about") notFound();
  return (
    <article className="world-about">
      <p className="eyebrow">THE STORY BEHIND THE SCENES</p>
      <h1>
        FAN MADE.
        <br />
        <em>STREET INSPIRED.</em>
      </h1>
      <p className="about-lead">
        AUDACITY brings a GTA VI-inspired world to Solana. A love letter to
        fictional coastlines, complicated characters, and the roads less
        traveled.
      </p>
      <div className="about-columns">
        <section>
          <h2>THE CREATIVE WORLD</h2>
          <p>
            Original artwork, a full character ensemble, and stories from across
            Leonida. Character summaries draw on Rockstar’s published profiles;
            the visual direction and thematic labels belong to this fan
            experience.
          </p>
        </section>
        <section>
          <h2>THE TOKEN WORLD</h2>
          <p>
            Public token metadata and quotes are requested only for the
            configured Solana mint. Missing data is omitted. External provider
            availability and accuracy may vary. A valid address alone is not
            proof of project identity.
          </p>
          <p>
            Meme tokens can lose their entire value. This website does not
            provide investment advice, promise returns, execute trades, or take
            custody of assets.
          </p>
        </section>
      </div>
      <div className="world-faq">
        {[
          [
            "What do wanted stars mean?",
            "They record five discoveries in this browser: read a dossier, meet the crew, discover Real Dimez, visit the terminal, and open sharing or copy a scene link. Reset your record at any time.",
          ],
          [
            "Why are there no quotes yet?",
            "The demo address is a visual placeholder. Quotes appear only after the configured mint is verified and a matching public market is available.",
          ],
          [
            "Where are the social channels?",
            "Supported X, Telegram and Discord links appear only when supplied by matching public token metadata. We never invent social handles. Treat all external destinations with care.",
          ],
          [
            "Do I need an account or a wallet?",
            "No. Every core scene works without a database, login or wallet. Trading happens externally on the linked Pump.fun destination, where you control any wallet interaction.",
          ],
          [
            "Can I save the artwork?",
            "Yes. Visit the signal section to download the original artwork for personal fan use. Do not present it as official Rockstar promotional material.",
          ],
        ].map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
      <Link href="/#legal" className="about-legal-link">
        Independent project & risk information ↗
      </Link>
      <Link className="world-button" href="/">
        Back to Leonida ↗
      </Link>
    </article>
  );
}
