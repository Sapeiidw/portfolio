import { useEffect, useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, ArrowLeft, ArrowRight, Check, Copy, GithubLogo } from '@phosphor-icons/react';
import { project, projects, site } from './data/site';
import { SceneStage } from './components/SceneStage';
import { TechStack } from './components/TechStack';

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const selected = projects[activeIndex];
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current); }, []);

  async function copyProfile() {
    try {
      await navigator.clipboard.writeText(site.email || site.github);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      window.open(site.github, '_blank', 'noopener,noreferrer');
    }
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="header">
        <a className="wordmark" href="#home" aria-label={`${site.name}, home`}>sakti<span>.</span></a>
        <nav aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#toolkit">Stack</a>
          <a href="#contact" className="nav-contact">Let’s talk <ArrowUpRight size={15} aria-hidden="true" /></a>
        </nav>
      </header>

      <main id="main" tabIndex={-1}>
        <div className="story" id="intro">
          <SceneStage project={selected} />
          <section id="home" className="hero content-width" aria-labelledby="hero-title">
            <div className="hero-copy">
              <p className="intro-label">Hi, I’m Sakti Pujo Edi</p>
              <h1 id="hero-title">Creative<br />developer<span className="accent">.</span></h1>
              <p className="hero-description">A selection of things I build.<br className="desktop-break" /> Thoughtful software, with a little personality.</p>
              <a className="text-link hero-link" href="#work">Explore my work <ArrowDownRight size={20} aria-hidden="true" /></a>
            </div>
          </section>

          <section id="work" className="work-intro content-width" aria-labelledby="work-title">
            <div className="work-copy">
              <p className="section-label">A few things from my workspace</p>
              <h2 id="work-title">Selected work<span className="accent">.</span></h2>
              <div className="project-summary" aria-live="polite" aria-atomic="true">
                <p className="project-category">{selected.category} <span>/</span> {selected.status}</p>
                <h3><span className="project-index">{selected.number} /</span> {selected.title}</h3>
                <p>{selected.description}</p>
                <a href={selected.demo ? `#concept-${selected.id}` : '#navia'} className="text-link">{selected.demo ? 'Explore the concept' : 'Inside the project'} <ArrowDownRight size={20} aria-hidden="true" /></a>
              </div>
              <div className="project-switcher" aria-label="Select featured project">
                <button className="project-arrow" onClick={() => setActiveIndex((activeIndex + projects.length - 1) % projects.length)} aria-label="Previous project"><ArrowLeft size={18} aria-hidden="true" /></button>
                <div className="project-steps">{projects.map((item, i) => <button key={item.id} onClick={() => setActiveIndex(i)} aria-label={`Show ${item.title}`} aria-pressed={i === activeIndex}><span /></button>)}</div>
                <button className="project-arrow" onClick={() => setActiveIndex((activeIndex + 1) % projects.length)} aria-label="Next project"><ArrowRight size={18} aria-hidden="true" /></button>
                <span className="project-count" aria-hidden="true">{selected.number} / 04</span>
              </div>
              <img className="mobile-project-preview" src={selected.image} alt={selected.imageAlt} width="1200" height="800" loading="lazy" />
            </div>
          </section>
        </div>

        <section id="navia" className="project-section content-width" aria-labelledby="navia-title">
          <div className="project-heading">
            <p className="section-label">Current project</p>
            <h2 id="navia-title">Complex operations.<br /><em>Clearer connections.</em></h2>
          </div>
          <div className="project-detail">
            <div className="project-overview">
              <h3>Navia ERP</h3>
              <p>{project.detail}</p>
              <ul className="stack" aria-label="Project technology stack">{project.stack.map(tech => <li key={tech}>{tech}</li>)}</ul>
              <a className="text-link" href={site.github} target="_blank" rel="noopener noreferrer">More on GitHub <ArrowUpRight size={18} aria-hidden="true" /></a>
            </div>
            <div className="project-areas">
              {project.areas.map((area, i) => <article key={area.title}>
                <span className="area-number" aria-hidden="true">0{i + 1}</span>
                <div><h3>{area.title}</h3><p>{area.description}</p></div>
              </article>)}
            </div>
          </div>
        </section>

        <section className="concept-section content-width" aria-labelledby="concept-title">
          <div className="concept-heading"><div><p className="section-label">Room to experiment</p><h2 id="concept-title">Other little worlds<span className="accent">.</span></h2></div><p>Three fictional projects.<br />Three different directions.</p></div>
          <div className="concept-grid">{projects.filter(item => item.demo).map(item => <article className="concept-card" id={`concept-${item.id}`} key={item.id}>
            <a className="concept-image-link" href={`#details-${item.id}`} onClick={() => { const detail = document.getElementById(`details-${item.id}`); if (detail instanceof HTMLDetailsElement) detail.open = true; }} aria-label={`Read about ${item.title}`}><img src={item.image} alt={item.imageAlt} width="1200" height="800" loading="lazy" decoding="async" /><span className="concept-badge">Demo concept</span><span className="concept-image-arrow"><ArrowUpRight size={24} aria-hidden="true" /></span></a>
            <div className="concept-title-row"><h3>{item.title}</h3><span>{item.number}</span></div>
            <p className="concept-category">{item.category}</p>
            <p className="concept-description">{item.description}</p>
            <details id={`details-${item.id}`}><summary>About the concept <span aria-hidden="true">+</span></summary><p>{item.detail}</p><ul className="stack">{item.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></details>
          </article>)}</div>
        </section>

        <TechStack />

        <section id="about" className="about-section content-width" aria-labelledby="about-title">
          <div className="about-heading"><h2 id="about-title">A builder at heart<span className="accent">.</span></h2></div>
          <div className="about-content">
            <p className="about-lead">I’m Sakti, a full-stack developer who enjoys making complicated things feel straightforward.</p>
            <p>I work across interfaces, APIs, and databases. My current focus is Navia ERP: connecting everyday business workflows through thoughtful software.</p>
            <p>This little workspace is a different side of the same curiosity. A place to experiment with interaction, movement, and the details that make the web feel personal.</p>
            <a className="text-link" href={site.github} target="_blank" rel="noopener noreferrer"><GithubLogo size={19} aria-hidden="true" /> Follow what I’m building <ArrowUpRight size={18} aria-hidden="true" /></a>
          </div>
        </section>

        <section id="contact" className="contact-section content-width" aria-labelledby="contact-title">
          <p className="section-label">Have something in mind?</p>
          <h2 id="contact-title">Let’s make<br /><em>something good.</em></h2>
          <div className="contact-actions">
            <a className="contact-primary" href={site.email ? `mailto:${site.email}` : site.github} target={site.email ? undefined : '_blank'} rel={site.email ? undefined : 'noopener noreferrer'}>{site.email ? 'Say hello by email' : 'Find me on GitHub'} <ArrowUpRight size={24} aria-hidden="true" /></a>
            <button className="copy-button" onClick={copyProfile} aria-label={copied ? 'Copied to clipboard' : 'Copy contact link'}>{copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}<span aria-live="polite">{copied ? 'Copied!' : 'Copy link'}</span></button>
          </div>
        </section>
      </main>

      <footer className="footer content-width"><p>© {new Date().getFullYear()} {site.name}</p><a href={site.github} target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={14} aria-hidden="true" /></a><a href="#home">Back to top ↑</a></footer>
    </>
  );
}

