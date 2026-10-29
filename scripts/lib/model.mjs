// Shared by the build script (Node) and the artifact page (inlined at build time).
// No imports, no Node APIs.

export const CUSTOM_LABELS = ['custom_label_0', 'custom_label_1', 'custom_label_2', 'custom_label_3', 'custom_label_4'];

// Columns shown in the app. type: text | num | bool | date. enum: dropdown filter.
export const COLUMNS = [
  { key: 'title', label: 'Titolo', type: 'text', w: 260 },
  { key: 'artist', label: 'Artista', type: 'text', w: 200 },
  { key: 'label', label: 'Etichetta', type: 'text', w: 160 },
  { key: 'catno', label: 'Cat. n.', type: 'text', w: 110 },
  { key: 'year', label: 'Anno', type: 'num', w: 70 },
  { key: 'country', label: 'Paese', type: 'text', enum: true, w: 100 },
  { key: 'genre', label: 'Genere', type: 'text', enum: true, w: 120 },
  { key: 'styles', label: 'Stili', type: 'text', w: 180 },
  { key: 'format', label: 'Formato', type: 'text', w: 190 },
  { key: 'type', label: 'Tipo', type: 'text', enum: true, w: 100 },
  { key: 'media', label: 'Disco', type: 'text', enum: true, w: 70 },
  { key: 'sleeve', label: 'Copertina', type: 'text', enum: true, w: 90 },
  { key: 'price', label: 'Prezzo', type: 'num', w: 80 },
  { key: 'compare', label: 'Prezzo barrato', type: 'num', w: 110 },
  { key: 'cost', label: 'Costo', type: 'num', w: 70 },
  { key: 'stock', label: 'Giacenza', type: 'num', w: 85 },
  { key: 'status', label: 'Stato', type: 'text', enum: true, w: 90 },
  { key: 'second_hand', label: 'Usato', type: 'bool', w: 70 },
  { key: 'pre_order', label: 'Preordine', type: 'bool', w: 85 },
  { key: 'supplier', label: 'Fornitore', type: 'text', enum: true, w: 150 },
  { key: 'location', label: 'Ubicazione', type: 'text', w: 130 },
  { key: 'categories', label: 'Categorie', type: 'text', w: 120 },
  { key: 'gtin', label: 'GTIN', type: 'text', w: 130 },
  { key: 'sku', label: 'SKU', type: 'text', w: 90 },
  { key: 'weight', label: 'Peso (g)', type: 'num', w: 80 },
  { key: 'published', label: 'Pubblicato', type: 'date', w: 100 },
  { key: 'comments', label: 'Note pubbliche', type: 'text', w: 200 },
  { key: 'private_notes', label: 'Note private', type: 'text', w: 140 },
  { key: 'product_type', label: 'Tipo prodotto', type: 'text', enum: true, w: 110 },
  { key: 'manufacturer', label: 'Produttore', type: 'text', w: 130 },
  { key: 'discogs_id', label: 'Discogs ID', type: 'text', w: 100 },
  { key: 'item_id', label: 'Item ID', type: 'text', w: 90 },
  { key: 'id', label: 'Listing ID', type: 'text', w: 150 },
];

// Fields a rule action can write. Shown in the "Modifica in blocco" panel.
export const ACTION_FIELDS = [
  ...CUSTOM_LABELS.map(k => ({ key: k, label: 'Custom label ' + k.slice(-1), hint: 'Valore singolo. Puoi usare {genre}, {year}, {label}…' })),
  { key: 'tags', label: 'Tag interno', hint: 'Si aggiunge ai tag esistenti. Serve per raggruppare e filtrare.', append: true },
  { key: 'brand', label: 'Brand', hint: 'Di default è l’etichetta discografica.' },
  { key: 'product_type_feed', label: 'Product type', hint: 'Percorso, es. Vinili > Jazz.' },
  { key: 'google_category', label: 'Google product category', hint: 'Testo o ID della tassonomia Google.' },
  { key: 'condition_feed', label: 'Condizione nel feed', hint: 'new, used o refurbished.' },
  { key: 'title_feed', label: 'Titolo nel feed', hint: 'Sostituisce il titolo generato. Accetta {campi}.' },
  { key: 'description_feed', label: 'Descrizione nel feed', hint: 'Sostituisce la descrizione generata. Accetta {campi}.' },
  { key: 'price_feed', label: 'Prezzo nel feed', hint: 'Numero, es. 12.90.' },
  { key: 'exclude_google', label: 'Escludi da Google', hint: 'true per escludere.' },
  { key: 'exclude_meta', label: 'Escludi da Meta', hint: 'true per escludere.' },
];

export const OPS = [
  { key: 'contains', label: 'contiene' },
  { key: 'not_contains', label: 'non contiene' },
  { key: 'eq', label: 'è uguale a' },
  { key: 'ne', label: 'è diverso da' },
  { key: 'starts', label: 'inizia con' },
  { key: 'in', label: 'è uno tra' },
  { key: 'gt', label: '>' },
  { key: 'gte', label: '≥' },
  { key: 'lt', label: '<' },
  { key: 'lte', label: '≤' },
  { key: 'empty', label: 'è vuoto' },
  { key: 'not_empty', label: 'non è vuoto' },
];

const num = v => (v === '' || v == null || isNaN(Number(v))) ? null : Number(v);
const bool = v => String(v).toUpperCase() === 'TRUE';
const none = v => { v = (v || '').trim(); return v.toLowerCase() === 'none' ? '' : v; };

const MEDIA = [
  [/^mint/i, 'M'], [/^near mint/i, 'NM'], [/^very good plus/i, 'VG+'], [/^very good/i, 'VG'],
  [/^good plus/i, 'G+'], [/^good/i, 'G'], [/^fair/i, 'F'], [/^poor/i, 'P'], [/^sealed/i, 'Sealed'],
];
export function shortCondition(s) {
  s = (s || '').trim();
  if (!s) return '';
  for (const [re, c] of MEDIA) if (re.test(s)) return c;
  return '';
}

export function validGtin(s) {
  if (!/^\d{8}$|^\d{12,14}$/.test(s)) return false;
  const d = s.split('').map(Number), check = d.pop();
  let sum = 0;
  d.reverse().forEach((x, i) => { sum += x * (i % 2 === 0 ? 3 : 1); });
  return (10 - (sum % 10)) % 10 === check;
}

function findGtin(barcode, identifiers) {
  const cands = [];
  if (barcode) cands.push(barcode);
  for (const m of (identifiers || '').matchAll(/Barcode:\s*([0-9 ]+)/g)) cands.push(m[1]);
  for (const c of cands) {
    const g = c.replace(/\s+/g, '');
    if (validGtin(g)) return g;
  }
  return '';
}

// One row of the Common Ground "listings" CSV export -> app record.
// Keys starting with "_" are only needed to build feeds and are not shipped to the page.
export function normalize(r) {
  const labels = (r.release_labels || '').split(';')[0].replace(/\s*\(.*$/, '').trim();
  const genres = (r.release_genres || '').split(';').map(s => s.trim()).filter(Boolean);
  const stock = num(r.listing_stock_quantity) ?? 0;
  return {
    id: r.listing_id,
    item_id: r.item_id,
    title: r.item_title,
    artist: r.release_artists_formatted || '',
    label: r.release_labels_formatted ? labels : '',
    catno: none((r.release_catnos || '').split(';')[0]),
    year: num(r.release_year),
    country: r.release_country || '',
    genre: genres[0] || '',
    genres: genres.join('; '),
    styles: r.release_styles || '',
    format: r.release_formats || '',
    type: (r.item_type || '').replace(/Item$/, ''),
    media: shortCondition(r.listing_media_condition),
    sleeve: shortCondition(r.listing_sleeve_condition),
    price: num(r.listing_price),
    compare: num(r.listing_compare_price),
    cost: num(r.listing_cost),
    stock,
    status: r.listing_status,
    second_hand: bool(r.listing_second_hand),
    pre_order: bool(r.listing_pre_order),
    supplier: r.listing_supplier || '',
    location: r.listing_location || '',
    categories: r.listing_categories || '',
    gtin: findGtin(r.listing_barcode, r.item_identifiers),
    sku: r.listing_sku || '',
    weight: num(r.item_weight),
    published: (r.listing_published_date || '').slice(0, 10),
    comments: r.listing_public_comments || '',
    private_notes: r.listing_private_comments || '',
    product_type: r.product_type || '',
    manufacturer: r.product_manufacturer || '',
    discogs_id: r.release_discogs_id || '',
    _link: r.item_eshop_link,
    _image: r.item_image_link,
    _available: (r.listing_available_date || '').slice(0, 10),
    _long: r.item_long_description || '',
    _mediaFull: r.listing_media_condition || '',
    _sleeveFull: r.listing_sleeve_condition || '',
  };
}

// ---------- filters and rules ----------

const inSets = new WeakMap();
const low = v => (v == null ? '' : String(v)).toLowerCase();

export function matches(rec, conds) {
  for (const c of conds) if (!matchOne(rec, c)) return false;
  return true;
}

function matchOne(rec, { field, op, value }) {
  const v = rec[field];
  switch (op) {
    case 'empty': return v === '' || v == null;
    case 'not_empty': return !(v === '' || v == null);
    case 'contains': return low(v).includes(low(value));
    case 'not_contains': return !low(v).includes(low(value));
    case 'starts': return low(v).startsWith(low(value));
    case 'eq':
      if (typeof v === 'boolean') return v === (low(value) === 'true');
      if (typeof v === 'number') return v === Number(value);
      return low(v) === low(value);
    case 'ne':
      if (typeof v === 'boolean') return v !== (low(value) === 'true');
      if (typeof v === 'number') return v !== Number(value);
      return low(v) !== low(value);
    case 'in': {
      const arr = Array.isArray(value) ? value : String(value).split('|');
      if (arr.length > 12) {
        let set = inSets.get(arr);
        if (!set) { set = new Set(arr.map(low)); inSets.set(arr, set); }
        return set.has(low(v));
      }
      return arr.some(x => low(x) === low(v));
    }
    case 'gt': return v != null && v !== '' && (typeof v === 'number' ? v > Number(value) : String(v) > String(value));
    case 'gte': return v != null && v !== '' && (typeof v === 'number' ? v >= Number(value) : String(v) >= String(value));
    case 'lt': return v != null && v !== '' && (typeof v === 'number' ? v < Number(value) : String(v) < String(value));
    case 'lte': return v != null && v !== '' && (typeof v === 'number' ? v <= Number(value) : String(v) <= String(value));
  }
  return true;
}

export function template(str, rec) {
  return String(str).replace(/\{(\w+)\}/g, (_, k) => (rec[k] == null ? '' : String(rec[k])));
}

export const COMPUTED = ['tags', ...CUSTOM_LABELS];

// Returns only the fields the rules set, e.g. { custom_label_0: 'jazz', tags: ['a','b'] }.
// Rules run in order. A rule whose conditions use tags or custom labels sees the values
// assigned by the rules above it.
export function applyRules(rec, rules) {
  const out = {};
  for (const rule of rules) {
    if (rule.enabled === false) continue;
    const conds = rule.conditions || [];
    let target = rec;
    if (conds.some(c => COMPUTED.includes(c.field))) {
      target = Object.create(rec);
      target.tags = (out.tags || []).join(', ');
      for (const k of CUSTOM_LABELS) target[k] = out[k] || '';
    }
    if (!matches(target, conds)) continue;
    for (const a of rule.actions || []) {
      if (a.field === 'tags') {
        const cur = out.tags || [];
        if (a.mode === 'remove_all') out.tags = [];
        else if (a.mode === 'remove') {
          const rm = new Set(template(a.value, rec).split(',').map(x => x.trim().toLowerCase()).filter(Boolean));
          out.tags = cur.filter(t => !rm.has(t.toLowerCase()));
        } else {
          const t = template(a.value, rec).split(',').map(x => x.trim()).filter(Boolean);
          out.tags = [...new Set([...cur, ...t])];
        }
      } else if (a.mode === 'clear') {
        out[a.field] = '';
      } else {
        out[a.field] = template(a.value, rec);
      }
    }
  }
  return out;
}

export function sortRules(list) {
  return [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
