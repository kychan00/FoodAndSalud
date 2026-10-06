-- ============================================================
-- FoodAndSalud
-- Medicine schedules
--
-- IMPORTANT:
-- A schedule is NOT a medicine intake.
--
-- medicine_schedules = planned
-- medicine_entries   = actually recorded
-- ============================================================


-- ============================================================
-- MEDICINE SCHEDULES
-- ============================================================

create table public.medicine_schedules (
  id uuid
    primary key
    default gen_random_uuid(),

  user_id uuid
    not null
    references auth.users(id)
    on delete cascade,

  medicine_id uuid
    not null,

  schedule_type text
    not null
    check (
      schedule_type in (
        'specific_times',
        'interval'
      )
    ),

  start_date date
    not null,

  end_date date
    not null,

  dose numeric(10,3)
    check (
      dose is null
      or dose > 0
    ),

  unit text
    check (
      unit is null
      or char_length(unit) <= 40
    ),

  reason text
    check (
      reason is null
      or char_length(reason) <= 300
    ),

  notes text
    check (
      notes is null
      or char_length(notes) <= 2000
    ),

  timezone text
    not null
    check (
      char_length(timezone) between 1 and 100
    ),

  interval_minutes integer,

  interval_start_time time without time zone,

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now(),

  constraint medicine_schedules_id_user_unique
    unique (
      id,
      user_id
    ),

  constraint medicine_schedules_medicine_user_fk
    foreign key (
      medicine_id,
      user_id
    )
    references public.medicines (
      id,
      user_id
    )
    on delete restrict,

  constraint medicine_schedules_date_range_check
    check (
      end_date >= start_date
    ),

  constraint medicine_schedules_configuration_check
    check (
      (
        schedule_type = 'specific_times'
        and interval_minutes is null
        and interval_start_time is null
      )
      or
      (
        schedule_type = 'interval'
        and interval_minutes is not null
        and interval_minutes between 60 and 1440
        and interval_start_time is not null
      )
    )
);


create index medicine_schedules_user_dates_idx
  on public.medicine_schedules (
    user_id,
    start_date,
    end_date
  );


create index medicine_schedules_user_medicine_idx
  on public.medicine_schedules (
    user_id,
    medicine_id
  );


-- ============================================================
-- SPECIFIC TIMES
-- ============================================================

create table public.medicine_schedule_times (
  id uuid
    primary key
    default gen_random_uuid(),

  user_id uuid
    not null
    references auth.users(id)
    on delete cascade,

  schedule_id uuid
    not null,

  time_of_day time without time zone
    not null,

  sort_order integer
    not null
    default 0
    check (
      sort_order >= 0
    ),

  created_at timestamptz
    not null
    default now(),

  constraint medicine_schedule_times_schedule_user_fk
    foreign key (
      schedule_id,
      user_id
    )
    references public.medicine_schedules (
      id,
      user_id
    )
    on delete cascade,

  constraint medicine_schedule_times_unique
    unique (
      schedule_id,
      time_of_day
    )
);


create index medicine_schedule_times_user_schedule_idx
  on public.medicine_schedule_times (
    user_id,
    schedule_id,
    sort_order
  );


-- ============================================================
-- LINK ACTUAL INTAKES TO A PLANNED OCCURRENCE
-- ============================================================

alter table public.medicine_entries
  add column schedule_id uuid,
  add column scheduled_for timestamptz;


alter table public.medicine_entries
  add constraint medicine_entries_schedule_pair_check
  check (
    (
      schedule_id is null
      and scheduled_for is null
    )
    or
    (
      schedule_id is not null
      and scheduled_for is not null
    )
  );


create unique index medicine_entries_schedule_occurrence_unique
  on public.medicine_entries (
    user_id,
    schedule_id,
    scheduled_for
  )
  where
    schedule_id is not null
    and scheduled_for is not null;


-- ============================================================
-- VALIDATE SCHEDULE OWNERSHIP / MEDICINE MATCH
--
-- Deliberately a trigger rather than FK:
-- schedule history may later support soft/hard removal
-- without deleting actual intake history.
-- ============================================================

create or replace function public.validate_medicine_entry_schedule()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if new.schedule_id is null then
    return new;
  end if;

  if not exists (
    select 1
    from public.medicine_schedules ms
    where ms.id = new.schedule_id
      and ms.user_id = new.user_id
      and ms.medicine_id = new.medicine_id
  ) then
    raise exception
      'medicine entry schedule does not belong to user/medicine'
      using errcode = '23514';
  end if;

  return new;
end;
$$;


create trigger medicine_entries_validate_schedule
before insert or update
on public.medicine_entries
for each row
execute function public.validate_medicine_entry_schedule();


-- ============================================================
-- UPDATED_AT
-- ============================================================

create trigger medicine_schedules_set_updated_at
before update on public.medicine_schedules
for each row
execute function public.set_updated_at();


-- ============================================================
-- RLS
-- ============================================================

alter table public.medicine_schedules
  enable row level security;

alter table public.medicine_schedule_times
  enable row level security;


-- ============================================================
-- PRIVILEGES
-- ============================================================

revoke all
on table public.medicine_schedules
from anon;

revoke all
on table public.medicine_schedule_times
from anon;


grant
  select,
  insert,
  update,
  delete
on table public.medicine_schedules
to authenticated;


grant
  select,
  insert,
  update,
  delete
on table public.medicine_schedule_times
to authenticated;


-- ============================================================
-- POLICIES — SCHEDULES
-- ============================================================

create policy medicine_schedules_select_own
on public.medicine_schedules
for select
to authenticated
using (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = user_id
);


create policy medicine_schedules_insert_own
on public.medicine_schedules
for insert
to authenticated
with check (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = user_id
);


create policy medicine_schedules_update_own
on public.medicine_schedules
for update
to authenticated
using (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = user_id
)
with check (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = user_id
);


create policy medicine_schedules_delete_own
on public.medicine_schedules
for delete
to authenticated
using (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = user_id
);


-- ============================================================
-- POLICIES — SCHEDULE TIMES
-- ============================================================

create policy medicine_schedule_times_select_own
on public.medicine_schedule_times
for select
to authenticated
using (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = user_id
);


create policy medicine_schedule_times_insert_own
on public.medicine_schedule_times
for insert
to authenticated
with check (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = user_id
);


create policy medicine_schedule_times_update_own
on public.medicine_schedule_times
for update
to authenticated
using (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = user_id
)
with check (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = user_id
);


create policy medicine_schedule_times_delete_own
on public.medicine_schedule_times
for delete
to authenticated
using (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = user_id
);


-- ============================================================
-- COMMENTS
-- ============================================================

comment on table public.medicine_schedules is
'Planned medicine schedules. A schedule is not evidence that a medicine was taken.';


comment on table public.medicine_schedule_times is
'User-entered local wall-clock times for specific-time medicine schedules.';


comment on column public.medicine_entries.schedule_id is
'Optional originating medicine schedule for an actually recorded intake.';


comment on column public.medicine_entries.scheduled_for is
'Optional planned occurrence represented by an actually recorded intake.';
