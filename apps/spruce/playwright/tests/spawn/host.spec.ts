import { test, expect } from "../../fixtures";
import {
  clearDatePickerInput,
  clickCheckbox,
  clickRadio,
  typeDatePickerDate,
} from "../../helpers";

const ascendingSortSpawnHostOrderByHostId = [
  "i-04ade558e1e26b0ad",
  "i-07669e7a3cd2c238c",
  "i-092593689871a50dc",
];
const descendingSortSpawnHostOrderByHostId = [
  "i-092593689871a50dc",
  "i-07669e7a3cd2c238c",
  "i-04ade558e1e26b0ad",
];
const descendingSortSpawnHostOrderByExpiration = [
  "i-092593689871a50dc",
  "i-07669e7a3cd2c238c",
  "i-04ade558e1e26b0ad",
];
const ascendingSortSpawnHostOrderByExpiration = [
  "i-04ade558e1e26b0ad",
  "i-07669e7a3cd2c238c",
  "i-092593689871a50dc",
];

const hostTaskId =
  "evergreen_ubuntu1604_dist_patch_33016573166a36bd5f46b4111151899d5c4e95b1_5ecedafb562343215a7ff297_20_05_27_21_39_46";
const distroId = "windows-64-vs2015-small";
const projectSetupCheckboxLabel =
  "Use project-specific setup script defined at /path";
const setupScriptCheckboxLabel = "Define setup script to run after host";
const startHostsCheckboxLabel =
  "Also start any hosts this task started (if applicable)";
const loadDataCheckboxLabel = "Load data for dist";

test.describe("Spawn Host page", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/spawn/host");
  });

  test("Visiting the spawn host page should display all of your spawned hosts", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("leafygreen-table-row")).toHaveCount(3);
  });

  test("Visiting the spawn host page should not have any cards expanded by default", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("spawn-host-card")).toHaveCount(0);
  });

  test("Clicking on a spawn host row should toggle the host card", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("spawn-host-card")).toHaveCount(0);

    const firstExpandButton = page
      .getByRole("button", { name: "Expand row" })
      .first();
    await firstExpandButton.click();
    await expect(page.getByTestId("spawn-host-card")).toBeVisible();

    const firstCollapseButton = page
      .getByRole("button", { name: "Collapse row" })
      .first();
    await firstCollapseButton.click();
    await expect(page.getByTestId("spawn-host-card")).toHaveCount(0);
  });

  test("Visiting the spawn host page with an id in the url should open the page with the row expanded", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/spawn/host?host=i-092593689871a50dc");
    await expect(page.getByTestId("spawn-host-card")).toHaveCount(1);
    await expect(page.getByTestId("spawn-host-card")).toBeVisible();
  });

  test("Clicking on the Event Log link should redirect to /host/:hostId", async ({
    authenticatedPage: page,
  }) => {
    await page
      .getByTestId("leafygreen-table-row")
      .filter({ hasText: "i-092593689871a50dc" })
      .getByRole("button", { name: "Expand row" })
      .click();
    await page.getByText("Event Log").click();
    await expect(page).toHaveURL("/host/i-092593689871a50dc");
  });

  test.describe("Spawn host card sorting", () => {
    test("Clicking on the host column header should sort spawn hosts by ascending order, then descending, then remove sort", async ({
      authenticatedPage: page,
    }) => {
      const hostSortControl = page.getByRole("button", {
        name: "Sort by Host",
      });
      await hostSortControl.click();
      const rows = page.getByTestId("leafygreen-table-row");
      for (let i = 0; i < ascendingSortSpawnHostOrderByHostId.length; i++) {
        await expect(rows.nth(i)).toContainText(
          ascendingSortSpawnHostOrderByHostId[i],
        );
      }
      await hostSortControl.click();
      for (let i = 0; i < descendingSortSpawnHostOrderByHostId.length; i++) {
        await expect(rows.nth(i)).toContainText(
          descendingSortSpawnHostOrderByHostId[i],
        );
      }
      await hostSortControl.click();
      await expect(rows).toHaveCount(3);
    });

    test("Clicking on the expiration column header should sort the hosts by ascending order, then descending, then remove sort", async ({
      authenticatedPage: page,
    }) => {
      const expiresInSortControl = page.getByRole("button", {
        name: "Sort by Expires In",
      });
      await expiresInSortControl.click();
      const rows = page.getByTestId("leafygreen-table-row");
      for (let i = 0; i < ascendingSortSpawnHostOrderByExpiration.length; i++) {
        await expect(rows.nth(i)).toContainText(
          ascendingSortSpawnHostOrderByExpiration[i],
        );
      }
      await expiresInSortControl.click();
      for (
        let i = 0;
        i < descendingSortSpawnHostOrderByExpiration.length;
        i++
      ) {
        await expect(rows.nth(i)).toContainText(
          descendingSortSpawnHostOrderByExpiration[i],
        );
      }
      await expiresInSortControl.click();
      await expect(rows).toHaveCount(3);
    });
  });

  test.describe("Spawn host modal", () => {
    test("Should disable 'Unexpirable Host' radio box when max number of unexpirable hosts is met (2)", async ({
      authenticatedPage: page,
    }) => {
      await page.getByRole("button", { name: "Spawn a host" }).click();
      await page.getByTestId("distro-input").click();
      await page.getByTestId("distro-option-ubuntu1804-workstation").click();

      const expirableHostButton = page.getByRole("radio", {
        name: "Expirable Host",
        exact: true,
      });
      await expect(expirableHostButton).toBeEnabled();

      const unexpirableHostButton = page.getByRole("radio", {
        name: "Unexpirable Host",
        exact: true,
      });
      await expect(unexpirableHostButton).toBeDisabled();

      await expect(
        page.getByText("You have reached the max number of unexpirable hosts"),
      ).toBeVisible();
    });

    test("Clicking on the spawn host button should open a spawn host modal", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("spawn-host-modal")).toHaveCount(0);
      await page.getByRole("button", { name: "Spawn a host" }).click();
      await expect(page.getByTestId("spawn-host-modal")).toBeVisible();
    });

    test("Visiting the spawn host page with the proper url param should open the spawn host modal by default", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/spawn/host?spawnHost=True");
      await expect(page.getByTestId("spawn-host-modal")).toBeVisible();
    });

    test("Closing the spawn host modal removes the 'spawnHost' query param from the url and hides the modal", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/spawn/host?spawnHost=True");
      await expect(page.getByTestId("spawn-host-modal")).toBeVisible();
      await expect(page).toHaveURL("/spawn/host?spawnHost=True");
      await page
        .getByTestId("spawn-host-modal")
        .getByRole("button", { name: "Cancel" })
        .click();
      await expect(page).not.toHaveURL("/spawn/host?spawnHost=True");
      await expect(page.getByTestId("spawn-host-modal")).toHaveCount(0);
    });

    test("Visiting the spawn host page with a taskId url param should render additional options at the bottom of the modal", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(
        `/spawn/host?spawnHost=True&distroId=rhel71-power8-large&taskId=${hostTaskId}`,
      );
      const projectSetupCheckbox = page.getByRole("checkbox", {
        name: projectSetupCheckboxLabel,
      });
      const loadDataCheckbox = page.getByRole("checkbox", {
        name: loadDataCheckboxLabel,
      });
      const startHostsCheckbox = page.getByRole("checkbox", {
        name: startHostsCheckboxLabel,
      });

      await expect(projectSetupCheckbox).toHaveCount(1);
      await expect(loadDataCheckbox).toHaveCount(1);
      await expect(startHostsCheckbox).toHaveCount(1);
    });

    test("Unchecking 'Load data for dist' hides nested checkbox selections and checking shows them", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(
        `/spawn/host?spawnHost=True&distroId=rhel71-power8-large&taskId=${hostTaskId}`,
      );
      await expect(page.getByTestId("spawn-host-modal")).toBeVisible();
      const loadDataCheckbox = page.getByRole("checkbox", {
        name: loadDataCheckboxLabel,
      });
      const projectSetupCheckbox = page.getByRole("checkbox", {
        name: projectSetupCheckboxLabel,
      });
      const startHostsCheckbox = page.getByRole("checkbox", {
        name: startHostsCheckboxLabel,
      });

      await expect(loadDataCheckbox).toBeChecked();
      await expect(projectSetupCheckbox).toHaveCount(1);
      await expect(startHostsCheckbox).toHaveCount(1);

      await clickCheckbox(loadDataCheckbox);
      await expect(loadDataCheckbox).not.toBeChecked();
      await expect(projectSetupCheckbox).toHaveCount(0);
      await expect(startHostsCheckbox).toHaveCount(0);
    });

    test("Visiting the spawn host page with a task and distro supplied in the url should populate the distro input", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(
        `/spawn/host?spawnHost=True&distroId=${distroId}&taskId=${hostTaskId}`,
      );
      await expect(page.getByTestId("spawn-host-modal")).toBeVisible();
      await expect(
        page.getByTestId("distro-input").getByTestId("dropdown-value"),
      ).toContainText(distroId);
    });

    test("The virtual workstation dropdown should filter any volumes that aren't a home volume", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(
        `/spawn/host?spawnHost=True&distroId=${distroId}&taskId=${hostTaskId}`,
      );
      await page.getByTestId("distro-input").click();
      await expect(page.getByText("Admin-only distros")).toHaveCount(0);
      await page.getByTestId("distro-option-ubuntu1804-workstation").click();
      await expect(page.getByTestId("volume-select")).toBeDisabled();
    });

    test("Clicking 'Add new key' hides the key name dropdown and shows the key value text area", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(
        `/spawn/host?spawnHost=True&distroId=${distroId}&taskId=${hostTaskId}`,
      );
      await expect(page.getByTestId("key-select")).toBeVisible();
      await expect(page.getByTestId("key-value-text-area")).toHaveCount(0);
      const addNewKeyRadio = page.getByRole("radio", { name: "Add new key" });
      await clickRadio(addNewKeyRadio);
      await expect(page.getByTestId("key-select")).toHaveCount(0);
      await expect(page.getByTestId("key-value-text-area")).toBeVisible();
    });

    test("Checking 'Run Userdata script on start' shows the user data script text area", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(
        `/spawn/host?spawnHost=True&distroId=${distroId}&taskId=${hostTaskId}`,
      );
      const userDataScriptInput = page.getByRole("textbox", {
        name: "Userdata Script",
      });
      await expect(userDataScriptInput).toHaveCount(0);
      const userDataScriptCheckbox = page.getByRole("checkbox", {
        name: "Run Userdata script on start",
      });
      await clickCheckbox(userDataScriptCheckbox);
      await expect(userDataScriptInput).toBeVisible();
    });

    test("Checking 'Define setup script...' shows the setup script text area", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(
        `/spawn/host?spawnHost=True&distroId=${distroId}&taskId=${hostTaskId}`,
      );
      const setupScriptInput = page.getByRole("textbox", {
        name: "Setup Script",
      });
      await expect(setupScriptInput).toHaveCount(0);

      const projectSetupScriptCheckbox = page.getByRole("checkbox", {
        name: projectSetupCheckboxLabel,
      });
      await clickCheckbox(projectSetupScriptCheckbox);

      const setupScriptCheckbox = page.getByRole("checkbox", {
        name: setupScriptCheckboxLabel,
      });
      await expect(setupScriptCheckbox).toBeEnabled();
      await clickCheckbox(setupScriptCheckbox);
      await expect(setupScriptInput).toHaveCount(1);
    });

    test("Conditionally disables setup script and project setup script checkboxes based on the other's value", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(
        `/spawn/host?spawnHost=True&distroId=${distroId}&taskId=${hostTaskId}`,
      );
      const projectCheckbox = page.getByRole("checkbox", {
        name: projectSetupCheckboxLabel,
      });
      const setupCheckbox = page.getByRole("checkbox", {
        name: setupScriptCheckboxLabel,
      });

      await expect(projectCheckbox).toBeChecked();
      await expect(projectCheckbox).toBeEnabled();
      await expect(setupCheckbox).toBeDisabled();

      await clickCheckbox(projectCheckbox);
      await expect(projectCheckbox).not.toBeChecked();
      await expect(projectCheckbox).toBeEnabled();
      await expect(setupCheckbox).toBeEnabled();

      await clickCheckbox(setupCheckbox);
      await expect(projectCheckbox).toBeDisabled();
      await expect(setupCheckbox).toBeEnabled();
    });
  });

  test("Allows editing a modal with sleep schedule enabled and validates dates", async ({
    authenticatedPage: page,
  }) => {
    await page.clock.setFixedTime("2026-05-26T00:00:00Z");
    await page.getByTestId("edit-host-button").nth(2).click();

    const modal = page.getByTestId("edit-spawn-host-modal").nth(2);
    await expect(modal).toBeVisible();

    const saveButton = page.getByRole("button", { name: "Save" });

    // Set a valid near-future date
    await typeDatePickerDate(page, { year: "2026", month: "06", day: "01" });
    await expect(saveButton).toHaveAttribute("aria-disabled", "false");

    // Set a date in the past
    await clearDatePickerInput(page);
    await typeDatePickerDate(page, { year: "2025", month: "01", day: "01" });
    await expect(saveButton).toHaveAttribute("aria-disabled", "true");

    // Set a date too far in the future
    await clearDatePickerInput(page);
    await typeDatePickerDate(page, { year: "2060", month: "01", day: "15" });
    await expect(saveButton).toHaveAttribute("aria-disabled", "true");
  });
});
