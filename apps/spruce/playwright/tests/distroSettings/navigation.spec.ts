import { test, expect } from "../../fixtures";
import { selectOption } from "../../helpers";

test.describe("distroSettings/navigation", () => {
  test.describe("using the distro dropdown", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto("/distro/localhost/settings");
    });

    test("navigates to distro when clicked", async ({
      authenticatedPage: page,
    }) => {
      await page.getByTestId("distro-select").click();
      const listbox = page.getByRole("listbox");
      await expect(listbox.getByText("Admin-only")).toBeVisible();
      await expect(listbox.getByRole("option").last()).toContainText(
        "localhost2",
      );
      await listbox.getByText("rhel71-power8-large").click();
      await expect(page).not.toHaveURL(/\/distro\/localhost/);
      await expect(page).toHaveURL(/\/distro\/rhel71-power8-large/);
    });

    test("can navigate to the task queue for the selected distro", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("navitem-task-queue-link")).toHaveAttribute(
        "href",
        "/task-queue/localhost",
      );
    });

    test("can navigate to the image build information for the selected distro", async ({
      authenticatedPage: page,
    }) => {
      await expect(
        page.getByTestId("navitem-image-build-information-link"),
      ).toHaveAttribute("href", "/image/ubuntu2204/build-information");
    });

    test("can navigate to the image event log for the selected distro", async ({
      authenticatedPage: page,
    }) => {
      await expect(
        page.getByTestId("navitem-image-event-log-link"),
      ).toHaveAttribute("href", "/image/ubuntu2204/event-log");
    });

    test.describe("warning modal", () => {
      test("warns when navigating away with unsaved changes and allows returning", async ({
        authenticatedPage: page,
      }) => {
        await page.getByLabel("Notes").fill("my note");
        await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
          "aria-disabled",
          "false",
        );
        await page.getByTestId("waterfall-link").click();
        await expect(
          page.getByTestId("navigation-warning-modal"),
        ).toBeVisible();
        await page.getByRole("button", { name: "Cancel" }).click();
        await expect(page.getByTestId("navigation-warning-modal")).toHaveCount(
          0,
        );
        await expect(page).toHaveURL("/distro/localhost/settings/general");
      });

      test.describe("modifying the distro provider", () => {
        test.beforeEach(async ({ authenticatedPage: page }) => {
          await page.goto(
            "/distro/ubuntu1604-container-test/settings/provider",
          );
        });

        test("warns when navigating to another tab after provider changed and allows save", async ({
          authenticatedPage: page,
        }) => {
          await selectOption(page, "Provider", "Static");
          await expect(
            page.getByTestId("save-settings-button"),
          ).toHaveAttribute("aria-disabled", "false");
          await page.getByRole("link", { name: "Task Settings" }).click();
          await expect(
            page.getByTestId("provider-warning-banner"),
          ).toBeVisible();
        });

        test("shows the standard save warning modal when non-provider fields have changed", async ({
          authenticatedPage: page,
        }) => {
          await page.getByTestId("user-data-input").fill("test user data");
          await expect(
            page.getByTestId("save-settings-button"),
          ).toHaveAttribute("aria-disabled", "false");
          await page.getByTestId("waterfall-link").click();
          await expect(
            page.getByTestId("navigation-warning-modal"),
          ).toBeVisible();
          await expect(page.getByTestId("provider-warning-banner")).toHaveCount(
            0,
          );
        });
      });
    });
  });

  test.describe("/distros redirect route", () => {
    test("should redirect to the first distro available", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/distros");
      await expect(page).not.toHaveURL(/\/distros$/);
      await expect(page).toHaveURL("/distro/archlinux-test/settings/general");
    });
  });
});
