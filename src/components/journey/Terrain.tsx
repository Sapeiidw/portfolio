import { useLayoutEffect, useMemo, useRef } from "react";
import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  InstancedMesh,
  Object3D,
  IcosahedronGeometry,
} from "three";
import { useSurface } from "../sceneMaterials";
import { seededRandom } from "../sceneTextures";

export function islandGeometry(radius: number, depth: number, top = false) {
  const geometry = new BufferGeometry(),
    positions: number[] = [],
    uvs: number[] = [],
    indices: number[] = [];
  const segments = 100,
    rings = 14;
  for (let j = 0; j <= rings; j++)
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2,
        t = j / rings;
      const edge =
        1 +
        0.09 * Math.sin(a * 5) +
        0.045 * Math.cos(a * 11) +
        0.025 * Math.sin(a * 23);
      const r =
        radius *
        edge *
        (top ? t : Math.pow(1 - t * 0.96, 0.56)) *
        (top ? 1 : 1 + Math.sin(t * 32 + a * 9) * 0.06);
      const y = top
        ? 0.1 + Math.sin(r * 2 + a * 3) * 0.09 * t
        : 0.1 - t * depth + Math.sin(a * 9 + t * 12) * 0.11;
      positions.push(Math.cos(a) * r, y, Math.sin(a) * r * 0.76);
      uvs.push(
        top ? Math.cos(a) * r * 0.18 : (i / segments) * 5,
        top ? Math.sin(a) * r * 0.18 : t * 3,
      );
      if (j < rings && i < segments) {
        const n = j * (segments + 1) + i;
        indices.push(
          n,
          n + 1,
          n + segments + 1,
          n + 1,
          n + segments + 2,
          n + segments + 1,
        );
      }
    }
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
export function Terrain({
  seed = 1,
  radius = 5.7,
  depth = 4.8,
  moss = true,
}: {
  seed?: number;
  radius?: number;
  depth?: number;
  moss?: boolean;
}) {
  const surface = useSurface("rock");
  const side = useMemo(() => islandGeometry(radius, depth), [radius, depth]);
  const top = useMemo(
    () => islandGeometry(radius, depth, true),
    [radius, depth],
  );
  const debris = useRef<InstancedMesh>(null),
    grass = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const random = seededRandom(seed),
      dummy = new Object3D(),
      color = new Color();
    for (let i = 0; i < 65; i++) {
      const a = random() * Math.PI * 2,
        r = radius * (0.8 + random() * 0.65);
      dummy.position.set(
        Math.cos(a) * r,
        -0.7 - random() * 4.8,
        Math.sin(a) * r * 0.76,
      );
      dummy.rotation.set(random() * 3, random() * 3, random() * 3);
      const s = 0.08 + random() * 0.45;
      dummy.scale.set(s, s * (1 + random() * 2), s);
      dummy.updateMatrix();
      debris.current!.setMatrixAt(i, dummy.matrix);
    }
    debris.current!.instanceMatrix.needsUpdate = true;
    if (grass.current)
      for (let i = 0; i < 1100; i++) {
        const a = random() * Math.PI * 2,
          r = Math.sqrt(random()) * radius * 0.95;
        dummy.position.set(Math.cos(a) * r, 0.15, Math.sin(a) * r * 0.76);
        dummy.rotation.set(
          (random() - 0.5) * 0.5,
          random() * 6.3,
          (random() - 0.5) * 0.6,
        );
        dummy.scale.set(0.5 + random() * 0.8, 0.35 + random() * 1.5, 1);
        dummy.updateMatrix();
        grass.current.setMatrixAt(i, dummy.matrix);
        color.setHSL(
          0.19 + random() * 0.09,
          0.2 + random() * 0.2,
          0.17 + random() * 0.12,
        );
        grass.current.setColorAt(i, color);
      }
    if (grass.current) grass.current.instanceMatrix.needsUpdate = true;
    return () => {
      side.dispose();
      top.dispose();
    };
  }, [seed, radius, side, top]);
  return (
    <group>
      <mesh geometry={side} castShadow receiveShadow>
        <meshStandardMaterial {...surface} color="#778077" roughness={0.93} />
      </mesh>
      <mesh geometry={top} receiveShadow>
        <meshStandardMaterial
          {...surface}
          color={moss ? "#788368" : "#85857d"}
          roughness={0.96}
        />
      </mesh>
      <instancedMesh ref={debris} args={[undefined, undefined, 65]} castShadow>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial {...surface} color="#78847a" roughness={0.9} />
      </instancedMesh>
      {moss && (
        <instancedMesh ref={grass} args={[undefined, undefined, 1100]}>
          <coneGeometry args={[0.035, 0.33, 3]} />
          <meshStandardMaterial color="#607a4c" roughness={1} />
        </instancedMesh>
      )}
    </group>
  );
}
export function Trees({
  seed = 1,
  count = 17,
  radius = 5.3,
}: {
  seed?: number;
  count?: number;
  radius?: number;
}) {
  const trunk = useRef<InstancedMesh>(null),
    leaves = useRef<InstancedMesh>(null);
  const crown = useMemo(() => {
    const g = new IcosahedronGeometry(1, 2),
      p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i),
        y = p.getY(i),
        z = p.getZ(i),
        v =
          1 +
          Math.sin(x * 25 + z * 17) * 0.12 +
          Math.cos(y * 22 - x * 15) * 0.11;
      p.setXYZ(i, x * v, y * v, z * v);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  useLayoutEffect(() => {
    const random = seededRandom(seed),
      dummy = new Object3D(),
      color = new Color();
    for (let i = 0; i < count; i++) {
      const a = Math.PI * 0.85 + random() * Math.PI * 1.3,
        r = radius * (0.76 + random() * 0.24),
        x = Math.cos(a) * r,
        z = Math.sin(a) * r * 0.75,
        h = 1.5 + random() * 2.8;
      dummy.position.set(x, h * 0.43, z);
      dummy.rotation.set(0, random() * 6, 0);
      dummy.scale.set(0.08, h, 0.08);
      dummy.updateMatrix();
      trunk.current!.setMatrixAt(i, dummy.matrix);
      for (let j = 0; j < 60; j++) {
        const tier = Math.floor(j / 6),
          angle = j * 2.4 + i,
          spread = h * (0.27 - tier * 0.023),
          length = spread * (0.8 + random() * 0.3);
        dummy.position.set(
          x + Math.cos(angle) * spread * 0.48,
          h * (0.23 + tier * 0.07),
          z + Math.sin(angle) * spread * 0.48,
        );
        dummy.rotation.set(0.14, angle, 0.08);
        dummy.scale.set(length, 0.12 + h * 0.04, length * 0.48);
        dummy.updateMatrix();
        leaves.current!.setMatrixAt(i * 60 + j, dummy.matrix);
        color.setHSL(
          0.28 + random() * 0.08,
          0.18 + random() * 0.2,
          0.055 + random() * 0.065,
        );
        leaves.current!.setColorAt(i * 60 + j, color);
      }
    }
    trunk.current!.instanceMatrix.needsUpdate = true;
    leaves.current!.instanceMatrix.needsUpdate = true;
  }, [seed, count, radius]);
  return (
    <>
      <instancedMesh
        ref={trunk}
        args={[undefined, undefined, count]}
        castShadow
      >
        <cylinderGeometry args={[0.5, 1, 1, 7]} />
        <meshStandardMaterial color="#4b4940" roughness={1} />
      </instancedMesh>
      <instancedMesh
        ref={leaves}
        args={[crown, undefined, count * 60]}
        castShadow
      >
        <meshStandardMaterial roughness={1} />
      </instancedMesh>
    </>
  );
}
export function RuinColumn({
  position = [0, 0, 0],
  height = 3,
}: {
  position?: [number, number, number];
  height?: number;
}) {
  const surface = useSurface("rock");
  return (
    <group position={position}>
      <mesh position={[0, height * 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.29, 0.4, height, 12]} />
        <meshStandardMaterial {...surface} color="#899184" />
      </mesh>
      {[0, height].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} castShadow>
          <boxGeometry args={[0.91, 0.25, 0.91]} />
          <meshStandardMaterial {...surface} color="#8c8b78" />
        </mesh>
      ))}
      {[0.2, 0.35, height - 0.2].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <cylinderGeometry args={[0.44, 0.44, 0.09, 16]} />
          <meshStandardMaterial
            color="#98835c"
            metalness={0.6}
            roughness={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Continuous distant ridge geometry gives every camera angle a real horizon. */
export function Mountains({ seed = 1 }: { seed?: number }) {
  const surface = useSurface("rock");
  const geometry = useMemo(() => {
    const g = new BufferGeometry(),
      p: number[] = [],
      uv: number[] = [],
      idx: number[] = [],
      nx = 180,
      nz = 28;
    for (let j = 0; j <= nz; j++)
      for (let i = 0; i <= nx; i++) {
        const x = (i / nx) * 120 - 60,
          z = -17 - (j / nz) * 34;
        const ridge =
          3 +
          Math.pow(
            0.5 +
              0.5 * Math.sin(x * 0.16 + seed * 0.7 + Math.sin(x * 0.31) * 0.7),
            3,
          ) *
            15;
        const y =
          (ridge + 20) * Math.pow(Math.sin((j / nz) * Math.PI), 0.7) -
          25 +
          Math.sin(x * 1.7 + j * 0.9) * 0.4;
        p.push(x, y, z);
        uv.push(x * 0.12, z * 0.12);
        if (i < nx && j < nz) {
          const n = j * (nx + 1) + i;
          idx.push(n, n + 1, n + nx + 1, n + 1, n + nx + 2, n + nx + 1);
        }
      }
    g.setAttribute("position", new Float32BufferAttribute(p, 3));
    g.setAttribute("uv", new Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }, [seed]);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial {...surface} color="#506868" roughness={1} />
    </mesh>
  );
}
