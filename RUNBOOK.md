# Feed Common Ground (Kagoshima)

Due task separati, con orari scelti nella scheda Feed dell'app:

- RUNBOOK-import.md: importa il catalogo da Common Ground e aggiorna l'app.
- RUNBOOK-feed.md: scarica il catalogo, applica le automazioni e pubblica i feed.

App: https://claude.ai/artifact/4c3xE1jNR1PF7LyUY6EuPh
Feed: https://au-projects.github.io/cg-feeds/google.tsv  e  .../meta.csv

## Dove girano i task
I due task pianificati (importa catalogo 03:17, aggiorna feed 05:17, ora italiana) sono legati alla sessione
«Kagoshima: importazione catalogo e feed (sessione dei task)», creata con il repo AU-projects/cg-feeds collegato.
Le sessioni nuove dei task NON hanno il permesso di scrivere su GitHub (push negato con 403): per questo i task usano questa sessione.

Se la sessione viene archiviata o eliminata i task smettono di funzionare. Per ripristinarli:
1. Crea una nuova sessione con il repo AU-projects/cg-feeds collegato (accesso in scrittura).
2. Ricrea i due task pianificati legati a quella sessione (persistent_session_id), con i prompt che richiamano RUNBOOK-import.md e RUNBOOK-feed.md.
3. Aggiorna gli identificativi dei task in `artifact/index.template.html` (costante JOBS) e ripubblica l'app.

## Orari mostrati nell'app
La scheda Feed → Pianificazione mostra gli orari leggendoli dal documento `settings/schedule` del database dell'artifact
(`{"import": {"cron": ...}, "feed": {"cron": ...}, "updatedAt": ...}`). La pagina non puo' leggere i task direttamente (connettore bloccato dall'organizzazione).
Ogni volta che si cambia l'orario di un task con `update_trigger`, aggiorna anche quel documento con ArtifactData (action `update`, collection `settings`, doc `schedule`), usando la stessa espressione cron e `updatedAt` = ora attuale.

## Dati riservati
Il repo e' pubblico. Non committare mai il catalogo scaricato (costi, fornitori, note private, nomi dei collaboratori): nessun ramo e nessun file con l'export completo.
