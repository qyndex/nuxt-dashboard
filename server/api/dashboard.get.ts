export interface KPI {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

export interface DauPoint { date: string; users: number; }
export interface TrafficSource { source: string; sessions: number; color: string; }
export interface AppEvent { id: string; type: string; user: string; timestamp: string; details: string; }

export interface DashboardData {
  kpis: KPI[];
  dauSeries: DauPoint[];
  trafficSources: TrafficSource[];
  recentEvents: AppEvent[];
}

export default defineEventHandler(async (event): Promise<DashboardData> => {
  const query = getQuery(event);
  const _period = (query.period as string) || "30d";

  return {
    kpis: [
      { label: "Monthly Revenue", value: "$84,200", change: "+18.3%", trend: "up" },
      { label: "Active Users", value: "12,480", change: "+7.1%", trend: "up" },
      { label: "Avg. Session", value: "4m 32s", change: "+0.8%", trend: "up" },
      { label: "Bounce Rate", value: "31.4%", change: "-2.1%", trend: "up" },
    ],
    dauSeries: [
      { date: "2026-03-01", users: 980 },
      { date: "2026-03-08", users: 1120 },
      { date: "2026-03-15", users: 1340 },
      { date: "2026-03-22", users: 1180 },
      { date: "2026-03-29", users: 1480 },
    ],
    trafficSources: [
      { source: "Organic", sessions: 5200, color: "#1e40af" },
      { source: "Direct", sessions: 3100, color: "#7c3aed" },
      { source: "Referral", sessions: 2200, color: "#0891b2" },
      { source: "Social", sessions: 1900, color: "#059669" },
    ],
    recentEvents: [
      { id: "e1", type: "signup", user: "alice@example.com", timestamp: "2026-03-21T14:30:00Z", details: "New user registration" },
      { id: "e2", type: "upgrade", user: "bob@example.com", timestamp: "2026-03-21T13:15:00Z", details: "Upgraded to Pro plan" },
      { id: "e3", type: "login", user: "carol@example.com", timestamp: "2026-03-21T12:00:00Z", details: "Successful login" },
    ],
  };
});
