#!/usr/bin/env bash
# Saves the downloaded catalog as a one-commit branch "catalog" (force-pushed, no history),
# so the feed job can use it later. Usage: scripts/snapshot.sh [data/export.csv]
set -euo pipefail
f=${1:-data/export.csv}
gzip -9 -c "$f" > data/catalog.csv.gz
printf '{"at":"%s"}\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > data/snapshot.json
b1=$(git hash-object -w data/catalog.csv.gz)
b2=$(git hash-object -w data/snapshot.json)
tree=$(printf '100644 blob %s\tcatalog.csv.gz\n100644 blob %s\tsnapshot.json\n' "$b1" "$b2" | git mktree)
c=$(git -c user.name=Claude -c user.email=noreply@anthropic.com commit-tree "$tree" -m "Catalog snapshot")
git push -q --force origin "$c:refs/heads/catalog"
echo "snapshot pushed: $(du -h data/catalog.csv.gz | cut -f1)"
