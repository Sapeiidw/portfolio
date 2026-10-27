import { lazy, Suspense, useState } from 'react';
import { SceneBoundary } from './SceneBoundary';
import { useSceneMotion } from './useSceneMotion';
import type { PortfolioProject } from '../data/site';
import { Pause, Play } from '@phosphor-icons/react';

const WorkspaceScene = lazy(() => import('./WorkspaceScene'));

export function SceneStage({ project }: { project: PortfolioProject }) {
  const { enabled, toggle } = useSceneMotion();
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  return <div className="scene-sticky">
    <div className={`scene-art ${ready && enabled && !failed ? 'scene-ready' : ''}`}>
      <picture><source media="(max-width: 767px)" srcSet="/images/workspace-mobile.webp" /><img className="scene-poster" src="/images/workspace.webp" alt="A floating wooden desk with a monitor, keyboard, warm desk lamp, and a little robot mascot." width="1536" height="960" fetchPriority="high" decoding="async" /></picture>
      {enabled && !failed && <SceneBoundary onError={() => { setFailed(true); }}>
        <Suspense fallback={null}><WorkspaceScene project={project} onReady={() => setReady(true)} /></Suspense>
      </SceneBoundary>}
    </div>
    <div className="scene-controls">
      {!failed && <button onClick={() => { setReady(false); toggle(); }} className="motion-toggle" aria-pressed={enabled} aria-label={enabled ? 'Pause 3D motion' : 'Enable 3D motion'}>{enabled ? <Pause size={13} weight="fill" aria-hidden="true" /> : <Play size={13} weight="fill" aria-hidden="true" />}<span>{enabled ? 'Motion on' : 'Motion off'}</span></button>}
      <span className="scene-note">{failed ? 'A quieter view of the workspace.' : 'Scroll to take a closer look.'}</span>
    </div>
  </div>;
}
