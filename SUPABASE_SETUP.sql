-- Kjor dette i SQL Editor i ditt eget Supabase-prosjekt.
-- Enkel demo: kun sangtittel og tilfeldig romkode lagres i skyen.
-- Anon-klienter kan lese og endre rom; IKKE legg inn private data.
create table if not exists public.benken_rooms (
 room text primary key,
 song_title text not null default '',
 updated_at timestamptz not null default now()
);
alter table public.benken_rooms enable row level security;
grant select, insert, update on public.benken_rooms to anon;
drop policy if exists "benken_demo_read" on public.benken_rooms;
drop policy if exists "benken_demo_insert" on public.benken_rooms;
drop policy if exists "benken_demo_update" on public.benken_rooms;
create policy "benken_demo_read" on public.benken_rooms for select to anon using (true);
create policy "benken_demo_insert" on public.benken_rooms for insert to anon with check (length(room) between 16 and 80 and length(song_title) < 250);
create policy "benken_demo_update" on public.benken_rooms for update to anon using (true) with check (length(song_title) < 250);
