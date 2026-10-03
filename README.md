# Gravity Dance Academy — demo site

Single-page demo for Gravity Dance Academy, Rajajinagar. React + TypeScript + Vite + Tailwind v4, animations with `motion`. No backend: the enrolment form opens WhatsApp with a prefilled message.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
```

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel: **Add New → Project**, import the repo. Vercel detects Vite (build `npm run build`, output `dist`).
3. Or from the terminal: `npx vercel` (preview) then `npx vercel --prod`.

## Photos

- All images live in `public/images/gravity/`. Only use photos the academy itself posted.
- After adding/replacing a photo, run `npm run images` to make the 640px / 1280px web versions.
- Gallery items and their placeholders are in `src/Gallery.tsx` (`ITEMS`). For a video, set `videoSrc` on a slot — it loads only when scrolled near.
- Hero video slot: see the comment above the hero image in `src/Hero.tsx`.

## Placeholders

Search the code for `[` — every placeholder is in square brackets, e.g. `[Add batch timings]`, `[confirm styles with owner]`, `[add bio]`. Most content lives in `src/data.ts`.

## Before going live (with the owner’s approval)

- Remove `<meta name="robots" content="noindex, nofollow">` from `index.html`.
- Change `public/robots.txt` to allow indexing.
- Replace every image with originals supplied by the owner, and fill or remove all placeholders.
- Remove the "Demo preview prepared by Bipin" footer line if the owner prefers.
