import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Compass,
  GithubLogo,
  Pause,
  Play,
  X,
  Butterfly,
  Check,
  Copy,
} from "@phosphor-icons/react";
import { site, type PortfolioProject } from "./data/site";
import { chapters, journeyProjects, projectNotes } from "./data/journey";
import { toolkit } from "./data/toolkit";
import { SceneBoundary } from "./components/SceneBoundary";
import { Foreground } from "./components/journey/Foreground";
import { useJourneyMotion } from "./components/journey/motion";
import type { GazeTarget } from "./components/useRobotGaze";
const RealmScene = lazy(() => import("./components/journey/RealmScene"));

export default function App() {
  const { motion, active, running, reduced, toggle } = useJourneyMotion();
  const [loadScene, setLoadScene] = useState(false),
    [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false);
  const [atlas, setAtlas] = useState(false),
    [selected, setSelected] = useState<PortfolioProject | null>(null);
  const [tool, setTool] = useState(toolkit[0]),
    [copied, setCopied] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null),
    opener = useRef<HTMLElement | null>(null);
  const gaze = useRef<GazeTarget>({ x: 0, y: 0, active: false });
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  useEffect(() => {
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const timer = setTimeout(
      () =>
        setLoadScene(
          !connection?.saveData &&
            !matchMedia("(prefers-reduced-motion: reduce)").matches,
        ),
      120,
    );
    return () => {
      clearTimeout(timer);
      clearTimeout(copyTimer.current);
    };
  }, []);
  useEffect(() => {
    if (atlas || selected) {
      opener.current = document.activeElement as HTMLElement;
      dialog.current?.showModal();
      const old = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = old;
        opener.current?.focus({ preventScroll: true });
      };
    }
    dialog.current?.close();
  }, [atlas, selected]);
  const close = () => {
    setAtlas(false);
    setSelected(null);
  };
  function toggleMotion() {
    if (!loadScene) {
      setLoadScene(true);
      if (!running) toggle();
    } else toggle();
  }
  function lookAt(element: HTMLElement, item: (typeof toolkit)[number]) {
    setTool(item);
    const rect = element.getBoundingClientRect();
    gaze.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      active: true,
    };
    window.dispatchEvent(new Event("robot-look-target"));
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(site.github);
      setCopied(true);
      copyTimer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }
  const current = chapters[active];
  return (
    <div
      className={`portfolio ${ready ? "realm-ready" : ""} ${!running || reduced ? "motion-paused" : ""}`}
    >
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="realm-backdrop" aria-hidden="true">
        <picture><source media="(max-width: 767px)" srcSet="/images/realm-mobile.webp" /><img
          className="realm-poster"
          src="/images/realm.webp"
          alt=""
          fetchPriority="high"
        /></picture>
        {loadScene && !failed && (
          <SceneBoundary
            onError={() => {
              setFailed(true);
              setReady(false);
            }}
          >
            <Suspense fallback={null}>
              <RealmScene
                motion={motion}
                gaze={gaze}
                onReady={() => setReady(true)}
              />
            </Suspense>
          </SceneBoundary>
        )}
      </div>
      <Foreground />
      <header className="header">
        <a className="wordmark" href="#home" aria-label="Sakti Pujo Edi, home">
          <Compass size={31} weight="light" aria-hidden="true" />
          <span>
            sakti<span className="wordmark-dot">.</span>
            <small>FULL-STACK DEVELOPER</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <button onClick={() => setAtlas(true)}>
            The journey <span>06</span>
          </button>
          <a href="#craft">The craft</a>
          <a className="header-contact" href="#contact">
            Let’s build <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </nav>
      </header>
      <aside className="chapter-rail" aria-label="Journey chapters">
        {chapters.map((chapter, i) => (
          <a
            key={chapter.id}
            href={`#${chapter.id}`}
            aria-label={`${String(i).padStart(2, "0")}. ${chapter.label}`}
            aria-current={active === i ? "location" : undefined}
          >
            <span className="rail-label">{chapter.label}</span>
            <span className="rail-mark" />
          </a>
        ))}
      </aside>
      <main id="main" tabIndex={-1}>
        {chapters.map((chapter, i) => (
          <section
            id={chapter.id}
            className={`journey-chapter chapter-${chapter.kind}`}
            aria-labelledby={`${chapter.id}-title`}
            key={chapter.id}
          >
            <div className="chapter-window">
              {chapter.project && (
                <img
                  className="chapter-fallback"
                  src={chapter.project.image}
                  alt=""
                  loading="lazy"
                />
              )}
              <div className="chapter-content">
                {i === 0 ? (
                  <div className="hero-copy">
                    <p className="eyebrow">
                      <span className="tiny-star">✦</span> A portfolio beyond
                      the ordinary
                    </p>
                    <h1 id="home-title">
                      A little code.
                      <br />
                      Infinite
                      <br />
                      <em>worlds.</em>
                    </h1>
                    <p className="hero-description">
                      I’m Sakti Pujo Edi. Full-stack developer,
                      <br className="desktop-break" /> curious maker, and a
                      builder of things that work.
                    </p>
                    <a className="journey-link" href="#navia">
                      <span className="round-arrow">
                        <ArrowDown size={18} aria-hidden="true" />
                      </span>
                      Enter the realm
                      <span className="link-line" />
                    </a>
                    <div className="hero-footnote">
                      <span>UI to API. Idea to experience.</span>
                      <span>EST. IN CURIOSITY</span>
                    </div>
                  </div>
                ) : chapter.project ? (
                  <div className="project-copy">
                    <p className="eyebrow">
                      <span>{chapter.project.number} / 06</span>
                      <span className="eyebrow-line" />
                      {chapter.realm}
                    </p>
                    <p className="project-type">{chapter.project.category}</p>
                    <h2 id={`${chapter.id}-title`}>
                      {chapter.project.title}
                      <span className="title-period">.</span>
                    </h2>
                    <p className="project-description">
                      {chapter.project.description}
                    </p>
                    <ul className="project-tags" aria-label="Project focus">
                      {chapter.project.tags.slice(0, 3).map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                    <button
                      className="journey-link"
                      onClick={() => setSelected(chapter.project!)}
                    >
                      Open field notes{" "}
                      <span className="round-arrow">
                        <ArrowUpRight size={19} aria-hidden="true" />
                      </span>
                    </button>
                    <p className="project-status">
                      <span
                        className={
                          chapter.project.demo
                            ? "status-concept"
                            : "status-live"
                        }
                      />
                      {chapter.project.demo
                        ? "Fictional project / design exploration"
                        : "Personal project / in development"}
                    </p>
                  </div>
                ) : chapter.kind === "craft" ? (
                  <div className="craft-copy">
                    <p className="eyebrow">07 / Behind the worlds</p>
                    <h2 id="craft-title">
                      Imagination.
                      <br />
                      <em>Engineered.</em>
                    </h2>
                    <p>
                      I build across interfaces, APIs, and databases. My current
                      focus is Navia ERP: making complex business workflows feel
                      straightforward.
                    </p>
                    <div
                      className="toolkit-grid"
                      onPointerLeave={() => {
                        gaze.current.active = false;
                      }}
                      onBlur={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget))
                          gaze.current.active = false;
                      }}
                    >
                      {toolkit.map((item) => (
                        <button
                          key={item.id}
                          aria-pressed={tool.id === item.id}
                          onPointerEnter={(event) =>
                            lookAt(event.currentTarget, item)
                          }
                          onFocus={(event) => lookAt(event.currentTarget, item)}
                          onClick={(event) => lookAt(event.currentTarget, item)}
                        >
                          {item.id === "elysia" ? (
                            <Butterfly
                              size={22}
                              color={item.color}
                              aria-hidden="true"
                            />
                          ) : (
                            <img
                              src={`/icons/${item.id}.svg`}
                              width="22"
                              height="22"
                              alt=""
                              loading="lazy"
                            />
                          )}
                          <span>{item.name}</span>
                        </button>
                      ))}
                    </div>
                    <p className="tool-detail" aria-live="polite">
                      <strong>{tool.name}</strong> {tool.description}
                    </p>
                  </div>
                ) : (
                  <div className="contact-copy">
                    <p className="eyebrow">
                      Every good world starts with an idea
                    </p>
                    <h2 id="contact-title">
                      What shall we
                      <br />
                      <em>build next?</em>
                    </h2>
                    <p>
                      A useful product. An unexpected experience.
                      <br />
                      Something that deserves to exist.
                    </p>
                    <a
                      className="contact-link"
                      href={site.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Find me on GitHub{" "}
                      <ArrowUpRight size={22} aria-hidden="true" />
                    </a>
                    <button className="copy-contact" onClick={copy}>
                      {copied ? <Check size={15} /> : <Copy size={15} />}
                      <span aria-live="polite">
                        {copied ? "Link copied" : "Copy profile link"}
                      </span>
                    </button>
                    <div className="contact-footer">
                      <span>© {new Date().getFullYear()} Sakti Pujo Edi</span>
                      <a href="#home">
                        Back to the beginning{" "}
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
              <span className="realm-caption" aria-hidden="true">
                {String(i).padStart(2, "0")}
                <span />
                {chapter.realm}
              </span>
            </div>
          </section>
        ))}
      </main>
      <div className="journey-hud">
        <button
          className="atlas-trigger"
          onClick={() => setAtlas(true)}
          aria-label="Open journey map"
        >
          <Compass size={20} weight="light" aria-hidden="true" />
          <span>
            <small>EXPLORING</small>
            {current.realm}
          </span>
        </button>
        <div className="scroll-cue" aria-hidden="true">
          <span />
          {active === chapters.length - 1
            ? "The story continues with you"
            : "Scroll to wander"}
        </div>
        <button
          className="motion-button"
          onClick={toggleMotion}
          aria-pressed={loadScene && running && !reduced}
        >
          {loadScene && running && !reduced ? (
            <Pause size={13} weight="fill" />
          ) : (
            <Play size={13} weight="fill" />
          )}
          <span>
            {failed
              ? "Scene unavailable"
              : loadScene && running && !reduced
                ? "Motion on"
                : "Motion off"}
          </span>
        </button>
      </div>
      <div className="journey-progress" aria-hidden="true" />
      <dialog
        ref={dialog}
        className={`field-dialog ${atlas ? "atlas-dialog" : ""}`}
        onCancel={close}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        aria-labelledby="dialog-title"
      >
        <div className="dialog-inner">
          <button
            className="dialog-close"
            onClick={close}
            aria-label="Close dialog"
          >
            <X size={22} />
          </button>
          {atlas ? (
            <>
              <p className="eyebrow">Choose your destination</p>
              <h2 id="dialog-title">An atlas of ideas.</h2>
              <p className="atlas-intro">
                One work in progress. Five imagined possibilities.
              </p>
              <div className="atlas-list">
                {journeyProjects.map((item, i) => (
                  <a key={item.id} href={`#${item.id}`} onClick={close}>
                    <span>{item.number}</span>
                    <img
                      src={item.image}
                      alt=""
                      width="80"
                      height="54"
                      loading="lazy"
                    />
                    <span>
                      <strong>{item.title}</strong>
                      <small>{chapters[i + 1].realm}</small>
                    </span>
                    <span className="atlas-status">
                      {item.demo ? "Concept" : "In development"}
                    </span>
                    <ArrowUpRight size={20} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </>
          ) : selected ? (
            <>
              <img
                className="field-image"
                src={selected.image}
                alt={selected.imageAlt}
                width="1200"
                height="800"
              />
              <div className="field-copy">
                <p className="eyebrow">
                  {selected.status} / {selected.category}
                </p>
                <h2 id="dialog-title">{selected.title}</h2>
                <p>{selected.detail}</p>
                <ul className="field-notes">
                  {projectNotes[selected.id].map((note) => (
                    <li key={note}>
                      <ArrowRight size={15} aria-hidden="true" />
                      {note}
                    </li>
                  ))}
                </ul>
                <ul className="project-tags">
                  {selected.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                {!selected.demo && (
                  <a
                    className="journey-link"
                    href={site.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GithubLogo size={19} />
                    Follow what I’m building <ArrowUpRight size={17} />
                  </a>
                )}
              </div>
            </>
          ) : null}
        </div>
      </dialog>
    </div>
  );
}
