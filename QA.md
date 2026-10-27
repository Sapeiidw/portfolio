# Verification

Updated October 27, 2026 after the reference-matching revision.

- `pnpm check` passes TypeScript, production build, static prerendering, asset
  references, profile URL, one primary heading, and performance budgets.
- Browser: live scene renders; project selection updates the description and
  monitor artwork. Demo image links open their associated concept details.
- Responsive layouts: 320, 390, 768, and 1440 CSS pixels checked in browser
  frames. No horizontal overflow.
- axe-core WCAG 2 A/AA and WCAG 2.1 AA scan: zero violations at those four widths.
  This is an automated check, not a complete accessibility audit.
- Fallback poster: approximately 49 kB, captured directly from the live scene.
  Initial JavaScript: approximately 77 kB gzip. Optional scene: approximately
  304 kB gzip. These are build measurements, not field Core Web Vitals scores.
- Four project previews: Navia ERP plus three clearly labeled fictional concepts
  with different local images. Former-employer work is excluded.

No live deployment was performed. Deploy `dist` or use the included provider
configurations. Set the final domain in `src/data/site.ts` for canonical URLs
and sitemap generation.
