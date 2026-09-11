// Downloads free-licensed slider photos from Wikimedia Commons.
// Run: node scripts/fetch-slider-images.js
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'public', 'img', 'slider');
fs.mkdirSync(outDir, { recursive: true });

const UA = 'AlAmaniExpressSite/1.0 (https://alamani-express.example)';

const items = [
  { name: 'sea',        qs: ['container ship port cranes', 'container ship at berth'] },
  { name: 'truck',      qs: ['container truck on road', 'Boeing 747-400LCF Dreamlifter'] },
  { name: 'containers', qs: ['shipping containers stacked terminal', 'container terminal aerial'] },
];

async function pickUrl(q) {
  const api = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search'
    + '&gsrnamespace=6&gsrsearch=' + encodeURIComponent(q)
    + '&gsrlimit=10&prop=imageinfo&iiprop=url|mime|size&iiurlwidth=1600&format=json';
  const r = await fetch(api, { headers: { 'User-Agent': UA } });
  const j = await r.json();
  const pages = j.query && j.query.pages ? Object.values(j.query.pages) : [];
  pages.sort((a, b) => (a.index || 0) - (b.index || 0));
  for (const p of pages) {
    const ii = p.imageinfo && p.imageinfo[0];
    if (ii && ii.thumburl && /jpe?g/i.test(ii.mime || '') && ii.width >= 1200 && ii.width > ii.height) {
      return { url: ii.thumburl, title: p.title };
    }
  }
  return null;
}

(async () => {
  for (const it of items) {
    for (const q of it.qs) {
      try {
        const hit = await pickUrl(q);
        if (!hit) { console.log('no image for', q); continue; }
        const ir = await fetch(hit.url, { headers: { 'User-Agent': UA } });
        const buf = Buffer.from(await ir.arrayBuffer());
        fs.writeFileSync(path.join(outDir, it.name + '.jpg'), buf);
        console.log('saved', it.name + '.jpg', buf.length, 'bytes  <-', hit.title);
        break;
      } catch (e) { console.log('ERROR', it.name, e.message); }
    }
  }
})();
