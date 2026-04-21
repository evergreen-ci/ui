import { test, expect } from "../../fixtures";
import {
  selectOption,
  validateToast,
  clickCheckboxByLabel,
} from "../../helpers";
import { mockGraphQLResponse } from "../../utils";

test.describe("Waterfall menu settings", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/project/evergreen/waterfall");
  });

  test("toggles the omit inactive builds checkbox and persists the setting", async ({
    authenticatedPage: page,
  }) => {
    await page.getByTestId("waterfall-menu").click();
    await expect(
      page.getByTestId("omit-inactive-builds-checkbox"),
    ).not.toBeChecked();
    await clickCheckboxByLabel(page, "Omit inactive builds");
    await expect(
      page.getByTestId("omit-inactive-builds-checkbox"),
    ).toBeChecked();

    await page.reload();
    await page.getByTestId("waterfall-menu").click();
    await expect(
      page.getByTestId("omit-inactive-builds-checkbox"),
    ).toBeChecked();

    await clickCheckboxByLabel(page, "Omit inactive builds");
  });

  test("omits inactive build variants when filter is applied and setting is enabled", async ({
    authenticatedPage: page,
  }) => {
    await page.getByTestId("build-variant-filter-input").fill("Lint");
    await page.getByTestId("build-variant-filter-input").press("Enter");
    await expect(page.getByTestId("build-variant-label")).toHaveCount(1);

    await page.getByTestId("waterfall-menu").click();
    await clickCheckboxByLabel(page, "Omit inactive builds");
    await page.locator("body").click();

    await page.getByTestId("build-variant-filter-input").clear();
    await page.getByTestId("build-variant-filter-input").fill("Ubuntu");
    await page.getByTestId("build-variant-filter-input").press("Enter");

    const count = await page.getByTestId("build-variant-label").count();
    expect(count).toBeGreaterThanOrEqual(1);

    await page.getByTestId("waterfall-menu").click();
    await clickCheckboxByLabel(page, "Omit inactive builds");
  });
});

test.describe("Waterfall subscription modal", () => {
  const route = "/project/spruce/waterfall";
  const dataCyModal = "waterfall-notification-modal";
  const errorTextRegex = "Value should be a valid regex expression.";
  const successText = "Your subscription has been added";

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(route);
  });

  test("Displays success toast after submitting a valid form and request succeeds", async ({
    authenticatedPage: page,
  }) => {
    await page.getByTestId("waterfall-menu").click();
    await page.getByTestId("add-notification").click();
    await expect(page.getByTestId(dataCyModal)).toBeVisible();

    await selectOption(page, "Event", "Any version finishes");
    await selectOption(page, "Notification Method", "JIRA issue");

    await page.getByTestId("jira-comment-input").fill("EVG-2000");

    const saveButton = page.getByRole("button", { name: "Save" });
    await expect(saveButton).toBeEnabled();
    await saveButton.click();
    await validateToast(page, "success", successText);
  });

  test("Disables save button and displays an error message when populating form with invalid values", async ({
    authenticatedPage: page,
  }) => {
    await page.getByTestId("waterfall-menu").click();
    await page.getByTestId("add-notification").click();
    await expect(page.getByTestId(dataCyModal)).toBeVisible();

    await selectOption(page, "Event", "Any build finishes");
    await page.getByTestId("add-button").click();

    const saveButton = page.getByRole("button", { name: "Save" });
    await expect(saveButton).toBeDisabled();

    await page.getByTestId("jira-comment-input").fill("EVG-2000");
    await page.getByTestId("regex-input").fill("*.notValidRegex");
    await expect(page.getByText(errorTextRegex)).toBeVisible();
    await expect(saveButton).toBeDisabled();

    await page.getByTestId("regex-input").clear();
    await page.getByTestId("regex-input").fill("validRegex");
    await saveButton.click();
    await validateToast(page, "success", successText);
  });

  test("Displays error toast when save subscription request fails", async ({
    authenticatedPage: page,
  }) => {
    await mockGraphQLResponse(page, "SaveSubscriptionForUser", {
      errors: [
        {
          message: "error",
          path: ["SaveSubscriptionForUser"],
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        },
      ],
      data: null,
    });

    await page.getByTestId("waterfall-menu").click();
    await page.getByTestId("add-notification").click();
    await expect(page.getByTestId(dataCyModal)).toBeVisible();

    await selectOption(page, "Event", "Any version finishes");
    await page.getByTestId("jira-comment-input").fill("EVG-2000");
    await page.getByRole("button", { name: "Save" }).click();
    await validateToast(page, "error", "Error adding your subscription");
  });

  test("Hides the modal after clicking the cancel button", async ({
    authenticatedPage: page,
  }) => {
    await page.getByTestId("waterfall-menu").click();
    await page.getByTestId("add-notification").click();
    await expect(page.getByTestId(dataCyModal)).toBeVisible();
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByTestId(dataCyModal)).toBeHidden();
  });

  test("Pulls initial values from cookies", async ({
    authenticatedPage: page,
    context,
  }) => {
    const type = "project";
    const triggerCookie = `${type}-notification-trigger`;
    await context.addCookies([
      {
        name: triggerCookie,
        value: "any-build-fails",
        domain: "localhost",
        path: "/",
      },
      {
        name: "subscription-method",
        value: "slack",
        domain: "localhost",
        path: "/",
      },
    ]);

    await page.reload();
    await page.getByTestId("waterfall-menu").click();
    await page.getByTestId("add-notification").click();
    await expect(page.getByTestId(dataCyModal)).toBeVisible();
    await expect(page.getByText("Any build fails")).toBeVisible();
    await expect(
      page.getByTestId("notification-method-select").getByText("Slack message"),
    ).toBeVisible();
  });
});
