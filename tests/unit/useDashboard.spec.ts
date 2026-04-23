import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref } from "vue";

// Stub useLazyFetch before importing the composable so the Nuxt auto-import
// is not required in the unit test environment.
const mockReturn = {
  data: ref(null),
  pending: ref(false),
  error: ref(null),
  refresh: vi.fn(),
};

vi.stubGlobal("useLazyFetch", vi.fn(() => mockReturn));

// Dynamic import to pick up the stub applied above
const { useDashboard } = await import("~/composables/useDashboard");

describe("useDashboard composable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockReturn.data.value = null;
    mockReturn.pending.value = false;
    mockReturn.error.value = null;
  });

  it("calls useLazyFetch with the correct URL when period is '30d'", () => {
    const period = ref("30d");
    useDashboard(period);
    expect(useLazyFetch).toHaveBeenCalledOnce();
    // The first argument is a getter fn — call it to verify the URL
    const urlGetter = (useLazyFetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as () => string;
    expect(urlGetter()).toBe("/api/dashboard?period=30d");
  });

  it("passes the period ref in the watch option", () => {
    const period = ref("7d");
    useDashboard(period);
    const options = (useLazyFetch as ReturnType<typeof vi.fn>).mock
      .calls[0][1] as { watch: typeof period[] };
    expect(options.watch).toEqual([period]);
  });

  it("returns data, pending, error, and refresh", () => {
    const period = ref("90d");
    const result = useDashboard(period);
    expect(result).toHaveProperty("data");
    expect(result).toHaveProperty("pending");
    expect(result).toHaveProperty("error");
    expect(result).toHaveProperty("refresh");
    expect(typeof result.refresh).toBe("function");
  });

  it("reflects pending state from useLazyFetch", () => {
    mockReturn.pending.value = true;
    const period = ref("30d");
    const { pending } = useDashboard(period);
    expect(pending.value).toBe(true);
  });
});
