import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import type { PortfolioProject } from '../data/site';
import { Pause, Play } from '@phosphor-icons/react';

const WorkspaceScene = lazy(() => import('./WorkspaceScene'));

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function SceneStage({ project }: { project: PortfolioProject }) {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 767px)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let stored: string | null = null;
    try { stored = localStorage.getItem('portfolio-motion'); } catch { /* Storage is optional. */ }
    if (!reduced.matches && !connection?.saveData && stored !== 'off' && (!mobile.matches || stored === 'on')) {
      // Give the prerendered text and small poster a head start before WebGL.
      autoTimer.current = setTimeout(() => setEnabled(true), 500);
    }
    const handlePreference = () => { if (reduced.matches) { clearTimeout(autoTimer.current); setEnabled(false); setReady(false); } };
    reduced.addEventListener('change', handlePreference);
    return () => { clearTimeout(autoTimer.current); reduced.removeEventListener('change', handlePreference); };
  }, []);

  function toggle() {
    clearTimeout(autoTimer.current);
    setReady(false);
    setEnabled(value => {
      try { localStorage.setItem('portfolio-motion', value ? 'off' : 'on'); } catch { /* Storage is optional. */ }
      return !value;
    });
  }

  return <div className="scene-sticky">
    <div className={`scene-art ${ready && enabled && !failed ? 'scene-ready' : ''}`}>
      <img className="scene-poster" src="/images/workspace.webp" alt="A floating wooden desk with a monitor, keyboard, warm desk lamp, and a little robot mascot." width="1064" height="960" fetchPriority="high" decoding="async" />
      {enabled && !failed && <SceneBoundary onError={() => { setFailed(true); setEnabled(false); }}>
        <Suspense fallback={null}><WorkspaceScene project={project} onReady={() => setReady(true)} /></Suspense>
      </SceneBoundary>}
    </div>
    <div className="scene-controls">
      {!failed && <button onClick={toggle} className="motion-toggle" aria-pressed={enabled} aria-label={enabled ? 'Pause 3D motion' : 'Enable 3D motion'}>{enabled ? <Pause size={13} weight="fill" aria-hidden="true" /> : <Play size={13} weight="fill" aria-hidden="true" />}<span>{enabled ? 'Motion on' : 'Motion off'}</span></button>}
      <span className="scene-note">{failed ? 'A quieter view of the workspace.' : 'Scroll to take a closer look.'}</span>
    </div>
  </div>;
}
