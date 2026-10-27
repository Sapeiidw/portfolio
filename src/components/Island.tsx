import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { BufferGeometry, Color, Float32BufferAttribute, IcosahedronGeometry, InstancedMesh, Object3D } from 'three';
import { seededRandom } from './sceneTextures';
import { useSurface } from './sceneMaterials';

function cliffGeometry() {
  const geometry = new BufferGeometry(), vertices: number[] = [], uvs: number[] = [], indices: number[] = [];
  const segments = 112, rings = 9;
  for (let ring = 0; ring <= rings; ring++) {
    const t = ring / rings, taper = 1 - Math.pow(t, 1.9) * .69;
    for (let i = 0; i <= segments; i++) {
      const angle = i / segments * Math.PI * 2, c = Math.cos(angle), s = Math.sin(angle);
      const x = Math.sign(c) * Math.pow(Math.abs(c), .48) * 3.28;
      const z = Math.sign(s) * Math.pow(Math.abs(s), .48) * 1.65;
      const noise = Math.sin(angle * 17 + ring * 1.7) * .047 + Math.cos(angle * 29 - ring * 2.2) * .026;
      vertices.push(x * taper * (1 + noise), -.12 - t * 1.05 + Math.sin(angle * 11 + ring) * .04, z * taper * (1 + noise));
      uvs.push(i / segments * 5, t * .85);
      if (ring < rings && i < segments) { const a = ring * (segments + 1) + i, b = a + segments + 1; indices.push(a, a + 1, b, b, a + 1, b + 1); }
    }
  }
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3)); geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2)); geometry.setIndex(indices); geometry.computeVertexNormals(); return geometry;
}
export function Island() {
  const surface = useSurface('rock');
  const geometry = useMemo(cliffGeometry, []), rock = useMemo(() => {
    const geo = new IcosahedronGeometry(1, 2), pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i), n = 1 + Math.sin(x * 14 + z * 9) * .1; pos.setXYZ(i, x * n, y * n, z * n); } geo.computeVertexNormals(); return geo;
  }, []);
  const fragments = useMemo(() => { const random = seededRandom(19); return Array.from({ length: 22 }, (_, i) => {
    const angle = random() * Math.PI * 2, radius = i < 15 ? .85 : .65;
    return { x: Math.cos(angle) * 3 * radius, z: Math.sin(angle) * 1.5 * radius, y: i < 15 ? -.23 - random() * .25 : -1.15 - random() * .35, scale: i < 15 ? .13 + random() * .2 : .035 + random() * .05, rotation: random() * 7 };
  }); }, []);
  const moss = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const object = new Object3D(), random = seededRandom(39);
    for (let i = 0; i < 900; i++) {
      const angle = random() * Math.PI * 2, c = Math.cos(angle), s = Math.sin(angle), t = random() * .6;
      const x = Math.sign(c) * Math.pow(Math.abs(c), .48) * 3.28, z = Math.sign(s) * Math.pow(Math.abs(s), .48) * 1.65;
      const taper = 1 - Math.pow(t, 1.9) * .69, size = .009 + random() * .025;
      object.position.set(x * taper, -.1 - t * 1.05, z * taper); object.scale.set(size * 1.7, size * .7, size * 1.4); object.rotation.set(random() * 3, random() * 3, 0); object.updateMatrix();
      moss.current!.setMatrixAt(i, object.matrix); moss.current!.setColorAt(i, new Color().setHSL(.19 + random() * .05, .3, .045 + random() * .04));
    } moss.current!.instanceMatrix.needsUpdate = true;
  }, []);
  useEffect(() => () => { geometry.dispose(); rock.dispose(); }, [geometry, rock]);
  return <group>
    <mesh geometry={geometry} castShadow receiveShadow><meshStandardMaterial {...surface} roughness={1} color="#a8a194" /></mesh>
    {fragments.map((fragment, i) => <mesh key={i} geometry={rock} position={[fragment.x, fragment.y, fragment.z]} scale={[fragment.scale * 1.5, fragment.scale, fragment.scale]} rotation={[fragment.rotation, fragment.rotation * .7, 0]} castShadow receiveShadow><meshStandardMaterial {...surface} roughness={1} color={i % 3 ? '#9b9588' : '#73755c'} /></mesh>)}
    <instancedMesh ref={moss} args={[undefined, undefined, 900]} castShadow receiveShadow><icosahedronGeometry args={[1, 1]} /><meshStandardMaterial roughness={1} /></instancedMesh>
  </group>;
}
