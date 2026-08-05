# Final Verification Plan: `about-us` — Original vs Migrated

## Objective

Run a fresh, comprehensive side-by-side comparison of the original `https://wknd-trendsetters.site/about-us` against the deployed migrated `https://main--adobe-eds-training--lawanya-adobe-eds.aem.page/about-us` to **confirm they now match** after all the fixes applied this session. Read-only audit — report a pass/fail per area, flag any residual mismatch.

## What to Re-Confirm (all fixes from this session)

Every issue fixed since the original comparison, plus a full re-sweep:

1. **Footer social icons + brand logo** — present and **visible/white** on the dark footer (the just-fixed `currentColor`-on-black bug).
2. **Header alignment** — brand at x=144, Subscribe CTA right edge at 1296 (content column).
3. **FAQ "Got questions?"** — 2-column grid centered in the 1152px column (heading x=144→688, accordion x=752→1296).
4. **Centered headings** — gallery + latest-articles intros center-aligned.
5. **Article breadcrumb** — "Home › Case studies" present with chevron separator.
6. **Section padding** — 128px on all sections.
7. **Content width** — 1152px column, 144px gutters, across every section.
8. **hero-banner** — contained rounded card at x=144→1296 (not full-bleed).
9. **All 7 blocks + header + footer** — structure, alignment, no missing/blank/invisible elements.

## Method

- Desktop **1440×900** primary; spot-check mobile **375×812** for header (hamburger/accordion) and footer/section stacking.
- Per section: extract `getBoundingClientRect` (x/right/width, column ratios) + key computed styles (grid-template-columns, text-align, padding, aspect-ratio, background) from **both** sites and diff against the original's reference values.
- Verify every icon/image is present **and** visible (non-zero size, not same-color-on-same-color, no `about:error`).
- Produce a per-area **✅ match / ⚠️ mismatch** table; for any mismatch, note section → property → original vs migrated → severity.

## Checklist

- [ ] Capture original reference metrics (header, 7 sections, footer) at desktop
- [ ] Capture migrated metrics at desktop from the deployed preview
- [ ] Diff header alignment (brand x=144, CTA right=1296)
- [ ] Diff FAQ 2-col layout (centered 1152px, 544/544, top-aligned)
- [ ] Confirm footer icons visible/white + 3-column link grid
- [ ] Confirm centered gallery + latest-articles headings
- [ ] Confirm article breadcrumb + chevron present
- [ ] Confirm 128px section padding + 1152px content width across sections
- [ ] Confirm hero-banner contained (x=144→1296)
- [ ] Scan all sections for missing/blank/invisible elements (imgs, icons, tab avatars, FAQ toggle)
- [ ] Spot-check mobile (375) header + footer + section stacking
- [ ] Produce final ✅/⚠️ match report; flag any residual mismatch (no code changes unless you then ask)

## Execution Note

This is a live inspection of both sites (Playwright navigate/evaluate/screenshot + computed-style extraction), which is **blocked in plan mode**. The plan is ready — **switch to Execute mode** and I'll run the full comparison and report whether the two sites now match, area by area, with any remaining discrepancies called out. No code changes will be made unless you ask for fixes after seeing the report.
