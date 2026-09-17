-- ==============================================================================
-- MUHAMMAD ARSLAN PORTFOLIO STUDIO — SUPABASE SCHEMA & SECURITY POLICIES
-- ==============================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project -> Go to the "SQL Editor" tab (left sidebar)
-- 3. Paste this entire script and click "Run" (or Ctrl+Enter)
-- 4. Go to Authentication -> Users -> Click "Add User" to invite/create your admin email:
--    marslanprofessional@gmail.com or arslanmayo24@gmail.com
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. PROJECTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'UI/UX Design',
  industry TEXT NOT NULL DEFAULT 'General',
  platform TEXT NOT NULL DEFAULT 'Web App',
  year TEXT DEFAULT '2026',
  description TEXT DEFAULT '',
  cover TEXT DEFAULT '',
  gallery JSONB DEFAULT '[]'::jsonb,
  role TEXT DEFAULT 'Lead UI/UX Designer',
  client TEXT DEFAULT '',
  duration TEXT DEFAULT '6 Weeks',
  tools JSONB DEFAULT '["Figma", "Design System"]'::jsonb,
  challenge TEXT DEFAULT '',
  process TEXT DEFAULT '',
  solution TEXT DEFAULT '',
  outcome TEXT DEFAULT '',
  figma TEXT DEFAULT '',
  live TEXT DEFAULT '',
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  overview TEXT DEFAULT '',
  "userExperience" TEXT DEFAULT '',
  "keyFeatures" JSONB DEFAULT '[]'::jsonb,
  "designSystem" TEXT DEFAULT '',
  "prototypeInteractions" TEXT DEFAULT '',
  "seoTitle" TEXT DEFAULT '',
  "seoDescription" TEXT DEFAULT '',
  "socialImage" TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for ordering & public slugs
CREATE INDEX IF NOT EXISTS idx_projects_order ON public.projects("order" ASC);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(published);

-- ==============================================================================
-- 3. BLOG POSTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  cover TEXT DEFAULT '',
  category TEXT DEFAULT 'UI/UX Strategy',
  tags JSONB DEFAULT '["UI/UX", "Product Design"]'::jsonb,
  author JSONB DEFAULT '{"name": "Muhammad Arslan", "role": "Lead UI/UX & Product Designer", "avatar": "/images/hero-portrait-v3.png"}'::jsonb,
  date TEXT DEFAULT 'May 2026',
  "readingTime" TEXT DEFAULT '5 min read',
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_order ON public.posts("order" ASC);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON public.posts(published);

-- ==============================================================================
-- 4. FAQS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  "order" INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faqs_order ON public.faqs("order" ASC);
CREATE INDEX IF NOT EXISTS idx_faqs_published ON public.faqs(published);

-- ==============================================================================
-- 5. SETTINGS / TAXONOMIES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial taxonomies for dynamic industries
INSERT INTO public.settings (key, value)
VALUES (
  'taxonomies',
  '{"industries": ["Real Estate", "Healthcare", "SaaS", "Fintech", "E-Commerce", "AI & DeepTech", "Automotive", "Travel & Hospitality", "EdTech"]}'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Helper check: is current caller an authorized administrator?
-- Checked against Supabase Auth JWT email
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.role() = 'authenticated' AND (
      lower(auth.jwt() ->> 'email') IN (
        'marslanprofessional@gmail.com',
        'arslanmayo24@gmail.com'
      )
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --- PROJECTS POLICIES ---
DROP POLICY IF EXISTS "Public can view published projects" ON public.projects;
CREATE POLICY "Public can view published projects"
  ON public.projects FOR SELECT
  USING (published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can insert projects" ON public.projects;
CREATE POLICY "Admins can insert projects"
  ON public.projects FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update projects" ON public.projects;
CREATE POLICY "Admins can update projects"
  ON public.projects FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;
CREATE POLICY "Admins can delete projects"
  ON public.projects FOR DELETE
  USING (public.is_admin());

-- --- POSTS POLICIES ---
DROP POLICY IF EXISTS "Public can view published posts" ON public.posts;
CREATE POLICY "Public can view published posts"
  ON public.posts FOR SELECT
  USING (published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can insert posts" ON public.posts;
CREATE POLICY "Admins can insert posts"
  ON public.posts FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update posts" ON public.posts;
CREATE POLICY "Admins can update posts"
  ON public.posts FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete posts" ON public.posts;
CREATE POLICY "Admins can delete posts"
  ON public.posts FOR DELETE
  USING (public.is_admin());

-- --- FAQS POLICIES ---
DROP POLICY IF EXISTS "Public can view published faqs" ON public.faqs;
CREATE POLICY "Public can view published faqs"
  ON public.faqs FOR SELECT
  USING (published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can insert faqs" ON public.faqs;
CREATE POLICY "Admins can insert faqs"
  ON public.faqs FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update faqs" ON public.faqs;
CREATE POLICY "Admins can update faqs"
  ON public.faqs FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete faqs" ON public.faqs;
CREATE POLICY "Admins can delete faqs"
  ON public.faqs FOR DELETE
  USING (public.is_admin());

-- --- SETTINGS POLICIES ---
DROP POLICY IF EXISTS "Public can view settings" ON public.settings;
CREATE POLICY "Public can view settings"
  ON public.settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can update settings" ON public.settings;
CREATE POLICY "Admins can update settings"
  ON public.settings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- 7. AUTO-UPDATE TIMESTAMPS TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_projects_updated_at ON public.projects;
CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_posts_updated_at ON public.posts;
CREATE TRIGGER set_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_faqs_updated_at ON public.faqs;
CREATE TRIGGER set_faqs_updated_at
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_settings_updated_at ON public.settings;
CREATE TRIGGER set_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 8. STORAGE BUCKET & SECURITY POLICIES (FOR PROJECT COVERS & GALLERIES)
-- ==============================================================================
-- Ensure the 'portfolio' storage bucket exists and is marked public for fast CDN delivery
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio',
  'portfolio',
  true,
  10485760, -- 10MB per file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml'];

-- Allow anyone to view images from the 'portfolio' bucket
DROP POLICY IF EXISTS "Public can view portfolio assets" ON storage.objects;
CREATE POLICY "Public can view portfolio assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio');

-- Allow only authenticated admins to upload images to 'portfolio'
DROP POLICY IF EXISTS "Admins can upload portfolio assets" ON storage.objects;
CREATE POLICY "Admins can upload portfolio assets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'portfolio' AND public.is_admin()
  );

-- Allow only authenticated admins to update images in 'portfolio'
DROP POLICY IF EXISTS "Admins can update portfolio assets" ON storage.objects;
CREATE POLICY "Admins can update portfolio assets"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'portfolio' AND public.is_admin()
  )
  WITH CHECK (
    bucket_id = 'portfolio' AND public.is_admin()
  );

-- Allow only authenticated admins to delete images from 'portfolio'
DROP POLICY IF EXISTS "Admins can delete portfolio assets" ON storage.objects;
CREATE POLICY "Admins can delete portfolio assets"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'portfolio' AND public.is_admin()
  );

