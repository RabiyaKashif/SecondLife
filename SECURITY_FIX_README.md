# SecondLife — Security Fix + Backend Setup

## What was wrong

`src/utils/airtable.ts` originally had blank spots for your Airtable `BASE_ID`
and `TOKEN` directly inside a frontend file. Since this file runs in the
user's browser (it's part of your Vite frontend), filling those in with your
real token would have exposed it publicly — anyone could open their
browser's dev tools (Network or Sources tab) and read it straight out of
your site's code.

## What changed

1. **New file: `api/ideas.ts`** — this lives in a top-level `/api` folder
   (a sibling to `/src`, not inside it). When deployed on Vercel, this
   automatically becomes a real backend endpoint at `/api/ideas`, running on
   Vercel's servers, not in the browser. This is the ONLY place your real
   Airtable token now lives, read from environment variables — never
   written directly into any file.

2. **Updated: `src/utils/airtable.ts`** — no longer contains any token or
   Base ID at all. It now calls `/api/ideas` (your own safe backend) instead
   of calling Airtable directly. If that call fails for any reason, it falls
   back to your bundled sample data (`src/data/ideas.ts`), so the app never
   breaks or shows empty.

3. **Updated: `src/contexts/RestyleContext.tsx`** — previously this always
   used the bundled sample data and never called `fetchRestyleIdeas()` at
   all. Now it loads live data from Airtable (via the safe backend) when the
   app starts, while still starting with bundled data immediately so there's
   no empty/loading flash.

4. **Added: `.env.example`** and confirmed **`.gitignore`** protects your
   real `.env` file from ever being committed to GitHub.

## Setup steps

1. Copy `.env.example`, rename the copy to `.env`, and fill in your real
   `AIRTABLE_BASE_ID` and `AIRTABLE_TOKEN`.
2. **Important — local development:** Vite's own dev server (`npm run dev`)
   does NOT run `/api` functions on its own. To test the backend locally,
   install the Vercel CLI and run `vercel dev` instead:
   ```
   npm install -g vercel
   vercel dev
   ```
   This runs both your frontend and the `/api/ideas` function together,
   exactly as they'll behave once deployed.
3. **Deploying:** when you deploy to Vercel, go to your project's
   Settings → Environment Variables and enter `AIRTABLE_BASE_ID` and
   `AIRTABLE_TOKEN` there too — Vercel reads them from there in production,
   not from your `.env` file (which never gets uploaded).
4. That's it — no other changes needed. Your existing pages, components,
   and matching logic all work exactly as before.

## Why this is safe now

Your Airtable token only ever exists in two places: your local `.env` file
(which is git-ignored) and Vercel's environment variable settings (encrypted,
never exposed to visitors). It's never written into any file that gets sent
to a user's browser, so there's no way for anyone to extract it from your
live site.
