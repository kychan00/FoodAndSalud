-- ============================================================
-- FoodAndSalud
-- Medicine schedule lifecycle
--
-- stopped_at:
--   precise point after which future occurrences disappear.
--
-- archived_at:
--   logical removal from active schedule management/calendar.
--
-- Existing medicine_entries remain historical facts.
-- ============================================================


alter table public.medicine_schedules
  add column stopped_at timestamptz,
  add column archived_at timestamptz;


create index medicine_schedules_user_archived_idx
  on public.medicine_schedules (
    user_id,
    archived_at
  );


create index medicine_schedules_user_stopped_idx
  on public.medicine_schedules (
    user_id,
    stopped_at
  );


comment on column public.medicine_schedules.stopped_at is
'Exact timestamp after which this schedule no longer produces future planned occurrences.';


comment on column public.medicine_schedules.archived_at is
'Logical removal timestamp. Archived schedules remain stored so linked medicine history keeps its schedule identity.';
