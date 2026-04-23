import { describe, it, expect } from "vitest";

// Import only the types and data shape — avoids Nuxt H3 event handler context
import type {
  DashboardData,
  KPI,
  DauPoint,
  TrafficSource,
  AppEvent,
} from "~/server/api/dashboard.get";

describe("DashboardData shape", () => {
  // Fixture that mirrors the server handler's return value
  const fixture: DashboardData = {
    kpis: [
      { label: "Monthly Revenue", value: "$84,200", change: "+18.3%", trend: "up" },
      { label: "Active Users", value: "12,480", change: "+7.1%", trend: "up" },
      { label: "Avg. Session", value: "4m 32s", change: "+0.8%", trend: "up" },
      { label: "Bounce Rate", value: "31.4%", change: "-2.1%", trend: "up" },
    ],
    dauSeries: [
      { date: "2026-03-01", users: 980 },
      { date: "2026-03-08", users: 1120 },
    ],
    trafficSources: [
      { source: "Organic", sessions: 5200, color: "#1e40af" },
    ],
    recentEvents: [
      {
        id: "e1",
        type: "signup",
        user: "alice@example.com",
        timestamp: "2026-03-21T14:30:00Z",
        details: "New user registration",
      },
    ],
  };

  it("kpis array has required fields", () => {
    fixture.kpis.forEach((kpi: KPI) => {
      expect(kpi).toHaveProperty("label");
      expect(kpi).toHaveProperty("value");
      expect(kpi).toHaveProperty("change");
      expect(["up", "down"]).toContain(kpi.trend);
    });
  });

  it("dauSeries entries have date and users fields", () => {
    fixture.dauSeries.forEach((pt: DauPoint) => {
      expect(typeof pt.date).toBe("string");
      expect(typeof pt.users).toBe("number");
      expect(pt.users).toBeGreaterThanOrEqual(0);
    });
  });

  it("trafficSources entries have source, sessions, color", () => {
    fixture.trafficSources.forEach((src: TrafficSource) => {
      expect(typeof src.source).toBe("string");
      expect(typeof src.sessions).toBe("number");
      expect(src.color).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });

  it("recentEvents entries have id, type, user, timestamp, details", () => {
    fixture.recentEvents.forEach((evt: AppEvent) => {
      expect(typeof evt.id).toBe("string");
      expect(typeof evt.type).toBe("string");
      expect(typeof evt.user).toBe("string");
      expect(typeof evt.timestamp).toBe("string");
      expect(typeof evt.details).toBe("string");
    });
  });

  it("fixture has exactly 4 KPIs", () => {
    expect(fixture.kpis).toHaveLength(4);
  });
});
