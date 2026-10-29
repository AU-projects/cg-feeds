#!/usr/bin/env node
// Inlines the shared engine (model + feeds) into artifact/index.template.html -> artifact/index.html
import { readFileSync, writeFileSync } from 'node:fs';
const strip = f => readFileSync(f, 'utf8').replace(/^import .*$/gm, '').replace(/^export /gm, '');
const engine = strip('scripts/lib/model.mjs') + '\n' + strip('scripts/lib/feeds.mjs') + '\n' +
  readFileSync('scripts/lib/csv.mjs', 'utf8').match(/export function toCsv[\s\S]*$/)[0].replace(/^export /, '');
const html = readFileSync('artifact/index.template.html', 'utf8').replace('/*ENGINE*/', () => engine);
writeFileSync('artifact/index.html', html);
console.error('artifact/index.html', html.length, 'bytes');
