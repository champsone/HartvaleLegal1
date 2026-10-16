-- NorthmereLegal | one-off clean-up of content saved under the old "Hartvale" name.
-- Run in Supabase SQL Editor. Safe to run more than once.
update public.site_content
set data = regexp_replace(
             regexp_replace(data::text, 'Hartvale\s*Legal', 'NorthmereLegal', 'gi'),
             'Hartvale', 'Northmere', 'gi')::jsonb,
    updated_at = now()
where id = 1;
