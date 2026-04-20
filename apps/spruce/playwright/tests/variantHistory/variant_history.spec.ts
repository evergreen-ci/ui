import { test, expect } from "fixtures";
import { validateToast } from "helpers";

test.describe("Variant history", () => {
  test("shows an error message if mainline commit history could not be retrieved", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/variant-history/bogus-project/bogus-variant");
    await expect(page.getByTestId("loading-cell")).toHaveCount(0);
    await validateToast(
      page,
      "error",
      "There was an error loading the variant history",
    );
  });

  test("should link to variant history from the waterfall page", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/project/spruce/waterfall");
    await expect(page.getByTestId("build-variant-link")).toBeVisible();
    const firstLink = page.getByTestId("build-variant-link").first();
    await expect(firstLink).toContainText("Ubuntu 16.04");
    await firstLink.click();
    await expect(page).toHaveURL("/variant-history/spruce/ubuntu1604");
  });

  test("should be able to paginate column headers", async ({
    authenticatedPage: page,
  }) => {
    await page.setViewportSize({ width: 1000, height: 600 });
    await page.goto("/variant-history/spruce/ubuntu1604");
    await expect(page.getByTestId("header-cell")).toHaveCount(4);
    await page.getByTestId("next-page-button").click();
    await expect(page.getByTestId("header-cell")).toHaveCount(4);
    await page.getByTestId("prev-page-button").click();
    await expect(page.getByTestId("header-cell")).toHaveCount(4);
  });

  test("should be able expand and collapse inactive commits", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/variant-history/spruce/ubuntu1604?selectedCommit=1238");
    await expect(page.getByText("EVG-16356")).toBeHidden();

    const expandButton = page.getByText("Expand 1 inactive").first();
    await expect(expandButton).toBeVisible();
    await expandButton.click();
    await expect(page.getByText("EVG-16356")).toBeVisible();

    const collapseButton = page.getByText("Collapse 1 inactive").first();
    await expect(collapseButton).toBeVisible();
    await collapseButton.click();
    await expect(expandButton).toBeVisible();
  });

  test("should be able to filter column headers", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/variant-history/spruce/ubuntu1604");
    await expect(page.getByTestId("header-cell")).toHaveCount(6);

    const tasksInput = page.getByRole("textbox", { name: "Tasks" });
    await tasksInput.click();
    await page.locator("[aria-label='compile']").click();
    await page.locator("[aria-label='e2e_test']").click();
    await tasksInput.click();
    await expect(page.getByTestId("header-cell")).toHaveCount(2);

    // Removing column header filters should restore all columns.
    await tasksInput.click();
    await page.locator("[aria-label='compile']").click();
    await page.locator("[aria-label='e2e_test']").click();
    await tasksInput.click();
    await expect(page.getByTestId("header-cell")).toHaveCount(6);
  });

  test("hovering over a failing task should show test results", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(
      "/variant-history/spruce/ubuntu1604?failed=JustAFakeTestInALonelyWorld&selectedCommit=1236",
    );
    const failedIcons = page
      .getByTestId("history-table-icon")
      .locator("[data-status=failed]");
    await expect(failedIcons).toHaveCount(2);

    const firstFailedIcon = failedIcons.first();
    await expect(firstFailedIcon).toBeVisible();
    await firstFailedIcon.hover();
    await expect(page.getByTestId("test-tooltip")).toBeVisible();
    await expect(page.getByTestId("test-tooltip")).toContainText(
      "JustAFakeTestInALonelyWorld",
    );
  });

  test.describe("applying a test filter", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto("/variant-history/spruce/ubuntu1604");
      const filterInput = page.getByLabel("Filter by Failed Tests");
      await expect(filterInput).toBeVisible();
      await filterInput.focus();
      await filterInput.fill("JustA");
      await filterInput.press("Enter");
      await expect(page.getByTestId("filter-chip")).toBeVisible();
      await expect(page.getByTestId("filter-chip")).toContainText("JustA");
    });

    test("should disable non matching tasks", async ({
      authenticatedPage: page,
    }) => {
      const successIcons = page
        .getByTestId("history-table-icon")
        .locator("[data-status=success]");
      for (const icon of await successIcons.all()) {
        await expect(icon).toBeVisible();
        const parent = icon.locator("..");
        await expect(parent).toHaveAttribute("aria-disabled", "true");
      }
    });

    test("should display a message and tooltip on matching tasks with test results", async ({
      authenticatedPage: page,
    }) => {
      const failedTask = page.getByText("1 / 1 Failing Tests");
      await expect(failedTask).toBeVisible();
      await failedTask.hover();
      await expect(page.getByTestId("test-tooltip")).toBeVisible();
      await expect(page.getByTestId("test-tooltip")).toContainText(
        "JustAFakeTestInALonelyWorld",
      );
    });
  });
});
