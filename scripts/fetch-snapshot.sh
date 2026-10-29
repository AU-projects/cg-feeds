#!/usr/bin/env bash
# Restores data/export.csv and data/snapshot.json from the "catalog" branch.
set -euo pipefail
mkdir -p data
git fetch -q --depth=1 origin catalog
git show FETCH_HEAD:catalog.csv.gz | gunzip > data/export.csv
git show FETCH_HEAD:snapshot.json > data/snapshot.json
echo "snapshot: $(cat data/snapshot.json)"
