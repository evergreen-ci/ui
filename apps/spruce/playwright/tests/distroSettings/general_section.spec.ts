import { test, expect } from "../../fixtures";
import { clickCheckboxByLabel, validateToast } from "../../helpers";
import { save } from "./utils";

test.describe("general section", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/distro/localhost/settings/general");
    await expect(page.getByTestId("distro-settings-page")).toBeVisible();
  });

  test("can update fields and those changes will persist", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    await expect(
      page.getByRole("button", { name: "Add alias" }),
    ).not.toHaveAttribute("aria-disabled", "true");
    await page.getByRole("button", { name: "Add alias" }).click();
    await page.getByLabel("Alias").fill("localhost-alias");
    await page.getByLabel("Notes").fill("this is a note");
    await page.getByLabel("Warnings").fill("this is a warning");
    await clickCheckboxByLabel(page, "Disable shallow clone for this distro");
    await clickCheckboxByLabel(page, "Admin only");
    await save(page);
    await validateToast(page, "success", "Updated distro.");

    await page.reload();
    await expect(page.getByTestId("distro-settings-page")).toBeVisible();
    await expect(page.getByLabel("Alias")).toHaveValue("localhost-alias");
    await expect(page.getByLabel("Notes")).toHaveValue("this is a note");
    await expect(page.getByLabel("Warnings")).toHaveValue("this is a warning");
    await expect(
      page.getByRole("checkbox", {
        name: "Disable shallow clone for this distro",
      }),
    ).toBeChecked();
    await expect(
      page.getByRole("checkbox", { name: "Admin only" }),
    ).toBeChecked();

    await page.getByTestId("delete-item-button").click();
    await page.getByLabel("Notes").clear();
    await page.getByLabel("Warnings").clear();
    await clickCheckboxByLabel(page, "Disable shallow clone for this distro");
    await clickCheckboxByLabel(page, "Admin only");
    await save(page);
    await validateToast(page, "success", "Updated distro.");
  });

  test.describe("container pool distro", () => {
    test("warns users that the distro will not be spawned for tasks", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/distro/ubuntu1604-parent/settings/general");
      await expect(
        page.getByText(
          "Distro is a container pool, so it cannot be spawned for tasks.",
        ),
      ).toBeVisible();
    });
  });

  test.describe("single task distro", () => {
    test("can toggle a distro as single task distro and shows a warning banner that dismisses on save", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("single-task-banner")).toHaveCount(0);

      await page
        .getByLabel("Set distro as Single Task Distro")
        .scrollIntoViewIfNeeded();
      await expect(
        page.getByRole("checkbox", {
          name: "Set distro as Single Task Distro",
        }),
      ).not.toHaveAttribute("aria-disabled", "true");
      await clickCheckboxByLabel(page, "Set distro as Single Task Distro");
      await expect(page.getByTestId("single-task-banner")).toContainText(
        "This Distro will be converted to a Single Task Distro once saved. Please review before confirming.",
      );
      await save(page);
      await expect(page.getByTestId("single-task-banner")).toHaveCount(0);
      await validateToast(page, "success", "Updated distro.");

      await page.reload();
      await expect(
        page.getByRole("checkbox", {
          name: "Set distro as Single Task Distro",
        }),
      ).toBeChecked();
      await expect(page.getByTestId("single-task-banner")).toHaveCount(0);

      await page
        .getByLabel("Set distro as Single Task Distro")
        .scrollIntoViewIfNeeded();
      await expect(
        page.getByRole("checkbox", {
          name: "Set distro as Single Task Distro",
        }),
      ).not.toHaveAttribute("aria-disabled", "true");
      await clickCheckboxByLabel(page, "Set distro as Single Task Distro");
      await expect(page.getByTestId("single-task-banner")).toContainText(
        "This Distro will no longer be a Single Task Distro once saved. Please review before confirming.",
      );
      await save(page);
      await expect(page.getByTestId("single-task-banner")).toHaveCount(0);
      await validateToast(page, "success", "Updated distro.");
    });
  });
});
