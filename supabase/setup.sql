-- HartvaleLegal | Supabase setup
-- Run this once in your Supabase project's SQL Editor (Dashboard -> SQL Editor -> New query -> Run).
-- It creates a single-row table that stores the whole homepage content model as JSON,
-- and sets up Row Level Security so that:
--   - anyone (site visitors) can READ the content
--   - only a signed-in admin user can WRITE (update) it

create table if not exists public.site_content (
  id int primary key default 1,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint site_content_single_row check (id = 1)
);

-- Start with an empty row. The admin panel will fill this with real content
-- the first time you sign in and click "Save changes".
insert into public.site_content (id, data)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

alter table public.site_content enable row level security;

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
  on public.site_content
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Signed-in admin can update site content" on public.site_content;
create policy "Signed-in admin can update site content"
  on public.site_content
  for update
  to authenticated
  using (true)
  with check (true);

-- Note on admin accounts:
-- Do NOT enable public sign-up for this project. Instead, create your own
-- admin login from Dashboard -> Authentication -> Users -> Add user, using
-- your real email and a strong password. That is the only account that
-- will be able to sign in to /admin/ and save changes.
