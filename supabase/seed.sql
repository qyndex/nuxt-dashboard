-- ============================================================
-- Seed Data — Nuxt Dashboard
-- ============================================================
-- Note: In production, profiles are auto-created via trigger on auth.users.
-- For local dev with Supabase CLI, create test users first via the dashboard
-- or `supabase auth signup`, then seed profiles here.

-- 3 user profiles (UUIDs match test users created in Supabase dashboard)
insert into profiles (id, full_name, role, avatar_url) values
  ('d0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a', 'Alice Kim', 'admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice'),
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Bob Martinez', 'editor', 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob'),
  ('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'Carol Singh', 'viewer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol')
on conflict (id) do nothing;

-- 12 months of revenue metrics
insert into metrics (name, value, period, category, recorded_at) values
  ('revenue', 62400, '2025-01', 'financial', '2025-01-31T23:59:59Z'),
  ('revenue', 58900, '2025-02', 'financial', '2025-02-28T23:59:59Z'),
  ('revenue', 67100, '2025-03', 'financial', '2025-03-31T23:59:59Z'),
  ('revenue', 71300, '2025-04', 'financial', '2025-04-30T23:59:59Z'),
  ('revenue', 69800, '2025-05', 'financial', '2025-05-31T23:59:59Z'),
  ('revenue', 74200, '2025-06', 'financial', '2025-06-30T23:59:59Z'),
  ('revenue', 78500, '2025-07', 'financial', '2025-07-31T23:59:59Z'),
  ('revenue', 76100, '2025-08', 'financial', '2025-08-31T23:59:59Z'),
  ('revenue', 80900, '2025-09', 'financial', '2025-09-30T23:59:59Z'),
  ('revenue', 82300, '2025-10', 'financial', '2025-10-31T23:59:59Z'),
  ('revenue', 79600, '2025-11', 'financial', '2025-11-30T23:59:59Z'),
  ('revenue', 84200, '2025-12', 'financial', '2025-12-31T23:59:59Z');

-- 12 months of active users metrics
insert into metrics (name, value, period, category, recorded_at) values
  ('active_users', 8200, '2025-01', 'engagement', '2025-01-31T23:59:59Z'),
  ('active_users', 8900, '2025-02', 'engagement', '2025-02-28T23:59:59Z'),
  ('active_users', 9400, '2025-03', 'engagement', '2025-03-31T23:59:59Z'),
  ('active_users', 9800, '2025-04', 'engagement', '2025-04-30T23:59:59Z'),
  ('active_users', 10200, '2025-05', 'engagement', '2025-05-31T23:59:59Z'),
  ('active_users', 10600, '2025-06', 'engagement', '2025-06-30T23:59:59Z'),
  ('active_users', 11100, '2025-07', 'engagement', '2025-07-31T23:59:59Z'),
  ('active_users', 10800, '2025-08', 'engagement', '2025-08-31T23:59:59Z'),
  ('active_users', 11500, '2025-09', 'engagement', '2025-09-30T23:59:59Z'),
  ('active_users', 11900, '2025-10', 'engagement', '2025-10-31T23:59:59Z'),
  ('active_users', 12100, '2025-11', 'engagement', '2025-11-30T23:59:59Z'),
  ('active_users', 12480, '2025-12', 'engagement', '2025-12-31T23:59:59Z');

-- 12 months of avg session duration metrics (in seconds)
insert into metrics (name, value, period, category, recorded_at) values
  ('avg_session_seconds', 248, '2025-01', 'engagement', '2025-01-31T23:59:59Z'),
  ('avg_session_seconds', 252, '2025-02', 'engagement', '2025-02-28T23:59:59Z'),
  ('avg_session_seconds', 256, '2025-03', 'engagement', '2025-03-31T23:59:59Z'),
  ('avg_session_seconds', 260, '2025-04', 'engagement', '2025-04-30T23:59:59Z'),
  ('avg_session_seconds', 258, '2025-05', 'engagement', '2025-05-31T23:59:59Z'),
  ('avg_session_seconds', 264, '2025-06', 'engagement', '2025-06-30T23:59:59Z'),
  ('avg_session_seconds', 268, '2025-07', 'engagement', '2025-07-31T23:59:59Z'),
  ('avg_session_seconds', 262, '2025-08', 'engagement', '2025-08-31T23:59:59Z'),
  ('avg_session_seconds', 270, '2025-09', 'engagement', '2025-09-30T23:59:59Z'),
  ('avg_session_seconds', 272, '2025-10', 'engagement', '2025-10-31T23:59:59Z'),
  ('avg_session_seconds', 268, '2025-11', 'engagement', '2025-11-30T23:59:59Z'),
  ('avg_session_seconds', 272, '2025-12', 'engagement', '2025-12-31T23:59:59Z');

-- 12 months of bounce rate metrics (percentage)
insert into metrics (name, value, period, category, recorded_at) values
  ('bounce_rate', 38.2, '2025-01', 'engagement', '2025-01-31T23:59:59Z'),
  ('bounce_rate', 36.8, '2025-02', 'engagement', '2025-02-28T23:59:59Z'),
  ('bounce_rate', 35.4, '2025-03', 'engagement', '2025-03-31T23:59:59Z'),
  ('bounce_rate', 34.9, '2025-04', 'engagement', '2025-04-30T23:59:59Z'),
  ('bounce_rate', 35.1, '2025-05', 'engagement', '2025-05-31T23:59:59Z'),
  ('bounce_rate', 34.2, '2025-06', 'engagement', '2025-06-30T23:59:59Z'),
  ('bounce_rate', 33.5, '2025-07', 'engagement', '2025-07-31T23:59:59Z'),
  ('bounce_rate', 33.8, '2025-08', 'engagement', '2025-08-31T23:59:59Z'),
  ('bounce_rate', 32.6, '2025-09', 'engagement', '2025-09-30T23:59:59Z'),
  ('bounce_rate', 32.1, '2025-10', 'engagement', '2025-10-31T23:59:59Z'),
  ('bounce_rate', 31.8, '2025-11', 'engagement', '2025-11-30T23:59:59Z'),
  ('bounce_rate', 31.4, '2025-12', 'engagement', '2025-12-31T23:59:59Z');

-- 8 tasks with various statuses and priorities
insert into tasks (id, title, description, status, priority, assigned_to, due_date) values
  ('t0000001-0000-0000-0000-000000000001', 'Set up CI/CD pipeline', 'Configure GitHub Actions for automated testing and deployment', 'completed', 'high', 'd0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a', '2025-12-15'),
  ('t0000001-0000-0000-0000-000000000002', 'Design system documentation', 'Document all component APIs and usage patterns', 'in_progress', 'medium', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '2026-01-10'),
  ('t0000001-0000-0000-0000-000000000003', 'Implement dark mode', 'Add theme toggle with system preference detection', 'pending', 'low', 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', '2026-02-01'),
  ('t0000001-0000-0000-0000-000000000004', 'API rate limiting', 'Add rate limiting middleware to all public endpoints', 'in_progress', 'high', 'd0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a', '2026-01-20'),
  ('t0000001-0000-0000-0000-000000000005', 'User onboarding flow', 'Create step-by-step onboarding wizard for new users', 'pending', 'medium', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '2026-02-15'),
  ('t0000001-0000-0000-0000-000000000006', 'Performance audit', 'Run Lighthouse and fix performance bottlenecks', 'pending', 'high', 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', '2026-01-30'),
  ('t0000001-0000-0000-0000-000000000007', 'Export dashboard to PDF', 'Allow users to export dashboard view as PDF report', 'completed', 'medium', 'd0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a', '2025-12-20'),
  ('t0000001-0000-0000-0000-000000000008', 'Mobile responsive fixes', 'Fix layout issues on screens smaller than 768px', 'in_progress', 'high', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '2026-01-05');

-- 5 notifications for Alice (admin user)
insert into notifications (user_id, title, message, read, created_at) values
  ('d0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a', 'Welcome to DataKit', 'Your dashboard is ready. Start by exploring the metrics overview.', true, '2025-12-01T09:00:00Z'),
  ('d0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a', 'Task completed', 'Bob completed "Export dashboard to PDF".', true, '2025-12-21T14:30:00Z'),
  ('d0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a', 'New team member', 'Carol Singh joined the workspace.', false, '2026-01-02T10:15:00Z'),
  ('d0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a', 'Weekly report ready', 'Your weekly analytics report for Dec 25-31 is available.', false, '2026-01-01T08:00:00Z'),
  ('d0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a', 'System update', 'Dashboard v2.1 deployed with improved chart rendering.', false, '2026-01-03T16:45:00Z');
