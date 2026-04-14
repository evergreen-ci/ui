import { test, expect } from "../../fixtures";

test.describe("/image/imageId/random redirect route", () => {
  test("should redirect to the build information page", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/image/imageId/random");
    await expect(page).not.toHaveURL(/\/random/);
    await expect(page).toHaveURL("/image/imageId/build-information");
  });
});

test.describe("Image dropdown", () => {
  test("navigates to the image when clicked", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/image/amazon2/build-information");
    const imagesSelect = page.getByTestId("images-select");
    await expect(imagesSelect).toBeVisible();
    await imagesSelect.click();

    const listbox = page.locator("[role='listbox']");
    await expect(listbox.locator("li")).not.toHaveCount(0);

    const secondItem = listbox.locator("li").nth(1);
    const itemText = await secondItem.textContent();
    await secondItem.click();

    await expect(page).toHaveURL(new RegExp(itemText!));
  });
});

test.describe("Task metadata", () => {
  test("navigates to the image page from the task page", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(
      "/task/evergreen_ubuntu1604_test_annotations_b_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
    );
    const imageLink = page.getByTestId("task-image-link");
    await expect(imageLink).toHaveAttribute(
      "href",
      "/image/ubuntu1604/build-information",
    );
    await imageLink.click();
    await expect(page).toHaveURL("/image/ubuntu1604/build-information");
  });
});
