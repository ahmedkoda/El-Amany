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
const EMPTY_CONTENT = { ar: {}, en: {}, settings: {} };
if (!fs.existsSync(CONTENT_FILE)) fs.writeFileSync(CONTENT_FILE, JSON.stringify(EMPTY_CONTENT, null, 2));
function readContent() {
  try { return JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8')); }
  catch { return { ar: {}, en: {}, settings: {} }; }
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

// Admin: the dashboard UI + its section schema.
app.get(['/admin', '/admin/content'], requireAdmin, (req, res) => {
  res.sendFile(path.join(ROOT, 'admin', 'dashboard.html'));
});
app.get('/admin/schema.js', requireAdmin, (req, res) => {
  res.sendFile(path.join(ROOT, 'admin', 'schema.js'));
});

// Settings editable from the dashboard (contact numbers and links).
const SETTING_KEYS = ['wa_eg', 'wa_ps', 'phone_eg', 'facebook'];

// Admin: save edited text. Body = { ar:{key:val}, en:{...}, settings:{...} } with only changed keys.
app.post('/admin/content', requireAdmin, (req, res) => {
  const body = req.body || {};
  const clean = { ar: {}, en: {}, settings: {} };
  const st = body.settings || {};
  for (const k of SETTING_KEYS) {
    if (typeof st[k] === 'string' && st[k].trim() && st[k].length <= 200) clean.settings[k] = st[k].trim();
  }
  for (const lang of LANGS) {
    const m = body[lang] || {};
    for (const k of Object.keys(m)) {
      const v = m[k];
      if (typeof k === 'string' && typeof v === 'string' && v.length <= 4000) clean[lang][k] = v;
    }
  }
  writeContent(clean);
  const n = Object.keys(clean.ar).length + Object.keys(clean.en).length + Object.keys(clean.settings).length;
  res.json({ ok: true, overrides: n });
});

// ---- static public site (served last so it can't shadow routes) ------------
app.use(express.static(PUBLIC_DIR, { extensions: ['html'] }));

app.use((req, res) => res.status(404).sendFile(path.join(PUBLIC_DIR, '404.html')));

app.listen(PORT, () => {
  console.log(`Al Amani Express site running: http://localhost:${PORT}`);
  console.log(`Admin (edit site text):        http://localhost:${PORT}/admin  (user: ${ADMIN_USER})`);
});
