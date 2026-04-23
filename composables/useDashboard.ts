import type { DashboardData } from "~/types/database";

/**
 * Composable for fetching dashboard metrics from Supabase.
 * Uses the authenticated /api/metrics endpoint.
 */
export function useDashboard() {
  const { authFetch } = useAuth();

  const data = useState<DashboardData | null>("dashboard-data", () => null);
  const pending = useState<boolean>("dashboard-pending", () => false);
  const error = useState<string | null>("dashboard-error", () => null);

  async function refresh(months?: number) {
    pending.value = true;
    error.value = null;
    try {
      const qs = months ? `?months=${months}` : "";
      data.value = await authFetch<DashboardData>(`/api/metrics${qs}`);
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to load dashboard data";
    } finally {
      pending.value = false;
    }
  }

  return { data, pending, error, refresh };
}
