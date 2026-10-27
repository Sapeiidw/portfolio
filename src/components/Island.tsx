import { useEffect, useMemo } from 'react';
import { IcosahedronGeometry } from 'three';
import { makeRockTexture, seededRandom } from './sceneTextures';

export function Island() {
  const texture = useMemo(makeRockTexture, []);
  const geometry = useMemo(() => {
    const geo = new IcosahedronGeometry(1, 3), pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const n = 1 + Math.sin(x * 27 + z * 17) * .06 + Math.cos(y * 31 + z * 11) * .045;
      pos.setXYZ(i, x * n, y * n, z * n);
    }
    geo.computeVertexNormals(); return geo;
  }, []);
  const rocks = useMemo(() => { const r = seededRandom(19); return Array.from({ length: 27 }, (_, i) => ({
    x: (r() - .5) * 5.9, z: (r() - .5) * 2.8, y: i < 18 ? -.42 : -1.05 - r() * .45,
    scale: i < 18 ? .2 + r() * .28 : .04 + r() * .09, rotation: r() * 7,
  })); }, []);
  useEffect(() => () => { texture.dispose(); geometry.dispose(); }, [texture, geometry]);
  return <group>
    <mesh geometry={geometry} position={[0, -.38, 0]} scale={[3.25, .7, 1.64]} castShadow receiveShadow><meshStandardMaterial map={texture} bumpMap={texture} bumpScale={.13} roughness={1} color="#a4967e" flatShading /></mesh>
    {rocks.map((rock, i) => <mesh key={i} geometry={geometry} position={[rock.x, rock.y, rock.z]} scale={[rock.scale * 1.4, rock.scale, rock.scale]} rotation={[rock.rotation, rock.rotation * .7, 0]} castShadow receiveShadow><meshStandardMaterial map={texture} bumpMap={texture} bumpScale={.08} color={i % 3 ? '#958979' : '#667045'} roughness={1} flatShading /></mesh>)}
  </group>;
}
