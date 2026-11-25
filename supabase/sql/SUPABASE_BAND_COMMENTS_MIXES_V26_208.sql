-- BenKen Band & planning: comments and rehearsal mixes (V26.208).
-- Run once in the Supabase SQL Editor, after SUPABASE_BAND_SETUP.sql.
-- Does not change existing band tables, audio sharing or their policies.
begin;

-- Comments: one thread per shared rehearsal or concert. Members read and write; authors and administrators delete.
create table if not exists public.benken_band_comments (
 id uuid primary key default gen_random_uuid(),
 event_id uuid not null references public.benken_band_events(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 body text not null check(length(body) between 1 and 2000),
 created_at timestamptz not null default now());
create index if not exists benken_band_comments_event on public.benken_band_comments(event_id,created_at);

-- Rehearsal mixes: one stereo MP3/M4A per row, stored privately in Storage under <band>/<event>/<id>.<ext>.
create table if not exists public.benken_band_mixes (
 id uuid primary key default gen_random_uuid(),
 event_id uuid not null references public.benken_band_events(id) on delete cascade,
 title text not null check(length(title) between 1 and 200),
 path text unique not null,
 bytes integer not null check(bytes between 1 and 26214400),
 uploaded_by uuid not null references auth.users(id),
 created_at timestamptz not null default now());
create index if not exists benken_band_mixes_event on public.benken_band_mixes(event_id,title);

alter table public.benken_band_comments enable row level security;
alter table public.benken_band_mixes enable row level security;
drop policy if exists comments_read on public.benken_band_comments;
create policy comments_read on public.benken_band_comments for select to authenticated using(exists(select 1 from public.benken_band_events e where e.id=event_id and public.benken_band_member(e.band_id)));
drop policy if exists mixes_read on public.benken_band_mixes;
create policy mixes_read on public.benken_band_mixes for select to authenticated using(exists(select 1 from public.benken_band_events e where e.id=event_id and public.benken_band_member(e.band_id)));
-- No direct client writes. RPCs below check membership.
revoke all on public.benken_band_comments,public.benken_band_mixes from anon,authenticated;
grant select on public.benken_band_comments,public.benken_band_mixes to authenticated;

-- Storage access for <band>/<event>/<uuid>.<mp3|m4a>: members read, administrators upload and delete.
create or replace function public.benken_band_mix_access(p_name text,p_admin boolean) returns boolean
language sql stable security definer set search_path='' as $$
 select coalesce(p_name ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}/[0-9a-f-]{36}\.(mp3|m4a)$',false) and exists(
  select 1 from public.benken_band_events e join public.benken_band_members m on m.band_id=e.band_id
  where e.band_id::text=split_part(p_name,'/',1) and e.id::text=split_part(p_name,'/',2)
  and m.user_id=auth.uid() and (not p_admin or m.role='admin')); $$;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('benken-band-mixes','benken-band-mixes',false,26214400,array['audio/mpeg','audio/mp4','audio/x-m4a','audio/aac'])
on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists benken_band_mixes_read on storage.objects;
create policy benken_band_mixes_read on storage.objects for select to authenticated
using(bucket_id='benken-band-mixes' and public.benken_band_mix_access(name,false));
drop policy if exists benken_band_mixes_insert on storage.objects;
create policy benken_band_mixes_insert on storage.objects for insert to authenticated
with check(bucket_id='benken-band-mixes' and public.benken_band_mix_access(name,true));
drop policy if exists benken_band_mixes_delete on storage.objects;
create policy benken_band_mixes_delete on storage.objects for delete to authenticated
using(bucket_id='benken-band-mixes' and public.benken_band_mix_access(name,true));

create or replace function public.benken_band_comment_add(p_event uuid,p_body text) returns uuid
language plpgsql security definer set search_path='' as $$ declare c uuid; begin
 if not exists(select 1 from public.benken_band_events where id=p_event and public.benken_band_member(band_id)) then raise exception 'Band members only'; end if;
 if length(trim(coalesce(p_body,''))) not between 1 and 2000 then raise exception 'Write a comment of up to 2000 characters'; end if;
 insert into public.benken_band_comments(event_id,user_id,body) values(p_event,auth.uid(),trim(p_body)) returning id into c; return c; end $$;
create or replace function public.benken_band_comment_delete(p_comment uuid) returns void
language plpgsql security definer set search_path='' as $$ begin
 delete from public.benken_band_comments c using public.benken_band_events e
 where c.id=p_comment and e.id=c.event_id and (c.user_id=auth.uid() or public.benken_band_admin(e.band_id));
 if not found then raise exception 'Only the author or an administrator can delete this comment'; end if; end $$;

create or replace function public.benken_band_mix_add(p_event uuid,p_title text,p_path text,p_bytes integer) returns uuid
language plpgsql security definer set search_path='' as $$ declare b uuid; m uuid; begin
 select band_id into b from public.benken_band_events where id=p_event;
 if not coalesce(public.benken_band_admin(b),false) then raise exception 'Administrator only'; end if;
 if length(trim(coalesce(p_title,''))) not between 1 and 200 then raise exception 'Enter a title for the mix'; end if;
 if split_part(p_path,'/',1)<>b::text or split_part(p_path,'/',2)<>p_event::text or not public.benken_band_mix_access(p_path,true) then raise exception 'Invalid mix location'; end if;
 if not exists(select 1 from storage.objects where bucket_id='benken-band-mixes' and name=p_path) then raise exception 'Upload the audio file first'; end if;
 insert into public.benken_band_mixes(event_id,title,path,bytes,uploaded_by) values(p_event,trim(p_title),p_path,p_bytes,auth.uid()) returning id into m; return m; end $$;
create or replace function public.benken_band_mix_remove(p_mix uuid) returns void
language plpgsql security definer set search_path='' as $$ begin
 delete from public.benken_band_mixes x using public.benken_band_events e where x.id=p_mix and e.id=x.event_id and public.benken_band_admin(e.band_id);
 if not found then raise exception 'Administrator only'; end if; end $$;

-- Explicit function ACLs, including helpers: no anonymous invocation.
do $$ declare r record; begin
 for r in select p.oid::regprocedure sig from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname like 'benken_band_%' loop
  execute format('revoke all on function %s from public, anon',r.sig);
  execute format('grant execute on function %s to authenticated',r.sig);
 end loop; end $$;
commit;
