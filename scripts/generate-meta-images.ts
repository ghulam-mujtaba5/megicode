const sharp = require('sharp');
const path = require('path');
const fs = require('fs/promises');

const META_DIR = path.join(process.cwd(), 'public', 'meta');

// Ensure meta directory exists
async function init() {
  try {
    await fs.access(META_DIR);
  } catch {
    await fs.mkdir(META_DIR, { recursive: true });
  }
}

async function generateFavicons() {
  // Base SVG for the favicon (using the project's design style)
  const svgBuffer = Buffer.from(`
    <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="#ffffff"/>
      <path d="M256,96 L384,176 L384,336 L256,416 L128,336 L128,176 Z" fill="#4573df"/>
      <path d="M256,144 L352,204 L352,308 L256,368 L160,308 L160,204 Z" fill="#2d4fa2"/>
    </svg>
  `);

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

async function generateOpenGraphImage() {
  // Create a more sophisticated OG image with project details
  const ogSvgBuffer = Buffer.from(`
    <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#ffffff"/>
      <g transform="translate(60, 60)">
        <!-- Logo -->
        <path d="M80,40 L120,60 L120,100 L80,120 L40,100 L40,60 Z" fill="#4573df"/>
        <!-- Company name -->
        <text x="160" y="90" font-family="Arial" font-size="60" font-weight="bold" fill="#2d4fa2">Megicode</text>
        <!-- Tagline -->
        <text x="160" y="150" font-family="Arial" font-size="32" fill="#666">Modern Software Solutions</text>
        <!-- Services -->
        <text x="80" y="240" font-family="Arial" font-size="24" fill="#4573df">• Web Applications</text>
        <text x="80" y="280" font-family="Arial" font-size="24" fill="#4573df">• Mobile Development</text>
        <text x="80" y="320" font-family="Arial" font-size="24" fill="#4573df">• Desktop Software</text>
        <text x="80" y="360" font-family="Arial" font-size="24" fill="#4573df">• AI Solutions</text>
        <text x="80" y="400" font-family="Arial" font-size="24" fill="#4573df">• Data Science</text>
      </g>
    </svg>
  `);

  await sharp(ogSvgBuffer)
    .resize(1200, 630)
    .png()
    .toFile(path.join(META_DIR, 'og-image.png'));

  // Create Twitter card (slightly different dimensions)
  await sharp(ogSvgBuffer)
    .resize(1200, 600)
    .png()
    .toFile(path.join(META_DIR, 'twitter-card.png'));
}

async function main() {
  await init();
  await generateFavicons();
  await generateOpenGraphImage();
  console.log('✅ Generated all meta images successfully!');
}

main().catch(console.error);
