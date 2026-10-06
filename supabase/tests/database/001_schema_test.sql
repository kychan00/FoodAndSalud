begin;

create extension if not exists pgtap with schema extensions;

select plan(10);

select has_table(
  'public',
  'profiles',
  'profiles table should exist'
);

select has_table(
  'public',
  'foods',
  'foods table should exist'
);

select has_table(
  'public',
  'food_entries',
  'food_entries table should exist'
);

select has_table(
  'public',
  'food_entry_items',
  'food_entry_items table should exist'
);

select has_table(
  'public',
  'bathroom_entries',
  'bathroom_entries table should exist'
);

select ok(
  (
    select relrowsecurity
    from pg_class
    where oid = 'public.profiles'::regclass
  ),
  'RLS should be enabled on profiles'
);

select ok(
  (
    select relrowsecurity
    from pg_class
    where oid = 'public.foods'::regclass
  ),
  'RLS should be enabled on foods'
);

select ok(
  (
    select relrowsecurity
    from pg_class
    where oid = 'public.food_entries'::regclass
  ),
  'RLS should be enabled on food_entries'
);

select ok(
  (
    select relrowsecurity
    from pg_class
    where oid = 'public.food_entry_items'::regclass
  ),
  'RLS should be enabled on food_entry_items'
);

select ok(
  (
    select relrowsecurity
    from pg_class
    where oid = 'public.bathroom_entries'::regclass
  ),
  'RLS should be enabled on bathroom_entries'
);

select * from finish();

rollback;
