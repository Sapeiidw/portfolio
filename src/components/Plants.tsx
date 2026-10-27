import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { CanvasTexture, CatmullRomCurve3, Color, DoubleSide, InstancedMesh, Object3D, Shape, ShapeGeometry, SRGBColorSpace, Vector3 } from 'three';
import { seededRandom } from './sceneTextures';

function leafGeometry() {
  const shape = new Shape();
  shape.moveTo(0, .34); shape.bezierCurveTo(-.1, .52, -.38, .4, -.31, .13);
  shape.bezierCurveTo(-.25, -.12, -.08, -.4, 0, -.52);
  shape.bezierCurveTo(.1, -.36, .28, -.1, .32, .14);
  shape.bezierCurveTo(.38, .42, .1, .51, 0, .34);
  const geo = new ShapeGeometry(shape, 10), pos = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i);
    pos.setZ(i, .06 - Math.abs(x) * .26 + Math.sin(y * 4) * .035);
    uv.setXY(i, x / .72 + .5, (y + .52) / 1.04);
  }
  geo.computeVertexNormals(); return geo;
}
function leafTexture() {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d')!, random = seededRandom(49);
  const g = ctx.createLinearGradient(30, 0, 225, 250); g.addColorStop(0, '#939b5a'); g.addColorStop(.45, '#52683b'); g.addColorStop(1, '#a0a15b'); ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 1100; i++) {ctx.fillStyle = `rgba(193,183,82,${random() * .2})`; ctx.fillRect(random() * 256, random() * 256, 1 + random() * 6, 1 + random() * 11);}
  ctx.strokeStyle = '#a3a15a'; ctx.lineWidth = 1.8; ctx.beginPath();ctx.moveTo(128, 24);ctx.quadraticCurveTo(119, 146, 128, 248);ctx.stroke();
  for(let i = 0; i < 7; i++) for (const side of [-1, 1]) { const y = 52 + i * 25; ctx.strokeStyle = '#8a904b88';ctx.lineWidth = .9;ctx.beginPath();ctx.moveTo(125, y);ctx.quadraticCurveTo(128 + side * 44, y - 14, 128 + side * (75 - i * 6), y - 35);ctx.stroke(); }
  const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace; texture.anisotropy = 4; return texture;
}
export function Plants({ variant = 'workspace' }: { variant?: 'workspace' | 'review' }) {
  const leaves = useRef<InstancedMesh>(null);
  const geometry = useMemo(leafGeometry, []), texture = useMemo(leafTexture, []);
  const vines = useMemo(() => {
    const climbing = Array.from({ length: 7 }, (_, i) => {
      const phase = i * 1.21;
      return new CatmullRomCurve3([
        new Vector3(-2.15, .45, -1), new Vector3(-2.05 + Math.sin(phase) * .2, 1.45, -1.1),
        new Vector3(-1.85 + Math.sin(phase) * .25, 2.55 + Math.cos(phase) * .15, -1.1),
        new Vector3(-2.4 + Math.sin(phase) * .25, 2.7 + Math.cos(phase) * .15, -.95),
        new Vector3(-2.65 + Math.sin(phase) * .25, 1.55, -.65), new Vector3(-2.75 + Math.sin(phase) * .35, .2 - (i % 3) * .25, -.2),
      ]);
    });
    const hanging = Array.from({ length: 6 }, (_, i) => {
      const side = i < 3 ? -1 : 1, offset = i % 3;
      return new CatmullRomCurve3([new Vector3(side * 2.85, .18, -.65 + offset * .8), new Vector3(side * 3.2, -.12, -.6 + offset * .82), new Vector3(side * 3.05, -.65, -.5 + offset * .8), new Vector3(side * (2.7 + offset * .15), -1.02 - offset * .07, -.35 + offset * .8)]);
    });
    return variant === 'workspace' ? [...climbing, ...hanging] : climbing;
  }, [variant]);
  const count = vines.length * 27;
  useLayoutEffect(() => {
    const object = new Object3D(), random = seededRandom(66);
    for (let i = 0; i < count; i++) {
      const curve = i % vines.length, t = (Math.floor(i / vines.length) + .4) / 27;
      const p = vines[curve].getPoint(t), side = i % 2 ? 1 : -1;
      const hanging = curve >= 7, scale = (hanging ? .18 : .34) * (.7 + random() * .6);
      object.position.set(p.x + side * scale * .32, p.y - scale * .3, p.z + .045);
      object.rotation.set(-.25 + random() * .9, -.7 + random() * 1.4, side * (.3 + random() * .6));
      object.scale.set(scale, scale, scale); object.updateMatrix(); leaves.current!.setMatrixAt(i, object.matrix);
      leaves.current!.setColorAt(i, new Color().setHSL(.17 + random() * .055, .14 + random() * .2, .68 + random() * .2));
    }
    leaves.current!.instanceMatrix.needsUpdate = true;
  }, [vines, count]);
  useEffect(() => () => { geometry.dispose(); texture.dispose(); }, [geometry, texture]);
  return <group>
    <mesh position={[-2.15, .42, -1]} castShadow><cylinderGeometry args={[.27, .21, .44, 48]} /><meshStandardMaterial color="#32392c" roughness={.86} /></mesh>
    <mesh position={[-2.15, .65, -1]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[.25, 32]} /><meshStandardMaterial color="#28231a" roughness={1} /></mesh>
    {vines.map((curve, i) => <mesh key={i} castShadow><tubeGeometry args={[curve, 48, i < 7 ? .009 : .006, 5, false]} /><meshStandardMaterial color="#5c5d31" roughness={.9} /></mesh>)}
    <instancedMesh ref={leaves} args={[geometry, undefined, count]} castShadow receiveShadow><meshStandardMaterial map={texture} roughness={.7} side={DoubleSide} /></instancedMesh>
  </group>;
}
