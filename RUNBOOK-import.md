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
   (genera `artifact/index.html` con il catalogo INCORPORATO nella pagina, circa 12 MB: Safari rifiuta con 403 i file dati separati).
6. Pubblica l'app: tool `Artifact` con `url` dell'artifact e `file_path` = `artifact/index.html`.
   NON passare `files` e NON passare `capabilities` (restano quelle gia' impostate). Il limite della pagina e' 16 MB: se `artifact/index.html` supera 15 MB, FERMATI e riferisci.
7. Se `scripts/`, `artifact/index.template.html` o i RUNBOOK sono cambiati: `git add scripts artifact/index.template.html RUNBOOK*.md && git commit && git push origin main`.
   `artifact/index.html` e `artifact/data/` sono generati e ignorati da git: non committarli.
8. Riporta: righe importate e ora della copia (data/snapshot.json).

Note: limite API 30 richieste/minuto. Non committare `data/`.
