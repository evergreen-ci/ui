import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";

const distroSettingPage = "/distro/rhel71-power8-large/settings/general";

test.describe("Creating a new distro", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(distroSettingPage);
  });

  test("allows a user to create a new distro", async ({
    authenticatedPage: page,
  }) => {
    const newDistroId = "new-distro";

    await page.getByTestId("new-distro-button").click();
    await expect(page.getByTestId("new-distro-menu")).toBeVisible();
    await page.getByTestId("create-distro-button").click();
    await expect(page.getByTestId("create-distro-modal")).toBeVisible();
    await page.getByTestId("distro-id-input").fill(newDistroId);
    await page.getByRole("button", { name: "Create" }).click();
    await validateToast(
      page,
      "success",
      `Created distro “${newDistroId}”`,
      true,
    );
    await expect(page).toHaveURL(`/distro/${newDistroId}/settings/general`);

    await expect(page.getByTestId("delete-distro-button")).toHaveAttribute(
      "aria-disabled",
      "false",
    );
    await page.getByTestId("delete-distro-button").click();
    await expect(page.getByTestId("delete-distro-modal")).toBeVisible();
    await page
      .getByTestId("delete-distro-modal")
      .locator("input")
      .fill(newDistroId);
    await page.getByRole("button", { name: "Delete", exact: true }).click();
    await validateToast(
      page,
      "success",
      `The distro “${newDistroId}” was deleted.`,
    );
  });
});

test.describe("Copying a distro", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(distroSettingPage);
  });

  test("allows a user to copy an existing distro", async ({
    authenticatedPage: page,
  }) => {
    const copyDistroId = "copy-distro";

    await page.getByTestId("new-distro-button").click();
    await expect(page.getByTestId("new-distro-menu")).toBeVisible();
    await page.getByTestId("copy-distro-button").click();
    await expect(page.getByTestId("copy-distro-modal")).toBeVisible();
    await page.getByTestId("distro-id-input").fill(copyDistroId);
    await page.getByRole("button", { name: "Duplicate" }).click();
    await validateToast(
      page,
      "success",
      `Created distro “${copyDistroId}”`,
      true,
    );
    await expect(page).toHaveURL(`/distro/${copyDistroId}/settings/general`);

    await expect(page.getByTestId("delete-distro-button")).toHaveAttribute(
      "aria-disabled",
      "false",
    );
    await page.getByTestId("delete-distro-button").click();
    await expect(page.getByTestId("delete-distro-modal")).toBeVisible();
    await page
      .getByTestId("delete-distro-modal")
      .locator("input")
      .fill(copyDistroId);
    await page.getByRole("button", { name: "Delete", exact: true }).click();
    await validateToast(
      page,
      "success",
      `The distro “${copyDistroId}” was deleted.`,
    );
  });
});
