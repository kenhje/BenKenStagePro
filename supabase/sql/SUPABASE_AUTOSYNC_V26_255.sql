-- BenKen Stage Pro V26.255: autosync of song details and setlists between devices.
-- Run once in the Supabase SQL editor (same project as SUPABASE_WEB_EDITOR_SETUP.sql).
-- Safe to run again. Existing songs and the web editor keep working.
begin;

-- 1. Song details (notes, chord chart, BPM, time signature, tags, capo, colour, voicings).
alter table public.benken_web_songs add column if not exists extra jsonb not null default '{}'::jsonb;
alter table public.benken_web_songs drop constraint if exists benken_web_songs_extra_check;
alter table public.benken_web_songs add constraint benken_web_songs_extra_check check(jsonb_typeof(extra)='object' and length(extra::text)<=250000);

-- Save keeps "extra" when the caller does not send it (the web editor only sends title, artist, key and lyrics).
create or replace function public.benken_web_save(p_id uuid,p_revision bigint,p_song jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare who uuid := auth.uid(); result public.benken_web_songs; x jsonb;
begin
 if who is null then raise exception 'Sign in first' using errcode='42501'; end if;
 if p_id is null or p_revision is null or p_revision<0 or p_song is null or jsonb_typeof(p_song)<>'object' or coalesce(length(trim(p_song->>'title')),0)=0 then raise exception 'Invalid song'; end if;
 x := case when jsonb_typeof(p_song->'extra')='object' then p_song->'extra' else null end;
 if p_revision=0 then
  insert into public.benken_web_songs(owner,id,title,artist,key,text,extra)
  values(who,p_id,p_song->>'title',coalesce(p_song->>'artist',''),coalesce(p_song->>'key',''),coalesce(p_song->>'text',''),coalesce(x,'{}'::jsonb))
  on conflict(owner,id) do nothing returning * into result;
 else
  update public.benken_web_songs set title=p_song->>'title',artist=coalesce(p_song->>'artist',''),key=coalesce(p_song->>'key',''),text=coalesce(p_song->>'text',''),extra=coalesce(x,extra),revision=revision+1,updated_at=now()
  where owner=who and id=p_id and revision=p_revision returning * into result;
 end if;
 if result.id is null then raise exception 'Song changed. Refresh before saving.' using errcode='40001'; end if;
 return to_jsonb(result);
end $$;
revoke all on function public.benken_web_save(uuid,bigint,jsonb) from public,anon;
grant execute on function public.benken_web_save(uuid,bigint,jsonb) to authenticated;

-- Delete a song only when nobody changed it since this device last saw it.
create or replace function public.benken_web_delete(p_id uuid,p_revision bigint)
returns boolean language plpgsql security definer set search_path = '' as $$
declare who uuid := auth.uid(); n int;
begin
 if who is null then raise exception 'Sign in first' using errcode='42501'; end if;
 delete from public.benken_web_songs where owner=who and id=p_id and revision=p_revision;
 get diagnostics n = row_count;
 return n>0;
end $$;
revoke all on function public.benken_web_delete(uuid,bigint) from public,anon;
grant execute on function public.benken_web_delete(uuid,bigint) to authenticated;

-- 2. Setlists: name, song order (ids from benken_web_songs) and dividers. Cover images stay on each device.
create table if not exists public.benken_web_setlists (
 owner uuid not null references auth.users(id) on delete cascade,
 id uuid not null,
 name text not null check(length(name) between 1 and 200),
 songs jsonb not null default '[]'::jsonb check(jsonb_typeof(songs)='array' and jsonb_array_length(songs)<=2000),
 dividers jsonb not null default '[]'::jsonb check(jsonb_typeof(dividers)='array' and length(dividers::text)<=50000),
 revision bigint not null default 1 check(revision>0),
 updated_at timestamptz not null default now(),
 primary key(owner,id)
);
alter table public.benken_web_setlists enable row level security;
revoke all on public.benken_web_setlists from anon,authenticated;
grant select on public.benken_web_setlists to authenticated;
drop policy if exists benken_web_setlists_read_own on public.benken_web_setlists;
create policy benken_web_setlists_read_own on public.benken_web_setlists for select to authenticated using(owner=(select auth.uid()));

create or replace function public.benken_web_setlist_save(p_id uuid,p_revision bigint,p_set jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare who uuid := auth.uid(); result public.benken_web_setlists;
begin
 if who is null then raise exception 'Sign in first' using errcode='42501'; end if;
 if p_id is null or p_revision is null or p_revision<0 or p_set is null or jsonb_typeof(p_set)<>'object' or coalesce(length(trim(p_set->>'name')),0)=0 or jsonb_typeof(p_set->'songs')<>'array' then raise exception 'Invalid setlist'; end if;
 if p_revision=0 then
  insert into public.benken_web_setlists(owner,id,name,songs,dividers)
  values(who,p_id,p_set->>'name',p_set->'songs',coalesce(case when jsonb_typeof(p_set->'dividers')='array' then p_set->'dividers' end,'[]'::jsonb))
  on conflict(owner,id) do nothing returning * into result;
 else
  update public.benken_web_setlists set name=p_set->>'name',songs=p_set->'songs',dividers=coalesce(case when jsonb_typeof(p_set->'dividers')='array' then p_set->'dividers' end,'[]'::jsonb),revision=revision+1,updated_at=now()
  where owner=who and id=p_id and revision=p_revision returning * into result;
 end if;
 if result.id is null then raise exception 'Setlist changed. Refresh before saving.' using errcode='40001'; end if;
 return to_jsonb(result);
end $$;
revoke all on function public.benken_web_setlist_save(uuid,bigint,jsonb) from public,anon;
grant execute on function public.benken_web_setlist_save(uuid,bigint,jsonb) to authenticated;

create or replace function public.benken_web_setlist_delete(p_id uuid,p_revision bigint)
returns boolean language plpgsql security definer set search_path = '' as $$
declare who uuid := auth.uid(); n int;
begin
 if who is null then raise exception 'Sign in first' using errcode='42501'; end if;
 delete from public.benken_web_setlists where owner=who and id=p_id and revision=p_revision;
 get diagnostics n = row_count;
 return n>0;
end $$;
revoke all on function public.benken_web_setlist_delete(uuid,bigint) from public,anon;
grant execute on function public.benken_web_setlist_delete(uuid,bigint) to authenticated;

commit;
