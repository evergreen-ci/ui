import { test, expect } from "../fixtures";
import * as helpers from "../helpers";

const spruceLogLink =
  "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";
const resmokeLogLink =
  "/test/mongodb_mongo_master_rhel80_debug_v4ubsan_all_feature_flags_experimental_concurrency_sharded_with_stepdowns_and_balancer_4_linux_enterprise_361789ed8a613a2dc0335a821ead0ab6205fbdaa_22_09_21_02_53_24/0/1716e17b99558fd9c5e2faf70a00d15d";

test.describe("project filters", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await helpers.resetDrawerState(page);
  });

  test("should show a message if there are no filters", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(spruceLogLink);
    await page.getByText("View project filters").click();
    await expect(page.getByTestId("project-filters-modal")).toBeVisible();
    await expect(page.getByTestId("project-filter")).toBeHidden();
    await expect(page.getByTestId("no-filters-message")).toBeVisible();
  });

  test("should be able to apply a filter", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(resmokeLogLink);
    await page.getByText("View project filters").click();
    await expect(page.getByTestId("project-filters-modal")).toBeVisible();
    const row0Checkbox = page.getByRole("checkbox", { name: "Select row 0" });
    await helpers.clickCheckbox(row0Checkbox);
    await expect(row0Checkbox).toBeChecked();
    await page.getByRole("button", { name: "Apply filters" }).click();
    await expect(page).toHaveURL(
      /111%28NETWORK%257CASIO%257CEXECUTOR%257CCONNPOOL%257CREPL_HB%29/,
    );
    expect(
      await page.locator("[data-cy^='skipped-lines-row-']").count(),
    ).toBeGreaterThan(0);
  });

  test("should allow clicking on the filter name to check the checkbox", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(resmokeLogLink);
    await page.getByText("View project filters").click();
    await expect(page.getByTestId("project-filters-modal")).toBeVisible();
    const row0Checkbox = page.getByRole("checkbox", { name: "Select row 0" });
    await helpers.clickCheckbox(row0Checkbox);
    await expect(row0Checkbox).toBeChecked();
  });

  test("properly processes filters with commas", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(resmokeLogLink);
    await page.getByText("View project filters").click();
    await expect(page.getByTestId("project-filters-modal")).toBeVisible();
    const row3Checkbox = page.getByRole("checkbox", { name: "Select row 3" });
    await helpers.clickCheckbox(row3Checkbox);
    await expect(row3Checkbox).toBeChecked();
    await page.getByRole("button", { name: "Apply filters" }).click();
    await expect(page).toHaveURL(
      /110%2522Connection%2520accepted%2522%252C%2522attr%2522/,
    );
    expect(
      await page.locator("[data-cy^='skipped-lines-row-']").count(),
    ).toBeGreaterThan(0);
  });

  test("should disable checkbox if filter is already applied", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(`${resmokeLogLink}?filters=111D%255Cd`);
    await page.getByText("View project filters").click();
    await expect(page.getByTestId("project-filters-modal")).toBeVisible();
    const row1Checkbox = page.getByRole("checkbox", {
      name: "Select row 1",
    });
    await expect(row1Checkbox).toBeDisabled();
  });
});
