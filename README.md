# NorthmereLegal — connected homepage and admin content studio

This is a static, mobile-responsive legal-services concept site. The public homepage reads its editable content model from Supabase and falls back to the local defaults if the database is unavailable. The admin studio at `/admin/` lets an authenticated administrator edit the content model and publish changes without changing source code.

## What the admin can edit

- Brand identity, browser/search metadata and navigation labels
- Homepage hero text, calls to action and hero image URL
- Trust/credibility strip items
- Service cards (add, remove and reorder)
- Client-proof/testimonial content (use only genuine, approved statements)
- About section text, image URL, button and proof points
- Team heading, lead profile, team members, portraits, roles/focus, contact links and quote
- Insights cards (add, remove and reorder)
- Contact details, form labels, messages and destinations
- Footer text and links

Changes are saved to the `site_content` row in Supabase. The homepage reads that same row on each visit. If Supabase cannot be reached, the public page continues to show the built-in defaults.

## Supabase setup

1. In Supabase, open **SQL Editor** and run `supabase/setup.sql`.
2. In **Authentication → Users**, create the administrator account. Keep public sign-up disabled.
3. Check `assets/js/supabase-config.js` contains the correct project URL and **anon public** key. The anon key is intended to be public; never put a `service_role` key in browser code.
4. Publish the repository, then open `/admin/`, sign in, edit content and choose **Save changes**.
5. Use **Export JSON backup** before major edits. Imported JSON is not published until Save changes is clicked.

The SQL policies allow public reads for homepage rendering and authenticated writes. Keep public sign-up disabled and only create trusted administrator accounts. For stricter multi-user deployments, change the write policy to check an explicit admin role in Supabase JWT app metadata.

## Important launch checks

- Replace all illustrative people, sample client comments, office details, email and phone with verified, approved information.
- Confirm the correct legal entity, regulatory status, office addresses and any professional claims before publishing.
- Configure a real secure enquiry endpoint before collecting enquiries. The current form prepares an email draft only when a verified recipient email is entered in the admin studio; it is not a secure case-management system.
- Replace placeholder images and ensure you have rights to use all images.
- Link privacy, complaints, accessibility and other legal pages to real documents.
- Verify the live Supabase project and permissions in the target hosting environment; this archive cannot independently confirm remote database availability or deployment state.

## Project files

- `index.html` — public homepage and responsive design
- `admin/index.html` — authenticated content studio
- `assets/js/site-content.js` — default editable content model
- `assets/js/content.js` — homepage renderer and Supabase live-content loader
- `assets/js/admin.js` — editor, authentication, persistence, import/export
- `assets/js/supabase-config.js` — public Supabase project configuration
- `supabase/setup.sql` — database table and row-level security policies
