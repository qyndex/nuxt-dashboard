import { describe, it, expect, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { ref, readonly } from "vue";
import DashTopbar from "~/components/DashTopbar.vue";

// Mock useAuth
vi.stubGlobal("useAuth", vi.fn(() => ({
  user: readonly(ref({ email: "alice@example.com", user_metadata: { full_name: "Alice Kim" } })),
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

// Mock useNotifications
vi.stubGlobal("useNotifications", vi.fn(() => ({
  notifications: readonly(ref(null)),
  loading: readonly(ref(false)),
  error: readonly(ref(null)),
  unreadCount: ref(3),
  fetchNotifications: vi.fn(),
  markAsRead: vi.fn(),
  markAllAsRead: vi.fn(),
})));

describe("DashTopbar", () => {
  it("renders the header element", async () => {
    const wrapper = await mountSuspended(DashTopbar);
    expect(wrapper.find("header.topbar").exists()).toBe(true);
  });

  it("renders the breadcrumb with 'Dashboard' text", async () => {
    const wrapper = await mountSuspended(DashTopbar);
    const breadcrumb = wrapper.find('[aria-label="Breadcrumb"]');
    expect(breadcrumb.exists()).toBe(true);
    expect(breadcrumb.text()).toContain("Dashboard");
  });

  it("renders the notifications button with accessible label", async () => {
    const wrapper = await mountSuspended(DashTopbar);
    const btn = wrapper.find('[aria-label="Notifications"]');
    expect(btn.exists()).toBe(true);
    expect(btn.element.tagName).toBe("BUTTON");
  });

  it("renders the user avatar element with accessible label", async () => {
    const wrapper = await mountSuspended(DashTopbar);
    const avatar = wrapper.find('[aria-label="User menu"]');
    expect(avatar.exists()).toBe(true);
    expect(avatar.text()).toBe("AK");
  });

  it("avatar has role=button and is keyboard-focusable", async () => {
    const wrapper = await mountSuspended(DashTopbar);
    const avatar = wrapper.find('[aria-label="User menu"]');
    expect(avatar.attributes("role")).toBe("button");
    expect(avatar.attributes("tabindex")).toBe("0");
  });
});
