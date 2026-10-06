begin;

create extension if not exists pgtap with schema extensions;

select plan(8);


select has_table(
  'public',
  'medicines',
  'medicines table should exist'
);


select has_table(
  'public',
  'medicine_entries',
  'medicine_entries table should exist'
);


select has_column(
  'public',
  'medicine_entries',
  'medicine_id',
  'medicine_entries should have medicine_id'
);


select has_column(
  'public',
  'medicine_entries',
  'taken_at',
  'medicine_entries should have taken_at'
);


select ok(
  exists (
    select 1
    from pg_class c
    join pg_namespace n
      on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'medicines'
      and c.relkind = 'r'
      and c.relrowsecurity = true
  ),
  'RLS should be enabled on medicines'
);


select ok(
  exists (
    select 1
    from pg_class c
    join pg_namespace n
      on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'medicine_entries'
      and c.relkind = 'r'
      and c.relrowsecurity = true
  ),
  'RLS should be enabled on medicine_entries'
);


select ok(
  exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and tablename = 'medicines'
      and indexname = 'medicines_user_active_name_unique'
  ),
  'active medicine names should have a unique index'
);


select has_view(
  'public',
  'timeline_events',
  'timeline_events view should exist'
);


select * from finish();

rollback;
