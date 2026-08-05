# Plan: New "Testimonials" block + Hero "video-background" variant

## Part A — New `testimonials` block (repeating avatar + quote + name)

A simpler, non-interactive counterpart to the existing `tabs-testimonials` block: a responsive **grid of testimonial cards**, each with an avatar, a quote, and a name/role. (Distinct from `tabs-testimonials`, which is the interactive tabbed switcher.)

**Content model (author contract)** — one row per testimonial, 1 cell each holding: avatar image, quote text, name (+ optional role):

| Testimonials |
|--------------|
| ![avatar](…) — "Great quote here." — Alex Rivera, Streetwear Enthusiast |

More explicitly, each row = one testimonial with an image + a paragraph of quote + a name line. The decorator is forgiving about ordering.

**`blocks/testimonials/testimonials.js`** — `decorate(block)`:
- For each row, identify the `<picture>` (avatar), the quote text, and the name/role line.
- Restructure into a semantic card: `.testimonials-card` → `.testimonials-avatar` (round), `<blockquote class="testimonials-quote">`, `.testimonials-name`.
- Graceful when avatar or role is missing. Vanilla ES6, `toClassName` helper as needed (matches `tabs-testimonials.js`).

**`blocks/testimonials/testimonials.css`** — tokens only, scoped to `.testimonials`:
- Responsive grid: 1 col mobile → 2/3 cols at 600/900px (like `cards`).
- Avatar: circular, fixed size; quote in `--body-font-family` italic; name in `--body-font-family` bold `--text-color`, role in `--link-color`.
- Uses `--content-max-width`, section spacing conventions; no hard-coded colors/fonts.

## Part B — Hero `video-background` variant

Extend the existing `hero` block (currently CSS-only, image-behind-heading) with a **`video-background` variant** (`hero (video-background)` in authoring → `.hero.video-background`).

**Content model:** author adds a link to a video (`.mp4`) as the background source, with heading/subheading/CTA overlaid — same as the image hero, but the first media cell is a video URL instead of a picture.

**`blocks/hero/hero.js`** (currently empty) — add a `decorate(block)` that:
- Runs only for the `video-background` variant (guards on `block.classList.contains('video-background')`).
- Finds the video URL (an `<a href="*.mp4">` or a picture-to-video swap), creates a `<video>` with `autoplay muted loop playsinline` and `preload="metadata"`, positioned as the background (behind overlaid text) — mirroring how the image hero uses an absolute `<picture>`.
- Respects `prefers-reduced-motion` (no autoplay; fall back to a poster/first frame or static bg). Leaves the default image hero untouched.

**`blocks/hero/hero.css`** — add `.hero.video-background` rules: absolutely-positioned full-cover `<video>` (`object-fit: cover`, `z-index:-1`), optional dark scrim for text legibility, white overlaid text — reusing the existing hero overlay pattern and tokens.

## Testing / Verification (both)

- Throwaway `drafts/` test pages (or temp DA docs) rendered on `http://localhost:3000`:
  - **testimonials:** multiple cards render (avatar round, quote, name/role); missing-avatar and missing-role cases; responsive 1→2→3 cols.
  - **hero video-background:** video autoplays muted/looped behind overlaid heading; reduced-motion fallback; default image hero still works (no regression).
- `npm run lint` (ESLint + Stylelint) clean.
- Screenshots for visual confirmation.

## Checklist

- [ ] Confirm a couple of design choices (see questions)
- [ ] Create `blocks/testimonials/testimonials.js` (repeating avatar + quote + name → cards)
- [ ] Create `blocks/testimonials/testimonials.css` (token-based responsive grid, scoped to `.testimonials`)
- [ ] Add `decorate()` to `blocks/hero/hero.js` for the `video-background` variant (video bg, autoplay/mute/loop, reduced-motion)
- [ ] Extend `blocks/hero/hero.css` with `.hero.video-background` styles (full-cover video, scrim, overlaid text)
- [ ] Add throwaway test pages; render on `localhost:3000`
- [ ] Verify: testimonials (cards, missing-field cases, responsive) + hero video (autoplay, reduced-motion, image hero unchanged)
- [ ] `npm run lint` clean
- [ ] Report both blocks + authoring models + screenshots; commit/push to `main` on your go-ahead

## Execution Note

Writing the block files, running the dev server, and linting are **blocked in plan mode**. Once you confirm the two choices below and switch to **Execute mode**, I'll build both, verify locally, lint, and report back (committing/pushing on your go-ahead).# Plan: New "Testimonials" block + Hero "video-background" variant

## Confirmed Design Decisions

- **Testimonials layout:** Responsive card grid — 1 col mobile → 2/3 cols desktop; each card has a round avatar, quote, and name/role. Matches the site's `cards` blocks.
- **Hero video fallback:** Poster image — autoplay muted/looped normally; show a static poster (authored, or first frame) for reduced-motion / when the video can't load. Accessible and safe.

## Part A — New `testimonials` block (repeating avatar + quote + name)

A non-interactive counterpart to `tabs-testimonials`: a **responsive grid of testimonial cards**.

**Content model** — one row per testimonial; each row holds an avatar image, a quote, and a name (+ optional role):

| Testimonials |
|--------------|
| ![avatar](…) · "Great quote here." · Alex Rivera, Streetwear Enthusiast |

**`blocks/testimonials/testimonials.js`** — `decorate(block)`:
- Per row, find the `<picture>` (avatar), quote text, and name/role line.
- Restructure into `.testimonials-card` → `.testimonials-avatar` (round), `<blockquote class="testimonials-quote">`, `.testimonials-name` (name bold + role muted).
- Graceful when avatar or role is missing. Vanilla ES6, using `toClassName` where useful (matches `tabs-testimonials.js`).

**`blocks/testimonials/testimonials.css`** — tokens only, scoped to `.testimonials`:
- Grid: 1 col → 2 cols @600px → 3 cols @900px.
- Avatar circular fixed size; quote `--body-font-family` italic `--text-color`; name bold `--text-color`, role `--link-color`.
- Uses `--content-max-width` + section spacing; no hard-coded colors/fonts.

## Part B — Hero `video-background` variant

Extend the existing (CSS-only) `hero` block with a **`video-background` variant** (`hero (video-background)` → `.hero.video-background`).

**Content model:** author supplies a video URL (`<a href="*.mp4">`) as the background + an optional poster image, with heading/subheading/CTA overlaid — same as the image hero but video behind.

**`blocks/hero/hero.js`** (currently empty) — add `decorate(block)`:
- Runs only when `block.classList.contains('video-background')` (image hero untouched).
- Find the video URL; build `<video autoplay muted loop playsinline preload="metadata">` with the authored/first-frame **poster**, positioned as full-cover background (behind overlaid text), mirroring the absolute `<picture>` pattern.
- **`prefers-reduced-motion`:** do not autoplay — show the poster image instead (static background). Video can't load → poster remains.

**`blocks/hero/hero.css`** — add `.hero.video-background` rules: full-cover `<video>`/poster (`object-fit: cover; z-index:-1`), dark scrim for legibility, white overlaid text — reusing the existing hero overlay pattern and tokens.

## Testing / Verification

- Throwaway `drafts/` pages on `http://localhost:3000`:
  - **testimonials:** multiple cards (round avatar, quote, name/role); missing-avatar & missing-role cases; responsive 1→2→3 cols.
  - **hero video-background:** autoplays muted/looped behind overlaid heading; poster shows under reduced-motion (emulate); default image hero still works (no regression).
- `npm run lint` (ESLint + Stylelint) clean; screenshots for visual confirmation.

## Checklist

- [x] Confirm design choices (card grid; poster fallback)
- [ ] Create `blocks/testimonials/testimonials.js` (repeating avatar + quote + name → cards)
- [ ] Create `blocks/testimonials/testimonials.css` (token-based responsive grid, scoped to `.testimonials`)
- [ ] Add `decorate()` to `blocks/hero/hero.js` for the `video-background` variant (video bg + poster, autoplay/mute/loop, reduced-motion → poster)
- [ ] Extend `blocks/hero/hero.css` with `.hero.video-background` styles (full-cover video/poster, scrim, overlaid text)
- [ ] Add throwaway test pages; render on `localhost:3000`
- [ ] Verify: testimonials (cards, missing-field, responsive) + hero video (autoplay, reduced-motion poster, image hero unchanged)
- [ ] `npm run lint` clean
- [ ] Report both blocks + authoring models + screenshots; commit/push to `main` on your go-ahead

## Execution Note

Design choices are locked in. Writing the block files, running the dev server, and linting are **write/execution operations blocked in plan mode**. This plan is ready — **switch to Execute mode** and I'll build both the `testimonials` block and the hero `video-background` variant, verify locally, lint, and report back (committing/pushing on your go-ahead).

*(Aside: the optional **modern-web-guidance** plugin was offered this turn — it could sanity-check the video autoplay/accessibility approach against current best practices. Not required; say the word if you'd like it enabled.)*
