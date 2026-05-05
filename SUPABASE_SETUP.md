# Supabase Setup

## 1. Create the project resources
- Create a Supabase project.
- Open the SQL editor and run [supabase/setup.sql](/Users/patrickbeaino/Documents/Patrick/joe-html/supabase/setup.sql).

## 2. Create the admin user
- In Supabase Dashboard, go to `Authentication` -> `Users`.
- Create the admin user manually with the email address you want to use for `/admin`.
- Add the same email to `public.admin_users`:

```sql
insert into public.admin_users (email)
values ('you@example.com')
on conflict (email) do nothing;
```

## 3. Fill the client config
- Edit [assets/js/supabase-config.js](/Users/patrickbeaino/Documents/Patrick/joe-html/assets/js/supabase-config.js).
- Replace:
  - `YOUR_SUPABASE_PROJECT_URL`
  - `YOUR_SUPABASE_PUBLISHABLE_KEY`
  - `YOUR_ADMIN_EMAIL`

Use the publishable/anon key from `Settings` -> `API`. Do not use the service role key in the browser.

## 4. Seed the existing works
- In Supabase SQL Editor, run [supabase/seed-works.sql](/Users/patrickbeaino/Documents/Patrick/joe-html/supabase/seed-works.sql).
- This seeds the 28 works that are currently hardcoded in `index.html`.
- It updates existing rows that match the same `title` + `director`.
- It inserts any missing rows from the current catalog.
- The image references now point to `/assets-2/catalog/*`, so make sure those files are deployed with the site before relying on the seeded records.

## 5. Deploy
- Deploy the repo to Cloudflare Pages.
- `/admin` should be served from `/admin/index.html`.
- The public site will switch to the Supabase works list when the table has rows.
