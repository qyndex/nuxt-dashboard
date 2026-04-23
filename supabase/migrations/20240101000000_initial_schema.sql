-- ============================================================
-- Nuxt Dashboard — Initial Schema
-- ============================================================

-- 1. Profiles (auto-created on user signup via trigger)
create table if not exists profiles (
  id          uuid primary key references auth.users on delete cascade,
  full_name   text,
  role        text default 'viewer',
  avatar_url  text,
  created_at  timestamptz not null default now()
);

-- 2. Metrics (time-series dashboard data)
create table if not exists metrics (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  value       numeric not null,
  period      text,
  category    text,
  recorded_at timestamptz not null default now()
);

-- 3. Tasks
create table if not exists tasks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  status      text not null default 'pending',
  priority    text not null default 'medium',
  assigned_to uuid references auth.users on delete set null,
  due_date    date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 4. Notifications
create table if not exists notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users on delete cascade not null,
  title       text not null,
  message     text,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- Indexes
-- ============================================================
create index if not exists idx_metrics_name on metrics(name);
create index if not exists idx_metrics_recorded on metrics(recorded_at desc);
create index if not exists idx_metrics_category on metrics(category);
create index if not exists idx_tasks_status on tasks(status);
create index if not exists idx_tasks_assigned on tasks(assigned_to);
create index if not exists idx_tasks_priority on tasks(priority);
create index if not exists idx_notifications_user on notifications(user_id);
create index if not exists idx_notifications_read on notifications(user_id, read);

-- ============================================================
-- RLS Policies
-- ============================================================

-- Profiles: publicly readable, owners can update their own
alter table profiles enable row level security;

create policy "Profiles are publicly readable"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Metrics: readable by all authenticated users, insertable by admins
alter table metrics enable row level security;

create policy "Authenticated users can read metrics"
  on metrics for select
  using (auth.role() = 'authenticated');

create policy "Admins can insert metrics"
  on metrics for insert
  with check (
    exists (
      select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Admins can update metrics"
  on metrics for update
  using (
    exists (
      select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Tasks: authenticated users can read all, assigned user or admin can modify
alter table tasks enable row level security;

create policy "Authenticated users can read tasks"
  on tasks for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can create tasks"
  on tasks for insert
  with check (auth.role() = 'authenticated');

create policy "Assigned user or admin can update tasks"
  on tasks for update
  using (
    auth.uid() = assigned_to
    or exists (
      select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Admin can delete tasks"
  on tasks for delete
  using (
    exists (
      select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Notifications: users can only access their own
alter table notifications enable row level security;

create policy "Users can read own notifications"
  on notifications for select
  using (auth.uid() = user_id);

create policy "System can insert notifications"
  on notifications for insert
  with check (auth.uid() = user_id);

create policy "Users can update own notifications"
  on notifications for update
  using (auth.uid() = user_id);

-- ============================================================
-- Triggers
-- ============================================================

-- Auto-create profile on user signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Auto-update updated_at on tasks
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger tasks_updated_at
  before update on tasks
  for each row execute function update_updated_at();
