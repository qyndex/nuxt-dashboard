import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref, readonly } from "vue";

// Mock useAuth before importing the composable
const mockAuthFetch = vi.fn();

vi.stubGlobal("useAuth", vi.fn(() => ({
  user: readonly(ref(null)),
  session: readonly(ref(null)),
  loading: readonly(ref(false)),
  supabase: readonly(ref(null)),
  init: vi.fn(),
  login: vi.fn(),
  signup: vi.fn(),
  logout: vi.fn(),
  getAccessToken: vi.fn(() => null),
  authFetch: mockAuthFetch,
})));

vi.stubGlobal("useState", vi.fn((key: string, init?: () => unknown) => {
  return ref(init ? init() : null);
}));

// Dynamic import to pick up the stubs applied above
const { useDashboard } = await import("~/composables/useDashboard");

describe("useDashboard composable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns data, pending, error, and refresh", () => {
    const result = useDashboard();
    expect(result).toHaveProperty("data");
    expect(result).toHaveProperty("pending");
    expect(result).toHaveProperty("error");
    expect(result).toHaveProperty("refresh");
    expect(typeof result.refresh).toBe("function");
  });

  it("calls authFetch with /api/metrics when refresh is called", async () => {
    mockAuthFetch.mockResolvedValue({ kpis: [], revenueHistory: [], userHistory: [] });
    const { refresh } = useDashboard();
    await refresh();
    expect(mockAuthFetch).toHaveBeenCalledWith("/api/metrics");
  });

  it("calls authFetch with months param when provided", async () => {
    mockAuthFetch.mockResolvedValue({ kpis: [], revenueHistory: [], userHistory: [] });
    const { refresh } = useDashboard();
    await refresh(6);
    expect(mockAuthFetch).toHaveBeenCalledWith("/api/metrics?months=6");
  });

  it("sets error when authFetch fails", async () => {
    mockAuthFetch.mockRejectedValue(new Error("Network error"));
    const { refresh, error } = useDashboard();
    await refresh();
    expect(error.value).toBe("Network error");
  });

  it("sets data when authFetch succeeds", async () => {
    const mockData = {
      kpis: [{ label: "Test", value: "42", change: "+1%", trend: "up" }],
      revenueHistory: [],
      userHistory: [],
    };
    mockAuthFetch.mockResolvedValue(mockData);
    const { refresh, data } = useDashboard();
    await refresh();
    expect(data.value).toEqual(mockData);
  });
});
