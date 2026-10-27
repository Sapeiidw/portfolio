import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { Quaternion, Vector3 } from 'three';
export type Point = [number, number, number];
export function SoftBox({ position = [0, 0, 0], size, color, radius = 0.06, rotation = [0, 0, 0], roughness = .55 }: { position?: Point; size: Point; color: string; radius?: number; rotation?: Point; roughness?: number }) {
  return <RoundedBox args={size} radius={radius} smoothness={3} bevelSegments={3} position={position} rotation={rotation} castShadow receiveShadow><meshStandardMaterial color={color} roughness={roughness} /></RoundedBox>;
}
export function Rod({ from, to, radius = .025, color = '#79644a' }: { from: Point; to: Point; radius?: number; color?: string }) {
  const { mid, length, rotation } = useMemo(() => {
    const start = new Vector3(...from), end = new Vector3(...to);
    return { mid: start.clone().add(end).multiplyScalar(.5), length: start.distanceTo(end), rotation: new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), end.sub(start).normalize()) };
  }, [from.join(), to.join()]);
  return <mesh position={mid} quaternion={rotation} castShadow><cylinderGeometry args={[radius, radius, length, 12]} /><meshStandardMaterial color={color} metalness={.65} roughness={.38} /></mesh>;
}
