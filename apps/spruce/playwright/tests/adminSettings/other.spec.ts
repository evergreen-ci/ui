import { test, expect } from "../../fixtures";
import { clickLabelForLocator, validateToast } from "../../helpers";
import { save } from "./utils";

test.describe("other", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/admin-settings");
  });

  test("can save misc settings changes", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    await page.getByLabel("Config Directory").clear();
    await page.getByLabel("Config Directory").fill("/new/config/dir");

    await page.getByLabel("GitHub PR Creator Organization").clear();
    await page
      .getByLabel("GitHub PR Creator Organization")
      .fill("new.example.com");

    await page.getByLabel("Shutdown Wait Time (secs)").clear();
    await page.getByLabel("Shutdown Wait Time (secs)").fill("45");

    await page.getByLabel("GitHub Organizations").fill("neworg");
    await page.getByLabel("GitHub Organizations").press("Enter");

    await save(page);
    await validateToast(page, "success", "Settings saved successfully");
    await page.reload();

    await expect(page.getByLabel("Config Directory")).toHaveValue(
      "/new/config/dir",
    );
    await expect(page.getByLabel("GitHub PR Creator Organization")).toHaveValue(
      "new.example.com",
    );
    await expect(page.getByLabel("Shutdown Wait Time (secs)")).toHaveValue(
      "45",
    );
    await expect(
      page
        .getByTestId("misc-settings")
        .getByTestId("filter-chip")
        .filter({ hasText: "neworg" }),
    ).toBeVisible();
  });

  test("can save cost settings changes", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    await page.getByLabel("Finance Formula").clear();
    await page.getByLabel("Finance Formula").fill("0.5");
    await page.getByLabel("Savings Plan Discount").clear();
    await page.getByLabel("Savings Plan Discount").fill("0.15");
    await page.getByLabel("On-Demand Discount").clear();
    await page.getByLabel("On-Demand Discount").fill("0.08");
    await page.getByLabel("EBS Cost Discount").clear();
    await page.getByLabel("EBS Cost Discount").fill("0.1");
    await page.getByLabel("Upload Cost Discount").clear();
    await page.getByLabel("Upload Cost Discount").fill("0.12");
    await page.getByLabel("Standard Storage Cost Discount").clear();
    await page.getByLabel("Standard Storage Cost Discount").fill("0.18");
    await page.getByLabel("Infrequent Access Storage Cost Discount").clear();
    await page
      .getByLabel("Infrequent Access Storage Cost Discount")
      .fill("0.22");

    await save(page);
    await validateToast(page, "success", "Settings saved successfully");
    await page.reload();

    await expect(page.getByLabel("Finance Formula")).toHaveValue("0.5");
    await expect(page.getByLabel("Savings Plan Discount")).toHaveValue("0.15");
    await expect(page.getByLabel("On-Demand Discount")).toHaveValue("0.08");
    await expect(page.getByLabel("EBS Cost Discount")).toHaveValue("0.1");
    await expect(page.getByLabel("Upload Cost Discount")).toHaveValue("0.12");
    await expect(page.getByLabel("Standard Storage Cost Discount")).toHaveValue(
      "0.18",
    );
    await expect(
      page.getByLabel("Infrequent Access Storage Cost Discount"),
    ).toHaveValue("0.22");
  });

  test("can clear S3 cost discount values", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    await page.getByLabel("Upload Cost Discount").clear();
    await page.getByLabel("Upload Cost Discount").fill("0.12");
    await page.getByLabel("Standard Storage Cost Discount").clear();
    await page.getByLabel("Standard Storage Cost Discount").fill("0.18");
    await page.getByLabel("Infrequent Access Storage Cost Discount").clear();
    await page
      .getByLabel("Infrequent Access Storage Cost Discount")
      .fill("0.22");

    await save(page);
    await validateToast(page, "success", "Settings saved successfully");
    await page.reload();

    await expect(page.getByLabel("Upload Cost Discount")).toHaveValue("0.12");
    await expect(page.getByLabel("Standard Storage Cost Discount")).toHaveValue(
      "0.18",
    );
    await expect(
      page.getByLabel("Infrequent Access Storage Cost Discount"),
    ).toHaveValue("0.22");

    await page.getByLabel("Upload Cost Discount").clear();
    await page.getByLabel("Standard Storage Cost Discount").clear();
    await page.getByLabel("Infrequent Access Storage Cost Discount").clear();

    await save(page);
    await validateToast(page, "success", "Settings saved successfully");
    await page.reload();

    await expect(page.getByLabel("Upload Cost Discount")).toHaveValue("0");
    await expect(page.getByLabel("Standard Storage Cost Discount")).toHaveValue(
      "0",
    );
    await expect(
      page.getByLabel("Infrequent Access Storage Cost Discount"),
    ).toHaveValue("0");
  });

  test("can save single task host changes", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    await page.getByRole("button", { name: "Add project tasks pair" }).click();
    await page.getByLabel("Project ID / Repo").first().click();
    await expect(page.locator('[role="listbox"]')).toBeVisible();
    await page.locator('[role="option"]').last().click();

    await page.getByLabel("Allowed Tasks").first().fill("compile");
    await page.getByLabel("Allowed Tasks").first().press("Enter");
    await page.getByLabel("Allowed Tasks").first().fill("test");
    await page.getByLabel("Allowed Tasks").first().press("Enter");

    await save(page);
    await validateToast(page, "success", "Settings saved successfully");
    await page.reload();

    await expect(page.getByLabel("Project ID / Repo")).toHaveCount(3);
  });

  test("can save bucket config changes", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    const bucketConfig = page.getByTestId("bucket-config");
    await bucketConfig.getByLabel("Name").clear();
    await bucketConfig.getByLabel("Name").fill("new-log-bucket");

    await save(page);
    await validateToast(page, "success", "Settings saved successfully");
    await page.reload();

    await expect(
      page.getByTestId("bucket-config").getByLabel("Name"),
    ).toHaveValue("new-log-bucket");
  });

  test("can save SSH pairs changes", async ({ authenticatedPage: page }) => {
    await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    const sshPairs = page.getByTestId("ssh-pairs");
    const taskHostKey = sshPairs.getByTestId("task-host-key");
    await taskHostKey.getByLabel("Name").clear();
    await taskHostKey.getByLabel("Name").fill("new-task-host-key");
    await taskHostKey.getByLabel("Secret ARN").clear();
    await taskHostKey.getByLabel("Secret ARN").fill("new-task-host-secret-arn");

    await save(page);
    await validateToast(page, "success", "Settings saved successfully");
    await page.reload();

    await expect(taskHostKey.getByLabel("Name")).toHaveValue(
      "new-task-host-key",
    );
    await expect(taskHostKey.getByLabel("Secret ARN")).toHaveValue(
      "new-task-host-secret-arn",
    );
  });

  test("can save expansions changes", async ({ authenticatedPage: page }) => {
    await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    await page
      .getByTestId("expansions-list")
      .getByRole("button", { name: "Add" })
      .click();
    const newExpansionsRow = page.getByTestId("expansions-list-item").first();
    await newExpansionsRow.getByLabel("Key").fill("NEW_VAR");
    await newExpansionsRow.getByLabel("Value").fill("new_value");

    await save(page);
    await validateToast(page, "success", "Settings saved successfully");
    await page.reload();

    await expect(page.getByTestId("expansions-list-item")).toHaveCount(2);
  });

  test("can save host jasper changes", async ({ authenticatedPage: page }) => {
    await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    const hostJasper = page.getByTestId("host-jasper");
    await hostJasper.getByLabel("Binary Name").clear();
    await hostJasper.getByLabel("Binary Name").fill("new-jasper");

    await save(page);
    await validateToast(page, "success", "Settings saved successfully");
    await page.reload();

    await expect(
      page.getByTestId("host-jasper").getByLabel("Binary Name"),
    ).toHaveValue("new-jasper");
  });

  test("can save JIRA notifications changes", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    const jiraNotifications = page.getByTestId("jira-notifications");
    await jiraNotifications
      .getByRole("button", { name: "Add new Jira project" })
      .click();

    const newJiraNotification = page
      .getByTestId("jira-custom-fields-list-item")
      .first();
    await newJiraNotification.getByLabel("Project").fill("TEST");
    await newJiraNotification.getByLabel("Components").fill("backend");
    await newJiraNotification.getByLabel("Components").press("Enter");
    await newJiraNotification.getByLabel("Labels").fill("feature");
    await newJiraNotification.getByLabel("Labels").press("Enter");

    await save(page);
    await validateToast(page, "success", "Settings saved successfully");
    await page.reload();

    await expect(page.getByTestId("jira-custom-fields-list-item")).toHaveCount(
      3,
    );
  });

  test("can save spawn host changes", async ({ authenticatedPage: page }) => {
    await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    await page.getByLabel("Unexpirable Hosts Per User").clear();
    await page.getByLabel("Unexpirable Hosts Per User").fill("5");

    await save(page);
    await validateToast(page, "success", "Settings saved successfully");
    await page.reload();

    await expect(page.getByLabel("Unexpirable Hosts Per User")).toHaveValue(
      "5",
    );
  });

  test("can save sleep schedule changes", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    await page.getByLabel("Permanently Exempt Hosts").fill("exempt-host-1");
    await page.getByLabel("Permanently Exempt Hosts").press("Enter");

    await save(page);
    await validateToast(page, "success", "Settings saved successfully");
    await page.reload();

    await expect(
      page
        .getByTestId("sleep-schedule")
        .getByTestId("filter-chip")
        .filter({ hasText: "exempt-host-1" }),
    ).toBeVisible();
  });

  test("can save tracer configuration changes", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    const tracerConfiguration = page.getByTestId("tracer-configuration");
    const tracerEnabledCheckbox =
      tracerConfiguration.getByLabel("Enable tracer");
    await clickLabelForLocator(tracerEnabledCheckbox);

    await page.getByLabel("Collector Endpoint").clear();
    await page
      .getByLabel("Collector Endpoint")
      .fill("https://new-collector.example.com");

    await page.getByLabel("Trace URL Template").clear();
    await page
      .getByLabel("Trace URL Template")
      .fill("https://apm.example.com/trace/%s");

    await save(page);
    await validateToast(page, "success", "Settings saved successfully");
    await page.reload();

    await expect(
      page.getByTestId("tracer-configuration").getByLabel("Enable tracer"),
    ).toBeChecked();
    await expect(page.getByLabel("Collector Endpoint")).toHaveValue(
      "https://new-collector.example.com",
    );
    await expect(page.getByLabel("Trace URL Template")).toHaveValue(
      "https://apm.example.com/trace/%s",
    );
  });

  test("can save project creation changes", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    await page.getByLabel("Total Project Limit").clear();
    await page.getByLabel("Total Project Limit").fill("150");

    const projectCreationSettings = page.getByTestId(
      "project-creation-settings",
    );
    await projectCreationSettings
      .getByRole("button", { name: "Add repository exception" })
      .click();
    const newProjectCreationException = page
      .getByTestId("repo-exceptions-list-item")
      .first();
    await newProjectCreationException.getByLabel("Owner").fill("test-owner");
    await newProjectCreationException
      .getByLabel("Repository")
      .fill("test-repo");

    await save(page);
    await validateToast(page, "success", "Settings saved successfully");
    await page.reload();

    await expect(page.getByLabel("Total Project Limit")).toHaveValue("150");
    await expect(page.getByTestId("repo-exceptions-list-item")).toHaveCount(1);
  });

  test("can save GitHub check run changes", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    await page.getByLabel("Check Run Limit").clear();
    await page.getByLabel("Check Run Limit").fill("25");

    await save(page);
    await validateToast(page, "success", "Settings saved successfully");
    await page.reload();

    await expect(page.getByLabel("Check Run Limit")).toHaveValue("25");
  });
});
