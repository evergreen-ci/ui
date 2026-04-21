import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";

const taskWithAnnotations =
  "evergreen_ubuntu1604_test_annotations_b_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";
const taskRoute = `/task/${taskWithAnnotations}/annotations`;

test.describe("Task Annotation Tab", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(taskRoute);
    await expect(page.getByTestId("loading-annotation-ticket")).toBeHidden();
  });

  test("annotations can be moved between lists", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("loading-annotation-ticket")).toBeHidden();

    const issueRows = page
      .getByTestId("issues-list")
      .getByTestId("annotation-ticket-row");
    const suspectedIssueRows = page
      .getByTestId("suspected-issues-list")
      .getByTestId("annotation-ticket-row");

    await expect(issueRows).toHaveCount(1);
    await expect(suspectedIssueRows).toHaveCount(3);

    // Move from Suspected Issues to Issues.
    await page.getByTestId("move-btn-AnotherOne").click();
    let yesButton = page.getByTestId("popconfirm-confirm-button");
    await expect(yesButton).toBeVisible();
    await expect(yesButton).toBeEnabled();
    await yesButton.click();
    await validateToast(
      page,
      "success",
      "Successfully moved suspected issue to issues",
    );
    await expect(issueRows).toHaveCount(2);
    await expect(suspectedIssueRows).toHaveCount(2);

    // Move from Issues to Suspected Issues.
    await page.getByTestId("move-btn-AnotherOne").click();
    yesButton = page.getByTestId("popconfirm-confirm-button");
    await expect(yesButton).toBeVisible();
    await expect(yesButton).toBeEnabled();
    await yesButton.click();
    await validateToast(
      page,
      "success",
      "Successfully moved issue to suspected issues",
    );
    await expect(issueRows).toHaveCount(1);
    await expect(suspectedIssueRows).toHaveCount(3);
  });

  test("annotations add and delete correctly", async ({
    authenticatedPage: page,
  }) => {
    const issueRows = page
      .getByTestId("issues-list")
      .getByTestId("annotation-ticket-row");
    const suspectedIssueRows = page
      .getByTestId("suspected-issues-list")
      .getByTestId("annotation-ticket-row");

    await expect(issueRows).toHaveCount(1);
    await expect(suspectedIssueRows).toHaveCount(3);

    await expect(page.getByTestId("loading-annotation-ticket")).toHaveCount(0);

    // Add a new entry in Suspected Issues.
    await page.getByTestId("add-suspected-issue-button").click();
    await page
      .getByTestId("issue-url")
      .fill("https://jira.example.com/browse/SERVER-1234");
    const modal = page.getByTestId("add-issue-modal");
    await modal.getByRole("button", { name: "Add suspected issue" }).click();
    await expect(issueRows).toHaveCount(1);
    await expect(suspectedIssueRows).toHaveCount(4);
    await validateToast(page, "success", "Successfully added suspected issue");

    // Delete the newly added entry.
    await page.getByTestId("SERVER-1234-delete-btn").click();
    const yesButton = page.getByTestId("popconfirm-confirm-button");
    await expect(yesButton).toBeVisible();
    await expect(yesButton).toBeEnabled();
    await yesButton.click();
    await validateToast(
      page,
      "success",
      "Successfully removed suspected issue",
    );
    await expect(issueRows).toHaveCount(1);
    await expect(suspectedIssueRows).toHaveCount(3);
  });
});
