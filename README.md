# Terra Spice — MVP

Nuxt 3 site for a B2B spice / herb / dried-vegetable import-export company. Dark cinematic
scroll hero → warm editorial catalogue. MK/EN.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # SSR build + prerender of all public routes
```

## Where things live

| Path | What |
|---|---|
| `content/products.json` | Products (name, origin, forms, packaging, specs — all `{ en, mk }`). Edit here until the admin/Supabase layer exists. |
| `content/categories.json` | The four product families. |
| `content/ui.json` | All UI copy in MK/EN. |
| `public/images/hero/` | 8 hero keyframes + `poster.jpg`. |
| `public/videos/` | (local only, git-ignored) 7 Higgsfield clips + merged master `spice-story-final.mp4`. |
| `public/frames/desktop` | 734 WebP frames @ 15 fps, 1152 w (72 MB) — scrubbed by the hero canvas. |
| `public/frames/mobile` | 734 WebP frames @ 15 fps, 640 w (30 MB). Also used on desktop when the preloader measures a slow connection. |
| `app/components/HeroSequence.vue` | Pinned canvas hero, GSAP ScrollTrigger, rolling-window frame loader. |
| `app/composables/useFrameSequence.ts` | The loader: primes 24 frames, keeps ±40 around scroll, prefetches in scroll direction, evicts the rest. |
| `app/composables/useLocale.ts` | Minimal MK/EN layer. Swap for `@nuxtjs/i18n` later — content shape is already `{ en, mk }`. |
| `server/api/inquiry.post.ts` | Enquiry endpoint: Zod validation, honeypot, per-IP rate limit. Logs to server console until an email provider is wired in (`INQUIRY_TO_EMAIL`). |
| `seeds/`, `seeds/v2/` | Original and regenerated keyframes. |

## Re-generating frames

```bash
ffmpeg -f concat -safe 0 -i public/videos/concat.txt -c copy public/videos/spice-story-final.mp4
ffmpeg -i public/videos/spice-story-final.mp4 -vf "fps=15,scale=1152:-2" -c:v libwebp -quality 68 public/frames/desktop/frame_%04d.webp
ffmpeg -i public/videos/spice-story-final.mp4 -vf "fps=15,scale=640:-2"  -c:v libwebp -quality 66 public/frames/mobile/frame_%04d.webp
```

Update `heroFrameCount` in `nuxt.config.ts` if the count changes.

## Not in the MVP (per docs/02-decisions.md)

- Supabase + `/admin` panel — products are JSON for now.
- Email delivery for enquiries — endpoint validates and logs; plug in Resend/SMTP.
- Real product photography — current shots are AI placeholders in the agreed style.
- `@nuxtjs/i18n` with `/mk` route prefix + hreflang — locale is a cookie toggle for now.
