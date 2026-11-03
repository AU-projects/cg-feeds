#!/usr/bin/env node
// Requests a "listings" CSV export from the Common Ground Admin API and downloads it.
// Usage: node scripts/cg-export.mjs data/export.csv
// The Authorization header is built from CG_API_KEY (the environment's network secret
// is applied by the proxy, so the variable may be empty inside the sandbox).
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const ENDPOINT = 'https://api-admin.common-ground.io/graphql';
const out = process.argv[2] || 'data/export.csv';

// Columns we never keep: cost, supplier and the collaborator who created the listing.
const DROP = new Set(['listing_cost', 'listing_supplier', 'listing_created_by']);

function dropColumns(text) {
  const rows = [];
  let row = [], f = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; }
      else f += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(f); f = ''; rows.push(row); row = [];
    } else f += c;
  }
  if (f !== '' || row.length) { row.push(f); rows.push(row); }
  const keep = rows[0].map((h, i) => DROP.has(h) ? -1 : i).filter(i => i >= 0);
  const enc = v => /[",\r\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
  return rows.map(r => keep.map(i => enc(r[i] ?? '')).join(',')).join('\n') + '\n';
}

function gql(query) {
  const body = execFileSync('curl', ['-sS', '--max-time', '60', ENDPOINT,
    '-H', 'Content-Type: application/json',
    '-H', `Authorization: Bearer ${process.env.CG_API_KEY || ''}`,
    '-d', JSON.stringify({ query })], { encoding: 'utf8', maxBuffer: 1 << 26 });
  const j = JSON.parse(body);
  if (j.errors) throw new Error(JSON.stringify(j.errors));
  return j.data;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

const job = gql('mutation { itemInventoryExport(exportType: listings, filtersV2: {}) { _id status } }').itemInventoryExport;
console.error('export job', job._id);

let status = job.status;
for (let i = 0; i < 90 && status !== 'complete'; i++) {
  await sleep(10000);
  const jobs = gql('{ jobs(page: 1, taskName: "inventory:listings:csv") { jobs { _id status } } }').jobs.jobs;
  status = (jobs.find(j => j._id === job._id) || {}).status;
  console.error('status', status);
  if (status === 'failed') throw new Error('export job failed');
}
if (status !== 'complete') throw new Error('export job timed out');

const url = gql(`{ jobDownloadUrl(jobRef: "${job._id}") }`).jobDownloadUrl;
const raw = execFileSync('curl', ['-sS', '--max-time', '300', url], { maxBuffer: 1 << 29 });
const csv = Buffer.from(dropColumns(raw.toString('utf8')));
writeFileSync(out, csv);
writeFileSync(dirname(out) + '/snapshot.json', JSON.stringify({ at: new Date().toISOString() }) + '\n');
console.error('saved', out, csv.length, 'bytes');
