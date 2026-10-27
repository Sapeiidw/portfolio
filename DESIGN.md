# Design notes

Reading this as a personal developer portfolio for people evaluating Sakti's
work, with the approved dark, warm miniature-workspace reference as its visual
direction. This is a greenfield implementation using native CSS, not an
implementation of a named component design system.

- DESIGN_VARIANCE: 6. Asymmetric text and scene, followed by direct project
  information and a simple contact section.
- MOTION_INTENSITY: 7. Motivated scroll movement takes visitors from the desk
  overview toward the project displayed on its monitor. Pointer response is
  restrained. No scroll hijacking or continuous idle animation.
- VISUAL_DENSITY: 3. Generous spacing, one real project, and three labeled demo concepts.
- Serif display typography follows the visual mockup approved in the thread.
  DM Sans provides practical navigation and body copy.
- One dark theme, warm accent, consistent small control radii.

The desk, robot, plant, books, and island form one persistent scene. Scrolling
moves the camera toward its monitor; selecting a project changes only the screen
composition and accompanying copy. The fallback is a direct WebP capture of the
same geometry and lighting, avoiding a different mascot or object arrangement.

## Assets and provenance

- `public/images/workspace.webp`: exported from the actual Three.js scene.
- `public/images/navia.svg`: original illustrative interface study, not a claimed
  screenshot of the application.
- `public/images/orbit.webp`, `verdant.webp`, and `forma.webp`: generated using
  the built-in image-generation tool, then resized/compressed to WebP.
- The robot is an original fictional mascot; no portrait or likeness is used.
- The demo concepts are clearly marked as fictional on the site.

Final project-art prompts (built-in image generation):

1. **Orbit**: Cinematic photoreal 3D landscape with two weathered stone monoliths
   above a reflective lake, a luminous ivory ring, a pale sunset sphere, distant
   misty mountains, warm taupe and charcoal. Wide 3:2, no text or logos.
2. **Verdant**: Premium architectural photograph of a dark timber and glass
   cabin in lush tropical forest, warm amber windows, stone steps and misty
   mountains. Moody early morning, wide 3:2, no people, text, or logos.
3. **Forma**: Editorial product photograph of cream aluminum and cognac leather
   headphones on a travertine plinth against burnt sienna. Diagonal sunlight,
   tactile materials, wide 3:2, no text or logos.

Wood and rock use local 1K Poly Haven PBR color, normal, and roughness maps. Book pages and spines are deterministic canvas drawings. Foliage uses
instanced leaves. Lighting includes a locally rendered studio environment and
warm direct lights; no remote environment assets are fetched.

The main scene is a full-viewport background with text layered in front. Its
framing protects the monitor and mascot rather than shrinking the entire desk.
A restrained depth-of-field pass softens nearer props; it does not affect DOM
text. The book-review scene reuses the same robot, oriented toward the stack,
with head and eye tracking for pointer, focus, and touch selections.


## Fantasy journey redesign, October 2026

Branch: `feat/portfolio-refinements`. The current page replaces the desk layout with one fixed, full-viewport world. Nine destinations share a continuous camera path. Five explicitly fictional projects accompany the real Navia ERP project. Each has distinct architecture, an animated object, and its own image surface.

Visual direction: an illustrated fantasy atlas in deep teal, weathered stone, foliage, and warm brass light. The existing manuscript-like Cormorant typography and consistent cream robot are retained. Sharp HTML sits above native Three.js depth of field; flat foreground fronds and motes move at separate cursor depths. The camera travels through the world without changing or intercepting native wheel behaviour.

Terrain and mountain geometry, trees, portal, observatory, headphones, lighthouse, water shader, and airship are procedural, deterministic assets. Tidal and Aether previews are original local SVG interface studies with fictional content. The same original Robot component appears at the threshold, craft, and closing portal. Hero posters are direct exports of the live scene, with separate desktop and mobile compositions.
