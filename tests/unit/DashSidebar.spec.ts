import { describe, it, expect, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { ref, readonly } from "vue";
import DashSidebar from "~/components/DashSidebar.vue";

// Mock useAuth
vi.stubGlobal("useAuth", vi.fn(() => ({
  user: readonly(ref({ email: "alice@example.com" })),
  session: readonly(ref(null)),
  loading: readonly(ref(false)),
  supabase: readonly(ref(null)),
  init: vi.fn(),
  login: vi.fn(),
  signup: vi.fn(),
  logout: vi.fn(),
  getAccessToken: vi.fn(() => null),
  authFetch: vi.fn(),
})));

describe("DashSidebar", () => {
  it("renders an aside element with accessible label", async () => {
    const wrapper = await mountSuspended(DashSidebar);
    const aside = wrapper.find("aside.sidebar");
    expect(aside.exists()).toBe(true);
    expect(aside.attributes("aria-label")).toBe("Navigation sidebar");
  });

  it("renders the brand name DataKit", async () => {
    const wrapper = await mountSuspended(DashSidebar);
    expect(wrapper.text()).toContain("DataKit");
  });

  it("renders the navigation items", async () => {
    const wrapper = await mountSuspended(DashSidebar);
    const links = wrapper.findAll(".nav-link");
    expect(links.length).toBeGreaterThanOrEqual(3);
  });

  it("nav items contain expected labels", async () => {
    const wrapper = await mountSuspended(DashSidebar);
    const text = wrapper.text();
    expect(text).toContain("Overview");
    expect(text).toContain("Tasks");
    expect(text).toContain("Settings");
  });

  it("nav links are rendered inside a <nav> element", async () => {
    const wrapper = await mountSuspended(DashSidebar);
    const nav = wrapper.find("nav");
    expect(nav.exists()).toBe(true);
    const links = nav.findAll(".nav-link");
    expect(links.length).toBeGreaterThan(0);
  });

  it("the active link has aria-current='page' for the matching route", async () => {
    const wrapper = await mountSuspended(DashSidebar);
    const overviewLink = wrapper
      .findAll(".nav-link")
      .find((w) => w.text().includes("Overview"));
    expect(overviewLink).toBeDefined();
    expect(overviewLink!.attributes("aria-current")).toBe("page");
  });

  it("renders the sign out button when user is logged in", async () => {
    const wrapper = await mountSuspended(DashSidebar);
    const logoutBtn = wrapper.find('[aria-label="Sign out"]');
    expect(logoutBtn.exists()).toBe(true);
  });
});
