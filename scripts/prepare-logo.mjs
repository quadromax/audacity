import sharp from "sharp";
import fs from "node:fs/promises";
const input = process.argv[2];
if (!input) throw new Error("Pass the transparent logo PNG path.");
const dir = "public/assets/branding";
await fs.mkdir(dir, { recursive: true });
const master = await sharp(input)
  .trim({ threshold: 10 })
  .resize(512, 512, { fit: "contain", background: "#00000000" })
  .png()
  .toBuffer();
await fs.writeFile(`${dir}/audacity-logo.png`, master);
await sharp(master)
  .resize(192, 192)
  .webp({ quality: 90, alphaQuality: 100 })
  .toFile(`${dir}/audacity-logo.webp`);
await sharp(master).resize(192, 192).png().toFile("src/app/icon.png");
const sizes = [16, 32, 48, 64, 256];
const images = await Promise.all(
  sizes.map((size) => sharp(master).resize(size, size).png().toBuffer()),
);
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
for (let i = 0; i < sizes.length; i++) {
  const entry = 6 + i * 16;
  header[entry] = header[entry + 1] = sizes[i] === 256 ? 0 : sizes[i];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(images[i].length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += images[i].length;
}
await fs.writeFile("src/app/favicon.ico", Buffer.concat([header, ...images]));
console.log("Generated transparent PNG/WebP and 16/32/48/64/256px ICO.");
