import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box3, Group, PCFShadowMap, PerspectiveCamera, Vector3 } from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { StudioLighting } from './StudioLighting';
import { Workspace } from './Workspace';
import { WorkspaceDepth } from './WorkspaceDepth';
import { SceneFraming } from './sceneFraming';
import type { PortfolioProject } from '../data/site';

gsap.registerPlugin(ScrollTrigger);
declare global { interface Window { __captureWorkspace?: () => string } }
function CameraRig({ model, onReady, onWork }: { model: RefObject<Group | null>; onReady: () => void; onWork: (value: boolean) => void }) {
  const { camera, invalidate, gl, scene, size } = useThree();
  const framing = useRef(new SceneFraming()), direction = useRef(new Vector3());
  const progress = useRef(0), pointer = useRef({ x: 0, y: 0 });
  const motion = useRef({ p: 0, x: 0, y: 0 });
  const ready = useRef(false), active = useRef(true);
  useLayoutEffect(() => {
    // Frame the monitor and mascot; the desk stays large in the foreground.
    if (size.width >= 768) framing.current.setBox(new Box3(new Vector3(-1.9, .25, -1.25), new Vector3(1.9, 3.55, -.25)));
    else if (model.current) framing.current.measure(model.current);
  }, [model, size.width, size.height]);
  useEffect(() => {
    const trigger = ScrollTrigger.create({ trigger: '#intro', start: 'top top', end: 'bottom bottom', onUpdate: self => {
      progress.current = self.progress; onWork(self.progress > .35); if (active.current) invalidate();
    } });
    progress.current = trigger.progress; onWork(trigger.progress > .35);
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !active.current) return;
      pointer.current = { x: (event.clientX / innerWidth - .5) * 2, y: (event.clientY / innerHeight - .5) * 2 }; invalidate();
    };
    const leave = () => { pointer.current = { x: 0, y: 0 }; if (active.current) invalidate(); };
    window.addEventListener('pointermove', move, { passive: true }); document.documentElement.addEventListener('pointerleave', leave);
    const observer = new IntersectionObserver(([entry]) => { active.current = entry.isIntersecting; if (entry.isIntersecting) invalidate(); });
    const intro = document.getElementById('intro'); if (intro) observer.observe(intro);
    if (import.meta.env.DEV) window.__captureWorkspace = () => { window.dispatchEvent(new Event('robot-capture')); gl.render(scene, camera); window.dispatchEvent(new Event('workspace-render')); return gl.domElement.toDataURL('image/webp', .86); };
    return () => { trigger.kill(); observer.disconnect(); window.removeEventListener('pointermove', move); document.documentElement.removeEventListener('pointerleave', leave); delete window.__captureWorkspace; };
  }, [invalidate, gl, scene, camera, onWork]);
  useFrame((_, delta) => {
    const blend = ready.current ? 1 - Math.exp(-Math.min(delta, .05) * 8) : 1;
    const pose = motion.current;
    pose.p += (progress.current - pose.p) * blend; pose.x += (pointer.current.x - pose.x) * blend; pose.y += (pointer.current.y - pose.y) * blend;
    const p = Math.min(pose.p * 1.12, 1), ease = p * p * (3 - 2 * p);
    direction.current.set(4.6 - ease * 2.1 + pose.x * .14, 3.1 - ease * .6 - pose.y * .08, 11.8 - ease * 1.5);
    const mobile = size.width < 768, content = Math.min(size.width, 1536), start = (size.width - content) / 2;
    const frameWidth = .39 + ease * .13;
    const left = mobile ? .035 : (start + content * (.69 - frameWidth / 2)) / size.width;
    const width = mobile ? .93 : content * frameWidth / size.width;
    framing.current.fit(camera as PerspectiveCamera, size.width, size.height, direction.current, { left, top: mobile ? .04 : .08, width, height: mobile ? .91 : .7 });
    if (import.meta.env.DEV) gl.domElement.dataset.framing = JSON.stringify({ size: [size.width, size.height], distance: camera.position.distanceTo(framing.current.center), center: framing.current.center.toArray(), p: pose.p });
    if (!ready.current) { ready.current = true; onReady(); }
    if (active.current && Math.abs(progress.current - pose.p) + Math.abs(pointer.current.x - pose.x) + Math.abs(pointer.current.y - pose.y) > .001) invalidate();
  });
  return null;
}
export default function WorkspaceScene({ onReady, project }: { onReady: () => void; project: PortfolioProject }) {
  const [work, setWork] = useState(false); const model = useRef<Group>(null);
  return <div className="live-scene" aria-hidden="true"><Canvas frameloop="demand" dpr={[1, 1.5]} shadows={{ type: PCFShadowMap }} camera={{ position: [4.6, 3.5, 11.8], fov: 35, near: .1, far: 80 }} gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }} onCreated={({ gl }) => { gl.setClearColor('#191917', 0); gl.toneMappingExposure = .95; }} fallback={null}>
    <StudioLighting /><group ref={model}><Workspace project={work ? project : null} /></group><CameraRig model={model} onReady={onReady} onWork={setWork} /><WorkspaceDepth />
  </Canvas></div>;
}
