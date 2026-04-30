import { Page } from "@playwright/test";
import { test, expect } from "../../fixtures";
import { clickCheckbox, selectOption } from "../../helpers";

/**
 * Helper to select page size and verify URL and table row count
 * @param page - Playwright page object
 * @param pageSize - The page size to select
 * @param dataCyTableRows - The data-cy selector for table rows
 */
const selectPageSize = async (
  page: Page,
  pageSize: number,
  dataCyTableRows: string,
) => {
  await page
    .locator("button[aria-labelledby='page-size-select']")
    .first()
    .click();
  await page.getByText(`${pageSize} / page`).first().click();
  const tableRows = page.locator(dataCyTableRows);
  const rowCount = await tableRows.count();
  expect(rowCount).toBeLessThanOrEqual(pageSize);
  await expect(page).toHaveURL(new RegExp(`limit=${pageSize}`));
};

test.describe("Host events", () => {
  const pathWithEvents = "/host/i-0f81a2d39744003dd";
  const dataCyTableRows = "[data-cy=host-events-table]";

  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => {
      window.localStorage.setItem("recentPageSize", "20");
    });
  });

  test("host events display the correct text", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(pathWithEvents);
    await selectPageSize(page, 100, dataCyTableRows);

    const hostTypes = [
      {
        hostType: "host-converted-provisioning",
        text: "Host successfully converted provisioning type",
      },
      {
        hostType: "host-dns-name-set",
        text: "DNS Name set to ec2-12-12-12-122.compute-1.amazonaws.com",
      },
      {
        hostType: "stopped",
        text: "Host stop attempt failed",
      },
      {
        hostType: "started",
        text: "Host start attempt succeeded",
      },
      {
        hostType: "provision-error",
        text: "Host encountered error during provisioning",
      },
      {
        hostType: "agent-deploy-failed",
        text: "New agent deploy failed",
      },
      {
        hostType: "created",
        text: "Host creation succeeded",
      },
      {
        hostType: "agent-monitor-deploy-failed",
        text: "New agent monitor deploy failed",
      },
      {
        hostType: "agent-monitor-deployed",
        text: "Agent monitor deployed with revision 1fa212ac4acea6ce2a0123a123456c06e8cf72ea",
      },
      {
        hostType: "agent-deployed",
        text: "Agent deployed with revision 2019-05-25 from f4c4c42abc123456d14edfe4c123bb1a1a47dd12",
        index: 1,
      },
      {
        hostType: "modified",
        text: "Host modify attempt failed",
      },
      {
        hostType: "host-jasper-restarting",
        text: "Jasper service marked as restarting by mci",
      },
      {
        hostType: "host-jasper-restarted",
        text: "Jasper service restarted with revision",
      },
      {
        hostType: "host-converting-provisioning",
        text: "Host converting provisioning type",
      },
      {
        hostType: "host-converted-provisioning",
        text: "Host successfully converted provisioning type",
      },
      {
        hostType: "host-dns-name-set",
        text: "DNS Name set to ec2-12-12-12-122.compute-1.amazonaws.com",
      },
      {
        hostType: "host-provisioned",
        text: "Marked as provisioned",
      },
      {
        hostType: "host-expiration-warning-set",
        text: "Expiration warning sent",
      },
      {
        hostType: "host-running-task-set",
        text: "Assigned to run task evergreen_ubuntu1604_test_command_patch_5e823e1f28",
      },
      {
        hostType: "host-running-task-cleared",
        text: "Current running task cleared (was: ",
      },
      {
        hostType: "host-running-task-cleared",
        text: "evergreen_ubuntu1604_test_command_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
      },
      {
        hostType: "host-task-finished",
        text: "Task evergreen_ubuntu1604_test_command_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48 completed with status: test-timed-out",
      },
    ];

    for (const { hostType, text, index } of hostTypes) {
      await expect(page.getByTestId(hostType).nth(index ?? 0)).toContainText(
        text,
      );
    }
  });

  test("host events with logs display the correct text and the logs get displayed when available", async ({
    authenticatedPage: page,
  }) => {
    const hostTypes = [
      {
        hostType: "host-script-executed",
        text: "Executed script on host",
        logsTitle: "Script logs",
      },
      {
        hostType: "host-script-execute-failed",
        text: "Failed to execute script on host",
        logsTitle: "Script logs",
      },
      {
        hostType: "host-provision-failed",
        text: "Provisioning failed",
        logsTitle: "Provisioning logs",
      },
      {
        hostType: "host-jasper-restart-error",
        text: "Host encountered error when restarting Jasper service",
        logsTitle: "Provisioning logs",
      },
      {
        hostType: "host-converting-provisioning-error",
        text: "Host encountered error when converting reprovisioning",
        logsTitle: "Provisioning logs",
      },
      {
        hostType: "host-status-changed",
        text: "Status changed from running to unreachable by chaya.malik",
        logsTitle: "Additional details",
        index: 2,
      },
      {
        hostType: "stopped",
        text: "Host stop attempt failed",
        logsTitle: "Additional details",
      },
      {
        hostType: "modified",
        text: "Host modify attempt failed",
        logsTitle: "Additional details",
      },
      {
        hostType: "host-creation-failed",
        text: "Host creation failed.",
        logsTitle: "Host creation logs",
      },
    ];
    await page.goto(pathWithEvents);
    await selectPageSize(page, 100, dataCyTableRows);

    for (const { hostType, logsTitle, text, index } of hostTypes) {
      const eventElement = page
        .getByTestId(hostType)
        .nth(index ?? 0)
        .filter({ hasText: text });
      await expect(eventElement.getByTestId("host-event-log")).toBeVisible();
      await expect(eventElement.getByTestId("host-event-log")).toContainText(
        logsTitle,
      );
    }

    await page
      .getByTestId("host-status-changed")
      .getByTestId("host-event-log")
      .click();
    const logContent = page.getByTestId("host-event-log-content").nth(8);
    await expect(logContent).toBeVisible();
    await expect(logContent).toContainText("terminated via UI by chaya.malik");
  });

  test("host events logs do not display when not available", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(pathWithEvents);
    await selectPageSize(page, 100, dataCyTableRows);
    const statusChangedElement = page
      .getByTestId("host-status-changed")
      .filter({ hasText: "Status changed from running to stopping" })
      .first();
    await expect(
      statusChangedElement.getByTestId("host-event-log"),
    ).toBeHidden();
  });

  test("host event links get displayed", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(pathWithEvents);
    await selectPageSize(page, 100, dataCyTableRows);
    const hostTypes = [
      "host-running-task-set-link",
      "host-running-task-cleared-link",
      "host-task-finished-link",
    ];
    for (const hostType of hostTypes) {
      await expect(page.getByTestId(hostType).first()).toHaveAttribute("href");
    }
  });

  test("host event pagination last page displays the right items", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/host/i-0f81a2d39744003dd?limit=10&page=2");
    await expect(page.getByTestId("host-provisioned")).toBeVisible();
  });

  test("host events are displayed in the right timezone", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/preferences");
    await expect(page.getByText("Preferences")).toBeVisible();
    await selectOption(page, "Timezone", "Hawaii");
    await page.getByRole("button", { name: "Save changes" }).click();
    await page.goto(pathWithEvents);
    await expect(
      page.getByTestId("host-events-table-row").first(),
    ).toContainText("Sep 30, 2017, 9:11:16 AM");
  });

  test.describe("host event filters", () => {
    test("can filter for specific events", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(pathWithEvents);

      // Apply filter.
      await page.getByTestId("event-type-filter").click();
      await expect(page.getByTestId("event-type-filter-wrapper")).toBeVisible();
      const agentDeployedCheckbox = page.getByRole("checkbox", {
        name: "Agent deployed",
      });
      await clickCheckbox(agentDeployedCheckbox);
      await expect(agentDeployedCheckbox).toBeChecked();
      await expect(page.getByTestId("host-events-table-row")).toHaveCount(2);
      await expect(page.getByTestId("event-type-filter")).toHaveAttribute(
        "data-highlighted",
        "true",
      );

      // Remove filter.
      await expect(page.getByTestId("event-type-filter-wrapper")).toBeVisible();
      await clickCheckbox(agentDeployedCheckbox);
      await expect(agentDeployedCheckbox).not.toBeChecked();
      await expect(page.getByTestId("host-events-table-row")).not.toHaveCount(
        2,
      );
      await expect(page.getByTestId("event-type-filter")).toHaveAttribute(
        "data-highlighted",
        "false",
      );
    });

    test("filter is properly processed from URL", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(
        `${pathWithEvents}?eventType=HOST_AGENT_DEPLOYED,HOST_AGENT_DEPLOY_FAILED`,
      );
      await expect(page.getByTestId("event-type-filter")).toHaveAttribute(
        "data-highlighted",
        "true",
      );
      await page.getByTestId("event-type-filter").click();
      await expect(
        page.getByRole("checkbox", { name: "Agent deployed" }),
      ).toHaveAttribute("aria-checked", "true");
      await expect(
        page.getByRole("checkbox", { name: "Agent deploy failed" }),
      ).toHaveAttribute("aria-checked", "true");
      await expect(page.getByTestId("host-events-table-row")).toHaveCount(3);
    });
  });
});
