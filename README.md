# Muhammad Arslan — Premium Portfolio Pro

## Included
- Premium responsive personal portfolio
- Featured work / case studies
- UI/UX, Webflow, WordPress and product positioning
- Dynamic Supabase PostgreSQL database CMS
- Supabase Authentication admin login
- Add / edit / delete projects from `/admin`
- Manage Blog Articles and FAQs with live database sync
- Dynamic industry taxonomies
- Publish / draft toggle
- Featured toggle
- Project ordering
- Case study fields: role, client, duration, tools, challenge, process, solution, outcome
- Figma and live project links
- Gallery URLs
- Vercel-ready Next.js with strict Content Security Policy

## Setup
1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Create a free Supabase project at [supabase.com](https://supabase.com).
5. Open **SQL Editor** in your Supabase dashboard and run the entire script in `supabase-schema.sql`.
6. Enable Authentication: Go to **Authentication -> Users** and click **Add User** to create your admin account:
   - `marslanprofessional@gmail.com` or `arslanmayo24@gmail.com`
7. Copy your **Project URL** and **anon public key** (Project Settings -> API) into `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```
8. Run `npm run dev` to start developing.

## Deploy to Vercel
Push to GitHub → Import repository in Vercel → add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Environment Variables → Deploy.

## Admin Dashboard
Open `/admin` and sign in with your Supabase admin email and password. Projects, blog posts, and FAQs sync directly with Supabase.

## Images
This version accepts image URLs (Unsplash, Supabase Storage, custom CDNs) for maximum speed and simplicity.

## Important
Replace demo project data and contact email addresses before public launch.
