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

## Deployment (Railway)

Live: https://al-amani-express-production.up.railway.app

The service is connected to this GitHub repo, so **pushing to `main` deploys
automatically**. Configuration lives in `railway.json` (start command, health
check on `/`, restart on failure) and Node is pinned to 20-22 via `engines`.

**The volume is the part you must not lose.** A Railway volume is mounted at
`/app/data`, which is where `data/content.json` (every dashboard edit) is
written. Without it the file is wiped on each deploy. Verified: an edit saved
through the dashboard survived a full redeploy.

| Setting | Value |
|---|---|
| Volume mount path | `/app/data` |
| Env vars | `ADMIN_USER`, `ADMIN_PASS` (set in Railway, never committed) |
| Port | provided by Railway, read from `process.env.PORT` |

### Backups

`data/content.json` exists only on the volume. Railway deletes volumes on
trial accounts 30 days after the trial credit expires, so move to a paid plan
before then, and keep a copy of the file:

```bash
curl -s https://al-amani-express-production.up.railway.app/api/content > content-backup.json
```

To restore, POST that file back to `/admin/content` with the admin credentials.

### Known follow-up

Railway is deprecating `railway.json` in favour of `.railway/railway.ts`
(existing files keep working until 2026-12-01). `railway config migrate`
currently generates a file that renames the service and omits the volume, so
it was **not** applied. Migrate by hand before that date, keeping the service
name `al-amani-express` and the `/app/data` volume.


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
