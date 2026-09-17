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

const DIR = path.resolve(process.cwd(), "project-images/PropReel Project");

// Logical gallery order
const ORDERED_GALLERY_NAMES = [
  "Example Videos.png",
  "Video Details.png",
  "My Videos.png",
  "Upload New Property.png",
  "Choose a Video Style.png",
  "Choose Your CRM.png",
  "Welcome to PropReel.png",
  "What would you like to do_.png",
  "You're all set!.png",
  "tutorial.png",
  "tutorial-1.png",
  "tutorial-2.png",
  "Subscription & Billing.png",
  "Subscription & Billing-1.png",
  "Subscription & Billing-2.png",
  "Notifications.png",
  "Settings.png",
  "Settings-1.png",
  "Settings-2.png",
  "Settings-3.png",
  "Sign Up.png",
  "Login.png",
  "Create Password.png",
  "Forgot Your Password_.png",
  "Enter Verification Code.png",
];

async function uploadFile(fileName, subFolder) {
  const filePath = path.join(DIR, fileName);
  const fileBuffer = fs.readFileSync(filePath);
  const cleanName = fileName
    .toLowerCase()
    .replace(/[^\w.-]/g, "-")
    .replace(/-+/g, "-");

  const storagePath = `projects/propreel/${subFolder}/${cleanName}`;

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
  console.log("Starting PropReel image upload to Supabase Storage...");

  // 1. Upload Cover Image
  console.log("Uploading cover image: Cover Image.png...");
  const coverUrl = await uploadFile("Cover Image.png", "covers");
  console.log("✓ Cover uploaded:", coverUrl);

  // 2. Upload Gallery Images
  const galleryUrls = [];
  for (let i = 0; i < ORDERED_GALLERY_NAMES.length; i++) {
    const fileName = ORDERED_GALLERY_NAMES[i];
    process.stdout.write(`Uploading gallery [${i + 1}/${ORDERED_GALLERY_NAMES.length}]: ${fileName}... `);
    const url = await uploadFile(fileName, "gallery");
    galleryUrls.push(url);
    console.log("✓");
  }

  console.log(`\nSuccessfully uploaded cover + ${galleryUrls.length} gallery images!`);

  // 3. Update Supabase 'projects' table
  console.log("Updating PropReel record in Supabase database...");
  const { error: updateError } = await supabase
    .from("projects")
    .update({
      cover: coverUrl,
      gallery: galleryUrls,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", "propreel");

  if (updateError) {
    console.error("Failed to update PropReel in Supabase:", updateError);
    process.exit(1);
  }
  console.log("✓ PropReel project successfully updated in Supabase database!");

  // Output JSON for updating portfolioData.ts
  fs.writeFileSync(
    path.resolve(process.cwd(), "scripts/propreel-urls.json"),
    JSON.stringify({ cover: coverUrl, gallery: galleryUrls }, null, 2)
  );
  console.log("✓ Saved URLs to scripts/propreel-urls.json");
}

run().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
