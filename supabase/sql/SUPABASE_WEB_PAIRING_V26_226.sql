-- BenKen web editor: sign in with a code approved in the app (V26.226).
-- Run once in the Supabase SQL Editor. Then deploy supabase/functions/benken-pair-claim
-- with "Verify JWT" turned off (the function checks the secret itself).
-- Does not change songs, bands or existing sign-in.
begin;

create table if not exists public.benken_pair_codes (
 code text primary key check (code ~ '^[A-Z2-9]{8}$'),
 secret_hash text not null check (secret_hash ~ '^[0-9a-f]{64}$'),
 created_at timestamptz not null default now(),
 expires_at timestamptz not null default now() + interval '5 minutes',
 approved_by uuid references auth.users(id) on delete cascade,
 approved_at timestamptz,
 claimed_at timestamptz);
create index if not exists benken_pair_codes_created on public.benken_pair_codes(created_at);

-- Nobody reads or writes the table directly. The functions below and the Edge Function (service role) do.
alter table public.benken_pair_codes enable row level security;
revoke all on public.benken_pair_codes from anon, authenticated;

-- The web editor registers a code and the hash of a secret only it knows.
create or replace function public.benken_pair_start(p_code text, p_secret_hash text) returns timestamptz
language plpgsql security definer set search_path='' as $$ declare e timestamptz; begin
 delete from public.benken_pair_codes where expires_at < now() - interval '1 hour';
 if (select count(*) from public.benken_pair_codes where created_at > now() - interval '1 minute') > 300 then
  raise exception 'Too many sign-in codes right now. Try again in a minute.'; end if;
 insert into public.benken_pair_codes(code, secret_hash) values (p_code, p_secret_hash) returning expires_at into e;
 return e; end $$;

-- The signed-in app approves the code shown on the computer.
create or replace function public.benken_pair_approve(p_code text) returns void
language plpgsql security definer set search_path='' as $$ begin
 if auth.uid() is null then raise exception 'Sign in to BenKen first'; end if;
 update public.benken_pair_codes set approved_by = auth.uid(), approved_at = now()
  where code = upper(p_code) and expires_at > now() and approved_by is null and claimed_at is null;
 if not found then raise exception 'Code not found or expired. Show a new code in the web editor.'; end if; end $$;

revoke all on function public.benken_pair_start(text, text) from public;
revoke all on function public.benken_pair_approve(text) from public;
grant execute on function public.benken_pair_start(text, text) to anon, authenticated;
grant execute on function public.benken_pair_approve(text) to authenticated;
commit;
