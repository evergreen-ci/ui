import { test, expect } from "../fixtures";
import * as helpers from "../helpers";

const spruceLogLink =
  "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";
const resmokeLogLink =
  "/test/mongodb_mongo_master_rhel80_debug_v4ubsan_all_feature_flags_experimental_concurrency_sharded_with_stepdowns_and_balancer_4_linux_enterprise_361789ed8a613a2dc0335a821ead0ab6205fbdaa_22_09_21_02_53_24/0/1716e17b99558fd9c5e2faf70a00d15d";

test.describe("project filters", () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await helpers.resetDrawerState(authenticatedPage);
  });

  test("should show a message if there are no filters", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto(spruceLogLink);
    await authenticatedPage.getByText("View project filters").click();
    await expect(
      authenticatedPage.getByTestId("project-filters-modal"),
    ).toBeVisible();
    await expect(authenticatedPage.getByTestId("project-filter")).toBeHidden();
    await expect(
      authenticatedPage.getByTestId("no-filters-message"),
    ).toBeVisible();
  });

  test("should be able to apply a filter", async ({ authenticatedPage }) => {
    await authenticatedPage.goto(resmokeLogLink);
    await authenticatedPage.getByText("View project filters").click();
    await expect(
      authenticatedPage.getByTestId("project-filters-modal"),
    ).toBeVisible();
    await helpers.clickCheckboxByLabel(authenticatedPage, "Select row 0");
    await authenticatedPage
      .getByRole("button", { name: "Apply filters" })
      .click();
    await expect(authenticatedPage).toHaveURL(
      /111%28NETWORK%257CASIO%257CEXECUTOR%257CCONNPOOL%257CREPL_HB%29/,
    );
    expect(
      await authenticatedPage
        .locator("[data-cy^='skipped-lines-row-']")
        .count(),
    ).toBeGreaterThan(0);
  });

  test("should allow clicking on the filter name to check the checkbox", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto(resmokeLogLink);
    await authenticatedPage.getByText("View project filters").click();
    await expect(
      authenticatedPage.getByTestId("project-filters-modal"),
    ).toBeVisible();
    await helpers.clickCheckboxByLabel(authenticatedPage, "Select row 0");
    await expect(
      authenticatedPage.getByRole("checkbox", { name: "Select row 0" }),
    ).toBeChecked();
  });

  test("properly processes filters with commas", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto(resmokeLogLink);
    await authenticatedPage.getByText("View project filters").click();
    await expect(
      authenticatedPage.getByTestId("project-filters-modal"),
    ).toBeVisible();
    await helpers.clickCheckboxByLabel(authenticatedPage, "Select row 3");
    await authenticatedPage
      .getByRole("button", { name: "Apply filters" })
      .click();
    await expect(authenticatedPage).toHaveURL(
      /110%2522Connection%2520accepted%2522%252C%2522attr%2522/,
    );
    expect(
      await authenticatedPage
        .locator("[data-cy^='skipped-lines-row-']")
        .count(),
    ).toBeGreaterThan(0);
  });

  test("should disable checkbox if filter is already applied", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto(`${resmokeLogLink}?filters=111D%255Cd`);
    await authenticatedPage.getByText("View project filters").click();
    await expect(
      authenticatedPage.getByTestId("project-filters-modal"),
    ).toBeVisible();
    const checkbox = authenticatedPage.getByRole("checkbox", {
      name: "Select row 1",
    });
    await expect(checkbox).toBeDisabled();
  });
});
