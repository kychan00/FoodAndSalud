-- ============================================================
-- FoodAndSalud
-- Initial application schema
-- 2026-10-06
-- ============================================================


-- ============================================================
-- PRIVATE SCHEMA
-- ============================================================

create schema if not exists private;

revoke all on schema private from public;
revoke all on schema private from anon;
revoke all on schema private from authenticated;


-- ============================================================
-- COMMON UPDATED_AT TRIGGER
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ============================================================
-- PROFILES
-- ============================================================

create table public.profiles (
  id uuid primary key
    references auth.users(id)
    on delete cascade,

  display_name text
    check (
      display_name is null
      or char_length(display_name) <= 120
    ),

  avatar_url text,

  timezone text
    not null
    default 'UTC'
    check (
      char_length(timezone) >= 1
      and char_length(timezone) <= 100
    ),

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now()
);


-- ============================================================
-- FOODS
-- ============================================================

create table public.foods (
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

  category text
    check (
      category is null
      or char_length(category) <= 80
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

  constraint foods_id_user_unique
    unique (id, user_id)
);


-- Evita duplicar alimentos activos solo por mayúsculas/minúsculas.
create unique index foods_user_active_name_unique
  on public.foods (
    user_id,
    lower(btrim(name))
  )
  where archived_at is null;


create index foods_user_archived_idx
  on public.foods (
    user_id,
    archived_at
  );


-- ============================================================
-- FOOD ENTRIES
-- ============================================================

create table public.food_entries (
  id uuid
    primary key
    default gen_random_uuid(),

  user_id uuid
    not null
    references auth.users(id)
    on delete cascade,

  eaten_at timestamptz
    not null,

  meal_type text
    not null
    default 'other'
    check (
      meal_type in (
        'breakfast',
        'lunch',
        'dinner',
        'snack',
        'other'
      )
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

  constraint food_entries_id_user_unique
    unique (id, user_id)
);


create index food_entries_user_eaten_at_idx
  on public.food_entries (
    user_id,
    eaten_at desc
  );


-- ============================================================
-- FOOD ENTRY ITEMS
-- ============================================================

create table public.food_entry_items (
  id uuid
    primary key
    default gen_random_uuid(),

  user_id uuid
    not null
    references auth.users(id)
    on delete cascade,

  food_entry_id uuid
    not null,

  food_id uuid
    not null,

  quantity numeric(10,3)
    check (
      quantity is null
      or quantity > 0
    ),

  unit text
    check (
      unit is null
      or char_length(unit) <= 40
    ),

  sort_order smallint
    not null
    default 0
    check (
      sort_order >= 0
    ),

  notes text
    check (
      notes is null
      or char_length(notes) <= 1000
    ),

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now(),

  constraint food_entry_items_entry_user_fk
    foreign key (
      food_entry_id,
      user_id
    )
    references public.food_entries (
      id,
      user_id
    )
    on delete cascade,

  constraint food_entry_items_food_user_fk
    foreign key (
      food_id,
      user_id
    )
    references public.foods (
      id,
      user_id
    )
    on delete restrict
);


create index food_entry_items_entry_idx
  on public.food_entry_items (
    food_entry_id
  );


create index food_entry_items_user_food_idx
  on public.food_entry_items (
    user_id,
    food_id
  );


-- ============================================================
-- BATHROOM ENTRIES
-- ============================================================

create table public.bathroom_entries (
  id uuid
    primary key
    default gen_random_uuid(),

  user_id uuid
    not null
    references auth.users(id)
    on delete cascade,

  occurred_at timestamptz
    not null,

  bristol_type smallint
    not null
    check (
      bristol_type between 1 and 7
    ),

  urgency smallint
    check (
      urgency is null
      or urgency between 0 and 4
    ),

  pain_level smallint
    check (
      pain_level is null
      or pain_level between 0 and 4
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
    default now()
);


create index bathroom_entries_user_occurred_at_idx
  on public.bathroom_entries (
    user_id,
    occurred_at desc
  );


-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();


create trigger foods_set_updated_at
before update on public.foods
for each row
execute function public.set_updated_at();


create trigger food_entries_set_updated_at
before update on public.food_entries
for each row
execute function public.set_updated_at();


create trigger food_entry_items_set_updated_at
before update on public.food_entry_items
for each row
execute function public.set_updated_at();


create trigger bathroom_entries_set_updated_at
before update on public.bathroom_entries
for each row
execute function public.set_updated_at();


-- ============================================================
-- PROFILE CREATION AFTER AUTH SIGNUP
-- ============================================================

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin

  insert into public.profiles (
    id,
    display_name,
    avatar_url
  )
  values (
    new.id,

    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    ),

    coalesce(
      new.raw_user_meta_data ->> 'avatar_url',
      new.raw_user_meta_data ->> 'picture'
    )
  )
  on conflict (id) do nothing;

  return new;

end;
$$;


drop trigger if exists on_auth_user_created
on auth.users;


create trigger on_auth_user_created
after insert on auth.users
for each row
execute function private.handle_new_user();


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles
  enable row level security;

alter table public.foods
  enable row level security;

alter table public.food_entries
  enable row level security;

alter table public.food_entry_items
  enable row level security;

alter table public.bathroom_entries
  enable row level security;


-- ============================================================
-- PRIVILEGES
-- ============================================================

revoke all
on table public.profiles
from anon;

revoke all
on table public.foods
from anon;

revoke all
on table public.food_entries
from anon;

revoke all
on table public.food_entry_items
from anon;

revoke all
on table public.bathroom_entries
from anon;


grant select, insert, update
on table public.profiles
to authenticated;


grant select, insert, update
on table public.foods
to authenticated;


grant select, insert, update, delete
on table public.food_entries
to authenticated;


grant select, insert, update, delete
on table public.food_entry_items
to authenticated;


grant select, insert, update, delete
on table public.bathroom_entries
to authenticated;


-- ============================================================
-- PROFILES POLICIES
-- ============================================================

create policy profiles_select_own
on public.profiles
for select
to authenticated
using (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = id
);


create policy profiles_insert_own
on public.profiles
for insert
to authenticated
with check (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = id
);


create policy profiles_update_own
on public.profiles
for update
to authenticated
using (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = id
)
with check (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = id
);


-- ============================================================
-- FOODS POLICIES
-- ============================================================

create policy foods_select_own
on public.foods
for select
to authenticated
using (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = user_id
);


create policy foods_insert_own
on public.foods
for insert
to authenticated
with check (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = user_id
);


create policy foods_update_own
on public.foods
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


-- Intencionalmente NO existe DELETE policy en foods.
-- El frontend deberá utilizar archived_at.


-- ============================================================
-- FOOD ENTRIES POLICIES
-- ============================================================

create policy food_entries_select_own
on public.food_entries
for select
to authenticated
using (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = user_id
);


create policy food_entries_insert_own
on public.food_entries
for insert
to authenticated
with check (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = user_id
);


create policy food_entries_update_own
on public.food_entries
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


create policy food_entries_delete_own
on public.food_entries
for delete
to authenticated
using (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = user_id
);


-- ============================================================
-- FOOD ENTRY ITEMS POLICIES
-- ============================================================

create policy food_entry_items_select_own
on public.food_entry_items
for select
to authenticated
using (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = user_id
);


create policy food_entry_items_insert_own
on public.food_entry_items
for insert
to authenticated
with check (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = user_id
);


create policy food_entry_items_update_own
on public.food_entry_items
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


create policy food_entry_items_delete_own
on public.food_entry_items
for delete
to authenticated
using (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = user_id
);


-- ============================================================
-- BATHROOM ENTRIES POLICIES
-- ============================================================

create policy bathroom_entries_select_own
on public.bathroom_entries
for select
to authenticated
using (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = user_id
);


create policy bathroom_entries_insert_own
on public.bathroom_entries
for insert
to authenticated
with check (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = user_id
);


create policy bathroom_entries_update_own
on public.bathroom_entries
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


create policy bathroom_entries_delete_own
on public.bathroom_entries
for delete
to authenticated
using (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = user_id
);


-- ============================================================
-- TIMELINE VIEW
-- ============================================================

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

from public.bathroom_entries be;


revoke all
on public.timeline_events
from anon;


grant select
on public.timeline_events
to authenticated;


-- ============================================================
-- COMMENTS
-- ============================================================

comment on table public.foods is
'Personal reusable food catalog. Foods are archived instead of deleted.';

comment on table public.food_entries is
'An eating event at a particular instant.';

comment on table public.food_entry_items is
'Foods associated with an eating event.';

comment on table public.bathroom_entries is
'Structured bowel movement event.';

comment on view public.timeline_events is
'RLS-aware unified chronological feed of food and bathroom events.';
