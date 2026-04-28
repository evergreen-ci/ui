import { test, expect } from "../../fixtures";

const versionId = "5ecedafb562343215a7ff297";
const versionRoute = `/version/${versionId}`;
const versions = {
  changes: { route: `${versionRoute}/changes`, button: "changes-tab" },
  tasks: { route: `${versionRoute}/tasks`, button: "task-tab" },
  duration: { route: `${versionRoute}/task-duration`, button: "duration-tab" },
};

test.describe("page tabs", () => {
  test("Defaults to the task tab and applies default sorts", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(versionRoute);
    await expect(page.getByTestId(versions.tasks.button)).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page).toHaveURL(
      `${versions.tasks.route}?sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC`,
    );
  });

  test("Applies default sorts on task duration tab", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(`${versionRoute}/task-duration`);
    await expect(page.getByTestId(versions.duration.button)).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page).toHaveURL(
      `${versions.duration.route}?sorts=DURATION%3ADESC`,
    );
  });

  test("Applies default sorts on task tab when switching from another tab without any filters", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(`${versionRoute}/changes`);
    await expect(page.getByTestId(versions.changes.button)).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page).toHaveURL(versions.changes.route);

    await page.getByTestId("task-tab").first().click();
    await expect(page).toHaveURL(
      `${versions.tasks.route}?sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC`,
    );
  });

  test("Retains filters even when moving to a tab that isn't a task tab", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(versionRoute);
    await expect(page).toHaveURL(/sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC/);

    await page.getByTestId(versions.changes.button).click();
    await expect(page).toHaveURL(
      `${versions.changes.route}?sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC`,
    );
  });

  test("replaces invalid tab names in url path with default", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(`${versionRoute}/chicken`);
    await expect(page).toHaveURL(
      `${versions.tasks.route}?sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC`,
    );
  });

  test("should be able to toggle between tabs", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(versionRoute);
    await page.getByTestId(versions.changes.button).click();
    await expect(page.getByTestId("code-changes")).toBeVisible();
    await page.getByTestId(versions.tasks.button).click();
    await expect(page.getByTestId("total-count")).toBeVisible();
  });
});
