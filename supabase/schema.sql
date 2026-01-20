-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, role, "updatedAt")
  values (new.id::text, new.email, 'member', now())
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Trigger execution
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ENABLE RLS
alter table public.profiles enable row level security;
alter table public.forms enable row level security;
alter table public.form_fields enable row level security;
alter table public.submissions enable row level security;
alter table public.submission_values enable row level security;

-- HELPER FOR ADMIN CHECK
create or replace function public.is_admin()
returns boolean
language sql
security definer
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()::text and role = 'admin'
  );
$$;

-- PROFILES POLICIES
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using ( auth.uid()::text = id );

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
  on public.profiles for select
  using ( is_admin() );

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid()::text = id );

-- FORMS POLICIES
drop policy if exists "Admins can do everything on forms" on public.forms;
drop policy if exists "Users can manage own forms" on public.forms;
create policy "Users can manage own forms"
  on public.forms for all
  using ( auth.uid()::text = "userId" );

drop policy if exists "Public/Members can view published forms" on public.forms;
create policy "Public/Members can view published forms"
  on public.forms for select
  using ( published = true or auth.uid()::text = "userId" );

-- FORM FIELDS POLICIES
drop policy if exists "Admins can do everything on form_fields" on public.form_fields;
drop policy if exists "Users can manage own form fields" on public.form_fields;
create policy "Users can manage own form fields"
  on public.form_fields for all
  using (
    exists (
      select 1 from public.forms
      where id = form_fields."formId" and "userId" = auth.uid()::text
    )
  );

drop policy if exists "Public/Members can view fields of published forms" on public.form_fields;
create policy "Public/Members can view fields of published forms"
  on public.form_fields for select
  using (
    exists (
      select 1 from public.forms
      where id = form_fields."formId" and (published = true or "userId" = auth.uid()::text)
    )
  );

-- SUBMISSIONS POLICIES
drop policy if exists "Admins/Owners can view submissions" on public.submissions;
create policy "Admins/Owners can view submissions"
  on public.submissions for select
  using ( 
    is_admin() or 
    exists (
      select 1 from public.forms
      where id = submissions."formId" and "userId" = auth.uid()::text
    )
  );

drop policy if exists "Anyone can create submissions (for public forms)" on public.submissions;
create policy "Anyone can create submissions (for public forms)"
  on public.submissions for insert
  with check ( true ); 

-- SUBMISSION VALUES POLICIES
drop policy if exists "Admins/Owners can view submission values" on public.submission_values;
create policy "Admins/Owners can view submission values"
  on public.submission_values for select
  using ( 
    is_admin() or 
    exists (
      select 1 from public.submissions s
      join public.forms f on f.id = s."formId"
      where s.id = submission_values."submissionId" and f."userId" = auth.uid()::text
    )
  );

drop policy if exists "Anyone can insert submission values" on public.submission_values;
create policy "Anyone can insert submission values"
  on public.submission_values for insert
  with check ( true );
