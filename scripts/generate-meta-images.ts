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

async function generateOpenGraphImage() {  // Create branded OG/Twitter images with the official logo SVG
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

  // Helper to create branded social cards with logo and text
  async function createBrandedCard(outPath: string, width: number, height: number) {
    // Create branded background SVG
    const cardSvg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4573df" stop-opacity="0.08"/>
            <stop offset="100%" stop-color="#cfe8ef" stop-opacity="0.15"/>
          </linearGradient>
          <filter id="textShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#4573df" flood-opacity="0.1"/>
          </filter>
        </defs>
        
        <!-- Background -->
        <rect width="100%" height="100%" fill="#ffffff"/>
        <rect width="100%" height="100%" fill="url(#bgGradient)"/>
        
        <!-- Decorative elements -->
        <circle cx="100" cy="100" r="50" fill="#4573df" opacity="0.03"/>
        <circle cx="${width - 80}" cy="80" r="30" fill="#cfe8ef" opacity="0.08"/>
        <circle cx="${width - 120}" cy="${height - 60}" r="40" fill="#4573df" opacity="0.05"/>
        
        <!-- Main content area -->
        <g transform="translate(${width * 0.08}, ${height * 0.2})">
          <!-- Company name -->
          <text x="0" y="0" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="#4573df" filter="url(#textShadow)">
            Megicode
          </text>
          
          <!-- Tagline -->
          <text x="0" y="80" font-family="Arial, sans-serif" font-size="32" fill="#666666" filter="url(#textShadow)">
            Modern Software Solutions
          </text>
          
          <!-- Services -->
          <g transform="translate(0, 140)" font-family="Arial, sans-serif" font-size="24" fill="#4573df">
            <g transform="translate(0, 0)">
              <circle cx="0" cy="-6" r="4" fill="#4573df"/>
              <text x="20" y="0">Web &amp; Mobile Development</text>
            </g>
            <g transform="translate(0, 40)">
              <circle cx="0" cy="-6" r="4" fill="#4573df"/>
              <text x="20" y="0">AI &amp; Data Science</text>
            </g>
            <g transform="translate(0, 80)">
              <circle cx="0" cy="-6" r="4" fill="#4573df"/>
              <text x="20" y="0">Custom Software Solutions</text>
            </g>
          </g>
        </g>
        
        <!-- Logo placement (right side) -->
        <g transform="translate(${width * 0.65}, ${height * 0.15})">
          <circle cx="100" cy="100" r="90" fill="#ffffff" stroke="#4573df" stroke-width="3" opacity="0.9" filter="url(#textShadow)"/>
        </g>
      </svg>
    `;

    // Generate base card
    const cardBuffer = await sharp(Buffer.from(cardSvg))
      .resize(width, height)
      .png()
      .toBuffer();

    // Prepare logo
    const logoSize = Math.min(180, width * 0.15);
    const logoPngBuf = await sharp(svgBuffer)
      .resize({ width: logoSize, height: logoSize, fit: 'inside', withoutEnlargement: true })
      .png()
      .toBuffer();

    // Position logo on the right side
    const logoLeft = Math.round(width * 0.65 + 100 - logoSize/2);
    const logoTop = Math.round(height * 0.15 + 100 - logoSize/2);

    // Composite everything
    await sharp(cardBuffer)
      .composite([{ input: logoPngBuf, left: logoLeft, top: logoTop }])
      .png()
      .toFile(outPath);
  }

  await createBrandedCard(path.join(META_DIR, 'og-image.png'), 1200, 630);
  await createBrandedCard(path.join(META_DIR, 'twitter-card.png'), 1200, 600);
}

async function main() {
  await init();
  await generateFavicons();
  await generateOpenGraphImage();
  console.log('✅ Generated all meta images successfully!');
}

main().catch(console.error);
