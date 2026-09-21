import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Read .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
for (const line of envContent.split("\n")) {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let key = match[1];
    let value = (match[2] || "").trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    env[key] = value;
  }
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || "https://ezazkkjtgzhiugqwgeac.supabase.co";
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error("SUPABASE_SERVICE_ROLE_KEY not found in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const DIR = path.resolve(process.cwd(), "project-images/Heroz project");

// Logically ordered gallery flow for Heroz Mobile App Case Study
const ORDERED_GALLERY_NAMES = [
  "Home.png",
  "Home-1.png",
  "Splash.png",
  "Onboarding 2.png",
  "Onboarding 7.png",
  "Get Started.png",
  "Get Started-1.png",
  "Sign Up.png",
  "Login.png",
  "Start.png",
  "Without Login.png",
  "Login as a guest.png",
  "Login as a guest-1.png",
  "Login as a guest-2.png",
  "Filters.png",
  "Club profile view.png",
  "Activity Details.png",
  "Activity Details-1.png",
  "Book the activity.png",
  "Book the activity-1.png",
  "Calender.png",
  "Calender-1.png",
  "Calender-2.png",
  "Calender-3.png",
  "Calender-4.png",
  "Calender-5.png",
  "Calender-6.png",
  "Activities history.png",
  "Activities history-1.png",
  "Activities history-2.png",
  "Child.png",
  "Child-1.png",
  "Child-2.png",
  "Child-3.png",
  "Child-4.png",
  "Edit Child.png",
  "Spouse.png",
  "Wallet.png",
  "Wallet-1.png",
  "Wallet-2.png",
  "Wallet-3.png",
  "Wallet-4.png",
  "Buy stars.png",
  "Buy stars-1.png",
  "Buy stars-2.png",
  "Loyalty Points.png",
  "Loyalty Points-1.png",
  "Redeem gift card.png",
  "Redeem gift card-1.png",
  "Discount.png",
  "School Proposals.png",
  "School Proposals-1.png",
  "Proposal view.png",
  "Proposal view-1.png",
  "Proposal view-2.png",
  "View.png",
  "Leave a review.png",
  "Profile page.png",
  "Profile page-1.png",
  "Profile page-2.png",
  "Security.png",
  "Notifications.png",
  "Scan QR.png",
  "Referrals.png",
  "Referrals-1.png",
  "Referrals-2.png",
  "Cover Image.png",
];

async function uploadFile(fileName, subFolder) {
  const filePath = path.join(DIR, fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${fileName}`);
    return null;
  }
  const fileBuffer = fs.readFileSync(filePath);
  const cleanName = fileName
    .toLowerCase()
    .replace(/[^\w.-]/g, "-")
    .replace(/-+/g, "-");

  const storagePath = `projects/heroz/${subFolder}/${cleanName}`;

  const { error: uploadError } = await supabase.storage
    .from("portfolio")
    .upload(storagePath, fileBuffer, {
      contentType: "image/png",
      upsert: true,
      cacheControl: "31536000",
    });

  if (uploadError) {
    throw new Error(`Failed to upload ${fileName}: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from("portfolio").getPublicUrl(storagePath);
  return data.publicUrl;
}

async function run() {
  console.log("Starting HEROZ image upload to Supabase Storage...");

  // 1. Upload Mobile Mockup Cover Image (Home.png fits iPhoneMockup 9:18.5 perfectly)
  console.log("Uploading mobile mockup cover (Home.png)...");
  const coverUrl = await uploadFile("Home.png", "covers");
  console.log("✓ Mobile mockup cover uploaded:", coverUrl);

  // Also upload original Cover Image.png into covers folder
  await uploadFile("Cover Image.png", "covers");

  // 2. Upload Gallery Images
  const galleryUrls = [];
  for (let i = 0; i < ORDERED_GALLERY_NAMES.length; i++) {
    const fileName = ORDERED_GALLERY_NAMES[i];
    process.stdout.write(`Uploading gallery [${i + 1}/${ORDERED_GALLERY_NAMES.length}]: ${fileName}... `);
    const url = await uploadFile(fileName, "gallery");
    if (url) {
      galleryUrls.push(url);
      console.log("✓");
    }
  }

  console.log(`\nSuccessfully uploaded cover + ${galleryUrls.length} gallery images!`);

  // 3. Update Supabase 'projects' table
  console.log("Updating HEROZ record in Supabase database...");
  const { error: updateError } = await supabase
    .from("projects")
    .update({
      cover: coverUrl,
      gallery: galleryUrls,
      platform: "Mobile App",
      updated_at: new Date().toISOString(),
    })
    .eq("slug", "heroz");

  if (updateError) {
    console.error("Failed to update HEROZ in Supabase:", updateError);
  } else {
    console.log("✓ HEROZ project successfully updated in Supabase database!");
  }

  // Output JSON for updating portfolioData.ts
  const outputJsonPath = path.resolve(process.cwd(), "scripts/heroz-urls.json");
  fs.writeFileSync(
    outputJsonPath,
    JSON.stringify({ cover: coverUrl, gallery: galleryUrls }, null, 2)
  );
  console.log("✓ Saved URLs to scripts/heroz-urls.json");
}

run().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
