import fs from "fs";
import { test, expect } from "../../fixtures";
import * as helpers from "../../helpers";

test.describe("Upload page", () => {
  test.describe("uploading logs", () => {
    test.beforeEach(async ({ authenticatedPage }) => {
      await authenticatedPage.goto("/upload");
    });

    test("should be able to drag and drop a file", async ({
      authenticatedPage,
    }) => {
      await expect(
        helpers.getByDataCy(authenticatedPage, "upload-zone"),
      ).toBeVisible();

      const fileInput = authenticatedPage.locator('input[type="file"]');
      await fileInput.setInputFiles("sample_logs/resmoke.log");

      await expect(
        helpers.getByDataCy(authenticatedPage, "parse-log-select"),
      ).toBeVisible();
    });

    test("should be able to select a file", async ({ authenticatedPage }) => {
      const fileInput = authenticatedPage.locator('input[type="file"]');
      await fileInput.setInputFiles("sample_logs/resmoke.log");

      await expect(
        helpers.getByDataCy(authenticatedPage, "parse-log-select"),
      ).toBeVisible();
    });

    test("selecting a log type should render the log with the appropriate parser", async ({
      authenticatedPage,
    }) => {
      const fileInput = authenticatedPage.locator('input[type="file"]');
      await fileInput.setInputFiles("sample_logs/resmoke.log");

      await expect(
        helpers.getByDataCy(authenticatedPage, "parse-log-select"),
      ).toBeVisible();
      await helpers.getByDataCy(authenticatedPage, "parse-log-select").click();
      await authenticatedPage.getByRole("option", { name: "Resmoke" }).click();
      await helpers
        .getByDataCy(authenticatedPage, "process-log-button")
        .click();

      await expect(
        helpers.getByDataCy(authenticatedPage, "log-window"),
      ).toBeVisible();
      expect(
        await helpers.getByDataCy(authenticatedPage, "resmoke-row").count(),
      ).toBeGreaterThan(0);
    });
  });

  test.describe("uploading logs via clipboard", () => {
    test.beforeEach(async ({ authenticatedPage }) => {
      // Set up clipboard mock before navigation.
      await helpers.setupClipboardMock(authenticatedPage);
      await authenticatedPage.goto("/upload");
    });

    test("should be able to paste text into Parsley", async ({
      authenticatedPage,
    }) => {
      await expect(
        helpers.getByDataCy(authenticatedPage, "upload-zone"),
      ).toBeVisible();

      const fileContents = fs.readFileSync("sample_logs/resmoke.log", "utf-8");
      await helpers.paste(authenticatedPage, 'input[type="file"]', {
        pastePayload: fileContents,
        pasteFormat: "text/plain",
      });

      await expect(
        helpers.getByDataCy(authenticatedPage, "parse-log-select"),
      ).toBeVisible();
    });

    test("selecting a log type should render the log with the appropriate parser", async ({
      authenticatedPage,
    }) => {
      const fileContents = fs.readFileSync("sample_logs/resmoke.log", "utf-8");
      await helpers.paste(authenticatedPage, 'input[type="file"]', {
        pastePayload: fileContents,
        pasteFormat: "text/plain",
      });

      const parseLogSelect = helpers.getByDataCy(
        authenticatedPage,
        "parse-log-select",
      );
      await expect(parseLogSelect).toBeVisible();
      await parseLogSelect.click();

      const resmokeOption = authenticatedPage.getByRole("option", {
        name: "Resmoke",
      });
      await expect(resmokeOption).toBeVisible();
      await resmokeOption.click();

      const processButton = helpers.getByDataCy(
        authenticatedPage,
        "process-log-button",
      );
      await expect(processButton).toBeVisible();
      await processButton.click();

      await expect(
        helpers.getByDataCy(authenticatedPage, "log-window"),
      ).toBeVisible();
      const resmokeRows = helpers.getByDataCy(authenticatedPage, "resmoke-row");
      expect(await resmokeRows.count()).toBeGreaterThan(0);
      await expect(resmokeRows.first()).toContainText(
        "[js_test:group_pushdown] Fixture status:",
      );
    });
  });

  test.describe("navigating away", () => {
    const logLink =
      "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";

    test.beforeEach(async ({ authenticatedPage }) => {
      await authenticatedPage.goto(logLink);
    });

    test("trying to navigate away to the upload page should prompt the user", async ({
      authenticatedPage,
    }) => {
      await expect(
        helpers.getByDataCy(authenticatedPage, "log-window"),
      ).toBeVisible();
      await helpers.getByDataCy(authenticatedPage, "upload-link").click();
      await expect(
        helpers.getByDataCy(authenticatedPage, "confirmation-modal"),
      ).toBeVisible();
      await authenticatedPage.getByRole("button", { name: "Confirm" }).click();
      await expect(
        helpers.getByDataCy(authenticatedPage, "upload-zone"),
      ).toBeVisible();
    });
  });
});
