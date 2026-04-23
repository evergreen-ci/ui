import { test, expect } from "../../fixtures";
import {
  clickCheckboxByLabel,
  mockGraphQLResponse,
  selectOption,
  validateDatePickerDate,
  validateToast,
} from "../../helpers";

const expectedVolNames = [
  "vol-0ae8720b445b771b6",
  "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b856",
  "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b857",
  "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858",
  "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b859",
  "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b815",
  "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b825",
  "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b835",
  "1da0e996608e6871b60a92f6564bbc9cdf66ce90be1178dfb653920542a0d0f0",
  "vol-0c66e16459646704d",
  "vol-0583d66433a69f136",
  "vol-0ea662ac92f611ed4",
];

test.describe("Spawn volume page", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/spawn/volume");
  });

  test("Visiting the spawn volume page should display the number of free and mounted volumes", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("mounted-badge")).toContainText("9 Mounted");
    await expect(page.getByTestId("free-badge")).toContainText("4 Free");
  });

  test("The table initially displays volumes with status ascending", async ({
    authenticatedPage: page,
  }) => {
    const rows = page.getByTestId("leafygreen-table-row");
    for (let i = 0; i < expectedVolNames.length; i++) {
      await expect(rows.nth(i)).toContainText(expectedVolNames[i]);
    }
  });

  test("Table should have no cards visible by default", async ({
    authenticatedPage: page,
  }) => {
    for (const name of expectedVolNames) {
      await expect(page.getByTestId(name)).toHaveCount(0);
    }
  });

  test("Should render migrating volumes with a different badge and disable action buttons", async ({
    authenticatedPage: page,
  }) => {
    const targetVolume = "vol-0ae8720b445b771b6";
    const migratingRow = page
      .getByTestId("leafygreen-table-row")
      .filter({ hasText: targetVolume });
    await expect(migratingRow.getByTestId("volume-status-badge")).toContainText(
      "Migrating",
    );
    const trashButton = page.getByTestId(`trash-vol-${targetVolume}`);
    await expect(trashButton).toBeDisabled();
    const migrateButton = page.getByTestId(`migrate-btn-vol-${targetVolume}`);
    await expect(migrateButton).toBeDisabled();
    const editButton = page.getByTestId(`edit-btn-vol-${targetVolume}`);
    await expect(editButton).toBeDisabled();
  });

  test("Should have a volume card visible initially when the 'volume' query param is provided", async ({
    authenticatedPage: page,
  }) => {
    const targetVolume = "vol-0ea662ac92f611ed4";
    await page.goto(`/spawn/volume?volume=${targetVolume}`);
    const card = page.getByTestId(`spawn-volume-card-${targetVolume}`);
    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeVisible();
  });

  test("Clicking on the row should toggle the volume card open and closed", async ({
    authenticatedPage: page,
  }) => {
    const targetVolume = "vol-0ea662ac92f611ed4";
    await page.goto(`/spawn/volume?volume=${targetVolume}`);
    const card = page.getByTestId(`spawn-volume-card-${targetVolume}`);
    await expect(card).toBeVisible();

    const row = page
      .getByTestId("leafygreen-table-row")
      .filter({ hasText: targetVolume });
    await row.getByRole("button", { name: "Collapse row" }).click();
    await expect(card).toHaveCount(0);

    await row.getByRole("button", { name: "Expand row" }).click();
    await expect(card).toBeVisible();
  });

  test("Clicking the trash can should remove the volume from the table and update free/mounted volumes badges", async ({
    authenticatedPage: page,
  }) => {
    await mockGraphQLResponse(page, "RemoveVolume", {
      data: { removeVolume: true },
      errors: null,
    });
    const targetVolume = "vol-0c66e16459646704d";
    await expect(
      page
        .getByTestId("leafygreen-table-row")
        .filter({ hasText: targetVolume }),
    ).toBeVisible();

    await page.getByTestId(`trash-vol-${targetVolume}`).click();
    const popconfirm = page.getByTestId("delete-volume-popconfirm");
    await expect(popconfirm).toBeVisible();
    const yesButton = popconfirm.getByRole("button", { name: "Yes" });
    await expect(yesButton).toBeVisible();
    await expect(yesButton).toBeEnabled();
    await yesButton.click();
    await validateToast(page, "success", "Successfully deleted the volume.");
  });

  test("Clicking the trash can for a mounted volume should show an additional confirmation checkbox which enables the submit button when checked", async ({
    authenticatedPage: page,
  }) => {
    await mockGraphQLResponse(page, "RemoveVolume", {
      data: { removeVolume: true },
      errors: null,
    });
    await page
      .getByTestId(
        "trash-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      )
      .click();
    const popconfirm = page.getByTestId("delete-volume-popconfirm");
    await expect(popconfirm).toBeVisible();

    const confirmCheckbox = popconfirm.getByRole("checkbox", {
      name: "I understand this volume is currently mounted to a host.",
    });
    await expect(confirmCheckbox).not.toBeChecked();

    const yesButton = popconfirm.getByRole("button", { name: "Yes" });
    await expect(yesButton).toHaveAttribute("aria-disabled", "true");

    const checkboxId = await confirmCheckbox.getAttribute("id");
    await page.locator(`label[for="${checkboxId}"]`).click();

    await expect(yesButton).not.toHaveAttribute("aria-disabled", "true");
    await yesButton.click();

    await validateToast(page, "success", "Successfully deleted the volume.");
  });

  test("Clicking on unmount should result in a success toast appearing", async ({
    authenticatedPage: page,
  }) => {
    await mockGraphQLResponse(page, "DetachVolumeFromHost", {
      data: { detachVolumeFromHost: true },
      errors: null,
    });
    await page
      .getByTestId(
        "detach-btn-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b857",
      )
      .click();
    const popconfirm = page.getByTestId("unmount-volume-popconfirm");
    await expect(popconfirm).toBeVisible();
    await popconfirm.getByRole("button", { name: "Yes" }).click();
    await validateToast(page, "success", "Successfully unmounted the volume.");
  });

  test("Clicking on 'Spawn Volume' should open the Spawn Volume Modal", async ({
    authenticatedPage: page,
  }) => {
    const spawnButton = page.getByTestId("spawn-volume-btn");
    await expect(spawnButton).toBeEnabled();
    await spawnButton.click();
    await expect(page.getByTestId("spawn-volume-modal")).toBeVisible();
  });

  test("Reopening the Spawn Volume modal clears previous input changes", async ({
    authenticatedPage: page,
  }) => {
    await page.getByTestId("spawn-volume-btn").click();
    await expect(page.getByTestId("spawn-volume-modal")).toBeVisible();
    await selectOption(page, "Type", "sc1");

    const modal = page.getByTestId("spawn-volume-modal");
    const cancelButton = modal.getByRole("button", { name: "Cancel" });
    await expect(cancelButton).toBeEnabled();
    await cancelButton.click();

    await page.getByTestId("spawn-volume-btn").click();
    await expect(page.getByTestId("spawn-volume-modal")).toBeVisible();
    await expect(page.getByTestId("type-select")).toContainText("gp3");
  });

  test.describe("Edit volume modal", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto("/spawn/volume");
    });

    test("Clicking on 'Edit' should open the Edit Volume Modal", async ({
      authenticatedPage: page,
    }) => {
      await page
        .getByTestId(
          "edit-btn-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858",
        )
        .click();
      await expect(page.getByTestId("update-volume-modal")).toBeVisible();
    });

    test("name, size, expiration inputs should be populated on initial render", async ({
      authenticatedPage: page,
    }) => {
      await page
        .getByTestId(
          "edit-btn-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858",
        )
        .click();
      await expect(page.getByTestId("update-volume-modal")).toBeVisible();
      await expect(page.getByTestId("volume-name-input")).toHaveValue(
        "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858",
      );
      await expect(page.getByTestId("volume-size-input")).toHaveValue("100");
      await validateDatePickerDate(page, "date-picker", {
        year: "2020",
        month: "06",
        day: "06",
      });
      await expect(page.getByTestId("hour-input")).toHaveValue("15");
      await expect(page.getByTestId("minute-input")).toHaveValue("48");
    });

    test("Reopening the edit volume modal should reset form input fields", async ({
      authenticatedPage: page,
    }) => {
      await page
        .getByTestId(
          "edit-btn-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858",
        )
        .click();
      await expect(page.getByTestId("update-volume-modal")).toBeVisible();
      await page.getByTestId("volume-name-input").type("Hello, World");

      await page
        .getByTestId("update-volume-modal")
        .getByRole("button", { name: "Cancel" })
        .click();

      await page
        .getByTestId(
          "edit-btn-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858",
        )
        .click();
      await expect(page.getByTestId("volume-name-input")).toHaveValue(
        "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858",
      );
    });

    test("size field is validated correctly", async ({
      authenticatedPage: page,
    }) => {
      await page
        .getByTestId(
          "edit-btn-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858",
        )
        .click();
      await expect(page.getByTestId("update-volume-modal")).toBeVisible();

      await page.getByTestId("volume-size-input").clear();
      await page.getByTestId("volume-size-input").fill("10000");
      await expect(page.getByRole("button", { name: "Save" })).toHaveAttribute(
        "aria-disabled",
        "true",
      );

      await page.getByTestId("volume-size-input").clear();
      await page.getByTestId("volume-size-input").fill("2");
      await expect(page.getByRole("button", { name: "Save" })).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });

    test("Submit button should be enabled when the volume details input value differs from what already exists", async ({
      authenticatedPage: page,
    }) => {
      await page
        .getByTestId(
          "edit-btn-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858",
        )
        .click();
      await expect(page.getByTestId("update-volume-modal")).toBeVisible();

      const saveButton = page.getByRole("button", { name: "Save" });
      const volumeInput = page.getByTestId("volume-name-input");

      await expect(saveButton).toHaveAttribute("aria-disabled", "true");
      await volumeInput.fill("Hello, World");
      await expect(saveButton).toHaveAttribute("aria-disabled", "false");
      await volumeInput.clear();
      await volumeInput.fill(
        "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858",
      );
      await expect(saveButton).toHaveAttribute("aria-disabled", "true");
      await clickCheckboxByLabel(page, "Never expire");
      await expect(saveButton).toHaveAttribute("aria-disabled", "false");
    });

    test("Clicking on save button should close the modal and show a success toast", async ({
      authenticatedPage: page,
    }) => {
      mockGraphQLResponse(page, "UpdateVolume", {
        data: {
          updateVolume: {
            id: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858",
            name: "Hello, World",
          },
        },
        errors: null,
      });
      await page
        .getByTestId(
          "edit-btn-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858",
        )
        .click();
      await expect(page.getByTestId("update-volume-modal")).toBeVisible();
      await page.getByTestId("volume-name-input").fill("Hello, World");
      const saveButton = page.getByRole("button", { name: "Save" });
      await expect(saveButton).toHaveAttribute("aria-disabled", "false");
      await saveButton.click();
      await validateToast(page, "success", "Successfully updated volume");
      await expect(page.getByTestId("update-volume-modal")).toHaveCount(0);
    });
  });

  test.describe("Migrate Modal", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto("/spawn/volume");
    });

    test("migrate button is disabled for volumes with the migrating status", async ({
      authenticatedPage: page,
    }) => {
      const migratingRow = page
        .getByTestId("leafygreen-table-row")
        .filter({ hasText: "vol-0ae8720b445b771b6" });
      await expect(
        migratingRow.getByTestId("volume-status-badge"),
      ).toContainText("Migrating");
      await expect(
        page.getByTestId("migrate-btn-vol-0ae8720b445b771b6"),
      ).toHaveAttribute("aria-disabled", "true");
    });

    test("clicking cancel during confirmation renders the Migrate modal form", async ({
      authenticatedPage: page,
    }) => {
      await page
        .getByTestId(
          "migrate-btn-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858",
        )
        .click();
      await page.getByTestId("distro-input").click();
      await page.getByTestId("distro-option-ubuntu1804-workstation").click();
      await page.getByTestId("migrate-modal").getByText("Next").click();
      await expect(page.getByTestId("migrate-modal")).toContainText(
        "Are you sure you want to migrate this home volume?",
      );
      await expect(page.getByTestId("distro-input")).toHaveCount(0);
      await page.getByTestId("migrate-modal").getByText("Cancel").click();
      await expect(page.getByTestId("distro-input")).toBeVisible();
    });

    test("open the Migrate modal and spawn a host", async ({
      authenticatedPage: page,
    }) => {
      await page
        .getByTestId(
          "migrate-btn-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858",
        )
        .click();
      await page.getByTestId("distro-input").click();
      await page.getByTestId("distro-option-ubuntu1804-workstation").click();
      await expect(page.getByTestId("region-select")).toHaveAttribute(
        "aria-disabled",
        "true",
      );
      await page.getByTestId("migrate-modal").getByText("Next").click();
      await page
        .getByTestId("migrate-modal")
        .getByText("Migrate Volume")
        .click();
      await validateToast(
        page,
        "success",
        "Volume migration has been scheduled. A new host will be spawned and accessible on your Hosts page.",
      );
    });
  });
});
