import { test, expect } from "../../fixtures";

const versionId = "5ecedafb562343215a7ff297";
const versionRoute = `/version/${versionId}`;
const versions = {
  changes: { route: `${versionRoute}/changes`, name: "Changes" },
  tasks: { route: `${versionRoute}/tasks`, name: "Tasks" },
  duration: { route: `${versionRoute}/task-duration`, name: "Duration" },
};

test.describe("page tabs", () => {
  test("Defaults to the task tab and applies default sorts", async ({
    page,
  }) => {
    await page.goto(versionRoute);
    await expect(
      page.getByRole("tab", { name: versions.tasks.name }),
    ).toHaveAttribute("aria-selected", "true");
    await expect(page).toHaveURL(
      `${versions.tasks.route}?sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC`,
    );
  });

  test("Applies default sorts on task duration tab", async ({ page }) => {
    await page.goto(`${versionRoute}/task-duration`);
    await expect(
      page.getByRole("tab", { name: versions.duration.name }),
    ).toHaveAttribute("aria-selected", "true");
    await expect(page).toHaveURL(
      `${versions.duration.route}?sorts=DURATION%3ADESC`,
    );
  });

  test("Applies default sorts on task tab when switching from another tab without any filters", async ({
    page,
  }) => {
    await page.goto(`${versionRoute}/changes`);
    await expect(
      page.getByRole("tab", { name: versions.changes.name }),
    ).toHaveAttribute("aria-selected", "true");
    await expect(page).toHaveURL(versions.changes.route);
    await page.getByRole("tab", { name: versions.tasks.name }).first().click();
    await expect(page).toHaveURL(
      `${versions.tasks.route}?sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC`,
    );
  });

  test("Retains filters even when moving to a tab that isn't a task tab", async ({
    page,
  }) => {
    await page.goto(versionRoute);
    await expect(page).toHaveURL(/sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC/);
    await page.getByRole("tab", { name: versions.changes.name }).click();
    await expect(page).toHaveURL(
      `${versions.changes.route}?sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC`,
    );
  });

  test("replaces invalid tab names in url path with default", async ({
    page,
  }) => {
    await page.goto(`${versionRoute}/chicken`);
    await expect(page).toHaveURL(
      `${versions.tasks.route}?sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC`,
    );
  });

  test("should be able to toggle between tabs", async ({ page }) => {
    await page.goto(versionRoute);
    await page.getByRole("tab", { name: versions.changes.name }).click();
    await expect(page.getByTestId("code-changes")).toBeVisible();
    await page.getByRole("tab", { name: versions.tasks.name }).click();
    await expect(page.getByTestId("total-count")).toBeVisible();
  });
});
