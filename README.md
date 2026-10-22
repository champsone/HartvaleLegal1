# NorthmereLegal — connected homepage and admin content studio

This is a static, mobile-responsive legal-services concept site. The public homepage reads its editable content model from Supabase and falls back to the local defaults if the database is unavailable. The admin studio at `/admin/` lets an authenticated administrator edit the content model and publish changes without changing source code.

## What the admin can edit

- Brand identity, browser/search/social metadata, header navigation links (add, remove, reorder), the header button and the skip/menu labels
- Homepage hero text, calls to action, hero image URL, alt text and caption
- Trust/credibility strip items
- Service cards (add, remove and reorder)
- Client-proof/testimonial content (use only genuine, approved statements)
- About section text, image URL and alt text, button, and proof points (add, remove, reorder)
- Team heading, lead profile, team members, portraits, roles/focus, contact links and quote
- Insights cards (add, remove and reorder)
- Contact details (email and phone become links), reassurance heading, steps, form heading, every form label, placeholder, error and success message, privacy link, and destinations
- Footer text and links

Changes are saved to the `site_content` row in Supabase. The homepage reads that same row on each visit. If Supabase cannot be reached, the public page continues to show the built-in defaults.

## Supabase setup

1. In Supabase, open **SQL Editor** and run `supabase/setup.sql`.
2. In **Authentication → Users**, create the administrator account. Keep public sign-up disabled.
3. Check `assets/js/supabase-config.js` contains the correct project URL and **anon public** key. The anon key is intended to be public; never put a `service_role` key in browser code.
4. Publish the repository, then open `/admin/`, sign in, edit content and choose **Save changes**.
5. Use **Export JSON backup** before major edits. Imported JSON is not published until Save changes is clicked.

The SQL policies allow public reads for homepage rendering and authenticated writes. Keep public sign-up disabled and only create trusted administrator accounts. For stricter multi-user deployments, change the write policy to check an explicit admin role in Supabase JWT app metadata.

## Content revisions

`assets/js/site-content.js` carries a `revision` number. Content saved in Supabase with a lower revision is treated as out of date: the public site shows the built-in copy, and the admin loads it with a notice. Press **Save changes** once to publish it. Bump `revision` whenever you ship a new default copy deck.

## Important launch checks

- Replace all illustrative people, sample client comments, office details, email and phone with verified, approved information.
- Confirm the correct legal entity, regulatory status, office addresses and any professional claims before publishing.
- The enquiry form posts to Formspree (`https://formspree.io/f/xeaeybpl`). Send a test enquiry after deploying and confirm it arrives, and confirm the Formspree notification email address. Formspree is not a case-management system, so keep the "no confidential documents" wording. After deploying, open `/admin/` and press **Save changes** once so the new content revision (4) replaces older saved copy.
- Replace placeholder images and ensure you have rights to use all images.
- Link privacy, complaints, accessibility and other legal pages to real documents.
- Verify the live Supabase project and permissions in the target hosting environment; this archive cannot independently confirm remote database availability or deployment state.

## Project files

- `index.html` — public homepage (pre-rendered with the default copy for search engines and no-JS visitors)
- `assets/css/site.css` — site stylesheet
- `assets/js/site.js` — mobile menu, active-section highlight and enquiry form
- `admin/index.html` — authenticated content studio
- `assets/js/site-content.js` — default editable content model
- `assets/js/content.js` — homepage renderer and Supabase live-content loader
- `assets/js/admin.js` — editor, authentication, persistence, import/export
- `assets/js/supabase-config.js` — public Supabase project configuration
- `supabase/setup.sql` — database table and row-level security policies
