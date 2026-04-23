import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import DashSidebar from "~/components/DashSidebar.vue";

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

  it("renders all four navigation items", async () => {
    const wrapper = await mountSuspended(DashSidebar);
    const links = wrapper.findAll(".nav-link");
    expect(links).toHaveLength(4);
  });

  it("nav items contain expected labels", async () => {
    const wrapper = await mountSuspended(DashSidebar);
    const text = wrapper.text();
    expect(text).toContain("Overview");
    expect(text).toContain("Users");
    expect(text).toContain("Reports");
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
    // mountSuspended defaults route to '/' which matches Overview
    const wrapper = await mountSuspended(DashSidebar);
    const overviewLink = wrapper
      .findAll(".nav-link")
      .find((w) => w.text().includes("Overview"));
    expect(overviewLink).toBeDefined();
    expect(overviewLink!.attributes("aria-current")).toBe("page");
  });
});
