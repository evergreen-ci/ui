import { test, expect } from "../../fixtures";

const DOWNSTREAM_ROUTE =
  "/version/5f74d99ab2373627c047c5e5/downstream-projects";

test.describe("Downstream Projects Tab", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(DOWNSTREAM_ROUTE);
  });

  test("shows number of failed patches in the Downstream tab label", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("downstream-tab-badge")).toBeVisible();
    await expect(page.getByTestId("downstream-tab-badge")).toContainText("1");
  });

  test("renders child patches", async ({ authenticatedPage: page }) => {
    await expect(page.getByTestId("project-accordion")).toHaveCount(3);
    await expect(page.getByTestId("project-title")).toHaveCount(3);
    await expect(page.getByTestId("downstream-tasks-table")).toHaveCount(3);
  });

  test("links to base commit", async ({ authenticatedPage: page }) => {
    await page.getByTestId("accordion-toggle").first().click();
    await expect(
      page.getByTestId("downstream-base-commit").first(),
    ).toHaveAttribute(
      "href",
      /\/version\/logkeeper_e3579537e848d14f0c3e5c25ef745fd0f10702d4/,
    );
  });

  test("filters by test name", async ({ authenticatedPage: page }) => {
    await page.getByTestId("task-name-filter").nth(1).click();
    const input = page.getByTestId("task-name-filter-wrapper").locator("input");
    await input.focus();
    await input.fill("generate-lint");
    await input.press("Enter");
    await expect(page).not.toHaveURL(/generate-lint/);
    await expect(page.getByText("generate-lint")).toBeVisible();
  });

  test("does not push query params to the URL", async ({
    authenticatedPage: page,
  }) => {
    expect(new URL(page.url()).pathname).toBe(DOWNSTREAM_ROUTE);
  });
});
