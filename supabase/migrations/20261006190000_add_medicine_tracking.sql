-- ============================================================
-- FoodAndSalud
-- Medicine tracking
-- ============================================================


-- ============================================================
-- MEDICINES
-- ============================================================

create table public.medicines (
  id uuid
    primary key
    default gen_random_uuid(),

  user_id uuid
    not null
    references auth.users(id)
    on delete cascade,

  name text
    not null
    check (
      char_length(btrim(name)) between 1 and 120
    ),

  default_unit text
    check (
      default_unit is null
      or char_length(default_unit) <= 40
    ),

  is_favorite boolean
    not null
    default false,

  archived_at timestamptz,

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now(),

  constraint medicines_id_user_unique
    unique (id, user_id)
);


create unique index medicines_user_active_name_unique
  on public.medicines (
    user_id,
    lower(btrim(name))
  )
  where archived_at is null;


create index medicines_user_archived_idx
  on public.medicines (
    user_id,
    archived_at
  );


-- ============================================================
-- MEDICINE ENTRIES
-- ============================================================

create table public.medicine_entries (
  id uuid
    primary key
    default gen_random_uuid(),

  user_id uuid
    not null
    references auth.users(id)
    on delete cascade,

  medicine_id uuid
    not null,

  taken_at timestamptz
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

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now(),

  constraint medicine_entries_id_user_unique
    unique (id, user_id),

  constraint medicine_entries_medicine_user_fk
    foreign key (
      medicine_id,
      user_id
    )
    references public.medicines (
      id,
      user_id
    )
    on delete restrict
);


create index medicine_entries_user_taken_at_idx
  on public.medicine_entries (
    user_id,
    taken_at desc
  );


create index medicine_entries_user_medicine_idx
  on public.medicine_entries (
    user_id,
    medicine_id
  );


-- ============================================================
-- UPDATED_AT
-- ============================================================

create trigger medicines_set_updated_at
before update on public.medicines
for each row
execute function public.set_updated_at();


create trigger medicine_entries_set_updated_at
before update on public.medicine_entries
for each row
execute function public.set_updated_at();


-- ============================================================
-- RLS
-- ============================================================

alter table public.medicines
  enable row level security;

alter table public.medicine_entries
  enable row level security;


-- ============================================================
-- PRIVILEGES
-- ============================================================

revoke all
on table public.medicines
from anon;

revoke all
on table public.medicine_entries
from anon;


grant select, insert, update
on table public.medicines
to authenticated;


grant select, insert, update, delete
on table public.medicine_entries
to authenticated;


-- ============================================================
-- MEDICINES POLICIES
-- ============================================================

create policy medicines_select_own
on public.medicines
for select
to authenticated
using (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = user_id
);


create policy medicines_insert_own
on public.medicines
for insert
to authenticated
with check (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = user_id
);


create policy medicines_update_own
on public.medicines
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


-- No DELETE policy:
-- los medicamentos del catálogo se archivan.


-- ============================================================
-- MEDICINE ENTRIES POLICIES
-- ============================================================

create policy medicine_entries_select_own
on public.medicine_entries
for select
to authenticated
using (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = user_id
);


create policy medicine_entries_insert_own
on public.medicine_entries
for insert
to authenticated
with check (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = user_id
);


create policy medicine_entries_update_own
on public.medicine_entries
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


create policy medicine_entries_delete_own
on public.medicine_entries
for delete
to authenticated
using (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = user_id
);


-- ============================================================
-- TIMELINE
-- ============================================================

drop view if exists public.timeline_events;


create view public.timeline_events
with (security_invoker = true)
as

select
  fe.id,
  fe.user_id,
  fe.eaten_at as occurred_at,
  'food'::text as event_type,
  fe.meal_type as event_subtype,
  fe.notes,
  fe.created_at,
  fe.updated_at

from public.food_entries fe

union all

select
  be.id,
  be.user_id,
  be.occurred_at,
  'bathroom'::text as event_type,
  ('bristol_' || be.bristol_type::text) as event_subtype,
  be.notes,
  be.created_at,
  be.updated_at

from public.bathroom_entries be

union all

select
  me.id,
  me.user_id,
  me.taken_at as occurred_at,
  'medicine'::text as event_type,
  m.name as event_subtype,

  nullif(
    concat_ws(
      ' · ',

      case
        when me.dose is not null then
          me.dose::text ||
          case
            when me.unit is not null
            then ' ' || me.unit
            else ''
          end
      end,

      me.reason,
      me.notes
    ),
    ''
  ) as notes,

  me.created_at,
  me.updated_at

from public.medicine_entries me

join public.medicines m
  on m.id = me.medicine_id
  and m.user_id = me.user_id;


revoke all
on public.timeline_events
from anon;


grant select
on public.timeline_events
to authenticated;


-- ============================================================
-- COMMENTS
-- ============================================================

comment on table public.medicines is
'Personal reusable medicine, supplement and remedy catalog.';


comment on table public.medicine_entries is
'Medicine, supplement or remedy intake event.';


comment on view public.timeline_events is
'RLS-aware unified chronological feed of food, bathroom and medicine events.';
