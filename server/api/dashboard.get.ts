/**
 * GET /api/dashboard
 * Legacy endpoint -- provides backward compatibility.
 * New code should use /api/metrics instead.
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  try {
    const { user, client } = await requireAuth(event);

    const { data: metrics, error } = await client
      .from("metrics")
      .select("*")
      .order("recorded_at", { ascending: true });

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to fetch dashboard data",
      });
    }

    const rows = metrics ?? [];

    const latestRevenue = rows.filter((m) => m.name === "revenue").slice(-1)[0];
    const prevRevenue = rows.filter((m) => m.name === "revenue").slice(-2, -1)[0];
    const latestUsers = rows.filter((m) => m.name === "active_users").slice(-1)[0];
    const prevUsers = rows.filter((m) => m.name === "active_users").slice(-2, -1)[0];
    const latestSession = rows.filter((m) => m.name === "avg_session_seconds").slice(-1)[0];
    const prevSession = rows.filter((m) => m.name === "avg_session_seconds").slice(-2, -1)[0];
    const latestBounce = rows.filter((m) => m.name === "bounce_rate").slice(-1)[0];
    const prevBounce = rows.filter((m) => m.name === "bounce_rate").slice(-2, -1)[0];

    function pctChange(current: number, previous: number) {
      if (!previous) return { change: "N/A", trend: "up" as const };
      const pct = ((current - previous) / previous) * 100;
      return {
        change: `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`,
        trend: (pct >= 0 ? "up" : "down") as "up" | "down",
      };
    }

    function formatSeconds(s: number) {
      return `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`;
    }

    return {
      kpis: [
        { label: "Monthly Revenue", value: latestRevenue ? `$${Number(latestRevenue.value).toLocaleString()}` : "$0", ...pctChange(Number(latestRevenue?.value ?? 0), Number(prevRevenue?.value ?? 0)) },
        { label: "Active Users", value: latestUsers ? Number(latestUsers.value).toLocaleString() : "0", ...pctChange(Number(latestUsers?.value ?? 0), Number(prevUsers?.value ?? 0)) },
        { label: "Avg. Session", value: latestSession ? formatSeconds(Number(latestSession.value)) : "0m 0s", ...pctChange(Number(latestSession?.value ?? 0), Number(prevSession?.value ?? 0)) },
        { label: "Bounce Rate", value: latestBounce ? `${Number(latestBounce.value).toFixed(1)}%` : "0%", change: pctChange(Number(latestBounce?.value ?? 0), Number(prevBounce?.value ?? 0)).change, trend: Number(latestBounce?.value ?? 0) <= Number(prevBounce?.value ?? 0) ? "up" as const : "down" as const },
      ],
      revenueHistory: rows.filter((m) => m.name === "revenue").map((m) => ({ period: m.period ?? "", value: Number(m.value) })),
      userHistory: rows.filter((m) => m.name === "active_users").map((m) => ({ period: m.period ?? "", value: Number(m.value) })),
    };
  } catch {
    return { kpis: [], revenueHistory: [], userHistory: [] };
  }
});
