import { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import { NoColorSpace, RepeatWrapping, SRGBColorSpace, Vector2 } from 'three';

/** Shared local PBR maps. Data maps stay linear; only the albedo is sRGB. */
export function useSurface(kind: 'wood' | 'rock') {
  const [map, normalMap, roughnessMap] = useTexture([
    `/textures/${kind}-color.jpg`, `/textures/${kind}-normal.jpg`, `/textures/${kind}-roughness.jpg`,
  ]);
  return useMemo(() => {
    [map, normalMap, roughnessMap].forEach(texture => {
      texture.wrapS = texture.wrapT = RepeatWrapping;
      texture.anisotropy = 8;
      texture.colorSpace = texture === map ? SRGBColorSpace : NoColorSpace;
      if (kind === 'wood') {
        texture.center.set(.5, .5); texture.rotation = Math.PI / 2; texture.repeat.set(.25, .25);
      }
      texture.needsUpdate = true;
    });
    return { map, normalMap, roughnessMap, normalScale: new Vector2(kind === 'rock' ? .75 : .4, kind === 'rock' ? .75 : .4) };
  }, [map, normalMap, roughnessMap, kind]);
}
