-- BenKen Stage Pro V26.273: delete my account (App Store guideline 5.1.1(v)).
-- Run once in the Supabase SQL editor (same project). Safe to run again.
-- The signed-in user deletes their own account and everything that belongs only to them:
--   * synced songs and setlists, sign-in, pairing codes, comments, attendance (cascade from auth.users)
--   * bands where they are the only member (with events, packing lists, mixes)
--   * rehearsal mixes and invitations they created, and their sharing permission
-- Bands that other members still use are kept: another member becomes admin and owner.
-- Audio files in Storage are removed by the app before this function runs.
begin;

create or replace function public.benken_delete_my_account()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  who uuid := auth.uid();
  mail text;
  b record;
  heir uuid;
  removed_bands int := 0;
  kept_bands int := 0;
begin
  if who is null then raise exception 'Sign in first' using errcode = '42501'; end if;
  select email into mail from auth.users where id = who;

  -- Things that point at the user without cascading.
  delete from public.benken_band_mixes where uploaded_by = who;
  update public.benken_band_packing set assigned_user_id = null where assigned_user_id = who;
  delete from public.benken_band_invites where created_by = who;

  -- Bands: delete when nobody else is in them, otherwise hand them over.
  for b in select m.band_id, m.role from public.benken_band_members m where m.user_id = who loop
    if not exists (select 1 from public.benken_band_members o where o.band_id = b.band_id and o.user_id <> who) then
      delete from public.benken_bands where id = b.band_id;
      removed_bands := removed_bands + 1;
    else
      if not exists (select 1 from public.benken_band_members o where o.band_id = b.band_id and o.user_id <> who and o.role = 'admin') then
        select o.user_id into heir from public.benken_band_members o
          where o.band_id = b.band_id and o.user_id <> who order by o.display_name, o.user_id limit 1;
        update public.benken_band_members set role = 'admin' where band_id = b.band_id and user_id = heir;
      end if;
      kept_bands := kept_bands + 1;
    end if;
  end loop;
  -- Any band still owned by the user (also bands they left earlier) gets a remaining admin as owner.
  update public.benken_bands bb set created_by = (
      select o.user_id from public.benken_band_members o
      where o.band_id = bb.id and o.user_id <> who
      order by (o.role = 'admin') desc, o.display_name, o.user_id limit 1)
    where bb.created_by = who
      and exists (select 1 from public.benken_band_members o where o.band_id = bb.id and o.user_id <> who);
  delete from public.benken_bands where created_by = who;

  if mail is not null then delete from public.benken_share_uploaders where lower(email) = lower(mail); end if;

  -- Removes the sign-in and cascades to songs, setlists, memberships, attendance, comments and pairing codes.
  delete from auth.users where id = who;
  return jsonb_build_object('deleted', true, 'bandsRemoved', removed_bands, 'bandsKept', kept_bands);
end $$;
revoke all on function public.benken_delete_my_account() from public, anon;
grant execute on function public.benken_delete_my_account() to authenticated;

commit;
