import { describe, it, expect } from "vitest";

// Import types from the shared database types module
import type {
  DashboardData,
  KpiSummary,
  Metric,
  Task,
  Notification,
} from "~/types/database";

describe("Database types shape", () => {
  // Fixture that mirrors the metrics API response
  const dashboardFixture: DashboardData = {
    kpis: [
      { label: "Monthly Revenue", value: "$84,200", change: "+18.3%", trend: "up" },
      { label: "Active Users", value: "12,480", change: "+7.1%", trend: "up" },
      { label: "Avg. Session", value: "4m 32s", change: "+0.8%", trend: "up" },
      { label: "Bounce Rate", value: "31.4%", change: "-2.1%", trend: "up" },
    ],
    revenueHistory: [
      { period: "2025-01", value: 62400 },
      { period: "2025-02", value: 58900 },
    ],
    userHistory: [
      { period: "2025-01", value: 8200 },
      { period: "2025-02", value: 8900 },
    ],
  };

  it("kpis array has required fields", () => {
    dashboardFixture.kpis.forEach((kpi: KpiSummary) => {
      expect(kpi).toHaveProperty("label");
      expect(kpi).toHaveProperty("value");
      expect(kpi).toHaveProperty("change");
      expect(["up", "down"]).toContain(kpi.trend);
    });
  });

  it("revenueHistory entries have period and value fields", () => {
    dashboardFixture.revenueHistory.forEach((pt) => {
      expect(typeof pt.period).toBe("string");
      expect(typeof pt.value).toBe("number");
      expect(pt.value).toBeGreaterThanOrEqual(0);
    });
  });

  it("userHistory entries have period and value fields", () => {
    dashboardFixture.userHistory.forEach((pt) => {
      expect(typeof pt.period).toBe("string");
      expect(typeof pt.value).toBe("number");
      expect(pt.value).toBeGreaterThanOrEqual(0);
    });
  });

  it("fixture has exactly 4 KPIs", () => {
    expect(dashboardFixture.kpis).toHaveLength(4);
  });

  it("Metric type has required fields", () => {
    const metric: Metric = {
      id: "m1",
      name: "revenue",
      value: 84200,
      period: "2025-12",
      category: "financial",
      recorded_at: "2025-12-31T23:59:59Z",
    };
    expect(metric.name).toBe("revenue");
    expect(typeof metric.value).toBe("number");
  });

  it("Task type has required fields", () => {
    const task: Task = {
      id: "t1",
      title: "Test task",
      description: "A test",
      status: "pending",
      priority: "medium",
      assigned_to: null,
      due_date: null,
      created_at: "2025-01-01T00:00:00Z",
      updated_at: "2025-01-01T00:00:00Z",
    };
    expect(task.status).toBe("pending");
    expect(task.priority).toBe("medium");
  });

  it("Notification type has required fields", () => {
    const notif: Notification = {
      id: "n1",
      user_id: "u1",
      title: "Welcome",
      message: "Hello!",
      read: false,
      created_at: "2025-01-01T00:00:00Z",
    };
    expect(notif.read).toBe(false);
    expect(notif.title).toBe("Welcome");
  });
});
