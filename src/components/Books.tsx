import { useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';
import { SoftBox, type Point } from './primitives';
import { makeBookTexture, seededRandom } from './sceneTextures';

function makePages() {
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 128;
  const ctx = canvas.getContext('2d')!, random = seededRandom(39);
  ctx.fillStyle = '#c9bda3'; ctx.fillRect(0, 0, 512, 128);
  for (let y = 0; y < 128; y += 2) { ctx.fillStyle = `rgba(64,49,26,${.1 + random() * .3})`; ctx.fillRect(0, y, 512, .5 + random()); }
  const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace; texture.anisotropy = 8; return texture;
}
export function Book({ title, color, width = 1.3, height = .22, depth = .85, position = [0, 0, 0], rotation = [0, 0, 0] }: { title: string; color: string; width?: number; height?: number; depth?: number; position?: Point; rotation?: Point }) {
  const spine = useMemo(() => makeBookTexture(title, color), [title, color]);
  const pages = useMemo(makePages, []);
  useEffect(() => () => { spine.dispose(); pages.dispose(); }, [spine, pages]);
  return <group position={position} rotation={rotation}>
    <SoftBox position={[0, height / 2 - .012, 0]} size={[width, .028, depth]} radius={.012} color={color} />
    <SoftBox position={[0, -height / 2 + .012, 0]} size={[width, .028, depth]} radius={.012} color={color} />
    <mesh castShadow receiveShadow><boxGeometry args={[width - .038, height - .052, depth - .045]} /><meshStandardMaterial map={pages} roughness={.93} /></mesh>
    <SoftBox position={[0, 0, depth / 2 - .012]} size={[width, height - .01, .035]} radius={.015} color={color} />
    <mesh position={[0, 0, depth / 2 + .007]}><planeGeometry args={[width - .025, height - .035]} /><meshStandardMaterial map={spine} roughness={.72} /></mesh>
  </group>;
}
export function WorkspaceBooks() {
  return <group position={[-2.18, .29, .6]} rotation={[0, .07, 0]}>
    <Book title="Better Products" color="#272820" position={[0, .1, 0]} />
    <Book title="Clean Code" color="#34312a" width={1.26} height={.21} position={[.035, .315, -.015]} rotation={[0, -.065, 0]} />
    <Book title="Human by Design" color="#63543c" width={1.17} height={.18} depth={.8} position={[.03, .515, -.03]} rotation={[0, .035, 0]} />
  </group>;
}
