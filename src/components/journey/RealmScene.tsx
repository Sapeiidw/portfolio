import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type RefObject,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import {
  ACESFilmicToneMapping,
  BackSide,
  DirectionalLight,
  Group,
  Object3D,
  PCFShadowMap,
  PerspectiveCamera,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderTarget,
  HalfFloatType,
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { chapters } from "../../data/journey";
import type { GazeTarget } from "../useRobotGaze";
import { seededRandom } from "../sceneTextures";
import { Terrain, Mountains } from "./Terrain";
import { RealmObjects } from "./RealmObjects";
import { sampleJourney } from "./cameraPath";
import type { JourneyMotion } from "./motion";

type Props = {
  motion: RefObject<JourneyMotion>;
  gaze: RefObject<GazeTarget>;
  onReady: () => void;
};
type Animated = Object3D & { material?: ShaderMaterial };
function Atmosphere() {
  const stars = useMemo(() => {
    const r = seededRandom(417),
      data = new Float32Array(1200 * 3);
    for (let i = 0; i < 1200; i++) {
      const a = r() * Math.PI * 2,
        b = Math.acos(2 * r() - 1);
      data.set(
        [
          Math.sin(b) * Math.cos(a) * 150,
          Math.abs(Math.cos(b)) * 150,
          Math.sin(b) * Math.sin(a) * 150,
        ],
        i * 3,
      );
    }
    return data;
  }, []);
  return (
    <group name="sky">
      <mesh>
        <sphereGeometry args={[180, 48, 32]} />
        <shaderMaterial
          side={BackSide}
          depthWrite={false}
          vertexShader="varying vec3 vDirection;void main(){vDirection=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}"
          fragmentShader={`varying vec3 vDirection;float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.54);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}void main(){vec3 d=normalize(vDirection);vec3 c=mix(vec3(.025,.065,.076),vec3(.004,.014,.026),smoothstep(-.1,.65,d.y));float cloud=n(d.xz*5.+d.y*3.)*.5+n(d.xz*12.)*.2;c+=vec3(.035,.055,.05)*pow(cloud,2.)*smoothstep(.8,0.,d.y);float moon=length(d-normalize(vec3(.38,.4,-1.)));c+=vec3(.38,.34,.23)*exp(-moon*10.);float disc=1.-smoothstep(.048,.052,moon);c=mix(c,vec3(.77,.77,.62)*( .8+n(d.xy*300.)*.2),disc);gl_FragColor=vec4(c,1.);}`}
        />
      </mesh>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.11}
          color="#c6d5ca"
          transparent
          opacity={0.55}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}
function Fireflies() {
  const data = useMemo(() => {
    const random = seededRandom(87),
      a = new Float32Array(180 * 3);
    for (let i = 0; i < 180; i++)
      a.set(
        [(random() - 0.5) * 22, random() * 11 - 1, (random() - 0.5) * 18],
        i * 3,
      );
    return a;
  }, []);
  return (
    <points userData={{ spin: 0.012, bob: 0.25 }}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#f6d9a0"
        size={0.035}
        transparent
        opacity={0.8}
        toneMapped={false}
        depthWrite={false}
      />
    </points>
  );
}
function Cinema({
  focus,
  onReady,
}: {
  focus: RefObject<Vector3>;
  onReady: () => void;
}) {
  const { gl, scene, camera, size } = useThree(),
    effect = useRef<{
      composer: EffectComposer;
      bokeh: BokehPass | null;
    } | null>(null),
    ready = useRef(false);
  const direction = useMemo(() => new Vector3(), []),
    difference = useMemo(() => new Vector3(), []);
  useEffect(() => {
    const renderTarget = new WebGLRenderTarget(size.width, size.height, {
      samples: size.width >= 768 ? 4 : 0,
      type: HalfFloatType,
    });
    const composer = new EffectComposer(gl, renderTarget),
      render = new RenderPass(scene, camera),
      output = new OutputPass();
    composer.addPass(render);
    const bokeh =
      size.width >= 768
        ? new BokehPass(scene, camera, {
            focus: 16,
            aperture: 0.00075,
            maxblur: 0.007,
          })
        : null;
    if (bokeh) composer.addPass(bokeh);
    const bloom = new UnrealBloomPass(
      new Vector2(size.width, size.height),
      0.3,
      0.65,
      1.1,
    );
    composer.addPass(bloom);
    composer.addPass(output);
    composer.setSize(size.width, size.height);
    effect.current = { composer, bokeh };
    const capture = () => {
      composer.render();
      return gl.domElement.toDataURL("image/webp", 0.86);
    };
    if (import.meta.env.DEV)
      (window as unknown as Record<string, unknown>).__captureRealm = capture;
    return () => {
      effect.current = null;
      render.dispose();
      bokeh?.dispose();
      bloom.dispose();
      output.dispose();
      composer.dispose();
      if (import.meta.env.DEV)
        delete (window as unknown as Record<string, unknown>).__captureRealm;
    };
  }, [gl, scene, camera, size.width, size.height]);
  useFrame(() => {
    if (effect.current) {
      camera.getWorldDirection(direction);
      difference.copy(focus.current).sub(camera.position);
      if (effect.current.bokeh)
        effect.current.bokeh.materialBokeh.uniforms.focus.value = Math.max(
          0.1,
          difference.dot(direction),
        );
      effect.current.composer.render();
    } else gl.render(scene, camera);
    if (!ready.current) {
      ready.current = true;
      onReady();
    }
  }, 1);
  return null;
}
function World({ motion, gaze, onReady }: Props) {
  const { camera, size, scene, gl, invalidate, setFrameloop } = useThree();
  useEffect(() => {
    const wake = () => invalidate(),
      visibility = () =>
        setFrameloop(
          document.hidden
            ? "never"
            : motion.current.running && !motion.current.reduced
              ? "always"
              : "demand",
        );
    window.addEventListener("scroll", wake, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener("scroll", wake);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [invalidate, setFrameloop, motion]);
  const islands = useRef<Group>(null),
    sun = useRef<DirectionalLight>(null),
    rim = useRef<DirectionalLight>(null);
  const sunOffset = useMemo(() => new Vector3(-9, 14, 10), []),
    rimOffset = useMemo(() => new Vector3(8, 8, -9), []);
  const lightTarget = useMemo(() => new Object3D(), []),
    focus = useRef(new Vector3(0, 2.1, 0));
  const position = useMemo(() => new Vector3(), []),
    target = useMemo(() => new Vector3(), []),
    pointer = useRef({ x: 0, y: 0 }),
    progress = useRef(motion.current.progress),
    time = useRef(0);
  const animations = useRef<
    { object: Animated; y: number; rotation: [number, number, number] }[]
  >([]);
  useLayoutEffect(() => {
    const list: typeof animations.current = [];
    islands.current?.traverse((object) => {
      const o = object as Animated;
      if (o.userData.spin || o.userData.bob || o.material?.userData.realmTime)
        list.push({
          object: o,
          y: o.position.y,
          rotation: [o.rotation.x, o.rotation.y, o.rotation.z],
        });
    });
    animations.current = list;
  }, []);
  useFrame((_, delta) => {
    const state = motion.current,
      animated = state.running && !state.reduced && !state.hidden,
      dt = Math.min(delta, 0.06),
      damp = 1 - Math.exp(-dt * 5);
    progress.current =
      state.reduced || !state.running
        ? Math.round(state.progress)
        : progress.current + (state.progress - progress.current) * damp;
    const phase = sampleJourney(chapters, progress.current, position, target),
      craft = Math.max(0, 1 - Math.abs(phase - 7)),
      mobile = size.width < 768;
    pointer.current.x +=
      (state.pointer.x * (animated ? 1 : 0) - pointer.current.x) * damp;
    pointer.current.y +=
      (state.pointer.y * (animated ? 1 : 0) - pointer.current.y) * damp;
    if (mobile) {
      const ratio = Math.max(1, 1.2 / (size.width / size.height));
      position.sub(target).multiplyScalar(Math.min(ratio, 2.3)).add(target);
    }
    position.x += pointer.current.x * 0.65;
    position.y -= pointer.current.y * 0.35;
    camera.position.copy(position);
    camera.lookAt(target);
    const cam = camera as PerspectiveCamera;
    cam.setViewOffset(
      size.width,
      size.height,
      (mobile ? -0.035 : -0.15 + craft * 0.31) * size.width,
      (mobile ? -0.17 : 0) * size.height,
      size.width,
      size.height,
    );
    cam.updateMatrixWorld();
    focus.current.copy(target);
    focus.current.z += phase < 0.5 || phase > 7.5 ? -0.8 : 1.8;
    focus.current.y += phase > 6.5 && phase < 7.5 ? 1 : 0.3;
    const sky = scene.getObjectByName("sky");
    sky?.position.copy(camera.position);
    lightTarget.position.copy(target);
    lightTarget.updateMatrixWorld();
    if (sun.current) {
      sun.current.position.copy(target).add(sunOffset);
      sun.current.target = lightTarget;
    }
    if (rim.current) {
      rim.current.position.copy(target).add(rimOffset);
      rim.current.target = lightTarget;
    }
    islands.current?.children.forEach((island, i) => {
      island.visible = Math.abs(phase - i) < 1.25;
      if (island.children[0])
        island.children[0].visible = Math.abs(phase - i) < 0.7;
    });
    if (animated) time.current += dt;
    const t = time.current;
    animations.current.forEach(({ object: o, y, rotation }) => {
      if (o.userData.spin) {
        const axis = (o.userData.axis || "y") as "x" | "y" | "z";
        o.rotation[axis] =
          rotation[axis === "x" ? 0 : axis === "y" ? 1 : 2] +
          t * o.userData.spin;
      }
      if (o.userData.bob)
        o.position.y = y + Math.sin(t * 0.75 + o.id) * o.userData.bob;
      if (o.material?.userData.realmTime) o.material.uniforms.uTime.value = t;
    });
    if (import.meta.env.DEV) {
      gl.domElement.dataset.journey = JSON.stringify({
        progress: progress.current,
        phase,
        camera: camera.position.toArray(),
        focus: target.toArray(),
        time: t,
        draws: gl.info.render.calls,
      });
    }
  });
  return (
    <>
      <color attach="background" args={["#07171c"]} />
      <fogExp2 attach="fog" args={["#10272b", 0.012]} />
      <Atmosphere />
      <ambientLight intensity={0.6} color="#becfc5" />
      <hemisphereLight args={["#bdd5d4", "#31483c", 1.1]} />
      <directionalLight
        ref={sun}
        position={[-9, 14, 10]}
        intensity={3.5}
        color="#ffe0ad"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-11}
        shadow-camera-right={11}
        shadow-camera-top={12}
        shadow-camera-bottom={-9}
        shadow-camera-far={55}
        shadow-normalBias={0.045}
        shadow-bias={-0.0002}
      />
      <directionalLight
        ref={rim}
        position={[8, 8, -9]}
        intensity={2.3}
        color="#a7d8e0"
      />
      <Environment resolution={64} frames={1} environmentIntensity={0.5}>
        <Lightformer
          form="rect"
          intensity={2}
          color="#f0ddba"
          position={[-3, 5, 3]}
          scale={[5, 4]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.6}
          color="#9ccbc9"
          position={[4, 3, -3]}
          scale={[3, 4]}
          target={[0, 0, 0]}
        />
      </Environment>
      <group ref={islands}>
        {chapters.map((chapter, i) => (
          <group key={chapter.id} position={chapter.position}>
            <Mountains seed={i + 2} />
            <Terrain
              seed={i * 13 + 7}
              radius={chapter.kind === "gate" ? 6.2 : 5.8}
              depth={5.2 + (i % 3)}
              moss={!["tide", "orbit", "forge"].includes(chapter.kind)}
            />
            <RealmObjects chapter={chapter} gaze={gaze} />
            <Fireflies />
            {[-1, 1].map((side) => (
              <group
                key={side}
                position={[side * (15 + (i % 3)), -5, -12]}
                scale={[1.3, 2.2, 1.1]}
              >
                <Terrain
                  seed={i + side + 31}
                  radius={4.2}
                  depth={6}
                  moss={false}
                />
              </group>
            ))}
          </group>
        ))}
      </group>
      <Cinema focus={focus} onReady={onReady} />
    </>
  );
}
export default function RealmScene(props: Props) {
  return (
    <Canvas
      frameloop={
        props.motion.current.running && !props.motion.current.reduced
          ? "always"
          : "demand"
      }
      dpr={[1, 1.35]}
      camera={{ position: [7, 5.2, 15], fov: 44, near: 0.15, far: 300 }}
      shadows={{ type: PCFShadowMap }}
      gl={{
        alpha: false,
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
    >
      <Suspense fallback={null}>
        <World {...props} />
      </Suspense>
    </Canvas>
  );
}
