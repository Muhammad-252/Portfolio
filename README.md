# Muhammad Arslan — Premium Portfolio Pro

## Included
- Premium responsive personal portfolio
- Featured work / case studies
- UI/UX, Webflow, WordPress and product positioning
- Dynamic Firebase Firestore project CMS
- Firebase Authentication admin login
- Add / edit / delete projects from `/admin`
- Publish / draft toggle
- Featured toggle
- Project ordering
- Case study fields: role, client, duration, tools, challenge, process, solution, outcome
- Figma and live project links
- Gallery URLs
- Vercel-ready Next.js

## Setup
1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Create a Firebase project.
5. Enable Authentication > Email/Password.
6. Create your admin user in Firebase Authentication.
7. Enable Firestore.
8. Add the Firestore rules from `firebase.rules`.
9. Add Firebase Web App credentials to `.env.local`.
10. Run `npm run dev`.

## Deploy to Vercel
Push to GitHub → Import repository in Vercel → add all `NEXT_PUBLIC_FIREBASE_*` environment variables → Deploy.

## Admin
Open `/admin` and sign in with the Firebase admin email/password. Projects are stored in Firestore collection `projects`.

## Images
This version accepts image URLs for maximum simplicity and zero external upload service. Firebase Storage rules are included so a file-upload layer can be added later without changing the architecture.

## Important
Replace demo project data and the email address before launch. The sample images are Unsplash placeholders.
