# RolyPods brand kit

Logos, social, print and the one-page guide for RolyPods (rolypods.com). Start with `rolypods-brand-guide.pdf`.

Nothing in this folder is used by the site build. It lives outside `public/` on purpose; copy an asset into `public/` only when the site should serve it.

## Quick picks

- **Website header / light backgrounds:** `logo/svg/rolypods-lockup-light.svg`
- **Dark backgrounds / photos:** `logo/svg/rolypods-lockup-dark.svg`
- **Profile pictures:** `social/avatars/rolypods-avatar-<platform>-<size>.png`
- **Favicon set:** `favicon/` (svg, ico, Apple touch, 192/512, maskable)
- **Print shop files:** the `.pdf` files in `print/`. They include 0.125 in bleed on every side; trim and safe-area proofs are in each `proofs/` folder. Colors are RGB; most online printers convert automatically, ask for a proof if exact color matters.
- **Avery sheet:** `print/stickers/rolypods-sticker-live-animals-avery-5163-sheet.pdf` fits Avery 5163/8163 (2 x 4 in, 10 per sheet). Print at 100% / "actual size" and test on plain paper first.

## Platform notes

- Instagram and TikTok have no banner image; use the avatar plus the post templates.
- Facebook cover: key content stays in the center 1200 x 520 so mobile crops are safe.
- YouTube banner: the logo sits inside the 1546 x 423 center safe area that shows on every device.
- X header: content is centered; the avatar overlaps the bottom left.

## Editing the post templates

Open `social/posts/templates/*.html` in a text editor, change the text marked `<!-- EDIT -->` (swap the photo path in `new-drop.html` for a different shot), then re-render with `node brand/src/build-social.mjs`. Note that the build overwrites the templates from `brand/src/build-social.mjs`, so for permanent changes edit the `POSTS` list there instead.

## Rebuilding

Run from the repo root in **PowerShell** (headless Edge does not launch from Git Bash):

```
node brand/src/build-logos.mjs
node brand/src/build-social.mjs
node brand/src/build-print.mjs
node brand/src/build-guide.mjs
```

`brand/src/outline.py` regenerates `outlines.json` (the wordmark and tagline as vector outlines) and needs `pip install fonttools brotli uharfbuzz`. You only need it if the wordmark text changes.

Copy rule for everything here: no em dashes, never name other shops.

## Every file

### (root)

- `.gitignore`
- `rolypods-brand-guide.pdf`
- `rolypods-brand-guide.png`

### favicon

- `favicon/apple-touch-icon.png`
- `favicon/favicon-16.png`
- `favicon/favicon-32.png`
- `favicon/favicon-48.png`
- `favicon/favicon.ico`
- `favicon/favicon.svg`
- `favicon/icon-192.png`
- `favicon/icon-512.png`
- `favicon/icon-maskable-512.png`

### fonts

- `fonts/Geist-Variable-latin.woff2`

### logo/png

- `logo/png/rolypods-badge-bark-circle.png`
- `logo/png/rolypods-badge-bark-rounded.png`
- `logo/png/rolypods-badge-blush-circle.png`
- `logo/png/rolypods-badge-blush-rounded.png`
- `logo/png/rolypods-badge-cream-circle.png`
- `logo/png/rolypods-badge-cream-rounded.png`
- `logo/png/rolypods-badge-moss-circle.png`
- `logo/png/rolypods-badge-moss-rounded.png`
- `logo/png/rolypods-horizontal-dark.png`
- `logo/png/rolypods-horizontal-light.png`
- `logo/png/rolypods-horizontal-mono-bark.png`
- `logo/png/rolypods-horizontal-mono-black.png`
- `logo/png/rolypods-horizontal-mono-white.png`
- `logo/png/rolypods-lockup-dark.png`
- `logo/png/rolypods-lockup-light.png`
- `logo/png/rolypods-lockup-mono-bark.png`
- `logo/png/rolypods-lockup-mono-black.png`
- `logo/png/rolypods-lockup-mono-white.png`
- `logo/png/rolypods-mark-dark.png`
- `logo/png/rolypods-mark-light.png`
- `logo/png/rolypods-mark-mono-bark.png`
- `logo/png/rolypods-mark-mono-black.png`
- `logo/png/rolypods-mark-mono-white.png`
- `logo/png/rolypods-wordmark-dark.png`
- `logo/png/rolypods-wordmark-light.png`
- `logo/png/rolypods-wordmark-mono-bark.png`
- `logo/png/rolypods-wordmark-mono-black.png`
- `logo/png/rolypods-wordmark-mono-white.png`

### logo/svg

- `logo/svg/rolypods-badge-bark-circle.svg`
- `logo/svg/rolypods-badge-bark-rounded.svg`
- `logo/svg/rolypods-badge-blush-circle.svg`
- `logo/svg/rolypods-badge-blush-rounded.svg`
- `logo/svg/rolypods-badge-cream-circle.svg`
- `logo/svg/rolypods-badge-cream-rounded.svg`
- `logo/svg/rolypods-badge-moss-circle.svg`
- `logo/svg/rolypods-badge-moss-rounded.svg`
- `logo/svg/rolypods-horizontal-dark.svg`
- `logo/svg/rolypods-horizontal-light.svg`
- `logo/svg/rolypods-horizontal-mono-bark.svg`
- `logo/svg/rolypods-horizontal-mono-black.svg`
- `logo/svg/rolypods-horizontal-mono-white.svg`
- `logo/svg/rolypods-lockup-dark.svg`
- `logo/svg/rolypods-lockup-light.svg`
- `logo/svg/rolypods-lockup-mono-bark.svg`
- `logo/svg/rolypods-lockup-mono-black.svg`
- `logo/svg/rolypods-lockup-mono-white.svg`
- `logo/svg/rolypods-mark-dark.svg`
- `logo/svg/rolypods-mark-light.svg`
- `logo/svg/rolypods-mark-mono-bark.svg`
- `logo/svg/rolypods-mark-mono-black.svg`
- `logo/svg/rolypods-mark-mono-white.svg`
- `logo/svg/rolypods-wordmark-dark.svg`
- `logo/svg/rolypods-wordmark-light.svg`
- `logo/svg/rolypods-wordmark-mono-bark.svg`
- `logo/svg/rolypods-wordmark-mono-black.svg`
- `logo/svg/rolypods-wordmark-mono-white.svg`

### print/business-card/proofs

- `print/business-card/proofs/rolypods-business-card-back-trim-guides.png`
- `print/business-card/proofs/rolypods-business-card-front-trim-guides.png`

### print/business-card

- `print/business-card/rolypods-business-card-back.png`
- `print/business-card/rolypods-business-card-front.png`
- `print/business-card/rolypods-business-card.pdf`

### print/packing-insert/proofs

- `print/packing-insert/proofs/rolypods-thank-you-insert-4x6-back-trim-guides.png`
- `print/packing-insert/proofs/rolypods-thank-you-insert-4x6-front-trim-guides.png`

### print/packing-insert

- `print/packing-insert/rolypods-thank-you-insert-4x6-back.png`
- `print/packing-insert/rolypods-thank-you-insert-4x6-front.png`
- `print/packing-insert/rolypods-thank-you-insert-4x6.pdf`

### print/stickers/proofs

- `print/stickers/proofs/rolypods-sticker-live-animals-4x2-sticker-trim-guides.png`
- `print/stickers/proofs/rolypods-sticker-live-animals-avery-5163-sheet.png`
- `print/stickers/proofs/rolypods-sticker-this-side-up-2in-round-sticker-trim-guides.png`

### print/stickers

- `print/stickers/rolypods-sticker-live-animals-4x2-sticker.png`
- `print/stickers/rolypods-sticker-live-animals-4x2.pdf`
- `print/stickers/rolypods-sticker-live-animals-avery-5163-sheet.pdf`
- `print/stickers/rolypods-sticker-this-side-up-2in-round-sticker.png`
- `print/stickers/rolypods-sticker-this-side-up-2in-round.pdf`

### social/avatars

- `social/avatars/rolypods-avatar-facebook-720.png`
- `social/avatars/rolypods-avatar-instagram-1080.png`
- `social/avatars/rolypods-avatar-tiktok-1080.png`
- `social/avatars/rolypods-avatar-x-400.png`
- `social/avatars/rolypods-avatar-youtube-800.png`
- `social/avatars/rolypods-avatar.svg`

### social/banners

- `social/banners/rolypods-facebook-cover-1640x624.png`
- `social/banners/rolypods-x-header-1500x500.png`
- `social/banners/rolypods-youtube-banner-2560x1440.png`

### social/posts

- `social/posts/rolypods-post-care-tip-1080x1350.png`
- `social/posts/rolypods-post-new-drop-1080x1350.png`
- `social/posts/rolypods-post-restock-1080x1350.png`
- `social/posts/rolypods-post-waitlist-1080x1350.png`

### social/posts/templates

- `social/posts/templates/care-tip.html`
- `social/posts/templates/new-drop.html`
- `social/posts/templates/restock.html`
- `social/posts/templates/waitlist.html`
