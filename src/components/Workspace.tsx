import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { Shape, ExtrudeGeometry } from 'three';
import type { PortfolioProject } from '../data/site';
import { SoftBox } from './primitives';
import { Plants } from './Plants';
import { Island } from './Island';
import { Robot } from './Robot';
import { Keyboard } from './Keyboard';
import { Coffee, Lamp, Mouse, Pencils } from './DeskObjects';
import { WorkspaceBooks } from './Books';
import { makeScreenTexture } from './sceneTextures';
import { useSurface } from './sceneMaterials';

function DeskSlab() {
  const surface = useSurface('wood');
  const geometry = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-3.2, -1.58);
    shape.bezierCurveTo(-1.9, -1.66, -.8, -1.54, .3, -1.6);
    shape.bezierCurveTo(1.4, -1.65, 2.3, -1.53, 3.18, -1.56);
    shape.quadraticCurveTo(3.32, -1.55, 3.28, -1.34);
    shape.bezierCurveTo(3.23, -.5, 3.35, .5, 3.25, 1.42);
    shape.quadraticCurveTo(3.24, 1.57, 3.08, 1.57);
    shape.bezierCurveTo(1.6, 1.52, -.1, 1.64, -1.4, 1.56);
    shape.lineTo(-3.15, 1.59); shape.quadraticCurveTo(-3.31, 1.55, -3.27, 1.35);
    shape.bezierCurveTo(-3.32, .4, -3.21, -.4, -3.29, -1.4); shape.quadraticCurveTo(-3.29, -1.56, -3.2, -1.58);
    return new ExtrudeGeometry(shape, { depth: .2, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: .055, bevelThickness: .045, curveSegments: 20 });
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -.055, 0]} castShadow receiveShadow><meshStandardMaterial {...surface} roughness={.75} color="#d5bd94" /></mesh>;
}
export function Workspace({ project }: { project: PortfolioProject | null }) {
  const invalidate = useThree(state => state.invalidate);
  const screen = useMemo(() => makeScreenTexture(project, invalidate), [project, invalidate]);
  useEffect(() => () => screen.dispose(), [screen]);
  return <group position={[0, -.3, 0]} rotation={[0, -.055, 0]}>
    <DeskSlab />
    <Island />
    <SoftBox position={[.4, .205, .69]} size={[3.45, .032, 1.47]} color="#1f2521" radius={.035} roughness={.94} />
    <SoftBox position={[0, .23, -.66]} size={[1.2, .075, .64]} color="#262b29" radius={.045} roughness={.38} />
    <SoftBox position={[0, .7, -.79]} size={[.15, .92, .12]} color="#252b29" radius={.025} roughness={.4} />
    <SoftBox position={[0, 1.65, -.78]} size={[3.39, 2.02, .16]} color="#70654f" radius={.045} roughness={.42} />
    <SoftBox position={[0, 1.65, -.688]} size={[3.33, 1.96, .045]} color="#111716" radius={.025} roughness={.45} />
    <mesh position={[0, 1.65, -.661]}><planeGeometry args={[3.16, 1.79]} /><meshBasicMaterial map={screen.texture} toneMapped={false} /></mesh>
    <mesh position={[1.52, .705, -.658]}><sphereGeometry args={[.009, 12, 10]} /><meshBasicMaterial color="#d1b985" /></mesh>
    <Robot position={[.46, 2.71, -.76]} rotation={[0, .3, -.025]} />
    <Keyboard /><Mouse /><Plants /><Lamp /><Coffee /><Pencils /><WorkspaceBooks />
  </group>;
}
