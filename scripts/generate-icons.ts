import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pngToIco = require('png-to-ico');

// Paths
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const META_DIR = path.join(PUBLIC_DIR, 'meta');
const SRC_SVG = path.join(PUBLIC_DIR, 'favicon.svg');

// Ensure meta dir exists
if (!fs.existsSync(META_DIR)) {
  fs.mkdirSync(META_DIR, { recursive: true });
}

// Icon specs
const pngIcons = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-48x48.png', size: 48 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'mstile-144x144.png', size: 144 },
];

async function main() {
  // Validate source SVG
  if (!fs.existsSync(SRC_SVG)) {
    console.error(`Source SVG not found: ${SRC_SVG}`);
    process.exit(1);
  }

  const svgBuffer = fs.readFileSync(SRC_SVG);

  // Generate PNGs
  await Promise.all(
    pngIcons.map(async ({ name, size }) => {
      const outPath = path.join(META_DIR, name);
      const png = await sharp(svgBuffer)
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toBuffer();
      fs.writeFileSync(outPath, png);
      console.log(`Generated ${name}`);
    })
  );

  // Generate ICO from 16 and 32 PNG sources to ensure crisp results
  const png16Path = path.join(META_DIR, 'favicon-16x16.png');
  const png32Path = path.join(META_DIR, 'favicon-32x32.png');
  const icoPath = path.join(META_DIR, 'favicon.ico');
  const icoBuffer: Buffer = await pngToIco([
    png16Path,
    png32Path,
  ]);
  fs.writeFileSync(icoPath, icoBuffer);
  console.log('Generated favicon.ico from 16px and 32px PNGs');

  console.log('All icons generated successfully.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
