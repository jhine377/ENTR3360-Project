alter table public.discovery_candidate_reviews
  add column if not exists supporting_source_urls jsonb not null default '[]'::jsonb;
