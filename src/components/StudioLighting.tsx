import { Environment, Lightformer } from '@react-three/drei';
export function StudioLighting() {
  return <>
    <ambientLight intensity={.24} color="#ccd2cf" />
    <hemisphereLight args={['#a8b8c6', '#423424', .45]} />
    <directionalLight position={[-3, 6, 4]} intensity={3.2} color="#ffe2b7" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5} shadow-bias={-.0002} shadow-normalBias={.018} shadow-radius={3} />
    <directionalLight position={[2, 4, -3]} intensity={1.75} color="#c5d4df" />
    <directionalLight position={[-1, -2, 5]} intensity={.45} color="#bfb39e" />
    <Environment resolution={128} frames={1} environmentIntensity={.65}>
      <Lightformer form="rect" intensity={2} color="#f8e7ca" position={[-3, 5, 3]} scale={[5, 4]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={1.5} color="#bccbd6" position={[3, 3, -3]} scale={[2, 4]} target={[0, 1, 0]} />
      <Lightformer form="rect" intensity={.4} color="#e9ddc6" position={[0, 1, 5]} scale={[4, 2]} target={[0, 1, 0]} />
    </Environment>
  </>;
}
