/**
 * Aggiorna questo foglio con il CSV del feed supplementare, letto da un repository GitHub privato.
 * Il token GitHub (sola lettura) sta nelle proprietà dello script, non nel codice:
 * Impostazioni progetto → Proprietà dello script → GITHUB_TOKEN.
 *
 * Uso: incolla questo file in Estensioni → Apps Script, imposta REPO qui sotto, salva,
 * esegui una volta «creaTriggerGiornaliero» e autorizza, poi prova «aggiornaFoglio».
 */
const CONFIG = {
  repo: 'AU-projects/NOME-DEL-REPO',  // da cambiare
  path: 'supplemental.csv',
  branch: 'main',
  sheetName: 'supplemental',
  minRows: 100,                       // sotto questo numero di righe il foglio NON viene toccato
};

function aggiornaFoglio() {
  const token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  if (!token) throw new Error('Manca la proprietà GITHUB_TOKEN');

  const url = 'https://api.github.com/repos/' + CONFIG.repo + '/contents/' + CONFIG.path + '?ref=' + CONFIG.branch;
  const res = UrlFetchApp.fetch(url, {
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/vnd.github.raw+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() !== 200) {
    throw new Error('GitHub ha risposto ' + res.getResponseCode() + ': ' + res.getContentText().slice(0, 200));
  }

  const parsed = Utilities.parseCsv(res.getContentText());
  const cols = parsed[0].length;
  const rows = parsed.filter(r => r.length === cols);  // scarta eventuali righe vuote finali
  if (rows.length < CONFIG.minRows || rows[0][0] !== 'id') {
    throw new Error('File non valido (' + rows.length + ' righe, prima cella «' + rows[0][0] + '»): foglio non modificato');
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.sheetName) || ss.insertSheet(CONFIG.sheetName);
  sheet.clearContents();
  // Formato testo prima di scrivere: altrimenti «2026-11» diventa una data.
  sheet.getRange(1, 1, rows.length, cols).setNumberFormat('@').setValues(rows);
  PropertiesService.getScriptProperties().setProperty('ULTIMO_AGGIORNAMENTO', new Date().toISOString() + ' · ' + (rows.length - 1) + ' righe');
}

/** Si esegue una volta sola: crea l'aggiornamento giornaliero (tra le 7 e le 8, ora del progetto). */
function creaTriggerGiornaliero() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'aggiornaFoglio').forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('aggiornaFoglio').timeBased().everyDays(1).atHour(7).create();
}
