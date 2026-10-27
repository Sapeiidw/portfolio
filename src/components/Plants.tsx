import { useLayoutEffect, useMemo, useRef } from 'react';
import { CatmullRomCurve3, Color, DoubleSide, InstancedMesh, Object3D, Vector3 } from 'three';
import { seededRandom } from './sceneTextures';

export function Plants() {
  const leaves = useRef<InstancedMesh>(null);
  const vines = useMemo(() => Array.from({ length: 9 }, (_, i) => new CatmullRomCurve3(Array.from({ length: 10 }, (_, j) => {
    const t = j / 9;
    return new Vector3(-1.95 - Math.sin(i * 1.7 + t * 4) * (.17 + t * .27), 2.65 - t * (2.6 + (i % 3) * .35), -.9 + Math.cos(i * 2.3 + t * 3) * .27);
  }))), []);
  useLayoutEffect(() => {
    const object = new Object3D(), rand = seededRandom(66);
    for (let i = 0; i < 180; i++) {
      const p = vines[i % 9].getPoint((Math.floor(i / 9) + rand() * .6) / 20);
      const side = i % 2 ? 1 : -1;
      object.position.set(p.x + side * .095, p.y, p.z + .035);
      object.rotation.set(.3 + rand() * .7, side * .4 + rand() * .6, side * (.4 + rand() * .5));
      const scale = .75 + rand() * .5;
      object.scale.set(.095 * scale, .17 * scale, .022); object.updateMatrix();
      leaves.current!.setMatrixAt(i, object.matrix);
      leaves.current!.setColorAt(i, new Color().setHSL(.19 + rand() * .055, .3 + rand() * .2, .16 + rand() * .1));
    }
    leaves.current!.instanceMatrix.needsUpdate = true;
  }, [vines]);
  return <group>
    {vines.map((curve, i) => <mesh key={i} castShadow><tubeGeometry args={[curve, 28, .012, 5, false]} /><meshStandardMaterial color="#555431" roughness={.9} /></mesh>)}
    <instancedMesh ref={leaves} args={[undefined, undefined, 180]} castShadow receiveShadow><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial roughness={.62} side={DoubleSide} /></instancedMesh>
  </group>;
}
