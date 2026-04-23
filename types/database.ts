/** Database row types matching the Supabase schema */

export interface Profile {
  id: string;
  full_name: string | null;
  role: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Metric {
  id: string;
  name: string;
  value: number;
  period: string | null;
  category: string | null;
  recorded_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assigned_to: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskWithAssignee extends Task {
  profiles: Profile | null;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string | null;
  read: boolean;
  created_at: string;
}

/** KPI summary computed from metrics */
export interface KpiSummary {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

/** Dashboard overview response */
export interface DashboardData {
  kpis: KpiSummary[];
  revenueHistory: { period: string; value: number }[];
  userHistory: { period: string; value: number }[];
}

/** Task list response */
export interface TaskListResponse {
  tasks: TaskWithAssignee[];
  total: number;
}

/** Notification list response */
export interface NotificationListResponse {
  notifications: Notification[];
  unread_count: number;
}

/** Create/update task payload */
export interface TaskPayload {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  assigned_to?: string;
  due_date?: string;
}
