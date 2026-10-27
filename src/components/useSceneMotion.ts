import { useEffect, useState } from 'react';
const eventName = 'portfolio-motion-change';

/** Keep both 3D views in sync, including OS preference changes and storage events. */
export function useSceneMotion() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = matchMedia('(max-width: 767px)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let stored: string | null = null;
    try { stored = localStorage.getItem('portfolio-motion'); } catch { /* Optional storage. */ }
    const auto = setTimeout(() => setEnabled(!reduced.matches && (stored === 'on' || (!mobile.matches && !connection?.saveData && stored !== 'off'))), 500);
    const change = (event: Event) => { clearTimeout(auto); setEnabled(Boolean((event as CustomEvent<boolean>).detail)); };
    const preference = () => { if (reduced.matches) { clearTimeout(auto); setEnabled(false); } };
    const storage = (event: StorageEvent) => { if (event.key === 'portfolio-motion') { clearTimeout(auto); setEnabled(event.newValue === 'on' && !reduced.matches); } };
    window.addEventListener(eventName, change); window.addEventListener('storage', storage);
    reduced.addEventListener('change', preference);
    return () => { clearTimeout(auto); window.removeEventListener(eventName, change); window.removeEventListener('storage', storage); reduced.removeEventListener('change', preference); };
  }, []);
  function toggle() {
    const next = !enabled;
    try { localStorage.setItem('portfolio-motion', next ? 'on' : 'off'); } catch { /* Optional storage. */ }
    window.dispatchEvent(new CustomEvent(eventName, { detail: next }));
  }
  return { enabled, toggle };
}
