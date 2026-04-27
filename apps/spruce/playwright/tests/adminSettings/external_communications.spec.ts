import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";
import { save } from "./utils";

test.describe("external communications", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/admin-settings");
  });

  test("can save after making changes", async ({ authenticatedPage: page }) => {
    await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    await page.getByTestId("navitem-admin-jira").click();

    // JIRA section.
    const jira = page.getByTestId("jira");
    await jira.getByLabel("Email").clear();
    await jira.getByLabel("Email").fill("test@example.com");
    await jira.getByLabel("Host").clear();
    await jira.getByLabel("Host").fill("jira.test.com");
    await jira.getByLabel("Personal Access Token").clear();
    await jira.getByLabel("Personal Access Token").fill("password");

    // Slack section.
    const slack = page.getByTestId("slack");
    await slack.getByLabel("Token").clear();
    await slack.getByLabel("Token").fill("xoxb-test-token");
    await slack.getByLabel("App Name").clear();
    await slack.getByLabel("App Name").fill("test-app");
    await slack.getByLabel("Channel").clear();
    await slack.getByLabel("Channel").fill("#test-channel");
    await slack.getByLabel("Fields To Set").fill("field1");
    await slack.getByLabel("Fields To Set").press("Enter");
    await slack.getByLabel("Fields To Set").fill("field2");
    await slack.getByLabel("Fields To Set").press("Enter");

    // Splunk section.
    const splunk = page.getByTestId("splunk");
    await splunk.getByLabel("Server URL").clear();
    await splunk.getByLabel("Server URL").fill("splunk.test.com");
    await splunk.getByLabel("Channel").clear();
    await splunk.getByLabel("Channel").fill("test-logs");

    // Runtime Environments section.
    const runtimeEnv = page.getByTestId("runtime-environments");
    await runtimeEnv.getByLabel("Base URL").clear();
    await runtimeEnv.getByLabel("Base URL").fill("runtime.test.com");

    // Test Selection section.
    const testSelection = page.getByTestId("test-selection");
    await testSelection.getByLabel("URL").clear();
    await testSelection.getByLabel("URL").fill("testselection.test.com");

    // FWS section.
    const fws = page.getByTestId("fws");
    await fws.getByLabel("URL").clear();
    await fws.getByLabel("URL").fill("fws.test.com");

    // Cedar section.
    const cedar = page.getByTestId("cedar");
    await cedar.getByLabel("Database URL").clear();
    await cedar.getByLabel("Database URL").fill("cedar-db.test.com");
    await cedar.getByLabel("Database Name").clear();
    await cedar.getByLabel("Database Name").fill("test-cedar-db");
    await cedar.getByLabel("SPS URL (Vanity, for hosts only)").clear();
    await cedar
      .getByLabel("SPS URL (Vanity, for hosts only)")
      .fill("sps.test.com");
    await cedar.getByLabel("SPS Kanopy URL").clear();
    await cedar.getByLabel("SPS Kanopy URL").fill("sps-kanopy.test.com");

    // Sage section.
    const sage = page.getByTestId("sage");
    await sage.getByLabel("Base URL").clear();
    await sage.getByLabel("Base URL").fill("sage.test.com");

    await save(page);
    await validateToast(page, "success", "Settings saved successfully");
    await page.reload();

    // Verify JIRA section.
    await expect(jira.getByLabel("Email")).toHaveValue("test@example.com");
    await expect(jira.getByLabel("Host")).toHaveValue("jira.test.com");

    // Verify Slack section.
    await expect(slack.getByLabel("Token")).toHaveValue("xoxb-test-token");
    await expect(slack.getByLabel("App Name")).toHaveValue("test-app");
    await expect(slack.getByLabel("Channel")).toHaveValue("#test-channel");
    await expect(slack.getByTestId("filter-chip")).toHaveCount(2);
    await expect(
      slack.getByTestId("filter-chip").filter({ hasText: "field1" }),
    ).toBeVisible();
    await expect(
      slack.getByTestId("filter-chip").filter({ hasText: "field2" }),
    ).toBeVisible();

    // Verify Splunk section.
    await expect(splunk.getByLabel("Server URL")).toHaveValue(
      "splunk.test.com",
    );
    await expect(splunk.getByLabel("Channel")).toHaveValue("test-logs");

    // Verify Runtime Environments section.
    await expect(runtimeEnv.getByLabel("Base URL")).toHaveValue(
      "runtime.test.com",
    );

    // Verify Test Selection section.
    await expect(testSelection.getByLabel("URL")).toHaveValue(
      "testselection.test.com",
    );

    // Verify FWS section.
    await expect(fws.getByLabel("URL")).toHaveValue("fws.test.com");

    // Verify Cedar section.
    await expect(cedar.getByLabel("Database URL")).toHaveValue(
      "cedar-db.test.com",
    );
    await expect(cedar.getByLabel("Database Name")).toHaveValue(
      "test-cedar-db",
    );
    await expect(
      cedar.getByLabel("SPS URL (Vanity, for hosts only)"),
    ).toHaveValue("sps.test.com");
    await expect(cedar.getByLabel("SPS Kanopy URL")).toHaveValue(
      "sps-kanopy.test.com",
    );

    // Verify Sage section.
    await expect(sage.getByLabel("Base URL")).toHaveValue("sage.test.com");
  });
});
