import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");

/** Raster favicons use a fixed black girl-please mark (Safari ignores SVG theme media queries for PNG/ICO). */
const rasterSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 589 501">
  <path fill="#000000" fill-rule="evenodd" clip-rule="evenodd" d="M46.6936 23.2871C5.47954 61.7147 -14.6749 118.778 12.2297 177.756C27.5031 211.259 66.1764 211.182 148.974 237.84C193.34 252.113 216.128 300.471 153.89 337.854C91.6519 375.237 89.3847 428.62 123.55 468.182C154.804 504.373 214.576 517.573 246.008 471.522C258.81 450.178 295.65 441.569 309.754 441.569C391.427 435.144 377.458 386.919 383.933 285.378C383.933 177.756 391.427 129.187 314.895 120.635C288.111 120.635 247.84 112.416 220.122 60.7285C192.405 9.04145 98.5833 -25.0944 46.6936 23.2871Z" />
  <path fill="#000000" d="M589 92.1155C589 142.989 547.725 184.231 496.81 184.231C445.895 184.231 404.621 142.989 404.621 92.1155C404.621 41.2415 445.895 0 496.81 0C547.725 0 589 41.2415 589 92.1155Z" />
</svg>`;

const svgBuffer = Buffer.from(rasterSvg);

async function png(size, outName) {
  const out = join(publicDir, outName);
  await sharp(svgBuffer).resize(size, size).png().toFile(out);
  console.log("wrote", outName);
}

await png(16, "favicon-16x16.png");
await png(32, "favicon-32x32.png");
await png(32, "favicon.png");
await png(180, "apple-touch-icon.png");
await png(512, "favicon-512x512.png");

const ico = await pngToIco([
  join(publicDir, "favicon-16x16.png"),
  join(publicDir, "favicon-32x32.png"),
]);
writeFileSync(join(publicDir, "favicon.ico"), ico);
console.log("wrote favicon.ico");
