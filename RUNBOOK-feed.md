# Task 2: aggiorna i feed al link pubblico

Scarica il catalogo da Common Ground, applica le automazioni salvate nell'app e pubblica google.tsv e meta.csv.
NON salvare il catalogo scaricato su GitHub: il repo e' pubblico e l'export contiene costi, fornitori, note private e nomi dei collaboratori.
Nel repo vanno SOLO i quattro file dei feed: google.tsv, meta.csv, report.json, index.html.

App (artifact): https://claude.ai/artifact/4c3xE1jNR1PF7LyUY6EuPh
Feed pubblici: https://au-projects.github.io/cg-feeds/google.tsv  e  .../meta.csv

1. Repo: `git -C /home/user/cg-feeds pull origin main` se la cartella esiste, altrimenti `git clone --depth 1 https://github.com/AU-projects/cg-feeds /home/user/cg-feeds`. Lavora dentro /home/user/cg-feeds.
2. `mkdir -p data && node scripts/cg-export.mjs data/export.csv` (scarica il catalogo aggiornato; il token e' applicato dal proxy).
   Se il CSV ha meno di 1000 righe o il download fallisce, FERMATI senza fare push e riferisci l'errore: il feed pubblicato resta quello precedente.
3. Leggi regole e impostazioni dal database dell'artifact con il tool `ArtifactData` (carica con ToolSearch se serve), url dell'artifact sopra:
   - `list` collection `rules` con `out_dir` -> converti in `data/rules.json`: array dei documenti, ognuno con `id` = nome del file, piu' `name`, `enabled`, `order`, `conditions`, `actions`, `kind`, `group` (i file possono avere i campi direttamente o dentro `data`).
   - `get` doc `settings/main` -> `data/settings.json` (se non esiste, scrivi `{}`).
4. `node scripts/build.mjs --only feeds` -> google.tsv, meta.csv, report.json, index.html nella radice del repo.
5. Se `report.json` mostra meno del 50% dei prodotti dell'ultima versione committata, FERMATI senza push e riferisci.
6. `git add google.tsv meta.csv report.json index.html && git commit -m "Aggiorna feed" && git push origin main`
7. Riporta: prodotti nei feed Google e Meta, regole applicate, ora del catalogo scaricato (catalogAt in report.json).

Note: limite API 30 richieste/minuto. `data/` e' ignorato da git: non committarlo.
