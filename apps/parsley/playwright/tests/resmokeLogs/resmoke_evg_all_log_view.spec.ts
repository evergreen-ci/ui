import { test, expect } from "../../fixtures";
import * as helpers from "../../helpers";

test.describe("Basic resmoke log view", () => {
  const logLink =
    "/resmoke/mongodb_mongo_master_enterprise_amazon_linux2_arm64_all_feature_flags_jsCore_patch_9801cf147ed208ce4c0ff8dff4a97cdb216f4c22_65f06bd09ccd4eaaccca1391_24_03_12_14_51_29/0/job0/all";

  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(logLink);
  });

  test("should render resmoke lines", async ({ authenticatedPage }) => {
    const resmokeRows = helpers.getByDataCy(authenticatedPage, "resmoke-row");
    await resmokeRows.first().waitFor();
    expect(await resmokeRows.count()).toBeGreaterThan(0);
    await expect(
      helpers.getByDataCy(authenticatedPage, "ansii-row"),
    ).toBeHidden();
  });

  test("the HTML log button is disabled", async ({ authenticatedPage }) => {
    await helpers.toggleDetailsPanel(authenticatedPage, true);
    await expect(
      helpers.getByDataCy(authenticatedPage, "html-log-button"),
    ).toBeDisabled();
  });

  test("the job logs button has a link to the job logs page", async ({
    authenticatedPage,
  }) => {
    await helpers.toggleDetailsPanel(authenticatedPage, true);
    await expect(
      helpers.getByDataCy(authenticatedPage, "job-logs-button"),
    ).toHaveAttribute(
      "href",
      "http://localhost:3000/job-logs/mongodb_mongo_master_enterprise_amazon_linux2_arm64_all_feature_flags_jsCore_patch_9801cf147ed208ce4c0ff8dff4a97cdb216f4c22_65f06bd09ccd4eaaccca1391_24_03_12_14_51_29/0/job0",
    );
  });

  test("should show the project, patch, task, and group the breadcrumb", async ({
    authenticatedPage,
  }) => {
    await expect(
      helpers.getByDataCy(authenticatedPage, "project-breadcrumb"),
    ).toContainText("mongodb-mongo-master");
    await expect(
      helpers.getByDataCy(authenticatedPage, "version-breadcrumb"),
    ).toContainText("Patch 1994");
    await expect(
      helpers.getByDataCy(authenticatedPage, "task-breadcrumb"),
    ).toContainText("jsCore");
    await expect(
      helpers.getByDataCy(authenticatedPage, "group-breadcrumb"),
    ).toContainText("job0");
  });
});
