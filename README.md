# Sakti Pujo Edi’s portfolio

A full-screen fantasy journey built with React, TypeScript, Vite, React Three Fiber, and Three.js. A continuous scroll-driven camera flies between nine chapters. HTML copy stays in front of the world, with independent near-field foliage, cursor parallax, depth of field, and bloom.

## Run

Node 24 and pnpm 11.18.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

## Verify and deploy

```sh
pnpm check
pnpm preview
```

Deploy `dist/` using the included Vercel or Netlify configuration, or any static host. Build command: `pnpm build`. No backend or API keys are required. Set `site.url` in `src/data/site.ts` to the final HTTPS domain before production deployment to enable canonical metadata and the sitemap.

## Journey

- Threshold: a rune-lit portal, floating terrain, and the original robot guide.
- Navia ERP: clockwork citadel. Real personal project, in development.
- Orbit: celestial observatory and an animated armillary.
- Verdant: forest sanctuary and retreat concept.
- Forma: a floating audio artifact in an artisan’s forge.
- Tidal: a marine dashboard, animated water, and a lighthouse.
- Aether: a knowledge workspace beneath an animated airship.
- Craft: the same robot on books, facing right toward the interactive toolkit.
- Contact: an open portal and the real GitHub profile.

The five projects after Navia are explicitly labelled fictional concepts. Their field notes describe proposed ideas without claiming shipped clients or commercial results.

## Edit

- `src/data/journey.ts`: chapters, camera destinations, project content, and field notes.
- `src/components/journey/cameraPath.ts`: continuous camera flight with exploration and travel phases.
- `src/components/journey/RealmScene.tsx`: renderer, lighting, animation, depth of field, and bloom.
- `src/components/journey/RealmObjects.tsx`: unique project environments and showcase objects.
- `src/components/journey/Terrain.tsx`: seeded terrain, mountains, instanced foliage, and debris.
- `src/components/journey/Foreground.tsx`: independent 2D parallax layer.
- `src/components/Robot.tsx` and `useRobotGaze.ts`: shared robot geometry and cursor/toolkit tracking.
- `src/App.tsx`, `src/styles.css`: foreground content, navigation, accessible dialogs, responsive layout.
- `src/data/site.ts`: identity, contact, final domain, and original project content.

## Rendering and accessibility

The initial page is prerendered. The renderer is dynamically imported and never preloaded with the initial bundle. All fonts, textures, icons, and artwork are local. Pixel ratio is capped at 1.35. Only nearby islands render; paused motion uses demand rendering, and hidden tabs suspend the frame loop. Desktop uses multisampling, depth of field, and bloom. Mobile omits the expensive depth-of-field pass while retaining depth through the camera and foreground layers.

Reduced-motion and data-saving visitors start with a static scene. The motion control allows loading the 3D view; OS reduced-motion continues to suppress animation. Native anchor links, focus styles, a skip link, labelled project controls, and modal focus restoration support keyboard navigation. The journey atlas links directly to all six projects.

`realm.webp` and `realm-mobile.webp` are direct captures of the live world. Refresh them after model changes using the development-only `window.__captureRealm()` helper at the opening chapter. PBR texture and icon provenance remains in `public/textures/README.md` and `public/icons/README.md`. Existing Orbit, Verdant, and Forma artwork provenance is recorded in `DESIGN.md`; Tidal and Aether are original SVG interface studies.
