import { test, expect } from "../../fixtures";
import { clickLabelForLocator, validateToast } from "../../helpers";
import { save } from "./utils";

test.describe("admin settings save properly", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/admin-settings");
  });

  test("saves changes in each section independently", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    await page.getByLabel("Config Directory").clear();
    await page.getByLabel("Config Directory").fill("/test/config/dir");
    await page.getByLabel("GitHub Organizations").fill("testorg");
    await page.getByLabel("GitHub Organizations").press("Enter");

    await page.getByLabel("Finance Formula").clear();
    await page.getByLabel("Finance Formula").fill("0.75");

    const bucketConfig = page.getByTestId("bucket-config");
    await bucketConfig.getByLabel("Default Log Bucket").clear();
    await bucketConfig.getByLabel("Default Log Bucket").fill("test-logs");

    const sshPairs = page.getByTestId("ssh-pairs");
    await sshPairs.getByLabel("Name").first().clear();
    await sshPairs.getByLabel("Name").first().fill("test-task-host-key");
    await sshPairs.getByLabel("Secret ARN").first().clear();
    await sshPairs
      .getByLabel("Secret ARN")
      .first()
      .fill("test-task-host-secret-arn");

    const hostJasper = page.getByTestId("host-jasper");
    await hostJasper.getByLabel("Binary Name").clear();
    await hostJasper.getByLabel("Binary Name").fill("test-jasper");

    await page.getByLabel("Total Spawn Hosts Per User").clear();
    await page.getByLabel("Total Spawn Hosts Per User").fill("10");

    await page.getByLabel("Permanently Exempt Hosts").fill("test-host");
    await page.getByLabel("Permanently Exempt Hosts").press("Enter");

    const tracerConfiguration = page.getByTestId("tracer-configuration");
    const tracerEnabledCheckbox =
      tracerConfiguration.getByLabel("Enable tracer");
    await clickLabelForLocator(tracerEnabledCheckbox);
    await tracerConfiguration.getByLabel("Collector Endpoint").clear();
    await tracerConfiguration
      .getByLabel("Collector Endpoint")
      .fill("https://test-collector.com");
    await tracerConfiguration.getByLabel("Trace URL Template").clear();
    await tracerConfiguration
      .getByLabel("Trace URL Template")
      .fill("https://apm.test.com/trace/%s");

    await save(page);
    await validateToast(page, "success", "Settings saved successfully");
    await page.reload();

    await expect(page.getByLabel("Config Directory")).toHaveValue(
      "/test/config/dir",
    );
    await expect(
      page
        .getByTestId("misc-settings")
        .getByTestId("filter-chip")
        .filter({ hasText: "testorg" }),
    ).toBeVisible();
    await expect(page.getByLabel("Finance Formula")).toHaveValue("0.75");
    await expect(bucketConfig.getByLabel("Default Log Bucket")).toHaveValue(
      "test-logs",
    );
    await expect(sshPairs.getByLabel("Name").first()).toHaveValue(
      "test-task-host-key",
    );
    await expect(sshPairs.getByLabel("Secret ARN").first()).toHaveValue(
      "test-task-host-secret-arn",
    );
    await expect(hostJasper.getByLabel("Binary Name")).toHaveValue(
      "test-jasper",
    );
    await expect(page.getByLabel("Total Spawn Hosts Per User")).toHaveValue(
      "10",
    );
    await expect(
      page
        .getByTestId("sleep-schedule")
        .getByTestId("filter-chip")
        .filter({ hasText: "test-host" }),
    ).toBeVisible();
    await expect(tracerConfiguration.getByLabel("Enable tracer")).toBeChecked();
    await expect(
      tracerConfiguration.getByLabel("Collector Endpoint"),
    ).toHaveValue("https://test-collector.com");
    await expect(
      tracerConfiguration.getByLabel("Trace URL Template"),
    ).toHaveValue("https://apm.test.com/trace/%s");

    // Modify single section.
    await page.getByLabel("Total Project Limit").clear();
    await page.getByLabel("Total Project Limit").fill("200");
    const projectCreationSettings = page.getByTestId(
      "project-creation-settings",
    );
    await projectCreationSettings
      .getByRole("button", { name: "Add repository exception" })
      .click();
    const newProjectCreationException = page
      .getByTestId("repo-exceptions-list-item")
      .first();
    await newProjectCreationException.getByLabel("Owner").fill("owner");
    await newProjectCreationException.getByLabel("Repository").fill("repo");

    await save(page);
    await validateToast(page, "success", "Settings saved successfully");
    await page.reload();

    await page.getByLabel("Total Project Limit").scrollIntoViewIfNeeded();
    await expect(page.getByLabel("Total Project Limit")).toHaveValue("200");
    await expect(newProjectCreationException.getByLabel("Owner")).toHaveValue(
      "owner",
    );
    await expect(
      newProjectCreationException.getByLabel("Repository"),
    ).toHaveValue("repo");

    // Verify other sections unchanged.
    await expect(page.getByLabel("Config Directory")).toHaveValue(
      "/test/config/dir",
    );
    await expect(
      page
        .getByTestId("misc-settings")
        .getByTestId("filter-chip")
        .filter({ hasText: "testorg" }),
    ).toBeVisible();
    await expect(page.getByLabel("Finance Formula")).toHaveValue("0.75");
    await expect(bucketConfig.getByLabel("Default Log Bucket")).toHaveValue(
      "test-logs",
    );
    await expect(sshPairs.getByLabel("Name").first()).toHaveValue(
      "test-task-host-key",
    );
    await expect(sshPairs.getByLabel("Secret ARN").first()).toHaveValue(
      "test-task-host-secret-arn",
    );
    await expect(hostJasper.getByLabel("Binary Name")).toHaveValue(
      "test-jasper",
    );
    await expect(page.getByLabel("Total Spawn Hosts Per User")).toHaveValue(
      "10",
    );
    await expect(
      page
        .getByTestId("sleep-schedule")
        .getByTestId("filter-chip")
        .filter({ hasText: "test-host" }),
    ).toBeVisible();
    await expect(tracerConfiguration.getByLabel("Enable tracer")).toBeChecked();
    await expect(
      tracerConfiguration.getByLabel("Collector Endpoint"),
    ).toHaveValue("https://test-collector.com");
    await expect(
      tracerConfiguration.getByLabel("Trace URL Template"),
    ).toHaveValue("https://apm.test.com/trace/%s");
  });

  test.describe("save parameter store values independently", () => {
    test("saves Okta Client Secret parameter store value independently", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
        "aria-disabled",
        "true",
      );

      const okta = page.getByTestId("okta");
      await okta.getByLabel("Client Secret").clear();
      await okta.getByLabel("Client Secret").fill("test-okta-secret");

      const kanopy = page.getByTestId("kanopy");
      await kanopy.getByLabel("Header Name").clear();
      await kanopy.getByLabel("Header Name").fill("test-header-name");
      await kanopy.getByLabel("Issuer").clear();
      await kanopy.getByLabel("Issuer").fill("test-issuer");
      await kanopy.getByLabel("Keyset URL").clear();
      await kanopy.getByLabel("Keyset URL").fill("test-keyset-url");

      await save(page);
      await validateToast(page, "success", "Settings saved successfully");
      await page.reload();

      await expect(okta.getByLabel("Client Secret")).toHaveValue(
        "test-okta-secret",
      );

      const bannerText = page.getByTestId("banner-text");
      await bannerText.clear();
      await bannerText.fill("Okta param store test");

      await save(page);
      await validateToast(page, "success", "Settings saved successfully");
      await page.reload();

      await expect(bannerText).toHaveValue("Okta param store test");
      await expect(okta.getByLabel("Client Secret")).toHaveValue(
        "test-okta-secret",
      );
    });

    test("saves Jira Personal Access Token parameter store value independently", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
        "aria-disabled",
        "true",
      );

      const jira = page.getByTestId("jira");
      await jira.getByLabel("Personal Access Token").clear();
      await jira.getByLabel("Personal Access Token").fill("test-jira-pat");

      await save(page);
      await validateToast(page, "success", "Settings saved successfully");
      await page.reload();

      await expect(jira.getByLabel("Personal Access Token")).toHaveValue(
        "test-jira-pat",
      );

      const bannerText = page.getByTestId("banner-text");
      await bannerText.clear();
      await bannerText.fill("Jira param store test");

      await save(page);
      await validateToast(page, "success", "Settings saved successfully");
      await page.reload();

      await expect(bannerText).toHaveValue("Jira param store test");
      await expect(jira.getByLabel("Personal Access Token")).toHaveValue(
        "test-jira-pat",
      );
    });

    test("saves Slack and Splunk token parameter store values independently", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
        "aria-disabled",
        "true",
      );

      const slack = page.getByTestId("slack");
      await slack.getByLabel("Token").clear();
      await slack.getByLabel("Token").fill("xoxb-test-slack-token");

      const splunk = page.getByTestId("splunk");
      await splunk.getByLabel("Token").clear();
      await splunk.getByLabel("Token").fill("test-splunk-token");

      await save(page);
      await validateToast(page, "success", "Settings saved successfully");
      await page.reload();

      await expect(slack.getByLabel("Token")).toHaveValue(
        "xoxb-test-slack-token",
      );
      await expect(splunk.getByLabel("Token")).toHaveValue("test-splunk-token");

      const bannerText = page.getByTestId("banner-text");
      await bannerText.clear();
      await bannerText.fill("Tokens param store test");

      await save(page);
      await validateToast(page, "success", "Settings saved successfully");
      await page.reload();

      await expect(bannerText).toHaveValue("Tokens param store test");
      await expect(slack.getByLabel("Token")).toHaveValue(
        "xoxb-test-slack-token",
      );
      await expect(splunk.getByLabel("Token")).toHaveValue("test-splunk-token");
    });

    test("saves Runtime Environments API Key parameter store value independently", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
        "aria-disabled",
        "true",
      );

      const runtimeEnv = page.getByTestId("runtime-environments");
      await runtimeEnv.getByLabel("API Key").clear();
      await runtimeEnv.getByLabel("API Key").fill("test-runtime-env-key");

      await save(page);
      await validateToast(page, "success", "Settings saved successfully");
      await page.reload();

      await expect(runtimeEnv.getByLabel("API Key")).toHaveValue(
        "test-runtime-env-key",
      );

      const bannerText = page.getByTestId("banner-text");
      await bannerText.clear();
      await bannerText.fill("Runtime Environments param store test");

      await save(page);
      await validateToast(page, "success", "Settings saved successfully");
      await page.reload();

      await expect(bannerText).toHaveValue(
        "Runtime Environments param store test",
      );
      await expect(runtimeEnv.getByLabel("API Key")).toHaveValue(
        "test-runtime-env-key",
      );
    });

    test("saves AWS EC2 Keys parameter store values independently", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
        "aria-disabled",
        "true",
      );

      const awsConfiguration = page.getByTestId("aws-configuration");
      await awsConfiguration.getByLabel("EC2 Key").clear();
      await awsConfiguration.getByLabel("EC2 Key").fill("test-ec2-key");
      await awsConfiguration.getByLabel("EC2 Secret").clear();
      await awsConfiguration.getByLabel("EC2 Secret").fill("test-ec2-secret");

      await save(page);
      await validateToast(page, "success", "Settings saved successfully");
      await page.reload();

      await expect(awsConfiguration.getByLabel("EC2 Key")).toHaveValue(
        "test-ec2-key",
      );
      await expect(awsConfiguration.getByLabel("EC2 Secret")).toHaveValue(
        "test-ec2-secret",
      );

      const bannerText = page.getByTestId("banner-text");
      await bannerText.clear();
      await bannerText.fill("AWS EC2 param store test");

      await save(page);
      await validateToast(page, "success", "Settings saved successfully");
      await page.reload();

      await expect(bannerText).toHaveValue("AWS EC2 param store test");
      await expect(awsConfiguration.getByLabel("EC2 Key")).toHaveValue(
        "test-ec2-key",
      );
      await expect(awsConfiguration.getByLabel("EC2 Secret")).toHaveValue(
        "test-ec2-secret",
      );
    });

    test("saves S3 Keys parameter store values independently", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
        "aria-disabled",
        "true",
      );

      const bucketConfig = page.getByTestId("bucket-config");
      await bucketConfig.getByLabel("S3 Key").clear();
      await bucketConfig.getByLabel("S3 Key").fill("test-s3-key");
      await bucketConfig.getByLabel("S3 Secret").clear();
      await bucketConfig.getByLabel("S3 Secret").fill("test-s3-secret");

      await save(page);
      await validateToast(page, "success", "Settings saved successfully");
      await page.reload();

      await expect(bucketConfig.getByLabel("S3 Key")).toHaveValue(
        "test-s3-key",
      );
      await expect(bucketConfig.getByLabel("S3 Secret")).toHaveValue(
        "test-s3-secret",
      );

      const bannerText = page.getByTestId("banner-text");
      await bannerText.clear();
      await bannerText.fill("S3 Keys param store test");

      await save(page);
      await validateToast(page, "success", "Settings saved successfully");
      await page.reload();

      await expect(bannerText).toHaveValue("S3 Keys param store test");
      await expect(bucketConfig.getByLabel("S3 Key")).toHaveValue(
        "test-s3-key",
      );
      await expect(bucketConfig.getByLabel("S3 Secret")).toHaveValue(
        "test-s3-secret",
      );
    });

    test("saves GitHub Webhook Secret parameter store value independently", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
        "aria-disabled",
        "true",
      );

      const miscSettings = page.getByTestId("misc-settings");
      await miscSettings.getByLabel("Webhook Secret").clear();
      await miscSettings
        .getByLabel("Webhook Secret")
        .fill("test-webhook-secret");

      await save(page);
      await validateToast(page, "success", "Settings saved successfully");
      await page.reload();

      await expect(
        page.getByTestId("misc-settings").getByLabel("Webhook Secret"),
      ).toHaveValue("test-webhook-secret");

      const bannerText = page.getByTestId("banner-text");
      await bannerText.clear();
      await bannerText.fill("GitHub Webhook Secret param store test");

      await save(page);
      await validateToast(page, "success", "Settings saved successfully");
      await page.reload();

      await expect(bannerText).toHaveValue(
        "GitHub Webhook Secret param store test",
      );
      await expect(
        page.getByTestId("misc-settings").getByLabel("Webhook Secret"),
      ).toHaveValue("test-webhook-secret");
    });

    test("saves Expansions List values independently", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
        "aria-disabled",
        "true",
      );

      const expansionsList = page.getByTestId("expansions-list");
      await expansionsList.getByRole("button", { name: "Add" }).click();
      const newExpansionsRow = page.getByTestId("expansions-list-item").first();
      await newExpansionsRow.getByLabel("Key").fill("TEST_KEY");
      await newExpansionsRow.getByLabel("Value").fill("test_value");

      await save(page);
      await validateToast(page, "success", "Settings saved successfully");
      await page.reload();

      await expect(newExpansionsRow.getByLabel("Key")).toHaveValue("TEST_KEY");
      await expect(newExpansionsRow.getByLabel("Value")).toHaveValue(
        "test_value",
      );

      const bannerText = page.getByTestId("banner-text");
      await bannerText.clear();
      await bannerText.fill("Expansions List test");

      await save(page);
      await validateToast(page, "success", "Settings saved successfully");
      await page.reload();

      await expect(bannerText).toHaveValue("Expansions List test");
      await expect(newExpansionsRow.getByLabel("Key")).toHaveValue("TEST_KEY");
      await expect(newExpansionsRow.getByLabel("Value")).toHaveValue(
        "test_value",
      );
    });
  });
});
