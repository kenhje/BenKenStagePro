-- BenKen Band & planning v1. Run once in the Supabase SQL Editor.
-- Does not change existing audio sharing, storage policies or uploader permissions.
begin;
create extension if not exists pgcrypto with schema extensions;
create table if not exists public.benken_bands (
 id uuid primary key default gen_random_uuid(), name text not null check(length(name) between 1 and 100),
 created_by uuid not null references auth.users(id), created_at timestamptz not null default now());
create table if not exists public.benken_band_members (
 band_id uuid references public.benken_bands(id) on delete cascade,
 user_id uuid references auth.users(id) on delete cascade,
 role text not null check(role in ('admin','member')), display_name text not null default '' check(length(display_name)<=100),
 primary key(band_id,user_id));
create table if not exists public.benken_band_invites (
 id uuid primary key default gen_random_uuid(), band_id uuid not null references public.benken_bands(id) on delete cascade,
 token_hash text unique not null, expires_at timestamptz not null default now()+interval '7 days', used_at timestamptz,
 created_by uuid not null references auth.users(id));
create table if not exists public.benken_band_events (
 id uuid primary key default gen_random_uuid(), band_id uuid not null references public.benken_bands(id) on delete cascade,
 title text not null check(length(title) between 1 and 200), type text not null check(type in ('concert','rehearsal')),
 starts_at timestamptz not null, ends_at timestamptz not null check(ends_at>starts_at),
 details jsonb not null default '{}', revision integer not null default 1, cancelled boolean not null default false,
 updated_at timestamptz not null default now());
create table if not exists public.benken_band_event_private (
 event_id uuid primary key references public.benken_band_events(id) on delete cascade,
 contract jsonb not null default '{}');
create table if not exists public.benken_band_attendance (
 event_id uuid references public.benken_band_events(id) on delete cascade,
 user_id uuid references auth.users(id) on delete cascade,
 response text not null check(response in ('going','no','unsure')), revision integer not null,
 updated_at timestamptz not null default now(), primary key(event_id,user_id));
create table if not exists public.benken_band_packing (
 id uuid primary key default gen_random_uuid(), event_id uuid not null references public.benken_band_events(id) on delete cascade,
 name text not null check(length(name) between 1 and 150), quantity integer not null check(quantity between 1 and 999),
 assigned_user_id uuid references auth.users(id), packed boolean not null default false, home boolean not null default false);
create index if not exists benken_band_events_band on public.benken_band_events(band_id,starts_at);
create index if not exists benken_band_members_user on public.benken_band_members(user_id);
create index if not exists benken_band_packing_event on public.benken_band_packing(event_id);

create or replace function public.benken_band_member(b uuid) returns boolean
language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.benken_band_members where band_id=b and user_id=auth.uid()); $$;
create or replace function public.benken_band_admin(b uuid) returns boolean
language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.benken_band_members where band_id=b and user_id=auth.uid() and role='admin'); $$;
alter table public.benken_bands enable row level security;
alter table public.benken_band_members enable row level security;
alter table public.benken_band_invites enable row level security;
alter table public.benken_band_events enable row level security;
alter table public.benken_band_event_private enable row level security;
alter table public.benken_band_attendance enable row level security;
alter table public.benken_band_packing enable row level security;
drop policy if exists band_read on public.benken_bands;
create policy band_read on public.benken_bands for select to authenticated using(public.benken_band_member(id));
drop policy if exists members_read on public.benken_band_members;
create policy members_read on public.benken_band_members for select to authenticated using(public.benken_band_member(band_id));
drop policy if exists invites_read on public.benken_band_invites;
create policy invites_read on public.benken_band_invites for select to authenticated using(public.benken_band_admin(band_id));
drop policy if exists events_read on public.benken_band_events;
create policy events_read on public.benken_band_events for select to authenticated using(public.benken_band_member(band_id));
drop policy if exists private_read on public.benken_band_event_private;
create policy private_read on public.benken_band_event_private for select to authenticated using(exists(select 1 from public.benken_band_events e where e.id=event_id and public.benken_band_admin(e.band_id)));
drop policy if exists attendance_read on public.benken_band_attendance;
create policy attendance_read on public.benken_band_attendance for select to authenticated using(exists(select 1 from public.benken_band_events e where e.id=event_id and public.benken_band_member(e.band_id)));
drop policy if exists packing_read on public.benken_band_packing;
create policy packing_read on public.benken_band_packing for select to authenticated using(exists(select 1 from public.benken_band_events e where e.id=event_id and public.benken_band_member(e.band_id)));
-- No direct client writes. RPCs below enforce membership and expected revision.
revoke all on public.benken_bands,public.benken_band_members,public.benken_band_invites,public.benken_band_events,public.benken_band_event_private,public.benken_band_attendance,public.benken_band_packing from anon,authenticated;
grant select on public.benken_bands,public.benken_band_members,public.benken_band_invites,public.benken_band_events,public.benken_band_event_private,public.benken_band_attendance,public.benken_band_packing to authenticated;

create or replace function public.benken_band_create(p_name text,p_display text) returns uuid
language plpgsql security definer set search_path='' as $$ declare b uuid; begin
 if auth.uid() is null then raise exception 'Sign in first'; end if;
 insert into public.benken_bands(name,created_by) values(trim(p_name),auth.uid()) returning id into b;
 insert into public.benken_band_members values(b,auth.uid(),'admin',left(trim(p_display),100)); return b; end $$;
create or replace function public.benken_band_invite(p_band uuid) returns text
language plpgsql security definer set search_path='' as $$ declare t text; begin
 if not public.benken_band_admin(p_band) then raise exception 'Administrator only'; end if;
 t:=encode(extensions.gen_random_bytes(32),'hex');
 insert into public.benken_band_invites(band_id,token_hash,created_by) values(p_band,encode(extensions.digest(t,'sha256'),'hex'),auth.uid()); return t; end $$;
create or replace function public.benken_band_remove_member(p_band uuid,p_user uuid) returns void
language plpgsql security definer set search_path='' as $$ begin
 if not public.benken_band_admin(p_band) then raise exception 'Administrator only'; end if;
 if exists(select 1 from public.benken_band_members where band_id=p_band and user_id=p_user and role='admin') then raise exception 'Cannot remove the administrator'; end if;
 delete from public.benken_band_members where band_id=p_band and user_id=p_user;
 -- Retain the event and equipment, but remove former-member replies and assignment.
 delete from public.benken_band_attendance a using public.benken_band_events e where a.event_id=e.id and e.band_id=p_band and a.user_id=p_user;
 update public.benken_band_packing p set assigned_user_id=null from public.benken_band_events e where e.id=p.event_id and e.band_id=p_band and p.assigned_user_id=p_user;
 end $$;
create or replace function public.benken_band_revoke(p_invite uuid) returns void
language plpgsql security definer set search_path='' as $$ begin
 if not exists(select 1 from public.benken_band_invites where id=p_invite and public.benken_band_admin(band_id)) then raise exception 'Administrator only'; end if;
 update public.benken_band_invites set expires_at=now() where id=p_invite; end $$;
create or replace function public.benken_band_join(p_token text,p_display text) returns uuid
language plpgsql security definer set search_path='' as $$ declare inv public.benken_band_invites; begin
 if auth.uid() is null then raise exception 'Sign in first'; end if;
 select * into inv from public.benken_band_invites where token_hash=encode(extensions.digest(p_token,'sha256'),'hex') for update;
 if inv.id is null or inv.used_at is not null or inv.expires_at<=now() then raise exception 'Invitation expired or already used'; end if;
 insert into public.benken_band_members values(inv.band_id,auth.uid(),'member',left(trim(p_display),100)) on conflict do nothing;
 update public.benken_band_invites set used_at=now() where id=inv.id; return inv.band_id; end $$;

-- Rebuild all nested shared fields explicitly. Contract, fee, bank and arbitrary keys cannot leak through details.
create or replace function public.benken_band_publish(p_band uuid,p_event uuid,p_revision integer,p_title text,p_type text,p_start timestamptz,p_end timestamptz,p_details jsonb,p_contract jsonb) returns uuid
language plpgsql security definer set search_path='' as $$
declare eid uuid; d jsonb; v jsonb; ss jsonb:='[]'; songs jsonb; x jsonb; y jsonb; begin
 if not public.benken_band_admin(p_band) then raise exception 'Administrator only'; end if;
 if pg_column_size(p_details)>2000000 or pg_column_size(p_contract)>100000 then raise exception 'Event too large'; end if;
 v:=p_details->'venue';
 for x in select value from jsonb_array_elements(coalesce(p_details->'setlists','[]')) limit 20 loop
  songs:='[]';
  for y in select value from jsonb_array_elements(coalesce(x->'songs','[]')) limit 200 loop
   songs:=songs||jsonb_build_array(jsonb_build_object('title',left(y->>'title',200),'artist',left(y->>'artist',200),'key',left(y->>'key',20),'text',left(y->>'text',30000)));
  end loop;
  ss:=ss||jsonb_build_array(jsonb_build_object('name',left(x->>'name',150),'songs',songs));
 end loop;
 d:=jsonb_build_object('notes',left(p_details->>'notes',10000),'arrival',left(p_details->>'arrival',5),'soundcheck',left(p_details->>'soundcheck',5),
 'venue',jsonb_build_object('name',left(v->>'name',200),'address',left(v->>'address',300),'postalCode',left(v->>'postalCode',30),'city',left(v->>'city',100),'country',left(v->>'country',100),'notes',left(v->>'notes',3000)),'setlists',ss);
 if p_event is null then
  insert into public.benken_band_events(band_id,title,type,starts_at,ends_at,details) values(p_band,trim(p_title),p_type,p_start,p_end,d) returning id into eid;
 else
  update public.benken_band_events set title=trim(p_title),type=p_type,starts_at=p_start,ends_at=p_end,details=d,revision=revision+1,updated_at=now()
  where id=p_event and band_id=p_band and revision=p_revision and not cancelled returning id into eid;
  if eid is null then raise exception 'Event changed. Refresh before updating'; end if;
 end if;
 insert into public.benken_band_event_private values(eid,coalesce(p_contract,'{}')) on conflict(event_id) do update set contract=excluded.contract;
 if p_event is null then
  for x in select value from jsonb_array_elements(coalesce(p_details->'packing','[]')) limit 500 loop
   insert into public.benken_band_packing(event_id,name,quantity) values(eid,left(x->>'name',150),(x->>'quantity')::integer);
  end loop;
 end if;
 return eid; end $$;
create or replace function public.benken_band_cancel(p_event uuid,p_revision integer) returns void
language plpgsql security definer set search_path='' as $$ begin
 update public.benken_band_events set cancelled=true,revision=revision+1,updated_at=now() where id=p_event and revision=p_revision and public.benken_band_admin(band_id);
 if not found then raise exception 'Administrator only, or event changed. Refresh'; end if; end $$;
create or replace function public.benken_band_respond(p_event uuid,p_revision integer,p_response text) returns void
language plpgsql security definer set search_path='' as $$ begin
 if not exists(select 1 from public.benken_band_events where id=p_event and revision=p_revision and not cancelled and public.benken_band_member(band_id)) then raise exception 'Refresh the event before responding'; end if;
 insert into public.benken_band_attendance values(p_event,auth.uid(),p_response,p_revision,now()) on conflict(event_id,user_id) do update set response=excluded.response,revision=excluded.revision,updated_at=now(); end $$;
create or replace function public.benken_band_pack_add(p_event uuid,p_name text,p_quantity integer,p_assigned uuid) returns void
language plpgsql security definer set search_path='' as $$ declare b uuid; begin
 select band_id into b from public.benken_band_events where id=p_event and not cancelled;
 if not coalesce(public.benken_band_admin(b),false) then raise exception 'Administrator only'; end if;
 if p_assigned is not null and not exists(select 1 from public.benken_band_members where band_id=b and user_id=p_assigned) then raise exception 'Choose a band member'; end if;
 insert into public.benken_band_packing(event_id,name,quantity,assigned_user_id) values(p_event,trim(p_name),p_quantity,p_assigned); end $$;
create or replace function public.benken_band_pack_remove(p_item uuid) returns void
language plpgsql security definer set search_path='' as $$ begin
 delete from public.benken_band_packing p using public.benken_band_events e where p.id=p_item and e.id=p.event_id and public.benken_band_admin(e.band_id);
 if not found then raise exception 'Administrator only'; end if; end $$;
create or replace function public.benken_band_pack_check(p_item uuid,p_home boolean,p_checked boolean) returns void
language plpgsql security definer set search_path='' as $$ begin
 update public.benken_band_packing p set packed=case when p_home then packed else p_checked end,home=case when p_home then p_checked else home end
 from public.benken_band_events e where p.id=p_item and e.id=p.event_id and not e.cancelled and public.benken_band_member(e.band_id)
 and (public.benken_band_admin(e.band_id) or p.assigned_user_id=auth.uid() or p.assigned_user_id is null);
 if not found then raise exception 'This item is assigned to another member, or event is cancelled'; end if; end $$;

-- Explicit function ACLs, including helpers: no anonymous invocation.
do $$ declare r record; begin
 for r in select p.oid::regprocedure sig from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname like 'benken_band_%' loop
  execute format('revoke all on function %s from public, anon',r.sig);
  execute format('grant execute on function %s to authenticated',r.sig);
 end loop; end $$;
commit;
