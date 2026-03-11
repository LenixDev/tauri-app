-- profiles table
  create table profiles (
    id uuid references auth.users(id) on delete cascade,
    role text not null check (role in ('manager', 'student')),
    primary key (id)
  );

-- functions
  create or replace function create_student(
    student_id text,
    student_password text
  )
  returns void
  language plpgsql
  security definer
  as $$
  begin
    if (select role from profiles where id = auth.uid()) != 'manager' then
      raise exception 'Access denied';
    end if;

    perform auth.create_user(
      json_build_object(
        'email', student_id || '@institute.local',
        'password', student_password,
        'email_confirm', true
      )
    );
  end;
  $$;

-- seed manager profile
  insert into profiles (id, role)
  values (
    (select id from auth.users where email = '6901120@institute.local'),
    'manager'
  );

-- RLS
  alter table profiles enable row level security;

-- policies
create policy "users can read own profile"
on profiles for select
using (auth.uid() = id);