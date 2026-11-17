import type { Metadata } from "next";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/barlow-condensed/800.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "./globals.css";
import "./world.css";
import "./director.css";
import "./promotion.css";
import "./audacity.css";
import "./launch.css";
import "./contract.css";
import {
  ContractBanner,
  MobileTradingBar,
} from "@/components/world/token-promotion";
import { getSiteConfig } from "@/config/site";
import { Providers } from "@/components/providers";
import { WorldHeader, WorldFooter } from "@/components/world/navigation";
import { SmoothScroll } from "@/components/motion";
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: {
    default: "AUDACITY",
    template: "%s | AUDACITY",
  },
  description:
    "A cinematic GTA VI-inspired Solana token experience. Enter Leonida. Discover AUDACITY.",
  openGraph: {
    title: "AUDACITY",
    description:
      "A cinematic GTA VI-inspired Solana token experience. Enter Leonida. Discover AUDACITY.",
  },
  twitter: { card: "summary_large_image" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers config={getSiteConfig()}>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <ContractBanner />
          <WorldHeader />
          {getSiteConfig().announcement && (
            <aside className="announcement" aria-label="Community announcement">
              {getSiteConfig().announcement}
            </aside>
          )}
          <main id="main">{children}</main>
          <WorldFooter />
          <MobileTradingBar />
          <SmoothScroll />
        </Providers>
      </body>
    </html>
  );
}
