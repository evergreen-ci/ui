import { expect, test } from "../../fixtures";
import { validateToast } from "../../helpers";

const taskIdWithResmokeLogs =
  "mongodb_mongo_master_enterprise_amazon_linux2_arm64_all_feature_flags_jsCore_patch_9801cf147ed208ce4c0ff8dff4a97cdb216f4c22_65f06bd09ccd4eaaccca1391_24_03_12_14_51_29";

test.describe("Job logs page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/job-logs/${taskIdWithResmokeLogs}/0/job0`);
  });

  test("renders a table with test links", async ({ page }) => {
    await expect(page.getByTestId("via-table-row")).toHaveCount(655);
    const completeTestLogsLink = page.getByTestId("complete-test-logs-link");
    const href = await completeTestLogsLink.getAttribute("href");
    expect(href).toContain(
      "resmoke/mongodb_mongo_master_enterprise_amazon_linux2_arm64_all_feature_flags_jsCore_patch_9801cf147ed208ce4c0ff8dff4a97cdb216f4c22_65f06bd09ccd4eaaccca1391_24_03_12_14_51_29/0/job0/all",
    );
  });

  test("task page button links to the task", async ({ page }) => {
    await expect(page.getByTestId("task-link")).toHaveAttribute(
      "href",
      new RegExp(`^/task/${taskIdWithResmokeLogs}\\?execution=0$`),
    );
  });

  test("name links to Parsley", async ({ page }) => {
    const parsleyLink = page
      .getByTestId("via-table-row")
      .filter({ has: page.getByRole("link") })
      .first()
      .getByRole("link");
    await expect(parsleyLink).toHaveAttribute("href", /^https?:\/\//);
  });

  test("visiting an invalid job logs page shows an error toast", async ({
    page,
  }) => {
    await page.goto(`/job-logs/DNE/0/job0`);
    await expect(page.getByTestId("via-table-row")).toHaveCount(0);
    await validateToast(
      page,
      "error",
      "There was an error retrieving logs for this task",
    );
  });
});
