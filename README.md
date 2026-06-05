# SESAM — Artisan Bakery Landing Page (Jeddah)

A complete Arabic (RTL) landing page for the Instagram account [@sesam.sa](https://www.instagram.com/sesam.sa/) — a Jeddah-based artisan bakery.

All visual assets (photos, videos, avatar) are sourced from the account's public Instagram posts. No external image hosts. No third-party assets. No Google images.

---

## Live

**View on GitHub Pages** (after enabling): https://mographiccode-cell.github.io/sesam-sa-landing/

---

## Stack

- Pure HTML + CSS + vanilla JavaScript — no build step, no framework, no bundler.
- Single-page, 10 sections, fully responsive (mobile / tablet / desktop).
- RTL Arabic throughout, with Latin-script accents (display, numbers, brand).
- All assets are local, served with relative paths — works offline.

## Folder structure

```
sesam.sa/
├── landing-page.html      # Main page
├── styles.css             # All styles (design tokens, sections, responsive)
├── script.js              # Interactions: nav, scroll, gallery carousel, parallax
├── README.md
├── .gitignore
├── images/
│   ├── profile/avatar.jpg          # 150×150 from @sesam.sa profile
│   └── posts/                      # 6 stills from public posts
│       ├── drinks_summer.jpg
│       ├── slow_mornings.jpg
│       ├── elegance_layers.jpg
│       ├── fresh_twist.jpg
│       ├── golden_story.jpg
│       └── sesam_brunch.jpg
├── videos/posts/                   # 6 reel cover frames (e15 / e35)
│   ├── symphony_reel.jpg
│   ├── eid_box_reel.jpg
│   ├── eid_mubarak_reel.jpg
│   ├── summer_sips_reel.jpg
│   ├── passion_fruit_reel.jpg
│   └── peanut_butter_reel.jpg
├── data/                           # Structured research + manifest
│   ├── account-data.json
│   ├── account-research.json
│   ├── brand-identity.json         # Palette + typography tokens
│   ├── images-manifest.json
│   ├── videos-manifest.json
│   └── products.json
└── content/                        # Human-readable research
    ├── account-summary.md
    ├── brand-copy.md
    ├── brand-guidelines.md
    └── raw-instagram-notes.md
```

## Sections

1. **Hero** — brand statement, CTA, full-bleed background image.
2. **About / القصة** — origin story, Jeddah roots.
3. **Why SESAM** — three pillars (المخبوزات الطازجة • المكونات الفاخرة • الحرفية).
4. **Menu highlights** — featured products with prices (SAR).
5. **Gallery (معرض سيسام)** — horizontal scroll-snap carousel of 6 signature posts.
6. **Reels (أفلام قصيرة)** — 4 inline Instagram reel embeds (autoplay, muted, looped).
7. **Brand voice** — copy block in SESAM's tone.
8. **FAQ** — top questions (delivery, hours, parking, catering).
9. **Visit** — Google Maps embed, address, hours, phone, parking notes.
10. **Final CTA + footer** — follow button, contact, social links, legal.

## Design system

- **Palette** — deep obsidian, warm cream, sesame-seed ochre, brick accent
  (see `data/brand-identity.json`).
- **Typography** — **IBM Plex Sans Arabic** (primary, all Arabic + UI), **Jost**
  (Latin body), **Cormorant Garamond italic** (Latin display accents).
- **Motion** — light parallax, smooth scroll, hover-lift cards, horizontal
  drag-to-scroll gallery.
- **Responsive** — breakpoints at 720 px and 1024 px; mobile-first content flow.

## How the media was sourced

All photos and videos are from the public posts of [@sesam.sa](https://www.instagram.com/sesam.sa/).
Because Instagram's CDN URLs (`scontent-atl3-*.cdninstagram.com`) require signed
query parameters (`_nc_ohc`, `oh`, `oe`, `_nc_gid`) that expire quickly, the
assets were downloaded once with a fresh signed URL and stored locally. They are
distributed under the same terms as the original posts (owned by the account).

The four video reels are embedded inline using Instagram's official `/embed/`
URL — they autoplay muted inside the page itself, with a "view on Instagram"
link in the corner for the full version with sound.

## Local preview

```sh
# Open directly in browser
start landing-page.html
# Or serve with any static server
python -m http.server 8000
# → http://localhost:8000
```

## License

Source code: MIT.
Photographic and video content: © @sesam.sa — used here for portfolio
representation of the brand's visual identity, with all assets being direct
downloads of the public posts from the same account.
