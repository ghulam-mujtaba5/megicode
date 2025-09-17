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

async function generateOpenGraphImage() {  // Create premium branded OG/Twitter images with the official logo SVG
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

  // Helper to create premium branded social cards with logo and enhanced design
  async function createPremiumCard(outPath: string, width: number, height: number) {
    // Create sophisticated branded background SVG
    const cardSvg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4573df" stop-opacity="0.12"/>
            <stop offset="50%" stop-color="#6b8ef5" stop-opacity="0.08"/>
            <stop offset="100%" stop-color="#cfe8ef" stop-opacity="0.18"/>
          </linearGradient>
          <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#4573df"/>
            <stop offset="100%" stop-color="#6b8ef5"/>
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="textShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#4573df" flood-opacity="0.15"/>
          </filter>
          <pattern id="circuit" patternUnits="userSpaceOnUse" width="40" height="40">
            <path d="M0,20 L40,20 M20,0 L20,40" stroke="#4573df" stroke-width="0.5" opacity="0.1"/>
            <circle cx="20" cy="20" r="2" fill="#4573df" opacity="0.1"/>
          </pattern>
        </defs>
        
        <!-- Background with premium gradient -->
        <rect width="100%" height="100%" fill="#ffffff"/>
        <rect width="100%" height="100%" fill="url(#mainGradient)"/>
        
        <!-- Subtle circuit pattern -->
        <rect width="100%" height="100%" fill="url(#circuit)" opacity="0.3"/>
        
        <!-- Accent bar at top -->
        <rect width="100%" height="6" fill="url(#accentGradient)"/>
        
        <!-- Decorative geometric elements -->
        <g opacity="0.08">
          <polygon points="0,0 120,0 100,80 0,60" fill="#4573df"/>
          <polygon points="${width},${height} ${width-100},${height} ${width-80},${height-60} ${width},${height-40}" fill="#6b8ef5"/>
        </g>
        
        <!-- Floating elements -->
        <g opacity="0.06">
          <circle cx="200" cy="120" r="60" fill="#4573df"/>
          <circle cx="${width - 150}" cy="100" r="40" fill="#cfe8ef"/>
          <circle cx="${width - 200}" cy="${height - 80}" r="50" fill="#6b8ef5"/>
        </g>
        
        <!-- Main content area with enhanced typography -->
        <g transform="translate(${width * 0.08}, ${height * 0.18})">
          <!-- Company name with enhanced styling -->
          <text x="0" y="0" font-family="Arial, sans-serif" font-size="72" font-weight="900" fill="url(#accentGradient)" filter="url(#textShadow)">
            Megicode
          </text>
          
          <!-- Tagline with premium styling -->
          <text x="0" y="85" font-family="Arial, sans-serif" font-size="36" font-weight="500" fill="#2d3748" filter="url(#textShadow)">
            Modern Software Solutions
          </text>
          
          <!-- Accent line -->
          <rect x="0" y="105" width="300" height="3" fill="url(#accentGradient)" rx="1.5"/>
          
          <!-- Premium services list -->
          <g transform="translate(0, 155)" font-family="Arial, sans-serif" font-size="26" font-weight="500" fill="#4a5568">
            <g transform="translate(0, 0)">
              <circle cx="0" cy="-8" r="6" fill="url(#accentGradient)" filter="url(#glow)"/>
              <text x="25" y="0">Full-Stack Web &amp; Mobile Development</text>
            </g>
            <g transform="translate(0, 45)">
              <circle cx="0" cy="-8" r="6" fill="url(#accentGradient)" filter="url(#glow)"/>
              <text x="25" y="0">AI &amp; Machine Learning Solutions</text>
            </g>
            <g transform="translate(0, 90)">
              <circle cx="0" cy="-8" r="6" fill="url(#accentGradient)" filter="url(#glow)"/>
              <text x="25" y="0">Custom Enterprise Software</text>
            </g>
          </g>
          
          <!-- Call to action -->
          <g transform="translate(0, 330)">
            <text x="0" y="0" font-family="Arial, sans-serif" font-size="22" font-weight="400" fill="#718096">
              Transform your ideas into powerful software solutions
            </text>
          </g>
        </g>
        
        <!-- Premium logo container (right side) -->
        <g transform="translate(${width * 0.68}, ${height * 0.12})">
          <!-- Glowing background circle -->
          <circle cx="120" cy="120" r="110" fill="#ffffff" stroke="url(#accentGradient)" stroke-width="4" opacity="0.95" filter="url(#glow)"/>
          <!-- Inner glow -->
          <circle cx="120" cy="120" r="95" fill="url(#mainGradient)" opacity="0.3"/>
        </g>
        
        <!-- Bottom accent -->
        <rect x="0" y="${height-6}" width="100%" height="6" fill="url(#accentGradient)"/>
      </svg>
    `;

    // Generate base card
    const cardBuffer = await sharp(Buffer.from(cardSvg))
      .resize(width, height)
      .png()
      .toBuffer();

    // Prepare premium logo
    const logoSize = Math.min(200, width * 0.16);
    const logoPngBuf = await sharp(svgBuffer)
      .resize({ width: logoSize, height: logoSize, fit: 'inside', withoutEnlargement: true })
      .png()
      .toBuffer();

    // Position logo in the premium container
    const logoLeft = Math.round(width * 0.68 + 120 - logoSize/2);
    const logoTop = Math.round(height * 0.12 + 120 - logoSize/2);

    // Composite everything
    await sharp(cardBuffer)
      .composite([{ input: logoPngBuf, left: logoLeft, top: logoTop }])
      .png()
      .toFile(outPath);
  }

  await createPremiumCard(path.join(META_DIR, 'og-image.png'), 1200, 630);
  await createPremiumCard(path.join(META_DIR, 'twitter-card.png'), 1200, 600);
}

async function main() {
  await init();
  await generateFavicons();
  await generateOpenGraphImage();
  console.log('✅ Generated all meta images successfully!');
}

main().catch(console.error);
