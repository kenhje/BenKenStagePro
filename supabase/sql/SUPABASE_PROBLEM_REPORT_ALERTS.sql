-- BenKen Stage Pro: email alert for each new problem report.
-- Run once in the Supabase SQL editor after SUPABASE_PROBLEM_REPORTS_V26_275.sql. Safe to run again.
--
-- Each new row in public.benken_problem_reports sends a short email through Resend to
-- support@benkenstagepro.com, from reports@auth.benkenstagepro.com (a domain already verified in Resend).
-- The email holds the category, summary, details, steps, versions and device, plus a link to the table.
-- Diagnostics stay in the database.
--
-- The Resend API key is read from Supabase Vault under the name 'benken_resend_key'.
-- Add it yourself in the dashboard: Project Settings → Vault (or Integrations → Vault) → Add new secret.
-- Without the key, reports are still saved; only the email is skipped.
-- An email problem never stops a report from being saved.
begin;

create extension if not exists pg_net;

create or replace function public.benken_problem_report_alert()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  api_key text;
  reply text;
  body text;
begin
  begin
    select decrypted_secret into api_key from vault.decrypted_secrets where name = 'benken_resend_key' limit 1;
    if coalesce(api_key, '') = '' then return new; end if;

    reply := case when new.contact ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' then new.contact end;
    body := concat_ws(E'\n',
      'Category: ' || new.category,
      'Summary: ' || new.summary,
      '',
      'What happened:', coalesce(nullif(new.details, ''), '-'),
      '',
      'Steps:', coalesce(nullif(new.steps, ''), '-'),
      '',
      'Song: ' || coalesce(nullif(new.song, ''), '-'),
      'Contact: ' || coalesce(nullif(new.contact, ''), '-'),
      'Signed in: ' || case when new.user_id is null then 'no' else 'yes' end,
      'Web ' || coalesce(nullif(new.web_version, ''), '?') || ' / Native ' || coalesce(nullif(new.native_version, ''), '?'),
      'Device: ' || coalesce(nullif(new.device, ''), '-'),
      'Report ID: ' || new.id::text,
      'Sent: ' || to_char(new.created_at at time zone 'Europe/Oslo', 'YYYY-MM-DD HH24:MI') || ' (Oslo)',
      '',
      'Diagnostics and all reports:',
      'https://supabase.com/dashboard/project/ifwqblhjzfjgauaivkdm/editor/26235?schema=public'
    );

    perform net.http_post(
      url := 'https://api.resend.com/emails',
      headers := jsonb_build_object('Authorization', 'Bearer ' || api_key, 'Content-Type', 'application/json'),
      body := jsonb_strip_nulls(jsonb_build_object(
        'from', 'BenKen problem reports <reports@auth.benkenstagepro.com>',
        'to', jsonb_build_array('support@benkenstagepro.com'),
        'reply_to', reply,
        'subject', left('[BenKen] ' || new.category || ': ' || new.summary, 200),
        'text', body
      )),
      timeout_milliseconds := 5000
    );
  exception when others then
    raise warning 'benken_problem_report_alert: %', sqlerrm;
  end;
  return new;
end $$;
revoke all on function public.benken_problem_report_alert() from public, anon, authenticated;

drop trigger if exists benken_problem_report_alert on public.benken_problem_reports;
create trigger benken_problem_report_alert
  after insert on public.benken_problem_reports
  for each row execute function public.benken_problem_report_alert();

commit;
