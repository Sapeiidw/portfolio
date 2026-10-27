import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { CanvasTexture, Color, InstancedMesh, Object3D, SRGBColorSpace } from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { SoftBox } from './primitives';

type Key = { x: number; z: number; width: number; label: string; accent: boolean; modifier: boolean };
function layout(): Key[] {
  const rows: [string, number][][] = [
    [['Esc',1],['1',1],['2',1],['3',1],['4',1],['5',1],['6',1],['7',1],['8',1],['9',1],['0',1],['-',1],['=',1],['⌫',2]],
    [['Tab',1.5],['Q',1],['W',1],['E',1],['R',1],['T',1],['Y',1],['U',1],['I',1],['O',1],['P',1],['[',1],[']',1],['\\',1.5]],
    [['Caps',1.75],['A',1],['S',1],['D',1],['F',1],['G',1],['H',1],['J',1],['K',1],['L',1],[';',1],["'",1],['Enter',2.25]],
    [['Shift',2.25],['Z',1],['X',1],['C',1],['V',1],['B',1],['N',1],['M',1],[',',1],['.',1],['/',1],['Shift',2.75]],
    [['Ctrl',1.25],['Fn',1.25],['Alt',1.25],['',6.25],['Alt',1.25],['←',1.25],['↓',1.25],['→',1.25]],
  ];
  return rows.flatMap((row, r) => {
    let cursor = -1.005;
    return row.map(([label, units]) => { const width = units * .134 - .016, x = cursor + units * .134 / 2; cursor += units * .134;
      return { x, z: (r - 2) * .14, width, label, accent: label === 'Esc' || label === 'Enter', modifier: units > 1.1 };
    });
  });
}
export function Keyboard() {
  const keys = useRef<InstancedMesh>(null);
  const keyLayout = useMemo(layout, []);
  const geometry = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 3, .075), []);
  const legends = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = 1536; canvas.height = 576;
    const ctx = canvas.getContext('2d')!; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    keyLayout.forEach(key => {
      ctx.font = `${key.modifier ? 15 : 20}px sans-serif`; ctx.fillStyle = key.accent ? '#fff0c7' : '#5e584b';
      ctx.fillText(key.label, (key.x / 2.16 + .5) * 1536, (key.z / .82 + .5) * 576 - 3);
    });
    const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace; texture.anisotropy = 8; return texture;
  }, [keyLayout]);
  useLayoutEffect(() => {
    const object = new Object3D();
    keyLayout.forEach((key, i) => {
      object.position.set(key.x, .112, key.z); object.scale.set(key.width, .095, .121); object.updateMatrix();
      keys.current!.setMatrixAt(i, object.matrix);
      keys.current!.setColorAt(i, new Color(key.accent ? '#b9652d' : key.modifier ? '#c2b59a' : '#e0d4bb'));
    }); keys.current!.instanceMatrix.needsUpdate = true;
  }, [keyLayout]);
  useEffect(() => () => { geometry.dispose(); legends.dispose(); }, [geometry, legends]);
  return <group position={[.06, .255, .82]} rotation={[.02, -.025, 0]}>
    <SoftBox size={[2.17, .145, .86]} color="#242725" radius={.045} roughness={.4} />
    <SoftBox position={[0, .065, 0]} size={[2.08, .025, .78]} color="#4a463b" radius={.025} />
    <instancedMesh ref={keys} args={[geometry, undefined, keyLayout.length]} castShadow receiveShadow><meshStandardMaterial roughness={.5} /></instancedMesh>
    <mesh position={[0, .162, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2.16, .82]} /><meshStandardMaterial map={legends} transparent alphaTest={.1} roughness={.6} depthWrite={false} polygonOffset polygonOffsetFactor={-1} /></mesh>
    {[-.98, .98].map(x => <mesh key={x} position={[x, -.005, .431]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.009, .009, .004, 12]} /><meshStandardMaterial color="#a69878" metalness={.7} roughness={.35} /></mesh>)}
  </group>;
}
