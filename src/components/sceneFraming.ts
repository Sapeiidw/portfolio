import { Box3, MathUtils, Object3D, PerspectiveCamera, Vector3 } from 'three';
export interface FrameRegion { left: number; top: number; width: number; height: number }

/** Fit all eight bounds corners inside a safe region, including depth. */
export class SceneFraming {
  readonly center = new Vector3();
  private corners: Vector3[] = [];
  private right = new Vector3();
  private up = new Vector3();
  private relative = new Vector3();
  measure(model: Object3D) {
    model.updateWorldMatrix(true, true);
    const box = new Box3().setFromObject(model).expandByScalar(.1);
    this.setBox(box);
  }
  setBox(box: Box3) {
    box.getCenter(this.center);
    this.corners = [];
    for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) this.corners.push(new Vector3(x, y, z));
  }
  fit(camera: PerspectiveCamera, width: number, height: number, direction: Vector3, region: FrameRegion) {
    direction.normalize();
    this.right.crossVectors(camera.up, direction).normalize();
    this.up.crossVectors(direction, this.right).normalize();
    const tanV = Math.tan(MathUtils.degToRad(camera.fov / 2));
    const tanH = tanV * width / height;
    let distance = 1;
    for (const corner of this.corners) {
      this.relative.copy(corner).sub(this.center);
      const z = this.relative.dot(direction);
      distance = Math.max(distance, z + Math.abs(this.relative.dot(this.right)) / (tanH * region.width), z + Math.abs(this.relative.dot(this.up)) / (tanV * region.height));
    }
    camera.position.copy(direction).multiplyScalar(distance * 1.035).add(this.center);
    camera.lookAt(this.center);
    camera.aspect = width / height;
    camera.setViewOffset(width, height, (.5 - region.left - region.width / 2) * width, (.5 - region.top - region.height / 2) * height, width, height);
    camera.updateMatrixWorld();
  }
}
