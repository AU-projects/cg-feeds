import { template } from './model.mjs';

export const DEFAULT_SETTINGS = {
  currency: 'EUR',
  includeOutOfStock: false,
  includePrivate: false,
  lang: 'it',
  titleCondition: true,
  googleCategoryRelease: 'Media > Music & Sound Recordings',
  googleCategoryBook: 'Media > Books',
  googleCategoryProduct: '',
};

const T = {
  it: { label: 'Etichetta', cat: 'Cat. n.', year: 'Anno', country: 'Paese', format: 'Formato', genre: 'Genere', styles: 'Stili',
        cond: 'Condizioni', media: 'Disco', sleeve: 'Copertina', newItem: 'Nuovo', notes: 'Note' },
  en: { label: 'Label', cat: 'Cat. no.', year: 'Year', country: 'Country', format: 'Format', genre: 'Genre', styles: 'Styles',
        cond: 'Condition', media: 'Media', sleeve: 'Sleeve', newItem: 'New', notes: 'Notes' },
};

const clean = s => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
const money = (n, cur) => Number(n).toFixed(2) + ' ' + cur;

export function defaultTitle(r, s) {
  let t = [r.artist, r.title].filter(Boolean).join(' - ');
  if (r.format) t += ' - ' + r.format.replace(/^1x\s+/, '').replace(/\s*\((.*)\)\s*$/, ' $1');
  if (s.titleCondition && r.second_hand && r.media) t += ' [' + r.media + (r.sleeve ? '/' + r.sleeve : '') + ']';
  return clean(t).slice(0, 150);
}

export function defaultDescription(r, s) {
  const t = T[s.lang] || T.it;
  const parts = [[r.artist, r.title].filter(Boolean).join(' - ')];
  if (r.label) parts.push(`${t.label}: ${r.label}${r.catno ? ' (' + r.catno + ')' : ''}`);
  if (r.year) parts.push(`${t.year}: ${r.year}`);
  if (r.country) parts.push(`${t.country}: ${r.country}`);
  if (r.format) parts.push(`${t.format}: ${r.format}`);
  if (r.genres) parts.push(`${t.genre}: ${r.genres}`);
  if (r.styles) parts.push(`${t.styles}: ${r.styles}`);
  if (r.second_hand && (r._mediaFull || r._sleeveFull)) {
    parts.push(`${t.cond}: ${t.media} ${r._mediaFull || '-'}, ${t.sleeve} ${r._sleeveFull && r._sleeveFull !== 'Generic' ? r._sleeveFull : '-'}`);
  } else if (!r.second_hand) parts.push(t.newItem);
  if (r.comments) parts.push(`${t.notes}: ${r.comments}`);
  return clean(parts.map(p => p.replace(/[.\s]+$/, '')).join('. ') + '.').slice(0, 4900);
}

// Builds the effective feed row for a record, or null when it is not eligible.
// `o` is the output of applyRules(); `channel` is 'google' | 'meta'.
export function feedRow(r, o, s, channel) {
  s = { ...DEFAULT_SETTINGS, ...s };
  if (String(o['exclude_' + channel]).toLowerCase() === 'true') return null;
  if (r.status !== 'published' && !(s.includePrivate && r.status === 'private')) return null;
  if (!s.includeOutOfStock && !(r.stock > 0)) return null;
  const price = o.price_feed !== undefined && o.price_feed !== '' ? Number(o.price_feed) : r.price;
  if (!(price > 0) || !r._image || !r._link) return null;

  const rec = { ...r, ...o };
  const inStock = r.stock > 0;
  const preorder = r.pre_order && r._available && r._available > new Date().toISOString().slice(0, 10);
  const g = channel === 'google';
  const availability = preorder ? 'preorder' : inStock ? (g ? 'in_stock' : 'in stock') : (g ? 'out_of_stock' : 'out of stock');
  const condition = clean(o.condition_feed) || (r.second_hand ? 'used' : 'new');
  const cat = o.google_category || (r.type === 'Release' ? s.googleCategoryRelease
    : r.type === 'Book' ? s.googleCategoryBook : s.googleCategoryProduct);
  const productType = o.product_type_feed || ['Vinili', r.genre].filter(Boolean).join(' > ');
  const onSale = r.compare && r.compare > price;

  const row = {
    id: r.id,
    title: clean(o.title_feed ? template(o.title_feed, rec) : defaultTitle(r, s)),
    description: clean(o.description_feed ? template(o.description_feed, rec) : defaultDescription(r, s)),
    availability,
    condition,
    price: money(onSale ? r.compare : price, s.currency),
    sale_price: onSale ? money(price, s.currency) : '',
    link: r._link,
    image_link: r._image,
    brand: clean(o.brand) || r.label || r.artist || '',
    gtin: r.gtin,
    mpn: r.catno,
    item_group_id: r.item_id,
    google_product_category: cat,
    product_type: productType,
    shipping_weight: r.weight ? r.weight + ' g' : '',
  };
  if (preorder && g) row.availability_date = r._available + 'T00:00+00:00';
  if (g) row.identifier_exists = r.gtin || r.catno ? 'yes' : 'no';
  if (!g) row.quantity_to_sell_on_facebook = Math.max(0, r.stock || 0);
  for (let i = 0; i < 5; i++) row['custom_label_' + i] = clean(o['custom_label_' + i]);
  return row;
}

export const GOOGLE_COLS = ['id', 'title', 'description', 'link', 'image_link', 'availability', 'availability_date', 'price', 'sale_price',
  'condition', 'brand', 'gtin', 'mpn', 'identifier_exists', 'item_group_id', 'google_product_category', 'product_type',
  'shipping_weight', 'custom_label_0', 'custom_label_1', 'custom_label_2', 'custom_label_3', 'custom_label_4'];

export const META_COLS = ['id', 'title', 'description', 'availability', 'condition', 'price', 'sale_price', 'link', 'image_link', 'brand',
  'google_product_category', 'product_type', 'gtin', 'mpn', 'item_group_id', 'quantity_to_sell_on_facebook', 'shipping_weight',
  'custom_label_0', 'custom_label_1', 'custom_label_2', 'custom_label_3', 'custom_label_4'];

export function toTsv(cols, rows) {
  const e = v => (v == null ? '' : String(v)).replace(/[\t\r\n]+/g, ' ');
  return [cols.join('\t'), ...rows.map(r => cols.map(c => e(r[c])).join('\t'))].join('\n') + '\n';
}
