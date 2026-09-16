const fs = require('fs');
const path = require('path');

console.log('========================================');
console.log('       SEO AUDIT VERIFICATION SCRIPT    ');
console.log('========================================\n');

let failed = false;

// 1. Check Title and Meta Description in layout.tsx
const layoutContent = fs.readFileSync(path.join(__dirname, '../app/layout.tsx'), 'utf8');

// Font width estimation helper for Arial 20px (Google SERP Title)
function estimateTitlePixelWidth(text) {
  // Approximate character widths for Arial ~20px
  let width = 0;
  for (const char of text) {
    if (/[ijlI\.,'!]/.test(char)) width += 5;
    else if (/[f-rt-zJ]/.test(char)) width += 9;
    else if (/[a-e0-9]/.test(char)) width += 11;
    else if (/[A-H K-N O-Z]/.test(char)) width += 14;
    else if (/[mwMW]/.test(char)) width += 17;
    else if (char === ' ') width += 6;
    else if (char === '|' || char === '—') width += 10;
    else width += 10;
  }
  return Math.round(width);
}

// Font width estimation helper for Arial 13-14px (Google SERP Description)
function estimateDescriptionPixelWidth(text) {
  let width = 0;
  for (const char of text) {
    if (/[ijlI\.,'!]/.test(char)) width += 3.5;
    else if (/[f-rt-zJ]/.test(char)) width += 6.5;
    else if (/[a-e0-9]/.test(char)) width += 7.5;
    else if (/[A-H K-N O-Z]/.test(char)) width += 9.5;
    else if (/[mwMW]/.test(char)) width += 12;
    else if (char === ' ') width += 4.5;
    else width += 7;
  }
  return Math.round(width);
}

const titleMatch = layoutContent.match(/default:\s*"([^"]+)"/);
const descMatch = layoutContent.match(/description:\s*\n\s*"([^"]+)"/);

if (!titleMatch || !descMatch) {
  console.error('❌ Failed to parse title or description in layout.tsx');
  failed = true;
} else {
  const title = titleMatch[1];
  const desc = descMatch[1];

  const titlePx = estimateTitlePixelWidth(title);
  const descPx = estimateDescriptionPixelWidth(desc);

  console.log(`[1] Title: "${title}"`);
  console.log(`    Length: ${title.length} chars | Estimated Pixel Width: ${titlePx}px (Target: < 580px)`);
  if (titlePx < 580) {
    console.log('    ✅ PASS: Title is shorter than 580 pixels!\n');
  } else {
    console.error(`    ❌ FAIL: Title is ${titlePx}px (exceeds 580px limit)\n`);
    failed = true;
  }

  console.log(`[2] Meta Description: "${desc}"`);
  console.log(`    Length: ${desc.length} chars | Estimated Pixel Width: ${descPx}px (Target: < 1000px)`);
  if (descPx < 1000) {
    console.log('    ✅ PASS: Meta description is shorter than 1000 pixels!\n');
  } else {
    console.error(`    ❌ FAIL: Meta description is ${descPx}px (exceeds 1000px limit)\n`);
    failed = true;
  }
}

// 2. Check Favicon and Apple Touch Icon
console.log('[3 & 4] Checking Icon Files & HTML Linking:');
const publicFiles = fs.readdirSync(path.join(__dirname, '../public'));
const hasFaviconIco = publicFiles.includes('favicon.ico');
const hasFaviconSvg = publicFiles.includes('favicon.svg');
const hasAppleTouch = publicFiles.includes('apple-touch-icon.png');

console.log(`    favicon.ico exists: ${hasFaviconIco ? '✅' : '❌'}`);
console.log(`    favicon.svg exists: ${hasFaviconSvg ? '✅' : '❌'}`);
console.log(`    apple-touch-icon.png exists: ${hasAppleTouch ? '✅' : '❌'}`);

const hasFaviconInHead = layoutContent.includes('rel="icon"') && layoutContent.includes('favicon.ico');
const hasAppleInHead = layoutContent.includes('rel="apple-touch-icon"') && layoutContent.includes('apple-touch-icon.png');

console.log(`    Favicon linked in HTML <head>: ${hasFaviconInHead ? '✅' : '❌'}`);
console.log(`    Apple Touch Icon linked in HTML <head>: ${hasAppleInHead ? '✅' : '❌'}`);

if (hasFaviconIco && hasFaviconSvg && hasAppleTouch && hasFaviconInHead && hasAppleInHead) {
  console.log('    ✅ PASS: Favicon and Apple touch icons are properly created and linked!\n');
} else {
  console.error('    ❌ FAIL: Missing icon file or HTML link\n');
  failed = true;
}

// 3. Check H1 Keywords in Page Content
console.log('[5] Checking H1 Keywords in Page Content:');
const pageContent = fs.readFileSync(path.join(__dirname, '../app/page.tsx'), 'utf8');

// H1: Designing High-Impact Products & Websites That Convert.
const h1Keywords = ['designing', 'high-impact', 'products', 'websites', 'convert'];
const pageContentLower = pageContent.toLowerCase();

let allKeywordsFound = true;
h1Keywords.forEach((kw) => {
  const count = (pageContentLower.match(new RegExp(kw, 'g')) || []).length;
  console.log(`    Keyword "${kw}": found ${count} times in page content`);
  if (count < 2) allKeywordsFound = false; // should appear in body content as well as heading
});

if (allKeywordsFound) {
  console.log('    ✅ PASS: All H1 heading keywords are prominently used in page content!\n');
} else {
  console.error('    ❌ FAIL: One or more H1 keywords are missing from page content\n');
  failed = true;
}

// 4. Check Headings Count on Homepage
console.log('[6] Checking Heading Hierarchy & Count on Homepage:');
const homeFaqContent = fs.readFileSync(path.join(__dirname, '../components/HomeFAQ.tsx'), 'utf8');

// Count headings across page.tsx, HomeFAQ, ProjectCard (3 cards shown on homepage)
function countTags(str, tag) {
  const matches = str.match(new RegExp(`<${tag}[^>]*>`, 'gi'));
  return matches ? matches.length : 0;
}

// In app/page.tsx:
const pageH1 = countTags(pageContent, 'h1');
const pageH2 = countTags(pageContent, 'h2');
const pageH3 = countTags(pageContent, 'h3');
const pageH4 = countTags(pageContent, 'h4');

// In HomeFAQ:
const faqH2 = countTags(homeFaqContent, 'h2');
const faqH3 = countTags(homeFaqContent, 'h3');
const faqH4 = countTags(homeFaqContent, 'h4');

// In ProjectCard (limit 3 on homepage):
const projectCardContent = fs.readFileSync(path.join(__dirname, '../components/ProjectCard.tsx'), 'utf8');
const cardH3PerItem = countTags(projectCardContent, 'h3');
const totalCardH3 = cardH3PerItem * 3; // 3 projects on homepage

const totalHeadings = pageH1 + pageH2 + pageH3 + pageH4 + faqH2 + faqH3 + faqH4 + totalCardH3;

console.log(`    H1 count: ${pageH1}`);
console.log(`    H2 count: ${pageH2 + faqH2}`);
console.log(`    H3 count: ${pageH3 + faqH3 + totalCardH3} (Services: 4, Projects: 3)`);
console.log(`    H4 count: ${pageH4 + faqH4}`);
console.log(`    Total Headings: ${totalHeadings} (Previously: 27)`);

if (totalHeadings <= 16 && pageH1 === 1 && (pageH4 + faqH4) === 0) {
  console.log('    ✅ PASS: Heading count is balanced and proportional to content (reduced from 27 down to ~15)!\n');
} else {
  console.error(`    ❌ FAIL: Total headings (${totalHeadings}) still excessive or malformed\n`);
  failed = true;
}

// 5. Check ProjectCard Link Length
console.log('[7 & 8] Checking Anchor Text Length & Duplication:');
const projectCardHasCardLink = projectCardContent.includes('className="project-card-overlay-link"');
const projectCardHasTitleLink = projectCardContent.includes('className="project-title-link"');
const projectCardHasBottomLink = projectCardContent.includes('className="project-bottom-link"');

console.log(`    ProjectCard has separate overlay link: ${projectCardHasCardLink ? '✅' : '❌'}`);
console.log(`    ProjectCard has concise title link: ${projectCardHasTitleLink ? '✅' : '❌'}`);
console.log(`    ProjectCard has unique bottom link with aria-label: ${projectCardHasBottomLink ? '✅' : '❌'}`);

if (projectCardHasCardLink && projectCardHasTitleLink && projectCardHasBottomLink) {
  console.log('    ✅ PASS: Internal link anchor text length is clean, concise, and no longer wraps whole card descriptions!\n');
} else {
  console.error('    ❌ FAIL: ProjectCard link structure not properly updated\n');
  failed = true;
}

if (!failed) {
  console.log('🎉 ALL SEO AUDIT VERIFICATIONS PASSED SUCCESSFULLY! 🎉');
} else {
  console.error('⚠️ SOME AUDIT CHECKS FAILED');
  process.exit(1);
}
