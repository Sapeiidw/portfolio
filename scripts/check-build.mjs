import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { gzipSync } from "node:zlib";

const html = await readFile("dist/index.html", "utf8");
assert.ok(
  html.includes("Sakti Pujo Edi") && html.includes("Navia ERP"),
  "Portfolio must be prerendered.",
);
assert.equal(
  (html.match(/<h1[ >]/g) || []).length,
  1,
  "Expected one primary heading.",
);
assert.ok(
  !html.includes("<!--app-html-->"),
  "Prerender token must be replaced.",
);
assert.ok(
  !/<link[^>]+modulepreload[^>]+(?:three|WorkspaceScene|RealmScene)/.test(html),
  "3D code must not be preloaded with the page.",
);
assert.ok(!/[—–]/.test(html), "Use plain punctuation in visible copy.");
assert.ok(
  html.includes("https://github.com/Sapeiidw"),
  "Expected real contact URL.",
);
for (const [, path] of html.matchAll(/(?:src|href)="(\/assets\/[^"\s]+)"/g))
  await stat(`dist${path}`);
const files = await readdir("dist/assets");
const entry = files.find((name) => /^index-.*\.js$/.test(name));
assert.ok(entry, "Missing JavaScript entry.");
const size = gzipSync(await readFile(`dist/assets/${entry}`)).length;
assert.ok(
  size < 110_000,
  `Initial JavaScript must stay below 110 kB gzip, got ${size}.`,
);
assert.ok(
  (await stat("dist/images/realm.webp")).size < 180_000,
  "Fallback image must stay lightweight.",
);
assert.ok(
  (html.match(/Fictional project \/ design exploration/g) || []).length >= 5,
  "Five clearly labelled concept scenes required.",
);
for (const id of [
  "navia",
  "orbit",
  "verdant",
  "forma",
  "tidal",
  "aether",
  "craft",
  "contact",
])
  assert.ok(html.includes(`id="${id}"`), `Missing journey stop: ${id}`);
console.log(
  `Build verified: prerendered HTML, local assets, valid profile link, entry ${(size / 1024).toFixed(1)} kB gzip.`,
);
