import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

/** Focus stays on the monitor; foreground props soften behind the DOM text. */
export function WorkspaceDepth() {
  const { gl, scene, camera, size, invalidate } = useThree();
  const effect = useRef<{ composer: EffectComposer; bokeh: BokehPass } | null>(null);
  const focus = useRef(new Vector3(0, 1.85, -.7)), direction = useRef(new Vector3()), difference = useRef(new Vector3());
  useEffect(() => {
    if (size.width < 768) return;
    const composer = new EffectComposer(gl), render = new RenderPass(scene, camera);
    const bokeh = new BokehPass(scene, camera, { focus: 9, aperture: .0016, maxblur: .003 });
    // Preserve the transparent background when compositing the 3D layer.
    bokeh.materialBokeh.fragmentShader = bokeh.materialBokeh.fragmentShader.replace('vec4( col.xyz / 41.0, 1.0 )', 'vec4( col / 41.0 )');
    const output = new OutputPass(); composer.addPass(render); composer.addPass(bokeh); composer.addPass(output); composer.setSize(size.width, size.height);
    effect.current = { composer, bokeh }; invalidate();
    const capture = () => composer.render();
    if (import.meta.env.DEV) window.addEventListener('workspace-render', capture);
    return () => { window.removeEventListener('workspace-render', capture); effect.current = null; render.dispose(); bokeh.dispose(); output.dispose(); composer.dispose(); };
  }, [gl, scene, camera, size.width, size.height, invalidate]);
  useFrame(() => {
    if (!effect.current) { gl.render(scene, camera); return; }
    camera.getWorldDirection(direction.current); difference.current.copy(focus.current).sub(camera.position);
    effect.current.bokeh.materialBokeh.uniforms.focus.value = Math.max(.1, difference.current.dot(direction.current));
    effect.current.composer.render();
  }, 1);
  return null;
}
