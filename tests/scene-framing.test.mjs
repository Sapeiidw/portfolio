import test from 'node:test';
import assert from 'node:assert/strict';
import { Box3, PerspectiveCamera, Vector3 } from 'three';
import { SceneFraming } from '../src/components/sceneFraming.ts';

function checkProjection(box, region, width, height, direction) {
  const camera = new PerspectiveCamera(35, width / height, .1, 100);
  const framing = new SceneFraming(); framing.setBox(box); framing.fit(camera, width, height, direction, region);
  for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) {
    const projected = new Vector3(x, y, z).project(camera);
    const screenX = (projected.x + 1) / 2, screenY = (1 - projected.y) / 2;
    assert.ok(screenX >= region.left && screenX <= region.left + region.width, `Horizontal clipping at ${width}x${height}: ${screenX}`);
    assert.ok(screenY >= region.top && screenY <= region.top + region.height, `Vertical clipping at ${width}x${height}: ${screenY}`);
  }
}
test('monitor and antenna stay visible through the desktop camera move', () => {
  const focus = new Box3(new Vector3(-1.9, .25, -1.25), new Vector3(1.9, 3.55, -.25));
  for (const [width, height] of [[768, 1024], [1280, 800], [1440, 900], [2560, 1080]]) {
    for (const progress of [0, .25, .5, .75, 1]) {
      const content = Math.min(width, 1536), start = (width - content) / 2, span = .39 + progress * .13;
      checkProjection(focus, { left: (start + content * (.69 - span / 2)) / width, top: .08, width: content * span / width, height: .7 }, width, height, new Vector3(4.6 - progress * 2.1, 3.1 - progress * .6, 11.8 - progress * 1.5));
    }
  }
});
test('the full book perch fits portrait and landscape canvases', () => {
  const perch = new Box3(new Vector3(-2, -.5, -1.3), new Vector3(2, 2.1, 1.3));
  for (const [width, height] of [[272, 332], [390, 430], [500, 520], [716, 562]]) checkProjection(perch, { left: .035, top: .035, width: .93, height: .93 }, width, height, new Vector3(2.1, 1.4, 5.7));
});
