import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { SoftBox, Rod } from './primitives';
import { Plants } from './Plants';
import { Island } from './Island';
import type { PortfolioProject } from '../data/site';
import { RoundedBox } from '@react-three/drei';
import { Color, InstancedMesh, Matrix4 } from 'three';
import { Robot } from './Robot';
import { makeScreenTexture, makeWoodTexture, makeBookTexture } from './sceneTextures';

function Keyboard() {
  const keys = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const matrix = new Matrix4();
    for (let i = 0; i < 60; i++) {
      matrix.makeTranslation((i % 12) * 0.13 - 0.715, 0.13, Math.floor(i / 12) * 0.13 - 0.26);
      keys.current!.setMatrixAt(i, matrix);
      keys.current!.setColorAt(i, new Color(i === 11 || i === 59 ? '#ca7445' : i % 12 > 9 ? '#b9b1a0' : '#e4dac6'));
    }
    keys.current!.instanceMatrix.needsUpdate = true;
  }, []);
  return <group position={[0, 0.23, 0.78]} rotation={[0, -0.04, 0]}>
    <SoftBox size={[1.83, 0.14, 0.83]} color="#282b29" radius={0.04} />
    <instancedMesh ref={keys} args={[undefined, undefined, 60]} castShadow receiveShadow><boxGeometry args={[0.112, 0.09, 0.108]} /><meshStandardMaterial roughness={0.65} /></instancedMesh>
    <SoftBox position={[-0.12, 0.13, 0.28]} size={[0.65, 0.1, 0.105]} color="#e9dec8" radius={0.015} />
  </group>;
}

function Lamp() {
  return <group position={[2.18, 0.25, -0.6]}>
    <mesh position={[0, 0.035, 0]} castShadow><cylinderGeometry args={[0.34, 0.38, 0.07, 28]} /><meshStandardMaterial color="#2b2b26" metalness={0.5} roughness={0.5} /></mesh>
    <Rod from={[0, 0.05, 0]} to={[0.12, 1.15, 0]} color="#aa8751" radius={0.035} />
    <Rod from={[0.12, 1.15, 0]} to={[-0.35, 1.8, 0]} color="#aa8751" radius={0.035} />
    <mesh position={[-0.35, 1.66, 0]} rotation={[0, 0, 0.18]} castShadow><coneGeometry args={[0.34, 0.42, 28, 1, true]} /><meshStandardMaterial color="#34322c" metalness={0.6} roughness={0.35} side={2} /></mesh>
    <mesh position={[-0.39, 1.46, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.29, 24]} /><meshStandardMaterial color="#ffe0a0" emissive="#ffc677" emissiveIntensity={2} /></mesh>
  </group>;
}

function Coffee() {
  return <group position={[2.1, 0.25, 0.91]}>
    <mesh position={[0, 0.025, 0]}><cylinderGeometry args={[0.36, 0.36, 0.05, 28]} /><meshStandardMaterial color="#3e3931" /></mesh>
    <mesh position={[0, 0.24, 0]} castShadow><cylinderGeometry args={[0.24, 0.21, 0.42, 32, 1, true]} /><meshStandardMaterial color="#44453a" roughness={0.3} side={2} /></mesh>
    <mesh position={[0, 0.441, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.225, 32]} /><meshStandardMaterial color="#231c16" roughness={0.18} /></mesh>
    <mesh position={[0.265, 0.26, 0]}><torusGeometry args={[0.13, 0.045, 8, 20]} /><meshStandardMaterial color="#44453a" roughness={0.3} /></mesh>
  </group>;
}

export function Workspace({ project }: { project: PortfolioProject | null }) {
  const invalidate = useThree(state => state.invalidate);
  const screen = useMemo(() => makeScreenTexture(project, invalidate), [project, invalidate]);
  const books = useMemo(() => [makeBookTexture('Good Software', '#24251f'), makeBookTexture('Better Experiences', '#34342a')], []);
  useEffect(() => () => books.forEach(texture => texture.dispose()), [books]);
  const wood = useMemo(makeWoodTexture, []);
  useEffect(() => () => { screen.dispose(); wood.dispose(); }, [screen, wood]);

  return <group position={[0, -0.3, 0]} rotation={[0, -.055, 0]}>
    <RoundedBox args={[6.6, 0.34, 3.35]} radius={0.1} smoothness={2} bevelSegments={2} castShadow receiveShadow><meshStandardMaterial map={wood} bumpMap={wood} bumpScale={.025} roughness={.65} /></RoundedBox>
    <Island />
    <SoftBox position={[0.4, 0.2, 0.67]} size={[3.4, 0.035, 1.47]} color="#242623" radius={0.045} />
    <SoftBox position={[0, 0.25, -0.66]} size={[1.25, 0.1, 0.64]} color="#252725" radius={0.05} />
    <SoftBox position={[0, 0.72, -0.79]} size={[0.18, 0.93, 0.13]} color="#333631" radius={0.025} />
    <SoftBox position={[0, 1.65, -0.78]} size={[3.34, 1.98, 0.16]} color="#282c29" radius={0.06} />
    <SoftBox position={[0, 1.65, -0.685]} size={[3.17, 1.8, 0.025]} color="#090c0b" radius={0.025} />
    <mesh position={[0, 1.65, -0.666]}><planeGeometry args={[3.1, 1.74]} /><meshBasicMaterial map={screen.texture} toneMapped={false} /></mesh>
    <mesh position={[1.48, 0.72, -0.68]}><sphereGeometry args={[0.012, 8, 8]} /><meshBasicMaterial color="#d8c7a0" /></mesh>
    <Robot />
    <Keyboard />
    <group position={[1.45, 0.25, 0.78]}><mesh scale={[0.22, 0.11, 0.32]} castShadow><sphereGeometry args={[1, 20, 12]} /><meshStandardMaterial color="#252722" roughness={0.5} /></mesh><SoftBox position={[0, 0.09, -0.05]} size={[0.017, 0.03, 0.11]} color="#393b34" radius={0.006} /></group>
    <Plants />
    <Lamp />
    <Coffee />
    <group position={[-2.24, 0.25, 0.6]} rotation={[0, 0.11, 0]}>
      <mesh position={[0, .12, .386]}><planeGeometry args={[1.05, .24]} /><meshStandardMaterial map={books[1]} roughness={.8} /></mesh>
      <mesh position={[.04, .35, .322]} rotation={[0, -.15, 0]}><planeGeometry args={[.95, .2]} /><meshStandardMaterial map={books[0]} roughness={.8} /></mesh>
      <SoftBox position={[0, 0.12, 0]} size={[1.05, 0.24, 0.76]} color="#4e5346" radius={0.025} />
      <SoftBox position={[0, 0.12, 0.035]} size={[0.99, 0.17, 0.7]} color="#c9c3af" radius={0.012} />
      <SoftBox position={[0.04, 0.35, -0.02]} rotation={[0, -0.15, 0]} size={[0.95, 0.2, 0.65]} color="#bd9e78" radius={0.02} />
      <SoftBox position={[0.04, 0.35, 0.015]} rotation={[0, -0.15, 0]} size={[0.91, 0.15, 0.59]} color="#e1d5b8" radius={0.01} />
    </group>
  </group>;
}
