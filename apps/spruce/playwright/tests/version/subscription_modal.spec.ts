import { Page } from "@playwright/test";
import { test, expect } from "../../fixtures";
import { selectLGOption, validateToast } from "../../helpers";

const VERSION_ROUTE = "/version/5e4ff3abe3c3317e352062e4/tasks";
const MODAL_DATA_CY = "patch-notification-modal";
const TOGGLE_BUTTON_DATA_CY = "notify-patch";

test.describe("Version Subscription Modal", () => {
  const openSubscriptionModal = async (page: Page) => {
    await page.goto(VERSION_ROUTE);
    await page.getByTestId(TOGGLE_BUTTON_DATA_CY).click();
  };

  const expectSaveButtonEnabled = async (page: Page, enabled = true) => {
    const saveButton = page.getByRole("button", { name: "Save" });
    if (enabled) {
      await expect(saveButton).not.toHaveAttribute("aria-disabled", "true");
    } else {
      await expect(saveButton).toHaveAttribute("aria-disabled", "true");
    }
  };

  test("Displays success toast after submitting a valid form and request succeeds", async ({
    authenticatedPage: page,
  }) => {
    await openSubscriptionModal(page);
    const modal = page.getByTestId(MODAL_DATA_CY);
    await expect(modal).toBeVisible();

    await selectLGOption(page, "Event", "This version finishes", {
      exact: true,
    });
    await selectLGOption(
      page,
      "Notification Method",
      "Comment on a JIRA issue",
    );

    await page.getByTestId("jira-comment-input").fill("EVG-2000");
    await page.getByRole("button", { name: "Save" }).click();
    await validateToast(page, "success", "Your subscription has been added");
  });

  test.describe("Disables save button and displays an error message when populating form with invalid values", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await openSubscriptionModal(page);
      await expect(page.getByTestId(MODAL_DATA_CY)).toBeVisible();
    });

    test("has an invalid percentage", async ({ authenticatedPage: page }) => {
      await selectLGOption(page, "Event", "changes by some percentage");
      await page.getByTestId("percent-change-input").clear();
      await page.getByTestId("percent-change-input").fill("-100");
      await page.getByTestId("jira-comment-input").fill("EVG-2000");
      await expect(page.getByText("Value should be >= 0")).toBeVisible();
      await expectSaveButtonEnabled(page, false);
      await page.getByTestId("percent-change-input").clear();
      await page.getByTestId("percent-change-input").fill("100");
      await expectSaveButtonEnabled(page, true);
      await page.getByTestId("jira-comment-input").clear();
    });

    test("has an invalid duration value", async ({
      authenticatedPage: page,
    }) => {
      await selectLGOption(page, "Event", "exceeds some duration");
      await page.getByTestId("duration-secs-input").clear();
      await page.getByTestId("duration-secs-input").fill("-100");
      await page.getByTestId("jira-comment-input").fill("EVG-2000");
      await expect(page.getByText("Value should be >= 0")).toBeVisible();
      await expectSaveButtonEnabled(page, false);
      await page.getByTestId("duration-secs-input").clear();
      await page.getByTestId("duration-secs-input").fill("100");
      await expectSaveButtonEnabled(page, true);
      await page.getByTestId("jira-comment-input").clear();
    });

    test("has an invalid jira ticket", async ({ authenticatedPage: page }) => {
      await page.getByTestId("jira-comment-input").fill("E");
      await expectSaveButtonEnabled(page, false);
      await page.getByTestId("jira-comment-input").fill("EVG-100");
      await expectSaveButtonEnabled(page, true);
      await page.getByTestId("jira-comment-input").clear();
    });

    test("has an invalid email", async ({ authenticatedPage: page }) => {
      await selectLGOption(page, "Notification Method", "Email");
      await page.getByTestId("email-input").clear();
      await page.getByTestId("email-input").fill("arst");
      await expectSaveButtonEnabled(page, false);
      await page.getByTestId("email-input").fill("rat@rast.com");
      await expectSaveButtonEnabled(page, true);
    });

    test("has an invalid slack username", async ({
      authenticatedPage: page,
    }) => {
      await selectLGOption(page, "Notification Method", "Slack message");
      await page.getByTestId("slack-input").clear();
      await page.getByTestId("slack-input").fill("sa rt");
      await expectSaveButtonEnabled(page, false);
      await page.getByTestId("slack-input").clear();
      await page.getByTestId("slack-input").fill("@sart");
      await expectSaveButtonEnabled(page, true);
    });
  });

  test("Displays error toast when save subscription request fails", async ({
    authenticatedPage: page,
  }) => {
    // Mock GraphQL error response BEFORE opening the modal
    await page.route("**/graphql/query", async (route) => {
      const request = route.request();
      const postData = request.postDataJSON();
      if (postData?.operationName === "SaveSubscriptionForUser") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            errors: [
              {
                message: "error",
                path: ["SaveSubscriptionForUser"],
                extensions: { code: "INTERNAL_SERVER_ERROR" },
              },
            ],
            data: null,
          }),
        });
      } else {
        await route.continue();
      }
    });

    await openSubscriptionModal(page);
    await expect(page.getByTestId(MODAL_DATA_CY)).toBeVisible();
    await selectLGOption(page, "Event", "This version finishes", {
      exact: true,
    });
    await page.getByTestId("jira-comment-input").fill("EVG-2000");
    await page.getByRole("button", { name: "Save" }).click();
    await validateToast(page, "error", "Error adding your subscription");
  });

  test("Hides the modal after clicking the cancel button", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(VERSION_ROUTE);
    await page.getByTestId(TOGGLE_BUTTON_DATA_CY).click();
    await expect(page.getByTestId(MODAL_DATA_CY)).toBeVisible();
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByTestId(MODAL_DATA_CY)).toBeHidden();
  });

  test("Pulls initial values from cookies", async ({
    authenticatedPage: page,
    context,
  }) => {
    const triggerCookie = "version-notification-trigger";
    const subscriptionCookie = "subscription-method";

    await context.addCookies([
      {
        name: triggerCookie,
        value: "version-succeeds",
        domain: "localhost",
        path: "/",
      },
      {
        name: subscriptionCookie,
        value: "slack",
        domain: "localhost",
        path: "/",
      },
    ]);

    await openSubscriptionModal(page);
    await expect(page.getByTestId(MODAL_DATA_CY)).toBeVisible();
    await expect(page.getByText("This version succeeds")).toBeVisible();
    await expect(
      page.getByTestId("notification-method-select").getByText("Slack message"),
    ).toBeVisible();

    await context.clearCookies();
  });
});
