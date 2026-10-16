# HartvaleLegal website

A static site (still hosted for free on GitHub Pages), with live content
stored in a small managed database (Supabase). Editing the homepage through
`/admin/` now publishes instantly for every visitor — no manual export/commit
step. Open the site root in a browser to preview it.

## Structure

```
hartvalelegal/
├── index.html                 Public homepage structure
├── admin/index.html           Content studio at `/admin/`
├── supabase/setup.sql         Run once in Supabase to create the database table
├── README.md
└── assets/
    ├── css/styles.css         All styling
    └── js/
        ├── site-content.js    Fallback content, shown instantly and if Supabase is unreachable
        ├── supabase-config.js Your Supabase project URL + anon key (fill this in)
        ├── content.js         Homepage content renderer (defaults, then live data)
        ├── admin.js           Content studio: sign-in, editor, save/import/export
        └── main.js            Mobile menu, footer year, enquiry form
```

## One-time setup (Supabase)

1. Create a free project at [supabase.com](https://supabase.com).
2. In your project, open **SQL Editor -> New query**, paste the contents of
   `supabase/setup.sql`, and run it. This creates the `site_content` table
   and the security rules (public read, admin-only write).
3. Create your admin login: **Authentication -> Users -> Add user**, using
   your real email and a strong password. Do **not** enable public sign-up —
   this is the only account that should be able to edit the site.
4. Copy your **Project URL** and **anon public key** from
   **Project settings -> API**, and paste them into
   `assets/js/supabase-config.js`.
5. Commit and push. The homepage and `/admin/` are now connected to your
   database.

## Admin studio

Open `/admin/` on the deployed site and sign in with the admin email and
password you created in Supabase. The studio edits the full homepage content
model — headings, navigation, practice areas, testimonials, people, contact
details, images, and every button/link destination.

Clicking **Save changes** writes straight to the database and is live for
every visitor immediately. Use **Export JSON backup** occasionally to keep an
offline copy, and **Import JSON** to restore from one.

**Security model:** content is publicly readable (it's a public homepage) but
only writable by a signed-in Supabase account, enforced by Postgres Row Level
Security — not by anything in the browser. The anon key in
`supabase-config.js` is designed to be public and safe to commit; never put a
Supabase *service_role* key here.

## Before going live

1. **Supabase setup.** Complete the steps above — the site falls back to
   placeholder content until it is connected.
2. **Enquiry form.** Wired for Formspree. In `/admin/` under **URL key and
   destinations**, replace `https://formspree.io/f/YOUR_FORM_ID` with your
   real Formspree endpoint.
3. **Contact and regulatory details.** Everything marked `TODO` — address,
   phone, email, and the footer's regulatory notice (LLP/company number, SRA
   number) — needs replacing with real, verified details before publishing.
   The same placeholders also appear in the JSON-LD block in `index.html`
   `<head>`, used by search engines — update that too.
4. **Legal links.** Privacy notice, Complaints procedure and Accessibility
   currently point to `#`. Link them to real pages.
5. **Images.** Photos load from Unsplash and are placeholders. Replace with
   real photography.
6. **People and client comments.** Names, roles, and testimonials are
   illustrative. Replace with genuine, approved content, and check it meets
   SRA rules on client comments before publishing.

## Editing tips

- Colours and fonts live in the `:root` block at the top of `styles.css`.
- Layout changes at 960px (tablet and mobile) and 600px (small phones).
- The hero photograph is designed to bleed to the right edge of the screen on desktop.
