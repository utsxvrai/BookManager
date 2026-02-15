-- Run in Supabase SQL Editor. Bookmarks + RLS; add to supabase_realtime for live updates.

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  url text not null,
  title text,
  created_at timestamptz not null default now()
);

-- Index for fast "my bookmarks" queries and RLS
create index if not exists bookmarks_user_id_idx on public.bookmarks (user_id);

-- Row Level Security: users can only access their own bookmarks
alter table public.bookmarks enable row level security;

create policy "Users can read own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can insert own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own bookmarks"
  on public.bookmarks for update
  using (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

alter publication supabase_realtime add table public.bookmarks;
