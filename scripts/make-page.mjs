#!/usr/bin/env node
// Inlines the shared engine (model + feeds) into artifact/index.template.html -> artifact/index.html.
// When artifact/data/ exists, the catalog is embedded in the page too: some browsers (Safari) refuse
// the page's requests for sibling files with 403, while the page itself always loads.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const strip = f => readFileSync(f, 'utf8').replace(/^import .*$/gm, '').replace(/^export /gm, '');
const engine = strip('scripts/lib/model.mjs') + '\n' + strip('scripts/lib/feeds.mjs') + '\n' +
  readFileSync('scripts/lib/csv.mjs', 'utf8').match(/export function toCsv[\s\S]*$/)[0].replace(/^export /, '');
let data = '';
if (existsSync('artifact/data/meta.json')) {
  const meta = readFileSync('artifact/data/meta.json', 'utf8').trim();
  const n = JSON.parse(meta).shards;
  const shards = Array.from({ length: n }, (_, i) => readFileSync(`artifact/data/catalog-${i}.json`, 'utf8').trim());
  const json = `{"meta":${meta},"shards":[${shards.join(',')}]}`
    .replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  data = `<script id="catalog-data" type="application/json">${json}</script>`;
}
const html = readFileSync('artifact/index.template.html', 'utf8')
  .replace('/*ENGINE*/', () => engine)
  .replace('<!--CATALOG-DATA-->', () => data);
writeFileSync('artifact/index.html', html);
console.error('artifact/index.html', html.length, 'bytes', data ? '(con catalogo incorporato)' : '(senza catalogo)');
