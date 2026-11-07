-- EPCMst pursuit workflow upgrade
-- 1) Add a user-specific pursuit stage to saved opportunities
alter table if exists public.saved_opportunities
  add column if not exists pursuit_status text not null default 'Saved';

alter table public.saved_opportunities
  alter column pursuit_status set default 'Saved';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'saved_opportunities_pursuit_status_check'
  ) then
    alter table public.saved_opportunities
      add constraint saved_opportunities_pursuit_status_check
      check (pursuit_status in ('Saved','Monitoring','Researching','Outreach','Active Pursuit'));
  end if;
end $$;

-- Allow authenticated users to update their own saved opportunity stage.
drop policy if exists "Users can update their own saved opportunities" on public.saved_opportunities;
create policy "Users can update their own saved opportunities"
on public.saved_opportunities
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- 2) Store a confirmed LinkedIn profile per user/contact.
create table if not exists public.user_contact_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  contact_id uuid not null references public.project_contacts(id) on delete cascade,
  linkedin_url text not null,
  confirmed_at timestamptz not null default now(),
  unique (user_id, contact_id)
);

alter table public.user_contact_links enable row level security;

drop policy if exists "Users can read their own contact links" on public.user_contact_links;
create policy "Users can read their own contact links"
on public.user_contact_links
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own contact links" on public.user_contact_links;
create policy "Users can insert their own contact links"
on public.user_contact_links
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own contact links" on public.user_contact_links;
create policy "Users can update their own contact links"
on public.user_contact_links
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own contact links" on public.user_contact_links;
create policy "Users can delete their own contact links"
on public.user_contact_links
for delete
to authenticated
using (auth.uid() = user_id);
