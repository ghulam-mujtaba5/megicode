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

async function generateFavicons() {  // Base SVG for the favicon using Megicode's branding
  const svgBuffer = Buffer.from(`
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

      <!-- Background Circle -->
      <circle cx="32" cy="32" r="30" fill="#ffffff" stroke="url(#megicodeGradient)" stroke-width="3.5" filter="url(#shadow)"/>

      <!-- Stylized "M" for Megicode with cleared intersection -->
      <path d="M20 44V22L32 34L44 22V44" stroke="url(#megicodeGradient)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>

      <!-- Minimalist AI Circuit Nodes -->
      <circle cx="20" cy="22" r="1.5" fill="#4573df"/>
      <circle cx="44" cy="22" r="1.5" fill="#4573df"/>
      <circle cx="32" cy="34" r="1.5" fill="#4573df"/>

      <!-- Code Angle Brackets -->
      <path d="M17 32 L13.5 28 L17 24" stroke="url(#megicodeGradient)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M47 32 L50.5 28 L47 24" stroke="url(#megicodeGradient)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
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

async function generateOpenGraphImage() {  // Create a more sophisticated OG image with Megicode branding
  const ogSvgBuffer = Buffer.from(`
    <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="megicodeGradient" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#4573df" />
          <stop offset="100%" stop-color="#cfe8ef" />
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#4573df" flood-opacity="0.15"/>
        </filter>
      </defs>

      <!-- Background with subtle gradient -->
      <rect width="1200" height="630" fill="#ffffff"/>
      <path d="M0,0 L1200,0 L1200,630 L0,630 Z" fill="url(#megicodeGradient)" fill-opacity="0.05"/>

      <!-- Left side decoration - Circuit pattern -->
      <g transform="translate(60, 60)" style="opacity: 0.1">
        <path d="M0,100 Q50,100 50,150 T100,200" stroke="#4573df" stroke-width="2" fill="none"/>
        <path d="M0,200 Q50,200 50,250 T100,300" stroke="#4573df" stroke-width="2" fill="none"/>
        <circle cx="0" cy="100" r="4" fill="#4573df"/>
        <circle cx="50" cy="150" r="4" fill="#4573df"/>
        <circle cx="100" cy="200" r="4" fill="#4573df"/>
      </g>

      <!-- Logo Group -->
      <g transform="translate(100, 120)">
        <!-- Background Circle -->
        <circle cx="64" cy="64" r="60" fill="#ffffff" stroke="url(#megicodeGradient)" stroke-width="7" filter="url(#shadow)"/>
        
        <!-- Stylized "M" -->
        <path d="M40 88V44L64 68L88 44V88" stroke="url(#megicodeGradient)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        
        <!-- Circuit Nodes -->
        <circle cx="40" cy="44" r="3" fill="#4573df"/>
        <circle cx="88" cy="44" r="3" fill="#4573df"/>
        <circle cx="64" cy="68" r="3" fill="#4573df"/>
        
        <!-- Code Brackets -->
        <path d="M34 64 L27 56 L34 48" stroke="url(#megicodeGradient)" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M94 64 L101 56 L94 48" stroke="url(#megicodeGradient)" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </g>

      <!-- Text Content -->
      <g transform="translate(240, 150)">
        <!-- Company name -->
        <text font-family="Arial" font-size="72" font-weight="bold" fill="#4573df">
          <tspan x="0" y="0">Megicode</tspan>
        </text>
        
        <!-- Tagline -->
        <text font-family="Arial" font-size="36" fill="#666">
          <tspan x="0" y="60">Modern Software Solutions</tspan>
        </text>        <!-- Services with custom bullets -->
        <g transform="translate(0, 120)" font-family="Arial" font-size="28" fill="#4573df">
          <g transform="translate(0, 0)">
            <circle cx="0" cy="-6" r="4" fill="#4573df"/>
            <text x="20" y="0">Web and Mobile Applications</text>
          </g>
          <g transform="translate(0, 45)">
            <circle cx="0" cy="-6" r="4" fill="#4573df"/>
            <text x="20" y="0">Desktop Software</text>
          </g>
          <g transform="translate(0, 90)">
            <circle cx="0" cy="-6" r="4" fill="#4573df"/>
            <text x="20" y="0">AI and Data Science Solutions</text>
          </g>
        </g>
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
