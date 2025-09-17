const sharp = require('sharp');
const path = require('path');
const fs = require('fs/promises');

const ROOT_DIR = path.join(__dirname, '..');
const META_DIR = path.join(ROOT_DIR, 'public', 'meta');

// Ensure meta directory exists
async function init() {
  try {
    await fs.access(META_DIR);
  } catch {
    await fs.mkdir(META_DIR, { recursive: true });
  }
}

async function generateFavicons() {  // Base SVG for the favicon using existing PWA icon
  const svgPath = path.join(META_DIR, 'megicode-logo1.svg');
  let svgBuffer: Buffer;
  try {
    svgBuffer = await fs.readFile(svgPath);
    console.log(`Using base SVG from: ${svgPath}`);
  } catch (err) {
    console.warn(`Could not read ${svgPath}. Falling back to embedded SVG.`, err);
    svgBuffer = Buffer.from(`
    <svg width="512" height="512" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="megicodeGradient" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#4573df" />
          <stop offset="100%" stop-color="#cfe8ef" />
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#4573df" flood-opacity="0.15"/>
        </filter>
      </defs>

      <circle cx="32" cy="32" r="30" fill="#ffffff" stroke="url(#megicodeGradient)" stroke-width="3.5" filter="url(#shadow)"/>
      <path d="M20 44V22L32 34L44 22V44" stroke="url(#megicodeGradient)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <circle cx="20" cy="22" r="1.5" fill="#4573df"/>
      <circle cx="44" cy="22" r="1.5" fill="#4573df"/>
      <circle cx="32" cy="34" r="1.5" fill="#4573df"/>
      <path d="M17 32 L13.5 28 L17 24" stroke="url(#megicodeGradient)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M47 32 L50.5 28 L47 24" stroke="url(#megicodeGradient)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `);
  }

  // Generate different sizes
  const sizes = {
    favicon16: 16,
    favicon32: 32,
    favicon48: 48,
    appleTouchIcon: 180,
    androidChrome192: 192,
    androidChrome512: 512
  };

  // Generate PNG files
  await Promise.all([
    sharp(svgBuffer)
      .resize(sizes.favicon16, sizes.favicon16)
      .png()
      .toFile(path.join(META_DIR, 'favicon-16x16.png')),
    sharp(svgBuffer)
      .resize(sizes.favicon32, sizes.favicon32)
      .png()
      .toFile(path.join(META_DIR, 'favicon-32x32.png')),
    sharp(svgBuffer)
      .resize(sizes.favicon48, sizes.favicon48)
      .png()
      .toFile(path.join(META_DIR, 'favicon-48x48.png')),
    sharp(svgBuffer)
      .resize(sizes.appleTouchIcon, sizes.appleTouchIcon)
      .png()
      .toFile(path.join(META_DIR, 'apple-touch-icon.png')),
    sharp(svgBuffer)
      .resize(sizes.androidChrome192, sizes.androidChrome192)
      .png()
      .toFile(path.join(META_DIR, 'android-chrome-192x192.png')),
    sharp(svgBuffer)
      .resize(sizes.androidChrome512, sizes.androidChrome512)
      .png()
      .toFile(path.join(META_DIR, 'android-chrome-512x512.png')),
  ]);
  // Generate ICO file (using PNG as fallback since ICO isn't directly supported)
  await sharp(svgBuffer)
    .resize(48, 48)
    .png()
    .toFile(path.join(META_DIR, 'favicon.ico'));
}

async function generateOpenGraphImage() {  // Compose OG/Twitter images from the official logo SVG
  const svgPath = path.join(META_DIR, 'megicode-logo1.svg');
  let svgBuffer: Buffer;
  try {
    svgBuffer = await fs.readFile(svgPath);
    console.log(`Using logo SVG for OG/Twitter from: ${svgPath}`);
  } catch (err) {
    console.warn(`Could not read ${svgPath}. Using favicon SVG fallback for OG/Twitter.`, err);
    // Fallback to the same embedded SVG from favicon generation
    svgBuffer = Buffer.from('<svg width="512" height="512" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="megicodeGradient" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#4573df" /><stop offset="100%" stop-color="#cfe8ef" /></linearGradient></defs><circle cx="32" cy="32" r="30" fill="#ffffff" stroke="url(#megicodeGradient)" stroke-width="3.5"/><path d="M20 44V22L32 34L44 22V44" stroke="url(#megicodeGradient)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>');
  }

  // Helper to compose a centered logo on a white background
  async function composeImage(outPath: string, width: number, height: number, logoMax: number) {
    const logoPngBuf = await sharp(svgBuffer)
      .resize({ width: logoMax, height: logoMax, fit: 'inside', withoutEnlargement: true })
      .png()
      .toBuffer();

    const meta = await sharp(logoPngBuf).metadata();
    const lw = meta.width || Math.min(logoMax, width);
    const lh = meta.height || Math.min(logoMax, height);
    const left = Math.round((width - lw) / 2);
    const top = Math.round((height - lh) / 2);

    await sharp({ create: { width, height, channels: 4, background: '#FFFFFF' } })
      .png()
      .composite([{ input: logoPngBuf, left, top }])
      .toFile(outPath);
  }

  await composeImage(path.join(META_DIR, 'og-image.png'), 1200, 630, 540);
  await composeImage(path.join(META_DIR, 'twitter-card.png'), 1200, 600, 520);
}

async function main() {
  await init();
  await generateFavicons();
  await generateOpenGraphImage();
  console.log('✅ Generated all meta images successfully!');
}

main().catch(console.error);
