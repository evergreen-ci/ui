import { test, expect } from "@playwright/test";
import * as helpers from "../helpers";

test.describe("External Links", () => {
  test.describe("should render links to external pages when viewing an evergreen task log", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(
        "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task",
      );
      await helpers.toggleDetailsPanel(page, true);
    });

    test("should disable the link to the job logs page since there are no resmoke logs", async ({
      page,
    }) => {
      await expect(page.getByTestId("job-logs-button")).toBeDisabled();
    });

    test("should render links to the log files", async ({ page }) => {
      const rawLogButton = page.getByTestId("raw-log-button");
      await expect(rawLogButton).toBeVisible();
      await expect(rawLogButton).toBeEnabled();
      await expect(rawLogButton).toHaveAttribute(
        "href",
        "http://localhost:9090/task_log_raw/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0?text=true&time=true&type=T",
      );

      const htmlLogButton = page.getByTestId("html-log-button");
      await expect(htmlLogButton).toBeVisible();
      await expect(htmlLogButton).toBeEnabled();
      await expect(htmlLogButton).toHaveAttribute(
        "href",
        "http://localhost:9090/task_log_raw/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0?text=false&time=true&type=T",
      );
    });
  });

  test.describe("should render links to external pages when viewing an evergreen test log", () => {
    const evgTestLogWithoutGroupID =
      "/test/spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35/0/JustAFakeTestInALonelyWorld";
    const evgTestLogWithGroupID =
      "/test/mongodb_mongo_master_rhel80_debug_v4ubsan_all_feature_flags_experimental_concurrency_sharded_with_stepdowns_and_balancer_4_linux_enterprise_361789ed8a613a2dc0335a821ead0ab6205fbdaa_22_09_21_02_53_24/0/1716e11b4f8a4541c5e2faf70affbfab";

    test("should disable the link to the job logs page since when there are no resmoke logs", async ({
      page,
    }) => {
      await page.goto(evgTestLogWithoutGroupID);
      await helpers.toggleDetailsPanel(page, true);
      await expect(page.getByTestId("job-logs-button")).toBeDisabled();
    });

    test("should enable the link to the job logs page when there are resmoke logs", async ({
      page,
    }) => {
      await page.goto(evgTestLogWithGroupID);
      await helpers.toggleDetailsPanel(page, true);
      const jobLogsButton = page.getByTestId("job-logs-button");
      await expect(jobLogsButton).toBeEnabled();
      await expect(jobLogsButton).toHaveAttribute(
        "href",
        "http://localhost:3000/job-logs/mongodb_mongo_master_rhel80_debug_v4ubsan_all_feature_flags_experimental_concurrency_sharded_with_stepdowns_and_balancer_4_linux_enterprise_361789ed8a613a2dc0335a821ead0ab6205fbdaa_22_09_21_02_53_24/0/job0",
      );
    });

    test("should render links to the log files", async ({ page }) => {
      await page.goto(evgTestLogWithoutGroupID);
      await helpers.toggleDetailsPanel(page, true);

      const rawLogButton = page.getByTestId("raw-log-button");
      await expect(rawLogButton).toBeVisible();
      await expect(rawLogButton).toBeEnabled();
      await expect(rawLogButton).toHaveAttribute(
        "href",
        "http://localhost:9090/rest/v2/tasks/spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35/build/TestLogs/JustAFakeTestInALonelyWorld?execution=0&print_time=true",
      );

      const htmlLogButton = page.getByTestId("html-log-button");
      await expect(htmlLogButton).toBeVisible();
      await expect(htmlLogButton).toBeEnabled();
      await expect(htmlLogButton).toHaveAttribute(
        "href",
        "http://localhost:9090/test_log/spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35/0?print_time=true&test_name=JustAFakeTestInALonelyWorld#L0",
      );
    });
  });

  test.describe("should render links to external pages when viewing an evergreen task uploaded file", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(
        "/taskFile/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/sample%20file",
      );
      await helpers.toggleDetailsPanel(page, true);
    });

    test("should link to the raw file", async ({ page }) => {
      const rawLogButton = page.getByTestId("raw-log-button");
      await expect(rawLogButton).toBeVisible();
      await expect(rawLogButton).toBeEnabled();
      await expect(rawLogButton).toHaveAttribute("href", /s3\.amazonaws\.com/);
    });
  });
});
