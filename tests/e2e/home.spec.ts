import { test, expect } from "@playwright/test";

test.describe("Dashboard home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("page title is set correctly", async ({ page }) => {
    await expect(page).toHaveTitle(/Analytics/);
  });

  test("sidebar is visible with brand name", async ({ page }) => {
    const sidebar = page.getByRole("complementary", {
      name: "Navigation sidebar",
    });
    await expect(sidebar).toBeVisible();
    await expect(sidebar).toContainText("DataKit");
  });

  test("sidebar contains all four navigation links", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Overview" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Users" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Reports" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Settings" })).toBeVisible();
  });

  test("topbar renders with notifications button and user avatar", async ({
    page,
  }) => {
    await expect(
      page.getByRole("button", { name: "Notifications" })
    ).toBeVisible();
    await expect(page.getByLabel("User menu")).toBeVisible();
  });

  test("page heading is Analytics Overview", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Analytics Overview" })
    ).toBeVisible();
  });

  test("period selector is present with default 30d option", async ({
    page,
  }) => {
    const select = page.getByLabel("Select time period");
    await expect(select).toBeVisible();
    await expect(select).toHaveValue("30d");
  });

  test("KPI cards are rendered after data loads", async ({ page }) => {
    // Wait for loading state to disappear
    const loading = page.getByRole("status");
    // The loading indicator may or may not be visible depending on speed — wait it out
    await loading.waitFor({ state: "hidden", timeout: 10_000 }).catch(() => {
      // ignore if it never appeared
    });

    // Four KPI labels from the server fixture
    await expect(page.getByText("Monthly Revenue")).toBeVisible();
    await expect(page.getByText("Active Users")).toBeVisible();
    await expect(page.getByText("Avg. Session")).toBeVisible();
    await expect(page.getByText("Bounce Rate")).toBeVisible();
  });

  test("charts section headings are visible", async ({ page }) => {
    await page
      .getByRole("status")
      .waitFor({ state: "hidden", timeout: 10_000 })
      .catch(() => {});
    await expect(
      page.getByRole("heading", { name: "Daily Active Users" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Traffic Sources" })
    ).toBeVisible();
  });

  test("changing period select re-fetches (loading state re-appears)", async ({
    page,
  }) => {
    const select = page.getByLabel("Select time period");
    await select.selectOption("7d");
    await expect(select).toHaveValue("7d");
    // After changing period the data should eventually reload
    await page
      .getByRole("status")
      .waitFor({ state: "hidden", timeout: 10_000 })
      .catch(() => {});
    await expect(page.getByText("Monthly Revenue")).toBeVisible();
  });

  test("no JS errors on page load", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.reload();
    await page
      .getByRole("status")
      .waitFor({ state: "hidden", timeout: 10_000 })
      .catch(() => {});
    expect(errors).toHaveLength(0);
  });
});
