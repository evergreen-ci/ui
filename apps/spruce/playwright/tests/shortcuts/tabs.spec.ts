import { test, expect } from "../../fixtures";

test.describe("Tab shortcut", () => {
  test("toggle through tabs with 'j' and 'k' on version page", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/version/5f74d99ab2373627c047c5e5/");

    await expect(page.getByTestId("task-tab")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.locator("body").press("j");
    await expect(page.getByTestId("duration-tab")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.locator("body").press("j");
    await expect(page.getByTestId("changes-tab")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.locator("body").press("j");
    await expect(page.getByTestId("downstream-tab")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.locator("body").press("j");
    await expect(page.getByTestId("test-analysis-tab")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.locator("body").press("j");
    await expect(page.getByTestId("version-timing-tab")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.locator("body").press("j");
    await expect(page.getByTestId("task-tab")).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await page.locator("body").press("k");
    await expect(page.getByTestId("version-timing-tab")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.locator("body").press("k");
    await expect(page.getByTestId("test-analysis-tab")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.locator("body").press("k");
    await expect(page.getByTestId("downstream-tab")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.locator("body").press("k");
    await expect(page.getByTestId("changes-tab")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.locator("body").press("k");
    await expect(page.getByTestId("duration-tab")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.locator("body").press("k");
    await expect(page.getByTestId("task-tab")).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  test("toggle through tabs with 'j' and 'k' on configure page", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/patch/5f74d99ab2373627c047c5e5/configure");

    await expect(page.getByTestId("tasks-tab")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.locator("body").press("j");
    await expect(page.getByTestId("changes-tab")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.locator("body").press("j");
    await expect(page.getByTestId("parameters-tab")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.locator("body").press("j");
    await expect(page.getByTestId("tasks-tab")).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await page.locator("body").press("k");
    await expect(page.getByTestId("parameters-tab")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.locator("body").press("k");
    await expect(page.getByTestId("changes-tab")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.locator("body").press("k");
    await expect(page.getByTestId("tasks-tab")).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  test("toggle through tabs with 'j' and 'k' on the task page", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(
      "task/mci_ubuntu1604_display_asdf_patch_a1d2c8f70bf5c543de8b9641ac1ec08def1ddb26_5f74d99ab2373627c047c5e5_20_09_30_19_16_47/execution-tasks",
    );
    await expect(page.getByTestId("task-execution-tab")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.locator("body").press("j");
    await expect(page.getByTestId("task-tests-tab")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.locator("body").press("j");
    await expect(page.getByTestId("task-files-tab")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.locator("body").press("j");
    await expect(page.getByTestId("task-history-tab")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.locator("body").press("j");
    await expect(
      page.getByTestId("execution-tasks-timing-tab"),
    ).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("j");
    await expect(page.getByTestId("task-execution-tab")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.locator("body").press("j");
    await expect(page.getByTestId("task-tests-tab")).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await page.locator("body").press("k");
    await expect(page.getByTestId("task-execution-tab")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.locator("body").press("k");
    await expect(
      page.getByTestId("execution-tasks-timing-tab"),
    ).toHaveAttribute("aria-selected", "true");
    await page.locator("body").press("k");
    await expect(page.getByTestId("task-history-tab")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.locator("body").press("k");
    await expect(page.getByTestId("task-files-tab")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.locator("body").press("k");
    await expect(page.getByTestId("task-tests-tab")).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});
