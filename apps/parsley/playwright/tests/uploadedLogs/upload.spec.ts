import { readFileSync } from "fs";
import { test, expect } from "../../fixtures";
import * as helpers from "../../helpers";

test.describe("Upload page", () => {
  test.describe("uploading logs", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto("/upload");
    });

    test("should be able to drag and drop a file", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("upload-zone")).toBeVisible();

      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles("sample_logs/resmoke.log");

      await expect(page.getByTestId("parse-log-select")).toBeVisible();
    });

    test("should be able to select a file", async ({
      authenticatedPage: page,
    }) => {
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles("sample_logs/resmoke.log");

      await expect(page.getByTestId("parse-log-select")).toBeVisible();
    });

    test("selecting a log type should render the log with the appropriate parser", async ({
      authenticatedPage: page,
    }) => {
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles("sample_logs/resmoke.log");

      await expect(page.getByTestId("parse-log-select")).toBeVisible();
      await page.getByTestId("parse-log-select").click();
      await page.getByRole("option", { name: "Resmoke" }).click();
      await page.getByTestId("process-log-button").click();

      await expect(page.getByTestId("log-window")).toBeVisible();
      expect(await page.getByTestId("resmoke-row").count()).toBeGreaterThan(0);
    });
  });

  test.describe("uploading logs via clipboard", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      // Set up clipboard mock before navigation.
      await page.goto("/upload");
    });

    test("should be able to paste text into Parsley", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("upload-zone")).toBeVisible();

      const fileContents = readFileSync("sample_logs/resmoke.log", "utf-8");
      await helpers.paste(page, 'input[type="file"]', {
        pastePayload: fileContents,
        pasteFormat: "text/plain",
      });

      await expect(page.getByTestId("parse-log-select")).toBeVisible();
    });

    test("selecting a log type should render the log with the appropriate parser", async ({
      authenticatedPage: page,
    }) => {
      const fileContents = readFileSync("sample_logs/resmoke.log", "utf-8");
      await helpers.paste(page, 'input[type="file"]', {
        pastePayload: fileContents,
        pasteFormat: "text/plain",
      });

      const parseLogSelect = page.getByTestId("parse-log-select");
      await expect(parseLogSelect).toBeVisible();
      await parseLogSelect.click();

      const resmokeOption = page.getByRole("option", {
        name: "Resmoke",
      });
      await expect(resmokeOption).toBeVisible();
      await resmokeOption.click();

      const processButton = page.getByTestId("process-log-button");
      await expect(processButton).toBeVisible();
      await processButton.click();

      await expect(page.getByTestId("log-window")).toBeVisible();
      const resmokeRows = page.getByTestId("resmoke-row");
      expect(await resmokeRows.count()).toBeGreaterThan(0);
      await expect(resmokeRows.first()).toContainText(
        "[js_test:group_pushdown] Fixture status:",
      );
    });
  });

  test.describe("navigating away", () => {
    const logLink =
      "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";

    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto(logLink);
    });

    test("trying to navigate away to the upload page should prompt the user", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("log-window")).toBeVisible();
      await page.getByTestId("upload-link").click();
      await expect(page.getByTestId("confirmation-modal")).toBeVisible();
      await page.getByRole("button", { name: "Confirm" }).click();
      await expect(page.getByTestId("upload-zone")).toBeVisible();
    });
  });
});
