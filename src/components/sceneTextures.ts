import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';
import type { PortfolioProject } from '../data/site';

export function seededRandom(seed: number) {
  return () => { seed = (Math.imul(1664525, seed) + 1013904223) | 0; return (seed >>> 0) / 4294967296; };
}
const canvasTexture = (canvas: HTMLCanvasElement) => {
  const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace; texture.anisotropy = 8; return texture;
};
export function makeScreenTexture(project: PortfolioProject | null, invalidate: () => void) {
  const canvas = document.createElement('canvas'); canvas.width = 1536; canvas.height = 864;
  const ctx = canvas.getContext('2d')!;
  const texture = canvasTexture(canvas);
  const img = new Image();
  const draw = () => {
    ctx.fillStyle = '#1c1f20'; ctx.fillRect(0, 0, 1536, 864);
    if (img.complete && img.naturalWidth) {
      const left = project ? 480 : 0, width = 1536 - left;
      const scale = Math.max(width / img.naturalWidth, 864 / img.naturalHeight);
      ctx.save(); ctx.beginPath(); ctx.rect(left, 0, width, 864); ctx.clip();
      if (!project) ctx.filter = 'saturate(0.15) brightness(0.65)';
      ctx.drawImage(img, left + (width - img.naturalWidth * scale) / 2, (864 - img.naturalHeight * scale) / 2, img.naturalWidth * scale, img.naturalHeight * scale); ctx.restore();
    }
    if (project) {
      ctx.fillStyle = '#cec7b9'; ctx.font = '18px sans-serif'; ctx.fillText(`${project.number} / ${project.demo ? 'CONCEPT STUDY' : 'CURRENT PROJECT'}`, 48, 84);
      ctx.fillStyle = '#f1e9db'; ctx.font = '56px Georgia'; ctx.fillText(project.title, 48, 214);
      ctx.fillStyle = '#b9b6ad'; ctx.font = '24px Georgia';
      project.screenLines.forEach((line, i) => ctx.fillText(line, 48, 280 + i * 38));
      ctx.strokeStyle = '#8b8b80'; ctx.beginPath(); ctx.moveTo(48, 685); ctx.lineTo(400, 685); ctx.stroke();
      ctx.font = '22px Georgia'; ctx.fillStyle = '#ece3d3'; ctx.fillText('Design. Build. Explore.', 48, 734);
    } else {
      ctx.fillStyle = '#ece3d3'; ctx.font = '21px Georgia'; ['Design', 'Code', 'Ideas', 'Build'].forEach((word, i) => ctx.fillText(word, 70, 140 + i * 36));
      ctx.font = '17px sans-serif'; ctx.fillText('01', 1440, 80);
    }
    texture.needsUpdate = true; invalidate();
  };
  draw(); img.onload = draw; img.onerror = () => invalidate(); img.src = project?.image ?? '/images/orbit.webp';
  return { texture, dispose: () => { img.onload = null; img.onerror = null; texture.dispose(); } };
}
export function makeWoodTexture() {
  const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 512;
  const ctx = canvas.getContext('2d')!; const rand = seededRandom(72);
  ctx.fillStyle = '#94734e'; ctx.fillRect(0, 0, 1024, 512);
  for (let i = 0; i < 2700; i++) {
    const y = rand() * 512, phase = rand() * 8;
    ctx.strokeStyle = i % 3 === 0 ? `rgba(229,193,137,${rand() * .32})` : `rgba(36,24,14,${rand() * .35})`;
    ctx.lineWidth = .25 + rand() * 1.6; ctx.beginPath();
    for (let x = 0; x <= 1024; x += 8) {
      const knot = Math.exp(-((x - 680) ** 2) / 16000) * Math.sin(y / 25) * 12;
      ctx.lineTo(x, y + Math.sin(x / 100 + phase) * 2.5 + knot);
    }
    ctx.stroke();
  }
  for (let i = 1; i < 4; i++) { ctx.fillStyle = 'rgba(32,23,15,.28)'; ctx.fillRect(0, i * 128, 1024, 1.2); }
  return canvasTexture(canvas);
}
export function makeRockTexture() {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d')!, rand = seededRandom(313);
  const pixels = ctx.createImageData(256, 256);
  for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
    const n = 52 + rand() * 45 + Math.sin(x * .18 + Math.sin(y * .1) * 5) * 12;
    const i = (y * 256 + x) * 4;
    pixels.data[i] = n * 1.1; pixels.data[i + 1] = n; pixels.data[i + 2] = n * .82; pixels.data[i + 3] = 255;
  }
  ctx.putImageData(pixels, 0, 0);
  const texture = canvasTexture(canvas); texture.wrapS = texture.wrapT = RepeatWrapping; texture.repeat.set(3, 2); return texture;
}
export function makeBookTexture(title: string, color: string) {
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 96;
  const ctx = canvas.getContext('2d')!; ctx.fillStyle = color; ctx.fillRect(0, 0, 512, 96);
  ctx.font = '34px Georgia'; ctx.fillStyle = '#d9c3a0'; ctx.fillText(title, 22, 60);
  ctx.fillStyle = '#9b8669'; ctx.fillRect(470, 23, 1, 49);
  return canvasTexture(canvas);
}
