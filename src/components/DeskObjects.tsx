import { useEffect, useMemo } from 'react';
import { CanvasTexture, DoubleSide, SRGBColorSpace, Vector2 } from 'three';
import { Rod, SoftBox } from './primitives';

export function Lamp() {
  const shade = useMemo(() => [new Vector2(.04, .23), new Vector2(.065, .19), new Vector2(.09, .16), new Vector2(.14, .11), new Vector2(.21, .015), new Vector2(.295, -.12), new Vector2(.31, -.15), new Vector2(.31, -.17), new Vector2(.295, -.17)], []);
  return <group position={[2.35, .23, -.7]}>
    <mesh position={[0, .04, 0]} castShadow receiveShadow><cylinderGeometry args={[.34, .38, .08, 64]} /><meshStandardMaterial color="#262722" metalness={.5} roughness={.45} /></mesh>
    <mesh position={[0, .085, 0]}><cylinderGeometry args={[.2, .24, .02, 48]} /><meshStandardMaterial color="#454236" metalness={.7} roughness={.4} /></mesh>
    <Rod from={[.1, .08, 0]} to={[.18, 1.35, 0]} radius={.025} color="#796441" />
    <Rod from={[.18, 1.35, 0]} to={[-.48, 1.85, 0]} radius={.024} color="#796441" />
    <Rod from={[.12, .14, .05]} to={[.2, 1.33, .05]} radius={.01} color="#38362d" />
    {[[.18, 1.35, 0], [-.48, 1.85, 0]].map((pos, i) => <group key={i} position={pos as [number, number, number]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.06, .06, .095, 32]} /><meshStandardMaterial color="#252722" metalness={.65} roughness={.4} /></mesh>
      <mesh position={[0, 0, .051]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.02, .02, .008, 16]} /><meshStandardMaterial color="#a68d5e" metalness={.7} roughness={.4} /></mesh>
    </group>)}
    <group position={[-.5, 1.67, .025]} rotation={[-.58, 0, -.13]}>
      <mesh castShadow><latheGeometry args={[shade, 64]} /><meshStandardMaterial color="#242622" roughness={.34} metalness={.6} side={DoubleSide} /></mesh>
      <mesh position={[0, -.165, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.303, .012, 8, 64]} /><meshStandardMaterial color="#aa8b54" metalness={.65} roughness={.35} /></mesh>
      <mesh position={[0, -.155, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[.29, 48]} /><meshStandardMaterial color="#ffe0a0" emissive="#ffc574" emissiveIntensity={1.4} side={DoubleSide} /></mesh>
      <pointLight position={[0, -.26, 0]} color="#ffbd68" intensity={5} distance={3.7} decay={2} />
    </group>
  </group>;
}
export function Coffee() {
  const profile = useMemo(() => [new Vector2(.18, .025), new Vector2(.21, .04), new Vector2(.235, .12), new Vector2(.245, .38), new Vector2(.24, .425), new Vector2(.228, .43), new Vector2(.216, .415), new Vector2(.216, .11), new Vector2(.18, .075)], []);
  const label = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d')!; ctx.fillStyle = '#222920'; ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#e7d3a4'; ctx.textAlign = 'center'; ctx.font = '27px Georgia'; ['Good', 'Code.', 'Better', 'Days.'].forEach((line, i) => ctx.fillText(line, 128, 60 + i * 42));
    const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace; return texture;
  }, []);
  useEffect(() => () => label.dispose(), [label]);
  return <group position={[2.12, .21, .94]} rotation={[0, -.1, 0]}>
    <mesh position={[0, .018, 0]} castShadow receiveShadow><cylinderGeometry args={[.34, .35, .036, 64]} /><meshStandardMaterial color="#665134" roughness={.75} /></mesh>
    <mesh castShadow receiveShadow><latheGeometry args={[profile, 64]} /><meshPhysicalMaterial color="#222920" roughness={.3} clearcoat={.4} clearcoatRoughness={.25} side={DoubleSide} /></mesh>
    <mesh position={[0, .405, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[.216, 64]} /><meshPhysicalMaterial color="#170e07" roughness={.16} clearcoat={1} /></mesh>
    <mesh position={[0, .43, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.232, .009, 8, 64]} /><meshStandardMaterial color="#8b7955" metalness={.35} roughness={.4} /></mesh>
    <mesh position={[.264, .25, 0]} scale={[1, 1.2, 1]}><torusGeometry args={[.115, .035, 16, 40]} /><meshPhysicalMaterial color="#222920" roughness={.3} clearcoat={.4} /></mesh>
    <mesh position={[0, .25, 0]}><cylinderGeometry args={[.243, .243, .27, 36, 1, true, -.5, 1]} /><meshStandardMaterial map={label} roughness={.4} transparent /></mesh>
  </group>;
}
export function Pencils() {
  return <group position={[1.72, .22, -.75]}>
    <mesh position={[0, .22, 0]} castShadow><cylinderGeometry args={[.135, .115, .44, 40, 1, true]} /><meshStandardMaterial color="#615039" roughness={.7} side={DoubleSide} /></mesh>
    <mesh position={[0, .43, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.13, .008, 8, 32]} /><meshStandardMaterial color="#ac9466" metalness={.5} roughness={.4} /></mesh>
    {[0,1,2,3,4].map(i => <group key={i} position={[(i % 3 - 1) * .05, .2, Math.floor(i / 3) * .055 - .035]} rotation={[i * .035 - .06, 0, (i - 2) * .08]}>
      <mesh position={[0, .3, 0]} castShadow><cylinderGeometry args={[.014, .014, .61, 6]} /><meshStandardMaterial color={i % 2 ? '#ccac61' : '#7b5731'} roughness={.65} /></mesh>
      <mesh position={[0, .638, 0]}><coneGeometry args={[.014, .065, 6]} /><meshStandardMaterial color="#c5aa76" roughness={.75} /></mesh>
      <mesh position={[0, .674, 0]}><coneGeometry args={[.005, .022, 6]} /><meshStandardMaterial color="#292a25" roughness={.7} /></mesh>
    </group>)}
  </group>;
}
export function Mouse() {
  return <group position={[1.38, .27, .83]} rotation={[0, -.17, 0]}>
    <mesh scale={[.19, .105, .29]} castShadow><sphereGeometry args={[1, 40, 28]} /><meshPhysicalMaterial color="#232722" roughness={.4} clearcoat={.2} /></mesh>
    <SoftBox position={[0, .1, -.05]} size={[.021, .024, .09]} radius={.009} color="#7f806c" />
    <Rod from={[0, .088, -.12]} to={[0, .095, .02]} radius={.0025} color="#11130f" />
  </group>;
}
