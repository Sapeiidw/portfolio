import { CanvasTexture, SRGBColorSpace } from 'three';
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
      const left = project ? 480 : 450, width = 1536 - left;
      const scale = Math.max(width / img.naturalWidth, 864 / img.naturalHeight);
      ctx.save(); ctx.beginPath(); ctx.rect(left, 0, width, 864); ctx.clip();
      if (!project) ctx.filter = 'saturate(0.3) brightness(0.72)';
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
      ctx.fillStyle = '#b9baa9'; ctx.font = '16px sans-serif'; ctx.fillText('SAKTI PUJO EDI', 48, 80);
      ctx.fillStyle = '#ece3d3'; ctx.font = '55px Georgia';
      ['Ideas.', 'Code.', 'Things that work.'].forEach((line, i) => ctx.fillText(line, 48, 246 + i * 64));
      ctx.fillStyle = '#b9baa9'; ctx.font = '23px Georgia';
      ['Thoughtful interfaces.', 'Practical systems.', 'Made with curiosity.'].forEach((line, i) => ctx.fillText(line, 48, 505 + i * 35));
      ctx.strokeStyle = '#7b7e6b'; ctx.strokeRect(48, 670, 246, 66);
      ctx.fillStyle = '#ece3d3'; ctx.font = '23px Georgia'; ctx.fillText('Explore the work  →', 68, 712);
      ctx.font = '17px sans-serif'; ctx.fillText('01', 1440, 80);
    }
    texture.needsUpdate = true; invalidate();
  };
  draw(); img.onload = draw; img.onerror = () => invalidate(); img.src = project?.image ?? '/images/orbit.webp';
  return { texture, dispose: () => { img.onload = null; img.onerror = null; texture.dispose(); } };
}
export function makeBookTexture(title: string, color: string) {
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 96;
  const ctx = canvas.getContext('2d')!; ctx.fillStyle = color; ctx.fillRect(0, 0, 512, 96);
  ctx.font = '34px Georgia'; ctx.fillStyle = '#d9c3a0'; ctx.fillText(title, 22, 60);
  ctx.fillStyle = '#9b8669'; ctx.fillRect(470, 23, 1, 49);
  return canvasTexture(canvas);
}
