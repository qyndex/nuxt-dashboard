import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import KpiCard from "~/components/KpiCard.vue";
import type { KPI } from "~/server/api/dashboard.get";

const upKpi: KPI = {
  label: "Monthly Revenue",
  value: "$84,200",
  change: "+18.3%",
  trend: "up",
};

const downKpi: KPI = {
  label: "Bounce Rate",
  value: "31.4%",
  change: "-2.1%",
  trend: "down",
};

describe("KpiCard", () => {
  it("renders label, value, and change text", async () => {
    const wrapper = await mountSuspended(KpiCard, {
      props: { kpi: upKpi },
    });
    expect(wrapper.text()).toContain("Monthly Revenue");
    expect(wrapper.text()).toContain("$84,200");
    expect(wrapper.text()).toContain("+18.3%");
  });

  it("shows up-arrow and applies .up class for trend='up'", async () => {
    const wrapper = await mountSuspended(KpiCard, {
      props: { kpi: upKpi },
    });
    const changeEl = wrapper.find(".change");
    expect(changeEl.classes()).toContain("up");
    expect(changeEl.text()).toContain("↑");
  });

  it("shows down-arrow and applies .down class for trend='down'", async () => {
    const wrapper = await mountSuspended(KpiCard, {
      props: { kpi: downKpi },
    });
    const changeEl = wrapper.find(".change");
    expect(changeEl.classes()).toContain("down");
    expect(changeEl.text()).toContain("↓");
  });

  it("sets aria-label to the kpi label", async () => {
    const wrapper = await mountSuspended(KpiCard, {
      props: { kpi: upKpi },
    });
    expect(wrapper.find(".kpi-card").attributes("aria-label")).toBe(
      "Monthly Revenue"
    );
  });

  it("renders all four kpi fields without throwing", async () => {
    const kpi: KPI = { label: "Test", value: "42", change: "0%", trend: "up" };
    const wrapper = await mountSuspended(KpiCard, { props: { kpi } });
    expect(wrapper.exists()).toBe(true);
  });
});
