import test from "node:test";
import assert from "node:assert/strict";
import { Vector3 } from "three";
import { sampleJourney } from "../src/components/journey/cameraPath.ts";
const points = Array.from({ length: 9 }, (_, i) => ({
  position: [Math.sin(i) * 8, i % 3, -38 * i],
  camera: [i % 2 ? -6 : 7, 5, 15],
}));
test("camera flight remains continuous across every chapter boundary", () => {
  for (let i = 1; i < points.length; i++) {
    const before = new Vector3(),
      after = new Vector3(),
      targetBefore = new Vector3(),
      targetAfter = new Vector3();
    sampleJourney(points, i - 0.0001, before, targetBefore);
    sampleJourney(points, i + 0.0001, after, targetAfter);
    assert.ok(before.distanceTo(after) < 0.01, `Camera jumps at chapter ${i}`);
    assert.ok(
      targetBefore.distanceTo(targetAfter) < 0.01,
      `Focus jumps at chapter ${i}`,
    );
  }
});
test("camera is finite and safely separated from its focus over the entire route", () => {
  const camera = new Vector3(),
    target = new Vector3();
  for (let p = -1; p <= 9; p += 0.01) {
    sampleJourney(points, p, camera, target);
    assert.ok([...camera, ...target].every(Number.isFinite));
    assert.ok(camera.distanceTo(target) > 8);
  }
});
test("opening and closing poses are exact and progress is clamped", () => {
  for (const p of [-5, 0, 8, 20]) {
    const camera = new Vector3(),
      target = new Vector3(),
      i = p <= 0 ? 0 : 8;
    sampleJourney(points, p, camera, target);
    assert.ok(
      camera.distanceTo(
        new Vector3(...points[i].position).add(
          new Vector3(...points[i].camera),
        ),
      ) < 1e-8,
    );
  }
});
