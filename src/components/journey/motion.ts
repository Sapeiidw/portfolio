import { useEffect, useRef, useState } from "react";
import { chapters } from "../../data/journey";
export interface JourneyMotion {
  progress: number;
  pointer: { x: number; y: number };
  reduced: boolean;
  running: boolean;
  hidden: boolean;
}
export const clamp = (value: number, min = 0, max = 1) =>
  Math.max(min, Math.min(max, value));
export const smooth = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};
/** Continuous input stays outside React. Only chapter changes update the UI. */
export function useJourneyMotion() {
  const motion = useRef<JourneyMotion>({
    progress: 0,
    pointer: { x: 0, y: 0 },
    reduced: false,
    running: true,
    hidden: false,
  });
  const [active, setActive] = useState(0),
    [running, setRunning] = useState(true),
    [reduced, setReduced] = useState(false);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const sections = [
      ...document.querySelectorAll<HTMLElement>(".journey-chapter"),
    ];
    let bounds: number[] = [],
      heights: number[] = [],
      frame = 0,
      current = -1,
      px = 0,
      py = 0;
    const root = document.documentElement;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      let index = 0;
      for (let i = 0; i < bounds.length; i++) if (y >= bounds[i] - 1) index = i;
      const fraction = clamp(
        (y - (bounds[index] || 0)) / (heights[index] || 1),
      );
      motion.current.progress = Math.min(chapters.length - 1, index + fraction);
      const next = Math.min(
        chapters.length - 1,
        Math.floor(motion.current.progress + 0.32),
      );
      if (next !== current) {
        current = next;
        setActive(next);
      }
      root.style.setProperty(
        "--journey-progress",
        `${motion.current.progress / (chapters.length - 1)}`,
      );
      root.style.setProperty("--realm-accent", chapters[next].color);
      sections.forEach((section, i) => {
        const local = (y - bounds[i]) / heights[i];
        const visible =
          local < 0 ? clamp(1 + local * 3) : 1 - smooth((local - 0.38) / 0.36);
        section.style.setProperty(
          "--copy-opacity",
          String(motion.current.reduced ? 1 : visible),
        );
      });
      root.dataset.realmMotion =
        motion.current.running && !motion.current.reduced ? "on" : "off";
      const factor = motion.current.running && !motion.current.reduced ? 1 : 0;
      px += (motion.current.pointer.x * factor - px) * 0.11;
      py += (motion.current.pointer.y * factor - py) * 0.11;
      root.style.setProperty("--pointer-x", `${px * 26}px`);
      root.style.setProperty("--pointer-y", `${py * 19}px`);
      root.style.setProperty(
        "--scroll-drift",
        `${Math.sin(motion.current.progress * 1.4) * 80}px`,
      );
      if (
        Math.abs(px - motion.current.pointer.x * factor) +
          Math.abs(py - motion.current.pointer.y * factor) >
        0.02
      )
        frame = requestAnimationFrame(update);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const measure = () => {
      bounds = sections.map((el) => el.offsetTop);
      heights = sections.map((el) => el.offsetHeight);
      schedule();
    };
    const pointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      motion.current.pointer = {
        x: (event.clientX / innerWidth) * 2 - 1,
        y: (event.clientY / innerHeight) * 2 - 1,
      };
      schedule();
    };
    const leave = () => {
      motion.current.pointer = { x: 0, y: 0 };
      schedule();
    };
    const preferenceChange = () => {
      motion.current.reduced = preference.matches;
      setReduced(preference.matches);
      setRunning(!preference.matches);
      motion.current.running = !preference.matches;
      schedule();
    };
    const visibility = () => {
      motion.current.hidden = document.hidden;
    };
    preferenceChange();
    measure();
    const observer = new ResizeObserver(measure);
    sections.forEach((el) => observer.observe(el));
    document.fonts.ready.then(measure);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("pointermove", pointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", visibility);
    preference.addEventListener("change", preferenceChange);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", pointer);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", visibility);
      preference.removeEventListener("change", preferenceChange);
    };
  }, []);
  function toggle() {
    const next = !running;
    motion.current.running = next;
    setRunning(next);
    window.dispatchEvent(new Event("scroll"));
  }
  return { motion, active, running, reduced, toggle };
}
