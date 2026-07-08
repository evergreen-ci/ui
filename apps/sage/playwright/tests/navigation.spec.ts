import { test, expect } from "@playwright/test";

test("can navigate to home page", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Home page")).toBeVisible();
});

test("can navigate to agent details page", async ({ page }) => {
  await page.goto("/agents/sage-bot");
  await expect(page.getByText("Agent ID: sage-bot")).toBeVisible();
});

test("can navigate to agent runs page", async ({ page }) => {
  await page.goto("/agents/sage-bot/runs/1234");
  await expect(
    page.getByText("Agent ID: sage-bot, Run ID: 1234"),
  ).toBeVisible();
});
