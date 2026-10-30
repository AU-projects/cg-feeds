# Task 1: importa il catalogo da Common Ground

Scarica il catalogo e aggiorna i dati dell'app (la tabella). NON tocca i feed pubblici (se ne occupa RUNBOOK-feed.md).
NON salvare il catalogo su GitHub: il repo e' pubblico e l'export contiene costi, fornitori, note private e nomi dei collaboratori.

App (artifact): https://claude.ai/artifact/4c3xE1jNR1PF7LyUY6EuPh

1. Repo: `git -C /home/user/cg-feeds pull origin main` se la cartella esiste, altrimenti `git clone --depth 1 https://github.com/AU-projects/cg-feeds /home/user/cg-feeds`. Lavora dentro /home/user/cg-feeds.
2. `mkdir -p data && node scripts/cg-export.mjs data/export.csv`
   (lancia l'export dei listing, attende il job, scarica il CSV. Il token Common Ground e' applicato dal proxy.)
3. Controlla che il CSV abbia almeno 1000 righe. Se no, FERMATI senza pubblicare nulla e riferisci l'errore.
4. `node scripts/build.mjs --only artifact` e poi `node scripts/make-page.mjs`
   (genera `artifact/index.html` con il catalogo INCORPORATO nella pagina, circa 14 MB: Safari rifiuta con 403 i file dati separati).
5. Pubblica l'app: tool `Artifact` con `url` dell'artifact e `file_path` = `artifact/index.html`.
   NON passare `files` e NON passare `capabilities` (restano quelle gia' impostate). Il limite della pagina e' 16 MB: se `artifact/index.html` supera 15 MB, FERMATI e riferisci.
6. Se `scripts/`, `artifact/index.template.html` o i RUNBOOK sono cambiati: `git add scripts artifact/index.template.html RUNBOOK*.md && git commit && git push origin main`.
   `artifact/index.html`, `artifact/data/` e `data/` sono generati e ignorati da git: non committarli.
7. Riporta: righe importate e ora del download (data/snapshot.json).

Note: limite API 30 richieste/minuto.
