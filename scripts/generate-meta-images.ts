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

  // Helper to create ultra-modern, cutting-edge social cards with maximum sophistication
  async function createUltraModernCard(outPath: string, width: number, height: number) {
    // Create sophisticated modern design with glass morphism and neural network aesthetics
    const cardSvg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Megicode Brand Colors -->
          <linearGradient id="mainBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4573df"/>
            <stop offset="100%" stop-color="#2d4fa2"/>
          </linearGradient>
          
          <linearGradient id="overlayGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
            <stop offset="100%" stop-color="#f8faff" stop-opacity="0.9"/>
          </linearGradient>
          
          <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#1a202c"/>
            <stop offset="100%" stop-color="#2d3748"/>
          </linearGradient>
          
          <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#4573df"/>
            <stop offset="100%" stop-color="#2d4fa2"/>
          </linearGradient>

          <linearGradient id="accentGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4573df" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#2d4fa2" stop-opacity="0.6"/>
          </linearGradient>
          
          <!-- Advanced filters and effects -->
          <filter id="neuralGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feColorMatrix in="coloredBlur" values="1 0 1 0 0  0 1 1 0 0  1 0 1 0 0  0 0 0 1 0"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <filter id="glassMorph" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="12" result="blur"/>
            <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.1 0"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <filter id="textGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feColorMatrix in="coloredBlur" values="0 0 1 0 0  0 0 1 0 0  1 0 0 0 0  0 0 0 0.6 0"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="15" result="coloredBlur"/>
            <feColorMatrix in="coloredBlur" values="0 0 1 0 0  0 1 0 0 0  1 0 1 0 0  0 0 0 0.8 0"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <!-- Neural network pattern with brand colors -->
          <pattern id="neuralNet" patternUnits="userSpaceOnUse" width="120" height="120">
            <circle cx="20" cy="20" r="3" fill="#4573df" opacity="0.15"/>
            <circle cx="100" cy="40" r="2" fill="#2d4fa2" opacity="0.12"/>
            <circle cx="60" cy="80" r="2.5" fill="#4573df" opacity="0.1"/>
            <circle cx="40" cy="100" r="2" fill="#2d4fa2" opacity="0.15"/>
            <path d="M20,20 Q60,40 100,40 Q80,60 60,80 Q30,90 40,100" stroke="#4573df" stroke-width="0.8" opacity="0.08" fill="none"/>
            <path d="M100,40 Q70,50 60,80" stroke="#2d4fa2" stroke-width="0.6" opacity="0.06" fill="none"/>
          </pattern>
          
          <!-- Glass morphism shapes -->
          <filter id="glass" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10" result="blur"/>
            <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.1 0"/>
          </filter>
        </defs>
        
        <!-- Ultra-modern background with neural network -->
        <rect width="100%" height="100%" fill="url(#mainBg)"/>
        <rect width="100%" height="100%" fill="url(#neuralNet)" opacity="0.4"/>
        
        <!-- Glass morphism overlay -->
        <rect width="100%" height="100%" fill="url(#overlayGrad)" filter="url(#glassMorph)"/>
        
        <!-- Floating geometric elements with glow -->
        <g opacity="0.3" filter="url(#neuralGlow)">
          <circle cx="150" cy="100" r="80" fill="url(#accentGlow)"/>
          <polygon points="50,50 150,30 120,120 30,100" fill="url(#brandGrad)" opacity="0.4"/>
          <circle cx="${width-200}" cy="120" r="60" fill="url(#accentGlow)"/>
          <polygon points="${width-100},80 ${width-50},120 ${width-150},140 ${width-120},60" fill="url(#brandGrad)" opacity="0.3"/>
          <circle cx="${width-300}" cy="${height-100}" r="70" fill="url(#accentGlow)"/>
        </g>
        
        <!-- Dynamic flowing lines -->
        <g stroke-width="3" fill="none" opacity="0.15" filter="url(#neuralGlow)">
          <path d="M0,${height/3} Q${width/4},${height/4} ${width/2},${height/3} Q${width*0.75},${height*0.4} ${width},${height/3}" stroke="url(#brandGrad)"/>
          <path d="M0,${height*0.6} Q${width/3},${height*0.5} ${width*0.7},${height*0.65} Q${width*0.9},${height*0.7} ${width},${height*0.6}" stroke="url(#accentGlow)"/>
          <path d="M${width*0.2},0 Q${width*0.4},${height*0.3} ${width*0.6},${height*0.2} Q${width*0.8},${height*0.1} ${width},${height*0.15}" stroke="url(#brandGrad)"/>
        </g>
        
        <!-- Main content with modern typography -->
        <g transform="translate(${width * 0.08}, ${height * 0.15})">
          <!-- Ultra-modern company name with multiple text effects -->
          <g filter="url(#textGlow)">
            <text x="0" y="0" font-family="SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial" 
                  font-size="84" font-weight="900" fill="url(#brandGrad)" 
                  letter-spacing="-2px" style="paint-order: stroke;">
              <tspan>Megi</tspan><tspan fill="url(#accentGlow)">code</tspan>
            </text>
          </g>
          
          <!-- Modern tagline with glassmorphism background -->
          <rect x="-10" y="25" width="620" height="60" rx="30" fill="#ffffff" opacity="0.15" filter="url(#glass)"/>
          <text x="0" y="70" font-family="SF Pro Display, system-ui, -apple-system" 
                font-size="38" font-weight="600" fill="url(#textGrad)" 
                letter-spacing="-1px">
            Next-Generation Software Solutions
          </text>
          
          <!-- Premium accent line with gradient -->
          <rect x="0" y="95" width="400" height="4" rx="2" fill="url(#brandGrad)" filter="url(#neuralGlow)"/>
          
          <!-- Ultra-modern services grid -->
          <g transform="translate(0, 140)">
            <!-- Service cards with glassmorphism -->
            <g font-family="SF Pro Display, system-ui" font-weight="500">
              <!-- Row 1 -->
              <g transform="translate(0, 0)">
                <rect x="-15" y="-25" width="280" height="50" rx="25" fill="#ffffff" opacity="0.2" filter="url(#glass)"/>
                <circle cx="0" cy="0" r="8" fill="url(#brandGrad)" filter="url(#neuralGlow)"/>
                <text x="25" y="6" font-size="26" fill="url(#textGrad)">AI &amp; Machine Learning</text>
              </g>
              
              <g transform="translate(320, 0)">
                <rect x="-15" y="-25" width="260" height="50" rx="25" fill="#ffffff" opacity="0.2" filter="url(#glass)"/>
                <circle cx="0" cy="0" r="8" fill="url(#accentGlow)" filter="url(#neuralGlow)"/>
                <text x="25" y="6" font-size="26" fill="url(#textGrad)">Cloud &amp; DevOps</text>
              </g>
              
              <!-- Row 2 -->
              <g transform="translate(0, 60)">
                <rect x="-15" y="-25" width="320" height="50" rx="25" fill="#ffffff" opacity="0.2" filter="url(#glass)"/>
                <circle cx="0" cy="0" r="8" fill="url(#brandGrad)" filter="url(#neuralGlow)"/>
                <text x="25" y="6" font-size="26" fill="url(#textGrad)">Full-Stack Development</text>
              </g>
              
              <g transform="translate(350, 60)">
                <rect x="-15" y="-25" width="280" height="50" rx="25" fill="#ffffff" opacity="0.2" filter="url(#glass)"/>
                <circle cx="0" cy="0" r="8" fill="url(#accentGlow)" filter="url(#neuralGlow)"/>
                <text x="25" y="6" font-size="26" fill="url(#textGrad)">Enterprise Solutions</text>
              </g>
            </g>
          </g>
          
          <!-- Call-to-action with modern styling -->
          <g transform="translate(0, 320)">
            <rect x="-20" y="-15" width="680" height="45" rx="22" fill="url(#brandGrad)" opacity="0.1" filter="url(#glass)"/>
            <text x="0" y="10" font-family="SF Pro Display, system-ui" 
                  font-size="24" font-weight="400" fill="url(#textGrad)" opacity="0.9">
              🚀 Transforming Ideas Into Intelligent Software Solutions
            </text>
          </g>
        </g>
        
        <!-- Ultra-prominent logo section with advanced effects -->
        <g transform="translate(${width * 0.72}, ${height * 0.08})">
          <!-- Outer glow ring -->
          <circle cx="140" cy="140" r="150" fill="none" stroke="url(#brandGrad)" stroke-width="2" opacity="0.3" filter="url(#neuralGlow)"/>
          <circle cx="140" cy="140" r="130" fill="none" stroke="url(#accentGlow)" stroke-width="1.5" opacity="0.4" filter="url(#neuralGlow)"/>
          
          <!-- Glass morphism container -->
          <circle cx="140" cy="140" r="120" fill="#ffffff" opacity="0.25" filter="url(#glassMorph)"/>
          <circle cx="140" cy="140" r="115" fill="url(#overlayGrad)" opacity="0.3"/>
          
          <!-- Inner premium background -->
          <circle cx="140" cy="140" r="110" fill="#ffffff" opacity="0.9" filter="url(#glass)"/>
          
          <!-- Neural network decoration around logo with brand colors -->
          <g opacity="0.2" filter="url(#neuralGlow)">
            <circle cx="80" cy="80" r="4" fill="#4573df"/>
            <circle cx="200" cy="90" r="3" fill="#2d4fa2"/>
            <circle cx="210" cy="190" r="4" fill="#4573df"/>
            <circle cx="70" cy="200" r="3" fill="#2d4fa2"/>
            <path d="M80,80 Q140,100 200,90 Q180,140 210,190 Q160,180 70,200 Q90,140 80,80" 
                  stroke="#4573df" stroke-width="1" fill="none" opacity="0.6"/>
          </g>
          
          <!-- Premium logo shadow with brand color -->
          <circle cx="145" cy="145" r="85" fill="#4573df" opacity="0.1" filter="url(#logoGlow)"/>
        </g>
        
        <!-- Modern footer accent -->
        <rect x="0" y="${height-8}" width="100%" height="8" fill="url(#brandGrad)" filter="url(#neuralGlow)"/>
        
        <!-- Floating particles with brand colors -->
        <g opacity="0.6" filter="url(#neuralGlow)">
          <circle cx="100" cy="200" r="2" fill="#4573df"/>
          <circle cx="300" cy="150" r="1.5" fill="#2d4fa2"/>
          <circle cx="500" cy="250" r="2" fill="#4573df"/>
          <circle cx="700" cy="180" r="1.5" fill="#2d4fa2"/>
          <circle cx="900" cy="220" r="2" fill="#4573df"/>
          <circle cx="${width-100}" cy="300" r="1.5" fill="#2d4fa2"/>
        </g>
      </svg>
    `;

    // Generate ultra-high quality base card
    const cardBuffer = await sharp(Buffer.from(cardSvg))
      .resize(width, height)
      .png({ quality: 100, compressionLevel: 1 })
      .toBuffer();

    // Prepare ultra-prominent logo
    const logoSize = Math.min(220, width * 0.18);
    const logoPngBuf = await sharp(svgBuffer)
      .resize({ width: logoSize, height: logoSize, fit: 'inside', withoutEnlargement: true })
      .png({ quality: 100 })
      .toBuffer();

    // Position logo in the premium ultra-modern container
    const logoLeft = Math.round(width * 0.72 + 140 - logoSize/2);
    const logoTop = Math.round(height * 0.08 + 140 - logoSize/2);

    // Composite with premium quality
    await sharp(cardBuffer)
      .composite([{ input: logoPngBuf, left: logoLeft, top: logoTop }])
      .png({ quality: 100, compressionLevel: 1 })
      .toFile(outPath);
  }

  await createUltraModernCard(path.join(META_DIR, 'og-image.png'), 1200, 630);
  await createUltraModernCard(path.join(META_DIR, 'twitter-card.png'), 1200, 600);
}

async function main() {
  await init();
  await generateFavicons();
  await generateOpenGraphImage();
  console.log('✅ Generated all meta images successfully!');
}

main().catch(console.error);
