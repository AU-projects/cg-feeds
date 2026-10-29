#!/usr/bin/env node
// Builds the Google and Meta feeds plus the catalog shards for the app.
// Usage: node scripts/build.mjs [--csv data/export.csv] [--rules data/rules.json] [--settings data/settings.json]
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { parseCsv, toCsv } from './lib/csv.mjs';
import { COLUMNS, normalize, applyRules, sortRules } from './lib/model.mjs';
import { DEFAULT_SETTINGS, feedRow, GOOGLE_COLS, META_COLS, toTsv } from './lib/feeds.mjs';

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const csvPath = arg('csv', 'data/export.csv');
const readJson = (p, d) => existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : d;
const rules = sortRules(readJson(arg('rules', 'data/rules.json'), []));
const settings = { ...DEFAULT_SETTINGS, ...readJson(arg('settings', 'data/settings.json'), {}) };

const recs = parseCsv(readFileSync(csvPath, 'utf8')).filter(r => r.listing_id).map(normalize);
console.error(recs.length, 'listings,', rules.length, 'rules');

const google = [], meta = [];
for (const r of recs) {
  const o = applyRules(r, rules);
  const g = feedRow(r, o, settings, 'google'); if (g) google.push(g);
  const m = feedRow(r, o, settings, 'meta'); if (m) meta.push(m);
}

mkdirSync('feeds', { recursive: true });
writeFileSync('feeds/google.tsv', toTsv(GOOGLE_COLS, google));
writeFileSync('feeds/meta.csv', toCsv(META_COLS, meta));
const generated = new Date().toISOString();
writeFileSync('feeds/report.json', JSON.stringify({ generated, listings: recs.length, google: google.length, meta: meta.length, rules: rules.length }, null, 1));
writeFileSync('feeds/index.html', `<!doctype html><meta charset="utf-8"><title>Feed catalogo</title><body style="font:16px system-ui;margin:2rem">
<h1>Feed catalogo</h1><p>Aggiornati: ${generated}</p>
<ul><li><a href="google.tsv">google.tsv</a> (${google.length} prodotti)</li><li><a href="meta.csv">meta.csv</a> (${meta.length} prodotti)</li></ul></body>`);

// Catalog shards for the app: columnar JSON, no feed-only fields.
// Feed-only fields reduced to what the page needs to decide eligibility and preview rows.
const keys = [...COLUMNS.map(c => c.key), 'has_media', '_mediaFull', '_sleeveFull', '_available'];
for (const r of recs) { r.has_media = r._link && r._image ? 1 : 0; if (!r.pre_order) r._available = ''; }
const SHARD = 12000;
mkdirSync('artifact/data', { recursive: true });
const shards = Math.ceil(recs.length / SHARD);
for (let i = 0; i < shards; i++) {
  const rows = recs.slice(i * SHARD, (i + 1) * SHARD).map(r => keys.map(k => r[k]));
  writeFileSync(`artifact/data/catalog-${i}.json`, JSON.stringify({ cols: keys, rows }));
}
writeFileSync('artifact/data/meta.json', JSON.stringify({ generated, count: recs.length, shards }));
console.error('google', google.length, 'meta', meta.length, 'shards', shards);
