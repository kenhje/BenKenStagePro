-- Review and run once in your existing Supabase project's SQL Editor.
-- Does not change the old live-following tables or their policies.
begin;
create table if not exists public.benken_share_uploaders(email text primary key);
alter table public.benken_share_uploaders enable row level security;
grant select on public.benken_share_uploaders to authenticated;
drop policy if exists benken_share_uploader_read_self on public.benken_share_uploaders;
create policy benken_share_uploader_read_self on public.benken_share_uploaders for select to authenticated using(lower(email)=lower((select auth.jwt())->>'email'));
insert into storage.buckets(id,name,public,file_size_limit)
values('benken-shares','benken-shares',false,50331648)
on conflict(id) do update set public=false,file_size_limit=50331648;
drop policy if exists benken_shares_insert_own on storage.objects;
create policy benken_shares_insert_own on storage.objects for insert to authenticated
with check(bucket_id='benken-shares' and (storage.foldername(name))[1]=(select auth.uid()::text) and exists(select 1 from public.benken_share_uploaders where lower(email)=lower((select auth.jwt())->>'email')));
drop policy if exists benken_shares_select_own on storage.objects;
create policy benken_shares_select_own on storage.objects for select to authenticated
using(bucket_id='benken-shares' and (storage.foldername(name))[1]=(select auth.uid()::text) and exists(select 1 from public.benken_share_uploaders where lower(email)=lower((select auth.jwt())->>'email')));
drop policy if exists benken_shares_delete_own on storage.objects;
create policy benken_shares_delete_own on storage.objects for delete to authenticated
using(bucket_id='benken-shares' and (storage.foldername(name))[1]=(select auth.uid()::text) and exists(select 1 from public.benken_share_uploaders where lower(email)=lower((select auth.jwt())->>'email')));
commit;
-- Allow your sender email (replace the email yourself):
-- insert into public.benken_share_uploaders(email) values('YOUR_EMAIL_HERE') on conflict do nothing;
-- Default emails work: copy the original Sign in / Confirm email link from
-- the email into BenKen. If custom email templates are available, {{ .Token }}
-- also enables entering a numeric one-time code. No custom SMTP is required.
-- Email signups must be enabled for first-time code sign-in. Storage upload is
-- still restricted to explicitly allowed, verified sender emails by the policies.
