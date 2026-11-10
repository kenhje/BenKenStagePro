-- Private text-only library. Review and run once in the existing Supabase project.
-- Existing sharing/band tables and policies are unchanged. No anonymous access.
begin;
create table if not exists public.benken_web_songs (
 owner uuid not null references auth.users(id) on delete cascade,
 id uuid not null,
 title text not null check(length(title) between 1 and 250),
 artist text not null default '' check(length(artist)<=250),
 key text not null default '' check(length(key)<=40),
 text text not null default '' check(length(text)<=200000),
 revision bigint not null default 1 check(revision>0),
 updated_at timestamptz not null default now(),
 primary key(owner,id)
);
alter table public.benken_web_songs enable row level security;
revoke all on public.benken_web_songs from anon,authenticated;
grant select on public.benken_web_songs to authenticated;
drop policy if exists benken_web_read_own on public.benken_web_songs;
create policy benken_web_read_own on public.benken_web_songs for select to authenticated using(owner=(select auth.uid()));
create or replace function public.benken_web_save(p_id uuid,p_revision bigint,p_song jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare who uuid := auth.uid(); result public.benken_web_songs;
begin
 if who is null then raise exception 'Sign in first' using errcode='42501'; end if;
 if p_id is null or p_revision is null or p_revision<0 or p_song is null or jsonb_typeof(p_song)<>'object' or coalesce(length(trim(p_song->>'title')),0)=0 then raise exception 'Invalid song'; end if;
 if p_revision=0 then
  insert into public.benken_web_songs(owner,id,title,artist,key,text)
  values(who,p_id,p_song->>'title',coalesce(p_song->>'artist',''),coalesce(p_song->>'key',''),coalesce(p_song->>'text',''))
  on conflict(owner,id) do nothing returning * into result;
 else
  update public.benken_web_songs set title=p_song->>'title',artist=coalesce(p_song->>'artist',''),key=coalesce(p_song->>'key',''),text=coalesce(p_song->>'text',''),revision=revision+1,updated_at=now()
  where owner=who and id=p_id and revision=p_revision returning * into result;
 end if;
 if result.id is null then raise exception 'Song changed. Refresh before saving.' using errcode='40001'; end if;
 return to_jsonb(result);
end $$;
revoke all on function public.benken_web_save(uuid,bigint,jsonb) from public,anon;
grant execute on function public.benken_web_save(uuid,bigint,jsonb) to authenticated;
commit;
