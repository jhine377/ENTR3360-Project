-- Assignment 5: persist AI-qualified discovery review decisions
create table if not exists public.discovery_candidate_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  candidate_key text not null,
  project_name text not null,
  company_name text not null,
  location text not null,
  project_type text not null,
  likely_stage text not null,
  project_status text not null,
  confidence text not null,
  trigger_type text not null,
  why_it_matters text not null,
  recommended_next_action text not null,
  supporting_source_ids jsonb not null default '[]'::jsonb,
  decision text not null check (decision in ('Approved', 'Dismissed')),
  reviewed_at timestamptz not null default now(),
  unique (user_id, candidate_key)
);

alter table public.discovery_candidate_reviews enable row level security;

drop policy if exists "Users can read their own discovery reviews" on public.discovery_candidate_reviews;
create policy "Users can read their own discovery reviews"
on public.discovery_candidate_reviews
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own discovery reviews" on public.discovery_candidate_reviews;
create policy "Users can insert their own discovery reviews"
on public.discovery_candidate_reviews
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own discovery reviews" on public.discovery_candidate_reviews;
create policy "Users can update their own discovery reviews"
on public.discovery_candidate_reviews
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
