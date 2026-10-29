# Task 1: importa il catalogo da Common Ground

Scarica il catalogo, ne salva una copia sul branch `catalog` e aggiorna i dati dell'app.
NON tocca i feed pubblici (se ne occupa RUNBOOK-feed.md).

App (artifact): https://claude.ai/artifact/4c3xE1jNR1PF7LyUY6EuPh

1. Repo: `git clone --depth 1 https://github.com/AU-projects/cg-feeds /home/user/cg-feeds` (se manca, prima `add_repo` owner AU-projects repo cg-feeds con access push). Lavora dentro /home/user/cg-feeds.
2. `mkdir -p data && node scripts/cg-export.mjs data/export.csv`
   (lancia l'export dei listing, attende il job, scarica il CSV. Il token Common Ground e' applicato dal proxy.)
3. Controlla che il CSV abbia almeno 1000 righe. Se no, FERMATI senza pubblicare nulla e riferisci l'errore.
4. `scripts/snapshot.sh data/export.csv` (salva la copia sul branch `catalog`, push forzato, senza storia).
5. `node scripts/build.mjs --only artifact` e poi `node scripts/make-page.mjs`
6. Pubblica l'app: tool `Artifact` con `url` dell'artifact, `file_path` = `artifact/index.html`,
   `files` = `data/meta.json`, `data/catalog-0.json`, `data/catalog-1.json`, `data/catalog-2.json` (sorgenti in `artifact/data/`; il numero di shard e' in `artifact/data/meta.json`).
   Non passare `capabilities` (restano quelle gia' impostate).
7. Se `artifact/index.html` o `scripts/` sono cambiati rispetto a git: `git add scripts artifact/index.template.html artifact/index.html && git commit && git push origin main`.
8. Riporta: righe importate e ora della copia (data/snapshot.json).

Note: limite API 30 richieste/minuto. Non committare `data/`.
