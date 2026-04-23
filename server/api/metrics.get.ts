import type { DashboardData, KpiSummary } from "~/types/database";

/**
 * GET /api/metrics
 * Fetch dashboard KPI summaries and historical metric data.
 *
 * Query params:
 *   ?months=<number>  -- number of months of history (default 12, max 24)
 */
export default defineEventHandler(async (event) => {
  const { user, client } = await requireAuth(event);

  const query = getQuery(event);
  const months = Math.min(24, Math.max(1, Number(query.months) || 12));

  // Fetch metrics ordered by recorded_at
  const { data: metrics, error } = await client
    .from("metrics")
    .select("*")
    .order("recorded_at", { ascending: true });

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch metrics",
    });
  }

  const rows = metrics ?? [];

  // Compute KPIs from the latest data points
  const latestRevenue = rows.filter((m) => m.name === "revenue").slice(-1)[0];
  const prevRevenue = rows.filter((m) => m.name === "revenue").slice(-2, -1)[0];
  const latestUsers = rows.filter((m) => m.name === "active_users").slice(-1)[0];
  const prevUsers = rows.filter((m) => m.name === "active_users").slice(-2, -1)[0];
  const latestSession = rows.filter((m) => m.name === "avg_session_seconds").slice(-1)[0];
  const prevSession = rows.filter((m) => m.name === "avg_session_seconds").slice(-2, -1)[0];
  const latestBounce = rows.filter((m) => m.name === "bounce_rate").slice(-1)[0];
  const prevBounce = rows.filter((m) => m.name === "bounce_rate").slice(-2, -1)[0];

  function pctChange(current: number, previous: number): { change: string; trend: "up" | "down" } {
    if (!previous) return { change: "N/A", trend: "up" };
    const pct = ((current - previous) / previous) * 100;
    return {
      change: `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`,
      trend: pct >= 0 ? "up" : "down",
    };
  }

  function formatSeconds(s: number): string {
    const mins = Math.floor(s / 60);
    const secs = Math.round(s % 60);
    return `${mins}m ${secs}s`;
  }

  const kpis: KpiSummary[] = [
    {
      label: "Monthly Revenue",
      value: latestRevenue ? `$${Number(latestRevenue.value).toLocaleString()}` : "$0",
      ...pctChange(Number(latestRevenue?.value ?? 0), Number(prevRevenue?.value ?? 0)),
    },
    {
      label: "Active Users",
      value: latestUsers ? Number(latestUsers.value).toLocaleString() : "0",
      ...pctChange(Number(latestUsers?.value ?? 0), Number(prevUsers?.value ?? 0)),
    },
    {
      label: "Avg. Session",
      value: latestSession ? formatSeconds(Number(latestSession.value)) : "0m 0s",
      ...pctChange(Number(latestSession?.value ?? 0), Number(prevSession?.value ?? 0)),
    },
    {
      label: "Bounce Rate",
      value: latestBounce ? `${Number(latestBounce.value).toFixed(1)}%` : "0%",
      // For bounce rate, lower is better so invert the trend
      change: pctChange(Number(latestBounce?.value ?? 0), Number(prevBounce?.value ?? 0)).change,
      trend: Number(latestBounce?.value ?? 0) <= Number(prevBounce?.value ?? 0) ? "up" : "down",
    },
  ];

  // Build history series (limited to requested months)
  const revenueHistory = rows
    .filter((m) => m.name === "revenue")
    .slice(-months)
    .map((m) => ({ period: m.period ?? "", value: Number(m.value) }));

  const userHistory = rows
    .filter((m) => m.name === "active_users")
    .slice(-months)
    .map((m) => ({ period: m.period ?? "", value: Number(m.value) }));

  const result: DashboardData = { kpis, revenueHistory, userHistory };
  return result;
});
