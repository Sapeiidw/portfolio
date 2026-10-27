import { useEffect, useMemo, type RefObject } from "react";
import { useTexture } from "@react-three/drei";
import { AdditiveBlending, Color, DoubleSide, SRGBColorSpace } from "three";
import { useSurface } from "../sceneMaterials";
import { Book } from "../Books";
import { Robot } from "../Robot";
import { Rod, SoftBox, type Point } from "../primitives";
import { RuinColumn, Trees } from "./Terrain";
import type { GazeTarget } from "../useRobotGaze";
import type { Chapter } from "../../data/journey";

const vertex = `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const noise = `float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);} float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);} float fbm(vec2 p){float v=0.;float a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.04+3.7;a*=.5;}return v;}`;
export function Portal({
  color = "#eac88f",
  scale = 1,
}: {
  color?: string;
  scale?: number;
}) {
  const surface = useSurface("rock");
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uColor: { value: new Color(color) } }),
    [color],
  );
  return (
    <group scale={scale}>
      <group position={[0, 3.65, -0.8]}>
        {Array.from({ length: 36 }, (_, i) => {
          const a = (i / 36) * Math.PI * 2;
          return (
            <group
              key={i}
              position={[Math.cos(a) * 3.36, Math.sin(a) * 3.36, 0]}
              rotation={[0, 0, a - Math.PI / 2]}
            >
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.57, 0.66, 0.87]} />
                <meshStandardMaterial
                  {...surface}
                  color={i % 3 ? "#777f72" : "#9b9984"}
                  roughness={0.9}
                />
              </mesh>
              <mesh position={[0, 0, 0.446]}>
                <boxGeometry args={[0.035, 0.19, 0.012]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={1.8}
                  toneMapped={false}
                />
              </mesh>
            </group>
          );
        })}
        {[3.01, 3.72].map((r, i) => (
          <mesh key={r}>
            <torusGeometry args={[r, i ? 0.024 : 0.04, 10, 160]} />
            <meshStandardMaterial
              color={color}
              metalness={0.7}
              roughness={0.3}
              emissive={color}
              emissiveIntensity={i ? 0.3 : 2.5}
              toneMapped={false}
            />
          </mesh>
        ))}
        <mesh position={[0, 0, -0.05]}>
          <circleGeometry args={[3.02, 100]} />
          <shaderMaterial
            uniforms={uniforms}
            userData={{ realmTime: true }}
            side={DoubleSide}
            vertexShader={vertex}
            fragmentShader={`${noise} varying vec2 vUv;uniform float uTime;uniform vec3 uColor;void main(){vec2 p=vUv-.5;float r=length(p);float n=fbm(p*4.+vec2(uTime*.024,-uTime*.018));float strands=pow(abs(sin(p.x*10.+n*8.+uTime*.06)),16.);float halo=pow(smoothstep(.28,.5,r),5.);vec3 c=mix(vec3(.025,.075,.085),vec3(.24,.38,.33),n);c+=uColor*(strands*.18+halo*.6);float ridge=fbm(vec2(p.x*8.,3.))* .22-.3;if(p.y<ridge)c*=.22;float stars=step(.998,hash(floor(vUv*290.)))*step(.04,p.y);c+=stars*.5;gl_FragColor=vec4(c,1.);}`}
          />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <ringGeometry args={[2.88, 3.16, 100]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.14}
            blending={AdditiveBlending}
            side={DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>
      {Array.from({ length: 8 }, (_, i) => (
        <mesh
          key={i}
          position={[0, 0.08 + i * 0.08, 3.45 - i * 0.49]}
          receiveShadow
          castShadow
        >
          <boxGeometry args={[2.4 - i * 0.025, 0.18, 0.57]} />
          <meshStandardMaterial {...surface} color="#999b8a" roughness={0.95} />
        </mesh>
      ))}
      <RuinColumn position={[-4, 0.2, -0.7]} height={2.8} />
      <RuinColumn position={[4, 0.2, -0.7]} height={3.4} />
      <Lantern position={[-2.2, 0.4, 2]} />
      <Lantern position={[2.2, 0.4, 2]} />
    </group>
  );
}
export function Lantern({ position = [0, 0, 0] }: { position?: Point }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.11, 1, 10]} />
        <meshStandardMaterial
          color="#77664c"
          metalness={0.65}
          roughness={0.5}
        />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.16, 16, 12]} />
        <meshBasicMaterial color="#ffe0a2" toneMapped={false} />
      </mesh>
      {[-1, 1].map((x) => (
        <Rod
          key={x}
          from={[x * 0.18, 0.83, 0]}
          to={[x * 0.18, 1.28, 0]}
          radius={0.018}
        />
      ))}
      <mesh position={[0, 1.32, 0]}>
        <coneGeometry args={[0.27, 0.16, 6]} />
        <meshStandardMaterial color="#7d6847" metalness={0.6} />
      </mesh>
      <pointLight
        position={[0, 1.1, 0]}
        intensity={3}
        color="#f4ca7d"
        distance={3}
      />
    </group>
  );
}
export function ProjectTablet({
  image,
  position = [0, 3, 1.5],
  rotation = [0, 0, 0],
  scale = 1,
}: {
  image: string;
  position?: Point;
  rotation?: Point;
  scale?: number;
}) {
  const texture = useTexture(image);
  useEffect(() => {
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);
  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      userData={{ bob: 0.07 }}
    >
      <SoftBox size={[5.25, 3.45, 0.17]} color="#776d50" radius={0.06} />
      <SoftBox
        position={[0, 0, 0.1]}
        size={[5.12, 3.33, 0.05]}
        color="#122323"
        radius={0.045}
      />
      <mesh position={[0, 0, 0.132]}>
        <planeGeometry args={[4.91, 3.12]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {[-1, 1].map((x) =>
        [-1, 1].map((y) => (
          <mesh key={`${x}-${y}`} position={[x * 2.54, y * 1.62, 0.14]}>
            <sphereGeometry args={[0.025, 12, 8]} />
            <meshStandardMaterial
              color="#dfc58c"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        )),
      )}
      <mesh position={[0, -1.64, 0.145]}>
        <boxGeometry args={[0.4, 0.015, 0.01]} />
        <meshBasicMaterial color="#e4c487" toneMapped={false} />
      </mesh>
    </group>
  );
}
function Citadel() {
  const surface = useSurface("rock");
  return (
    <>
      <group position={[0, 0, -1.3]}>
        {[-3.4, 0, 3.4].map((x, i) => (
          <group key={x} position={[x, 0, i === 1 ? -1.8 : 0]}>
            <mesh position={[0, 2.4, 0]} castShadow>
              <cylinderGeometry args={[0.66, 0.95, 4.8, 8]} />
              <meshStandardMaterial {...surface} color="#8c9485" />
            </mesh>
            <mesh position={[0, 5.1, 0]} castShadow>
              <coneGeometry args={[1.05, 1.6, 8]} />
              <meshStandardMaterial
                color="#455e5a"
                metalness={0.35}
                roughness={0.6}
              />
            </mesh>
            {[1.4, 2.5, 3.6].map((y) => (
              <mesh key={y} position={[0, y, 0.78]}>
                <boxGeometry args={[0.15, 0.44, 0.04]} />
                <meshBasicMaterial color="#edc88c" toneMapped={false} />
              </mesh>
            ))}
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[1.16, 1.3, 0.5, 8]} />
              <meshStandardMaterial {...surface} color="#989d88" />
            </mesh>
          </group>
        ))}
      </group>
      <ProjectTablet
        image="/images/navia.svg"
        position={[0.2, 2.55, 1.35]}
        rotation={[0, 0.12, 0]}
        scale={1.08}
      />
      <Lantern position={[-3.9, 0.2, 2.4]} />
      <Lantern position={[3.9, 0.2, 2.4]} />
    </>
  );
}
function Observatory() {
  const surface = useSurface("rock");
  return (
    <>
      <group position={[0, 4, -0.6]} userData={{ spin: 0.055 }}>
        {[0, 1, 2].map((i) => (
          <group key={i} rotation={[i * 0.7, i * 0.85, 0.3 + i * 0.5]}>
            <mesh>
              <torusGeometry args={[3.65 + i * 0.18, 0.055, 12, 144]} />
              <meshStandardMaterial
                color="#bba373"
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
            {Array.from({ length: 12 }, (_, j) => (
              <mesh
                key={j}
                position={[
                  Math.cos((j / 12) * Math.PI * 2) * 3.65,
                  Math.sin((j / 12) * Math.PI * 2) * 3.65,
                  0,
                ]}
              >
                <sphereGeometry args={[0.065, 12, 10]} />
                <meshBasicMaterial color="#dcc392" toneMapped={false} />
              </mesh>
            ))}
          </group>
        ))}
        <mesh position={[0, 0.2, -0.6]}>
          <sphereGeometry args={[2, 64, 48]} />
          <meshStandardMaterial {...surface} color="#9fa6a6" roughness={1} />
        </mesh>
        <mesh position={[3.6, 0, 0]}>
          <sphereGeometry args={[0.27, 24, 20]} />
          <meshStandardMaterial
            color="#c7d7d4"
            emissive="#98bebe"
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>
      <ProjectTablet
        image="/images/orbit.webp"
        position={[0, 2.2, 2]}
        rotation={[0, -0.14, 0]}
        scale={0.88}
      />
      <RuinColumn position={[-4.3, 0.1, 0]} height={2.1} />
      <RuinColumn position={[4.3, 0.1, 0]} height={3} />
    </>
  );
}
function AncientTree() {
  const wood = useSurface("wood");
  return (
    <group position={[-1.6, 0, -1.3]}>
      <mesh position={[0, 2.2, 0]} rotation={[0, 0, -0.12]} castShadow>
        <cylinderGeometry args={[0.35, 0.9, 4.5, 12, 6]} />
        <meshStandardMaterial {...wood} color="#716b4e" />
      </mesh>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <group key={i}>
            <Rod
              from={[0, 2.4, 0]}
              to={[Math.cos(a) * 2.5, 4.2 + Math.sin(a) * 0.5, Math.sin(a) * 2]}
              radius={0.13}
              color="#555b42"
            />
            {[0, 1, 2].map((j) => (
              <mesh
                key={j}
                position={[
                  Math.cos(a) * (1.5 + j * 0.65),
                  4.8 + Math.sin(i * 3 + j) * 0.5,
                  Math.sin(a) * (1.4 + j * 0.55),
                ]}
                scale={[1.6, 1, 1.3]}
                castShadow
              >
                <icosahedronGeometry args={[1, 2]} />
                <meshStandardMaterial
                  color={["#526c4b", "#607d4f", "#748659"][j]}
                  roughness={1}
                />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}
function Sanctuary() {
  const wood = useSurface("wood");
  return (
    <>
      <AncientTree />
      <group position={[2, 0.3, -1.1]} rotation={[0, -0.2, 0]}>
        <mesh position={[0, 0.8, 0]} castShadow>
          <boxGeometry args={[2, 1.6, 1.6]} />
          <meshStandardMaterial {...wood} color="#ac9470" />
        </mesh>
        <mesh position={[0, 1.9, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.8, 1.3, 4]} />
          <meshStandardMaterial color="#2f4944" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.9, 0.81]}>
          <planeGeometry args={[1.25, 0.8]} />
          <meshBasicMaterial color="#efc58c" toneMapped={false} />
        </mesh>
        <Rod
          from={[-0.02, 0.5, 0.83]}
          to={[-0.02, 1.3, 0.83]}
          radius={0.035}
          color="#66553b"
        />
      </group>
      <ProjectTablet
        image="/images/verdant.webp"
        position={[0.6, 2.7, 2]}
        rotation={[0, 0.17, 0]}
        scale={0.95}
      />
      <Lantern position={[3.9, 0.2, 1.8]} />
    </>
  );
}
function Forge() {
  return (
    <>
      <group position={[0, 3.5, -0.7]} userData={{ bob: 0.15, spin: 0.045 }}>
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[2.3, 0.19, 20, 80, Math.PI]} />
          <meshStandardMaterial
            color="#c6aa79"
            metalness={0.75}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <torusGeometry args={[2.05, 0.13, 20, 80, Math.PI]} />
          <meshStandardMaterial color="#534332" roughness={0.85} />
        </mesh>
        {[-1, 1].map((x) => (
          <group
            key={x}
            position={[x * 2.15, 0, 0]}
            rotation={[0, 0, x * -0.17]}
          >
            <SoftBox size={[0.72, 1.8, 1.1]} color="#c7baa0" radius={0.3} />
            <SoftBox
              position={[-x * 0.35, 0, 0]}
              size={[0.23, 1.5, 0.96]}
              color="#5e4436"
              radius={0.11}
            />
            <mesh position={[x * 0.37, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.31, 0.31, 0.03, 40]} />
              <meshStandardMaterial
                color="#a58a5d"
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
          </group>
        ))}
      </group>
      <RuinColumn position={[-3.7, 0.1, -1.3]} height={4.8} />
      <RuinColumn position={[3.7, 0.1, -1.3]} height={4.8} />
      <ProjectTablet
        image="/images/forma.webp"
        position={[0, 1.9, 2]}
        rotation={[0, -0.12, 0]}
        scale={0.86}
      />
      <Lantern position={[-4, 0.3, 2.5]} />
      <Lantern position={[4, 0.3, 2.5]} />
    </>
  );
}
function Tide() {
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
        <circleGeometry args={[4.9, 100]} />
        <shaderMaterial
          uniforms={uniforms}
          userData={{ realmTime: true }}
          vertexShader={vertex}
          fragmentShader={`${noise} varying vec2 vUv;uniform float uTime;void main(){vec2 p=vUv*12.;float w=sin(p.x*5.+uTime*.8+fbm(p+uTime*.07)*6.);float v=pow(w*.5+.5,7.);gl_FragColor=vec4(mix(vec3(.025,.18,.19),vec3(.38,.65,.57),v*.6+fbm(p)*.15),1.);}`}
        />
      </mesh>
      <group position={[2.6, 0.4, -1.8]}>
        <mesh position={[0, 2, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.85, 4, 16]} />
          <meshStandardMaterial color="#b4b7a3" roughness={0.9} />
        </mesh>
        <mesh position={[0, 4.25, 0]}>
          <cylinderGeometry args={[0.68, 0.68, 0.6, 12]} />
          <meshStandardMaterial color="#304d4c" metalness={0.4} />
        </mesh>
        <mesh position={[0, 4.28, 0]}>
          <sphereGeometry args={[0.42, 20, 16]} />
          <meshBasicMaterial color="#ffe2a5" toneMapped={false} />
        </mesh>
        <mesh position={[0, 4.8, 0]}>
          <coneGeometry args={[0.85, 0.5, 12]} />
          <meshStandardMaterial color="#648278" metalness={0.6} />
        </mesh>
        <group position={[0, 4.3, 0]} userData={{ spin: 0.3 }}>
          <mesh rotation={[0, 0, -Math.PI / 2]} position={[2, 0, 0]}>
            <coneGeometry args={[0.65, 4, 32, 1, true]} />
            <meshBasicMaterial
              color="#bcd4c0"
              opacity={0.065}
              transparent
              side={DoubleSide}
              depthWrite={false}
              blending={AdditiveBlending}
            />
          </mesh>
        </group>
      </group>
      <group
        position={[-2.5, 2, -0.5]}
        rotation={[0.3, -0.4, 0.25]}
        userData={{ spin: 0.08 }}
      >
        {[1.6, 2, 2.4].map((r, i) => (
          <mesh key={r} rotation={[i * 0.35, i * 0.3, 0]}>
            <torusGeometry args={[r, 0.035, 12, 100, Math.PI * 1.65]} />
            <meshStandardMaterial
              color="#9cc5bb"
              emissive="#65a5a3"
              emissiveIntensity={0.4}
              metalness={0.6}
            />
          </mesh>
        ))}
      </group>
      <ProjectTablet
        image="/images/tidal.svg"
        position={[-0.3, 2.2, 2]}
        scale={0.97}
      />
    </>
  );
}
function Airship() {
  const wood = useSurface("wood");
  return (
    <group
      position={[0, 4, -0.8]}
      rotation={[0, -0.25, 0.04]}
      userData={{ bob: 0.18 }}
    >
      <mesh scale={[3.5, 1.3, 1.3]} castShadow>
        <sphereGeometry args={[1, 64, 40]} />
        <meshPhysicalMaterial color="#c6bba0" roughness={0.7} clearcoat={0.1} />
      </mesh>
      {[-2, -1, 0, 1, 2].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry
            args={[1.3 * Math.sqrt(1 - (x * x) / 12.25), 0.025, 8, 64]}
          />
          <meshStandardMaterial
            color="#8b7854"
            metalness={0.55}
            roughness={0.55}
          />
        </mesh>
      ))}
      <mesh position={[0, -1.85, 0]} scale={[1.8, 0.4, 0.65]} castShadow>
        <sphereGeometry args={[1, 32, 20]} />
        <meshStandardMaterial {...wood} color="#ad9370" roughness={0.75} />
      </mesh>
      {[-1, 1].map((x) =>
        [-1, 1].map((z) => (
          <Rod
            key={`${x}-${z}`}
            from={[x * 1.5, -0.6, z * 0.8]}
            to={[x * 1.35, -1.7, z * 0.45]}
            radius={0.025}
            color="#695d46"
          />
        )),
      )}
      <group position={[3.2, 0, 0]} rotation={[0, 0, 0.2]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[1.2, 0.06, 1.8]} />
          <meshStandardMaterial color="#61756b" metalness={0.3} />
        </mesh>
        <mesh>
          <boxGeometry args={[1.2, 0.06, 1.8]} />
          <meshStandardMaterial color="#61756b" metalness={0.3} />
        </mesh>
      </group>
      <group position={[-1, -1.6, 1]} userData={{ spin: 0.9, axis: "z" }}>
        {[0, Math.PI / 2].map((a) => (
          <mesh key={a} rotation={[0, 0, a]}>
            <boxGeometry args={[0.08, 1.05, 0.04]} />
            <meshStandardMaterial color="#cbb88b" metalness={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
function Craft({ gaze }: { gaze: RefObject<GazeTarget> }) {
  return (
    <>
      <group position={[0, 0.3, 1]} scale={2.3} rotation={[0, 0.12, 0]}>
        {["Repeat", "Improve", "Learn", "Build"].map((title, i) => (
          <Book
            key={title}
            title={title}
            color={i % 2 ? "#716044" : "#343e32"}
            width={1.8 - i * 0.06}
            height={0.26}
            depth={1.12}
            position={[Math.sin(i) * 0.03, i * 0.27 + 0.15, 0]}
            rotation={[0, (i % 2 ? 1 : -1) * 0.04, 0]}
          />
        ))}
        <Robot
          position={[0.06, 1.4, 0]}
          rotation={[0, 0.85, 0]}
          scale={1.5}
          seated
          target={gaze}
        />
      </group>
      <Trees count={12} seed={12} />
      <Lantern position={[-2.7, 0.2, 1.9]} />
    </>
  );
}
export function RealmObjects({
  chapter,
  gaze,
}: {
  chapter: Chapter;
  gaze: RefObject<GazeTarget>;
}) {
  switch (chapter.kind) {
    case "gate":
      return (
        <>
          <Portal />
          <Trees seed={4} count={18} />
          <Robot
            position={[2.9, 0.65, 2.2]}
            rotation={[0, 0.45, 0]}
            scale={1.25}
            seated
          />
        </>
      );
    case "citadel":
      return <Citadel />;
    case "orbit":
      return <Observatory />;
    case "forest":
      return (
        <>
          <Sanctuary />
          <Trees seed={8} count={20} />
        </>
      );
    case "forge":
      return <Forge />;
    case "tide":
      return <Tide />;
    case "sky":
      return (
        <>
          <Airship />
          <ProjectTablet
            image="/images/aether.svg"
            position={[0, 1.9, 2]}
            scale={1}
          />
          <RuinColumn position={[-3.8, 0.1, -0.3]} height={2.2} />
          <RuinColumn position={[3.8, 0.1, -0.3]} height={2.7} />
        </>
      );
    case "craft":
      return <Craft gaze={gaze} />;
    case "return":
      return (
        <>
          <Portal scale={0.9} />
          <Trees seed={30} count={14} />
          <Robot
            position={[2.8, 0.6, 2.4]}
            rotation={[0, 0.4, 0]}
            scale={1.6}
            seated
          />
        </>
      );
  }
}
