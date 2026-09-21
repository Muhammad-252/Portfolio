import sharp from "sharp";
import fs from "fs";
import path from "path";

const DIR = path.resolve(process.cwd(), "project-images/Heroz project");

// Canvas size (16:10 ratio matching MacBook stage)
const CANVAS_W = 1920;
const CANVAS_H = 1200;

// Phone dimensions
const PHONE_W = 460;
const PHONE_H = 970;
const PHONE_RADIUS = 52;
const SCREEN_PAD = 12;
const SCREEN_W = PHONE_W - SCREEN_PAD * 2; // 436
const SCREEN_H = PHONE_H - SCREEN_PAD * 2; // 946
const SCREEN_RADIUS = 42;

// Horizontal positions
const GAP = 140;
const TOTAL_PHONES_W = PHONE_W * 3 + GAP * 2;
const START_X = Math.round((CANVAS_W - TOTAL_PHONES_W) / 2);
const PHONE_Y = Math.round((CANVAS_H - PHONE_H) / 2) - 10;

const leftX = START_X;
const centerX = START_X + PHONE_W + GAP;
const rightX = START_X + (PHONE_W + GAP) * 2;

async function prepareScreenBuffer(imageName) {
  const filePath = path.join(DIR, imageName);
  return await sharp(filePath)
    .resize(SCREEN_W, SCREEN_H, {
      fit: "cover",
      position: "top",
    })
    .png()
    .toBuffer();
}

async function createClippedPhone(screenBuffer, phoneId) {
  const screenBase64 = `data:image/png;base64,${screenBuffer.toString("base64")}`;

  const svg = `
  <svg width="${PHONE_W}" height="${PHONE_H}" viewBox="0 0 ${PHONE_W} ${PHONE_H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="screen-clip-${phoneId}">
        <rect x="${SCREEN_PAD}" y="${SCREEN_PAD}" width="${SCREEN_W}" height="${SCREEN_H}" rx="${SCREEN_RADIUS}" ry="${SCREEN_RADIUS}" />
      </clipPath>
      <linearGradient id="sheen-${phoneId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.08" />
        <stop offset="35%" stop-color="#ffffff" stop-opacity="0.02" />
        <stop offset="60%" stop-color="#ffffff" stop-opacity="0" />
      </linearGradient>
    </defs>

    <!-- Outer Titanium Chassis -->
    <rect x="0" y="0" width="${PHONE_W}" height="${PHONE_H}" rx="${PHONE_RADIUS}" ry="${PHONE_RADIUS}"
          fill="#0c0d12" stroke="#2c2d35" stroke-width="3" />
    <rect x="2" y="2" width="${PHONE_W - 4}" height="${PHONE_H - 4}" rx="${PHONE_RADIUS - 2}" ry="${PHONE_RADIUS - 2}"
          fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />

    <!-- Screen with Rounded Clip -->
    <g clip-path="url(#screen-clip-${phoneId})">
      <image href="${screenBase64}" x="${SCREEN_PAD}" y="${SCREEN_PAD}" width="${SCREEN_W}" height="${SCREEN_H}" preserveAspectRatio="xMidYMin slice" />
      <!-- Subtle Screen Glass Sheen -->
      <rect x="${SCREEN_PAD}" y="${SCREEN_PAD}" width="${SCREEN_W}" height="${SCREEN_H}" fill="url(#sheen-${phoneId})" />
    </g>

    <!-- Top Dynamic Island -->
    <rect x="${(PHONE_W - 104) / 2}" y="${SCREEN_PAD + 11}" width="104" height="28" rx="14" fill="#000000" />
    <!-- Camera Sensor Reflection -->
    <circle cx="${(PHONE_W - 104) / 2 + 82}" cy="${SCREEN_PAD + 25}" r="5" fill="#151728" />
    <circle cx="${(PHONE_W - 104) / 2 + 83}" cy="${SCREEN_PAD + 24}" r="1.5" fill="#2d3356" />

    <!-- Bottom Home Indicator Bar -->
    <rect x="${(PHONE_W - 120) / 2}" y="${PHONE_H - SCREEN_PAD - 12}" width="120" height="4.5" rx="2.5" fill="rgba(255,255,255,0.4)" />
  </svg>
  `;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function buildMasterCover() {
  console.log("Preparing 3 mobile screens (Club, Home, Activity)...");
  const leftScreenBuf = await prepareScreenBuffer("Club profile view.png");
  const centerScreenBuf = await prepareScreenBuffer("Home.png");
  const rightScreenBuf = await prepareScreenBuffer("Activity Details.png");

  console.log("Rendering individual phone mockups with titanium chassis...");
  const leftPhone = await createClippedPhone(leftScreenBuf, "left");
  const centerPhone = await createClippedPhone(centerScreenBuf, "center");
  const rightPhone = await createClippedPhone(rightScreenBuf, "right");

  // Background SVG with the identical web app studio radial gradient & ambient shadows
  const backgroundSvg = `
  <svg width="${CANVAS_W}" height="${CANVAS_H}" viewBox="0 0 ${CANVAS_W} ${CANVAS_H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Identical Web App Stage Radial Gradient -->
      <radialGradient id="studio-bg" cx="50%" cy="35%" r="75%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="55%" stop-color="#edf1f7" />
        <stop offset="100%" stop-color="#dfe4ee" />
      </radialGradient>

      <!-- Ambient Drop Shadow Filter for Phones -->
      <filter id="phone-shadow" x="-50%" y="-20%" width="200%" height="160%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="36" result="blur1" />
        <feOffset in="blur1" dx="0" dy="38" result="offset1" />
        <feComponentTransfer in="offset1" result="shadow1">
          <feFuncA type="linear" slope="0.32" />
        </feComponentTransfer>

        <feGaussianBlur in="SourceAlpha" stdDeviation="16" result="blur2" />
        <feOffset in="blur2" dx="0" dy="16" result="offset2" />
        <feComponentTransfer in="offset2" result="shadow2">
          <feFuncA type="linear" slope="0.18" />
        </feComponentTransfer>

        <feMerge>
          <feMergeNode in="shadow1" />
          <feMergeNode in="shadow2" />
        </feMerge>
      </filter>
    </defs>

    <!-- Studio Radial Background -->
    <rect width="${CANVAS_W}" height="${CANVAS_H}" fill="url(#studio-bg)" />

    <!-- Soft Floor Shadows Cast Behind the 3 Phones -->
    <g filter="url(#phone-shadow)">
      <rect x="${leftX}" y="${PHONE_Y}" width="${PHONE_W}" height="${PHONE_H}" rx="${PHONE_RADIUS}" fill="#000000" />
      <rect x="${centerX}" y="${PHONE_Y}" width="${PHONE_W}" height="${PHONE_H}" rx="${PHONE_RADIUS}" fill="#000000" />
      <rect x="${rightX}" y="${PHONE_Y}" width="${PHONE_W}" height="${PHONE_H}" rx="${PHONE_RADIUS}" fill="#000000" />
    </g>

    <!-- Floor Ambient Contact Shadow Bar -->
    <ellipse cx="${leftX + PHONE_W / 2}" cy="${PHONE_Y + PHONE_H + 8}" rx="${PHONE_W * 0.42}" ry="16" fill="rgba(0,0,0,0.12)" />
    <ellipse cx="${centerX + PHONE_W / 2}" cy="${PHONE_Y + PHONE_H + 8}" rx="${PHONE_W * 0.42}" ry="16" fill="rgba(0,0,0,0.12)" />
    <ellipse cx="${rightX + PHONE_W / 2}" cy="${PHONE_Y + PHONE_H + 8}" rx="${PHONE_W * 0.42}" ry="16" fill="rgba(0,0,0,0.12)" />
  </svg>
  `;

  console.log("Compositing 3 phones onto studio background...");
  const baseBg = await sharp(Buffer.from(backgroundSvg)).png().toBuffer();

  const finalImage = await sharp(baseBg)
    .composite([
      { input: leftPhone, left: leftX, top: PHONE_Y },
      { input: centerPhone, left: centerX, top: PHONE_Y },
      { input: rightPhone, left: rightX, top: PHONE_Y },
    ])
    .png({ quality: 95, compressionLevel: 8 })
    .toBuffer();

  const outputPath = path.join(DIR, "Cover-Heroz-3Phones.png");
  fs.writeFileSync(outputPath, finalImage);
  console.log("✓ Successfully created 3-phone master cover image:", outputPath);

  // Also save a copy as public cover if needed
  fs.writeFileSync(path.resolve(process.cwd(), "public/images/projects/heroz-cover-3phones.png"), finalImage);
}

buildMasterCover().catch(console.error);
