import { expect, test } from "../../fixtures";
import { clickCheckbox, validateToast } from "../../helpers";
import { save } from "./utils";

test.describe("single task distro", () => {
  test("should render allowed projects and tasks", async ({ page }) => {
    await page.goto("/distro/archlinux-test/settings");
    await page.getByTestId("navitem-single-task-distros").click();
    await expect(page).toHaveURL(
      "/distro/archlinux-test/settings/single-task-distros",
    );

    const cards = page.getByTestId("expandable-card-title");
    await expect(cards).toHaveCount(2);
    await expect(cards.nth(0)).toContainText("evergreen smoke test", {
      ignoreCase: false,
    });
    await expect(cards.nth(1)).toContainText("Spruce", {
      ignoreCase: false,
    });

    await cards.nth(0).click();
    const firstCard = page.getByTestId("expandable-card").nth(0);
    const firstCardInputs = firstCard.locator('input[type="text"]');
    await expect(firstCardInputs.nth(0)).toHaveValue("evergreen");
    await expect(firstCardInputs.nth(1)).toHaveValue("compile");
    await expect(firstCardInputs.nth(2)).toHaveValue("test");
    await expect(firstCardInputs.nth(3)).toHaveValue("ubuntu1604");
    await expect(firstCardInputs.nth(4)).toHaveValue("windows");
    await expect(
      firstCard.getByRole("checkbox", { name: "Regex" }),
    ).not.toBeChecked();

    await cards.nth(1).click();
    const secondCard = page.getByTestId("expandable-card").nth(1);
    const secondCardInputs = secondCard.locator('input[type="text"]');
    await expect(secondCardInputs.nth(0)).toHaveValue("spruce");
    await expect(secondCardInputs.nth(1)).toHaveValue("lint");
    await expect(secondCardInputs.nth(2)).toHaveValue("storybook");
    await expect(
      secondCard.getByRole("checkbox", { name: "Regex" }),
    ).not.toBeChecked();
  });

  test("disables spawnable checkbox when distro is a single task distro", async ({
    page,
  }) => {
    await page.goto("/distro/ubuntu1604-small/settings/host");
    await expect(page.getByTestId("distro-settings-page")).toBeVisible();
    const spawnableCheckbox = page.getByRole("checkbox", {
      name: "Spawnable",
    });
    await expect(spawnableCheckbox).toBeEnabled();
    await expect(spawnableCheckbox).toBeChecked();

    await page.getByTestId("navitem-general").click();
    await expect(page).toHaveURL("/distro/ubuntu1604-small/settings/general");
    const singleTaskCheckbox = page.getByRole("checkbox", {
      name: "Set distro as Single Task Distro",
    });
    await expect(singleTaskCheckbox).not.toBeChecked();
    await clickCheckbox(singleTaskCheckbox);
    await save(page);
    await validateToast(page, "success", "Updated distro.");

    await page.getByTestId("navitem-host").click();
    await expect(page).toHaveURL("/distro/ubuntu1604-small/settings/host");
    await expect(spawnableCheckbox).toBeDisabled();
    await expect(spawnableCheckbox).not.toBeChecked();
  });
});
