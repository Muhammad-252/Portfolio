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

const DIR = path.resolve(process.cwd(), "project-images/Supwire Project");

// Logical gallery order for Supwire
const ORDERED_GALLERY_NAMES = [
  "PRoducts.png",
  "Product view.png",
  "Company profile View.png",
  "Company and administrator Info.png",
  "Buyer profile.png",
  "My orders.png",
  "Order view.png",
  "Order detail.png",
  "Past orders.png",
  "My FRP.png",
  "FRP view.png",
  "FRP view-1.png",
  "My offers.png",
  "Offer Preview.png",
  "Offer details.png",
  "Offer details-1.png",
  "Offer generation step 3.png",
  "update Offer.png",
  "update Offer-1.png",
  "My Samples.png",
  "Sample offers.png",
  "Sample detail.png",
  "Past Samples.png",
  "update Sample Offer.png",
  "Messaging.png",
  "Manage Tracking.png",
  "Manage Tracking-1.png",
  "Invoice for remaining payment.png",
  "Report problem.png",
  "Edit Product.png",
  "Product Delete.png",
  "User Management.png",
  "Add coworker.png",
  "Edit coworker.png",
  "Account Security.png",
  "Add More Info.png",
  "References.png",
  "Sign Up.png",
  "Sign Up-1.png",
  "Email verification.png",
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

  const storagePath = `projects/supwire/${subFolder}/${cleanName}`;

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
  console.log("Starting SUPWIRE image upload to Supabase Storage...");

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
    if (url) {
      galleryUrls.push(url);
      console.log("✓");
    }
  }

  console.log(`\nSuccessfully uploaded cover + ${galleryUrls.length} gallery images!`);

  // 3. Update Supabase 'projects' table
  console.log("Updating SUPWIRE record in Supabase database...");
  const { error: updateError } = await supabase
    .from("projects")
    .update({
      cover: coverUrl,
      gallery: galleryUrls,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", "supwire");

  if (updateError) {
    console.error("Failed to update SUPWIRE in Supabase:", updateError);
  } else {
    console.log("✓ SUPWIRE project successfully updated in Supabase database!");
  }

  // Output JSON for updating portfolioData.ts
  const outputJsonPath = path.resolve(process.cwd(), "scripts/supwire-urls.json");
  fs.writeFileSync(
    outputJsonPath,
    JSON.stringify({ cover: coverUrl, gallery: galleryUrls }, null, 2)
  );
  console.log("✓ Saved URLs to scripts/supwire-urls.json");
}

run().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
