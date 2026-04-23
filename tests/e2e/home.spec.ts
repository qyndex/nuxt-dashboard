import { test, expect } from "@playwright/test";

test.describe("Dashboard auth flow", () => {
  test("unauthenticated user is redirected to login page", async ({ page }) => {
    await page.goto("/");
    // Auth middleware should redirect to login
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("login page renders sign-in form", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
    await expect(page.getByLabel("Email address")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });

  test("login page has link to signup", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.getByRole("link", { name: "Sign up" })).toBeVisible();
  });

  test("signup page renders create account form", async ({ page }) => {
    await page.goto("/auth/signup");
    await expect(page.getByRole("heading", { name: "Create Account" })).toBeVisible();
    await expect(page.getByLabel("Full name")).toBeVisible();
    await expect(page.getByLabel("Email address")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Create account" })).toBeVisible();
  });

  test("signup page has link to login", async ({ page }) => {
    await page.goto("/auth/signup");
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
  });

  test("no JS errors on login page load", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.goto("/auth/login");
    await page.waitForLoadState("networkidle");
    expect(errors).toHaveLength(0);
  });
});
