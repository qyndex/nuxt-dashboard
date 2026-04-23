import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import DashTopbar from "~/components/DashTopbar.vue";

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
