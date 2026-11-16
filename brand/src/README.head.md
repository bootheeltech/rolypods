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
