import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "AUDACITY — No guts. No glory. Just AUDACITY.";
export default async function Image() {
  const [jason, lucia, sky, font] = await Promise.all([
    readFile(join(process.cwd(), "public/assets/audacity/jason.png")),
    readFile(join(process.cwd(), "public/assets/audacity/lucia.png")),
    readFile(join(process.cwd(), "public/assets/backgrounds/leonida-dusk.png")),
    readFile(
      join(
        process.cwd(),
        "node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-800-normal.woff",
      ),
    ),
  ]);
  const image = (buffer: Buffer) =>
    "url(data:image/png;base64," + buffer.toString("base64") + ")";
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#241b2d",
        color: "#f8dec0",
        fontFamily: "Barlow",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          backgroundImage: image(sky),
          backgroundSize: "cover",
          opacity: 0.4,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 35,
          left: 45,
          fontSize: 28,
          letterSpacing: 5,
        }}
      >
        SOLANA / THE LEONIDA STATE OF MIND
      </div>
      <div
        style={{
          position: "absolute",
          top: 95,
          left: 35,
          fontSize: 230,
          lineHeight: 1,
          letterSpacing: -5,
        }}
      >
        AUDACITY
      </div>
      <div
        style={{
          position: "absolute",
          right: 195,
          bottom: -130,
          width: 410,
          height: 610,
          backgroundImage: image(jason),
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -30,
          bottom: -130,
          width: 410,
          height: 610,
          backgroundImage: image(lucia),
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 45,
          bottom: 80,
          display: "flex",
          flexDirection: "column",
          fontSize: 55,
          lineHeight: 1.05,
        }}
      >
        <span>NO GUTS. NO GLORY.</span>
        <span style={{ color: "#f1a8ba" }}>JUST AUDACITY.</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 45,
          bottom: 30,
          fontSize: 18,
          letterSpacing: 3,
        }}
      >
        ENTER LEONIDA. DISCOVER AUDACITY.
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Barlow",
          data: font.buffer.slice(
            font.byteOffset,
            font.byteOffset + font.byteLength,
          ) as ArrayBuffer,
          weight: 800,
          style: "normal",
        },
      ],
    },
  );
}
