import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";
import { getProjectSettingsRoute, ProjectSettingsTabRoutes } from "./constants";
import { expectSaveButtonEnabled, save } from "./utils";

test.describe("Views & filters page", () => {
  const destination = getProjectSettingsRoute(
    "sys-perf",
    ProjectSettingsTabRoutes.ViewsAndFilters,
  );

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(destination);
    await expect(
      page.getByTestId("parsley-filter-list").locator("> *"),
    ).toHaveCount(2);
    await expectSaveButtonEnabled(page, false);
  });

  test.describe("parsley filters", () => {
    test("does not allow saving with invalid regular expression or empty expression", async ({
      authenticatedPage: page,
    }) => {
      await page.getByRole("button", { name: "Add filter" }).click();
      await page.getByTestId("parsley-filter-expression").first().fill("*");
      await expectSaveButtonEnabled(page, false);
      await expect(
        page.getByText("Value should be a valid regex expression."),
      ).toBeVisible();
      await page.getByTestId("parsley-filter-expression").first().clear();
      await expectSaveButtonEnabled(page, false);
    });

    test("does not allow saving with duplicate filter expressions", async ({
      authenticatedPage: page,
    }) => {
      await page.getByRole("button", { name: "Add filter" }).click();
      await page
        .getByTestId("parsley-filter-expression")
        .first()
        .fill("filter_1");
      await expectSaveButtonEnabled(page, false);
      await expect(
        page.getByText("Filter expression already appears in this project."),
      ).toBeVisible();
    });

    test("can successfully save and delete filter", async ({
      authenticatedPage: page,
    }) => {
      await page.getByRole("button", { name: "Add filter" }).click();
      await page
        .getByTestId("parsley-filter-expression")
        .first()
        .fill("my_filter");
      await expectSaveButtonEnabled(page, true);
      await save(page);
      await validateToast(page, "success", "Successfully updated project");
      await expect(
        page.getByTestId("parsley-filter-list").locator("> *"),
      ).toHaveCount(3);

      await page
        .getByTestId("delete-item-button")
        .first()
        .scrollIntoViewIfNeeded();
      await page.getByTestId("delete-item-button").first().click();
      await save(page);
      await validateToast(page, "success", "Successfully updated project");
      await expect(
        page.getByTestId("parsley-filter-list").locator("> *"),
      ).toHaveCount(2);
    });
  });
});
