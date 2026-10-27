# Sakti Pujo Edi's portfolio

A dark, warm portfolio with an original floating 3D workspace, robot mascot,
and scroll-controlled camera. Built with React, TypeScript, Vite, React Three
Fiber, Drei, and GSAP. No backend or API keys required.

## Run

Use Node.js 24 and pnpm 11.18.0. The package manager is pinned in `package.json`.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

## Build and verify

```sh
pnpm check
pnpm preview
```

The deployable site is in `dist/`. `check` performs TypeScript validation,
builds the app, prerenders its HTML, checks assets and metadata, and enforces
the initial-JavaScript and poster-image budgets.

`portfolio-deploy.zip` contains the verified static build for a direct upload.
Rebuild `dist` after changing source files; the ZIP is a delivery snapshot.

## Deploy

Choose one provider. Deploy from this directory, not its parent.

| Provider | Build command | Output | Configuration |
| --- | --- | --- | --- |
| Vercel | `pnpm build` | `dist` | `vercel.json` included |
| Netlify | `pnpm build` | `dist` | `netlify.toml` included |
| Cloudflare Pages | `pnpm build` | `dist` | Set Node version to 24 |
| Any static host | Build locally | Upload `dist` contents | No server runtime required |

On Vercel, import the Git repository and use the included configuration.
On Netlify, import the repository or upload the built `dist` folder using
Netlify Drop. Cloudflare Pages accepts the same static output. All paths assume
the site is hosted at the domain root.

Before the final domain deployment, set `site.url` in `src/data/site.ts` to your
HTTPS domain and rebuild. This enables canonical URLs, absolute social-image
URLs, and the generated sitemap. No example domain is published by default.

## Personalize

- `src/data/site.ts`: name, role, GitHub, optional public email, final domain,
  Navia ERP project copy, and the demo-project list.
- `src/App.tsx`: page composition and about text.
- `src/styles.css`: colors, typography, responsive layouts.
- `src/components/Workspace.tsx`: desk and its objects.
- `src/components/Robot.tsx`: original mascot.
- `src/components/WorkspaceScene.tsx`: camera path and lighting.
- `src/components/sceneTextures.ts`: monitor compositions and procedural materials.
- `src/components/Island.tsx` and `Plants.tsx`: floating terrain and trailing foliage.
- `public/images/`: local project artwork and the live-scene poster.

Navia ERP is presented as **in development**. No employer work, customer names,
testimonials, invented results, or confidential project screens are included.
GitHub is the contact destination until a public email is supplied.

## Performance and accessibility

- Complete HTML is generated at build time, including profile metadata.
  Content and anchor navigation work without JavaScript.
- The 3D renderer is dynamically imported after the initial page paint. It is
  not part of the initial preload graph.
- Mobile, reduced-motion, and data-saving visitors start with a roughly 49 kB
  WebP poster. Visitors can explicitly enable 3D.
- Rendering is on demand, with a pixel ratio capped at 1.5. The scene uses local project artwork and procedural geometry; no external
  model, environment-map, or post-processing downloads are needed.
- The camera settles after input; offscreen pointer activity does not redraw
  the scene. The motion toggle persists locally when storage is available.
- Fonts are self-hosted. Links have keyboard focus styles. A skip link and
  semantic page headings are included.

See `DESIGN.md` for the visual direction and generated-asset provenance.

## Project previews

The selected-work controls update both the project description and the image on
the same 3D monitor. Navia ERP is the real current project. Orbit, Verdant, and
Forma are fictional demo concepts with distinct artwork and expandable details.
Their labels remain visible so they cannot be mistaken for client work.

The lightweight `workspace.webp` poster is exported directly from this scene,
so the desk, robot, and object arrangement match when 3D loads. After changing
the geometry, regenerate it from the dev-only `window.__captureWorkspace()`
helper at the top of the page. The helper is omitted from production builds.
