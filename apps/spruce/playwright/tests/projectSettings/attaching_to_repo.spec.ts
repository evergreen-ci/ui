import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";
import { getProjectSettingsRoute, project } from "./constants";
import { save } from "./utils";

test.describe("Attaching Spruce to a repo", () => {
  const origin = getProjectSettingsRoute(project);

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(origin);
  });

  test("Saves and attaches new repo and shows warnings on the Github page", async ({
    authenticatedPage: page,
  }) => {
    const repoInput = page.getByTestId("repo-input");
    await repoInput.clear();
    await repoInput.fill("evergreen");
    await expect(page.getByTestId("attach-repo-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await save(page);
    await validateToast(page, "success", "Successfully updated project", true);

    await page.getByTestId("attach-repo-button").click();
    await page
      .getByTestId("attach-repo-modal")
      .getByRole("button", { name: "Attach" })
      .click();
    await validateToast(page, "success", "Successfully attached to repo");

    await page.getByTestId("navitem-github-commitqueue").click();
    await expect(
      page
        .getByTestId("pr-testing-enabled-radio-box")
        .locator("..")
        .getByTestId("warning-banner"),
    ).toBeVisible();
    await expect(
      page
        .getByTestId("manual-pr-testing-enabled-radio-box")
        .locator("..")
        .getByTestId("warning-banner"),
    ).toBeVisible();
    await expect(
      page
        .getByTestId("github-checks-enabled-radio-box")
        .locator("..")
        .getByTestId("warning-banner"),
    ).toHaveCount(0);
    await expect(
      page.getByTestId("cq-card").getByTestId("warning-banner"),
    ).toBeVisible();
    await page
      .getByTestId("cq-enabled-radio-box")
      .getByText("Enabled", { exact: true })
      .click();
    await expect(
      page.getByTestId("cq-card").getByTestId("error-banner"),
    ).toBeVisible();
  });
});
