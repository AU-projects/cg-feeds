# Task 2: aggiorna i feed al link pubblico

Applica le automazioni all'ULTIMA copia del catalogo (branch `catalog`) e pubblica google.tsv e meta.csv.
NON scarica nulla da Common Ground (se ne occupa RUNBOOK-import.md).

App (artifact): https://claude.ai/artifact/4c3xE1jNR1PF7LyUY6EuPh
Feed pubblici: https://au-projects.github.io/cg-feeds/google.tsv  e  .../meta.csv

1. Repo: `git clone --depth 1 https://github.com/AU-projects/cg-feeds /home/user/cg-feeds` (se manca, prima `add_repo` owner AU-projects repo cg-feeds con access push). Lavora dentro /home/user/cg-feeds.
2. `scripts/fetch-snapshot.sh` (ripristina data/export.csv e data/snapshot.json). Se fallisce perche' il branch `catalog` non esiste, FERMATI e riferisci: va prima eseguito il task di importazione.
3. Leggi regole e impostazioni dal database dell'artifact con il tool `ArtifactData` (carica con ToolSearch se serve), url dell'artifact sopra:
   - `list` collection `rules` con `out_dir` -> converti in `data/rules.json`: array dei documenti, ognuno con `id` = nome del file, piu' `name`, `enabled`, `order`, `conditions`, `actions`, `kind`, `group` (i file possono avere i campi direttamente o dentro `data`).
   - `get` doc `settings/main` -> `data/settings.json` (se non esiste, scrivi `{}`).
4. `node scripts/build.mjs --only feeds` -> google.tsv, meta.csv, report.json, index.html nella radice del repo.
5. Se `report.json` mostra meno del 50% dei prodotti dell'ultima versione committata, FERMATI senza push e riferisci.
6. `git add google.tsv meta.csv report.json index.html && git commit -m "Aggiorna feed" && git push origin main`
7. Riporta: prodotti nei feed Google e Meta, regole applicate, ora del catalogo (catalogAt in report.json).

Note: i feed non contengono costi, fornitori ne' note private. Non committare `data/`.
