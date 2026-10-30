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
const csv = execFileSync('curl', ['-sS', '--max-time', '300', url], { maxBuffer: 1 << 29 });
writeFileSync(out, csv);
writeFileSync(dirname(out) + '/snapshot.json', JSON.stringify({ at: new Date().toISOString() }) + '\n');
console.error('saved', out, csv.length, 'bytes');
