import { Vector3 } from "three";
export interface Waypoint {
  position: [number, number, number];
  camera: [number, number, number];
}
const smooth = (x: number) => {
  const t = Math.max(0, Math.min(1, x));
  return t * t * (3 - 2 * t);
};
/** Hold to explore each island, then fly along an elevated curve to the next. */
export function sampleJourney(
  points: Waypoint[],
  progress: number,
  position: Vector3,
  target: Vector3,
) {
  const p = Math.max(0, Math.min(points.length - 1, progress)),
    index = Math.floor(p),
    fraction = p - index;
  const a = points[index],
    b = points[Math.min(index + 1, points.length - 1)],
    travel = smooth((fraction - 0.37) / 0.63);
  const orbit = Math.sin(Math.min(fraction / 0.37, 1) * Math.PI * 0.5);
  for (let axis = 0; axis < 3; axis++) {
    const drift =
      axis === 0 ? -orbit * 0.8 : axis === 1 ? orbit * 0.18 : -orbit * 1.1;
    position.setComponent(
      axis,
      (a.position[axis] + a.camera[axis] + drift) * (1 - travel) +
        (b.position[axis] + b.camera[axis]) * travel,
    );
    target.setComponent(
      axis,
      a.position[axis] * (1 - travel) +
        b.position[axis] * travel +
        (axis === 1 ? 2.1 : 0),
    );
  }
  position.y += Math.sin(travel * Math.PI) * 4;
  return index + travel;
}
