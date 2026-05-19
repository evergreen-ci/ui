import { test, expect } from "../../fixtures";

test.describe("Execution task table", () => {
  const pathExecutionTasks =
    "/task/mci_ubuntu1604_display_asdf_patch_a1d2c8f70bf5c543de8b9641ac1ec08def1ddb26_5f74d99ab2373627c047c5e5_20_09_30_19_16_47/execution-tasks";

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(pathExecutionTasks);
  });

  test("Should have a default sort order applied", async ({
    authenticatedPage: page,
  }) => {
    await expect(page).toHaveURL(/sorts=STATUS%3AASC/);
  });

  test("Updates the url when column headers are clicked", async ({
    authenticatedPage: page,
  }) => {
    const nameSortControl = page.getByRole("button", {
      name: "Sort by Name",
    });
    await nameSortControl.click();
    await expect(page).toHaveURL(/STATUS%3AASC%3BNAME%3AASC/);

    await nameSortControl.click();
    await expect(page).toHaveURL(/STATUS%3AASC%3BNAME%3ADESC/);
  });
});
