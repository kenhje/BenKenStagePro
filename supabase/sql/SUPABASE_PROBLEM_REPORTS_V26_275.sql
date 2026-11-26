-- BenKen Stage Pro V26.275: problem reports from Help & Info → Report a problem.
-- Run once in the Supabase SQL editor. Safe to run again.
-- Reports can be sent with or without signing in. Nobody can read them through the app; read them in the
-- Supabase dashboard (Table editor → benken_problem_reports). Deleting an account deletes its reports.
begin;

create table if not exists public.benken_problem_reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete cascade,
  category text not null check (length(category) between 1 and 40),
  summary text not null check (length(summary) between 1 and 200),
  details text not null default '' check (length(details) <= 5000),
  steps text not null default '' check (length(steps) <= 5000),
  song text not null default '' check (length(song) <= 200),
  contact text not null default '' check (length(contact) <= 200),
  web_version text not null default '' check (length(web_version) <= 20),
  native_version text not null default '' check (length(native_version) <= 20),
  device text not null default '' check (length(device) <= 300),
  diagnostics jsonb not null default '{}'::jsonb check (jsonb_typeof(diagnostics) = 'object' and length(diagnostics::text) <= 300000),
  status text not null default 'new' check (status in ('new','seen','fixed','wontfix'))
);
create index if not exists benken_problem_reports_created on public.benken_problem_reports (created_at desc);
alter table public.benken_problem_reports enable row level security;
revoke all on public.benken_problem_reports from anon, authenticated;
-- No policies: the app cannot read, change or delete reports. Inserts go through the function below.

create or replace function public.benken_report_problem(p jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare who uuid := auth.uid(); new_id uuid; recent int;
begin
  if p is null or jsonb_typeof(p) <> 'object' or coalesce(length(trim(p->>'summary')), 0) = 0 then
    raise exception 'Write a short summary of the problem.' using errcode = '22023';
  end if;
  -- Simple flood protection: 10 reports an hour per account, 120 an hour in total from people not signed in.
  if who is not null then
    select count(*) into recent from public.benken_problem_reports where user_id = who and created_at > now() - interval '1 hour';
    if recent >= 10 then raise exception 'Too many reports in the last hour. Try again later.' using errcode = '54000'; end if;
  else
    select count(*) into recent from public.benken_problem_reports where user_id is null and created_at > now() - interval '1 hour';
    if recent >= 120 then raise exception 'Too many reports right now. Try again later.' using errcode = '54000'; end if;
  end if;
  insert into public.benken_problem_reports (user_id, category, summary, details, steps, song, contact, web_version, native_version, device, diagnostics)
  values (who,
    left(coalesce(nullif(trim(p->>'category'), ''), 'Other'), 40),
    left(trim(p->>'summary'), 200),
    left(coalesce(p->>'details', ''), 5000),
    left(coalesce(p->>'steps', ''), 5000),
    left(coalesce(p->>'song', ''), 200),
    left(coalesce(p->>'contact', ''), 200),
    left(coalesce(p->>'webVersion', ''), 20),
    left(coalesce(p->>'nativeVersion', ''), 20),
    left(coalesce(p->>'device', ''), 300),
    case when jsonb_typeof(p->'diagnostics') = 'object' and length((p->'diagnostics')::text) <= 300000 then p->'diagnostics' else '{}'::jsonb end)
  returning id into new_id;
  return jsonb_build_object('id', new_id);
end $$;
revoke all on function public.benken_report_problem(jsonb) from public;
grant execute on function public.benken_report_problem(jsonb) to anon, authenticated;

commit;
