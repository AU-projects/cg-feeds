#!/usr/bin/env node
// Builds the supplemental feed: one row per product with its custom labels, nothing else.
// Same logic as the "Feed supplementare" panel of the app (suppData in artifact/index.template.html).
// Usage: node scripts/supplemental.mjs [out.csv] [--csv data/export.csv] [--rules data/rules.json] [--settings data/settings.json]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { parseCsv, toCsv } from './lib/csv.mjs';
import { normalize, applyRules, sortRules, CUSTOM_LABELS } from './lib/model.mjs';
import { DEFAULT_SETTINGS, pickRep } from './lib/feeds.mjs';

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const out = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'data/supplemental.csv';
const readJson = (p, d) => existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : d;
const rules = sortRules(readJson(arg('rules', 'data/rules.json'), [])).filter(r => r.enabled !== false);
const st = { ...DEFAULT_SETTINGS, ...readJson(arg('settings', 'data/settings.json'), {}) };

const recs = parseCsv(readFileSync(arg('csv', 'data/export.csv'), 'utf8')).filter(r => r.listing_id).map(normalize);
const groups = new Map();
for (const r of recs) {
  if (r.status !== 'published' && !(st.includePrivate && r.status === 'private')) continue;
  if (!st.includeOutOfStock && !(r.stock > 0)) continue;
  const o = rules.length ? applyRules(r, rules) : {};
  const k = st.feedIdMode === 'listing' ? r.id : (r.item_id || r.id);
  (groups.get(k) || groups.set(k, []).get(k)).push({ r, o });
}
const rows = [];
for (const [id, list] of groups) {
  const best = list.length > 1 ? pickRep(list) : list[0];
  const row = { id };
  let any = false;
  for (const k of CUSTOM_LABELS) { row[k] = String(best.o[k] || '').trim().slice(0, 100); if (row[k]) any = true; }
  if (any) rows.push(row);
}
const cols = ['id', ...CUSTOM_LABELS.filter(k => rows.some(r => r[k]))];
writeFileSync(out, toCsv(cols, rows));
console.error('supplemental', rows.length, 'rows of', groups.size, 'products,', cols.slice(1).join(', ') || 'no labels', '->', out);
