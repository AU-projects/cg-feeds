# Aggiornamento feed Common Ground (Kagoshima)

Obiettivo: scaricare il catalogo da Common Ground, applicare le regole salvate nell'app,
rigenerare i feed Google/Meta su GitHub Pages e aggiornare i dati dell'app (artifact).

Artifact (app): https://claude.ai/artifact/4c3xE1jNR1PF7LyUY6EuPh
Feed pubblici: https://au-projects.github.io/cg-feeds/google.tsv  e  .../meta.csv

## Passi

1. Repo: `git clone https://github.com/AU-projects/cg-feeds` (se manca, prima `add_repo` owner AU-projects repo cg-feeds con access push).
2. `mkdir -p data && node scripts/cg-export.mjs data/export.csv`
   (lancia l'export dei listing, attende il job, scarica il CSV. Il token Common Ground e' applicato dal proxy.)
3. Leggi regole e impostazioni dal database dell'artifact con il tool `ArtifactData`
   (url dell'artifact sopra):
   - `list` collection `rules` -> scrivi l'array dei documenti (ognuno con `id`, `name`, `enabled`, `order`, `conditions`, `actions`) in `data/rules.json`
   - `get` doc `settings/main` -> `data/settings.json` (se non esiste, `{}`)
4. `node scripts/build.mjs` -> `google.tsv`, `meta.csv`, `report.json`, `index.html` (nella radice del repo, serviti da GitHub Pages) e `artifact/data/*.json`
5. `node scripts/make-page.mjs` (rigenera `artifact/index.html`)
6. Pubblica i dati dell'app: tool `Artifact` con `url` dell'artifact, `file_path` = `artifact/index.html`,
   `files` = `data/meta.json`, `data/catalog-0.json`, `data/catalog-1.json`, `data/catalog-2.json` (da `artifact/data/`),
   `capabilities` = `{"db": {}, "downloads": true}`. Il numero di shard e' in `artifact/data/meta.json`.
7. `git add google.tsv meta.csv report.json index.html scripts artifact/index.template.html artifact/index.html RUNBOOK.md && git commit -m "Aggiorna feed" && git push origin main`
   (se non c'e' nulla da committare, va bene).
8. Verifica: `curl -sI https://au-projects.github.io/cg-feeds/google.tsv` deve dare 200.

## Note
- Limite API: 30 richieste/minuto. L'export CSV usa poche richieste.
- Non committare mai `data/` (contiene costi e note private).
- I feed non contengono costi, fornitori ne' note private.
