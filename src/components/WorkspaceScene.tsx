import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { PCFShadowMap, Vector3 } from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Workspace } from './Workspace';
import type { PortfolioProject } from '../data/site';

gsap.registerPlugin(ScrollTrigger);

declare global { interface Window { __captureWorkspace?: () => string } }
function CameraRig({ onReady, onWork }: { onReady: () => void; onWork: (value: boolean) => void }) {
  const { camera, invalidate, gl, scene } = useThree();
  const progress = useRef(0), pointer = useRef({ x: 0, y: 0 });
  const targetPosition = useRef(new Vector3()), targetLookAt = useRef(new Vector3());
  const lookAt = useRef(new Vector3(0, .7, 0));
  const ready = useRef(false), active = useRef(true);
  useEffect(() => {
    const trigger = ScrollTrigger.create({ trigger: '#intro', start: 'top top', end: 'bottom bottom',
      onUpdate: self => { progress.current = self.progress; onWork(self.progress > .35); if (active.current) invalidate(); },
    });
    progress.current = trigger.progress; onWork(trigger.progress > .35);
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !active.current) return;
      pointer.current = { x: (event.clientX / window.innerWidth - .5) * 2, y: (event.clientY / window.innerHeight - .5) * 2 }; invalidate();
    };
    window.addEventListener('pointermove', move, { passive: true });
    const observer = new IntersectionObserver(([entry]) => { active.current = entry.isIntersecting; if (entry.isIntersecting) invalidate(); });
    const intro = document.getElementById('intro'); if (intro) observer.observe(intro);
    if (import.meta.env.DEV) window.__captureWorkspace = () => {
      gl.render(scene, camera); return gl.domElement.toDataURL('image/webp', .86);
    };
    return () => { trigger.kill(); observer.disconnect(); window.removeEventListener('pointermove', move); delete window.__captureWorkspace; };
  }, [invalidate, gl, scene, camera, onWork]);
  useFrame((_, delta) => {
    const p = Math.min(progress.current * 1.12, 1), ease = p * p * (3 - 2 * p);
    targetPosition.current.set(4.6 - ease * 2.3 + pointer.current.x * .12, 3.5 - ease * .15 - pointer.current.y * .07, 11.8 - ease * 5.5);
    const blend = 1 - Math.exp(-Math.min(delta, .05) * 8);
    camera.position.lerp(targetPosition.current, blend);
    targetLookAt.current.set(-.1, .7 + ease * .6, -.1 - ease * .35);
    lookAt.current.lerp(targetLookAt.current, blend); camera.lookAt(lookAt.current); camera.updateMatrixWorld();
    if (!ready.current) { ready.current = true; onReady(); }
    if (active.current && (camera.position.distanceToSquared(targetPosition.current) > .000002 || lookAt.current.distanceToSquared(targetLookAt.current) > .000002)) invalidate();
  });
  return null;
}
export default function WorkspaceScene({ onReady, project }: { onReady: () => void; project: PortfolioProject }) {
  const [work, setWork] = useState(false);
  return <div className="live-scene" aria-hidden="true">
    <Canvas frameloop="demand" dpr={[1, 1.5]} shadows={{ type: PCFShadowMap }}
      camera={{ position: [4.6, 3.5, 11.8], fov: 35, near: .1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }} onCreated={({ gl }) => { gl.setClearColor('#191917', 0); }} fallback={null}>
      <ambientLight intensity={.38} color="#e3d9ca" />
      <hemisphereLight args={['#c7d2d7', '#55442e', .7]} />
      <directionalLight position={[-3, 7, 5]} intensity={3.4} color="#ffe2bc" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5} shadow-bias={-.0003} shadow-normalBias={.025} />
      <directionalLight position={[3, 4, -3]} intensity={2.2} color="#c2cbd0" />
      <pointLight position={[1.8, 1.5, -.6]} intensity={12} color="#ffba63" distance={5} decay={2} />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2} color="#fff0d8" position={[-3, 5, 3]} scale={[5, 5]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1} color="#b5c6d4" position={[4, 2, -3]} scale={[3, 5]} target={[0, 1, 0]} />
      </Environment>
      <Workspace project={work ? project : null} />
      <CameraRig onReady={onReady} onWork={setWork} />
    </Canvas>
  </div>;
}
