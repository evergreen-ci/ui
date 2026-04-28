import { test, expect } from "../../fixtures";

test.describe("single task distro", () => {
  test("should render allowed projects and tasks", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/distro/archlinux-test/settings");
    await page.getByTestId("navitem-single-task-distros").click();
    await expect(page).toHaveURL(
      "/distro/archlinux-test/settings/single-task-distros",
    );

    const cards = page.getByTestId("expandable-card-title");
    await expect(cards).toHaveCount(2);
    await expect(cards.nth(0)).toHaveText("evergreen");
    await expect(cards.nth(1)).toHaveText("spruce");

    await cards.nth(0).click();
    const inputs = page.getByTestId("expandable-card").locator("input");
    await expect(inputs.nth(0)).toHaveValue("evergreen");
    await expect(inputs.nth(1)).toHaveValue("compile");
    await expect(inputs.nth(2)).toHaveValue("test");
    await expect(inputs.nth(3)).toHaveValue("ubuntu1604");
    await expect(inputs.nth(4)).toHaveValue("windows");

    await cards.nth(1).click();
    await expect(inputs.nth(5)).toHaveValue("spruce");
    await expect(inputs.nth(6)).toHaveValue("lint");
    await expect(inputs.nth(7)).toHaveValue("storybook");
  });
});
