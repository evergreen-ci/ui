import { INCLUDE_COMMIT_QUEUE_PROJECT_PATCHES } from "constants/cookies";
import { expect, test } from "../../fixtures";

test.describe("Project Patches Page", () => {
  const adminPatchesRoute = "/user/admin/patches";
  const evergreenPatchesRoute = "/project/evergreen/patches";

  test("Should link to project patches page from the user patches page", async ({
    page,
  }) => {
    await page.goto(adminPatchesRoute);
    await page.getByTestId("project-patches-link").first().click();
    await expect(page).toHaveURL(evergreenPatchesRoute);
    await expect(page.getByTestId("patch-card")).toHaveCount(6);
  });

  test("Should link to author patches page from the project patches page", async ({
    page,
  }) => {
    await page.goto(evergreenPatchesRoute);
    await page.getByTestId("user-patches-link").first().click();
    await expect(page).toHaveURL(adminPatchesRoute);
    await expect(page.getByTestId("patch-card")).toHaveCount(10);
  });

  test("Project dropdown navigates to another project patches page upon selection", async ({
    page,
  }) => {
    await page.goto(evergreenPatchesRoute);
    await page.getByTestId("project-select").click();
    await page
      .getByTestId("project-display-name")
      .filter({ hasText: "Spruce" })
      .click();
    await expect(page).toHaveURL("/project/spruce/patches");
  });

  test("Toggling the GitHub Merge Queue checkbox updates the URL and cookie", async ({
    page,
  }) => {
    await page.goto(evergreenPatchesRoute);
    const mergeQueueCheckboxLabel = page.getByTestId(
      "github-merge-queue-checkbox",
    );
    const mergeQueueCheckbox = page.getByRole("checkbox", {
      name: "Only show GitHub Merge Queue patches",
    });
    await expect(mergeQueueCheckbox).not.toBeChecked();
    await expect(page).not.toHaveURL(/mergeQueue/);

    // Check the checkbox.
    await mergeQueueCheckboxLabel.click();
    await expect(mergeQueueCheckbox).toBeChecked();
    await expect(page).toHaveURL(/mergeQueue=true/);
    let cookies = await page.context().cookies();
    expect(
      cookies.find((c) => c.name === INCLUDE_COMMIT_QUEUE_PROJECT_PATCHES)
        ?.value,
    ).toBe("true");

    // Uncheck the checkbox.
    await mergeQueueCheckboxLabel.click();
    await expect(mergeQueueCheckbox).not.toBeChecked();
    await expect(page).toHaveURL(/mergeQueue=false/);
    cookies = await page.context().cookies();
    expect(
      cookies.find((c) => c.name === INCLUDE_COMMIT_QUEUE_PROJECT_PATCHES)
        ?.value,
    ).toBe("false");
  });
});
