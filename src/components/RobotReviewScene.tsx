import { useLayoutEffect, useRef, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { Group, PCFShadowMap, PerspectiveCamera, Vector3 } from 'three';
import { SceneFraming } from './sceneFraming';
import { Robot } from './Robot';
import { Book } from './Books';
import { Plants } from './Plants';
import { StudioLighting } from './StudioLighting';
import { useSurface } from './sceneMaterials';
import type { GazeTarget } from './useRobotGaze';

declare global { interface Window { __captureReview?: () => string } }
function ReviewReady({ model, onReady }: { model: RefObject<Group | null>; onReady: () => void }) {
  const { gl, camera, scene, size, invalidate } = useThree(); const ready = useRef(false);
  const framing = useRef(new SceneFraming()), direction = useRef(new Vector3(2.1, 1.4, 5.7));
  useLayoutEffect(() => {
    if (model.current) framing.current.measure(model.current);
    framing.current.fit(camera as PerspectiveCamera, size.width, size.height, direction.current, { left: .035, top: .035, width: .93, height: .93 });
    invalidate();
    if (import.meta.env.DEV) window.__captureReview = () => { window.dispatchEvent(new Event('robot-capture')); gl.render(scene, camera); return gl.domElement.toDataURL('image/webp', .86); };
    return () => { delete window.__captureReview; };
  }, [gl, scene, camera, size.width, size.height, invalidate, model]);
  useFrame(() => { if (!ready.current) { ready.current = true; onReady(); } });
  return null;
}
function BookPerch({ target }: { target: RefObject<GazeTarget> }) {
  const wood = useSurface('wood');
  return <group position={[.12, -.35, 0]}>
    <RoundedBox args={[3.8, .17, 2.35]} radius={.08} smoothness={3} position={[0, -.08, 0]} castShadow receiveShadow><meshStandardMaterial {...wood} roughness={.8} color="#d5bd94" /></RoundedBox>
    <Book title="Repeat" width={1.88} height={.23} depth={1.12} color="#2c2c22" position={[0, .13, .12]} rotation={[0, .03, 0]} />
    <Book title="Improve" width={1.8} height={.22} depth={1.08} color="#4b422e" position={[.03, .355, .08]} rotation={[0, -.035, 0]} />
    <Book title="Learn" width={1.86} height={.22} depth={1.08} color="#252a25" position={[-.015, .575, .06]} rotation={[0, .02, 0]} />
    <Book title="Build" width={1.76} height={.21} depth={1.06} color="#584a34" position={[.015, .79, .025]} rotation={[0, -.035, 0]} />
    <Robot position={[.05, 1.075, -.03]} rotation={[0, .85, -.035]} scale={1.2} seated target={target} />
    <group position={[.65, -.1, -.55]} scale={.7}><Plants variant="review" /></group>
  </group>;
}
export default function RobotReviewScene({ target, onReady }: { target: RefObject<GazeTarget>; onReady: () => void }) {
  const model = useRef<Group>(null);
  return <div className="review-canvas" aria-hidden="true"><Canvas frameloop="demand" dpr={[1, 1.5]} shadows={{ type: PCFShadowMap }} camera={{ position: [2.1, 2.3, 5.7], fov: 35, near: .1, far: 30 }} gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }} onCreated={({ gl }) => { gl.setClearColor('#191917', 0); gl.toneMappingExposure = .95; }}>
    <StudioLighting /><group ref={model}><BookPerch target={target} /></group><ReviewReady model={model} onReady={onReady} />
  </Canvas></div>;
}
