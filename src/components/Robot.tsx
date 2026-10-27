import { Rod } from './primitives';

/** One mascot, shared by every camera position and the exported poster. */
export function Robot() {
  return <group position={[.48, 2.69, -.76]} rotation={[0, .08, -.05]}>
    <mesh position={[0, .04, -.04]} scale={[.27, .22, .2]} castShadow><sphereGeometry args={[1, 40, 24]} /><meshStandardMaterial color="#c8b99e" roughness={.36} /></mesh>
    <mesh position={[0, .37, 0]} scale={[.4, .34, .3]} castShadow><sphereGeometry args={[1, 64, 40]} /><meshPhysicalMaterial color="#e2d2b8" roughness={.32} clearcoat={.3} clearcoatRoughness={.28} /></mesh>
    <mesh position={[0, .34, .244]} scale={[.305, .205, .105]}><sphereGeometry args={[1, 48, 32]} /><meshPhysicalMaterial color="#161811" roughness={.2} clearcoat={.7} metalness={.25} /></mesh>
    {[-.115, .115].map(x => <mesh key={x} position={[x, .35, .343]} scale={[.032, .059, .015]}><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color="#ffe3a0" emissive="#ffc764" emissiveIntensity={3} toneMapped={false} /></mesh>)}
    {[-1, 1].map(side => <group key={side}>
      <mesh position={[side * .39, .34, -.025]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[.123, .123, .07, 32]} /><meshStandardMaterial color="#8c7b62" metalness={.55} roughness={.4} /></mesh>
      <mesh position={[side * .425, .34, -.025]} scale={[.035, .105, .105]}><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color="#d9c5a4" roughness={.4} /></mesh>
      <mesh position={[side * .28, -.025, .21]} rotation={[0, 0, side * -.24]} scale={[.11, .15, .145]} castShadow><sphereGeometry args={[1, 32, 20]} /><meshPhysicalMaterial color="#dfcdb0" roughness={.4} clearcoat={.2} /></mesh>
    </group>)}
    <Rod from={[.27, .58, -.05]} to={[.38, .94, -.05]} radius={.012} color="#bda07a" />
    <mesh position={[.38, .94, -.05]}><sphereGeometry args={[.027, 16, 12]} /><meshStandardMaterial color="#edbf7f" emissive="#ab6c2e" emissiveIntensity={.5} /></mesh>
  </group>;
}
