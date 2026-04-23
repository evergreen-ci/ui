import { test, expect } from "../../fixtures";
import { clickCheckboxByLabel, mockGraphQLResponse } from "../../helpers";

const unactivatedPatchId = "5e6bb9e23066155a993e0f1a";
const patchWithDisplayTasks = "5e6bb9e23066155a993e0f1b";
const activatedPatchId = "5e4ff3abe3c3317e352062e4";

test.describe("Configure Patch Page", () => {
  test.describe("Initial state reflects patch data", () => {
    test("First build variant in list is selected by default", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(`/patch/${unactivatedPatchId}/configure/tasks`);
      await expect(
        page.getByTestId("build-variant-list-item").first(),
      ).toHaveAttribute("data-selected", "true");
    });

    test("should allow canceling a configured patch", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/patch/5ecedafb562343215a7ff297/configure/tasks");
      await expect(page.getByTestId("cancel-button")).toBeVisible();
      await page.getByTestId("cancel-button").click();
      await expect(page).toHaveURL(
        "/version/5ecedafb562343215a7ff297/tasks?sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC",
      );
    });

    test("should not allow canceling an unconfigured patch", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(`/patch/${unactivatedPatchId}/configure/tasks`);
      await expect(page.getByTestId("cancel-button")).toBeHidden();
    });

    test.describe("Visiting configure page from a redirect", () => {
      test("should default to the tasks tab when there isn't one in the url", async ({
        authenticatedPage: page,
      }) => {
        await page.goto(`/patch/${unactivatedPatchId}/configure`);
        const tasksTab = page.getByTestId("tasks-tab");
        await expect(tasksTab).toHaveAttribute("aria-selected", "true");
        await expect(tasksTab).toBeVisible();
      });
    });

    test.describe("Visiting a configure page with display tasks", () => {
      test("should show display tasks if there are any", async ({
        authenticatedPage: page,
      }) => {
        await page.goto(`patch/${patchWithDisplayTasks}/configure/tasks`);
        await expect(page.getByText("display_task")).toBeVisible();
      });
    });

    test("Required tasks should be auto selected", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(`patch/${patchWithDisplayTasks}/configure/tasks`);
      await expect(page.getByTestId("task-count-badge")).toContainText("1");
      await expect(
        page.getByRole("checkbox", { name: "test-graphql" }),
      ).toBeChecked();
    });
  });

  test.describe("Switching tabs", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto(`patch/${unactivatedPatchId}/configure/tasks`);
    });

    test("Should be able to switch between tabs", async ({
      authenticatedPage: page,
    }) => {
      const changesTab = page.getByTestId("changes-tab");
      await changesTab.click();
      await expect(page).toHaveURL(
        `/patch/${unactivatedPatchId}/configure/changes`,
      );
      const parametersTab = page.getByTestId("parameters-tab");
      await parametersTab.click();
      await expect(page).toHaveURL(
        `/patch/${unactivatedPatchId}/configure/parameters`,
      );
      const tasksTab = page.getByTestId("tasks-tab");
      await tasksTab.click();
      await expect(page).toHaveURL(
        `/patch/${unactivatedPatchId}/configure/tasks`,
      );
    });

    test("Navigating away from the configure tab should disable the build variant selector", async ({
      authenticatedPage: page,
    }) => {
      await page.getByTestId("changes-tab").click();
      await expect(
        page.getByTestId("build-variant-select-wrapper"),
      ).toHaveAttribute("disabled", "");
      await expect(page.getByTestId("build-variant-select-wrapper")).toHaveCSS(
        "pointer-events",
        "none",
      );
    });
  });

  test.describe("Patch Parameters", () => {
    test.describe("Unactivated Patch", () => {
      test("Adding a parameter is reflected on the page", async ({
        authenticatedPage: page,
      }) => {
        await page.goto(`patch/${unactivatedPatchId}/configure/tasks`);
        await page.getByTestId("parameters-tab").click();
        await page.getByTestId("add-tag-button").click();
        await page.getByTestId("user-tag-key-field").fill("testKey");
        await page.getByTestId("user-tag-value-field").fill("testValue");
        await page.getByTestId("user-tag-edit-icon").click();
        await expect(page.getByTestId("user-tag-row")).toHaveCount(1);
      });
    });

    test.describe("Activated Patch", () => {
      test("Parameters cannot be added once activated", async ({
        authenticatedPage: page,
      }) => {
        await page.goto("patch/5ecedafb562343215a7ff297/configure/tasks");
        await page.getByTestId("parameters-tab").click();
        await expect(page.getByTestId("add-tag-button")).toBeHidden();
        await expect(page.getByTestId("parameters-disclaimer")).toBeVisible();
        await expect(
          page.getByTestId("badge-this-is-a-parameter"),
        ).toBeVisible();
        await expect(page.getByTestId("badge-my_team")).toBeVisible();
      });
    });
  });

  test.describe("Configuring a patch", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto(`patch/${unactivatedPatchId}/configure/tasks`);
      await expect(page.getByTestId("build-variant-list-item")).toHaveCount(11);
    });

    test("Can update patch description by typing into `Patch Name` input field", async ({
      authenticatedPage: page,
    }) => {
      const val = "michelle obama";
      await page.getByTestId("patch-name-input").clear();
      await page.getByTestId("patch-name-input").fill(val);
      await expect(page.getByTestId("patch-name-input")).toHaveValue(val);
    });

    test("Schedule button should be disabled when no tasks are selected and enabled when they are", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("schedule-patch")).toBeDisabled();
      await page
        .getByTestId("build-variant-list-item")
        .getByText("Race Detector")
        .click();
      await page.getByText("test-agent").click();
      await expect(page.getByTestId("schedule-patch")).toBeEnabled();
    });

    test("Clicking on unchecked tasks checks them and updates task counts", async ({
      authenticatedPage: page,
    }) => {
      await page
        .getByTestId("build-variant-list-item")
        .getByText("Windows")
        .click();
      const taskCountBadge = page
        .getByTestId("build-variant-list-item")
        .getByTestId("task-count-badge");
      await expect(taskCountBadge).toBeHidden();

      let count = 0;
      await expect(page.getByTestId("selected-task-disclaimer")).toContainText(
        `${count} tasks across 0 build variants`,
      );

      const taskCheckboxes = page.getByTestId("task-checkbox");
      await expect(taskCheckboxes).toHaveCount(7);

      for (const checkbox of await taskCheckboxes.all()) {
        await expect(checkbox).toHaveAttribute("aria-checked", "false");
        const label = await checkbox.getAttribute("aria-label");
        await page.getByText(label!, { exact: true }).click();
        await expect(checkbox).toHaveAttribute("aria-checked", "true");

        count += 1;
        await expect(
          page.getByTestId("selected-task-disclaimer"),
        ).toContainText(`${count} task`);
        await expect(
          page.getByTestId("selected-task-disclaimer"),
        ).toContainText("1 build variant");
        await expect(taskCountBadge).toBeVisible();
        await expect(taskCountBadge).toHaveText(count.toString());
      }
    });

    test("Clicking on checked tasks unchecks them and updates task counts", async ({
      authenticatedPage: page,
    }) => {
      await page
        .getByTestId("build-variant-list-item")
        .getByText("Windows")
        .click();
      const taskCheckboxes = page.getByTestId("task-checkbox");
      await expect(taskCheckboxes).toHaveCount(7);
      for (const checkbox of await taskCheckboxes.all()) {
        const label = await checkbox.getAttribute("aria-label");
        await page.getByText(label!, { exact: true }).click();
      }
      const taskCountBadge = page
        .getByTestId("build-variant-list-item")
        .getByTestId("task-count-badge");
      await expect(taskCountBadge).toBeVisible();
      await expect(taskCountBadge).toContainText("7");
      await expect(page.getByTestId("selected-task-disclaimer")).toContainText(
        "7 tasks across 1 build variant",
      );

      for (const checkbox of await taskCheckboxes.all()) {
        const label = await checkbox.getAttribute("aria-label");
        await page.getByText(label!, { exact: true }).click();
      }

      await expect(taskCountBadge).toBeHidden();
      await expect(page.getByTestId("selected-task-disclaimer")).toContainText(
        "0 tasks across 0 build variants",
      );
    });

    test.describe("Task filter input", () => {
      test("Updating the task filter input filters tasks in view", async ({
        authenticatedPage: page,
      }) => {
        await page.goto(`/patch/${unactivatedPatchId}/configure/tasks`);
        await page
          .getByTestId("build-variant-list-item")
          .getByText("Ubuntu 16.04", { exact: true })
          .click();
        await expect(page.getByTestId("task-checkbox")).toHaveCount(45);
        await expect(
          page.getByTestId("selected-task-disclaimer"),
        ).toContainText("0 tasks across 0 build variants");
        await page.getByTestId("task-filter-input").fill("^dist");
        await expect(page.getByTestId("task-checkbox")).toHaveCount(2);
        await page.getByText("Select all tasks in view").click();
        await expect(
          page.getByTestId("selected-task-disclaimer"),
        ).toContainText("2 tasks across 1 build variant");
      });

      test("The task filter input works across multiple build variants", async ({
        authenticatedPage: page,
      }) => {
        await page.goto(`/patch/${unactivatedPatchId}/configure/tasks`);
        await page.keyboard.down("Meta");
        await page
          .getByTestId("build-variant-list-item")
          .getByText("Ubuntu 16.04", { exact: true })
          .click();
        await page
          .getByTestId("build-variant-list-item")
          .getByText("Ubuntu 16.04 (Docker)")
          .click();
        await page.keyboard.up("Meta");
        await expect(page.getByTestId("task-checkbox")).toHaveCount(46);
        await expect(
          page.getByTestId("selected-task-disclaimer"),
        ).toContainText("0 tasks across 0 build variants");
        await page.getByTestId("task-filter-input").fill("dist");
        await expect(page.getByTestId("task-checkbox")).toHaveCount(2);
        await page.getByText("Select all tasks in view").click();
        await expect(
          page.getByTestId("selected-task-disclaimer"),
        ).toContainText("4 tasks across 2 build variants");
        await page.getByTestId("task-filter-input").clear();
      });
    });

    test.describe("Select/Deselect All checkbox", () => {
      test("Checking Select All should check/uncheck all task checkboxes", async ({
        authenticatedPage: page,
      }) => {
        const taskCheckboxes = page.getByTestId("task-checkbox");
        await expect(taskCheckboxes).toHaveCount(1);

        await clickCheckboxByLabel(page, "Select all");
        for (const checkbox of await taskCheckboxes.all()) {
          await expect(checkbox).toBeChecked();
        }

        await clickCheckboxByLabel(page, "Select all");
        for (const checkbox of await taskCheckboxes.all()) {
          await expect(checkbox).not.toBeChecked();
        }
      });

      test("Checking all task checkboxes should check the Select All checkbox", async ({
        authenticatedPage: page,
      }) => {
        const taskCheckboxes = page.getByTestId("task-checkbox");
        await expect(taskCheckboxes).toHaveCount(1);
        await expect(page.getByTestId("select-all-checkbox")).not.toBeChecked();
        for (const checkbox of await taskCheckboxes.all()) {
          const label = await checkbox.getAttribute("aria-label");
          await page.getByText(label!, { exact: true }).click();
        }
        await expect(page.getByTestId("select-all-checkbox")).toBeChecked();
      });

      test("Unchecking all task checkboxes should uncheck the Select All checkbox", async ({
        authenticatedPage: page,
      }) => {
        const taskCheckboxes = page.getByTestId("task-checkbox");
        await expect(taskCheckboxes).toHaveCount(1);
        for (const checkbox of await taskCheckboxes.all()) {
          const label = await checkbox.getAttribute("aria-label");
          await page.getByText(label!, { exact: true }).click();
          await expect(checkbox).toBeChecked();
        }
        await expect(page.getByTestId("select-all-checkbox")).toBeChecked();
        for (const checkbox of await taskCheckboxes.all()) {
          const label = await checkbox.getAttribute("aria-label");
          await page.getByText(label!, { exact: true }).click();
          await expect(checkbox).not.toBeChecked();
        }
        await expect(page.getByTestId("select-all-checkbox")).not.toBeChecked();
      });

      test("A mixture of checked and unchecked task checkboxes sets the Select All checkbox in an indeterminate state", async ({
        authenticatedPage: page,
      }) => {
        await page
          .getByTestId("build-variant-list-item")
          .getByText("RHEL 7.2 zLinux")
          .click();
        const taskCheckboxes = page.getByTestId("task-checkbox");
        await expect(taskCheckboxes).toHaveCount(6);
        const firstCheckbox = taskCheckboxes.first();
        const label = await firstCheckbox.getAttribute("aria-label");
        await page.getByText(label!, { exact: true }).click();
        await expect(page.getByTestId("select-all-checkbox")).toHaveAttribute(
          "aria-checked",
          "mixed",
        );
      });

      test("Selecting all tasks on an an indeterminate state should check all the checkboxes", async ({
        authenticatedPage: page,
      }) => {
        const taskCheckboxes = page.getByTestId("task-checkbox");
        await expect(taskCheckboxes).toHaveCount(1);

        await clickCheckboxByLabel(page, "Select all");
        for (const checkbox of await taskCheckboxes.all()) {
          await expect(checkbox).toBeChecked();
        }
        await expect(page.getByTestId("select-all-checkbox")).toBeChecked();
        await clickCheckboxByLabel(page, "Select all");
        for (const checkbox of await taskCheckboxes.all()) {
          await expect(checkbox).not.toBeChecked();
        }
      });
    });

    test.describe("Build variant selection", () => {
      test("Should be able to select and unselect an individual task and have task count be reflected in variant tab badge and task count label", async ({
        authenticatedPage: page,
      }) => {
        await page
          .getByTestId("build-variant-list-item")
          .getByText("RHEL 7.2 zLinux")
          .click();
        await clickCheckboxByLabel(page, "test-agent");
        await expect(page.getByTestId("task-count-badge")).toHaveCount(1);
        await expect(page.getByTestId("task-count-badge")).toContainText("1");

        await expect(
          page.getByTestId("selected-task-disclaimer"),
        ).toContainText("1 task across 1 build variant");
        await clickCheckboxByLabel(page, "test-agent");
        await expect(page.getByTestId("task-count-badge")).toBeHidden();
        await expect(
          page.getByTestId("selected-task-disclaimer"),
        ).toContainText("0 tasks across 0 build variants");
      });

      test("Selecting multiple build variants should display deduplicated task checkboxes", async ({
        authenticatedPage: page,
      }) => {
        await page.keyboard.down("Meta");
        await page
          .getByTestId("build-variant-list-item")
          .getByText("RHEL 7.2 zLinux")
          .click();
        await page
          .getByTestId("build-variant-list-item")
          .getByText("RHEL 7.1 POWER8")
          .click();
        await page
          .getByTestId("build-variant-list-item")
          .getByText("Race Detector")
          .click();
        await page.keyboard.up("Meta");
        await expect(
          page.getByRole("checkbox", { name: "test-agent" }),
        ).toHaveCount(1);
      });

      test("Deselecting multiple build variants should remove the associated tasks", async ({
        authenticatedPage: page,
      }) => {
        await page.keyboard.down("Meta");
        await page
          .getByTestId("build-variant-list-item")
          .getByText("Race Detector")
          .click();
        await page
          .getByTestId("build-variant-list-item")
          .getByText("RHEL 7.1 POWER8")
          .click();
        await page
          .getByTestId("build-variant-list-item")
          .getByText("RHEL 7.2 zLinux")
          .click();
        await expect(page.getByTestId("task-checkbox")).toHaveCount(8);
      });

      test("Checking a deduplicated task between multiple build variants updates the task within each selected build variant", async ({
        authenticatedPage: page,
      }) => {
        await page.keyboard.down("Meta");
        await page
          .getByTestId("build-variant-list-item")
          .getByText("RHEL 7.2 zLinux")
          .click();
        await page
          .getByTestId("build-variant-list-item")
          .getByText("RHEL 7.1 POWER8")
          .click();
        await page.keyboard.up("Meta");
        await expect(
          page.getByRole("checkbox", { name: "test-agent" }),
        ).toHaveCount(1);
        await clickCheckboxByLabel(page, "test-agent");
        const taskCountBadge = page
          .getByTestId("build-variant-select-wrapper")
          .getByTestId("task-count-badge");
        await expect(taskCountBadge.nth(0)).toContainText("1");
        await expect(taskCountBadge.nth(1)).toContainText("1");

        await page
          .getByTestId("build-variant-list-item")
          .getByText("RHEL 7.2 zLinux")
          .click();
        await expect(
          page.getByRole("checkbox", { name: "test-agent" }),
        ).toBeChecked();

        await page
          .getByTestId("build-variant-list-item")
          .getByText("RHEL 7.1 POWER8")
          .click();
        await expect(
          page.getByRole("checkbox", { name: "test-agent" }),
        ).toBeChecked();

        // Deselect the buttons and reset
        await clickCheckboxByLabel(page, "test-agent");
        await page
          .getByTestId("build-variant-list-item")
          .getByText("RHEL 7.2 zLinux")
          .click();
        await clickCheckboxByLabel(page, "test-agent");
      });

      test.describe("Selecting/deselecting all multiple buildvariants", () => {
        test("Should be able to select all tasks from multiple build variants", async ({
          authenticatedPage: page,
        }) => {
          await page
            .getByTestId("build-variant-list-item")
            .getByText("RHEL 7.2 zLinux")
            .click();

          const variant1TaskCount = await page
            .getByTestId("task-checkbox")
            .count();

          await page
            .getByTestId("build-variant-list-item")
            .getByText("RHEL 7.1 POWER8")
            .click();

          const variant2TaskCount = await page
            .getByTestId("task-checkbox")
            .count();

          await page.keyboard.down("Meta");
          await page
            .getByTestId("build-variant-list-item")
            .getByText("RHEL 7.2 zLinux")
            .click();

          await clickCheckboxByLabel(page, "Select all");
          const taskCheckboxes = page.getByTestId("task-checkbox");
          const count = await taskCheckboxes.count();
          for (let i = 0; i < count; i++) {
            await expect(taskCheckboxes.nth(i)).toBeChecked();
          }

          await expect(
            page.getByTestId("selected-task-disclaimer"),
          ).toContainText(
            `${variant1TaskCount + variant2TaskCount} tasks across 2 build variants`,
          );

          await page.keyboard.up("Meta");
        });

        test("Should be able to deselect all tasks from multiple build variants", async ({
          authenticatedPage: page,
        }) => {
          await page
            .getByTestId("build-variant-list-item")
            .getByText("RHEL 7.2 zLinux")
            .click();
          await clickCheckboxByLabel(page, "Select all");
          const taskCheckboxes = page.getByTestId("task-checkbox");
          let count = await taskCheckboxes.count();
          for (let i = 0; i < count; i++) {
            await expect(taskCheckboxes.nth(i)).toBeChecked();
          }

          await page
            .getByTestId("build-variant-list-item")
            .getByText("RHEL 7.1 POWER8")
            .click();
          await clickCheckboxByLabel(page, "Select all");

          count = await taskCheckboxes.count();
          for (let i = 0; i < count; i++) {
            await expect(taskCheckboxes.nth(i)).toBeChecked();
          }

          await page.keyboard.down("Meta");
          await page
            .getByTestId("build-variant-list-item")
            .getByText("RHEL 7.2 zLinux")
            .click();

          await clickCheckboxByLabel(page, "Select all");

          count = await taskCheckboxes.count();
          for (let i = 0; i < count; i++) {
            await expect(taskCheckboxes.nth(i)).not.toBeChecked();
          }

          await expect(
            page.getByTestId("selected-task-disclaimer"),
          ).toContainText("0 tasks across 0 build variants");
        });
      });

      test("Shift+click will select the clicked build variant along with all build variants between the clicked build variant and the first selected build variant in the list", async ({
        authenticatedPage: page,
      }) => {
        await page
          .getByTestId("build-variant-list-item")
          .getByText("RHEL 7.2 zLinux")
          .click();
        await page.keyboard.down("Shift");
        await page
          .getByTestId("build-variant-list-item")
          .getByText("Windows")
          .click();

        await expect(page.locator("[data-selected=true]")).toHaveCount(6);
      });
    });

    test.describe("Selecting a trigger alias", () => {
      test.beforeEach(async ({ authenticatedPage: page }) => {
        await page.goto(`/patch/${unactivatedPatchId}/configure/tasks`);
        await page
          .getByTestId("trigger-alias-list-item")
          .getByText("logkeeper-alias")
          .click();
      });

      test("Should show one disabled task", async ({
        authenticatedPage: page,
      }) => {
        await expect(page.getByTestId("alias-task-checkbox")).toHaveCount(1);
        await expect(page.getByTestId("alias-task-checkbox")).toBeDisabled();
        await expect(page.getByTestId("alias-task-checkbox")).not.toBeChecked();
      });

      test("Should update the 'Select all' label", async ({
        authenticatedPage: page,
      }) => {
        await expect(
          page.getByTestId("select-all-checkbox").locator("..").locator("span"),
        ).toContainText("Add alias to patch");
      });

      test("Clicking select all should update the task count and select the disabled task", async ({
        authenticatedPage: page,
      }) => {
        const taskCountBadge = page
          .getByTestId("trigger-alias-list-item")
          .getByTestId("task-count-badge");
        await expect(taskCountBadge).toBeHidden();

        await clickCheckboxByLabel(page, "Add alias to patch");

        await expect(
          page.getByTestId("selected-task-disclaimer"),
        ).toContainText("0 tasks across 0 build variants, 1 trigger alias");

        await expect(taskCountBadge).toBeVisible();
        await expect(taskCountBadge).toHaveText("1");

        await expect(page.getByTestId("alias-task-checkbox")).toBeChecked();
      });

      test("Cmd+click will select the clicked trigger alias along with the build variant and will show a checkbox for the trigger alias", async ({
        authenticatedPage: page,
      }) => {
        await page.keyboard.down("Meta");
        await page
          .getByTestId("build-variant-list-item")
          .getByText("Windows")
          .click();
        await expect(page.getByTestId("alias-checkbox")).toHaveCount(1);

        await expect(page.locator("[data-selected=true]")).toHaveCount(2);
      });

      test("Updates the badge count when the trigger alias is deselected", async ({
        authenticatedPage: page,
      }) => {
        await clickCheckboxByLabel(page, "Add alias to patch");

        const taskCountBadge = page
          .getByTestId("trigger-alias-list-item")
          .getByTestId("task-count-badge");
        await expect(taskCountBadge).toBeVisible();
        await clickCheckboxByLabel(page, "Add alias to patch");

        await expect(taskCountBadge).toBeHidden();
      });
    });
  });

  test.describe("Scheduling a patch", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto(`/patch/${unactivatedPatchId}/configure/tasks`);
    });

    test("Clicking 'Schedule' button schedules patch and redirects to patch page", async ({
      authenticatedPage: page,
    }) => {
      await mockGraphQLResponse(page, "SchedulePatch", {
        data: {
          schedulePatch: {
            id: activatedPatchId,
            description: "cypress_v10: turn on retries",
            author: "person",
            status: "created",
            activated: true,
            alias: "",
            variantsTasks: [
              {
                name: "ubuntu1604",
                tasks: ["test"],
              },
            ],
            parameters: [
              {
                key: "a",
                value: "b",
              },
            ],
            versionFull: {
              id: activatedPatchId,
            },
            tasks: ["test"],
            variants: ["ubuntu1604"],
          },
        },
        errors: null,
      });
      await page
        .getByTestId("build-variant-list-item")
        .getByText("Race Detector")
        .click();
      await page.getByText("test-agent").click();
      const scheduleButton = page.getByTestId("schedule-patch");
      await expect(scheduleButton).toBeEnabled();
      await scheduleButton.click();
      await expect(page).toHaveURL(
        `/version/${activatedPatchId}/tasks?sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC`,
      );
    });
  });
});
