import { test, expect } from "../../fixtures";

test.describe("Project Patches Page", () => {
  const adminPatchesRoute = "/user/admin/patches";
  const evergreenPatchesRoute = "/project/evergreen/patches";

  test("Should link to project patches page from the user patches page", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(adminPatchesRoute);
    await page.getByTestId("project-patches-link").first().click();
    await expect(page).toHaveURL(evergreenPatchesRoute);
    await expect(page.getByTestId("patch-card")).toHaveCount(6);
  });

  test("Should link to author patches page from the project patches page", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(evergreenPatchesRoute);
    await page.getByTestId("user-patches-link").first().click();
    await expect(page).toHaveURL(adminPatchesRoute);
    await expect(page.getByTestId("patch-card")).toHaveCount(10);
  });

  test("Project dropdown navigates to another project patches page upon selection", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(evergreenPatchesRoute);
    await page.getByTestId("project-select").click();
    await page
      .getByTestId("project-display-name")
      .filter({ hasText: "Spruce" })
      .click();
    await expect(page).toHaveURL("/project/spruce/patches");
  });
});
