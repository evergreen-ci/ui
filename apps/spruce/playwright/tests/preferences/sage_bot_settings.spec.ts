import { Page } from "@playwright/test";
import { test, expect } from "../../fixtures";
import { mockGraphQLResponse, validateToast } from "../../helpers";

const route = "/preferences/sage-bot-settings";

const setupSageMocks = async (
  page: Page,
  initialState: { keyConfigured: boolean; keyLastFour: string },
) => {
  const state = { ...initialState };

  await mockGraphQLResponse(page, "CursorSettings", () => ({
    data: {
      cursorSettings: {
        __typename: "CursorSettings",
        keyConfigured: state.keyConfigured,
        keyLastFour: state.keyConfigured ? state.keyLastFour : "",
      },
    },
    errors: null,
  }));

  await mockGraphQLResponse(page, "SetCursorAPIKey", () => {
    state.keyConfigured = true;
    state.keyLastFour = "2345";
    return {
      data: {
        setCursorAPIKey: {
          __typename: "SetCursorAPIKeyPayload",
          keyLastFour: state.keyLastFour,
          success: true,
        },
      },
      errors: null,
    };
  });

  await mockGraphQLResponse(page, "DeleteCursorAPIKey", () => {
    state.keyConfigured = false;
    state.keyLastFour = "";
    return {
      data: {
        deleteCursorAPIKey: {
          __typename: "DeleteCursorAPIKeyPayload",
          success: true,
        },
      },
      errors: null,
    };
  });
};

test.describe("Sage Bot Settings", () => {
  test("should navigate to Sage Bot Settings from sidebar and display the tab", async ({
    authenticatedPage: page,
  }) => {
    await setupSageMocks(page, { keyConfigured: false, keyLastFour: "" });
    await page.goto("/preferences/profile");
    await page.getByTestId("sage-bot-settings-nav-tab").click();
    await expect(page).toHaveURL(/\/preferences\/sage-bot-settings/);
    await expect(page.getByTestId("cursor-api-key-card")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Cursor API Key" }),
    ).toBeVisible();
  });

  test("should have a disabled save button when input is empty", async ({
    authenticatedPage: page,
  }) => {
    await setupSageMocks(page, { keyConfigured: false, keyLastFour: "" });
    await page.goto(route);
    await expect(
      page.getByTestId("save-cursor-api-key-button"),
    ).toHaveAttribute("aria-disabled", "true");
  });

  test("should enable save button when API key is entered", async ({
    authenticatedPage: page,
  }) => {
    await setupSageMocks(page, { keyConfigured: false, keyLastFour: "" });
    await page.goto(route);
    await page.getByTestId("cursor-api-key-input").fill("test-api-key-12345");
    await expect(
      page.getByTestId("save-cursor-api-key-button"),
    ).toHaveAttribute("aria-disabled", "false");
  });

  test("should save cursor API key and show success toast", async ({
    authenticatedPage: page,
  }) => {
    await setupSageMocks(page, { keyConfigured: false, keyLastFour: "" });
    await page.goto(route);
    await page.getByTestId("cursor-api-key-input").fill("test-api-key-12345");
    await page.getByTestId("save-cursor-api-key-button").click();
    await validateToast(page, "success", "Cursor API key saved successfully");
    await expect(page.getByTestId("cursor-key-status")).toBeVisible();
    await expect(
      page.getByTestId("delete-cursor-api-key-button"),
    ).toBeVisible();
  });

  test("should delete cursor API key and show success toast", async ({
    authenticatedPage: page,
  }) => {
    await setupSageMocks(page, { keyConfigured: true, keyLastFour: "2345" });
    await page.goto(route);
    await expect(
      page.getByTestId("delete-cursor-api-key-button"),
    ).toBeVisible();
    await page.getByTestId("delete-cursor-api-key-button").click();
    await validateToast(page, "success", "Cursor API key deleted successfully");
    await expect(page.getByTestId("delete-cursor-api-key-button")).toHaveCount(
      0,
    );
  });
});
