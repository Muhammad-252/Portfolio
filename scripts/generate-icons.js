const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '..', 'public');

// 1. Create a modern, high-res branded SVG favicon (180x180 viewBox)
// Dark luxury aesthetic: rounded dark square (#0B0C10), sleek geometric letter 'A' in crisp white, and glowing amber accent dot
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14151a"/>
      <stop offset="100%" stop-color="#08080a"/>
    </linearGradient>
    <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff9100"/>
      <stop offset="50%" stop-color="#ff5722"/>
      <stop offset="100%" stop-color="#ff3d00"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Rounded App Icon Background -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)"/>
  <rect width="508" height="508" x="2" y="2" rx="110" fill="none" stroke="#262833" stroke-width="4"/>

  <!-- Stylized Monogram "A" -->
  <path d="M168 376 L238 152 C242 140 252 132 265 132 C278 132 288 140 292 152 L362 376 C366 389 356 402 342 402 C332 402 323 395 320 385 L298 316 L230 316 L208 385 C205 395 196 402 186 402 C172 402 162 389 166 376 Z M241 276 L287 276 L264 196 Z" fill="#FFFFFF"/>

  <!-- Glowing Accent Dot (matching ARSLAN.) -->
  <circle cx="388" cy="386" r="26" fill="url(#amberGrad)" filter="url(#glow)"/>
</svg>`;

async function run() {
  const svgPath = path.join(publicDir, 'favicon.svg');
  fs.writeFileSync(svgPath, svgIcon, 'utf8');
  console.log('Created favicon.svg');

  const svgBuffer = Buffer.from(svgIcon);

  // Generate apple-touch-icon.png (180x180)
  const appleIconPath = path.join(publicDir, 'apple-touch-icon.png');
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(appleIconPath);
  console.log('Created apple-touch-icon.png');

  // Generate favicon-32x32.png
  const fav32Path = path.join(publicDir, 'favicon-32x32.png');
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(fav32Path);
  console.log('Created favicon-32x32.png');

  // Generate favicon-16x16.png
  const fav16Path = path.join(publicDir, 'favicon-16x16.png');
  await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toFile(fav16Path);
  console.log('Created favicon-16x16.png');

  // Also create public/favicon.ico (standard 32x32 / 48x48 PNG container or ico)
  const icoPath = path.join(publicDir, 'favicon.ico');
  await sharp(svgBuffer)
    .resize(48, 48)
    .toFormat('png')
    .toFile(icoPath);
  console.log('Created favicon.ico');
}

run().catch(console.error);
