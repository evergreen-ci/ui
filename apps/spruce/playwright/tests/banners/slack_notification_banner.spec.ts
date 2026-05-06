import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";

const slackNotificationBanner = "slack-notification-banner";
const slackUsername = "username";

test.describe("Slack notification banner", () => {
  test("does not show up if user has the cookie set", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/");
    await expect(page.getByTestId(slackNotificationBanner)).toBeHidden();
  });

  test("shows up across the app if user has not set slack notification settings", async ({
    authenticatedPage: page,
  }) => {
    // Clear the cookie to simulate a user who hasn't set slack notification settings.
    await page.context().clearCookies({ name: "has-closed-slack-banner" });
    const banner = page.getByTestId(slackNotificationBanner);

    await page.goto("/");
    await expect(banner).toBeVisible();

    await page.goto("/version/5ecedafb562343215a7ff297/tasks");
    await expect(banner).toBeVisible();

    await page.goto(
      "/task/evergreen_ubuntu1604_dist_patch_33016573166a36bd5f46b4111151899d5c4e95b1_5ecedafb562343215a7ff297_20_05_27_21_39_46/logs?execution=1",
    );
    await expect(banner).toBeVisible();
  });

  test("after user has entered their username and clicks 'save', new settings are reflected in user preferences", async ({
    authenticatedPage: page,
  }) => {
    // Clear the cookie to make the banner visible.
    await page.context().clearCookies({ name: "has-closed-slack-banner" });
    const banner = page.getByTestId(slackNotificationBanner);

    await page.goto("/version/5ecedafb562343215a7ff297/tasks");
    await expect(banner).toBeVisible();
    await page.getByTestId("subscribe-to-notifications").click();
    await page.getByTestId("slack-username-input").fill(slackUsername);
    await page.getByRole("button", { name: "Save" }).click();
    await expect(banner).toBeHidden();
    await validateToast(
      page,
      "success",
      "You will now receive Slack notifications when your patches fail or succeed",
    );

    await page.goto("/preferences/notifications");
    await expect(banner).toBeHidden();
    await expect(page.getByTestId("slack-username-field")).toHaveValue(
      slackUsername,
    );
    await expect(
      page.locator('input[name="Patch finish"][data-label="Slack"]'),
    ).toBeChecked();
    await expect(
      page.locator(
        'input[name="Patch first task failure"][data-label="Slack"]',
      ),
    ).toBeChecked();
  });
});
