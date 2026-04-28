import { test, expect } from "../fixtures";
import * as helpers from "../helpers";

test.describe("Parsley Routes", () => {
  test("should render 'No Logs Found' when visiting a task log page of an empty log", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(
      "evergreen/mci_ubuntu1604_test_db_patch_a1d2c8f70bf5c543de8b9641ac1ec08def1ddb26_5f74d99ab2373627c047c5e5_20_09_30_19_16_47/0/task",
    );
    await expect(page.getByText("No Logs Found")).toBeVisible();
  });

  test("should load task logs when visiting a task log page", async ({
    authenticatedPage: page,
  }) => {
    const logLink =
      "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";
    await page.goto(logLink);
    await page.locator("[data-cy^='log-row-']").first().waitFor();
    expect(await page.locator("[data-cy^='log-row-']").count()).toBeGreaterThan(
      0,
    );
    await page.getByTestId("ansi-row").first().waitFor();
    expect(await page.getByTestId("ansi-row").count()).toBeGreaterThan(0);
    await expect(page.getByTestId("resmoke-row")).toBeHidden();
    await expect(page.getByText("Task logger initialized")).toBeVisible();
  });

  test("should show error toast when visiting a task log page of an invalid task", async ({
    authenticatedPage: page,
  }) => {
    const logLink = "/evergreen/invalid-task-id/0/task";
    await page.goto(logLink);
    await helpers.validateToast(
      page,
      "error",
      "Network response was not ok (404)",
    );
  });

  test("should load test results when visiting a test result page", async ({
    authenticatedPage: page,
  }) => {
    const logLink =
      "/test/spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35/0/JustAFakeTestInALonelyWorld";
    const testLogLine =
      "AssertionError: Timed out retrying after 4000ms: Too many elements found. Found '1', expected '0'";
    await page.goto(logLink);
    await page.locator("[data-cy^='log-row-']").first().waitFor();
    expect(await page.locator("[data-cy^='log-row-']").count()).toBeGreaterThan(
      0,
    );
    await page.getByTestId("ansi-row").first().waitFor();
    expect(await page.getByTestId("ansi-row").count()).toBeGreaterThan(0);
    await expect(page.getByTestId("resmoke-row")).toBeHidden();
    await expect(page.getByText(testLogLine)).toBeVisible();
  });

  test("should load a task uploaded file when visiting a task log page", async ({
    authenticatedPage: page,
  }) => {
    const logLink =
      "/taskFile/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/sample%20file";
    await page.goto(logLink);
    await page.locator("[data-cy^='log-row-']").first().waitFor();
    expect(await page.locator("[data-cy^='log-row-']").count()).toBeGreaterThan(
      0,
    );
    await page.getByTestId("ansi-row").first().waitFor();
    expect(await page.getByTestId("ansi-row").count()).toBeGreaterThan(0);
  });

  test("should show 404 when visiting a nonexistent page", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/this/is/not/a/real/page");
    await expect(page.locator('[data-cy="404"]')).toBeVisible();
  });
});
