import { test, expect } from "../../fixtures";

test.describe("Event log page", () => {
  const IMAGE_EVENT_LIMIT = 5;

  test("load more button should return twice as many events", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/image/ubuntu2204/event-log");
    await expect(page.getByTestId("image-event-log-card")).toHaveCount(
      IMAGE_EVENT_LIMIT,
    );
    await page.getByTestId("load-more-button").click();
    await expect(page.getByTestId("image-event-log-card")).toHaveCount(
      2 * IMAGE_EVENT_LIMIT,
    );
  });

  test("should show no events when filtering by name for a nonexistent item", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/image/ubuntu2204/event-log");
    await expect(page.getByTestId("image-event-log-card")).toHaveCount(
      IMAGE_EVENT_LIMIT,
    );
    await page.getByTestId("image-event-log-name-filter").first().click();
    const searchInput = page.getByPlaceholder("Search name");
    await searchInput.fill("bogus");
    await searchInput.press("Enter");
    const firstCard = page.getByTestId("image-event-log-card").first();
    await expect(
      firstCard.getByTestId("image-event-log-table-row"),
    ).toHaveCount(0);
  });

  test("should show no events when global filtering for a nonexistent item", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/image/ubuntu2204/event-log");
    await expect(page.getByTestId("image-event-log-card")).toHaveCount(
      IMAGE_EVENT_LIMIT,
    );
    const searchInput = page.getByPlaceholder("Global search by name");
    await searchInput.fill("bogus");
    await searchInput.press("Enter");
    await expect(page.getByTestId("image-event-log-table-row")).toHaveCount(0);
  });
});
