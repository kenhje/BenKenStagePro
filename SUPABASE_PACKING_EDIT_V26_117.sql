-- Edit equipment without deleting checkmarks. Existing admin/member boundaries are retained.
begin;
create or replace function public.benken_band_pack_edit(p_item uuid,p_name text,p_quantity integer,p_assigned uuid) returns void
language plpgsql security definer set search_path='' as $$
declare b uuid; begin
 select e.band_id into b from public.benken_band_events e join public.benken_band_packing p on p.event_id=e.id where p.id=p_item and not e.cancelled for update of p;
 if not coalesce(public.benken_band_admin(b),false) then raise exception 'Administrator only'; end if;
 if length(trim(p_name)) not between 1 and 120 or p_quantity not between 1 and 999 or p_quantity is null then raise exception 'Enter an item name and quantity from 1 to 999'; end if;
 if p_assigned is not null and not exists(select 1 from public.benken_band_members where band_id=b and user_id=p_assigned) then raise exception 'Choose a band member'; end if;
 update public.benken_band_packing set name=trim(p_name),quantity=p_quantity,assigned_user_id=p_assigned where id=p_item;
end $$;
revoke all on function public.benken_band_pack_edit(uuid,text,integer,uuid) from public,anon;
grant execute on function public.benken_band_pack_edit(uuid,text,integer,uuid) to authenticated;
commit;
