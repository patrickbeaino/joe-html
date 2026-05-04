create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);

create table if not exists public.works (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null default 'Promoreel',
  director text not null,
  vimeo_url text not null default '',
  image_path text not null,
  image_url text not null,
  image_style text not null default '',
  image_alt text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists works_set_updated_at on public.works;
create trigger works_set_updated_at
before update on public.works
for each row
execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt()->>'email', ''))
  );
$$;

alter table public.admin_users enable row level security;
alter table public.works enable row level security;

drop policy if exists "Admins can read admin_users" on public.admin_users;
create policy "Admins can read admin_users"
on public.admin_users
for select
to authenticated
using (public.is_admin());

drop policy if exists "Public can read works" on public.works;
create policy "Public can read works"
on public.works
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert works" on public.works;
create policy "Admins can insert works"
on public.works
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update works" on public.works;
create policy "Admins can update works"
on public.works
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete works" on public.works;
create policy "Admins can delete works"
on public.works
for delete
to authenticated
using (public.is_admin());

insert into storage.buckets (id, name, public)
values ('works-images', 'works-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can read works images" on storage.objects;
create policy "Public can read works images"
on storage.objects
for select
to public
using (bucket_id = 'works-images');

drop policy if exists "Admins can upload works images" on storage.objects;
create policy "Admins can upload works images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'works-images' and public.is_admin());

drop policy if exists "Admins can update works images" on storage.objects;
create policy "Admins can update works images"
on storage.objects
for update
to authenticated
using (bucket_id = 'works-images' and public.is_admin())
with check (bucket_id = 'works-images' and public.is_admin());

drop policy if exists "Admins can delete works images" on storage.objects;
create policy "Admins can delete works images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'works-images' and public.is_admin());
