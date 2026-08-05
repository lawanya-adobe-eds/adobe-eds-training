# New Block Plan: "Quote" (with attribution), styled to project tokens

## Objective

Create a reusable **`quote`** block for the `adobe-eds-training` project: a styled blockquote with quote text + an attribution line, using the project's design tokens (Syncopate headings / Instrument Sans body, `--text-color`, `--link-color`, `--content-max-width`, etc.). Follow the AEM boilerplate block conventions already used by the other blocks in `blocks/`.

## Content Model (author contract)

A 1-column block table authors fill in Document Authoring:

| Quote |
|-------|
| “The quote text goes here — the main statement.” |
| Attribution — Name, Role |

- **Row 1** → the quote text (rendered as a `<blockquote>`).
- **Row 2 (optional)** → the attribution line (rendered as a `<cite>`, e.g. "Alex Rivera, Streetwear Enthusiast"). If omitted, the block renders quote-only.

This mirrors the simple, forgiving structure the site's existing blocks use, so it's easy to author and degrades gracefully.

## Decoration (`blocks/quote/quote.js`)

- Read the block's rows; first row = quote body, second row (if present) = attribution.
- Wrap the quote in a semantic `<blockquote>` and the attribution in `<cite>` (prefixed with an em-dash), tagging classes `quote-text` / `quote-attribution`.
- Handle the author omitting the attribution row gracefully (no empty `<cite>`).
- Keep the default export `decorate(block)` signature and vanilla ES6, matching the repo style (verified against `columns.js`).

## Styling (`blocks/quote/quote.css`) — tokens only

- Scope every selector to `.quote` (per project CSS rules).
- Large quote text in the heading font (`var(--heading-font-family)`, size around `--heading-size-l/m`), `var(--text-color)`.
- Attribution in `var(--body-font-family)`, smaller, `var(--link-color)`, with the em-dash.
- A left accent border (using `--text-color`) or centered treatment — I'll pick the cleaner default and note it.
- Mobile-first, `min-width` breakpoints at 900px, constrained to the content column; reuses the section padding/`--content-max-width` conventions. No hard-coded colors/fonts — tokens only.

## Testing / Verification

- Create a small static test (a `drafts/` HTML file or a temporary content doc) to render the block on the local dev server (`http://localhost:3000`) and confirm: quote + attribution render, tokens applied (font/color), responsive, and attribution-omitted case works.
- Run `npm run lint` (ESLint + Stylelint) — must pass clean, matching the rest of the repo.

## Checklist

- [ ] Confirm the content-model / visual style choice with you (see question)
- [ ] Create `blocks/quote/quote.js` (decorate: quote body + optional attribution → `<blockquote>` + `<cite>`)
- [ ] Create `blocks/quote/quote.css` (token-based: fonts, colors, spacing, accent, responsive; all scoped to `.quote`)
- [ ] Add a throwaway test (drafts HTML or temp DA doc) and render on `localhost:3000`
- [ ] Verify: quote + attribution render, tokens applied, attribution-omitted case, mobile layout
- [ ] `npm run lint` clean (ESLint + Stylelint)
- [ ] Report the block, its authoring model, and a screenshot; commit/push on your go-ahead

## Decision Needed From You

I'd like one quick style preference before building (default noted). Then execution requires **Execute mode** (writing block files, running the dev server, and linting are blocked in plan mode).# New Block Plan: "Quote" (left accent bar, body-font italic), styled to project tokens

## Objective

Create a reusable **`quote`** block for `adobe-eds-training`: a styled blockquote with quote text + an attribution line, using the project's design tokens. Follow the AEM boilerplate block conventions used by the other blocks in `blocks/`.

## Confirmed Style Decisions

- **Layout:** Left accent bar — large quote text with a bold left border in `var(--text-color)`, attribution below. Editorial, works inline in articles.
- **Quote font:** Body font (Instrument Sans), larger + **italic** — reads as a natural pull-quote, consistent with the site's testimonial quotes.
- **Attribution:** Instrument Sans, smaller, `var(--link-color)`, em-dash prefix.

## Content Model (author contract)

A 1-column block table in Document Authoring:

| Quote |
|-------|
| “The quote text — the main statement.” |
| Name, Role  *(optional)* |

- **Row 1** → quote text → `<blockquote class="quote-text">`
- **Row 2 (optional)** → attribution → `<cite class="quote-attribution">` (em-dash prefixed). Omitted row → quote renders alone, no empty `<cite>`.

## Files

**`blocks/quote/quote.js`** — `decorate(block)`: first row = quote body, optional second row = attribution; wrap semantically in `<blockquote>` + `<cite>`; graceful when attribution is missing. Vanilla ES6, matching repo style.

**`blocks/quote/quote.css`** — all selectors scoped to `.quote`; tokens only:
- Quote: `var(--body-font-family)`, italic, ~`--heading-size-m/l`, `var(--text-color)`
- Left border accent in `var(--text-color)`; left padding
- Attribution: `var(--body-font-family)`, smaller, `var(--link-color)`, em-dash
- Mobile-first with a 900px `min-width` breakpoint; constrained to content column. No hard-coded colors/fonts.

## Testing / Verification

- Add a throwaway `drafts/` HTML test, render on the local dev server (`http://localhost:3000`), and confirm: quote + attribution render, tokens applied (italic Instrument Sans, accent bar, grey attribution), responsive, and attribution-omitted case.
- `npm run lint` (ESLint + Stylelint) — must pass clean.

## Checklist

- [x] Confirm style choices (left accent bar; body-font italic)
- [ ] Create `blocks/quote/quote.js` (quote body + optional attribution → `<blockquote>` + `<cite>`)
- [ ] Create `blocks/quote/quote.css` (token-based, scoped to `.quote`, responsive, left accent bar)
- [ ] Add throwaway test (drafts HTML) and render on `localhost:3000`
- [ ] Verify: rendering, tokens, attribution-omitted case, mobile layout
- [ ] `npm run lint` clean
- [ ] Report block + authoring model; commit/push to `main` on your go-ahead

## Execution Note

Style decisions are locked in. Creating the block files, running the dev server, and linting are **write/execution operations blocked in plan mode**. This plan is ready — **switch to Execute mode** and I'll build the `quote` block, verify it locally, lint, and report back (committing/pushing on your go-ahead).
