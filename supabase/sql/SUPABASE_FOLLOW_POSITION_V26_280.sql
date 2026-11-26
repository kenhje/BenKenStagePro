-- BenKen Stage Pro V26.280: Share lyrics → Follow with a room code also follows the host's position.
-- Run once in the Supabase SQL editor. Safe to run again.
-- The host writes its playback time, song length, playing/autoscroll state and scroll progress about once a
-- second while a song plays; followers read them and scroll their own lyrics. Older app versions keep working:
-- they only read and write song_title.
begin;

alter table public.benken_rooms add column if not exists position double precision not null default 0;
alter table public.benken_rooms add column if not exists song_length double precision not null default 0;
alter table public.benken_rooms add column if not exists playing boolean not null default false;
alter table public.benken_rooms add column if not exists following boolean not null default false;
alter table public.benken_rooms add column if not exists progress double precision not null default 0;
alter table public.benken_rooms add column if not exists sent_at bigint not null default 0;

alter table public.benken_rooms drop constraint if exists benken_rooms_follow_values;
alter table public.benken_rooms add constraint benken_rooms_follow_values check (
  position >= 0 and position <= 86400 and song_length >= 0 and song_length <= 86400
  and progress >= 0 and progress <= 1 and sent_at >= 0
);

commit;
