import type { DashboardData } from "~/server/api/dashboard.get";

export function useDashboard(period: Ref<string>) {
  const { data, pending, error, refresh } = useLazyFetch<DashboardData>(
    () => `/api/dashboard?period=${period.value}`,
    { watch: [period] }
  );
  return { data, pending, error, refresh };
}
