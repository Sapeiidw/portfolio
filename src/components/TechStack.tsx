import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowBendDownRight, Butterfly, Pause, Play } from '@phosphor-icons/react';
import { toolkit } from '../data/toolkit';
import { SceneBoundary } from './SceneBoundary';
import { useSceneMotion } from './useSceneMotion';
import type { GazeTarget } from './useRobotGaze';

const RobotReviewScene = lazy(() => import('./RobotReviewScene'));

export function TechStack() {
  const [selected, setSelected] = useState(0), [ready, setReady] = useState(false), [failed, setFailed] = useState(false), [inView, setInView] = useState(false);
  const section = useRef<HTMLElement>(null), target = useRef<GazeTarget>({ x: 0, y: 0, active: false });
  const { enabled, toggle } = useSceneMotion();
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '240px' });
    if (section.current) observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  function review(index: number, element: HTMLButtonElement) {
    const rect = element.getBoundingClientRect();
    target.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, active: true };
    window.dispatchEvent(new Event('robot-look-target')); setSelected(index);
  }
  function resetGaze() { target.current.active = false; window.dispatchEvent(new Event('robot-look-target')); }
  const current = toolkit[selected];
  return <section ref={section} id="toolkit" className="toolkit-section content-width" aria-labelledby="toolkit-title">
    <div className="toolkit-heading"><p className="section-label">A practical toolkit. A curious mind.</p><h2 id="toolkit-title">The tools behind<br /><em>the work.</em></h2></div>
    <div className="toolkit-layout">
      <div className="review-stage">
        <p className="review-note">Always learning.<br />Always building.<ArrowBendDownRight size={35} weight="light" aria-hidden="true" /></p>
        <div className={`review-art ${ready && enabled && !failed ? 'review-ready' : ''}`}>
          <img className="review-poster" src="/images/robot-review.webp" alt="The same cream robot perched on books titled Build, Learn, Improve, Repeat." width="613" height="530" loading="lazy" />
          {enabled && inView && !failed && <SceneBoundary onError={() => setFailed(true)}><Suspense fallback={null}><RobotReviewScene target={target} onReady={() => setReady(true)} /></Suspense></SceneBoundary>}
        </div>
        {!failed && <button className="review-motion motion-toggle" onClick={() => { setReady(false); toggle(); }} aria-pressed={enabled} aria-label={enabled ? 'Pause robot motion' : 'Enable robot motion'}>{enabled ? <Pause size={13} weight="fill" aria-hidden="true" /> : <Play size={13} weight="fill" aria-hidden="true" />}{enabled ? 'Motion on' : 'Bring the robot to life'}</button>}
      </div>
      <div className="toolkit-panel">
        <p className="toolkit-instruction">Tech stack <span>Hover, focus, or tap to explore</span></p>
        <div className="toolkit-grid" onPointerLeave={resetGaze} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) resetGaze(); }}>
          {toolkit.map((tool, index) => <button className="tool-tile" key={tool.id} aria-pressed={selected === index} aria-describedby="tool-detail" onPointerEnter={event => review(index, event.currentTarget)} onFocus={event => review(index, event.currentTarget)} onClick={event => review(index, event.currentTarget)}>
            <span className="tool-icon-wrap" aria-hidden="true">{tool.id === 'elysia' ? <Butterfly size={34} color={tool.color} weight="duotone" /> : <span className="tool-icon" style={{ '--tool-color': tool.color, maskImage: `url(/icons/${tool.id}.svg)` } as CSSProperties} />}</span>
            <span>{tool.name}</span>
          </button>)}
        </div>
        <div id="tool-detail" className="tool-detail" aria-live="polite" aria-atomic="true"><p className="tool-detail-label"><span>{current.category}</span><span>{String(selected + 1).padStart(2, '0')} / {toolkit.length}</span></p><h3>{current.name}</h3><p>{current.description}</p></div>
      </div>
    </div>
  </section>;
}
