begin;

create extension if not exists pgtap with schema extensions;

select plan(4);


select has_column(
  'public',
  'medicine_schedules',
  'stopped_at',
  'medicine_schedules should have stopped_at'
);


select has_column(
  'public',
  'medicine_schedules',
  'archived_at',
  'medicine_schedules should have archived_at'
);


select ok(
  exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and tablename = 'medicine_schedules'
      and indexname = 'medicine_schedules_user_archived_idx'
  ),
  'medicine_schedules should index archived lifecycle state'
);


select ok(
  exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and tablename = 'medicine_schedules'
      and indexname = 'medicine_schedules_user_stopped_idx'
  ),
  'medicine_schedules should index stopped lifecycle state'
);


select * from finish();

rollback;
