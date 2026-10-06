begin;

create extension if not exists pgtap with schema extensions;

select plan(10);


select has_table(
  'public',
  'medicine_schedules',
  'medicine_schedules table should exist'
);


select has_table(
  'public',
  'medicine_schedule_times',
  'medicine_schedule_times table should exist'
);


select has_column(
  'public',
  'medicine_schedules',
  'schedule_type',
  'medicine_schedules should have schedule_type'
);


select has_column(
  'public',
  'medicine_schedules',
  'start_date',
  'medicine_schedules should have start_date'
);


select has_column(
  'public',
  'medicine_schedules',
  'end_date',
  'medicine_schedules should have end_date'
);


select has_column(
  'public',
  'medicine_entries',
  'schedule_id',
  'medicine_entries should link an actual intake to an optional schedule'
);


select has_column(
  'public',
  'medicine_entries',
  'scheduled_for',
  'medicine_entries should retain the planned occurrence'
);


select ok(
  exists (
    select 1
    from pg_class c
    join pg_namespace n
      on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'medicine_schedules'
      and c.relkind = 'r'
      and c.relrowsecurity = true
  ),
  'RLS should be enabled on medicine_schedules'
);


select ok(
  exists (
    select 1
    from pg_class c
    join pg_namespace n
      on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'medicine_schedule_times'
      and c.relkind = 'r'
      and c.relrowsecurity = true
  ),
  'RLS should be enabled on medicine_schedule_times'
);


select ok(
  exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and tablename = 'medicine_entries'
      and indexname = 'medicine_entries_schedule_occurrence_unique'
  ),
  'one planned occurrence should map to at most one recorded intake'
);


select * from finish();

rollback;
