import { createServer } from 'vite';
import { readFile, writeFile } from 'node:fs/promises';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { render } = await server.ssrLoadModule('/src/entry-server.tsx');
  const { html, site } = render();
  let document = await readFile('dist/index.html', 'utf8');
  document = document.replace('<!--app-html-->', html);
  const person = { '@context': 'https://schema.org', '@type': 'Person', name: site.name, jobTitle: site.role, sameAs: [site.github], ...(site.url ? { url: site.url } : {}) };
  const metadata = `<script type="application/ld+json">${JSON.stringify(person).replace(/</g, '\\u003c')}</script>`;
  const canonical = site.url ? `<link rel="canonical" href="${new URL(site.url).href}" /><meta property="og:url" content="${new URL(site.url).href}" />` : '';
  document = document.replace('<!--site-meta-->', metadata + canonical);
  if (site.url) document = document.replace('content="/images/workspace.webp"', `content="${new URL('/images/workspace.webp', site.url).href}"`);
  await writeFile('dist/index.html', document);
  await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n${site.url ? `Sitemap: ${new URL('/sitemap.xml', site.url).href}\n` : ''}`);
  if (site.url) await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${new URL(site.url).href}</loc></url></urlset>`);
  console.log('Prerendered portfolio HTML. Content is available without JavaScript.');
} finally {
  await server.close();
}
