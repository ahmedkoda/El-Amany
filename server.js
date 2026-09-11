'use strict';

/*
 * Al Amani Express — official website
 * Static Arabic-first (RTL) landing site with English translation.
 * All customer contact goes through WhatsApp; there is no intake form.
 * A password-protected /admin area lets the owner edit any site text
 * (Arabic / English) without touching the code.
 */

const path = require('path');
const fs = require('fs');
const express = require('express');

const PORT = process.env.PORT || 3000;
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'changeme';

const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const DATA_DIR = path.join(ROOT, 'data');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// Editable site text (admin overrides over the built-in i18n defaults).
const LANGS = ['ar', 'en'];
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
const EMPTY_CONTENT = { ar: {}, en: {} };
if (!fs.existsSync(CONTENT_FILE)) fs.writeFileSync(CONTENT_FILE, JSON.stringify(EMPTY_CONTENT, null, 2));
function readContent() {
  try { return JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8')); }
  catch { return { ar: {}, en: {} }; }
}
function writeContent(c) { fs.writeFileSync(CONTENT_FILE, JSON.stringify(c, null, 2)); }

// ---- app -------------------------------------------------------------------
const app = express();
app.use(express.json({ limit: '2mb' }));

// ---- admin (basic auth) ----------------------------------------------------
function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, encoded] = header.split(' ');
  if (scheme === 'Basic' && encoded) {
    const [user, pass] = Buffer.from(encoded, 'base64').toString().split(':');
    if (user === ADMIN_USER && pass === ADMIN_PASS) return next();
  }
  res.set('WWW-Authenticate', 'Basic realm="Al Amani Admin"');
  return res.status(401).send('Authentication required.');
}

// ---- editable content (CMS) ----
// Public: the pages overlay these admin edits onto the built-in defaults.
app.get('/api/content', (req, res) => res.json(readContent()));

// Admin: the text editor UI.
app.get(['/admin', '/admin/content'], requireAdmin, (req, res) => {
  res.sendFile(path.join(ROOT, 'admin', 'content-editor.html'));
});

// Admin: save edited text. Body = { ar:{key:val}, en:{...} } with only changed keys.
app.post('/admin/content', requireAdmin, (req, res) => {
  const body = req.body || {};
  const clean = { ar: {}, en: {} };
  for (const lang of LANGS) {
    const m = body[lang] || {};
    for (const k of Object.keys(m)) {
      const v = m[k];
      if (typeof k === 'string' && typeof v === 'string' && v.length <= 4000) clean[lang][k] = v;
    }
  }
  writeContent(clean);
  const n = Object.keys(clean.ar).length + Object.keys(clean.en).length;
  res.json({ ok: true, overrides: n });
});

// ---- static public site (served last so it can't shadow routes) ------------
app.use(express.static(PUBLIC_DIR, { extensions: ['html'] }));

app.use((req, res) => res.status(404).sendFile(path.join(PUBLIC_DIR, '404.html')));

app.listen(PORT, () => {
  console.log(`Al Amani Express site running: http://localhost:${PORT}`);
  console.log(`Admin (edit site text):        http://localhost:${PORT}/admin  (user: ${ADMIN_USER})`);
});
