import { useRef, type RefObject } from 'react';
import { Group } from 'three';
import { Rod, type Point } from './primitives';
import { useRobotGaze, type GazeTarget } from './useRobotGaze';

type RobotProps = { position?: Point; rotation?: Point; scale?: number; seated?: boolean; target?: RefObject<GazeTarget> };
/** The identical shell, visor, eyes and mechanics are reused in both scenes. */
export function Robot({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, seated = false, target }: RobotProps) {
  const head = useRef<Group>(null), eyes = useRef<Group>(null);
  useRobotGaze(head, eyes, target);
  return <group position={position} rotation={rotation} scale={scale}>
    <mesh position={[0, .04, -.07]} scale={[.26, .24, .21]} castShadow><sphereGeometry args={[1, 48, 32]} /><meshPhysicalMaterial color="#cabc9e" roughness={.4} clearcoat={.15} /></mesh>
    <mesh position={[0, .075, .124]} scale={[.16, .12, .035]}><sphereGeometry args={[1, 32, 20]} /><meshStandardMaterial color="#b8a78b" metalness={.25} roughness={.55} /></mesh>
    <mesh position={[0, .09, .16]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.026, .026, .008, 24]} /><meshStandardMaterial color="#b8833e" emissive="#bd782a" emissiveIntensity={.45} metalness={.5} /></mesh>
    <group ref={head} position={[0, .38, 0]}>
      <mesh scale={[.405, .342, .304]} castShadow><sphereGeometry args={[1, 64, 48]} /><meshPhysicalMaterial color="#d9cbb6" roughness={.34} clearcoat={.3} clearcoatRoughness={.3} /></mesh>
      <mesh position={[0, -.025, .248]} scale={[.315, .219, .091]}><sphereGeometry args={[1, 64, 40]} /><meshStandardMaterial color="#6d5b43" metalness={.75} roughness={.35} /></mesh>
      <mesh position={[0, -.025, .265]} scale={[.3, .202, .086]}><sphereGeometry args={[1, 64, 40]} /><meshPhysicalMaterial color="#080c0c" roughness={.19} metalness={.15} clearcoat={.8} clearcoatRoughness={.22} /></mesh>
      <group ref={eyes} position={[0, 0, 0]}>
        {[-.115, .115].map(x => <group key={x} position={[x, -.018, .348]}>
          <mesh scale={[.037, .063, .013]}><sphereGeometry args={[1, 32, 20]} /><meshBasicMaterial color="#f5b94e" toneMapped={false} /></mesh>
          <mesh position={[-.004, .008, .009]} scale={[.018, .038, .005]}><sphereGeometry args={[1, 24, 16]} /><meshBasicMaterial color="#ffe3a1" toneMapped={false} /></mesh>
        </group>)}
      </group>
      {[-1, 1].map(side => <group key={side} position={[side * .39, -.02, -.04]} rotation={[0, 0, Math.PI / 2]}>
        <mesh castShadow><cylinderGeometry args={[.124, .124, .08, 48]} /><meshStandardMaterial color="#584b3a" metalness={.7} roughness={.4} /></mesh>
        <mesh position={[0, -side * .047, 0]}><cylinderGeometry args={[.104, .104, .025, 48]} /><meshPhysicalMaterial color="#ccb99a" metalness={.3} roughness={.35} clearcoat={.2} /></mesh>
        <mesh position={[0, -side * .062, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.074, .007, 8, 40]} /><meshStandardMaterial color="#8c7759" metalness={.65} roughness={.45} /></mesh>
      </group>)}
      <Rod from={[.26, .22, -.06]} to={[.36, .58, -.06]} radius={.011} color="#b49b74" />
      <mesh position={[.36, .58, -.06]}><sphereGeometry args={[.027, 20, 16]} /><meshStandardMaterial color="#f0c68a" emissive="#d6a04c" emissiveIntensity={.6} /></mesh>
      <mesh position={[0, .302, -.12]} rotation={[.4, 0, 0]} scale={[.13, .013, .05]}><sphereGeometry args={[1, 32, 16]} /><meshStandardMaterial color="#a99a82" roughness={.6} /></mesh>
    </group>
    {[-1, 1].map(side => <group key={side}>
      <mesh position={[side * .265, .03, .1]} scale={[.07, .095, .075]}><sphereGeometry args={[1, 32, 20]} /><meshStandardMaterial color="#7a6a53" metalness={.55} roughness={.45} /></mesh>
      <mesh position={[side * .28, -.035, .205]} rotation={[0, 0, side * -.23]} scale={[.11, .15, .14]} castShadow><sphereGeometry args={[1, 40, 28]} /><meshPhysicalMaterial color="#dac7a8" roughness={.4} clearcoat={.2} /></mesh>
      {[0, 1].map(i => <mesh key={i} position={[side * .28 + (i ? .035 : -.035), -.105, .312]} rotation={[.18, 0, 0]}><capsuleGeometry args={[.006, .048, 3, 8]} /><meshStandardMaterial color="#a28c6d" roughness={.6} /></mesh>)}
      {seated && <mesh position={[side * .155, -.17, .135]} scale={[.105, .07, .155]} castShadow><sphereGeometry args={[1, 32, 20]} /><meshStandardMaterial color="#c9b99c" roughness={.45} /></mesh>}
    </group>)}
  </group>;
}
