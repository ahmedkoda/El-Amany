# Al Amani Express — Website

Arabic-first (RTL) landing site with English translation for **Al Amani Express**
(شركة الأماني إكسبريس للشحن): freight and customs clearance between Egypt and
Palestine. All customer contact goes through WhatsApp; there is no intake form.

Content was taken from the company's Facebook page (see `facebook/summary.md`).

## Run locally

```bash
cp .env.example .env        # then edit ADMIN_USER / ADMIN_PASS
npm install
npm start
```

- Public site: http://localhost:3000
- Dashboard (edit site content): http://localhost:3000/admin — HTTP Basic auth
  from `.env`. Built for non-technical editors: one entry per site section with
  plain-language field labels, Arabic/English toggle, per-field "restore
  original", and a "contact details" section for WhatsApp/phone/Facebook.
  Saved edits overlay the built-in defaults and show on the site immediately.
  Stored in `data/content.json` (only changed keys, git-ignored).

## Structure

```
server.js              Express server: static site + /admin text editor
public/                Static pages (index, services, contact, 404) + css/js/img
public/js/i18n.js      All site text, Arabic + English (defaults)
admin/                 Dashboard UI (dashboard.html) + section/field labels (schema.js)
facebook/              Raw material scraped from the Facebook page + summary
scripts/               Helper to download free slider photos
data/content.json      Admin text overrides (git-ignored)
```

## Editing content

Visible text lives in two places that must stay in sync: the default Arabic
text inside `public/*.html` and the dictionary in `public/js/i18n.js`.
Contact numbers and WhatsApp links are plain `href`s in the HTML:

| What | Value |
|---|---|
| WhatsApp / phone, Egypt branch | +20 10 8064 4096 (`wa.me/201080644096`) |
| WhatsApp, West Bank branch | +970 59 582 5254 (`wa.me/970595825254`) |
| Cairo office | Nasr City – Rabaa Investment Buildings – Building 58 |
| West Bank warehouse | Ramallah – Beitunia |

Brand colours (from the logo) are in `public/css/styles.css`: navy `#1f3d7a`,
orange `#f26a21`. The logo is `public/img/logo.jpg`; the cover photo from
Facebook is used as the fourth slider image.
