import { test, expect } from "../../fixtures";

const baseRoute = "/preferences";

test.describe("user preferences pages", () => {
  test("visiting /preferences should redirect to the profile tab", async ({
    page,
  }) => {
    await page.goto(baseRoute);
    await expect(page).toHaveURL(`${baseRoute}/profile`);
  });

  test("should be able to navigate between tabs using the side nav", async ({
    page,
  }) => {
    await page.goto(baseRoute);
    await expect(page.getByTestId("preferences-tab-title")).toHaveText(
      "Profile",
    );
    await page.getByTestId("notifications-nav-tab").click();
    await expect(page.getByTestId("preferences-tab-title")).toHaveText(
      "Notifications",
    );
  });

  test("disabling task review should hide review button on a task page", async ({
    page,
  }) => {
    const failedTaskRoute =
      "/task/evergreen_ubuntu1604_test_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";

    await page.goto(failedTaskRoute);

    await page.getByRole("button", { name: "Mark reviewed" }).click();
    await expect(
      page.getByRole("button", { name: "Mark unreviewed" }),
    ).toBeVisible();

    await page.getByTestId("user-dropdown-link").click();
    const settingsLink = page.getByRole("menuitem", { name: "UI Settings" });
    await settingsLink.click();

    const toggle = page.getByLabel("Task review");
    await expect(toggle).toBeChecked();
    await toggle.click();
    await expect(toggle).not.toBeChecked();

    await page.goBack();
    await expect(
      page.getByRole("button", { name: "Mark unreviewed" }),
    ).toHaveCount(0);
  });
});
