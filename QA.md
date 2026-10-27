# Verification

Updated October 27, 2026 on `feat/detailed-workspace-robot-gaze`.

- `pnpm check` passes camera-framing regression tests, TypeScript, production
  build, static prerendering, asset checks, and initial JavaScript budgets.
- Camera tests cover portrait, tablet, desktop, and ultrawide sizes. They protect
  the monitor and antenna while allowing the desk to remain large behind text.
  The full book perch is protected by a separate framing test.
- Browser: head and eyes respond to pointer movement. Keyboard focus across all
  four corners of the stack changes the gaze in both axes and selects the right
  description. A real Tab key moved focus and selection to the next tool.
- Responsive/axe-core checks at 320, 390, 768, 1024, and 1440 pixels found no
  horizontal overflow or WCAG 2 A/AA and 2.1 AA violations. Automated checks do
  not constitute a complete accessibility audit.
- Full-viewport 3D background, foreground HTML text, and monitor-focused depth
  of field replace the previous rectangular crop. The stack robot faces right.
- Desktop, mobile, and book-perch posters are direct captures of the same models.
  Desktop poster is approximately 60 kB, mobile 12 kB, and book perch 16 kB.
  Initial JavaScript is approximately 81 kB gzip. Optional 3D modules remain lazy.
- Material and glyph sources are documented under `public/textures` and
  `public/icons`. No external asset service is needed at runtime.

No deployment or ZIP packaging was performed for this branch revision.
