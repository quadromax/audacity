import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./world.css";
import "./director.css";
import "./promotion.css";
import "./audacity.css";
import "./launch.css";
import "./contract.css";
import "./performance.css";
import {
  ContractBanner,
  MobileTradingBar,
} from "@/components/world/token-promotion";
import { getSiteConfig } from "@/config/site";
import { Providers } from "@/components/providers";
import { WorldHeader, WorldFooter } from "@/components/world/navigation";
import { SmoothScroll } from "@/components/motion";
const displayFont = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-800-normal.woff2",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
});
const bodyFont = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/inter/files/inter-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/inter/files/inter-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-body",
  display: "swap",
});
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
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
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
